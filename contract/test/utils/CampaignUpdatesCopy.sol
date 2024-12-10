// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {CampaignUpdates} from "./../../src/CampaignUpdates.sol";

contract CampaignUpdatesCopy is CampaignUpdates {
    constructor(address _crowdchainTokenAddress, address[] memory _supportedCoins, address[] memory _coinPriceFeeds)
        CampaignUpdates(_crowdchainTokenAddress, _supportedCoins, _coinPriceFeeds)
    {}
}
