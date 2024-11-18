// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {ICampaignUpdates} from "./interfaces/IcampaignUpdates.sol";
import {Crowdfunding} from "./Crowdfunding.sol";

contract CrowdfundingUpdates is Crowdfunding, ICampaignUpdates {
    /// @dev Mapping of campaign ID to array of updates
    mapping(uint256 campaignId => Update[] updates) private campaignUpdates;

    constructor(address _crowdchainTokenAddress) Crowdfunding(_crowdchainTokenAddress) {}

    /// @inheritdoc ICampaignUpdates
    function postUpdate(uint256 campaignId, string calldata title, string calldata content)
        external
        campaignExists(campaignId)
    {
        _validateUpdate(title, content);

        Campaign storage campaign = campaigns[campaignId];

        if (campaign.owner != msg.sender) revert Campaign__NotCampaignOwner();

        Update memory newUpdate =
            Update({id: campaignUpdates[campaignId].length, timestamp: block.timestamp, title: title, content: content});

        campaignUpdates[campaignId].push(newUpdate);

        emit NewUpdate(campaignId, newUpdate.id, msg.sender, title);
    }

    /// @inheritdoc ICampaignUpdates
    function getUpdate(uint256 campaignId, uint256 updateId)
        external
        view
        campaignExists(campaignId)
        returns (Update memory update)
    {
        Update[] memory updates = campaignUpdates[campaignId];

        if (updateId >= updates.length) revert CampaignUpdates__UpdateNotExist(updateId);

        return updates[updateId];
    }

    /// @inheritdoc ICampaignUpdates
    function getCampaignUpdates(uint256 campaignId, uint256 page, uint256 perPage)
        external
        view
        campaignExists(campaignId)
        returns (Update[] memory updates, uint256 total)
    {
        Update[] memory allUpdates = campaignUpdates[campaignId];
        total = allUpdates.length;

        uint256 start = page * perPage;
        uint256 end = start + perPage > total ? total : start + perPage;
        uint256 resultLength = end - start;

        updates = new Update[](resultLength);
        for (uint256 i = 0; i < resultLength; i++) {
            updates[i] = allUpdates[start + i];
        }

        return (updates, total);
    }

    function _validateUpdate(string calldata title, string calldata content) internal pure {
        if (bytes(title).length < 10) revert CampaignUpdates__IvalidData("Title is too short");
        if (bytes(content).length < 10) revert CampaignUpdates__IvalidData("Content is too short");
    }
}
