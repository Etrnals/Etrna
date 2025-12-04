// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/// @title WalletActivityTracker
/// @notice Lightweight analytics/points contract for wallet actions across bridge and swap flows.
contract WalletActivityTracker is Ownable {
    struct Activity {
        uint256 bridgeCount;
        uint256 swapCount;
        uint256 nftViewCount;
        uint256 identityProofs;
    }

    mapping(address => Activity) public activity;
    mapping(address => uint256) public rewardPoints;

    event ActivityRecorded(address indexed user, Activity activity, uint256 rewardPoints);

    constructor(address initialOwner) Ownable(initialOwner) {}

    function recordBridge(address user, uint256 multiplier) external onlyOwner {
        Activity storage a = activity[user];
        a.bridgeCount += 1;
        rewardPoints[user] += 10 * multiplier;
        emit ActivityRecorded(user, a, rewardPoints[user]);
    }

    function recordSwap(address user, uint256 multiplier) external onlyOwner {
        Activity storage a = activity[user];
        a.swapCount += 1;
        rewardPoints[user] += 5 * multiplier;
        emit ActivityRecorded(user, a, rewardPoints[user]);
    }

    function recordNftView(address user) external onlyOwner {
        Activity storage a = activity[user];
        a.nftViewCount += 1;
        rewardPoints[user] += 1;
        emit ActivityRecorded(user, a, rewardPoints[user]);
    }

    function recordIdentityProof(address user, uint256 multiplier) external onlyOwner {
        Activity storage a = activity[user];
        a.identityProofs += 1;
        rewardPoints[user] += 20 * multiplier;
        emit ActivityRecorded(user, a, rewardPoints[user]);
    }
}
