// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.26;

import {Script, console} from "forge-std/Script.sol";
import {CampaignBaseCopy} from "./../test/utils/CampaignBaseCopy.sol";
import {DeployCrowdchainToken} from "./tokens/DeployCrowdchain.s.sol";
import {CrowdchainToken} from "../src/tokens/crowdchain.sol";
import {HelperConfig} from "./HelperConfig.s.sol";

contract DeployCampaignBase is Script {
    address immutable i_deployer;

    constructor() {
        i_deployer = msg.sender;
    }

    function run() external returns (CampaignBaseCopy, CrowdchainToken) {
        DeployCrowdchainToken deployCrowdchainToken = new DeployCrowdchainToken();
        CrowdchainToken crowdchainToken = deployCrowdchainToken.run();

        HelperConfig helperConfig = new HelperConfig();

        HelperConfig.Config memory config = helperConfig.getConfig();

        vm.startBroadcast(i_deployer);

        CampaignBaseCopy campaignBaseCopy =
            new CampaignBaseCopy(address(crowdchainToken), config.supportedCoins, config.coinPriceFeeds);

        vm.stopBroadcast();

        return (campaignBaseCopy, crowdchainToken);
    }
}
