// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

/// @notice Struct to track coin donations
struct Donation {
    address donor;
    address coin;
    uint256 amount;
    uint256 timestamp;
}
