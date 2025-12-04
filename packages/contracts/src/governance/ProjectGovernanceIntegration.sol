// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract ProjectGovernanceIntegration {
    struct ProjectWeight {
        string projectId;
        uint16 bonusBps;
    }

    mapping(string => uint16) public projectWeights;

    event ProjectWeightUpdated(string indexed projectId, uint16 bonusBps);

    function setProjectWeight(string calldata projectId, uint16 bonusBps) external {
        require(bytes(projectId).length > 0, "INVALID_PROJECT");
        require(bonusBps <= 5000, "MAX_BONUS");
        projectWeights[projectId] = bonusBps;
        emit ProjectWeightUpdated(projectId, bonusBps);
    }

    function weightForProject(string calldata projectId) external view returns (uint16) {
        return projectWeights[projectId];
    }
}
