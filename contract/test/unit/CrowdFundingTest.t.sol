// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Test, console} from "forge-std/Test.sol";
import {DeployCrowdfunding, Crowdfunding} from "./../../script/DeployCrowdfunding.s.sol";
import {ConstantsTest} from "./../utils/Constants.sol";

contract CrowdFundingTest is Test, ConstantsTest {
    Crowdfunding public crowdfunding;

    function setUp() external {
        vm.deal(DEPLOYER, 100 ether);
        DeployCrowdfunding deployCrowdfunding = new DeployCrowdfunding();
        (crowdfunding,) = deployCrowdfunding.run();
    }

    function test_deploySuccessfully() external view {
        assertNotEq(address(crowdfunding), address(0));
    }
}
