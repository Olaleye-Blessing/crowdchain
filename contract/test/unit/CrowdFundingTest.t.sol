// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Test, console} from "forge-std/Test.sol";
import {CrowdFunding} from "src/CrowdFunding.sol";
import {DeployCrowdFunding} from "script/DeployCrowdFunding.s.sol";
import {ConstantsTest} from "test/utils/Constants.sol";

contract CrowdFundingTest is Test, ConstantsTest {
    CrowdFunding crowdFunding;
    address ALICE = makeAddr("alice");
    address BOB = makeAddr("bob");
    address BLESSING = makeAddr("blessing");

    uint256 constant ONE_ETH = 10 ** 18; // wei

    function createCampaign(
        address _owner,
        string memory _title,
        string memory _description,
        uint256 _amountNeeded,
        uint64 _deadline
    ) private {
        vm.startPrank(_owner);

        crowdFunding.createCampaign(_title, _description, _amountNeeded, _deadline);

        vm.stopPrank();
    }

    function setUp() external {
        DeployCrowdFunding deployCrowdFunding = new DeployCrowdFunding();
        crowdFunding = deployCrowdFunding.run();

        vm.deal(ALICE, 100 ether);
        vm.deal(BOB, 100 ether);
        vm.deal(BLESSING, 100 ether);
    }

    function test_NoCampaignAtContractCreation() public view {
        assertEq(crowdFunding.totalCampaigns(), 0);
    }

    function test_CreateCampaignSuccessfully() public {
        assertEq(crowdFunding.totalCampaigns(), 0);

        uint256 amountNeeded = 6 * ONE_ETH; // eth
        uint64 deadline = 4; // days

        createCampaign(ALICE, "My Title", "My little description from my heart, soul and mind", amountNeeded, deadline);

        assertEq(crowdFunding.totalCampaigns(), 1);
    }

    function test_CampaignCreationFailsWithWrongInput() public {
        uint256 _amountNeeded = 6 * ONE_ETH; // eth
        // uint64 _deadline = 4; // days
        string memory _title = "My Title";
        string memory _description = "My little description from my heart, soul and mind";

        // Invalid address
        vm.expectRevert(
            abi.encodeWithSelector(CrowdFunding.CrowdFunding_Campaign_Creation.selector, "Invalid sender address")
        );
        createCampaign(address(0), "", "", 0, 0);

        // Empty title
        vm.expectRevert(
            abi.encodeWithSelector(
                CrowdFunding.CrowdFunding_Campaign_Creation.selector, "Title must be between 1 and 200 characters"
            )
        );
        createCampaign(ALICE, "", "", 0, 0);

        // Title with more than 200 characters
        vm.expectRevert(
            abi.encodeWithSelector(
                CrowdFunding.CrowdFunding_Campaign_Creation.selector, "Title must be between 1 and 200 characters"
            )
        );
        createCampaign(ALICE, WORD_CHARACTERS_201, "", 0, 0);

        // Short description
        vm.expectRevert(
            abi.encodeWithSelector(
                CrowdFunding.CrowdFunding_Campaign_Creation.selector, "Description must be greater than 100 characters"
            )
        );
        createCampaign(ALICE, _title, "Desc", 0, 0);

        // 0 ETH needed donation
        vm.expectRevert(
            abi.encodeWithSelector(CrowdFunding.CrowdFunding_Campaign_Creation.selector, "Goal must be greater than 0")
        );
        createCampaign(ALICE, _title, _description, 0, 0);

        // Less than a day deadline
        vm.expectRevert(
            abi.encodeWithSelector(
                CrowdFunding.CrowdFunding_Campaign_Creation.selector, "Duration must be at least 1 day"
            )
        );
        createCampaign(ALICE, _title, _description, _amountNeeded, 0);
    }

    function test_CreatedCampaignSavedCorrectly() public {
        uint256 _amountNeeded = 6 * ONE_ETH; // eth
        uint64 _deadline = 4; // days
        string memory _title = "My Title";
        string memory _description = "My little description from my heart, soul and mind";

        createCampaign(ALICE, _title, _description, _amountNeeded, _deadline);

        (
            ,
            uint256 goal,
            ,
            uint256 amountRaised,
            address owner,
            string memory title,
            string memory description,
            bool claimed
        ) = crowdFunding.getCampaign(0);

        assertEq(goal * ONE_ETH, _amountNeeded);
        assertEq(amountRaised, 0);
        assertEq(owner, ALICE);
        assertEq(title, _title);
        assertEq(description, _description);
        assertEq(claimed, false);
    }

    function test_donationSuccessful() public {
        createSuccessfulCampaign();
        uint256 campaignID = 0;

        vm.prank(BLESSING);
        uint256 BLESSING_DONATION = 2 * ONE_ETH;
        crowdFunding.donate{value: BLESSING_DONATION}(campaignID);

        (,,, uint256 amountRaised,,,,) = crowdFunding.getCampaign(campaignID);

        assertEq(BLESSING_DONATION, amountRaised * ONE_ETH);

        vm.prank(BOB);
        uint256 BOB_DONATION = 1 * ONE_ETH;
        crowdFunding.donate{value: BOB_DONATION}(campaignID);

        (,,, uint256 newAmountRaised,,,,) = crowdFunding.getCampaign(campaignID);

        assertEq(BOB_DONATION + BLESSING_DONATION, newAmountRaised * ONE_ETH);
    }

    function test_emitEventOnSuccessfulDonation() public {
        createSuccessfulCampaign();
        uint256 campaignID = 0;

        vm.prank(BLESSING);
        uint256 BLESSING_DONATION = 2 * ONE_ETH;

        vm.expectEmit(true, false, false, false, address(crowdFunding));
        emit CrowdFunding.CrowdFunding_NewDonor(BLESSING, campaignID, BLESSING_DONATION);
        crowdFunding.donate{value: BLESSING_DONATION}(campaignID);
    }

    function test_getAllDonors() public {
        createSuccessfulCampaign();
        uint256 campaignID = 0;

        vm.prank(BLESSING);
        uint256 BLESSING_DONATION = 2 * ONE_ETH;
        crowdFunding.donate{value: BLESSING_DONATION}(campaignID);

        vm.prank(BOB);
        uint256 BOB_DONATION = 1 * ONE_ETH;
        crowdFunding.donate{value: BOB_DONATION}(campaignID);

        (address[] memory donors, uint256[] memory contributions) = crowdFunding.getCampaignDonors(campaignID);

        assertEq(donors[0], BLESSING);
        assertEq(donors[1], BOB);

        assertEq(contributions[0] * ONE_ETH, BLESSING_DONATION);
        assertEq(contributions[1] * ONE_ETH, BOB_DONATION);
    }

    function test_donationFailsIfNoMoneyIsDonated() public {
        createSuccessfulCampaign();
        uint256 campaignID = 0;

        vm.prank(BLESSING);
        uint256 BLESSING_DONATION = 0;
        vm.expectRevert(CrowdFunding.CrowdFunding_EmptyDonation.selector);
        crowdFunding.donate{value: BLESSING_DONATION}(campaignID);
    }

    // TODO: Add this when there is a logic to claim campaign
    function test_donationFailsIfCampaignHasBeenClaimed() public {}

    function test_donationFailsIfCampaignIsClosed() public {
        createSuccessfulCampaign();
        uint256 campaignID = 0;

        vm.warp(block.timestamp + 5 * ONE_DAY);

        vm.prank(BLESSING);
        uint256 BLESSING_DONATION = 1 * ONE_ETH;
        vm.expectRevert(CrowdFunding.CrowdFunding_CampaignClosed.selector);
        crowdFunding.donate{value: BLESSING_DONATION}(campaignID);
    }

    function createSuccessfulCampaign() private {
        uint256 _amountNeeded = 6 * ONE_ETH; // eth
        uint64 _deadline = 4; // days
        string memory _title = "My Title";
        string memory _description = "My little description from my heart, soul and mind";

        createCampaign(ALICE, _title, _description, _amountNeeded, _deadline);
    }
}
