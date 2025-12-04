// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC20Votes} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import {ERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract EtrnaGovernanceToken is ERC20Votes, Ownable {
    IERC20 public immutable etrToken;

    struct BonusMultipliers {
        uint16 etrnaPassBps;
        uint16 etrnalsBps;
        uint16 reputationBps;
        uint16 ecosystemBps;
    }

    mapping(address => uint256) private _staked;
    mapping(address => BonusMultipliers) private _multipliers;

    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);
    event VotingPowerUpdated(address indexed user, uint256 newPower);
    event MultipliersUpdated(address indexed user, BonusMultipliers multipliers);

    constructor(IERC20 _etrToken) ERC20("Etrna Governance Power", "ETR-VOTE") ERC20Permit("Etrna Governance Power") Ownable(msg.sender) {
        etrToken = _etrToken;
    }

    function stake(uint256 amount) external {
        require(amount > 0, "INVALID_AMOUNT");
        _staked[msg.sender] += amount;
        _mint(msg.sender, amount);
        emit Staked(msg.sender, amount);
        emit VotingPowerUpdated(msg.sender, votingPower(msg.sender));
        require(etrToken.transferFrom(msg.sender, address(this), amount), "TRANSFER_FAILED");
    }

    function unstake(uint256 amount) external {
        require(amount > 0, "INVALID_AMOUNT");
        require(_staked[msg.sender] >= amount, "INSUFFICIENT_BALANCE");
        _staked[msg.sender] -= amount;
        _burn(msg.sender, amount);
        emit Unstaked(msg.sender, amount);
        emit VotingPowerUpdated(msg.sender, votingPower(msg.sender));
        require(etrToken.transfer(msg.sender, amount), "TRANSFER_FAILED");
    }

    function setMultipliers(address user, BonusMultipliers calldata multipliers) external onlyOwner {
        require(multipliers.etrnaPassBps <= 1000, "PASS_MAX");
        require(multipliers.etrnalsBps <= 5000, "ETRNALS_MAX");
        require(multipliers.reputationBps <= 2500, "REPUTATION_MAX");
        require(multipliers.ecosystemBps <= 1000, "ECOSYSTEM_MAX");
        _multipliers[user] = multipliers;
        emit MultipliersUpdated(user, multipliers);
        emit VotingPowerUpdated(user, votingPower(user));
    }

    function stakedBalance(address user) external view returns (uint256) {
        return _staked[user];
    }

    function votingPower(address user) public view returns (uint256) {
        uint256 base = _staked[user];
        uint256 bonusBps =
            10000 +
            _multipliers[user].etrnaPassBps +
            _multipliers[user].etrnalsBps +
            _multipliers[user].reputationBps +
            _multipliers[user].ecosystemBps;
        return (base * bonusBps) / 10000;
    }

    function _getVotes(address account, uint256 blockNumber, bytes memory params) internal view override returns (uint256) {
        uint256 baseVotes = super._getVotes(account, blockNumber, params);
        if (bonusEligible(params)) {
            return (baseVotes * 11000) / 10000;
        }
        return baseVotes;
    }

    function bonusEligible(bytes memory params) internal pure returns (bool) {
        if (params.length == 0) return false;
        return abi.decode(params, (bool));
    }

    function _update(address from, address to, uint256 value) internal override {
        require(from == address(0) || to == address(0), "NON_TRANSFERABLE");
        super._update(from, to, value);
    }

    // The functions below are overrides required by Solidity.
    function _afterTokenTransfer(address from, address to, uint256 amount) internal override(ERC20Votes) {
        super._afterTokenTransfer(from, to, amount);
    }

    function _mint(address to, uint256 amount) internal override(ERC20Votes) {
        super._mint(to, amount);
    }

    function _burn(address account, uint256 amount) internal override(ERC20Votes) {
        super._burn(account, amount);
    }
}
