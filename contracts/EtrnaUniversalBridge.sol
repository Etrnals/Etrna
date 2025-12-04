// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/// @title EtrnaUniversalBridge
/// @notice Minimal bridging coordinator for EtrnaWallet to emit intents and custody funds prior to relay.
contract EtrnaUniversalBridge is Ownable {
    enum AssetType {
        Native,
        ERC20
    }

    struct BridgeRequest {
        address user;
        AssetType assetType;
        address token;
        uint256 amount;
        uint256 targetChainId;
        address targetAddress;
        bytes metadata;
    }

    event BridgeInitiated(uint256 indexed id, address indexed user, AssetType assetType, address token, uint256 amount, uint256 targetChainId, address targetAddress, bytes metadata);
    event BridgeCompleted(uint256 indexed id, address indexed user, AssetType assetType, address token, uint256 amount, uint256 sourceChainId, address sourceAddress, bytes metadata);

    uint256 private _nextId = 1;
    mapping(uint256 => BridgeRequest) public requests;

    constructor(address initialOwner) Ownable(initialOwner) {}

    function bridgeNative(uint256 targetChainId, address targetAddress, bytes calldata metadata) external payable returns (uint256) {
        require(msg.value > 0, "NO_VALUE");
        uint256 id = _nextId++;
        requests[id] = BridgeRequest(msg.sender, AssetType.Native, address(0), msg.value, targetChainId, targetAddress, metadata);
        emit BridgeInitiated(id, msg.sender, AssetType.Native, address(0), msg.value, targetChainId, targetAddress, metadata);
        return id;
    }

    function bridgeToken(address token, uint256 amount, uint256 targetChainId, address targetAddress, bytes calldata metadata) external returns (uint256) {
        require(amount > 0, "NO_AMOUNT");
        IERC20(token).transferFrom(msg.sender, address(this), amount);
        uint256 id = _nextId++;
        requests[id] = BridgeRequest(msg.sender, AssetType.ERC20, token, amount, targetChainId, targetAddress, metadata);
        emit BridgeInitiated(id, msg.sender, AssetType.ERC20, token, amount, targetChainId, targetAddress, metadata);
        return id;
    }

    function complete(uint256 id, address to) external onlyOwner {
        BridgeRequest memory request = requests[id];
        require(request.user != address(0), "UNKNOWN");
        delete requests[id];
        if (request.assetType == AssetType.Native) {
            (bool ok, ) = to.call{value: request.amount}("");
            require(ok, "NATIVE_FAIL");
        } else {
            IERC20(request.token).transfer(to, request.amount);
        }
        emit BridgeCompleted(id, request.user, request.assetType, request.token, request.amount, block.chainid, to, request.metadata);
    }
}
