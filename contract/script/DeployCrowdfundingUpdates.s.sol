// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.26;

import {Script} from "forge-std/Script.sol";
import {DeployCrowdchainToken} from "./tokens/DeployCrowdchain.s.sol";
import {CrowdchainToken} from "../src/tokens/crowdchain.sol";
import {CrowdfundingUpdates} from "../src/CrowdfundingUpdates.sol";

contract DeployCrowdfundingUpdates is Script {
    function run() external returns (CrowdfundingUpdates, CrowdchainToken) {
        DeployCrowdchainToken deployCrowdchainToken = new DeployCrowdchainToken();
        CrowdchainToken crowdchainToken = deployCrowdchainToken.run();

        vm.startBroadcast();

        CrowdfundingUpdates crowdfundingUpdates = new CrowdfundingUpdates(address(crowdchainToken));

        vm.stopBroadcast();

        return (crowdfundingUpdates, crowdchainToken);
    }
}
