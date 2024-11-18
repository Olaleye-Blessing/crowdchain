// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.26;

import {Script, console} from "forge-std/Script.sol";
import {CrowdfundingCopy} from "./../test/utils/CrowdfundingCopy.sol";
import {DeployCrowdchainToken} from "./tokens/DeployCrowdchain.s.sol";
import {CrowdchainToken} from "../src/tokens/crowdchain.sol";

contract DeployCrowdFunding is Script {
    function run() external returns (CrowdfundingCopy, CrowdchainToken) {
        DeployCrowdchainToken deployCrowdchainToken = new DeployCrowdchainToken();
        CrowdchainToken crowdchainToken = deployCrowdchainToken.run();

        vm.startBroadcast();

        CrowdfundingCopy crowdfunding = new CrowdfundingCopy(address(crowdchainToken));

        vm.stopBroadcast();

        return (crowdfunding, crowdchainToken);
    }
}
