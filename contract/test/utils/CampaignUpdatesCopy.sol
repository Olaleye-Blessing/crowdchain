// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {CampaignUpdates} from "./../../src/CampaignUpdates.sol";

contract CampaignUpdatesCopy is CampaignUpdates {
    constructor(address _crowdchainTokenAddress) CampaignUpdates(_crowdchainTokenAddress) {}
}
