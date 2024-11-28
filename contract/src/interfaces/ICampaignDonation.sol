// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

/// @title ICampaignDonation
/// @author Olaleye Blessing
/// @notice Interface for campaign donations
interface ICampaignDonation {
    /// @notice Emitted when a new donation is made to a campaign
    /// @param donor The address of the donor
    /// @param campaignId The ID of the campaign receiving the donation
    /// @param amount The amount donated
    event NewDonation(address indexed donor, uint256 indexed campaignId, uint256 amount, string campaignTitle);

    /// @notice Emitted when a donation is refunded
    /// @param donor The address of the donor receiving the refund
    /// @param campaignId The ID of the campaign from which the refund is made
    /// @param amount The amount refunded
    event DonationRefunded(address indexed donor, uint256 indexed campaignId, uint256 amount);

    /// @notice Error thrown when donor has no donation
    error CampaignDonation__NoDonationFound(uint256 campaignId);

    /// @notice Error thrown when attempting to refund more than the donor has contributed
    error CampaignDonation__InsufficientDonation(uint256 campaignId, uint256 amountToRefund, uint256 amountDonated);

    /// @notice Error thrown when a refund transaction fails
    error CampaignDonation__RefundFailed(uint256 campaignId);

    /// @notice Retrieves the list of donors and their contributions for a specific campaign
    /// @param campaignId The ID of the campaign
    /// @return donors An array of donor addresses
    /// @return contributions An array of contribution amounts corresponding to each donor
    function getCampaignDonors(uint256 campaignId)
        external
        view
        returns (address[] memory donors, uint256[] memory contributions);

    /// @notice Allows a user to donate to an active campaign
    /// @param campaignId The ID of the campaign to donate to
    function donate(uint256 campaignId) external payable;

    /// @notice Allows a donor to request a refund for their donation
    /// @dev Donors can claim all refund if the campaign has no milestone. Otherwise, a proportion will be calculated based on the available fund.
    /// @param campaignId The ID of the campaign to request a refund from
    /// @param amount The amount to refund
    function refund(uint256 campaignId, uint256 amount) external;
}
