// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {CampaignUpdates} from "./CampaignUpdates.sol";

contract Crowdfunding is CampaignUpdates {
    constructor(address _crowdchainTokenAddress) CampaignUpdates(_crowdchainTokenAddress) {}
}
