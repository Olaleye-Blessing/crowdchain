// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Test, console} from "forge-std/Test.sol";
import {ICampaign} from "./../../src/interfaces/ICampaign.sol";
import {ConstantsTest} from "./../utils/Constants.sol";
import {DeployCampaignUpdates, CampaignUpdatesCopy} from "./../../script/DeployCampaignUpdates.s.sol";
import {ICampaignUpdates} from "./../../src/interfaces/IcampaignUpdates.sol";
import {ICampaignDonation} from "./../../src/interfaces/ICampaignDonation.sol";

contract CampaignUpdatesTest is Test, ConstantsTest {
    CampaignUpdatesCopy public campaignUpdates;
    address ALICE = makeAddr("alice");
    address BOB = makeAddr("bob");
    string private VALID_TITLE = "Valid title for real";
    string private VALID_CONTENT = "Valid content for real";

    function setUp() external {
        vm.deal(DEPLOYER, 100 ether);
        DeployCampaignUpdates deployCampaignUpdates = new DeployCampaignUpdates();
        (campaignUpdates,) = deployCampaignUpdates.run();

        vm.deal(ALICE, 100 ether);
        vm.deal(BOB, 100 ether);
    }

    function test_createPostSuccessfully() external {
        _createCampaign(ALICE);

        uint256 campaignID = 0;

        vm.prank(ALICE);
        vm.expectEmit(true, true, true, true, address(campaignUpdates));
        emit ICampaignUpdates.NewUpdate(campaignID, 0, ALICE, VALID_TITLE);
        campaignUpdates.postUpdate(campaignID, VALID_TITLE, VALID_CONTENT);
    }

    function test_revertUpdateIfNotFromCampaignOwner() external {
        _createCampaign(ALICE);

        uint256 campaignID = 0;

        vm.expectRevert(ICampaignDonation.CampaignDonation__NotCampaignOwner.selector);
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

        CampaignUpdatesCopy.Update memory update = campaignUpdates.getUpdate(campaignID, 0);

        assertEq(update.id, 0);
        assertEq(update.title, VALID_TITLE);
        assertEq(update.content, VALID_CONTENT);
        assertEq(update.timestamp, currentTime);
    }

    function test_getUpdateFailsIfIdDoesNotExist() external {
        uint256 campaignID = 0;

        _createCampaign(ALICE);

        vm.expectRevert(abi.encodeWithSelector(ICampaignUpdates.CampaignUpdates__UpdateNotExist.selector, 0));
        campaignUpdates.getUpdate(campaignID, 0);
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
            campaignUpdates.getCampaignUpdates(0, page, perPage);

        assertEq(totalUpdates, totalUpdatesToCreate);

        assertEq(updates[0].id, 0);
        assertEq(updates[0].title, string.concat(NUMBER_IN_WORDS[0], VALID_TITLE));
        assertEq(updates[0].content, string.concat(NUMBER_IN_WORDS[0], VALID_CONTENT));

        assertEq(updates[1].id, 1);
        assertEq(updates[1].title, string.concat(NUMBER_IN_WORDS[1], VALID_TITLE));
        assertEq(updates[1].content, string.concat(NUMBER_IN_WORDS[1], VALID_CONTENT));
    }

    function test_postUpdateAfterWithdrawal() public {
        uint256 donation = 23 ether;
        _createAndFundCamapign(BOB, ETH_ADDRESS, donation);

        uint256 campaignID = 0;
        uint256 updateID = 0;
        string memory updateTitle = "Owner made a withdrawal";
        string memory updateContent = "";

        _shiftCurrentTimestampToAllowWithdraw();

        vm.prank(ALICE);
        emit ICampaignDonation.CampaignFundWithdrawn(campaignID, ALICE, ETH_ADDRESS, donation);
        // confirm update event
        vm.expectEmit(true, true, true, true, address(campaignUpdates));
        emit ICampaignUpdates.NewUpdate(campaignID, updateID, ALICE, updateTitle);
        campaignUpdates.withdraw(campaignID);

        CampaignUpdatesCopy.Update memory update = campaignUpdates.getUpdate(campaignID, 0);

        assertEq(update.id, 0);
        assertEq(update.title, updateTitle);
        assertEq(update.content, updateContent);
    }

    function _createUpdate(address owner, uint256 campaignID, string memory title, string memory content) private {
        vm.prank(owner);
        campaignUpdates.postUpdate(campaignID, title, content);
    }

    function _createCampaign(address _owner) private {
        string memory title = "My Title";
        string memory summary = WORD_CHARACTERS_201;
        string memory description = WORD_CHARACTERS_201;
        string memory coverImage = "cover image";
        ICampaign.BasicMilestone[] memory milestones;
        string[] memory categories = new string[](1);
        categories[0] = "Tester";
        uint256 amountNeeded = 6e18;
        uint256 deadline = 15;
        uint256 refundDeadline = 10;

        vm.startPrank(_owner);

        campaignUpdates.createCampaign(
            title, summary, description, coverImage, milestones, categories, amountNeeded, deadline, refundDeadline
        );

        vm.stopPrank();
    }

    function _createFundAndClaimCampaign(address donator, address coin, uint256 amount) private {
        _createAndFundCamapign(donator, coin, amount);

        uint256 campaignID = 0;

        _shiftCurrentTimestampToAllowWithdraw();

        vm.prank(ALICE);
        // vm.expectEmit(true, true, true, true, address(campaignDonation));
        emit ICampaignDonation.CampaignFundWithdrawn(campaignID, ALICE, coin, amount);
        campaignUpdates.withdraw(campaignID);
    }

    function _createAndFundCamapign(address donator, address coin, uint256 amount) private {
        _createCampaign(ALICE);
        _donate(donator, coin, amount);
    }

    function _donate(address donor, address coin, uint256 amount) private {
        vm.prank(donor);

        // vm.expectEmit(true, true, false, true, address(campaignDonation));
        // vm.expectEmit(address(this));
        emit ICampaignDonation.NewDonation(donor, 0, coin, amount, "My Title");

        coin == ETH_ADDRESS ? campaignUpdates.donateETH{value: amount}(0) : campaignUpdates.donateToken(0, amount, coin);
    }

    function _shiftCurrentTimestampToAllowWithdraw() private {
        uint256 _refundDeadline = 15 days; // gotten from createSuccessfulCampaign();
        uint256 _deadline = 10 days; // gotten from createSuccessfulCampaign();
        vm.warp(block.timestamp + _refundDeadline + _deadline + 1 days);
    }
}
