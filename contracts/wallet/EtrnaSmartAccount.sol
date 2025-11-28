// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/SignatureChecker.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

contract EtrnaSmartAccount {
    using EnumerableSet for EnumerableSet.AddressSet;

    address public immutable entryPoint;
    address public owner;

    EnumerableSet.AddressSet private sessionKeys;
    mapping(address => uint256) public appSpendingLimit;
    mapping(address => uint256) public appSpent;

    event Executed(address indexed dest, uint256 value, bytes data);
    event SessionKeyAdded(address indexed key);
    event SessionKeyRemoved(address indexed key);
    event SpendingLimitSet(address indexed dapp, uint256 limit);

    modifier onlyEntryPoint() {
        require(msg.sender == entryPoint, "Only entry point");
        _;
    }

    modifier onlyOwnerOrSession() {
        require(msg.sender == owner || sessionKeys.contains(msg.sender), "Not authorized");
        _;
    }

    constructor(address _owner, address _entryPoint) {
        owner = _owner;
        entryPoint = _entryPoint;
    }

    function execute(address dest, uint256 value, bytes calldata func) external onlyOwnerOrSession {
        if (msg.sender != owner) {
            require(appSpent[dest] + value <= appSpendingLimit[dest], "Limit exceeded");
            appSpent[dest] += value;
        }
        (bool success, ) = dest.call{value: value}(func);
        require(success, "Call failed");
        emit Executed(dest, value, func);
    }

    function addSessionKey(address key) external {
        require(msg.sender == owner, "Only owner");
        sessionKeys.add(key);
        emit SessionKeyAdded(key);
    }

    function removeSessionKey(address key) external {
        require(msg.sender == owner, "Only owner");
        sessionKeys.remove(key);
        emit SessionKeyRemoved(key);
    }

    function setSpendingLimit(address dapp, uint256 limit) external {
        require(msg.sender == owner, "Only owner");
        appSpendingLimit[dapp] = limit;
        emit SpendingLimitSet(dapp, limit);
    }

    function isSessionKey(address key) external view returns (bool) {
        return sessionKeys.contains(key);
    }
}