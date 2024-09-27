// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.26;

import {Script} from "forge-std/Script.sol";
import {Crowdfunding} from "./../src/Crowdfunding.sol";
import {DeployCrowdchainToken} from "./tokens/DeployCrowdchain.s.sol";
import {CrowdchainToken} from "../src/tokens/crowdchain.sol";

contract DeployCrowdFunding is Script {
    address immutable i_deployer;

    constructor() {
        i_deployer = msg.sender;
    }

    function run() external returns (Crowdfunding, CrowdchainToken) {
        DeployCrowdchainToken deployCrowdchainToken = new DeployCrowdchainToken();
        CrowdchainToken crowdchainToken = deployCrowdchainToken.run();

        vm.startBroadcast(i_deployer);

        Crowdfunding crowdfunding = new Crowdfunding(address(crowdchainToken));

        vm.stopBroadcast();

        return (crowdfunding, crowdchainToken);
    }
}
