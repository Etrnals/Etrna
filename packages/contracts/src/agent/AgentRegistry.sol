// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract AgentRegistry {
    event AgentRegistered(address indexed agent, address indexed owner, string manifestUri);
    event AgentPermissionUpdated(address indexed agent, bytes32 permission, bool allowed);

    struct Agent {
        address owner;
        string manifestUri; // JSON describing capabilities, rate limits, etc.
    }

    mapping(address => Agent) public agents;
    mapping(address => mapping(bytes32 => bool)) public agentPermissions;

    function registerAgent(string calldata manifestUri) external {
        agents[msg.sender] = Agent({owner: msg.sender, manifestUri: manifestUri});
        emit AgentRegistered(msg.sender, msg.sender, manifestUri);
    }

    function setPermission(bytes32 permission, bool allowed) external {
        Agent memory a = agents[msg.sender];
        require(a.owner == msg.sender, "NOT_AGENT_OWNER");
        agentPermissions[msg.sender][permission] = allowed;
        emit AgentPermissionUpdated(msg.sender, permission, allowed);
    }

    function hasPermission(address agent, bytes32 permission) external view returns (bool) {
        return agentPermissions[agent][permission];
    }
}
