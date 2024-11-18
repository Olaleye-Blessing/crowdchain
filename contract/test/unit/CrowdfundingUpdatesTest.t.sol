// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Test, console} from "forge-std/Test.sol";
import {DeployCrowdfundingUpdates} from "./../../script/DeployCrowdfundingUpdates.s.sol";
import {CrowdfundingUpdates, ICampaignUpdates} from "./../../src/CrowdfundingUpdates.sol";
import {ICampaign} from "./../../src/interfaces/ICampaign.sol";
import {ConstantsTest} from "./../utils/Constants.sol";

contract CrowdfundingUpdatesTest is Test, ConstantsTest {
    CrowdfundingUpdates public crowdfundingUpdates;
    address ALICE = makeAddr("alice");
    address BOB = makeAddr("bob");
    string private VALID_TITLE = "Valid title for real";
    string private VALID_CONTENT = "Valid content for real";

    function setUp() external {
        vm.deal(DEPLOYER, 100 ether);
        DeployCrowdfundingUpdates deployCrowdfundingUpdates = new DeployCrowdfundingUpdates();
        (crowdfundingUpdates,) = deployCrowdfundingUpdates.run();

        vm.deal(ALICE, 100 ether);
        vm.deal(BOB, 100 ether);
    }

    function test_createPostSuccessfully() external {
        _createCampaign(ALICE);

        uint256 campaignID = 0;

        vm.prank(ALICE);
        vm.expectEmit(true, true, true, true, address(crowdfundingUpdates));
        emit ICampaignUpdates.NewUpdate(campaignID, 0, ALICE, VALID_TITLE);
        crowdfundingUpdates.postUpdate(campaignID, VALID_TITLE, VALID_CONTENT);
    }

    function test_revertUpdateIfNotFromCampaignOwner() external {
        _createCampaign(ALICE);

        uint256 campaignID = 0;

        vm.expectRevert(ICampaign.Campaign__NotCampaignOwner.selector);
        _createUpdate(BOB, campaignID, VALID_TITLE, VALID_CONTENT);
    }

    function test_revertIfTitleContentIsshort() external {
        _createCampaign(ALICE);

        uint256 campaignID = 0;
        string memory title = "T";
        string memory content = "C";

        // short title
        vm.expectRevert(
            abi.encodeWithSelector(ICampaignUpdates.CampaignUpdates__IvalidData.selector, "Title is too short")
        );
        _createUpdate(ALICE, campaignID, title, content);

        // short description
        vm.expectRevert(
            abi.encodeWithSelector(ICampaignUpdates.CampaignUpdates__IvalidData.selector, "Content is too short")
        );
        _createUpdate(ALICE, campaignID, VALID_TITLE, content);
    }

    function test_getUpdate() external {
        uint256 campaignID = 0;

        _createCampaign(ALICE);

        uint256 currentTime = block.timestamp;
        _createUpdate(ALICE, campaignID, VALID_TITLE, VALID_CONTENT);

        CrowdfundingUpdates.Update memory update = crowdfundingUpdates.getUpdate(campaignID, 0);

        assertEq(update.id, 0);
        assertEq(update.title, VALID_TITLE);
        assertEq(update.content, VALID_CONTENT);
        assertEq(update.timestamp, currentTime);
    }

    function test_getUpdateFailsIfIdDoesNotExist() external {
        uint256 campaignID = 0;

        _createCampaign(ALICE);

        vm.expectRevert(abi.encodeWithSelector(ICampaignUpdates.CampaignUpdates__UpdateNotExist.selector, 0));
        crowdfundingUpdates.getUpdate(campaignID, 0);
    }

    function test_getCorrectNumberOfUpdates() external {
        uint256 totalUpdatesToCreate = 20;

        _createCampaign(ALICE);
        for (uint256 index = 0; index < totalUpdatesToCreate; index++) {
            _createUpdate(
                ALICE,
                0,
                string.concat(NUMBER_IN_WORDS[index], VALID_TITLE),
                string.concat(NUMBER_IN_WORDS[index], VALID_CONTENT)
            );
        }

        uint256 page = 0;
        uint256 perPage = 2;

        (ICampaignUpdates.Update[] memory updates, uint256 totalUpdates) =
            crowdfundingUpdates.getCampaignUpdates(0, page, perPage);

        assertEq(totalUpdates, totalUpdatesToCreate);

        assertEq(updates[0].id, 0);
        assertEq(updates[0].title, string.concat(NUMBER_IN_WORDS[0], VALID_TITLE));
        assertEq(updates[0].content, string.concat(NUMBER_IN_WORDS[0], VALID_CONTENT));

        assertEq(updates[1].id, 1);
        assertEq(updates[1].title, string.concat(NUMBER_IN_WORDS[1], VALID_TITLE));
        assertEq(updates[1].content, string.concat(NUMBER_IN_WORDS[1], VALID_CONTENT));
    }

    function _createUpdate(address owner, uint256 campaignID, string memory title, string memory content) private {
        vm.prank(owner);
        crowdfundingUpdates.postUpdate(campaignID, title, content);
    }

    function _createCampaign(address _owner) private {
        string memory title = "My Title";
        string memory summary = WORD_CHARACTERS_201;
        string memory description = WORD_CHARACTERS_201;
        string memory coverImage = "cover image";
        ICampaign.BasicMilestone[] memory milestones;
        string[] memory categories = new string[](1);
        categories[0] = "Tester";
        uint256 amountNeeded = 6 ether;
        uint256 deadline = 15 days;
        uint256 refundDeadline = 10 days;

        vm.startPrank(_owner);

        crowdfundingUpdates.createCampaign(
            title, summary, description, coverImage, milestones, categories, amountNeeded, deadline, refundDeadline
        );

        vm.stopPrank();
    }
}
