// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ETR is ERC20, Ownable {
    constructor(address _owner) ERC20("Etrna", "ETR") {
        _transferOwnership(_owner);
        _mint(_owner, 1_000_000_000 ether); // 1B ETR initial supply
    }

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}
