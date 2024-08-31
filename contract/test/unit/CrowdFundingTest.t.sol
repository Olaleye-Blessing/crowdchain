// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Test, console} from "forge-std/Test.sol";
import {CrowdFunding} from "src/CrowdFunding.sol";
import {BaseCampaign} from "src/Campaign.sol";
import {DeployCrowdFunding} from "script/DeployCrowdFunding.s.sol";
import {ConstantsTest} from "test/utils/Constants.sol";

contract CrowdFundingTest is Test, ConstantsTest {
    CrowdFunding crowdFunding;
    address ALICE = makeAddr("alice");
    address BOB = makeAddr("bob");
    address BLESSING = makeAddr("blessing");

    function createCampaign(
        address _owner,
        string memory _title,
        string memory _description,
        uint32 _amountNeeded,
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

        uint32 amountNeeded = 6;
        uint64 deadline = 4; // days

        createCampaign(ALICE, "My Title", "My little description from my heart, soul and mind", amountNeeded, deadline);

        assertEq(crowdFunding.totalCampaigns(), 1);
    }

    function test_CampaignCreationFailsWithWrongInput() public {
        uint32 _amountNeeded = 6;
        string memory _title = "My Title";
        string memory _description = "My little description from my heart, soul and mind";

        // Invalid address
        vm.expectRevert(abi.encodeWithSelector(BaseCampaign.Campaign_Creation.selector, "Invalid sender address"));
        createCampaign(address(0), "", "", 0, 0);

        // Empty title
        vm.expectRevert(
            abi.encodeWithSelector(
                BaseCampaign.Campaign_Creation.selector, "Title must be between 1 and 200 characters"
            )
        );
        createCampaign(ALICE, "", "", 0, 0);

        // Title with more than 200 characters
        vm.expectRevert(
            abi.encodeWithSelector(
                BaseCampaign.Campaign_Creation.selector, "Title must be between 1 and 200 characters"
            )
        );
        createCampaign(ALICE, WORD_CHARACTERS_201, "", 0, 0);

        // Short description
        vm.expectRevert(
            abi.encodeWithSelector(
                BaseCampaign.Campaign_Creation.selector, "Description must be greater than 100 characters"
            )
        );
        createCampaign(ALICE, _title, "Desc", 0, 0);

        // 0 ETH needed donation
        vm.expectRevert(abi.encodeWithSelector(BaseCampaign.Campaign_Creation.selector, "Goal must be greater than 0"));
        createCampaign(ALICE, _title, _description, 0, 0);

        // Less than a day deadline
        vm.expectRevert(
            abi.encodeWithSelector(BaseCampaign.Campaign_Creation.selector, "Duration must be at least 1 day")
        );
        createCampaign(ALICE, _title, _description, _amountNeeded, 0);
    }

    function test_CreatedCampaignSavedCorrectly() public {
        uint32 _amountNeeded = 6;
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

        assertEq(goal, _amountNeeded);
        assertEq(amountRaised, 0);
        assertEq(owner, ALICE);
        assertEq(title, _title);
        assertEq(description, _description);
        assertEq(claimed, false);
    }

    function test_getCampaignsReturnsPaginatedResult() public {
        for (uint256 index = 0; index < NUMBER_IN_WORDS.length; index++) {
            createCampaign(ALICE, string.concat(NUMBER_IN_WORDS[index], "_title_title"), WORD_CHARACTERS_201, 20, 10);
        }

        uint256 _page = 0;
        uint256 _perPage = 3;
        (CrowdFunding.PaginatedCampaign[] memory _campaigns,) = crowdFunding.getCampaigns(_page, _perPage);

        assertEq(_campaigns.length, 3);

        assertEq(_campaigns[0].id, 0);
        assertEq(_campaigns[0].title, string.concat(NUMBER_IN_WORDS[0], "_title_title"));
        assertEq(_campaigns[1].id, 1);
        assertEq(_campaigns[1].title, string.concat(NUMBER_IN_WORDS[1], "_title_title"));
        assertEq(_campaigns[2].id, 2);
        assertEq(_campaigns[2].title, string.concat(NUMBER_IN_WORDS[2], "_title_title"));

        vm.expectRevert();
        _campaigns[3];
    }

    function test_getCampaignsReuturnsFewResult() public {
        for (uint256 index = 0; index < NUMBER_IN_WORDS.length; index++) {
            createCampaign(ALICE, string.concat(NUMBER_IN_WORDS[index], "_title_title"), WORD_CHARACTERS_201, 20, 10);
        }

        uint256 _page = 7;
        uint256 _perPage = 4;
        (CrowdFunding.PaginatedCampaign[] memory _campaigns,) = crowdFunding.getCampaigns(_page, _perPage);

        // this should return 28, 29
        assertEq(_campaigns.length, 2);

        assertEq(_campaigns[0].id, 28);
        assertEq(_campaigns[0].title, string.concat(NUMBER_IN_WORDS[28], "_title_title"));
        assertEq(_campaigns[1].id, 29);
        assertEq(_campaigns[1].title, string.concat(NUMBER_IN_WORDS[29], "_title_title"));

        vm.expectRevert();
        _campaigns[2];
    }

    function test_getOwnerCampaignsReturnsPaginatedResult() public {
        for (uint256 index = 0; index < NUMBER_IN_WORDS.length; index++) {
            createCampaign(
                ALICE, string.concat(NUMBER_IN_WORDS[index], "Alice", "_title_title"), WORD_CHARACTERS_201, 20, 10
            );
            createCampaign(
                BLESSING, string.concat(NUMBER_IN_WORDS[index], "Blessing", "_title_title"), WORD_CHARACTERS_201, 20, 10
            );
            createCampaign(
                BOB, string.concat(NUMBER_IN_WORDS[index], "Bob", "_title_title"), WORD_CHARACTERS_201, 20, 10
            );
        }

        uint256 _page = 3;
        uint256 _perPage = 4;

        (CrowdFunding.PaginatedCampaign[] memory campaigns, uint256 totalCampaigns) =
            crowdFunding.getOwnerCampaigns(BLESSING, _page, _perPage);

        assertEq(campaigns.length, 4); // total number of campaigns returned
        assertEq(totalCampaigns, 30); // total number of campaigns created by Blessing

        // make sure all returned campaigns belong to BLESSING
        for (uint256 index = 0; index < campaigns.length; index++) {
            assertEq(campaigns[0].owner, BLESSING);
        }
    }

    function test_donationSuccessful() public {
        createSuccessfulCampaign();
        uint256 campaignID = 0;

        vm.prank(BLESSING);
        uint256 BLESSING_DONATION = 2;
        crowdFunding.donate{value: BLESSING_DONATION}(campaignID);

        (,,, uint256 amountRaised,,,,) = crowdFunding.getCampaign(campaignID);

        assertEq(BLESSING_DONATION, amountRaised);

        vm.prank(BOB);
        uint256 BOB_DONATION = 1;
        crowdFunding.donate{value: BOB_DONATION}(campaignID);

        (,,, uint256 newAmountRaised,,,,) = crowdFunding.getCampaign(campaignID);

        assertEq(BOB_DONATION + BLESSING_DONATION, newAmountRaised);
    }

    function test_emitEventOnSuccessfulDonation() public {
        createSuccessfulCampaign();
        uint256 campaignID = 0;

        vm.prank(BLESSING);
        uint256 BLESSING_DONATION = 2;

        vm.expectEmit(true, false, false, false, address(crowdFunding));
        emit CrowdFunding.CrowdFunding_NewDonor(BLESSING, campaignID, BLESSING_DONATION);
        crowdFunding.donate{value: BLESSING_DONATION}(campaignID);
    }

    function test_emitAnEventWhenGoalIsMet() public {
        createSuccessfulCampaign();
        uint256 campaignID = 0;

        vm.prank(BLESSING);
        uint256 BLESSING_DONATION = 2;
        // Testing the donation event here is not neccessary
        _donateInWEI(BLESSING_DONATION, campaignID);

        vm.prank(BOB);
        uint256 BOB_DONATION = 100;

        // Testing the donation event here is neccessary because of how forge event emitter works
        vm.expectEmit(true, false, false, false, address(crowdFunding));
        emit CrowdFunding.CrowdFunding_NewDonor(BOB, campaignID, 100);
        vm.expectEmit(true, false, false, false, address(crowdFunding));
        emit BaseCampaign.Campaign_Goal_Completed(BOB, campaignID, 102);

        _donateInWEI(BOB_DONATION, campaignID);
    }

    function test_getAllDonors() public {
        createSuccessfulCampaign();
        uint256 campaignID = 0;

        vm.prank(BLESSING);
        uint256 BLESSING_DONATION = 2;
        crowdFunding.donate{value: BLESSING_DONATION}(campaignID);

        vm.prank(BOB);
        uint256 BOB_DONATION = 1;
        crowdFunding.donate{value: BOB_DONATION}(campaignID);

        (address[] memory donors, uint256[] memory contributions) = crowdFunding.getCampaignDonors(campaignID);

        assertEq(donors[0], BLESSING);
        assertEq(donors[1], BOB);

        assertEq(contributions[0], BLESSING_DONATION);
        assertEq(contributions[1], BOB_DONATION);
    }

    function test_donationFailsIfNoMoneyIsDonated() public {
        createSuccessfulCampaign();
        uint256 campaignID = 0;

        vm.prank(BLESSING);
        uint256 BLESSING_DONATION = 0;
        vm.expectRevert(BaseCampaign.Campaign_EmptyDonation.selector);
        crowdFunding.donate{value: BLESSING_DONATION}(campaignID);
    }

    // TODO: Add this when there is a logic to claim campaign
    function test_donationFailsIfCampaignHasBeenClaimed() public {}

    function test_donationFailsIfCampaignIsClosed() public {
        createSuccessfulCampaign();
        uint256 campaignID = 0;

        vm.warp(block.timestamp + 5 * ONE_DAY);

        vm.prank(BLESSING);
        uint256 BLESSING_DONATION = 1;
        vm.expectRevert(BaseCampaign.Campaign_Closed.selector);
        crowdFunding.donate{value: BLESSING_DONATION}(campaignID);
    }

    function createSuccessfulCampaign() private {
        uint32 _amountNeeded = 6;
        uint64 _deadline = 4; // days
        string memory _title = "My Title";
        string memory _description = "My little description from my heart, soul and mind";

        createCampaign(ALICE, _title, _description, _amountNeeded, _deadline);
    }

    function _donateInWEI(uint256 _donation, uint256 _campaignID) private {
        crowdFunding.donate{value: _donation * ONE_ETH}(_campaignID);
    }
}
