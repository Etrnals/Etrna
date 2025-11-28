// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract EtrnaRestakingManager is AccessControl {
    bytes32 public constant RESTAKE_OPERATOR_ROLE = keccak256("RESTAKE_OPERATOR");

    mapping(address => bool) public approvedModules;

    event ModuleApproved(address indexed module);
    event ModuleRevoked(address indexed module);

    constructor(address admin) {
        _setupRole(DEFAULT_ADMIN_ROLE, admin);
    }

    function approveModule(address module) external onlyRole(DEFAULT_ADMIN_ROLE) {
        approvedModules[module] = true;
        emit ModuleApproved(module);
    }

    function revokeModule(address module) external onlyRole(DEFAULT_ADMIN_ROLE) {
        approvedModules[module] = false;
        emit ModuleRevoked(module);
    }

    function isModuleApproved(address module) external view returns (bool) {
        return approvedModules[module];
    }
}
