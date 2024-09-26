// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Test, console} from "forge-std/Test.sol";
import {CrowdchainToken} from "./../../../src/tokens/crowdchain.sol";
import {DeployCrowdchainToken} from "./../../../script/tokens/DeployCrowdchain.s.sol";

contract CrowdchainTest is Test {
  CrowdchainToken public crowdchainToken;
  address DEPLOYER = makeAddr("deployer");
  address BLESSING = makeAddr("Blessing");
  uint256 private constant INITIAL_SUPPLY = 5_000_000 * 10**18;

  function setUp() external {
    vm.deal(DEPLOYER, 100 ether);
    vm.prank(DEPLOYER);
    DeployCrowdchainToken deployToken = new DeployCrowdchainToken();
    crowdchainToken = deployToken.run();
  }

  function test_initialSupply() public view {
    assertEq(crowdchainToken.totalSupply(), INITIAL_SUPPLY);
  }

  function test_tokenDetailIsCorrect() public view {
    assertEq(crowdchainToken.name(), "CrowdChain");
    assertEq(crowdchainToken.symbol(), "CC");
  }

  function test_tokenHasCorrectDecimals() public view {
    assertEq(crowdchainToken.decimals(), 18);
  }

  function test_deployerInitialBalanceMatchesTotalSupply() public view {
    assertEq(crowdchainToken.balanceOf(DEPLOYER), INITIAL_SUPPLY);
  }
}
