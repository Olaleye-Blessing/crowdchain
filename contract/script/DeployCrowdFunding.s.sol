// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.26;

import {Script} from "forge-std/Script.sol";
import {Crowdfunding} from "./../src/Crowdfunding.sol";

contract DeployCrowdFunding is Script {
    address immutable i_deployer;

    constructor() {
        i_deployer = msg.sender;
    }
    
    function run() external returns (Crowdfunding) {
        vm.startBroadcast(i_deployer);

        Crowdfunding crowdfunding = new Crowdfunding();

        vm.stopBroadcast();

        return crowdfunding;
    }
}
