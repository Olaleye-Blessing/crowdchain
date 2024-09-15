// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.26;

import {Script} from "forge-std/Script.sol";
import {Crowdfunding} from "./../src/Crowdfunding.sol";

contract DeployCrowdFunding is Script {
    function run() external returns (Crowdfunding) {
        vm.startBroadcast();

        Crowdfunding crowdfunding = new Crowdfunding();

        vm.stopBroadcast();

        return crowdfunding;
    }
}
