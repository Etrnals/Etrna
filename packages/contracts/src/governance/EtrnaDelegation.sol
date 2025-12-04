// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract EtrnaDelegation {
    enum Scope {
        Global,
        Music,
        VibeCheck,
        UefVault,
        VerseProjects,
        Treasury
    }

    struct Delegation {
        address delegator;
        address delegatee;
        Scope scope;
        uint16 weightBps;
    }

    mapping(address => Delegation[]) public delegations;

    event Delegated(address indexed delegator, address indexed delegatee, Scope scope, uint16 weightBps);
    event Undelegated(address indexed delegator, Scope scope);

    function delegate(address delegatee, Scope scope, uint16 weightBps) external {
        require(weightBps > 0 && weightBps <= 10_000, "INVALID_WEIGHT");
        Delegation memory entry = Delegation({
            delegator: msg.sender,
            delegatee: delegatee,
            scope: scope,
            weightBps: weightBps
        });

        _upsertDelegation(entry);
        emit Delegated(msg.sender, delegatee, scope, weightBps);
    }

    function undelegate(Scope scope) external {
        Delegation[] storage entries = delegations[msg.sender];
        for (uint256 i = 0; i < entries.length; i++) {
            if (entries[i].scope == scope) {
                entries[i] = entries[entries.length - 1];
                entries.pop();
                emit Undelegated(msg.sender, scope);
                return;
            }
        }
        revert("NOT_FOUND");
    }

    function getDelegations(address delegator) external view returns (Delegation[] memory) {
        return delegations[delegator];
    }

    function _upsertDelegation(Delegation memory entry) internal {
        Delegation[] storage entries = delegations[entry.delegator];
        for (uint256 i = 0; i < entries.length; i++) {
            if (entries[i].scope == entry.scope) {
                entries[i] = entry;
                return;
            }
        }
        entries.push(entry);
    }
}
