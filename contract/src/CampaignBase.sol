// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {ICampaign} from "./interfaces/ICampaign.sol";

/// @title CampaignBase
/// @author Olaleye Blessing
/// @notice Abstract contract implementing core functionality for crowdfunding campaigns
/// @dev Implements the ICampaign interface
abstract contract CampaignBase is ICampaign {
    uint256 private constant ONE_DAY = 1 days;
    uint256 private constant ONE_ETH = 1 ether;

    /// @notice Mapping of owner addresses to their campaign IDs
    mapping(address => uint256[]) private campaignsOwner;

    /// @notice Struct representing a single campaign
    struct Campaign {
        uint256 id;
        uint256 amountRaised;
        uint256 deadline;
        uint256 refundDeadline;
        uint256 goal; // in wei
        address owner;
        string title;
        string description;
        string coverImage;
        bool claimed;
        mapping(address => uint256) donors;
        address[] donorAddresses;
    }

    /// @notice Array of all campaigns
    Campaign[] internal campaigns;

    /// @notice Ensures the campaign exists
    /// @param campaignId The ID of the campaign to check
    modifier campaignExists(uint256 campaignId) {
        if (campaignId >= campaigns.length) {
            revert Campaign__CampaignNotExist(campaignId);
        }

        _;
    }

    /// @notice Validates pagination parameters
    /// @param page The page number
    /// @param perPage The number of items per page
    modifier validPagination(uint256 page, uint256 perPage) {
        if (page >= 0 && perPage > 0) {
            _;
        } else {
            revert Campaign__InvalidPagination();
        }
    }

    /// @notice Returns the total number of campaigns
    /// @return The number of campaigns created
    function totalCampaigns() public view returns (uint256) {
        return campaigns.length;
    }

    /// @inheritdoc ICampaign
    function createCampaign(
        string memory title,
        string memory description,
        string memory coverImage,
        uint256 goal,
        uint64 duration,
        uint256 refundDeadline
    ) public override {
        _validateCampaignCreation(title, description, coverImage, goal, duration, refundDeadline);

        uint256 deadline = block.timestamp + (duration * ONE_DAY);
        uint256 campaignId = campaigns.length;

        Campaign storage newCampaign = campaigns.push();
        newCampaign.id = campaignId;
        newCampaign.goal = goal;
        newCampaign.deadline = deadline;
        newCampaign.refundDeadline = deadline + (refundDeadline * ONE_DAY);
        newCampaign.owner = msg.sender;
        newCampaign.title = title;
        newCampaign.description = description;
        newCampaign.coverImage = coverImage;

        campaignsOwner[msg.sender].push(campaignId);
    }

    /// @inheritdoc ICampaign
    function getCampaign(uint256 campaignId)
        public
        view
        override
        campaignExists(campaignId)
        returns (CampaignDetails memory)
    {
        Campaign storage campaign = campaigns[campaignId];
        return _createCampaignDetails(campaign);
    }

    /// @inheritdoc ICampaign
    function getCampaigns(uint256 page, uint256 perPage)
        public
        view
        override
        validPagination(page, perPage)
        returns (CampaignDetails[] memory, uint256)
    {
        uint256 start = page * perPage;
        uint256 end = (start + perPage > campaigns.length) ? campaigns.length : start + perPage;
        uint256 totalCampaignsToReturn = end - start;

        CampaignDetails[] memory paginatedCampaigns = new CampaignDetails[](totalCampaignsToReturn);

        for (uint256 i = 0; i < totalCampaignsToReturn; i++) {
            paginatedCampaigns[i] = _createCampaignDetails(campaigns[start + i]);
        }

        return (paginatedCampaigns, campaigns.length);
    }

    /// @inheritdoc ICampaign
    function getOwnerCampaigns(address owner, uint256 page, uint256 perPage)
        public
        view
        override
        validPagination(page, perPage)
        returns (CampaignDetails[] memory, uint256)
    {
        uint256[] memory ownerCampaignIds = campaignsOwner[owner];
        uint256 start = page * perPage;
        uint256 end = (start + perPage > ownerCampaignIds.length) ? ownerCampaignIds.length : start + perPage;
        uint256 totalCampaignsToReturn = end - start;

        CampaignDetails[] memory paginatedCampaigns = new CampaignDetails[](totalCampaignsToReturn);

        for (uint256 i = 0; i < totalCampaignsToReturn; i++) {
            uint256 campaignId = ownerCampaignIds[start + i];
            paginatedCampaigns[i] = _createCampaignDetails(campaigns[campaignId]);
        }

        return (paginatedCampaigns, ownerCampaignIds.length);
    }

    /// @inheritdoc ICampaign
    function withdraw(uint256 campaignId) public override campaignExists(campaignId) {
        Campaign storage campaign = campaigns[campaignId];

        if (campaign.claimed) revert Campaign__CampaignAlreadyClaimed();
        if (msg.sender != campaign.owner) revert Campaign__NotCampaignOwner();
        if (block.timestamp < campaign.refundDeadline) {
            revert Campaign__RefundDeadlineActive();
        }
        if(campaign.amountRaised == 0) revert Campaign__EmptyDonation();

        campaign.claimed = true;
        uint256 amount = campaign.amountRaised;

        (bool success,) = payable(msg.sender).call{value: amount}("");
        if (!success) revert Campaign__WithdrawalFailed();

        emit CampaignFundWithdrawn(campaignId, msg.sender, amount);
    }

    /// @notice Validates the parameters for creating a new campaign
    /// @dev Internal function to check the validity of campaign creation inputs
    /// @param title The title of the campaign
    /// @param description The description of the campaign
    /// @param coverImage The URL of the campaign's cover image
    /// @param goal The funding goal of the campaign (in wei)
    /// @param duration The duration of the campaign in days
    /// @param refundDeadline The number of days after the campaign ends during which refunds are possible
    function _validateCampaignCreation(
        string memory title,
        string memory description,
        string memory coverImage,
        uint256 goal,
        uint64 duration,
        uint256 refundDeadline
    ) internal view {
        if (msg.sender == address(0)) {
            revert Campaign__CampaignCreationFailed("Invalid sender address");
        }
        if (bytes(title).length == 0 || bytes(title).length > 200) {
            revert Campaign__CampaignCreationFailed("Invalid title length");
        }
        if (bytes(description).length < 10) {
            revert Campaign__CampaignCreationFailed("Description too short");
        }
        if (bytes(coverImage).length == 0) {
            revert Campaign__CampaignCreationFailed("Provide a cover image");
        }
        if (goal == 0) {
            revert Campaign__CampaignCreationFailed("Goal must be greater than 0");
        }
        if (duration < 1) {
            revert Campaign__CampaignCreationFailed("Duration must be at least 1 day");
        }
        if (refundDeadline < 5) {
            revert Campaign__CampaignCreationFailed("Refund deadline must be at least 5 days after deadline");
        }
    }

    /// @notice Creates a CampaignDetails struct from a Campaign struct
    /// @dev Internal function to convert Campaign storage to CampaignDetails memory
    /// @param campaign The Campaign struct to convert
    /// @return A CampaignDetails struct containing the campaign information
    function _createCampaignDetails(Campaign storage campaign) internal view returns (CampaignDetails memory) {
        return CampaignDetails({
            id: campaign.id,
            amountRaised: campaign.amountRaised,
            deadline: campaign.deadline,
            refundDeadline: campaign.refundDeadline,
            goal: campaign.goal,
            owner: campaign.owner,
            title: campaign.title,
            description: campaign.description,
            coverImage: campaign.coverImage,
            claimed: campaign.claimed,
            totalDonors: campaign.donorAddresses.length
        });
    }
}
