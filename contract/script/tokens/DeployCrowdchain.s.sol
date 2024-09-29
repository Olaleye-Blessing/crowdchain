// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.26;

import {Script, console} from "forge-std/Script.sol";
import {CrowdchainToken} from "./../../src/tokens/crowdchain.sol";

contract DeployCrowdchainToken is Script {
    function run() external returns (CrowdchainToken) {
        vm.startBroadcast();

        CrowdchainToken crowdchainToken = new CrowdchainToken(5_000_000 * (10 ** 18));

        vm.stopBroadcast();

        return crowdchainToken;
    }
}
