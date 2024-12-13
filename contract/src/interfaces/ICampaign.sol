// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Donation} from "./../structs.sol";

/// @title ICampaign
/// @author Olaleye Blessing
/// @notice Interface for the core functionality of a crowdfunding campaign system
interface ICampaign {
    enum MilestoneStatus {
        Pending, // Funding is yet to start
        Funding, // Funding has started
        Withdrawn, // Funding has been withdrawn
        Started, // Funding is been used
        Completed, // Work done
        Rejected // Funding is rejected

    }

    /// @dev Struct containing details of a milestone
    struct Milestone {
        uint8 id;
        uint256 targetAmount;
        uint256 deadline;
        string description;
        MilestoneStatus status;
    }

    struct BasicMilestone {
        uint256 targetAmount; // in USD -> decimal 8
        uint256 deadline;
        string description;
    }

    /// @notice Struct representing a single campaign
    struct Campaign {
        uint256 id;
        uint256 amountRaised;
        uint256 amountWithdrawn;
        uint256 deadline;
        uint256 refundDeadline;
        uint256 goal; // in USD -> decimal 8
        uint256 tokensAllocated;
        address owner;
        string title;
        string summary;
        string description;
        string coverImage;
        string[] categories;
        address[] donorAddresses;
        mapping(address donor => uint256 donated) isDonor; // 1 -> true 0 -> false
        Donation[] donations;
        mapping(address donor => mapping(address coin => uint256 total)) donorTotalAmountPerCoin;
        mapping(address coin => uint256 amount) amountRaisedPerCoin;
        mapping(address coin => uint256 amount) amountWithdrawnPerCoin;
        mapping(address => bool) hasClaimedTokens;
        mapping(uint8 => Milestone) milestones;
        uint8 totalMilestones;
        uint8 currentMilestone;
        bool claimed;
    }

    /// @notice Struct containing details of a campaign
    struct CampaignDetails {
        uint256 id;
        uint256 amountRaised;
        uint256 deadline;
        uint256 refundDeadline;
        uint256 goal;
        uint256 totalDonors;
        uint256 tokensAllocated;
        uint8 totalMilestones;
        uint8 currentMilestone;
        address owner;
        string title;
        string summary;
        string description;
        string coverImage;
        bool claimed;
        string[] categories;
    }

    /// @notice Emitted when a campaign is created
    /// @dev Explain to a developer any extra details
    /// @param campaignId The id of the new campaign
    /// @param title The title of the new campaign
    /// @param totalCampaigns The total campaigns created
    event CampaignCreated(
        address owner, uint256 campaignId, string title, uint256 totalCampaigns, string strCategories
    );

    /// @notice Emmitted when a new coin is being supported
    /// @param coin Address of the new coin
    event NewCoinSupported(address coin);

    /// @notice Emitted when a campaign reached a milestone
    /// @dev The next milestone, if available, is started immediately the current one ends
    /// @param campaignId The id of the campaign
    /// @param milestoneId The id of the completed milestone
    /// @param amountRaised The amount raised for the milestone
    event MilestoneReached(uint256 indexed campaignId, uint8 milestoneId, uint256 amountRaised);

    /// @notice Emitted when a new campaign's milestone just started.
    /// @param campaignId The id of the campaign
    /// @param milestoneId The id of the completed milestone
    event NextMilestoneStarted(uint256 indexed campaignId, uint8 milestoneId);

    /// @notice Error thrown when the account performing an operation is not the contract's owner
    error Campaign__NotContractOwner(address account);

    /// @notice Error thrown when a campaign does not exist
    error Campaign__CampaignNotExist(uint256 campaignId);

    /// @notice Error thrown when campaign creation fails
    error Campaign__CampaignCreationFailed(string reason);

    /// @notice Error thrown when invalid pagination parameters are provided
    error Campaign__InvalidPagination();

    /// @notice Error thrown when attempting to interact with a campaign that hasn't ended
    error Campaign__CampaignNotEnded();

    /// @notice Coin not supported for donation
    error Campaign__CoinNotSupported(address coin);

    /// @dev Returns the address of the contract owner.
    function getOwner() external returns (address owner);

    /// @notice Creates a new campaign
    /// @param title The title of the campaign
    /// @param description The description of the campaign
    /// @param coverImage The URL of the campaign's cover image
    /// @param goal The funding goal of the campaign (in wei)
    /// @param duration The duration of the campaign in days
    /// @param refundDeadline The number of days after the campaign ends during which refunds are possible
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
    ) external;

    /// @notice Retrieves the details of a specific campaign. Make sure the campaign exists
    /// @param campaignId The ID of the campaign to retrieve
    /// @return The CampaignDetails struct containing the campaign's information
    function getCampaign(uint256 campaignId) external view returns (CampaignDetails memory);

    /// @notice Retrieves the milestones of a campaign if it has any
    /// @param campaignId The ID of the campaign milestones to retrieve
    /// @return milestones An array of milestones for the specified campaign
    /// @return currentMileStone The ID of the current milestone or 0 if no milestones are defined
    function getCampaignMileStones(uint256 campaignId)
        external
        view
        returns (Milestone[] memory milestones, uint8 currentMileStone);

    /// @notice Retrieves a paginated list of all campaigns
    /// @param page The page number to retrieve
    /// @param perPage The number of campaigns per page
    /// @return An array of CampaignDetails structs and the total number of campaigns
    function getCampaigns(uint256 page, uint256 perPage) external view returns (CampaignDetails[] memory, uint256);

    /// @notice Retrieves a paginated list of campaigns by category
    /// @param category One of the catgeory the campaigns belong to
    /// @param page The page number to retrieve
    /// @param perPage The number of campaigns per page
    /// @return An array of CampaignDetails structs and the total number of campaigns
    function getCampaignsByCategory(string calldata category, uint256 page, uint256 perPage)
        external
        view
        returns (CampaignDetails[] memory, uint256);

    /// @notice Retrieves a paginated list of campaigns for a specific owner
    /// @param owner The address of the campaign owner
    /// @param page The page number to retrieve
    /// @param perPage The number of campaigns per page
    /// @return An array of CampaignDetails structs and the total number of campaigns for the owner
    function getOwnerCampaigns(address owner, uint256 page, uint256 perPage)
        external
        view
        returns (CampaignDetails[] memory, uint256);

    /// @notice Add a new supported coin
    /// @param coin Address of the coin to add
    /// @param priceFeed Chainlink aggregrator address to get the price of the coin
    function addSupportedCoin(address coin, address priceFeed) external;

    /// @notice Get list of supported stablecoins
    /// @return Array of supported stablecoin addresses
    function getSupportedCoins() external view returns (address[] memory);

    /// @notice Check if a coin is supported for donation
    /// @param coin Address of the coin to check
    /// @return Boolean indicating if the coin is supported
    function isCoinSupported(address coin) external view returns (bool);
}
