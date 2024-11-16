// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Test, console} from "forge-std/Test.sol";
import {CampaignBase} from "./../../src/CampaignBase.sol";
import {CrowdchainToken} from "./../../src/tokens/crowdchain.sol";
import {ICampaign} from "./../../src/interfaces/ICampaign.sol";
import {DeployCampaignBase} from "./../../script/DeployCampaignBase.s.sol";
import {ConstantsTest} from "./../utils/Constants.sol";

contract CampaignBaseTest is Test, ConstantsTest {
    CampaignBase public campaignBase;
    CrowdchainToken public crowdchainToken;
    address ALICE = makeAddr("alice");
    address BOB = makeAddr("bob");
    address BLESSING = makeAddr("blessing");

    function setUp() external {
        vm.deal(DEPLOYER, 100 ether);
        vm.prank(DEPLOYER);
        DeployCampaignBase deployCampaign = new DeployCampaignBase();
        (campaignBase, crowdchainToken) = deployCampaign.run();

        vm.deal(ALICE, 100 ether);
        vm.deal(BOB, 100 ether);
        vm.deal(BLESSING, 100 ether);
    }

    function test_contractBelongsToTheCorrectOwner() public view {
        address owner = campaignBase.getOwner();

        assertNotEq(BOB, owner);
        assertEq(DEPLOYER, owner);
    }

    function test_createCampaignWithMilestonesSuccessfully() public {
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

        vm.prank(ALICE);
        campaignBase.createCampaign(
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

    function test_CampaignCreationFailsWithWrongInput() public {
        uint256 _amountNeeded = 6;
        string memory _title = "My Title";
        string memory _description = "My little description from my heart, soul and mind";

        // Invalid address
        vm.expectRevert(
            abi.encodeWithSelector(ICampaign.Campaign__CampaignCreationFailed.selector, "Invalid sender address")
        );
        _createCampaign(address(0), "", "", "", 0, 0, 0);

        // Empty title
        vm.expectRevert(
            abi.encodeWithSelector(ICampaign.Campaign__CampaignCreationFailed.selector, "Invalid title length")
        );
        _createCampaign(ALICE, "", "", "", 0, 0, 0);

        // Title with more than 200 characters
        vm.expectRevert(
            abi.encodeWithSelector(ICampaign.Campaign__CampaignCreationFailed.selector, "Invalid title length")
        );
        _createCampaign(ALICE, WORD_CHARACTERS_201, "", "", 0, 0, 0);

        // Short Summary
        vm.expectRevert(
            abi.encodeWithSelector(ICampaign.Campaign__CampaignCreationFailed.selector, "Summary too short")
        );
        _createCampaign(ALICE, _title, "Summary", "Desc", 0, 0, 0);

        // Short description
        vm.expectRevert(
            abi.encodeWithSelector(ICampaign.Campaign__CampaignCreationFailed.selector, "Description too short")
        );
        _createCampaign(ALICE, _title, SUMMARY, "Desc", 0, 0, 0);

        // 0 ETH needed donation
        vm.expectRevert(
            abi.encodeWithSelector(ICampaign.Campaign__CampaignCreationFailed.selector, "Goal must be greater than 0")
        );
        _createCampaign(ALICE, _title, SUMMARY, _description, 0, 0, 0);

        // Less than a day deadline
        vm.expectRevert(
            abi.encodeWithSelector(
                ICampaign.Campaign__CampaignCreationFailed.selector, "Duration must be at least 1 day"
            )
        );
        _createCampaign(ALICE, _title, SUMMARY, _description, _amountNeeded, 0, 9);

        // Less than 5 days refund deadline
        vm.expectRevert(
            abi.encodeWithSelector(
                ICampaign.Campaign__CampaignCreationFailed.selector,
                "Refund deadline must be at least 5 days after deadline"
            )
        );
        _createCampaign(ALICE, _title, SUMMARY, _description, _amountNeeded, 4, 4);

        // category
        string[] memory _categories = new string[](0);
        vm.expectRevert(
            abi.encodeWithSelector(ICampaign.Campaign__CampaignCreationFailed.selector, "Provide at least one category")
        );
        _createCampaign(ALICE, _title, SUMMARY, _description, _amountNeeded, 4, 5, _categories);

        // More than max categories
        string[] memory _moreCategories = new string[](6);
        _moreCategories[0] = "Tester";
        _moreCategories[1] = "Tester1";
        _moreCategories[2] = "Tester2";
        _moreCategories[3] = "Tester3";
        _moreCategories[4] = "Tester4";
        _moreCategories[5] = "Tester5";

        vm.expectRevert(
            abi.encodeWithSelector(ICampaign.Campaign__CampaignCreationFailed.selector, "Maximum of 5 categories")
        );
        _createCampaign(ALICE, _title, SUMMARY, _description, _amountNeeded, 4, 5, _moreCategories);

        // An empty category
        string[] memory _emptyCategories = new string[](2);
        _emptyCategories[0] = "Tester";
        _emptyCategories[1] = "";

        vm.expectRevert(
            abi.encodeWithSelector(
                ICampaign.Campaign__CampaignCreationFailed.selector, "Category can not be an empty string"
            )
        );
        _createCampaign(ALICE, _title, SUMMARY, _description, _amountNeeded, 4, 5, _emptyCategories);

        // Duplicate category
        string[] memory _duplicateCategories = new string[](2);
        _duplicateCategories[0] = "Tester";
        _duplicateCategories[1] = "Tester";

        vm.expectRevert(
            abi.encodeWithSelector(ICampaign.Campaign__CampaignCreationFailed.selector, "Remove duplicate category")
        );
        _createCampaign(ALICE, _title, SUMMARY, _description, _amountNeeded, 4, 5, _duplicateCategories);
    }

    function test_campaignCreationFailsIfMilestonesAreMoreThan4() public {
        uint256 amountNeeded = 40 * 1 ether;
        uint256 deadline = 15; // days
        uint256 refundDeadline = 10; // days

        string[] memory categories = new string[](1);
        categories[0] = "Tester";

        ICampaign.BasicMilestone[] memory _milestones = new ICampaign.BasicMilestone[](5);

        _milestones[0] = ICampaign.BasicMilestone({targetAmount: 6 ether, deadline: 2, description: "First milestone"});

        _milestones[1] =
            ICampaign.BasicMilestone({targetAmount: 16 ether, deadline: 4, description: "Second milestone"});

        _milestones[2] =
            ICampaign.BasicMilestone({targetAmount: 20 ether, deadline: 4, description: "Second milestone"});

        _milestones[3] =
            ICampaign.BasicMilestone({targetAmount: 30 ether, deadline: 4, description: "Second milestone"});

        _milestones[4] =
            ICampaign.BasicMilestone({targetAmount: 40 ether, deadline: 4, description: "Second milestone"});

        vm.expectRevert(
            abi.encodeWithSelector(
                ICampaign.Campaign__CampaignCreationFailed.selector, "You can only have maximum of 4 milestones"
            )
        );
        vm.prank(ALICE);
        campaignBase.createCampaign(
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

    function test_campaignCreationFailsIfLastMilestoneTargetIsNotEqualToGoal() public {
        uint256 amountNeeded = 40 * 1 ether;
        uint256 deadline = 15; // days
        uint256 refundDeadline = 10; // days

        string[] memory categories = new string[](1);
        categories[0] = "Tester";

        ICampaign.BasicMilestone[] memory _milestones = new ICampaign.BasicMilestone[](2);

        _milestones[0] = ICampaign.BasicMilestone({targetAmount: 16 ether, deadline: 2, description: "First milestone"});

        _milestones[1] =
            ICampaign.BasicMilestone({targetAmount: 41 ether, deadline: 4, description: "Second milestone"});

        vm.expectRevert(
            abi.encodeWithSelector(
                ICampaign.Campaign__CampaignCreationFailed.selector,
                "Last milestone target amount must be equal to campaign goal"
            )
        );
        vm.prank(ALICE);
        campaignBase.createCampaign(
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

    function test_campaignCreationFailsIfMilestoneDeadlineIsNotLessThanDuration() public {
        uint256 amountNeeded = 40 * 1 ether;
        uint256 deadline = 15; // days
        uint256 refundDeadline = 10; // days

        string[] memory categories = new string[](1);
        categories[0] = "Tester";

        ICampaign.BasicMilestone[] memory _milestones = new ICampaign.BasicMilestone[](2);

        _milestones[0] = ICampaign.BasicMilestone({targetAmount: 6 ether, deadline: 6, description: "First milestone"});

        _milestones[1] =
            ICampaign.BasicMilestone({targetAmount: 40 ether, deadline: 16, description: "Second milestone"});

        vm.expectRevert(
            abi.encodeWithSelector(
                ICampaign.Campaign__CampaignCreationFailed.selector,
                "The deadline of the last milestone must not be greater than the total duration"
            )
        );
        vm.prank(ALICE);
        campaignBase.createCampaign(
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

    function test_CreatedCampaignSavedCorrectly() public {
        uint256 _amountNeeded = 6;
        uint256 _deadline = 4; // days
        uint256 _refundDeadline = 7; // days
        string memory _title = "My Title";
        string memory _description = "My little description from my heart, soul and mind";
        string[] memory categories = new string[](1);
        categories[0] = "Cat 1";

        _createCampaign(ALICE, _title, SUMMARY, _description, _amountNeeded, _deadline, _refundDeadline, categories);

        ICampaign.CampaignDetails memory campaign = campaignBase.getCampaign(0);

        // arrange according to campaign detail return keys
        assertEq(campaign.id, 0);
        assertEq(campaign.amountRaised, 0);
        assertEq(campaign.goal, _amountNeeded);
        assertEq(campaign.owner, ALICE);
        assertEq(campaign.title, _title);
        assertEq(campaign.summary, SUMMARY);
        assertEq(campaign.description, _description);
        assertEq(campaign.coverImage, "coverImage");
        assertEq(campaign.claimed, false);
        assertEq(campaign.totalDonors, 0);
        assertEq(campaign.tokensAllocated, 0);
        assertEq(campaign.categories.length, 1);
        assertEq(campaign.categories[0], categories[0]);
    }

    function test_getCampaignMilestones() public {
        uint256 amountNeeded = 40 * 1 ether;
        uint256 deadline = 15; // days
        uint256 refundDeadline = 10; // days

        string[] memory categories = new string[](1);
        categories[0] = "Tester";

        ICampaign.BasicMilestone[] memory _milestones = new ICampaign.BasicMilestone[](3);

        _milestones[0] = ICampaign.BasicMilestone({targetAmount: 16 ether, deadline: 2, description: "First milestone"});

        _milestones[1] =
            ICampaign.BasicMilestone({targetAmount: 30 ether, deadline: 4, description: "Second milestone"});

        _milestones[2] =
            ICampaign.BasicMilestone({targetAmount: 40 ether, deadline: 4, description: "Second milestone"});

        vm.prank(ALICE);
        campaignBase.createCampaign(
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

        (ICampaign.Milestone[] memory milestones, uint8 currentMilestone, uint8 nextWithdrawableMilestone) =
            campaignBase.getCampaignMileStones(0);

        assertEq(currentMilestone, 0);
        assertEq(milestones.length, 3);
        assertEq(nextWithdrawableMilestone, 0);
    }

    function test_getTotalCampaignsCreated() public {
        assertEq(campaignBase.totalCampaigns(), 0);

        uint256 _campaignsLength = 5;

        for (uint256 index = 0; index < _campaignsLength; index++) {
            _createCampaign(ALICE, "My Title", SUMMARY, "My little description from my heart, soul and mind", 6, 7, 7);
        }

        assertEq(campaignBase.totalCampaigns(), _campaignsLength);
    }

    function test_getCampaignsReturnsPaginatedResult() public {
        for (uint256 index = 0; index < NUMBER_IN_WORDS.length; index++) {
            _createCampaign(
                ALICE, string.concat(NUMBER_IN_WORDS[index], "_title_title"), SUMMARY, WORD_CHARACTERS_201, 20, 10, 10
            );
        }

        uint256 _page = 0;
        uint256 _perPage = 3;
        (ICampaign.CampaignDetails[] memory _campaigns,) = campaignBase.getCampaigns(_page, _perPage);

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

    function test_getCampaignsByCategory() public {
        uint256 _amountNeeded = 6;
        uint256 _deadline = 4; // days
        uint256 _refundDeadline = 10; // days
        string memory _description = "My little description from my heart, soul and mind";

        string[] memory categoriesOne = new string[](2);
        categoriesOne[0] = "Cat 1";
        categoriesOne[1] = "Cat 2";

        string[] memory categoriesTwo = new string[](2);
        categoriesTwo[0] = "Cat 3";
        categoriesTwo[1] = "Cat 4";

        string[] memory categoriesThree = new string[](2);
        categoriesThree[0] = "Cat 3";
        categoriesThree[1] = "Cat 2";

        _createCampaign(BOB, "Cam 1", SUMMARY, _description, _amountNeeded, _deadline, _refundDeadline, categoriesOne);
        _createCampaign(BOB, "Cam 2", SUMMARY, _description, _amountNeeded, _deadline, _refundDeadline, categoriesTwo); // 1st
        _createCampaign(BOB, "Cam 3", SUMMARY, _description, _amountNeeded, _deadline, _refundDeadline, categoriesThree); // second
        _createCampaign(BOB, "Cam 5", SUMMARY, _description, _amountNeeded, _deadline, _refundDeadline, categoriesOne);
        _createCampaign(BOB, "Cam 6", SUMMARY, _description, _amountNeeded, _deadline, _refundDeadline, categoriesTwo); // third
        _createCampaign(BOB, "Cam 7", SUMMARY, _description, _amountNeeded, _deadline, _refundDeadline, categoriesThree); // fourth

        string memory _category = "Cat 3";
        uint256 _page = 0;
        uint256 _perPage = 2;

        (ICampaign.CampaignDetails[] memory campaigns, uint256 totalCampaigns) =
            campaignBase.getCampaignsByCategory(_category, _page, _perPage);

        assertEq(totalCampaigns, 4);
        assertEq(campaigns.length, 2);

        for (uint256 index = 0; index < campaigns.length; index++) {
            bool categoryFound = false;
            string[] memory categories = campaigns[index].categories;

            for (uint256 j = 0; j < categories.length; j++) {
                if (keccak256(bytes(categories[j])) == keccak256(bytes(_category))) {
                    categoryFound = true;
                    break;
                }
            }

            assertEq(categoryFound, true);
        }
    }

    function test_getOwnerCampaignsReturnsPaginatedResult() public {
        for (uint256 index = 0; index < NUMBER_IN_WORDS.length; index++) {
            _createCampaign(
                ALICE, string.concat(NUMBER_IN_WORDS[index], "Alice", "_title_title"), SUMMARY, WORD_CHARACTERS_201, 20, 10, 10
            );
            _createCampaign(
                BLESSING,
                string.concat(NUMBER_IN_WORDS[index], "Blessing", "_title_title"),
                SUMMARY,
                WORD_CHARACTERS_201,
                20,
                10,
                10
            );
            _createCampaign(
                BOB, string.concat(NUMBER_IN_WORDS[index], "Bob", "_title_title"),
                SUMMARY, WORD_CHARACTERS_201, 20, 10, 10
            );
        }

        uint256 _page = 3;
        uint256 _perPage = 4;

        (ICampaign.CampaignDetails[] memory campaigns, uint256 totalCampaigns) =
            campaignBase.getOwnerCampaigns(BLESSING, _page, _perPage);

        assertEq(campaigns.length, 4); // total number of campaigns returned
        assertEq(totalCampaigns, 30); // total number of campaigns created by Blessing

        // make sure all returned campaigns belong to BLESSING
        for (uint256 index = 0; index < campaigns.length; index++) {
            assertEq(campaigns[0].owner, BLESSING);
        }
    }

    function test_withdrawFailIfNotOwner() public {
        uint256 _amountNeeded = 6;
        uint256 _deadline = 4; // days
        uint256 _refundDeadline = 10; // days
        string memory _title = "My Title";
        string memory _description = "My little description from my heart, soul and mind";

        _createCampaign(BOB, _title, SUMMARY, _description, _amountNeeded, _deadline, _refundDeadline);

        vm.startPrank(ALICE);
        vm.expectRevert(ICampaign.Campaign__NotCampaignOwner.selector);
        campaignBase.withdraw(0);
    }

    function test_withdrawFailIfRefundDeadlineIsClosed() public {
        uint256 _amountNeeded = 6;
        uint256 _deadline = 4; // days
        uint256 _refundDeadline = 10; // days
        string memory _title = "My Title";
        string memory _description = "My little description from my heart, soul and mind";

        _createCampaign(BOB, _title, SUMMARY, _description, _amountNeeded, _deadline, _refundDeadline);

        vm.startPrank(BOB);
        vm.expectRevert(ICampaign.Campaign__RefundDeadlineActive.selector);
        campaignBase.withdraw(0);
    }

    function test_withdrawFailIfThereIsNoDonation() public {
        uint256 _amountNeeded = 6;
        uint256 _deadline = 4; // days
        uint256 _refundDeadline = 10; // days
        string memory _title = "My Title";
        string memory _description = "My little description from my heart, soul and mind";

        _createCampaign(BOB, _title, SUMMARY, _description, _amountNeeded, _deadline, _refundDeadline);

        vm.startPrank(BOB);
        vm.expectRevert(ICampaign.Campaign__RefundDeadlineActive.selector);
        campaignBase.withdraw(0);
    }

    function test_claimingTokenFailsIfCampaignIsActive() public {
        _createCampaign(
            ALICE,
            "title title title title",
            SUMMARY,
            "description description description description description description",
            1 ether,
            3,
            6
        );

        vm.prank(BLESSING);
        vm.expectRevert(ICampaign.Campaign__CampaignNotEnded.selector);
        campaignBase.claimToken(0);
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
        string[] memory categories = new string[](1);
        categories[0] = "Tester";

        _createCampaign(_owner, _title, _summary, _description, _amountNeeded, _deadline, _refundDeadline, categories);
    }

    function _createCampaign(
        address _owner,
        string memory _title,
        string memory _summary,
        string memory _description,
        uint256 _amountNeeded,
        uint256 _deadline,
        uint256 _refundDeadline,
        string[] memory _categories
    ) private {
        vm.startPrank(_owner);

        ICampaign.BasicMilestone[] memory _milestones;

        // TODO: Use forge to get image metadata
        campaignBase.createCampaign(
            _title, _summary, _description, "coverImage", _milestones, _categories, _amountNeeded, _deadline, _refundDeadline
        );

        vm.stopPrank();
    }

    function _shiftCurrentTimestampToAllowWithdraw() private {
        uint256 _refundDeadline = 10; // gotten from createSuccessfulCampaign();
        uint256 _deadline = 4; // gotten from createSuccessfulCampaign();
        vm.warp(block.timestamp + ((_refundDeadline + _deadline) * ONE_DAY));
    }
}
