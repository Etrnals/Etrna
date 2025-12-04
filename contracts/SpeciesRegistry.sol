// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract SpeciesRegistry is Ownable {
    struct SpeciesInfo {
        string name;
        uint256 maxSupply;
        string baseURI;
        string utility;
    }

    struct MultiplierConfig {
        uint16 vibeMultiplier; // basis points multiplier, e.g., 12500 = 1.25x
        uint16 etrMultiplier; // basis points multiplier
        uint16 legendaryBonus; // bonus basis points added for legendary tokens
    }

    uint8 public immutable speciesCount;

    mapping(uint8 => SpeciesInfo) private _species;
    mapping(uint8 => uint256) public mintedBySpecies;
    mapping(uint8 => MultiplierConfig) private _multipliers;
    mapping(address => bool) public minters;

    event SpeciesRegistered(uint8 indexed speciesId, SpeciesInfo info);
    event SpeciesUpdated(uint8 indexed speciesId, SpeciesInfo info);
    event MultipliersUpdated(uint8 indexed speciesId, MultiplierConfig config);
    event SupplyConsumed(uint8 indexed speciesId, uint256 quantity, uint256 remaining);
    event MinterUpdated(address indexed minter, bool allowed);

    constructor(uint8 speciesCount_, SpeciesInfo[] memory initialSpecies, MultiplierConfig[] memory initialMultipliers) {
        require(speciesCount_ == initialSpecies.length && speciesCount_ == initialMultipliers.length, "Invalid init length");
        speciesCount = speciesCount_;

        for (uint8 i = 0; i < speciesCount_; i++) {
            _species[i] = initialSpecies[i];
            _multipliers[i] = initialMultipliers[i];
            emit SpeciesRegistered(i, initialSpecies[i]);
        }
    }

    function getSpecies(uint8 speciesId) external view returns (SpeciesInfo memory info) {
        _validateSpecies(speciesId);
        info = _species[speciesId];
    }

    function remainingSupply(uint8 speciesId) public view returns (uint256) {
        _validateSpecies(speciesId);
        return _species[speciesId].maxSupply - mintedBySpecies[speciesId];
    }

    function setMinter(address minter, bool allowed) external onlyOwner {
        minters[minter] = allowed;
        emit MinterUpdated(minter, allowed);
    }

    function consumeSupply(uint8 speciesId, uint256 quantity) external {
        require(minters[msg.sender] || msg.sender == owner(), "Not authorized");
        _consumeSupply(speciesId, quantity);
    }

    function stakingMultipliers(uint8 speciesId)
        external
        view
        returns (uint16 vibeMultiplier, uint16 etrMultiplier, uint16 legendaryBonus)
    {
        _validateSpecies(speciesId);
        MultiplierConfig memory config = _multipliers[speciesId];
        return (config.vibeMultiplier, config.etrMultiplier, config.legendaryBonus);
    }

    function updateSpecies(uint8 speciesId, SpeciesInfo calldata info) external onlyOwner {
        _validateSpecies(speciesId);
        _species[speciesId] = info;
        emit SpeciesUpdated(speciesId, info);
    }

    function updateMultipliers(uint8 speciesId, MultiplierConfig calldata config) external onlyOwner {
        _validateSpecies(speciesId);
        _multipliers[speciesId] = config;
        emit MultipliersUpdated(speciesId, config);
    }

    function _consumeSupply(uint8 speciesId, uint256 quantity) internal {
        _validateSpecies(speciesId);
        require(quantity > 0, "Quantity required");
        uint256 newMinted = mintedBySpecies[speciesId] + quantity;
        require(newMinted <= _species[speciesId].maxSupply, "Species sold out");
        mintedBySpecies[speciesId] = newMinted;
        emit SupplyConsumed(speciesId, quantity, remainingSupply(speciesId));
    }

    function _validateSpecies(uint8 speciesId) internal view {
        require(speciesId < speciesCount, "Invalid species");
    }
}
