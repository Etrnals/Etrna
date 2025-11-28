// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./MusicNFT.sol";

contract MusicDistributor is Ownable {
    event Uploaded(
        uint256 indexed uefId,
        address indexed artist,
        string uri,
        uint256 tokenId,
        bool mintedOnChain
    );

    IERC20 public immutable paymentToken;
    MusicNFT public immutable musicNft;
    uint256 public uploadFee;

    constructor(IERC20 _paymentToken, MusicNFT _musicNft, uint256 _uploadFee) {
        paymentToken = _paymentToken;
        musicNft = _musicNft;
        uploadFee = _uploadFee;
    }

    function setUploadFee(uint256 fee) external onlyOwner {
        uploadFee = fee;
    }

    function uploadAndMint(
        uint256 uefId,
        string calldata uri,
        bool mintOnChain
    ) external {
        require(paymentToken.transferFrom(msg.sender, address(this), uploadFee), "PAY_FAIL");

        uint256 tokenId = 0;
        if (mintOnChain) {
            tokenId = musicNft.mintToArtist(msg.sender, uri, uefId);
        }

        emit Uploaded(uefId, msg.sender, uri, tokenId, mintOnChain);
    }

    function withdraw(address to, uint256 amount) external onlyOwner {
        require(paymentToken.transfer(to, amount), "WITHDRAW_FAIL");
    }
}
