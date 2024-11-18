// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

/// @title ICampaignUpdates
/// @author Olaleye Blessing
/// @notice Interface for campaign updates functionality
interface ICampaignUpdates {
    /// @notice Struct containing details of a campaign update
    struct Update {
        uint256 id;
        uint256 timestamp;
        string title;
        string content;
    }

    /// @notice Emitted when a new update is posted
    event NewUpdate(uint256 indexed campaignId, uint256 indexed updateId, address indexed owner, string title);

    /// @notice Error thrown when updates content is invalid
    error CampaignUpdates__IvalidData(string reason);

    /// @notice Error thrown when a update does not exist
    error CampaignUpdates__UpdateNotExist(uint256 updateId);

    /// @notice Allows campaign owner to post an update
    /// @param campaignId The ID of the campaign
    /// @param title The title of the update
    /// @param content The content of the update
    function postUpdate(uint256 campaignId, string calldata title, string calldata content) external;

    /// @notice Retrieves a single update by ID
    /// @param campaignId The ID of the campaign
    /// @param updateId The ID of the update
    /// @return The requested update
    function getUpdate(uint256 campaignId, uint256 updateId) external view returns (Update memory);

    /// @notice Retrieves updates for a campaign with pagination
    /// @param campaignId The ID of the campaign
    /// @param page The page number (0-based)
    /// @param perPage Number of updates per page
    /// @return updates Array of updates for the specified page
    /// @return total Total number of updates for the campaign
    function getCampaignUpdates(uint256 campaignId, uint256 page, uint256 perPage)
        external
        view
        returns (Update[] memory updates, uint256 total);
}
