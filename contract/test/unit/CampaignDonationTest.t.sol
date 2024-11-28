// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Test, console} from "forge-std/Test.sol";
import {CrowdchainToken} from "./../../src/tokens/crowdchain.sol";
import {ICampaign} from "./../../src/interfaces/ICampaign.sol";
import {ICampaignDonation} from "./../../src/interfaces/ICampaignDonation.sol";
import {DeployCampaignDonation, CampaignDonationCopy} from "./../../script/DeployCampaignDonation.s.sol";
import {ConstantsTest} from "./../utils/Constants.sol";
import {CampaignDonation} from "./../../src/CampaignDonation.sol";

contract CampaignDonationTest is Test, ConstantsTest {
    CampaignDonationCopy public campaignDonation;
    CrowdchainToken public crowdchainToken;
    address ALICE = makeAddr("alice");
    address BOB = makeAddr("bob");
    address BLESSING = makeAddr("blessing");

    function setUp() external {
        vm.deal(DEPLOYER, 100 ether);
        vm.prank(DEPLOYER);
        DeployCampaignDonation deployCampaign = new DeployCampaignDonation();
        (campaignDonation, crowdchainToken) = deployCampaign.run();

        vm.deal(ALICE, 100 ether);
        vm.deal(BOB, 100 ether);
        vm.deal(BLESSING, 100 ether);
    }

    function test_withdrawSuccessfully() public {
        _createSuccessfulCampaign();
        uint256 campaignID = 0;

        vm.prank(BLESSING);
        uint256 BLESSING_DONATION = 2;
        vm.expectEmit(true, true, false, true, address(campaignDonation));
        emit ICampaignDonation.NewDonation(BLESSING, campaignID, BLESSING_DONATION, "My Title");
        campaignDonation.donate{value: BLESSING_DONATION}(campaignID);

        _shiftCurrentTimestampToAllowWithdraw();

        vm.prank(ALICE);
        vm.expectEmit(true, false, false, false, address(campaignDonation));
        emit ICampaign.CampaignFundWithdrawn(campaignID, ALICE, BLESSING_DONATION);
        campaignDonation.withdraw(campaignID);
    }

    function test_withdrawMilestonedCampaign() public {
        _createCampignWithMilestones(ALICE);
        uint256 amountNeeded = 40 * 1 ether; // gotten from _createCampignWithMilestones above

        uint8 firstMilestoneID = 0;
        uint8 secondMilestoneID = 1;
        uint8 thirdMilestoneID = 2;

        uint256 campaignID = 0;

        // ========== first milestone amount -> 7 ether ==========
        vm.prank(BLESSING);
        vm.expectEmit(true, true, false, true, address(campaignDonation));
        emit ICampaignDonation.NewDonation(BLESSING, campaignID, 3 ether, "My Title");
        campaignDonation.donate{value: 3 ether}(campaignID);

        vm.prank(BOB);
        vm.expectEmit(true, true, false, true, address(campaignDonation));
        emit ICampaignDonation.NewDonation(BOB, campaignID, 4 ether, "My Title");
        vm.expectEmit(true, false, false, false, address(campaignDonation));
        emit ICampaign.MilestoneReached(campaignID, firstMilestoneID, 7 ether);
        vm.expectEmit(true, false, false, false, address(campaignDonation));
        emit ICampaign.NextMilestoneStarted(campaignID, secondMilestoneID);
        campaignDonation.donate{value: 4 ether}(campaignID); // total = 7 ethers

        uint256 firstMilestoneTarget = 6 ether;
        uint256 fee = (campaignDonation.getOwnerFee() * amountNeeded) / 1000;
        uint256 firstAmountWithdrawn = firstMilestoneTarget - fee;
        uint256 aliceFirstBalance = ALICE.balance;

        vm.prank(ALICE);
        // assert withdraw was successful
        vm.expectEmit(true, false, false, false, address(campaignDonation));
        emit ICampaign.CampaignFundWithdrawn(campaignID, ALICE, firstAmountWithdrawn);
        campaignDonation.withdraw(campaignID);

        // assert correct amount was withdrawn
        assertEq(ALICE.balance, aliceFirstBalance + firstAmountWithdrawn);

        // ========== second milestone amount -> 16 ether ==========
        uint256 aliceSecondBalance = ALICE.balance;
        vm.prank(BLESSING);
        vm.expectEmit(true, true, false, true, address(campaignDonation));
        emit ICampaignDonation.NewDonation(BLESSING, campaignID, 3 ether, "My Title");
        campaignDonation.donate{value: 3 ether}(campaignID);

        vm.prank(BOB);
        vm.expectEmit(true, true, false, true, address(campaignDonation));
        emit ICampaignDonation.NewDonation(BOB, campaignID, 6 ether, "My Title");
        vm.expectEmit(true, false, false, false, address(campaignDonation));
        emit ICampaign.MilestoneReached(campaignID, secondMilestoneID, 16 ether);
        vm.expectEmit(true, false, false, false, address(campaignDonation));
        emit ICampaign.NextMilestoneStarted(campaignID, thirdMilestoneID);
        campaignDonation.donate{value: 6 ether}(campaignID); // total = 16 ethers
        // ========== second milestone amount -> 16 ether ==========

        uint256 secondMilestoneTarget = 16 ether;
        uint256 secondAmountWithdrawn = secondMilestoneTarget - firstMilestoneTarget;

        vm.prank(ALICE);
        // assert withdraw was successful
        vm.expectEmit(true, false, false, false, address(campaignDonation));
        emit ICampaign.CampaignFundWithdrawn(campaignID, ALICE, secondAmountWithdrawn);
        campaignDonation.withdraw(campaignID);

        // assert correct amount was withdrawn
        assertEq(ALICE.balance, aliceSecondBalance + secondAmountWithdrawn);

        // ========== third milestone amount -> 40 ether ==========
        uint256 aliceThirdBalance = ALICE.balance;
        vm.prank(BLESSING);
        vm.expectEmit(true, true, false, true, address(campaignDonation));
        emit ICampaignDonation.NewDonation(BLESSING, campaignID, 5 ether, "My Title");
        campaignDonation.donate{value: 5 ether}(campaignID); // total = 21 ethers

        vm.prank(BLESSING);
        vm.expectEmit(true, true, false, true, address(campaignDonation));
        emit ICampaignDonation.NewDonation(BLESSING, campaignID, 3 ether, "My Title");
        campaignDonation.donate{value: 3 ether}(campaignID); // total = 24 ethers

        vm.prank(BOB);
        vm.expectEmit(true, true, false, true, address(campaignDonation));
        emit ICampaignDonation.NewDonation(BOB, campaignID, 36 ether, "My Title");
        vm.expectEmit(true, false, false, false, address(campaignDonation));
        emit ICampaign.CampaignGoalCompleted(ALICE, campaignID, 60 ether);
        campaignDonation.donate{value: 36 ether}(campaignID); // total = 60 ethers
        // ========== third milestone amount -> 40 ether ==========

        uint256 amountRaised = 60 ether;
        uint256 thirdAmountWithdrawn = amountRaised - (firstAmountWithdrawn + fee + secondAmountWithdrawn);

        vm.prank(ALICE);
        // assert withdraw was successful
        vm.expectEmit(true, false, false, false, address(campaignDonation));
        emit ICampaign.CampaignFundWithdrawn(campaignID, ALICE, thirdAmountWithdrawn);
        campaignDonation.withdraw(campaignID);

        // assert correct amount was withdrawn
        assertEq(ALICE.balance, aliceThirdBalance + thirdAmountWithdrawn);
        assertEq(ALICE.balance, aliceFirstBalance + firstAmountWithdrawn + secondAmountWithdrawn + thirdAmountWithdrawn);
    }

    function test_savesAccumalatedFeeCorrectly() public {
        uint256 _amountNeeded = 16 * ONE_ETH;

        ICampaign.BasicMilestone[] memory _milestones;
        string[] memory categories = new string[](1);
        categories[0] = "Tester";

        vm.prank(ALICE);
        campaignDonation.createCampaign(
            "My Title",
            SUMMARY,
            "My little description from my heart, soul and mind",
            "coverImage",
            _milestones,
            categories,
            _amountNeeded,
            4,
            10
        );

        uint256 campaignID = 0;
        uint256 DONATION = 3 * ONE_ETH;

        vm.prank(BLESSING);
        vm.expectEmit(true, true, false, true, address(campaignDonation));
        emit ICampaignDonation.NewDonation(BLESSING, campaignID, DONATION, "My Title");
        campaignDonation.donate{value: DONATION}(campaignID);

        vm.prank(BOB);
        vm.expectEmit(true, true, false, true, address(campaignDonation));
        emit ICampaignDonation.NewDonation(BOB, campaignID, DONATION, "My Title");
        campaignDonation.donate{value: DONATION}(campaignID);

        vm.warp(block.timestamp + ((4 + 10) * ONE_DAY));

        uint256 totalDonation = DONATION * 2;

        vm.prank(ALICE);
        vm.expectEmit(true, false, false, false, address(campaignDonation));
        emit ICampaign.CampaignFundWithdrawn(campaignID, ALICE, totalDonation);
        campaignDonation.withdraw(campaignID);

        vm.prank(DEPLOYER);
        uint256 accumulatedFee = campaignDonation.getAccumulatedFee();
        uint256 expectedAccumulatedFee = (campaignDonation.getOwnerFee() * totalDonation) / 1000;

        assertEq(accumulatedFee, expectedAccumulatedFee);
    }

    function test_allocateCorrectAmountOfTokensAfterOwnerWithdraw() public {
        uint256 _amountNeeded = 16 * ONE_ETH;

        ICampaign.BasicMilestone[] memory _milestones;
        string[] memory categories = new string[](1);
        categories[0] = "Tester";

        vm.prank(ALICE);
        campaignDonation.createCampaign(
            "My Title",
            SUMMARY,
            "My little description from my heart, soul and mind",
            "coverImage",
            _milestones,
            categories,
            _amountNeeded,
            4,
            10
        );

        uint256 campaignID = 0;
        uint256 DONATION = 9 * ONE_ETH;
        uint256 totalDonation = DONATION * 2;

        vm.prank(BLESSING);
        vm.expectEmit(true, true, false, true, address(campaignDonation));
        emit ICampaignDonation.NewDonation(BLESSING, campaignID, totalDonation, "My Title");
        campaignDonation.donate{value: totalDonation}(campaignID);

        vm.warp(block.timestamp + ((4 + 10) * ONE_DAY));

        vm.prank(ALICE);
        vm.expectEmit(true, false, false, false, address(campaignDonation));
        emit ICampaign.CampaignFundWithdrawn(campaignID, ALICE, totalDonation);
        campaignDonation.withdraw(campaignID);

        vm.prank(DEPLOYER);
        uint256 accumulatedFee = campaignDonation.getAccumulatedFee();
        uint256 expectedAccumulatedFee = (campaignDonation.getOwnerFee() * totalDonation) / 1000;
        assertEq(accumulatedFee, expectedAccumulatedFee);

        uint256 amountWithdrawn = campaignDonation.getCampaign(0).amountRaised - accumulatedFee;
        uint256 tokenAllocated = (amountWithdrawn / campaignDonation.getMinimumCampaignAmountRaised()) * 10 ** 18;

        assertEq(campaignDonation.getCampaign(0).tokensAllocated, tokenAllocated);
    }

    function test_allocateZeroTokenIfAmountRaisedIsSmall() public {
        uint256 minimumGoalAmount = campaignDonation.getMinimumCampaignAmountRaised();
        uint256 _amountNeeded = minimumGoalAmount - 6 ether;

        ICampaign.BasicMilestone[] memory _milestones;
        string[] memory categories = new string[](1);
        categories[0] = "Tester";

        vm.prank(ALICE);
        campaignDonation.createCampaign(
            "My Title",
            SUMMARY,
            "My little description from my heart, soul and mind",
            "coverImage",
            _milestones,
            categories,
            _amountNeeded,
            4,
            10
        );

        uint256 campaignID = 0;
        uint256 DONATION = _amountNeeded - 4 ether;

        vm.prank(BLESSING);
        vm.expectEmit(true, true, false, true, address(campaignDonation));
        emit ICampaignDonation.NewDonation(BLESSING, campaignID, DONATION, "My Title");
        campaignDonation.donate{value: DONATION}(campaignID);

        vm.warp(block.timestamp + ((4 + 10) * ONE_DAY));

        vm.prank(ALICE);
        vm.expectEmit(true, false, false, false, address(campaignDonation));
        emit ICampaign.CampaignFundWithdrawn(campaignID, ALICE, DONATION);
        campaignDonation.withdraw(campaignID);

        assertEq(campaignDonation.getCampaign(campaignID).tokensAllocated, 0);
    }

    // TODO: Write a test for this case
    function test_allowDonorToClaimToken() public {}

    function test_revertClaimTokenWhenUserHasNoDonation() public {
        uint256 _amountNeeded = 16 * ONE_ETH;

        ICampaign.BasicMilestone[] memory _milestones;
        string[] memory categories = new string[](1);
        categories[0] = "Tester";

        vm.prank(ALICE);
        campaignDonation.createCampaign(
            "My Title",
            SUMMARY,
            "My little description from my heart, soul and mind",
            "coverImage",
            _milestones,
            categories,
            _amountNeeded,
            4,
            10
        );

        uint256 campaignID = 0;
        uint256 DONATION = 18 * ONE_ETH;

        vm.prank(BLESSING);
        vm.expectEmit(true, true, false, true, address(campaignDonation));
        emit ICampaignDonation.NewDonation(BLESSING, campaignID, DONATION, "My Title");
        campaignDonation.donate{value: DONATION}(campaignID);

        vm.warp(block.timestamp + ((4 + 10) * ONE_DAY));

        vm.prank(ALICE);
        vm.expectEmit(true, false, false, false, address(campaignDonation));
        emit ICampaign.CampaignFundWithdrawn(campaignID, ALICE, DONATION);
        campaignDonation.withdraw(campaignID);

        vm.prank(BOB);
        vm.expectRevert(ICampaign.Campaign__EmptyDonation.selector);
        campaignDonation.claimToken(campaignID);
    }

    function test_revertWhenClaimingTokenFromUnderFundedCampaign() public {
        uint256 minimumGoalAmount = campaignDonation.getMinimumCampaignAmountRaised();
        uint256 _amountNeeded = minimumGoalAmount - 6 ether;

        ICampaign.BasicMilestone[] memory _milestones;
        string[] memory categories = new string[](1);
        categories[0] = "Tester";

        vm.prank(ALICE);
        campaignDonation.createCampaign(
            "My Title",
            SUMMARY,
            "My little description from my heart, soul and mind",
            "coverImage",
            _milestones,
            categories,
            _amountNeeded,
            4,
            10
        );

        uint256 campaignID = 0;
        uint256 DONATION = _amountNeeded - 4 ether;

        vm.prank(BLESSING);
        vm.expectEmit(true, true, false, true, address(campaignDonation));
        emit ICampaignDonation.NewDonation(BLESSING, campaignID, DONATION, "My Title");
        campaignDonation.donate{value: DONATION}(campaignID);

        vm.warp(block.timestamp + ((4 + 10) * ONE_DAY));

        vm.prank(ALICE);
        vm.expectEmit(true, false, false, false, address(campaignDonation));
        emit ICampaign.CampaignFundWithdrawn(campaignID, ALICE, DONATION);
        campaignDonation.withdraw(campaignID);

        console.log("___ AMOUNTRAISED ___");
        console.log(campaignDonation.getCampaign(campaignID).amountRaised);

        vm.prank(BLESSING);
        vm.expectRevert(
            abi.encodeWithSelector(
                ICampaign.Campaign__InsufficientDonationsForTokens.selector, 0, DONATION, minimumGoalAmount
            )
        );
        campaignDonation.claimToken(campaignID);
    }

    function test_onlyDeployerCanWithdrawAccumulatedFees() public {
        uint256 _amountNeeded = 16 * ONE_ETH;

        ICampaign.BasicMilestone[] memory _milestones;
        string[] memory categories = new string[](1);
        categories[0] = "Tester";

        vm.prank(ALICE);
        campaignDonation.createCampaign(
            "My Title",
            SUMMARY,
            "My little description from my heart, soul and mind",
            "coverImage",
            _milestones,
            categories,
            _amountNeeded,
            4,
            10
        );

        uint256 campaignID = 0;
        uint256 DONATION = 3 * ONE_ETH;

        vm.prank(BLESSING);
        vm.expectEmit(true, true, false, true, address(campaignDonation));
        emit ICampaignDonation.NewDonation(BLESSING, campaignID, DONATION, "My Title");
        campaignDonation.donate{value: DONATION}(campaignID);

        vm.prank(BOB);
        vm.expectEmit(true, true, false, true, address(campaignDonation));
        emit ICampaignDonation.NewDonation(BOB, campaignID, DONATION, "My Title");
        campaignDonation.donate{value: DONATION}(campaignID);

        vm.warp(block.timestamp + ((4 + 10) * ONE_DAY));

        uint256 totalDonation = DONATION * 2;

        vm.prank(ALICE);
        vm.expectEmit(true, false, false, false, address(campaignDonation));
        emit ICampaign.CampaignFundWithdrawn(campaignID, ALICE, totalDonation);
        campaignDonation.withdraw(campaignID);

        vm.prank(BOB);
        vm.expectRevert(abi.encodeWithSelector(ICampaign.Campaign__NotContractOwner.selector, BOB));
        campaignDonation.withdrawFee();

        vm.startPrank(DEPLOYER);
        assertNotEq(campaignDonation.getAccumulatedFee(), 0);

        campaignDonation.withdrawFee();
        assertEq(campaignDonation.getAccumulatedFee(), 0);
    }

    function test_donationSuccessful() public {
        _createSuccessfulCampaign();
        uint256 campaignID = 0;

        // first donation
        vm.prank(BLESSING);
        uint256 BLESSING_DONATION = 2;
        vm.expectEmit(true, true, false, true, address(campaignDonation));
        emit ICampaignDonation.NewDonation(BLESSING, campaignID, BLESSING_DONATION, "My Title");
        campaignDonation.donate{value: BLESSING_DONATION}(campaignID);

        ICampaign.CampaignDetails memory campaign = campaignDonation.getCampaign(campaignID);

        assertEq(BLESSING_DONATION, campaign.amountRaised);

        // second donation
        vm.prank(BOB);
        uint256 BOB_DONATION = 1;
        vm.expectEmit(true, true, false, true, address(campaignDonation));
        emit ICampaignDonation.NewDonation(BOB, campaignID, BOB_DONATION, "My Title");
        campaignDonation.donate{value: BOB_DONATION}(campaignID);

        campaign = campaignDonation.getCampaign(campaignID);

        assertEq(BOB_DONATION + BLESSING_DONATION, campaign.amountRaised);
    }

    function test_emitAnEventWhenGoalIsMet() public {
        _createSuccessfulCampaign();
        uint256 campaignID = 0;

        vm.prank(BLESSING);
        uint256 BLESSING_DONATION = 2;
        vm.expectEmit(true, true, false, true, address(campaignDonation));
        emit ICampaignDonation.NewDonation(BLESSING, campaignID, BLESSING_DONATION, "My Title");
        campaignDonation.donate{value: BLESSING_DONATION}(campaignID);

        vm.prank(BOB);
        uint256 BOB_DONATION = 100;
        vm.expectEmit(true, true, false, true, address(campaignDonation));
        emit ICampaignDonation.NewDonation(BOB, campaignID, BOB_DONATION, "My Title");

        vm.expectEmit(true, false, false, false, address(campaignDonation));
        emit ICampaign.CampaignGoalCompleted(ALICE, campaignID, BLESSING_DONATION + BOB_DONATION);

        campaignDonation.donate{value: BOB_DONATION}(campaignID);
    }

    function test_startNextMilestoneWhenCurrentIsMet() public {
        _createCampignWithMilestones();

        uint8 firstMilestoneID = 0;
        uint8 secondMilestoneID = 1;
        uint8 thirdMilestoneID = 2;

        uint256 campaignID = 0;

        // ========== first milestone amount -> 7 ether ==========
        vm.prank(BLESSING);
        vm.expectEmit(true, true, false, true, address(campaignDonation));
        emit ICampaignDonation.NewDonation(BLESSING, campaignID, 3 ether, "My Title");
        campaignDonation.donate{value: 3 ether}(campaignID);

        vm.prank(BOB);
        vm.expectEmit(true, true, false, true, address(campaignDonation));
        emit ICampaignDonation.NewDonation(BOB, campaignID, 4 ether, "My Title");
        vm.expectEmit(true, false, false, false, address(campaignDonation));
        emit ICampaign.MilestoneReached(campaignID, firstMilestoneID, 7 ether);
        vm.expectEmit(true, false, false, false, address(campaignDonation));
        emit ICampaign.NextMilestoneStarted(campaignID, secondMilestoneID);
        campaignDonation.donate{value: 4 ether}(campaignID); // total = 7 ethers
        // ========== first milestone amount -> 7 ether ==========

        // ========== second milestone amount -> 16 ether ==========
        vm.prank(BLESSING);
        vm.expectEmit(true, true, false, true, address(campaignDonation));
        emit ICampaignDonation.NewDonation(BLESSING, campaignID, 3 ether, "My Title");
        campaignDonation.donate{value: 3 ether}(campaignID);

        vm.prank(BOB);
        vm.expectEmit(true, false, false, false, address(campaignDonation));
        emit ICampaignDonation.NewDonation(BOB, campaignID, 6 ether, "My Title");
        vm.expectEmit(true, false, false, false, address(campaignDonation));
        emit ICampaign.MilestoneReached(campaignID, secondMilestoneID, 16 ether);
        vm.expectEmit(true, false, false, false, address(campaignDonation));
        emit ICampaign.NextMilestoneStarted(campaignID, thirdMilestoneID);
        campaignDonation.donate{value: 6 ether}(campaignID); // total = 16 ethers
        // ========== second milestone amount -> 16 ether ==========

        // ========== third milestone amount -> 40 ether ==========
        vm.prank(BLESSING);
        vm.expectEmit(true, true, false, true, address(campaignDonation));
        emit ICampaignDonation.NewDonation(BLESSING, campaignID, 5 ether, "My Title");
        campaignDonation.donate{value: 5 ether}(campaignID); // total = 21 ethers

        vm.prank(BLESSING);
        vm.expectEmit(true, true, false, true, address(campaignDonation));
        emit ICampaignDonation.NewDonation(BLESSING, campaignID, 3 ether, "My Title");
        campaignDonation.donate{value: 3 ether}(campaignID); // total = 24 ethers

        vm.prank(BOB);
        vm.expectEmit(true, true, false, true, address(campaignDonation));
        emit ICampaignDonation.NewDonation(BOB, campaignID, 36 ether, "My Title"); // total = 60 ethers
        vm.expectEmit(true, false, false, false, address(campaignDonation));
        emit ICampaign.CampaignGoalCompleted(ALICE, campaignID, 60 ether);
        campaignDonation.donate{value: 36 ether}(campaignID); // total = 16 ethers
            // ========== third milestone amount -> 40 ether ==========
    }

    function test_getAllDonors() public {
        _createSuccessfulCampaign();
        uint256 campaignID = 0;

        vm.prank(BLESSING);
        uint256 BLESSING_DONATION = 2;
        campaignDonation.donate{value: BLESSING_DONATION}(campaignID);

        vm.prank(BOB);
        uint256 BOB_DONATION = 1;
        campaignDonation.donate{value: BOB_DONATION}(campaignID);

        (address[] memory donors, uint256[] memory contributions) = campaignDonation.getCampaignDonors(campaignID);

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
        campaignDonation.donate{value: BLESSING_DONATION}(campaignID);
    }

    function test_donationFailsIfCampaignHasBeenClaimed() public {
        _createSuccessfulCampaign();
        uint256 campaignID = 0;

        vm.prank(BLESSING);
        uint256 BLESSING_DONATION = 1;
        campaignDonation.donate{value: BLESSING_DONATION}(campaignID);

        vm.warp(block.timestamp + 15 * ONE_DAY);

        vm.prank(ALICE);
        campaignDonation.withdraw(campaignID);

        vm.prank(BLESSING);
        vm.expectRevert(ICampaign.Campaign__CampaignAlreadyClaimed.selector);
        campaignDonation.donate{value: BLESSING_DONATION}(campaignID);
    }

    function test_donationFailsIfCampaignIsClosed() public {
        _createSuccessfulCampaign();
        uint256 campaignID = 0;

        vm.warp(block.timestamp + 15 * ONE_DAY);

        vm.prank(BLESSING);
        uint256 BLESSING_DONATION = 1;
        vm.expectRevert(ICampaign.Campaign__CampaignClosed.selector);
        campaignDonation.donate{value: BLESSING_DONATION}(campaignID);
    }

    function test_donorSuccessfullyGetsRefund() public {
        _createSuccessfulCampaign();

        uint256 campaignID = 0;
        uint256 donation = 5 * ONE_ETH;
        uint256 refundAmount = 3 * ONE_ETH;

        vm.prank(BLESSING);
        vm.expectEmit(true, true, false, true, address(campaignDonation));
        emit ICampaignDonation.NewDonation(BLESSING, campaignID, donation, "My Title");
        campaignDonation.donate{value: donation}(campaignID);

        vm.prank(BLESSING);
        vm.expectEmit(true, false, false, false, address(campaignDonation));
        emit ICampaignDonation.DonationRefunded(BLESSING, campaignID, refundAmount);
        campaignDonation.refund(campaignID, refundAmount);

        ICampaign.CampaignDetails memory campaign = campaignDonation.getCampaign(campaignID);

        assertEq(campaign.amountRaised, (donation - refundAmount));
    }

    function test_refundDonorsOfMilestonedCampaign() public {
        _createCampignWithMilestones(ALICE); // goal -> 40 ether
        uint256 amountNeeded = 40 * 1 ether; // gotten from _createCampignWithMilestones above

        uint256 campaignID = 0;
        uint8 firstMilestoneID = 0;
        uint256 firstMilestoneTarget = 6 ether;
        uint8 secondMilestoneID = 1;
        uint256 secondMilestoneTarget = 16 ether;
        uint8 thirdMilestoneID = 2;
        // uint256 thirdMilestoneTarget = 16 ether;

        uint256 BLESSING_DONATION = 15 ether;
        uint256 BLESSING_FIRST_REQUESTED_REFUND = 5 ether;
        uint256 BOB_DONATION = 12 ether;

        _donateToMilestoneCampaign(
            campaignID, BLESSING, BLESSING_DONATION, firstMilestoneID, firstMilestoneTarget, secondMilestoneID
        );
        _donateToMilestoneCampaign(
            campaignID, BOB, BOB_DONATION, secondMilestoneID, secondMilestoneTarget, thirdMilestoneID
        );

        uint256 BLESSING_FIRST_BALANCE = BLESSING.balance;

        vm.prank(BLESSING);
        vm.expectEmit(true, false, false, false, address(campaignDonation));
        emit ICampaignDonation.DonationRefunded(BLESSING, campaignID, BLESSING_FIRST_REQUESTED_REFUND);
        campaignDonation.refund(campaignID, BLESSING_FIRST_REQUESTED_REFUND);

        assertEq(BLESSING.balance, BLESSING_FIRST_BALANCE + BLESSING_FIRST_REQUESTED_REFUND);
        assertEq(
            campaignDonation.getCampaign(campaignID).amountRaised,
            BLESSING_DONATION + BOB_DONATION - BLESSING_FIRST_REQUESTED_REFUND
        );

        uint256 fee = (campaignDonation.getOwnerFee() * amountNeeded) / 1000;
        uint256 firstAmountWithdrawn = firstMilestoneTarget - fee;

        vm.prank(ALICE);
        vm.expectEmit(true, false, false, false, address(campaignDonation));
        emit ICampaign.CampaignFundWithdrawn(campaignID, ALICE, firstAmountWithdrawn);
        campaignDonation.withdraw(campaignID); // first milestone is 6 ether

        uint256 BLESSING_SECOND_REQUESTED_REFUND = 8 ether;

        vm.prank(BLESSING);
        vm.expectRevert(
            abi.encodeWithSelector(
                ICampaign.Campaign__WithdrawNotAllowed.selector,
                "Refunds not allowed after the first milestone funds have been withdrawn"
            )
        );
        campaignDonation.refund(campaignID, BLESSING_SECOND_REQUESTED_REFUND);
    }

    function test_noRefundIfCampaignHasBeenClaimed() public {
        _createSuccessfulCampaign();
        uint256 campaignID = 0;

        // donate
        vm.prank(BLESSING);
        vm.expectEmit(true, true, false, true, address(campaignDonation));
        emit ICampaignDonation.NewDonation(BLESSING, campaignID, ONE_ETH, "My Title");
        campaignDonation.donate{value: ONE_ETH}(campaignID);

        vm.warp(block.timestamp + 15 * ONE_DAY);

        // withdraw
        vm.prank(ALICE);
        vm.expectEmit(true, false, false, false, address(campaignDonation));
        emit ICampaign.CampaignFundWithdrawn(campaignID, BLESSING, ONE_ETH);
        campaignDonation.withdraw(campaignID);

        // refund
        vm.prank(BLESSING);
        vm.expectRevert(ICampaign.Campaign__CampaignAlreadyClaimed.selector);
        campaignDonation.refund(campaignID, ONE_ETH);
    }

    function test_noRefundIfCampaignHasBeenClosed() public {
        _createSuccessfulCampaign();
        uint256 campaignID = 0;

        // donate
        vm.prank(BLESSING);
        vm.expectEmit(true, true, false, true, address(campaignDonation));
        emit ICampaignDonation.NewDonation(BLESSING, campaignID, ONE_ETH, "My Title");
        campaignDonation.donate{value: ONE_ETH}(campaignID);

        vm.warp(block.timestamp + 17 * ONE_DAY);

        // refund
        vm.prank(BLESSING);
        vm.expectRevert(abi.encodeWithSelector(ICampaign.Campaign__RefundDeadlineElapsed.selector, campaignID));
        campaignDonation.refund(campaignID, ONE_ETH);
    }

    function test_noRefundIfDonorHasZeroDonations() public {
        _createSuccessfulCampaign();
        uint256 campaignID = 0;

        vm.prank(BLESSING);
        vm.expectRevert(
            abi.encodeWithSelector(ICampaignDonation.CampaignDonation__NoDonationFound.selector, campaignID)
        );
        campaignDonation.refund(campaignID, ONE_ETH);
    }

    function test_noRefundIfDonorWantsMoreThanTheyDonated() public {
        _createSuccessfulCampaign();
        uint256 campaignID = 0;
        uint256 donation = 5 * ONE_ETH;
        uint256 refundAmount = donation + ONE_ETH;

        // donate
        vm.prank(BLESSING);
        vm.expectEmit(true, true, false, true, address(campaignDonation));
        emit ICampaignDonation.NewDonation(BLESSING, campaignID, donation, "My Title");
        campaignDonation.donate{value: donation}(campaignID);

        // refund
        vm.prank(BLESSING);
        vm.expectRevert(
            abi.encodeWithSelector(
                ICampaignDonation.CampaignDonation__InsufficientDonation.selector, campaignID, refundAmount, donation
            )
        );
        campaignDonation.refund(campaignID, refundAmount);
    }

    function _shiftCurrentTimestampToAllowWithdraw() private {
        uint256 _refundDeadline = 10; // gotten from createSuccessfulCampaign();
        uint256 _deadline = 4; // gotten from createSuccessfulCampaign();
        vm.warp(block.timestamp + ((_refundDeadline + _deadline) * ONE_DAY));
    }

    function _createSuccessfulCampaign() private {
        uint256 _amountNeeded = 6;
        uint256 _deadline = 4; // days
        uint256 _refundDeadline = 10; // days
        string memory _title = "My Title";
        string memory _description = "My little description from my heart, soul and mind";

        _createCampaign(ALICE, _title, SUMMARY, _description, _amountNeeded, _deadline, _refundDeadline);
    }

    function _createCampaign(
        address _owner,
        string memory _title,
        string memory _summary,
        string memory _description,
        uint256 _amountNeeded,
        uint256 _deadline,
        uint256 _refundDeadline
    ) private {
        vm.startPrank(_owner);

        ICampaign.BasicMilestone[] memory _milestones;
        string[] memory categories = new string[](1);
        categories[0] = "Tester";

        // TODO: Use forge to get image metadata
        campaignDonation.createCampaign(
            _title,
            _summary,
            _description,
            "coverImage",
            _milestones,
            categories,
            _amountNeeded,
            _deadline,
            _refundDeadline
        );

        vm.stopPrank();
    }

    function _createCampignWithMilestones() private {
        _createCampignWithMilestones(ALICE);
    }

    function _createCampignWithMilestones(address owner) private {
        uint256 amountNeeded = 40 * 1 ether;
        uint256 deadline = 15; // days
        uint256 refundDeadline = 10; // days

        string[] memory categories = new string[](1);
        categories[0] = "Tester";
        ICampaign.BasicMilestone[] memory _milestones = new ICampaign.BasicMilestone[](3);

        _milestones[0] = ICampaign.BasicMilestone({targetAmount: 6 ether, deadline: 2, description: "First milestone"});

        _milestones[1] =
            ICampaign.BasicMilestone({targetAmount: 16 ether, deadline: 4, description: "Second milestone"});

        _milestones[2] =
            ICampaign.BasicMilestone({targetAmount: 40 ether, deadline: 4, description: "Second milestone"});

        vm.prank(owner);
        campaignDonation.createCampaign(
            "My Title",
            SUMMARY,
            "My little description from my heart, soul and mind",
            "coverImage",
            _milestones,
            categories,
            amountNeeded,
            deadline,
            refundDeadline
        );
    }

    function _donate(uint256 campaignID, address donor, uint256 amount) private {
        vm.prank(donor);
        vm.expectEmit(true, true, false, true, address(campaignDonation));
        emit ICampaignDonation.NewDonation(donor, campaignID, amount, "My Title");
        campaignDonation.donate{value: amount}(campaignID);
    }

    function _donateToMilestoneCampaign(
        uint256 campaignID,
        address donor,
        uint256 amount,
        uint8 currentMilestoneID,
        uint256 milestoneAmount,
        uint8 nextMilestoneID
    ) private {
        vm.prank(donor);
        vm.expectEmit(true, true, false, true, address(campaignDonation));
        emit ICampaignDonation.NewDonation(donor, campaignID, amount, "My Title");
        vm.expectEmit(true, false, false, false, address(campaignDonation));
        emit ICampaign.MilestoneReached(campaignID, currentMilestoneID, milestoneAmount);
        vm.expectEmit(true, false, false, false, address(campaignDonation));
        emit ICampaign.NextMilestoneStarted(campaignID, nextMilestoneID);
        campaignDonation.donate{value: amount}(campaignID);
    }
}
