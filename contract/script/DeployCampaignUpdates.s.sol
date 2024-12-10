// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.26;

import {Script, console} from "forge-std/Script.sol";
import {CampaignUpdatesCopy} from "./../test/utils/CampaignUpdatesCopy.sol";
import {DeployCrowdchainToken} from "./tokens/DeployCrowdchain.s.sol";
import {CrowdchainToken} from "../src/tokens/crowdchain.sol";
import {HelperConfig} from "./HelperConfig.s.sol";

contract DeployCampaignUpdates is Script {
    function run() external returns (CampaignUpdatesCopy, CrowdchainToken) {
        DeployCrowdchainToken deployCrowdchainToken = new DeployCrowdchainToken();
        CrowdchainToken crowdchainToken = deployCrowdchainToken.run();

        HelperConfig helperConfig = new HelperConfig();

        HelperConfig.Config memory config = helperConfig.getConfig();

        vm.startBroadcast();

        CampaignUpdatesCopy campaignUpdatesCopy =
            new CampaignUpdatesCopy(address(crowdchainToken), config.supportedCoins, config.coinPriceFeeds);

        vm.stopBroadcast();

        return (campaignUpdatesCopy, crowdchainToken);
    }
}
