// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {ICampaign} from "./interfaces/ICampaign.sol";
import {IAggregatorV3} from "./interfaces/IAggregatorV3.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/// @title CampaignBase
/// @author Olaleye Blessing
/// @notice Abstract contract implementing core functionality for crowdfunding campaigns
/// @dev Implements the ICampaign interface
abstract contract CampaignBase is ICampaign {
    using SafeERC20 for ERC20;

    uint256 internal constant DECIMAL_PRECISION = 18;
    uint256 private constant ONE_DAY = 1 days;
    address payable private immutable i_owner;
    /// @dev Minimum amount required a campaign has to raise for tokens to be allocated to the owner and donors.
    ERC20 internal crowdchainToken;
    /// @notice Mapping of owner addresses to their campaign IDs
    mapping(address owner => uint256[] campaignIds) private campaignsOwner;
    mapping(string category => uint256[] campaignIds) private campaignsByCategory;
    /// @notice Array of all campaigns
    Campaign[] internal campaigns;
    /// @notice Supported coins for donations
    address[] internal supportedCoins;
    /// @notice Chainlink aggregator pricefeed
    mapping(address coin => address priceFeed) internal coinPriceFeeds;

    modifier onlyOwner() {
        if (i_owner != msg.sender) revert Campaign__NotContractOwner(msg.sender);

        _;
    }

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

    constructor(address _crowdchainTokenAddress, address[] memory _supportedCoins, address[] memory _coinPriceFeeds) {
        i_owner = payable(msg.sender);
        crowdchainToken = ERC20(_crowdchainTokenAddress);
        supportedCoins = _supportedCoins;

        uint256 totalCoins = _supportedCoins.length;
        uint256 coinIndex = 0;
        for (coinIndex; coinIndex < totalCoins; coinIndex++) {
            coinPriceFeeds[_supportedCoins[coinIndex]] = _coinPriceFeeds[coinIndex];
        }
    }

    /// @notice Returns the total number of campaigns
    /// @return The number of campaigns created
    function totalCampaigns() external view returns (uint256) {
        return campaigns.length;
    }

    /// @inheritdoc ICampaign
    function getOwner() external view returns (address) {
        return i_owner;
    }

    /// @inheritdoc ICampaign
    function createCampaign(
        string calldata title,
        string calldata summary,
        string calldata description,
        string calldata coverImage,
        BasicMilestone[] calldata milestones,
        string[] calldata categories,
        uint256 goal,
        uint256 duration,
        uint256 refundDeadline
    ) external override {
        _validateCampaignCreation(
            title, summary, description, coverImage, milestones, categories, goal, duration, refundDeadline
        );

        uint256 deadline = block.timestamp + (duration * ONE_DAY);
        uint256 campaignId = campaigns.length;

        Campaign storage newCampaign = campaigns.push();
        newCampaign.id = campaignId;
        newCampaign.goal = goal;
        newCampaign.deadline = deadline;
        newCampaign.refundDeadline = deadline + (refundDeadline * ONE_DAY);
        newCampaign.owner = msg.sender;
        newCampaign.title = title;
        newCampaign.summary = summary;
        newCampaign.description = description;
        newCampaign.coverImage = coverImage;

        uint8 totalMilestones = uint8(milestones.length);

        if (totalMilestones > 0) {
            for (uint8 i = 0; i < totalMilestones; i++) {
                Milestone memory _milestone = Milestone({
                    id: i,
                    targetAmount: milestones[i].targetAmount,
                    deadline: block.timestamp + (milestones[i].deadline * ONE_DAY),
                    description: milestones[i].description,
                    status: i == 0 ? MilestoneStatus.Funding : MilestoneStatus.Pending
                });
                newCampaign.milestones[i] = _milestone;
            }
        }
        newCampaign.totalMilestones = totalMilestones;
        newCampaign.categories = categories;

        uint256 totalCategories = categories.length;
        string memory strCategories = "";
        for (uint256 i = 0; i < totalCategories; i++) {
            campaignsByCategory[categories[i]].push(campaignId);
            strCategories = i == 0 ? categories[i] : string.concat(strCategories, ",", categories[i]);
        }

        campaignsOwner[msg.sender].push(campaignId);
        emit CampaignCreated(msg.sender, campaignId, title, campaigns.length, strCategories);
    }

    /// @inheritdoc ICampaign
    function getCampaign(uint256 campaignId)
        external
        view
        override
        campaignExists(campaignId)
        returns (CampaignDetails memory)
    {
        Campaign storage campaign = campaigns[campaignId];
        return _createCampaignDetails(campaign);
    }

    /// @inheritdoc ICampaign
    function getCampaignMileStones(uint256 campaignId)
        external
        view
        override
        campaignExists(campaignId)
        returns (Milestone[] memory milestones, uint8 currentMileStone)
    {
        Campaign storage campaign = campaigns[campaignId];
        milestones = new ICampaign.Milestone[](campaign.totalMilestones);

        uint8 totalMilestones = campaign.totalMilestones;

        for (uint8 index = 0; index < totalMilestones; index++) {
            milestones[index] = campaign.milestones[index];
        }

        return (milestones, campaign.currentMilestone);
    }

    /// @inheritdoc ICampaign
    function getCampaigns(uint256 page, uint256 perPage)
        external
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

    // TODO: Make search case insensitive. Better still, make categories an Enum. Do this when you learn about upgradable contract.
    /// @inheritdoc ICampaign
    function getCampaignsByCategory(string calldata category, uint256 page, uint256 perPage)
        external
        view
        override
        validPagination(page, perPage)
        returns (CampaignDetails[] memory, uint256)
    {
        uint256[] memory categoryIds = campaignsByCategory[category];
        return _getCampaignsByUniqueIds(categoryIds, page, perPage);
    }

    /// @inheritdoc ICampaign
    function getOwnerCampaigns(address owner, uint256 page, uint256 perPage)
        external
        view
        override
        validPagination(page, perPage)
        returns (CampaignDetails[] memory, uint256)
    {
        uint256[] memory ownerCampaignIds = campaignsOwner[owner];
        return _getCampaignsByUniqueIds(ownerCampaignIds, page, perPage);
    }

    /// @inheritdoc ICampaign
    function addSupportedCoin(address coin) external onlyOwner {
        if (_isCoinSupported(coin, supportedCoins)) return;

        supportedCoins.push(coin);
    }

    /// @inheritdoc ICampaign
    function getSupportedCoins() public view returns (address[] memory) {
        return supportedCoins;
    }

    /// @inheritdoc ICampaign
    function isCoinSupported(address coin) public view returns (bool) {
        address[] memory _supportedCoins = supportedCoins;

        return _isCoinSupported(coin, _supportedCoins);
    }

    /// @notice Check if a coin is supported for donation
    /// @param coin Address of the coin to check
    /// @param _supportedCoins Array of currently supported coins
    /// @return Boolean indicating if the coin is supported
    function _isCoinSupported(address coin, address[] memory _supportedCoins) private pure returns (bool) {
        uint256 index = 0;
        uint256 totalSupportedCoins = _supportedCoins.length;

        for (index = 0; index < totalSupportedCoins; index++) {
            if (_supportedCoins[index] == coin) return true;
        }

        return false;
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
        string calldata title,
        string calldata summary,
        string calldata description,
        string calldata coverImage,
        BasicMilestone[] calldata milestones,
        string[] calldata categories,
        uint256 goal,
        uint256 duration,
        uint256 refundDeadline
    ) internal view {
        if (msg.sender == address(0)) {
            revert Campaign__CampaignCreationFailed("Invalid sender address");
        }
        if (bytes(title).length == 0 || bytes(title).length > 200) {
            revert Campaign__CampaignCreationFailed("Invalid title length");
        }
        if (bytes(summary).length < 200) {
            revert Campaign__CampaignCreationFailed("Summary too short");
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

        uint256 totalCategories = categories.length;

        if (totalCategories == 0) revert Campaign__CampaignCreationFailed("Provide at least one category");

        if (totalCategories > 4) revert Campaign__CampaignCreationFailed("Maximum of 4 categories");

        // check for duplicate categories
        for (uint256 i = 0; i < totalCategories; i++) {
            if (bytes(categories[i]).length == 0) {
                revert Campaign__CampaignCreationFailed("Category can not be an empty string");
            }
            for (uint256 j = i + 1; j < totalCategories; j++) {
                if (keccak256(bytes(categories[i])) == keccak256(bytes(categories[j]))) {
                    revert Campaign__CampaignCreationFailed("Remove duplicate category");
                }
            }
        }

        uint256 totalMilestones = milestones.length;
        if (totalMilestones > 0) {
            if (totalMilestones > 4) {
                revert Campaign__CampaignCreationFailed("You can only have maximum of 4 milestones");
            }
            if (milestones[totalMilestones - 1].targetAmount != goal) {
                revert Campaign__CampaignCreationFailed("Last milestone target amount must be equal to campaign goal");
            }
            if (milestones[totalMilestones - 1].deadline > duration) {
                revert Campaign__CampaignCreationFailed(
                    "The deadline of the last milestone must not be greater than the total duration"
                );
            }

            for (uint256 index = 0; index < totalMilestones; index++) {
                if (index == totalMilestones - 1) continue;

                if (milestones[index].targetAmount > milestones[index + 1].targetAmount) {
                    revert Campaign__CampaignCreationFailed(
                        "Target amount of previous milestone must be less than the next one"
                    );
                }

                if (milestones[index].deadline > milestones[index + 1].deadline) {
                    revert Campaign__CampaignCreationFailed(
                        "Deadline of previous milestone must be less than the next one"
                    );
                }
            }
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
            summary: campaign.summary,
            description: campaign.description,
            coverImage: campaign.coverImage,
            claimed: campaign.claimed,
            totalDonors: campaign.donorAddresses.length,
            tokensAllocated: campaign.tokensAllocated,
            totalMilestones: campaign.totalMilestones,
            currentMilestone: campaign.currentMilestone,
            categories: campaign.categories
        });
    }

    function _getCampaignsByUniqueIds(uint256[] memory campaignIds, uint256 page, uint256 perPage)
        internal
        view
        returns (CampaignDetails[] memory, uint256)
    {
        uint256 start = page * perPage;
        uint256 end = (start + perPage > campaignIds.length) ? campaignIds.length : start + perPage;
        uint256 totalCampaignsToReturn = end - start;

        CampaignDetails[] memory paginatedCampaigns = new CampaignDetails[](totalCampaignsToReturn);

        for (uint256 i = 0; i < totalCampaignsToReturn; i++) {
            uint256 campaignId = campaignIds[start + i];
            paginatedCampaigns[i] = _createCampaignDetails(campaigns[campaignId]);
        }

        return (paginatedCampaigns, campaignIds.length);
    }
}
