// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ERC2981, IERC2981} from "@openzeppelin/contracts/token/common/ERC2981.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

/// @title EtrnaPass721 - OpenSea-minted access pass for the Etrna ecosystem
/// @notice Minting is restricted to an OpenSea conduit/minter address to reflect primary distribution
contract EtrnaPass721 is ERC721, ERC2981, Ownable {
    using Strings for uint256;

    struct Entitlement {
        bool etrnalsMintAccess;
        bool walletPerkEnabled;
        uint16 walletMultiplierBps;
        uint16 vibeCheckBoostBps;
    }

    uint256 public immutable maxSupply;
    uint256 private _supply;
    address public openSeaMinter;
    address public entitlementEngine;
    string private _baseTokenURI;

    event OpenSeaMinterUpdated(address indexed minter);
    event EntitlementEngineUpdated(address indexed engine);
    event BaseUriUpdated(string newBaseUri);
    event PassMinted(address indexed to, uint256 quantity, string source);

    modifier onlyOpenSeaMinter() {
        require(msg.sender == openSeaMinter, "Mint only via OpenSea");
        _;
    }

    constructor(
        string memory name_,
        string memory symbol_,
        string memory baseTokenURI_,
        address royaltyReceiver,
        uint96 royaltyFeeNumerator,
        address openSeaMinter_,
        uint256 maxSupply_
    ) ERC721(name_, symbol_) {
        require(openSeaMinter_ != address(0), "OpenSea minter required");
        require(maxSupply_ > 0, "Max supply required");

        _baseTokenURI = baseTokenURI_;
        openSeaMinter = openSeaMinter_;
        maxSupply = maxSupply_;
        _setDefaultRoyalty(royaltyReceiver, royaltyFeeNumerator);
    }

    function setOpenSeaMinter(address minter) external onlyOwner {
        require(minter != address(0), "Invalid minter");
        openSeaMinter = minter;
        emit OpenSeaMinterUpdated(minter);
    }

    function setEntitlementEngine(address engine) external onlyOwner {
        entitlementEngine = engine;
        emit EntitlementEngineUpdated(engine);
    }

    function setBaseURI(string calldata newBase) external onlyOwner {
        _baseTokenURI = newBase;
        emit BaseUriUpdated(newBase);
    }

    function mintFromOpenSea(address to, uint256 quantity) external onlyOpenSeaMinter {
        _mintBatch(to, quantity, "opensea");
    }

    function airdrop(address to, uint256 quantity) external onlyOwner {
        _mintBatch(to, quantity, "airdrop");
    }

    function entitlementSnapshot(address account) external view returns (Entitlement memory snapshot) {
        uint256 balance = balanceOf(account);
        if (balance > 0) {
            snapshot = Entitlement({
                etrnalsMintAccess: true,
                walletPerkEnabled: true,
                walletMultiplierBps: 12000, // 1.2x multipliers for wallet rewards
                vibeCheckBoostBps: 1500 // 15% boost inside VibeCheck
            });
        }
    }

    function totalSupply() external view returns (uint256) {
        return _supply;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "Nonexistent token");
        return string(abi.encodePacked(_baseURI(), tokenId.toString(), ".json"));
    }

    function _mintBatch(address to, uint256 quantity, string memory source) internal {
        require(quantity > 0, "Quantity required");
        require(_supply + quantity <= maxSupply, "Exceeds pass supply");

        for (uint256 i = 0; i < quantity; i++) {
            _safeMint(to, _supply + i);
        }
        _supply += quantity;
        emit PassMinted(to, quantity, source);
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC2981)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
