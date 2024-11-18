// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Crowdfunding} from "./../../src/Crowdfunding.sol";

contract CrowdfundingCopy is Crowdfunding {
    constructor(address _crowdchainTokenAddress) Crowdfunding(_crowdchainTokenAddress) {}
}
