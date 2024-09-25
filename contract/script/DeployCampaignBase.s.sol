// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.26;

import {Script, console} from "forge-std/Script.sol";
import {CampaignBaseCopy} from "./../test/utils/CampaignBaseCopy.sol";

contract DeployCampaignBase is Script {
    address immutable i_deployer;

    constructor() {
        i_deployer = msg.sender;
    }

    function run() external returns (CampaignBaseCopy) {
        vm.startBroadcast(i_deployer);

        CampaignBaseCopy campaignBaseCopy = new CampaignBaseCopy();

        vm.stopBroadcast();

        return campaignBaseCopy;
    }
}
