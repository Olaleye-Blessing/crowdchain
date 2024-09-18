// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

interface ICampaign {
    struct CampaignDetails {
        uint256 id;
        uint256 amountRaised;
        uint256 deadline;
        uint256 refundDeadline;
        uint256 goal;
        address owner;
        string title;
        string description;
        string coverImage;
        bool claimed;
        uint256 totalDonors;
    }

    event CampaignFundWithdrawn(uint256 indexed campaignId, address indexed owner, uint256 amount);
    event CampaignGoalCompleted(address indexed owner, uint256 indexed campaignId, uint256 amountRaised);

    error Campaign__CampaignNotExist(uint256 campaignId);
    error Campaign__CampaignCreationFailed(string reason);
    error Campaign__EmptyDonation();
    error Campaign__CampaignClosed();
    error Campaign__CampaignAlreadyClaimed();
    error Campaign__NotCampaignOwner();
    error Campaign__WithdrawalFailed();
    error Campaign__InvalidPagination();
    error Campaign__CampaignNotEnded();
    error Campaign__RefundDeadlineActive();
    error Campaign__RefundDeadlineElapsed(uint256 campaignId);

    function createCampaign(
        string memory title,
        string memory description,
        string memory coverImage,
        uint256 goal,
        uint64 duration,
        uint256 refundDeadline
    ) external;

    function getCampaign(uint256 campaignId) external view returns (CampaignDetails memory);

    function getCampaigns(uint256 page, uint256 perPage) external view returns (CampaignDetails[] memory, uint256);

    function getOwnerCampaigns(address owner, uint256 page, uint256 perPage)
        external
        view
        returns (CampaignDetails[] memory, uint256);

    function withdraw(uint256 campaignId) external;
}
