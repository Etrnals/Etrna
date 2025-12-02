// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

interface IEntryPoint {
    function handleOps(bytes calldata userOp, address payable beneficiary) external;
}

/// @notice Minimal account-abstraction style smart account for EtrnaWallet.
contract EtrnaWallet {
    using ECDSA for bytes32;

    event Executed(address target, uint256 value, bytes data);
    event SessionKeyAdded(address indexed key, uint64 expiresAt, bytes32 scope);
    event SessionKeyRevoked(address indexed key);
    event SpendingLimitSet(address indexed token, uint256 limitPerPeriod, uint64 periodSeconds);

    struct SessionKey {
        uint64 expiresAt;
        bytes32 scope; // e.g. keccak256("app:music-distribution") or keccak256(abi.encode(app, method))
    }

    struct SpendingLimit {
        uint256 limitPerPeriod;
        uint256 spentInCurrentPeriod;
        uint64 periodSeconds;
        uint64 periodStart;
    }

    address public owner;
    IEntryPoint public immutable entryPoint;

    mapping(address => SessionKey) public sessionKeys;
    mapping(address => SpendingLimit) public spendingLimits; // token => limit

    modifier onlyOwner() {
        require(msg.sender == owner, "NOT_OWNER");
        _;
    }

    modifier onlyOwnerOrSession() {
        if (msg.sender != owner) {
            SessionKey memory sk = sessionKeys[msg.sender];
            require(sk.expiresAt != 0 && sk.expiresAt >= block.timestamp, "SESSION_EXPIRED");
        }
        _;
    }

    constructor(address _owner, IEntryPoint _entryPoint) {
        owner = _owner;
        entryPoint = _entryPoint;
    }

    // ---- Session keys ----

    function addSessionKey(address key, uint64 expiresAt, bytes32 scope) external onlyOwner {
        require(expiresAt > block.timestamp, "BAD_EXPIRY");
        sessionKeys[key] = SessionKey({expiresAt: expiresAt, scope: scope});
        emit SessionKeyAdded(key, expiresAt, scope);
    }

    function revokeSessionKey(address key) external onlyOwner {
        delete sessionKeys[key];
        emit SessionKeyRevoked(key);
    }

    // ---- Spending limits ----

    function setSpendingLimit(
        address token,
        uint256 limitPerPeriod,
        uint64 periodSeconds
    ) external onlyOwner {
        require(periodSeconds > 0, "BAD_PERIOD");

        SpendingLimit storage sl = spendingLimits[token];
        sl.limitPerPeriod = limitPerPeriod;
        sl.periodSeconds = periodSeconds;
        if (sl.periodStart == 0) {
            sl.periodStart = uint64(block.timestamp);
        }

        emit SpendingLimitSet(token, limitPerPeriod, periodSeconds);
    }

    function _checkAndConsumeSpendingLimit(address token, uint256 amount) internal {
        SpendingLimit storage sl = spendingLimits[token];
        if (sl.periodSeconds == 0 || sl.limitPerPeriod == 0) return;

        if (block.timestamp >= sl.periodStart + sl.periodSeconds) {
            sl.periodStart = uint64(block.timestamp);
            sl.spentInCurrentPeriod = 0;
        }

        require(sl.spentInCurrentPeriod + amount <= sl.limitPerPeriod, "SPENDING_LIMIT");
        sl.spentInCurrentPeriod += amount;
    }

    // ---- Execution ----

    function execute(
        address target,
        uint256 value,
        bytes calldata data
    ) external onlyOwnerOrSession returns (bytes memory) {
        (bool ok, bytes memory res) = target.call{value: value}(data);
        require(ok, string(res));
        emit Executed(target, value, data);
        return res;
    }

    function transferToken(
        address token,
        address to,
        uint256 amount
    ) external onlyOwnerOrSession {
        _checkAndConsumeSpendingLimit(token, amount);
        require(IERC20(token).transfer(to, amount), "TRANSFER_FAILED");
    }

    receive() external payable {}
}
