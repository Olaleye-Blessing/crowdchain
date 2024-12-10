// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.26;

import {Script, console} from "forge-std/Script.sol";
import {CampaignDonationCopy} from "./../test/utils/CampaignDonationCopy.sol";
import {DeployCrowdchainToken} from "./tokens/DeployCrowdchain.s.sol";
import {CrowdchainToken} from "../src/tokens/crowdchain.sol";
import {HelperConfig} from "./HelperConfig.s.sol";

contract DeployCampaignDonation is Script {
    function run() external returns (CampaignDonationCopy, CrowdchainToken) {
        DeployCrowdchainToken deployCrowdchainToken = new DeployCrowdchainToken();
        CrowdchainToken crowdchainToken = deployCrowdchainToken.run();

        HelperConfig helperConfig = new HelperConfig();

        HelperConfig.Config memory config = helperConfig.getConfig();

        vm.startBroadcast();

        CampaignDonationCopy campaignDonationCopy =
            new CampaignDonationCopy(address(crowdchainToken), config.supportedCoins, config.coinPriceFeeds);

        vm.stopBroadcast();

        return (campaignDonationCopy, crowdchainToken);
    }
}
