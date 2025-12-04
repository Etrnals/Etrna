// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

interface IEtrnalsCollection is IERC721 {
    function tokenInfo(uint256 tokenId)
        external
        view
        returns (uint8 speciesId, bool legendary, bytes32 traitHash);
}

interface ISpeciesRegistryMultipliers {
    function stakingMultipliers(uint8 speciesId)
        external
        view
        returns (uint16 vibeMultiplier, uint16 etrMultiplier, uint16 legendaryBonus);
}

contract EtrnalsStaking is Ownable, ReentrancyGuard {
    struct StakeInfo {
        address owner;
        uint64 stakedAt;
    }

    IEtrnalsCollection public immutable etrnals;
    ISpeciesRegistryMultipliers public immutable registry;
    uint256 public baseRatePerSecond = 1 ether; // abstract reward unit

    mapping(uint256 => StakeInfo) public stakes;

    event Staked(address indexed user, uint256 indexed tokenId);
    event Unstaked(address indexed user, uint256 indexed tokenId, uint256 reward);
    event Claimed(address indexed user, uint256 reward);
    event BaseRateUpdated(uint256 newRate);

    receive() external payable {}

    constructor(address etrnals_, address registry_) {
        require(etrnals_ != address(0) && registry_ != address(0), "Zero address");
        etrnals = IEtrnalsCollection(etrnals_);
        registry = ISpeciesRegistryMultipliers(registry_);
    }

    function setBaseRate(uint256 newRate) external onlyOwner {
        require(newRate > 0, "Rate required");
        baseRatePerSecond = newRate;
        emit BaseRateUpdated(newRate);
    }

    function stake(uint256[] calldata tokenIds) external nonReentrant {
        for (uint256 i = 0; i < tokenIds.length; i++) {
            _stakeToken(tokenIds[i]);
        }
    }

    function unstake(uint256[] calldata tokenIds) external nonReentrant {
        uint256 totalReward;
        for (uint256 i = 0; i < tokenIds.length; i++) {
            totalReward += _unstakeToken(tokenIds[i]);
        }
        if (totalReward > 0) {
            payable(msg.sender).transfer(totalReward);
        }
        emit Claimed(msg.sender, totalReward);
    }

    function pendingRewards(address user, uint256[] calldata tokenIds) external view returns (uint256 total) {
        for (uint256 i = 0; i < tokenIds.length; i++) {
            StakeInfo memory info = stakes[tokenIds[i]];
            if (info.owner == user) {
                total += _calculateReward(tokenIds[i], info.stakedAt, block.timestamp);
            }
        }
    }

    function _stakeToken(uint256 tokenId) internal {
        require(etrnals.ownerOf(tokenId) == msg.sender, "Not owner");
        etrnals.transferFrom(msg.sender, address(this), tokenId);
        stakes[tokenId] = StakeInfo({owner: msg.sender, stakedAt: uint64(block.timestamp)});
        emit Staked(msg.sender, tokenId);
    }

    function _unstakeToken(uint256 tokenId) internal returns (uint256 reward) {
        StakeInfo memory info = stakes[tokenId];
        require(info.owner == msg.sender, "Not staker");
        reward = _calculateReward(tokenId, info.stakedAt, block.timestamp);
        delete stakes[tokenId];
        etrnals.transferFrom(address(this), msg.sender, tokenId);
        emit Unstaked(msg.sender, tokenId, reward);
    }

    function _calculateReward(uint256 tokenId, uint64 fromTime, uint256 toTime) internal view returns (uint256) {
        if (fromTime == 0) return 0;
        (uint8 speciesId, bool legendary, ) = etrnals.tokenInfo(tokenId);
        (uint16 vibeMultiplier, uint16 etrMultiplier, uint16 legendaryBonus) = registry.stakingMultipliers(speciesId);
        uint256 multiplier = uint256(vibeMultiplier + etrMultiplier);
        if (legendary) {
            multiplier += legendaryBonus;
        }
        uint256 duration = toTime - uint256(fromTime);
        return (duration * baseRatePerSecond * multiplier) / 10000;
    }
}
