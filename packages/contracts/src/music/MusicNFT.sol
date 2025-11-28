// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MusicNFT is ERC721URIStorage, Ownable {
    event Minted(uint256 indexed tokenId, address indexed artist, string uri, uint256 uefId);

    uint256 public nextTokenId;
    mapping(uint256 => uint256) public tokenToUEF; // tokenId => uefId

    constructor() ERC721("EtrnaMusic", "EMUSIC") {}

    function mintToArtist(
        address artist,
        string calldata tokenUri,
        uint256 uefId
    ) external onlyOwner returns (uint256) {
        uint256 id = ++nextTokenId;
        _safeMint(artist, id);
        _setTokenURI(id, tokenUri);
        tokenToUEF[id] = uefId;
        emit Minted(id, artist, tokenUri, uefId);
        return id;
    }
}
