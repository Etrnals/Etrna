// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC721A} from "erc721a/contracts/ERC721A.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {MerkleProof} from "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import {ERC2981, IERC2981} from "@openzeppelin/contracts/token/common/ERC2981.sol";

interface ISpeciesRegistry {
    struct SpeciesInfo {
        string name;
        uint256 maxSupply;
        string baseURI;
        string utility;
    }

    function speciesCount() external view returns (uint256);
    function getSpecies(uint8 speciesId) external view returns (SpeciesInfo memory info);
    function remainingSupply(uint8 speciesId) external view returns (uint256);
    function consumeSupply(uint8 speciesId, uint256 quantity) external;
    function stakingMultipliers(uint8 speciesId)
        external
        view
        returns (uint16 vibeMultiplier, uint16 etrMultiplier, uint16 legendaryBonus);
}

contract Etrnals721A is ERC721A, ERC2981, Ownable, ReentrancyGuard {
    using Strings for uint256;

    uint256 public constant MAX_SUPPLY = 9999;
    uint256 public constant SPECIES_COUNT = 9;
    uint256 public immutable mintPrice;

    ISpeciesRegistry public immutable speciesRegistry;
    bytes32 public allowlistRoot;
    bool public publicMintActive;
    bool public allowlistMintActive;
    bool public blueChipMintActive;

    mapping(address => bool) public allowedCollections;
    mapping(address => uint256) public mintedByWallet;
    mapping(uint256 => TokenInfo) public tokenInfo;

    struct TokenInfo {
        uint8 speciesId;
        bool legendary;
        bytes32 traitHash;
    }

    event PublicMint(address indexed minter, uint256 quantity, uint8 speciesId);
    event AllowlistMint(address indexed minter, uint256 quantity, uint8 speciesId);
    event BlueChipCollectionUpdated(address indexed collection, bool allowed);
    event AllowlistRootUpdated(bytes32 newRoot);
    event BaseRoyaltyUpdated(address indexed receiver, uint96 feeNumerator);

    constructor(
        string memory name_,
        string memory symbol_,
        uint256 mintPrice_,
        address royaltyReceiver,
        uint96 royaltyFeeNumerator,
        address speciesRegistry_
    ) ERC721A(name_, symbol_) {
        require(mintPrice_ > 0, "Price required");
        require(speciesRegistry_ != address(0), "Registry required");

        mintPrice = mintPrice_;
        speciesRegistry = ISpeciesRegistry(speciesRegistry_);
        _setDefaultRoyalty(royaltyReceiver, royaltyFeeNumerator);
    }

    modifier validSpecies(uint8 speciesId) {
        require(speciesId < SPECIES_COUNT, "Invalid species");
        _;
    }

    function setAllowlistRoot(bytes32 newRoot) external onlyOwner {
        allowlistRoot = newRoot;
        emit AllowlistRootUpdated(newRoot);
    }

    function setMintStates(bool allowlistState, bool publicState, bool blueChipState) external onlyOwner {
        allowlistMintActive = allowlistState;
        publicMintActive = publicState;
        blueChipMintActive = blueChipState;
    }

    function setBlueChipCollection(address collection, bool allowed) external onlyOwner {
        allowedCollections[collection] = allowed;
        emit BlueChipCollectionUpdated(collection, allowed);
    }

    function setDefaultRoyalty(address receiver, uint96 feeNumerator) external onlyOwner {
        _setDefaultRoyalty(receiver, feeNumerator);
        emit BaseRoyaltyUpdated(receiver, feeNumerator);
    }

    function allowlistMint(uint8 speciesId, uint256 quantity, bytes32[] calldata proof)
        external
        payable
        nonReentrant
        validSpecies(speciesId)
    {
        require(allowlistMintActive, "Allowlist closed");
        _verifyAllowlist(msg.sender, proof);
        _mintInternal(speciesId, quantity, false);
    }

    function mint(uint8 speciesId, uint256 quantity) external payable nonReentrant validSpecies(speciesId) {
        require(publicMintActive, "Public mint closed");
        _mintInternal(speciesId, quantity, false);
    }

    function blueChipMint(uint8 speciesId, uint256 quantity, address collection)
        external
        payable
        nonReentrant
        validSpecies(speciesId)
    {
        require(blueChipMintActive, "Blue-chip mint closed");
        require(allowedCollections[collection], "Collection not allowed");
        require(IERC721(collection).balanceOf(msg.sender) > 0, "No qualifying NFT");
        _mintInternal(speciesId, quantity, false);
    }

    function airdrop(address to, uint8 speciesId, uint256 quantity, bool legendary)
        external
        onlyOwner
        validSpecies(speciesId)
    {
        _batchMint(to, speciesId, quantity, legendary);
    }

    function lockLegendary(uint256 tokenId) external onlyOwner {
        tokenInfo[tokenId].legendary = true;
    }

    function _mintInternal(uint8 speciesId, uint256 quantity, bool legendary) internal {
        require(quantity > 0, "Quantity required");
        require(totalSupply() + quantity <= MAX_SUPPLY, "Exceeds supply");
        require(msg.value == mintPrice * quantity, "Incorrect payment");

        speciesRegistry.consumeSupply(speciesId, quantity);
        mintedByWallet[msg.sender] += quantity;
        _batchMint(msg.sender, speciesId, quantity, legendary);
    }

    function _batchMint(address to, uint8 speciesId, uint256 quantity, bool legendary) internal {
        uint256 startId = _nextTokenId();
        for (uint256 i = 0; i < quantity; i++) {
            tokenInfo[startId + i] = TokenInfo({
                speciesId: speciesId,
                legendary: legendary,
                traitHash: _traitSeed(to, startId + i)
            });
        }
        _safeMint(to, quantity);
        emit PublicMint(to, quantity, speciesId);
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "Nonexistent token");
        TokenInfo memory info = tokenInfo[tokenId];
        ISpeciesRegistry.SpeciesInfo memory species = speciesRegistry.getSpecies(info.speciesId);
        string memory base = species.baseURI;
        return string(abi.encodePacked(base, tokenId.toString(), ".json"));
    }

    function royaltyInfo(uint256 tokenId, uint256 salePrice)
        public
        view
        override(ERC2981, IERC2981)
        returns (address, uint256)
    {
        return super.royaltyInfo(tokenId, salePrice);
    }

    function _verifyAllowlist(address account, bytes32[] calldata proof) internal view {
        require(allowlistRoot != bytes32(0), "Allowlist not set");
        bytes32 leaf = keccak256(abi.encodePacked(account));
        require(MerkleProof.verify(proof, allowlistRoot, leaf), "Not allowlisted");
    }

    function _traitSeed(address minter, uint256 tokenId) internal view returns (bytes32) {
        return keccak256(abi.encodePacked(blockhash(block.number - 1), minter, tokenId));
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721A, ERC2981) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
