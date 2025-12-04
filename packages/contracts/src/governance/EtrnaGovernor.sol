// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Governor} from "@openzeppelin/contracts/governance/Governor.sol";
import {GovernorCompatibilityBravo} from "@openzeppelin/contracts/governance/compatibility/GovernorCompatibilityBravo.sol";
import {GovernorCountingSimple} from "@openzeppelin/contracts/governance/extensions/GovernorCountingSimple.sol";
import {GovernorVotes} from "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";
import {GovernorTimelockControl} from "@openzeppelin/contracts/governance/extensions/GovernorTimelockControl.sol";
import {TimelockController} from "@openzeppelin/contracts/governance/TimelockController.sol";
import {IVotes} from "@openzeppelin/contracts/governance/utils/IVotes.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract EtrnaGovernor is
    Governor,
    GovernorCompatibilityBravo,
    GovernorCountingSimple,
    GovernorVotes,
    GovernorTimelockControl,
    Ownable
{
    mapping(address => bool) public uniqueHuman; // Billions ID hook
    mapping(address => uint256) public reputationBonusBps; // off-chain feed

    event UniqueHumanVerified(address indexed user, bool status);
    event ReputationUpdated(address indexed user, uint256 bonusBps);

    constructor(IVotes _token, TimelockController _timelock)
        Governor("EtrnaGovernor")
        GovernorVotes(_token)
        GovernorTimelockControl(_timelock)
        Ownable(msg.sender)
    {}

    function votingDelay() public pure override returns (uint256) {
        return 6575;
    }

    function votingPeriod() public pure override returns (uint256) {
        return 46027;
    }

    function quorum(uint256) public pure override returns (uint256) {
        return 40_000_000 ether;
    }

    function setUniqueHuman(address user, bool status) external onlyOwner {
        uniqueHuman[user] = status;
        emit UniqueHumanVerified(user, status);
    }

    function setReputationBonus(address user, uint256 bonusBps) external onlyOwner {
        require(bonusBps <= 2500, "MAX_REPUTATION");
        reputationBonusBps[user] = bonusBps;
        emit ReputationUpdated(user, bonusBps);
    }

    function _getVotes(address account, uint256 blockNumber, bytes memory params)
        internal
        view
        override(Governor, GovernorVotes)
        returns (uint256)
    {
        uint256 baseVotes = super._getVotes(account, blockNumber, params);
        uint256 weight = baseVotes;

        if (uniqueHuman[account]) {
            weight = (weight * 11000) / 10000;
        }

        if (reputationBonusBps[account] > 0) {
            weight = (weight * (10000 + reputationBonusBps[account])) / 10000;
        }

        if (params.length > 0) {
            (bool zkUnique) = abi.decode(params, (bool));
            if (zkUnique) {
                weight = (weight * 11000) / 10000;
            }
        }

        return weight;
    }

    function state(uint256 proposalId)
        public
        view
        override(Governor, GovernorTimelockControl)
        returns (ProposalState)
    {
        return super.state(proposalId);
    }

    function propose(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        string memory description
    ) public override(Governor, GovernorCompatibilityBravo) returns (uint256) {
        return super.propose(targets, values, calldatas, description);
    }

    function _execute(
        uint256 proposalId,
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) internal override(Governor, GovernorTimelockControl) {
        super._execute(proposalId, targets, values, calldatas, descriptionHash);
    }

    function _cancel(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    )
        internal
        override(Governor, GovernorTimelockControl)
        returns (uint256)
    {
        return super._cancel(targets, values, calldatas, descriptionHash);
    }

    function _executor()
        internal
        view
        override(Governor, GovernorTimelockControl)
        returns (address)
    {
        return super._executor();
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(Governor, GovernorTimelockControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
