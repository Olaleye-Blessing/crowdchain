// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.26;

import {Script, console} from "forge-std/Script.sol";
import {CampaignBaseCopy} from "./../test/utils/CampaignBaseCopy.sol";
import {DeployCrowdchainToken} from "./tokens/DeployCrowdchain.s.sol";
import {CrowdchainToken} from "../src/tokens/crowdchain.sol";

contract DeployCampaignBase is Script {
    address immutable i_deployer;

    constructor() {
        i_deployer = msg.sender;
    }

    function run() external returns (CampaignBaseCopy, CrowdchainToken) {
        DeployCrowdchainToken deployCrowdchainToken = new DeployCrowdchainToken();
        CrowdchainToken crowdchainToken = deployCrowdchainToken.run();

        vm.startBroadcast(i_deployer);

        CampaignBaseCopy campaignBaseCopy = new CampaignBaseCopy(address(crowdchainToken));

        vm.stopBroadcast();

        return (campaignBaseCopy, crowdchainToken);
    }
}
