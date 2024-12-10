// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Donation} from "./../structs.sol";

/// @title ICampaignDonation
/// @author Olaleye Blessing
/// @notice Interface for campaign donations
interface ICampaignDonation {
    /// @notice Emitted when a new donation is made to a campaign
    /// @param donor The address of the donor
    /// @param campaignId The ID of the campaign receiving the donation
    /// @param coin Address of the donated token
    /// @param amount The amount donated
    /// @param campaignTitle The title of the campaign
    event NewDonation(address indexed donor, uint256 indexed campaignId, address coin, uint256 amount, string campaignTitle);

    /// @notice Emitted when a donation is refunded
    /// @param donor The address of the donor receiving the refund
    /// @param campaignId The ID of the campaign from which the refund is made
    /// @param amount The amount refunded
    event DonationRefunded(address indexed donor, uint256 indexed campaignId, uint256 amount);

    /// @notice Emitted when campaign funds are withdrawn by the owner
    /// @param campaignId The ID of the campaign
    /// @param owner The address of the campaign owner
    /// @param coin The token address
    /// @param amount The amount withdrawn
    event CampaignFundWithdrawn(
        uint256 indexed campaignId, address indexed owner, address indexed coin, uint256 amount
    );

    /// @notice Error thrown when donor has no donation
    error CampaignDonation__NoDonationFound(uint256 campaignId);

    /// @notice Error thrown when attempting to refund more than the donor has contributed
    error CampaignDonation__InsufficientDonation(uint256 campaignId, uint256 amountToRefund, uint256 amountDonated);

    /// @notice Error thrown when donating fails
    error CampaignDonation__DonationFailed(string reason);

    /// @notice Error thrown when a refund transaction fails
    error CampaignDonation__RefundFailed(uint256 campaignId);

    /// @notice Error thrown when attempting to withdraw funds while the refund deadline is still active
    error CampaignDonation__RefundDeadlineActive();

    /// @notice Error thrown when attempting to refund after the refund deadline has elapsed
    error CampaignDonation__RefundDeadlineElapsed(uint256 campaignId);

    /// @notice Error for insufficient allowance
    error CampaignDonation__InsufficientAllowance(address coin, uint256 amount);

    /// @notice Error thrown when a withdrawal fails
    error CampaignDonation__WithdrawalFailed();

    error CampaignDonation__WithdrawNotAllowed(string message);

    /// @notice Error thrown when attempting to make an empty donation
    error CampaignDonation__EmptyDonation();

    /// @notice Error thrown when attempting to interact with a closed campaign
    error CampaignDonation__CampaignClosed();

    /// @notice Error thrown when attempting to interact with an already claimed campaign
    error CampaignDonation__CampaignAlreadyClaimed();

    /// @notice Error thrown when a non-owner attempts to perform an owner-only action
    error CampaignDonation__NotCampaignOwner();

    /// @notice Retrieves donations
    /// @param campaignId The ID of the campaign
    /// @param page The page number to retrieve
    /// @param perPage The number of campaigns per page
    /// @return donations A list of donations made
    /// @return totalDonations The total donations the campaign has received
    function getCampaignDonations(uint256 campaignId, uint256 page, uint256 perPage)
        external
        view
        returns (Donation[] memory donations, uint256 totalDonations);

    /// @notice Retrieves the list of unique donors
    /// @param campaignId The id of the campaign
    /// @return donors The list of unique donors
    function getTotalCampaignDonors(uint256 campaignId) external view returns (address[] memory);

    // /// @notice Allows a user to donate to an active campaign
    // /// @param campaignId The ID of the campaign to donate to
    // /// @param amount The value of coin to donate
    // /// @param coin Address of the ERC20 token. Adress 0 for ETH.
    // function donate(uint256 campaignId, uint256 amount, address coin) external payable;

    // /// @notice Donate native ETH to an active campaign
    // /// @dev Explain to a developer any extra details
    // /// @param campaignId The ID of the campaign to donate to
    // function donate(uint256 campaignId) external payable;

    // /// @notice Allows a donor to request a refund for their donation
    // /// @dev Donors can claim all refund if the campaign has no milestone. Otherwise, a proportion will be calculated based on the available fund.
    // /// @param campaignId The ID of the campaign to request a refund from
    // /// @param amount The amount to refund
    // /// @param coin Address of the ERC20 token. Adress 0 for ETH.
    // function refund(uint256 campaignId, uint256 amount, address coin) external;

    // /// @notice Allows a donor to request a refund for their ETH donation
    // /// @dev Donors can claim all refund if the campaign has no milestone. Otherwise, a proportion will be calculated based on the available fund.
    // /// @param campaignId The ID of the campaign to request a refund from
    // /// @param amount ETH amount to refund
    // function refund(uint256 campaignId, uint256 amount) external;
}
