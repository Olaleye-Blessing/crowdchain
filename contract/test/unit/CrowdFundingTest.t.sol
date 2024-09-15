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

    function test_donorSuccessfullyGetsRefund() public {
        _createSuccessfulCampaign();

        uint256 campaignID = 0;
        uint256 donation = 5;
        uint256 refundAmount = 3;

        vm.prank(BLESSING);
        vm.expectEmit(true, false, false, false, address(crowdfunding));
        emit Crowdfunding.NewDonation(BLESSING, campaignID, donation);
        crowdfunding.donate{value: donation * ONE_ETH}(campaignID);

        vm.prank(BLESSING);
        vm.expectEmit(true, false, false, false, address(crowdfunding));
        emit Crowdfunding.DonationRefunded(campaignID, BLESSING, refundAmount);
        crowdfunding.refund(campaignID, refundAmount);

        ICampaign.CampaignDetails memory campaign = crowdfunding.getCampaign(campaignID);

        assertEq(campaign.amountRaised, (donation - refundAmount) * ONE_ETH);
    }

    function test_noRefundIfCampaignHasBeenClaimed() public {
        _createSuccessfulCampaign();
        uint256 campaignID = 0;

        // donate
        vm.prank(BLESSING);
        vm.expectEmit(true, false, false, false, address(crowdfunding));
        emit Crowdfunding.NewDonation(BLESSING, campaignID, ONE_ETH);
        crowdfunding.donate{value: ONE_ETH}(campaignID);

        vm.warp(block.timestamp + 15 * ONE_DAY);

        // withdraw
        vm.prank(ALICE);
        vm.expectEmit(true, false, false, false, address(crowdfunding));
        emit ICampaign.CampaignFundWithdrawn(campaignID, BLESSING, ONE_ETH);
        crowdfunding.withdraw(campaignID);

        // refund
        vm.prank(BLESSING);
        vm.expectRevert(ICampaign.Campaign__CampaignAlreadyClaimed.selector);
        crowdfunding.refund(campaignID, ONE_ETH);
    }

    function test_noRefundIfCampaignHasBeenClosed() public {
        _createSuccessfulCampaign();
        uint256 campaignID = 0;

        // donate
        vm.prank(BLESSING);
        vm.expectEmit(true, false, false, false, address(crowdfunding));
        emit Crowdfunding.NewDonation(BLESSING, campaignID, ONE_ETH);
        crowdfunding.donate{value: ONE_ETH}(campaignID);

        vm.warp(block.timestamp + 17 * ONE_DAY);

        // refund
        vm.prank(BLESSING);
        vm.expectRevert(abi.encodeWithSelector(ICampaign.Campaign__RefundDeadlineElapsed.selector, campaignID));
        crowdfunding.refund(campaignID, ONE_ETH);
    }

    function test_noRefundIfDonorHasZeroDonations() public {
        _createSuccessfulCampaign();
        uint256 campaignID = 0;

        vm.prank(BLESSING);
        vm.expectRevert(abi.encodeWithSelector(Crowdfunding.Crowdfunding__NoDonationFound.selector, campaignID));
        crowdfunding.refund(campaignID, ONE_ETH);
    }

    function test_noRefundIfDonorWantsMoreThanTheyDonated() public {
        _createSuccessfulCampaign();
        uint256 campaignID = 0;
        uint256 donation = 5 * ONE_ETH;
        uint256 refundAmount = donation + ONE_ETH;

        // donate
        vm.prank(BLESSING);
        vm.expectEmit(true, false, false, false, address(crowdfunding));
        emit Crowdfunding.NewDonation(BLESSING, campaignID, donation);
        crowdfunding.donate{value: donation}(campaignID);

        // refund
        vm.prank(BLESSING);
        vm.expectRevert(
            abi.encodeWithSelector(
                Crowdfunding.Crowdfunding__InsufficientDonation.selector, campaignID, refundAmount, donation
            )
        );
        crowdfunding.refund(campaignID, refundAmount);
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

        // TODO: Use forge to get image metadata
        crowdfunding.createCampaign(_title, _description, "coverImage", _amountNeeded, _deadline, _refundDeadline);

        vm.stopPrank();
    }
}
