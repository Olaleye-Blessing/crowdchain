// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {CampaignBase} from "./../../src/CampaignBase.sol";

contract CampaignBaseCopy is CampaignBase {
    constructor(address _crowdchainTokenAddress) CampaignBase(_crowdchainTokenAddress) {}
}
