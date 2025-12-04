// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {UEFVaultNFT} from "./UEFVaultNFT.sol";

/// @title UEFRegistry
/// @notice Coordinates document fingerprint registration and NFT minting
contract UEFRegistry is Ownable {
    enum StorageProvider {
        IPFS,
        S3
    }

    struct Record {
        address owner;
        bytes32 fingerprint;
        uint256 tokenId;
        string storageURI;
        StorageProvider provider;
        bool transferable;
    }

    mapping(bytes32 => Record) public records;
    mapping(uint256 => bytes32) public fingerprintByToken;
    UEFVaultNFT public vault;
    address public rewardsEngine;

    event VaultUpdated(address indexed vault);
    event RewardsEngineUpdated(address indexed engine);
    event DocumentRegistered(bytes32 indexed fingerprint, address indexed owner, uint256 indexed tokenId);

    error FingerprintExists();

    constructor(address vault_) {
        vault = UEFVaultNFT(vault_);
    }

    function setVault(address vault_) external onlyOwner {
        vault = UEFVaultNFT(vault_);
        emit VaultUpdated(vault_);
    }

    function setRewardsEngine(address engine) external onlyOwner {
        rewardsEngine = engine;
        emit RewardsEngineUpdated(engine);
    }

    function registerDocument(
        address owner_,
        bytes32 fingerprint,
        string calldata storageURI,
        StorageProvider provider,
        bool transferable
    ) external returns (uint256 tokenId) {
        if (records[fingerprint].owner != address(0)) revert FingerprintExists();

        tokenId = vault.mintUEF(
            owner_,
            fingerprint,
            storageURI,
            _providerToString(provider),
            transferable
        );

        records[fingerprint] = Record({
            owner: owner_,
            fingerprint: fingerprint,
            tokenId: tokenId,
            storageURI: storageURI,
            provider: provider,
            transferable: transferable
        });
        fingerprintByToken[tokenId] = fingerprint;

        emit DocumentRegistered(fingerprint, owner_, tokenId);
    }

    function resolveByFingerprint(bytes32 fingerprint) external view returns (Record memory) {
        return records[fingerprint];
    }

    function resolveByToken(uint256 tokenId) external view returns (Record memory) {
        bytes32 fingerprint = fingerprintByToken[tokenId];
        return records[fingerprint];
    }

    function _providerToString(StorageProvider provider) internal pure returns (string memory) {
        return provider == StorageProvider.IPFS ? "ipfs" : "s3";
    }
}
