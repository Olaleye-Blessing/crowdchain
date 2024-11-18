// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {ICampaignUpdates} from "./interfaces/IcampaignUpdates.sol";
import {Crowdfunding} from "./Crowdfunding.sol";

contract CrowdfundingUpdates is Crowdfunding, ICampaignUpdates {
  constructor(address _crowdchainTokenAddress) Crowdfunding(_crowdchainTokenAddress) {}
}
