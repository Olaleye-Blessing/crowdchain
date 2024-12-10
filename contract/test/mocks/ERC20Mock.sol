// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

// import {console} from "forge-std/console.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ERC20Mock is ERC20 {
    uint8 internal immutable _decimals;

    constructor(
        string memory name,
        string memory symbol,
        address initialAccount,
        uint256 initialBalance,
        uint8 decimals_
    ) ERC20(name, symbol) {
        _mint(initialAccount, initialBalance);
        _decimals = decimals_;
    }

    function mint(address account, uint256 amount) public {
        _mint(account, amount);
    }

    function burn(address account, uint256 amount) public {
        _burn(account, amount);
    }

    function transferInternal(address from, address to, uint256 value) public {
        _transfer(from, to, value);
    }

    function approveInternal(address owner, address spender, uint256 value) public {
        _approve(owner, spender, value);
    }

    function decimals() public view override returns (uint8) {
        return _decimals;
    }
}
