// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {CampaignBase} from "./CampaignBase.sol";

contract Crowdfunding is CampaignBase {
    event NewDonation(address indexed donor, uint256 indexed campaignId, uint256 amount);
    event DonationRefunded(uint256 indexed campaignId, address indexed donor, uint256 amount);

    error Crowdfunding__NoDonationFound(uint256 campaignId);
    error Crowdfunding__InsufficientDonation(uint256 campaignId, uint256 amountToRefund, uint256 amountDonated);
    error Crowdfunding__RefundFailed(uint256 campaignId);

    function getCampaignDonors(uint256 campaignId)
        public
        view
        campaignExists(campaignId)
        returns (address[] memory donors, uint256[] memory contributions)
    {
        Campaign storage campaign = campaigns[campaignId];
        uint256 totalDonors = campaign.donorAddresses.length;

        donors = new address[](totalDonors);
        contributions = new uint256[](totalDonors);

        for (uint256 i = 0; i < totalDonors; i++) {
            address donor = campaign.donorAddresses[i];
            donors[i] = donor;
            contributions[i] = campaign.donors[donor];
        }
    }

    function donate(uint256 campaignId) public payable campaignExists(campaignId) {
        if (msg.value == 0) revert Campaign__EmptyDonation();

        Campaign storage campaign = campaigns[campaignId];
        if (campaign.claimed) revert Campaign__CampaignAlreadyClaimed();
        if (block.timestamp > campaign.deadline) revert Campaign__CampaignClosed();

        if (campaign.donors[msg.sender] == 0) {
            campaign.donorAddresses.push(msg.sender);
        }

        campaign.amountRaised += msg.value;
        campaign.donors[msg.sender] += msg.value;

        emit NewDonation(msg.sender, campaignId, msg.value);

        if (campaign.amountRaised >= campaign.goal) {
            emit CampaignGoalCompleted(campaign.owner, campaignId, campaign.amountRaised);
        }
    }

    function refund(uint256 campaignId, uint256 amount) public campaignExists(campaignId) {
        Campaign storage campaign = campaigns[campaignId];

        if (campaign.claimed) revert Campaign__CampaignAlreadyClaimed();
        if (block.timestamp >= campaign.refundDeadline) revert Campaign__RefundDeadlineElapsed(campaignId);

        uint256 amountDonated = campaign.donors[msg.sender];
        if (amountDonated == 0) revert Crowdfunding__NoDonationFound(campaignId);

        if (amountDonated < amount) revert Crowdfunding__InsufficientDonation(campaignId, amount, amountDonated);

        campaign.amountRaised -= amount;
        campaign.donors[msg.sender] -= amount;

        if (campaign.donors[msg.sender] == 0) {
            _removeAddress(campaign.donorAddresses, msg.sender);
        }

        (bool success,) = payable(msg.sender).call{value: amount}("");
        if (!success) revert Crowdfunding__RefundFailed(campaignId);

        emit DonationRefunded(campaignId, msg.sender, amount);
    }

    function _removeAddress(address[] storage array, address addressToRemove) internal returns (bool) {
        for (uint256 i = 0; i < array.length; i++) {
            if (array[i] == addressToRemove) {
                array[i] = array[array.length - 1];
                array.pop();
                return true;
            }
        }
        return false;
    }
}
