// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Test, console} from "forge-std/Test.sol";
import {CrowdchainToken} from "./../../src/tokens/crowdchain.sol";
import {ICampaign} from "./../../src/interfaces/ICampaign.sol";
import {ICampaignDonation} from "./../../src/interfaces/ICampaignDonation.sol";
import {DeployCampaignDonation, CampaignDonationCopy} from "./../../script/DeployCampaignDonation.s.sol";
import {ConstantsTest} from "./../utils/Constants.sol";
import {CampaignDonation, Donation} from "./../../src/CampaignDonation.sol";
import {ERC20Mock} from "./../mocks/ERC20Mock.sol";

contract CampaignDonationTest is Test, ConstantsTest {
    CampaignDonationCopy public campaignDonation;
    CrowdchainToken public crowdchainToken;
    address ALICE = makeAddr("alice");
    address BOB = makeAddr("bob");
    address BLESSING = makeAddr("blessing");
    address usdc;
    address dai;

    function setUp() external {
        vm.deal(DEPLOYER, 100 ether);
        vm.prank(DEPLOYER);
        DeployCampaignDonation deployCampaign = new DeployCampaignDonation();
        (campaignDonation, crowdchainToken) = deployCampaign.run();

        vm.deal(ALICE, 100 ether);
        vm.deal(BOB, 100 ether);
        vm.deal(BLESSING, 100 ether);

        address[] memory supportedCoins = campaignDonation.getSupportedCoins();
        usdc = supportedCoins[1];
        dai = supportedCoins[2];

        ERC20Mock(usdc).mint(BLESSING, 1_000_000e18);
        ERC20Mock(dai).mint(BLESSING, 1_000_000e18);
        ERC20Mock(usdc).mint(BOB, 1_000_0000e8);
        ERC20Mock(dai).mint(BOB, 1_000_0000e18);
        ERC20Mock(usdc).mint(ALICE, 1_000_0000e8);
        ERC20Mock(dai).mint(ALICE, 1_000_0000e18);
    }

    function test_donationSuccessful() public {
        _createSuccessfulCampaign(ALICE, 4e18);

        uint256 campaignID = 0;
        uint256 ETH_DONATION = 4 ether;
        uint256 USDC_DONATION = 1e8;
        uint256 DAI_DONATION = 3e18;

        _approveERC20(BLESSING, usdc, USDC_DONATION);
        _approveERC20(BLESSING, dai, DAI_DONATION);

        vm.startPrank(BLESSING);

        vm.expectEmit(true, true, true, true, address(campaignDonation));
        emit ICampaignDonation.NewDonation(BLESSING, campaignID, ETH_ADDRESS, ETH_DONATION, "My Title");
        campaignDonation.donateETH{value: ETH_DONATION}(campaignID);

        vm.expectEmit(true, true, true, true, address(campaignDonation));
        emit ICampaignDonation.NewDonation(BLESSING, campaignID, usdc, USDC_DONATION, "My Title");
        campaignDonation.donateToken(campaignID, USDC_DONATION, usdc);

        vm.expectEmit(true, true, true, true, address(campaignDonation));
        emit ICampaignDonation.NewDonation(BLESSING, campaignID, dai, DAI_DONATION, "My Title");
        campaignDonation.donateToken(campaignID, DAI_DONATION, dai);

        (, uint256[] memory amount) = campaignDonation.getAmountRaisedPerCoin(campaignID);

        assertEq(amount[0], ETH_DONATION);
        assertEq(amount[1], USDC_DONATION);
        assertEq(amount[2], DAI_DONATION);
    }

    function test_donationFailsIfNoMoneyIsDonated() public {
        _createSuccessfulCampaign(ALICE, 4e18);
        uint256 campaignID = 0;

        vm.prank(BLESSING);
        uint256 BLESSING_DONATION = 0;
        vm.expectRevert(ICampaignDonation.CampaignDonation__EmptyDonation.selector);
        campaignDonation.donateETH{value: BLESSING_DONATION}(campaignID);
    }

    function test_donationFailsIfCampaignHasBeenClaimed() public {
        uint256 ETH_DONATION = 12 ether;
        _createFundAndClaimCampaign(BLESSING, ETH_ADDRESS, ETH_DONATION);

        uint256 campaignID = 0;

        vm.prank(BOB);
        uint256 BOB_DONATION = 1 ether;
        vm.expectRevert(ICampaignDonation.CampaignDonation__CampaignAlreadyClaimed.selector);
        campaignDonation.donateETH{value: BOB_DONATION}(campaignID);
    }

    function test_donationFailsIfCampaignIsClosed() public {
        uint256 goal = 4000e18; // $4,000
        _createSuccessfulCampaign(ALICE, goal);
        uint256 campaignID = 0;

        vm.warp(block.timestamp + 15 days);

        vm.prank(BLESSING);
        uint256 BLESSING_DONATION = 1 ether;
        vm.expectRevert(ICampaignDonation.CampaignDonation__CampaignClosed.selector);
        campaignDonation.donateETH{value: BLESSING_DONATION}(campaignID);
    }

    function test_getTotalDonors() public {
        _createSuccessfulCampaign(ALICE, 4e18);

        uint256 campaignID = 0;
        uint256 ETH_DONATION = 4 ether;
        uint256 USDC_DONATION = 1e18;
        uint256 DAI_DONATION = 3e18;

        vm.startPrank(BLESSING);
        vm.expectEmit(true, true, true, true, address(campaignDonation));
        emit ICampaignDonation.NewDonation(BLESSING, campaignID, ETH_ADDRESS, ETH_DONATION, "My Title");
        campaignDonation.donateETH{value: ETH_DONATION}(campaignID);

        ERC20Mock(usdc).approve(address(campaignDonation), USDC_DONATION);

        vm.expectEmit(true, true, true, true, address(campaignDonation));
        emit ICampaignDonation.NewDonation(BLESSING, campaignID, usdc, USDC_DONATION, "My Title");
        campaignDonation.donateToken(campaignID, USDC_DONATION, usdc);

        vm.stopPrank();

        vm.startPrank(BOB);
        ERC20Mock(dai).approve(address(campaignDonation), DAI_DONATION);

        vm.expectEmit(true, true, true, true, address(campaignDonation));
        emit ICampaignDonation.NewDonation(BOB, campaignID, dai, DAI_DONATION, "My Title");
        campaignDonation.donateToken(campaignID, DAI_DONATION, dai);

        uint256 expectedTotalDonors = 2;

        assertEq(campaignDonation.getTotalCampaignDonors(0).length, expectedTotalDonors);
    }

    function test_getCampaignDonations() external {
        _createSuccessfulCampaign(ALICE, 4e18);

        uint256 campaignID = 0;
        uint256 ETH_DONATION = 4 ether;
        uint256 USDC_DONATION = 1e8;
        uint256 DAI_DONATION = 3e18;

        // ============ Donations ========
        // ============ Donations ========
        // ============ Donations ========
        _donate(BLESSING, ETH_ADDRESS, ETH_DONATION);
        Donation memory firstDonation =
            Donation({donor: BLESSING, coin: ETH_ADDRESS, amount: ETH_DONATION, timestamp: 0});

        _approveAndDonateERC20(BOB, dai, DAI_DONATION);
        Donation memory secondDonation = Donation({donor: BOB, coin: dai, amount: DAI_DONATION, timestamp: 0});

        _approveAndDonateERC20(ALICE, dai, DAI_DONATION);
        Donation memory thirdDonation = Donation({donor: ALICE, coin: dai, amount: DAI_DONATION, timestamp: 0});

        _approveAndDonateERC20(BOB, usdc, USDC_DONATION);

        _approveAndDonateERC20(BLESSING, dai, DAI_DONATION);

        _donate(BOB, ETH_ADDRESS, ETH_DONATION);

        _approveAndDonateERC20(ALICE, usdc, USDC_DONATION);
        // ============ Donations ========
        // ============ Donations ========
        // ============ Donations ========

        uint256 page = 0;
        uint256 perPage = 3;

        (Donation[] memory donations, uint256 totalDonations) =
            campaignDonation.getCampaignDonations(campaignID, page, perPage);

        assertEq(totalDonations, 7);
        assertEq(donations.length, perPage);

        assertEq(donations[0].donor, firstDonation.donor);
        assertEq(donations[0].coin, firstDonation.coin);
        assertEq(donations[0].amount, firstDonation.amount);

        assertEq(donations[1].donor, secondDonation.donor);
        assertEq(donations[1].coin, secondDonation.coin);
        assertEq(donations[1].amount, secondDonation.amount);

        assertEq(donations[2].donor, thirdDonation.donor);
        assertEq(donations[2].coin, thirdDonation.coin);
        assertEq(donations[2].amount, thirdDonation.amount);
    }

    function test_withdrawSuccessfully() public {
        uint256 goal = 4000e18; // $4,000
        _createSuccessfulCampaign(ALICE, goal);

        uint256 campaignID = 0;

        uint256 USDC_DONATION = 2e8;
        _approveAndDonateERC20(BLESSING, usdc, USDC_DONATION);

        uint256 ETH_DONATION = 2 ether;
        _donate(BLESSING, ETH_ADDRESS, ETH_DONATION);

        _shiftCurrentTimestampToAllowWithdraw();

        uint256 ALICE_ETH_BALANCE = ALICE.balance;
        uint256 ALICE_USDC_BALANCE = ERC20Mock(usdc).balanceOf(ALICE);

        vm.prank(ALICE);
        vm.expectEmit(true, true, true, true, address(campaignDonation));
        emit ICampaignDonation.CampaignFundWithdrawn(campaignID, ALICE, ETH_ADDRESS, ETH_DONATION);
        emit ICampaignDonation.CampaignFundWithdrawn(campaignID, ALICE, usdc, USDC_DONATION);
        campaignDonation.withdraw(campaignID);

        uint256 ALICE_ETH_NEW_BALANCE = ALICE.balance;
        uint256 ALICE_USDC_NEW_BALANCE = ERC20Mock(usdc).balanceOf(ALICE);

        assertEq(ALICE_ETH_BALANCE + ETH_DONATION, ALICE_ETH_NEW_BALANCE);
        assertEq(ALICE_USDC_BALANCE + USDC_DONATION, ALICE_USDC_NEW_BALANCE);
    }

    function test_withdrawMilestonedCampaign() public {
        uint256 goal = 4000e18; // $4,000
        uint256 firstMilestoneGoal = 2000e18;
        uint256 secondMilestoneGoal = 4000e18;

        ICampaign.BasicMilestone[] memory milestones = new ICampaign.BasicMilestone[](2);

        milestones[0] = ICampaign.BasicMilestone({
            targetAmount: firstMilestoneGoal,
            deadline: 3, // days
            description: "First milestone"
        });

        milestones[1] = ICampaign.BasicMilestone({
            targetAmount: secondMilestoneGoal,
            deadline: 6, // days
            description: "Second milestone"
        });

        _createCampignWithMilestones(ALICE, goal, milestones);
        uint256 campaignID = 0;
        uint256 ALICE_ETH_BALANCE = ALICE.balance;
        uint256 ALICE_USDC_BALANCE = ERC20Mock(usdc).balanceOf(ALICE);
        uint256 ALICE_DAI_BALANCE = ERC20Mock(dai).balanceOf(ALICE);

        uint256 BLESSING_ETH_DONATION = 0.5 ether; // $1500
        uint256 BLESSING_FIRST_USDC_DONATION = 600e8; // $600

        _donate(BLESSING, ETH_ADDRESS, BLESSING_ETH_DONATION);
        _approveAndDonateERC20(BLESSING, usdc, BLESSING_FIRST_USDC_DONATION);

        _shiftCurrentTimestampToAllowWithdraw(4 days);

        vm.prank(ALICE);
        _listenToWithdrawnEmit(ALICE, ETH_ADDRESS, BLESSING_ETH_DONATION);
        _listenToWithdrawnEmit(ALICE, usdc, BLESSING_FIRST_USDC_DONATION);
        campaignDonation.withdraw(campaignID);

        uint256 ALICE_FIRST_ETH_BALANCE = ALICE.balance;
        uint256 ALICE_FIRST_USDC_BALANCE = ERC20Mock(usdc).balanceOf(ALICE);
        uint256 ALICE_FIRST_DAI_BALANCE = ERC20Mock(dai).balanceOf(ALICE);

        assertEq(ALICE_FIRST_ETH_BALANCE, ALICE_ETH_BALANCE + BLESSING_ETH_DONATION);
        assertEq(ALICE_FIRST_USDC_BALANCE, ALICE_USDC_BALANCE + BLESSING_FIRST_USDC_DONATION);
        assertEq(ALICE_FIRST_DAI_BALANCE, ALICE_DAI_BALANCE);

        // ============ SECOND DONATION PHASE -> $4000 =================
        // first donation = $2100

        // $2,700 + $2,100 = $4,800 > $4,000
        uint256 BOB_DAI_DONATION = 2000e18; // $2000
        uint256 BLESSING_SECOND_USDC_DONATION = 700e8; // $700

        _approveAndDonateERC20(BOB, dai, BOB_DAI_DONATION);
        _approveAndDonateERC20(BLESSING, usdc, BLESSING_SECOND_USDC_DONATION);

        _shiftCurrentTimestampToAllowWithdraw(6 days + 1 seconds);

        vm.prank(ALICE);
        _listenToWithdrawnEmit(ALICE, usdc, BLESSING_SECOND_USDC_DONATION);
        _listenToWithdrawnEmit(ALICE, dai, BOB_DAI_DONATION);
        campaignDonation.withdraw(campaignID);

        uint256 ALICE_SECOND_ETH_BALANCE = ALICE.balance;
        uint256 ALICE_SECOND_USDC_BALANCE = ERC20Mock(usdc).balanceOf(ALICE);
        uint256 ALICE_SECOND_DAI_BALANCE = ERC20Mock(dai).balanceOf(ALICE);

        assertEq(ALICE_SECOND_ETH_BALANCE, ALICE_FIRST_ETH_BALANCE);
        assertEq(ALICE_SECOND_USDC_BALANCE, ALICE_FIRST_USDC_BALANCE + BLESSING_SECOND_USDC_DONATION);
        assertEq(ALICE_SECOND_DAI_BALANCE, ALICE_FIRST_DAI_BALANCE + BOB_DAI_DONATION);
    }

    function test_withdrawFailIfNotCampaignOwner() public {
        _createAndFundCamapign(BLESSING, ETH_ADDRESS, 1 ether);

        _shiftCurrentTimestampToAllowWithdraw();

        vm.prank(BOB);
        vm.expectRevert(ICampaignDonation.CampaignDonation__NotCampaignOwner.selector);
        campaignDonation.withdraw(0);
    }

    function test_withdrawFailIfRefundDeadlineIsActive() public {
        _createAndFundCamapign(BLESSING, ETH_ADDRESS, 1 ether);

        // deadline -> 4 days
        // refund deadline -> 10 days
        _shiftCurrentTimestampToAllowWithdraw(6 days);

        vm.prank(ALICE);
        vm.expectRevert(
            abi.encodeWithSelector(
                ICampaignDonation.CampaignDonation__WithdrawNotAllowed.selector,
                "Cannot withdraw before refund deadline"
            )
        );
        campaignDonation.withdraw(0);
    }

    function test_getAllDonors() public {
        // _createSuccessfulCampaign();
        // uint256 campaignID = 0;

        // vm.prank(BLESSING);
        // uint256 BLESSING_DONATION = 2;
        // campaignDonation.donateETH{value: BLESSING_DONATION}(campaignID);

        // vm.prank(BOB);
        // uint256 BOB_DONATION = 1;
        // campaignDonation.donateETH{value: BOB_DONATION}(campaignID);

        // (address[] memory donors, uint256[] memory contributions) = campaignDonation.getCampaignDonors(campaignID);

        // assertEq(donors[0], BLESSING);
        // assertEq(donors[1], BOB);

        // assertEq(contributions[0], BLESSING_DONATION);
        // assertEq(contributions[1], BOB_DONATION);
    }

    function test_donorSuccessfullyGetsRefund() public {
        _createSuccessfulCampaign(ALICE, 4e18);

        uint256 campaignID = 0;
        uint256 ETH_DONATION = 4 ether;
        uint256 ETH_REFUND = 3 ether;
        uint256 USDC_DONATION = 1e8;
        uint256 USDC_REFUND = 1e8;
        uint256 DAI_DONATION = 3e18;
        uint256 DAI_REFUND = 3e18;

        _approveAndDonateERC20(BLESSING, usdc, USDC_DONATION);
        _approveAndDonateERC20(BLESSING, dai, DAI_DONATION);

        vm.startPrank(BLESSING);
        vm.expectEmit(true, true, true, true, address(campaignDonation));
        emit ICampaignDonation.NewDonation(BLESSING, campaignID, ETH_ADDRESS, ETH_DONATION, "My Title");
        campaignDonation.donateETH{value: ETH_DONATION}(campaignID);

        (, uint256[] memory amountRaised) = campaignDonation.getAmountRaisedPerCoin(0);
        uint256 ETH_RAISED = amountRaised[0];
        uint256 USDC_RAISED = amountRaised[1];
        uint256 DAI_RAISED = amountRaised[2];

        assertEq(ETH_RAISED, ETH_DONATION);
        assertEq(USDC_RAISED, USDC_DONATION);
        assertEq(DAI_RAISED, DAI_DONATION);

        vm.expectEmit(true, false, false, false, address(campaignDonation));
        emit ICampaignDonation.DonationRefunded(BLESSING, campaignID, ETH_ADDRESS, ETH_REFUND);
        campaignDonation.refundETH(campaignID, ETH_REFUND);

        vm.expectEmit(true, false, false, false, address(campaignDonation));
        emit ICampaignDonation.DonationRefunded(BLESSING, campaignID, usdc, USDC_REFUND);
        campaignDonation.refundToken(campaignID, USDC_REFUND, usdc);

        vm.expectEmit(true, false, false, false, address(campaignDonation));
        emit ICampaignDonation.DonationRefunded(BLESSING, campaignID, dai, DAI_REFUND);
        campaignDonation.refundToken(campaignID, DAI_REFUND, dai);

        (, uint256[] memory newAmountRaised) = campaignDonation.getAmountRaisedPerCoin(0);
        uint256 NEW_ETH_RAISED = newAmountRaised[0];
        uint256 NEW_USDC_RAISED = newAmountRaised[1];
        uint256 NEW_DAI_RAISED = newAmountRaised[2];

        assertEq(NEW_ETH_RAISED, ETH_RAISED - ETH_REFUND);
        assertEq(NEW_USDC_RAISED, USDC_RAISED - USDC_REFUND);
        assertEq(NEW_DAI_RAISED, DAI_RAISED - DAI_REFUND);
    }

    function test_noRefundIfFirstMilestoneHasBeenClaimed() public {
        uint256 goal = 4000e18; // $4,000
        uint256 firstMilestoneGoal = 2000e18;
        uint256 secondMilestoneGoal = 4000e18;

        ICampaign.BasicMilestone[] memory milestones = new ICampaign.BasicMilestone[](2);

        milestones[0] = ICampaign.BasicMilestone({
            targetAmount: firstMilestoneGoal,
            deadline: 3, // days
            description: "First milestone"
        });

        milestones[1] = ICampaign.BasicMilestone({
            targetAmount: secondMilestoneGoal,
            deadline: 6, // days
            description: "Second milestone"
        });

        _createCampignWithMilestones(ALICE, goal, milestones);

        uint256 campaignID = 0;

        uint256 BLESSING_ETH_DONATION = 0.5 ether; // $1500
        uint256 BLESSING_FIRST_USDC_DONATION = 600e8; // $600

        _donate(BLESSING, ETH_ADDRESS, BLESSING_ETH_DONATION);
        _approveAndDonateERC20(BLESSING, usdc, BLESSING_FIRST_USDC_DONATION);

        _shiftCurrentTimestampToAllowWithdraw(4 days);

        vm.prank(ALICE);
        _listenToWithdrawnEmit(ALICE, ETH_ADDRESS, BLESSING_ETH_DONATION);
        _listenToWithdrawnEmit(ALICE, usdc, BLESSING_FIRST_USDC_DONATION);
        campaignDonation.withdraw(campaignID);

        vm.prank(BLESSING);
        vm.expectRevert(
            abi.encodeWithSelector(
                ICampaignDonation.CampaignDonation__WithdrawNotAllowed.selector,
                "Refunds not allowed after the first milestone funds have been withdrawn"
            )
        );
        campaignDonation.refundETH(campaignID, BLESSING_ETH_DONATION);
    }

    function test_noRefundIfCampaignHasBeenClaimed() public {
        uint256 donation = 3 ether;
        _createFundAndClaimCampaign(BLESSING, ETH_ADDRESS, donation);

        vm.prank(BLESSING);
        vm.expectRevert(ICampaignDonation.CampaignDonation__CampaignAlreadyClaimed.selector);
        campaignDonation.refundETH(0, donation);
    }

    function test_noRefundIfCampaignHasBeenClosed() public {
        uint256 goal = 4000e18; // $4,000
        _createSuccessfulCampaign(ALICE, goal);

        vm.warp(block.timestamp + 17 * 1 days);

        uint256 campaignID = 0;

        vm.prank(BLESSING);
        vm.expectRevert(
            abi.encodeWithSelector(ICampaignDonation.CampaignDonation__RefundDeadlineElapsed.selector, campaignID)
        );
        campaignDonation.refundETH(campaignID, 1 ether);
    }

    function test_noRefundIfDonorHasZeroDonations() public {
        uint256 goal = 4000e18; // $4,000
        _createSuccessfulCampaign(ALICE, goal);

        uint256 campaignID = 0;

        vm.prank(BLESSING);
        vm.expectRevert(
            abi.encodeWithSelector(ICampaignDonation.CampaignDonation__NoDonationFound.selector, campaignID)
        );
        campaignDonation.refundETH(campaignID, 1 ether);
    }

    function test_noRefundIfDonorWantsMoreThanTheyDonated() public {
        uint256 donation = 1 ether;
        uint256 refundAmount = 2 ether;

        _createAndFundCamapign(BLESSING, ETH_ADDRESS, donation);

        uint256 campaignID = 0;

        // refund
        vm.prank(BLESSING);
        vm.expectRevert(
            abi.encodeWithSelector(
                ICampaignDonation.CampaignDonation__InsufficientDonation.selector, campaignID, refundAmount, donation
            )
        );
        campaignDonation.refundETH(campaignID, refundAmount);
    }

    function test_getCoinPrice() public view {
        // all prices is shifted to 18 decimals
        uint256 expectedETHPRice = 3000e18; // $3000
        uint256 expectedUSDCPRice = 1e18; // $1
        uint256 expectedDAIPRice = 1e18; // $1
        uint256 ETHPrice = campaignDonation.getCoinPrice(ETH_ADDRESS);
        uint256 USDCPrice = campaignDonation.getCoinPrice(usdc);
        uint256 DAIPrice = campaignDonation.getCoinPrice(dai);

        assertEq(ETHPrice, expectedETHPRice);
        assertEq(USDCPrice, expectedUSDCPRice);
        assertEq(DAIPrice, expectedDAIPRice);
    }

    function test_getCoinValueInUSD() external view {
        uint256 ethAmount = 3 ether;
        uint256 ethExpectedValueInUsd = 9000e18;

        uint256 usdcAmount = 6e8;
        uint256 usdcExpectedValueInUsd = 6e18;

        assertEq(ethExpectedValueInUsd, campaignDonation.coinValueInUSD(ETH_ADDRESS, ethAmount));
        assertEq(usdcExpectedValueInUsd, campaignDonation.coinValueInUSD(usdc, usdcAmount));
    }

    function _shiftCurrentTimestampToAllowWithdraw() private {
        uint256 _refundDeadline = 10 days; // gotten from createSuccessfulCampaign();
        uint256 _deadline = 4 days; // gotten from createSuccessfulCampaign();
        vm.warp(block.timestamp + _refundDeadline + _deadline + 1 days);
    }

    function _shiftCurrentTimestampToAllowWithdraw(uint256 duration) private {
        vm.warp(block.timestamp + duration);
    }

    function _createSuccessfulCampaign(address _owner, uint256 _amountNeeded) private {
        // uint256 _amountNeeded = 6;
        uint256 _deadline = 4; // days
        uint256 _refundDeadline = 10; // days
        string memory _title = "My Title";
        string memory _description = "My little description from my heart, soul and mind";

        _createCampaign(_owner, _title, SUMMARY, _description, _amountNeeded, _deadline, _refundDeadline);
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

    function _createCampignWithMilestones(address owner, uint256 goal, ICampaign.BasicMilestone[] memory milestones)
        private
    {
        uint256 duration = 6 days;
        uint256 refundDeadline = 7 days;

        string[] memory categories = new string[](1);
        categories[0] = "Tester";

        vm.prank(owner);
        campaignDonation.createCampaign(
            "My Title",
            SUMMARY,
            "My little description from my heart, soul and mind",
            "coverImage",
            milestones,
            categories,
            goal,
            duration,
            refundDeadline
        );
    }

    function _createMilestones(uint256[] memory deadlines, uint256[] memory goals)
        private
        pure
        returns (ICampaign.BasicMilestone[] memory milestones)
    {
        milestones = new ICampaign.BasicMilestone[](deadlines.length);

        for (uint256 index = 0; index < deadlines.length; index++) {
            milestones[index] = ICampaign.BasicMilestone({
                targetAmount: goals[index],
                deadline: deadlines[index],
                description: "Description Description Description"
            });
        }

        return milestones;
    }

    function _donate(address donor, address coin, uint256 amount) private {
        _donate(0, donor, coin, amount, "My Title");
    }

    function _donate(uint256 campaignID, address donor, address coin, uint256 amount, string memory campaignTitle)
        private
    {
        vm.prank(donor);

        vm.expectEmit(true, true, true, true, address(campaignDonation));
        emit ICampaignDonation.NewDonation(donor, campaignID, coin, amount, campaignTitle);

        coin == ETH_ADDRESS
            ? campaignDonation.donateETH{value: amount}(campaignID)
            : campaignDonation.donateToken(campaignID, amount, coin);
    }

    function _approveERC20(address owner, address coin, uint256 amount) private {
        vm.prank(owner);
        ERC20Mock(coin).approve(address(campaignDonation), amount);
    }

    function _approveAndDonateERC20(address owner, address coin, uint256 amount) private {
        _approveERC20(owner, coin, amount);
        _donate(owner, coin, amount);
    }

    function _listenToWithdrawnEmit(address owner, address coin, uint256 amount) private {
        vm.expectEmit(true, true, true, true, address(campaignDonation));
        emit ICampaignDonation.CampaignFundWithdrawn(0, owner, coin, amount);
    }

    function _createAndFundCamapign(address donator, address coin, uint256 amount) private {
        uint256 goal = 4000e18; // $4,000
        _createSuccessfulCampaign(ALICE, goal);
        _donate(donator, coin, amount);
    }

    function _createFundAndClaimCampaign(address donator, address coin, uint256 amount) private {
        _createAndFundCamapign(donator, coin, amount);

        uint256 campaignID = 0;

        _shiftCurrentTimestampToAllowWithdraw();

        vm.prank(ALICE);
        vm.expectEmit(true, true, true, true, address(campaignDonation));
        emit ICampaignDonation.CampaignFundWithdrawn(campaignID, ALICE, coin, amount);
        campaignDonation.withdraw(campaignID);
    }
}
