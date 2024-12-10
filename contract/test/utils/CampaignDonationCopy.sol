// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {CampaignDonation} from "./../../src/CampaignDonation.sol";

contract CampaignDonationCopy is CampaignDonation {
    constructor(address _crowdchainTokenAddress, address[] memory _supportedCoins, address[] memory _coinPriceFeeds)
        CampaignDonation(_crowdchainTokenAddress, _supportedCoins, _coinPriceFeeds)
    {}
}
