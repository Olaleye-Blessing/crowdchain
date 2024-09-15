// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.26;

import {Script} from "forge-std/Script.sol";
import {CampaignBaseCopy} from "./../test/utils/CampaignBaseCopy.sol";

contract DeployCampaignBase is Script {
    function run() external returns (CampaignBaseCopy) {
        vm.startBroadcast();

        CampaignBaseCopy campaignBaseCopy = new CampaignBaseCopy();

        vm.stopBroadcast();

        return campaignBaseCopy;
    }
}
