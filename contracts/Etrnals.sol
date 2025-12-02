// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC721Enumerable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {MerkleProof} from "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

contract Etrnals is ERC721Enumerable, Ownable, ReentrancyGuard {
    uint256 public immutable maxSupply;
    uint256 public immutable maxPerWallet;
    uint256 public immutable mintPrice;

    bytes32 public allowlistRoot;
    bool public allowlistActive;
    bool public publicMintActive;
    bool public metadataLocked;

    string private _baseTokenURI;
    address public treasury;

    mapping(address => uint256) public mintedByWallet;

    event AllowlistMinted(address indexed minter, uint256 quantity, uint256 paid);
    event PublicMinted(address indexed minter, uint256 quantity, uint256 paid);
    event TreasuryUpdated(address indexed newTreasury);
    event BaseURIUpdated(string newBaseURI);
    event MetadataLocked();

    constructor(
        string memory name_,
        string memory symbol_,
        uint256 maxSupply_,
        uint256 maxPerWallet_,
        uint256 mintPrice_,
        string memory baseURI_,
        address treasury_
    ) ERC721(name_, symbol_) {
        require(maxSupply_ > 0, "Max supply must be positive");
        require(maxPerWallet_ > 0, "Max per wallet must be positive");
        require(mintPrice_ > 0, "Mint price must be positive");
        require(treasury_ != address(0), "Treasury required");

        maxSupply = maxSupply_;
        maxPerWallet = maxPerWallet_;
        mintPrice = mintPrice_;
        _baseTokenURI = baseURI_;
        treasury = treasury_;
    }

    modifier onlyTreasury() {
        require(msg.sender == treasury || msg.sender == owner(), "Not authorized");
        _;
    }

    function setAllowlistRoot(bytes32 root) external onlyOwner {
        allowlistRoot = root;
    }

    function toggleAllowlist(bool active) external onlyOwner {
        allowlistActive = active;
    }

    function togglePublicMint(bool active) external onlyOwner {
        publicMintActive = active;
    }

    function setBaseURI(string calldata newBaseURI) external onlyOwner {
        require(!metadataLocked, "Metadata locked");
        _baseTokenURI = newBaseURI;
        emit BaseURIUpdated(newBaseURI);
    }

    function lockMetadata() external onlyOwner {
        metadataLocked = true;
        emit MetadataLocked();
    }

    function setTreasury(address newTreasury) external onlyOwner {
        require(newTreasury != address(0), "Treasury required");
        treasury = newTreasury;
        emit TreasuryUpdated(newTreasury);
    }

    function allowlistMint(uint256 quantity, bytes32[] calldata proof) external payable nonReentrant {
        require(allowlistActive, "Allowlist closed");
        _verifyAllowlist(msg.sender, proof);
        _mintTokens(msg.sender, quantity, true);
    }

    function publicMint(uint256 quantity) external payable nonReentrant {
        require(publicMintActive, "Public mint closed");
        _mintTokens(msg.sender, quantity, false);
    }

    function airdrop(address to, uint256 quantity) external onlyOwner {
        require(totalSupply() + quantity <= maxSupply, "Exceeds supply");
        for (uint256 i = 0; i < quantity; i++) {
            _safeMint(to, totalSupply() + 1);
        }
    }

    function withdraw() external onlyTreasury {
        uint256 balance = address(this).balance;
        require(balance > 0, "Nothing to withdraw");
        (bool success, ) = treasury.call{value: balance}("");
        require(success, "Withdraw failed");
    }

    function baseTokenURI() external view returns (string memory) {
        return _baseTokenURI;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "Nonexistent token");
        return string(abi.encodePacked(_baseTokenURI, Strings.toString(tokenId)));
    }

    function _mintTokens(address to, uint256 quantity, bool isAllowlist) internal {
        require(quantity > 0, "Quantity required");
        require(totalSupply() + quantity <= maxSupply, "Exceeds supply");

        if (!isAllowlist) {
            require(publicMintActive, "Public mint closed");
        }

        uint256 newMinted = mintedByWallet[to] + quantity;
        require(newMinted <= maxPerWallet, "Wallet limit reached");

        uint256 requiredValue = mintPrice * quantity;
        require(msg.value == requiredValue, "Incorrect payment");

        mintedByWallet[to] = newMinted;

        for (uint256 i = 0; i < quantity; i++) {
            _safeMint(to, totalSupply() + 1);
        }

        if (isAllowlist) {
            emit AllowlistMinted(to, quantity, msg.value);
        } else {
            emit PublicMinted(to, quantity, msg.value);
        }
    }

    function _verifyAllowlist(address account, bytes32[] calldata proof) internal view {
        require(allowlistRoot != bytes32(0), "Allowlist root missing");
        bytes32 leaf = keccak256(abi.encodePacked(account));
        require(MerkleProof.verify(proof, allowlistRoot, leaf), "Not on allowlist");
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }
}
