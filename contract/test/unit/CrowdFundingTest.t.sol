// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Test, console} from "forge-std/Test.sol";
import {Crowdfunding} from "./../../src/Crowdfunding.sol";
import {ICampaign} from "./../../src/interfaces/ICampaign.sol";
import {DeployCrowdFunding} from "./../../script/DeployCrowdFunding.s.sol";
import {ConstantsTest} from "./../utils/Constants.sol";

contract CrowdFundingTest is Test, ConstantsTest {
    Crowdfunding public crowdfunding;
    address ALICE = makeAddr("alice");
    address BOB = makeAddr("bob");
    address BLESSING = makeAddr("blessing");

    function setUp() external {
        DeployCrowdFunding deployCampaign = new DeployCrowdFunding();
        crowdfunding = deployCampaign.run();

        vm.deal(ALICE, 100 ether);
        vm.deal(BOB, 100 ether);
        vm.deal(BLESSING, 100 ether);
    }

    function test_donationSuccessful() public {
        _createSuccessfulCampaign();
        uint256 campaignID = 0;

        // first donation
        vm.prank(BLESSING);
        uint256 BLESSING_DONATION = 2;
        vm.expectEmit(true, false, false, false, address(crowdfunding));
        emit Crowdfunding.NewDonation(BLESSING, campaignID, BLESSING_DONATION);
        crowdfunding.donate{value: BLESSING_DONATION}(campaignID);

        ICampaign.CampaignDetails memory campaign = crowdfunding.getCampaign(campaignID);

        assertEq(BLESSING_DONATION, campaign.amountRaised);

        // second donation
        vm.prank(BOB);
        uint256 BOB_DONATION = 1;
        vm.expectEmit(true, false, false, false, address(crowdfunding));
        emit Crowdfunding.NewDonation(BOB, campaignID, BOB_DONATION);
        crowdfunding.donate{value: BOB_DONATION}(campaignID);

        campaign = crowdfunding.getCampaign(campaignID);

        assertEq(BOB_DONATION + BLESSING_DONATION, campaign.amountRaised);
    }

    function test_emitAnEventWhenGoalIsMet() public {
        _createSuccessfulCampaign();
        uint256 campaignID = 0;

        vm.prank(BLESSING);
        uint256 BLESSING_DONATION = 2;
        vm.expectEmit(true, false, false, false, address(crowdfunding));
        emit Crowdfunding.NewDonation(BLESSING, campaignID, BLESSING_DONATION);
        crowdfunding.donate{value: BLESSING_DONATION * ONE_ETH}(campaignID);

        vm.prank(BOB);
        uint256 BOB_DONATION = 100;
        vm.expectEmit(true, false, false, false, address(crowdfunding));
        emit Crowdfunding.NewDonation(BOB, campaignID, BOB_DONATION);

        vm.expectEmit(true, false, false, false, address(crowdfunding));
        emit ICampaign.CampaignGoalCompleted(ALICE, campaignID, BLESSING_DONATION + BOB_DONATION);

        crowdfunding.donate{value: BOB_DONATION * ONE_ETH}(campaignID);
    }

    function test_getAllDonors() public {
        _createSuccessfulCampaign();
        uint256 campaignID = 0;

        vm.prank(BLESSING);
        uint256 BLESSING_DONATION = 2;
        crowdfunding.donate{value: BLESSING_DONATION}(campaignID);

        vm.prank(BOB);
        uint256 BOB_DONATION = 1;
        crowdfunding.donate{value: BOB_DONATION}(campaignID);

        (address[] memory donors, uint256[] memory contributions) = crowdfunding.getCampaignDonors(campaignID);

        assertEq(donors[0], BLESSING);
        assertEq(donors[1], BOB);

        assertEq(contributions[0], BLESSING_DONATION);
        assertEq(contributions[1], BOB_DONATION);
    }

    function test_donationFailsIfNoMoneyIsDonated() public {
        _createSuccessfulCampaign();
        uint256 campaignID = 0;

        vm.prank(BLESSING);
        uint256 BLESSING_DONATION = 0;
        vm.expectRevert(ICampaign.Campaign__EmptyDonation.selector);
        crowdfunding.donate{value: BLESSING_DONATION}(campaignID);
    }

    // TODO: Add this when there is a logic to claim campaign
    function test_donationFailsIfCampaignHasBeenClaimed() public {
        _createSuccessfulCampaign();
        uint256 campaignID = 0;

        vm.warp(block.timestamp + 15 * ONE_DAY);

        vm.prank(ALICE);
        crowdfunding.withdraw(campaignID);

        vm.prank(BLESSING);
        uint256 BLESSING_DONATION = 1;
        vm.expectRevert(ICampaign.Campaign__CampaignAlreadyClaimed.selector);
        crowdfunding.donate{value: BLESSING_DONATION}(campaignID);
    }

    function test_donationFailsIfCampaignIsClosed() public {
        _createSuccessfulCampaign();
        uint256 campaignID = 0;

        vm.warp(block.timestamp + 15 * ONE_DAY);

        vm.prank(BLESSING);
        uint256 BLESSING_DONATION = 1;
        vm.expectRevert(ICampaign.Campaign__CampaignClosed.selector);
        crowdfunding.donate{value: BLESSING_DONATION}(campaignID);
    }

    function _createSuccessfulCampaign() private {
        uint32 _amountNeeded = 6;
        uint64 _deadline = 4; // days
        uint64 _refundDeadline = 10; // days
        string memory _title = "My Title";
        string memory _description = "My little description from my heart, soul and mind";

        _createCampaign(ALICE, _title, _description, _amountNeeded, _deadline, _refundDeadline);
    }

    function _createCampaign(
        address _owner,
        string memory _title,
        string memory _description,
        uint32 _amountNeeded,
        uint64 _deadline,
        uint256 _refundDeadline
    ) private {
        vm.startPrank(_owner);

        crowdfunding.createCampaign(_title, _description, _amountNeeded, _deadline, _refundDeadline);

        vm.stopPrank();
    }
}
