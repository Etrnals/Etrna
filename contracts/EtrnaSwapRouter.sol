// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/// @title EtrnaSwapRouter
/// @notice Simplified multi-DEX router abstraction for demos. Emits intents consumed off-chain.
contract EtrnaSwapRouter is Ownable {
    struct SwapIntent {
        address user;
        address tokenIn;
        address tokenOut;
        uint256 amountIn;
        uint256 minAmountOut;
        uint256 targetChainId;
    }

    event SwapPlanned(uint256 indexed id, address indexed user, address tokenIn, address tokenOut, uint256 amountIn, uint256 minAmountOut, uint256 targetChainId);
    event SwapSettled(uint256 indexed id, address indexed filler, uint256 amountOut);

    uint256 private _nextId = 1;
    mapping(uint256 => SwapIntent) public swaps;

    constructor(address initialOwner) Ownable(initialOwner) {}

    function planSwap(address tokenIn, address tokenOut, uint256 amountIn, uint256 minAmountOut, uint256 targetChainId) external returns (uint256) {
        require(amountIn > 0, "ZERO_IN");
        IERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn);
        uint256 id = _nextId++;
        swaps[id] = SwapIntent(msg.sender, tokenIn, tokenOut, amountIn, minAmountOut, targetChainId);
        emit SwapPlanned(id, msg.sender, tokenIn, tokenOut, amountIn, minAmountOut, targetChainId);
        return id;
    }

    function settleSwap(uint256 id, uint256 amountOut, address filler) external onlyOwner {
        SwapIntent memory intent = swaps[id];
        require(intent.user != address(0), "UNKNOWN");
        delete swaps[id];
        IERC20(intent.tokenOut).transfer(intent.user, amountOut);
        emit SwapSettled(id, filler, amountOut);
    }
}
