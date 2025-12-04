// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC2981} from "@openzeppelin/contracts/token/common/ERC2981.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

interface IRewardsEngine {
    function notifyUEFMint(address owner, uint256 tokenId, bytes32 fingerprint) external;
}

/// @title UEFVaultNFT
/// @notice NFT that can be soulbound or transferable, representing encrypted documents
contract UEFVaultNFT is ERC721, ERC2981, Ownable {
    using Strings for uint256;

    struct UEFMetadata {
        bytes32 fingerprint;
        string storageURI;
        string storageProvider;
        bool transferable;
    }

    string private _baseTokenURI;
    address public registry;
    uint256 private _supply;
    mapping(uint256 => UEFMetadata) public metadataById;
    IRewardsEngine public rewardsEngine;

    event RegistryUpdated(address indexed registry);
    event BaseUriUpdated(string newBaseUri);
    event RewardsEngineUpdated(address indexed engine);

    modifier onlyRegistry() {
        require(msg.sender == registry, "Registry only");
        _;
    }

    constructor(
        string memory name_,
        string memory symbol_,
        string memory baseTokenURI_,
        address registry_,
        address royaltyReceiver,
        uint96 royaltyFeeNumerator
    ) ERC721(name_, symbol_) {
        require(registry_ != address(0), "Registry required");
        registry = registry_;
        _baseTokenURI = baseTokenURI_;
        _setDefaultRoyalty(royaltyReceiver, royaltyFeeNumerator);
    }

    function setRegistry(address registry_) external onlyOwner {
        require(registry_ != address(0), "Invalid registry");
        registry = registry_;
        emit RegistryUpdated(registry_);
    }

    function setRewardsEngine(address engine) external onlyOwner {
        rewardsEngine = IRewardsEngine(engine);
        emit RewardsEngineUpdated(engine);
    }

    function setBaseURI(string calldata newBase) external onlyOwner {
        _baseTokenURI = newBase;
        emit BaseUriUpdated(newBase);
    }

    function mintUEF(
        address to,
        bytes32 fingerprint,
        string calldata storageURI,
        string calldata storageProvider,
        bool transferable
    ) external onlyRegistry returns (uint256 tokenId) {
        tokenId = ++_supply;
        _safeMint(to, tokenId);
        metadataById[tokenId] = UEFMetadata({
            fingerprint: fingerprint,
            storageURI: storageURI,
            storageProvider: storageProvider,
            transferable: transferable
        });

        if (address(rewardsEngine) != address(0)) {
            rewardsEngine.notifyUEFMint(to, tokenId, fingerprint);
        }
    }

    function isSoulbound(uint256 tokenId) public view returns (bool) {
        require(_exists(tokenId), "Invalid token");
        return !metadataById[tokenId].transferable;
    }

    function totalSupply() external view returns (uint256) {
        return _supply;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "Invalid token");
        return string(abi.encodePacked(_baseURI(), tokenId.toString(), ".json"));
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
        if (from != address(0) && to != address(0)) {
            require(metadataById[tokenId].transferable, "Soulbound");
        }
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC2981)
        returns (bool)
    {
        return ERC721.supportsInterface(interfaceId) || ERC2981.supportsInterface(interfaceId);
    }
}
