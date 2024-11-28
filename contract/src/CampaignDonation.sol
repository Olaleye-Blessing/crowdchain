// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {CampaignBase} from "./CampaignBase.sol";
import {ICampaignDonation} from "./interfaces/ICampaignDonation.sol";

/// @title CampaignDonation
/// @author Olaleye Blessing
/// @notice Abstract contract for campaignDonation functionality, extending CampaignBase
/// @dev Implements donation and refund mechanisms
abstract contract CampaignDonation is CampaignBase, ICampaignDonation {
    constructor(address _crowdchainTokenAddress) CampaignBase(_crowdchainTokenAddress) {}

    /// @inheritdoc ICampaignDonation
    function getCampaignDonors(uint256 campaignId)
        external
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

    /// @inheritdoc ICampaignDonation
    function donate(uint256 campaignId) external payable campaignExists(campaignId) {
        if (msg.value == 0) revert Campaign__EmptyDonation();

        Campaign storage campaign = campaigns[campaignId];
        if (campaign.claimed) revert Campaign__CampaignAlreadyClaimed();
        if (block.timestamp > campaign.deadline) revert Campaign__CampaignClosed();

        if (campaign.donors[msg.sender] == 0) {
            campaign.donorAddresses.push(msg.sender);
        }

        campaign.amountRaised += msg.value;
        campaign.donors[msg.sender] += msg.value;

        emit NewDonation(msg.sender, campaignId, msg.value, campaign.title);

        if (campaign.amountRaised >= campaign.goal) {
            emit CampaignGoalCompleted(campaign.owner, campaignId, campaign.amountRaised);
        }

        if (campaign.totalMilestones > 0) {
            if (campaign.currentMilestone < campaign.totalMilestones - 1) {
                uint8 newMilestone = campaign.currentMilestone;

                uint8 totalMilestones = campaign.totalMilestones;

                for (uint8 i = campaign.currentMilestone; i < totalMilestones; i++) {
                    if (campaign.amountRaised >= campaign.milestones[i].targetAmount) {
                        campaign.milestones[i].status = MilestoneStatus.Completed;
                    } else {
                        campaign.milestones[i].status = MilestoneStatus.InProgress;
                        newMilestone = i;
                        break;
                    }
                }

                if (newMilestone > campaign.currentMilestone) {
                    emit MilestoneReached(campaign.id, newMilestone - 1, campaign.amountRaised);
                    campaign.currentMilestone = newMilestone;

                    if (newMilestone < campaign.totalMilestones) {
                        emit NextMilestoneStarted(campaign.id, newMilestone);
                    }
                }
            } else {
                Milestone storage lastMilestone = campaign.milestones[campaign.currentMilestone];

                if (campaign.amountRaised >= lastMilestone.targetAmount) {
                    lastMilestone.status = MilestoneStatus.Completed;
                }
            }
        }
    }

    /// @inheritdoc ICampaignDonation
    function refund(uint256 campaignId, uint256 amount) external campaignExists(campaignId) {
        Campaign storage campaign = campaigns[campaignId];

        if (campaign.claimed) revert Campaign__CampaignAlreadyClaimed();
        if (block.timestamp >= campaign.refundDeadline) revert Campaign__RefundDeadlineElapsed(campaignId);

        uint256 amountDonated = campaign.donors[msg.sender];
        if (amountDonated == 0) revert CampaignDonation__NoDonationFound(campaignId);

        if (amountDonated < amount) revert CampaignDonation__InsufficientDonation(campaignId, amount, amountDonated);

        if (campaign.totalMilestones > 0) {
            if (campaign.nextWithdrawableMilestone != 0) {
                revert Campaign__WithdrawNotAllowed(
                    "Refunds not allowed after the first milestone funds have been withdrawn"
                );
            }
        }

        campaign.amountRaised -= amount;
        campaign.donors[msg.sender] -= amount;

        if (campaign.donors[msg.sender] == 0) {
            _removeAddress(campaign.donorAddresses, msg.sender);
        }

        if (campaign.totalMilestones > 0) _updateMilestone(campaign);

        (bool success,) = payable(msg.sender).call{value: amount}("");
        if (!success) revert CampaignDonation__RefundFailed(campaignId);

        emit DonationRefunded(msg.sender, campaignId, amount);
    }

    function _updateMilestone(Campaign storage campaign) private {
        uint8 newCurrentMilestone = 0;

        uint8 totalMilestones = campaign.totalMilestones;

        for (uint8 i = 0; i < totalMilestones; i++) {
            if (campaign.amountRaised >= campaign.milestones[i].targetAmount) {
                campaign.milestones[i].status = MilestoneStatus.Completed;
            } else {
                newCurrentMilestone = i;
                campaign.milestones[i].status = MilestoneStatus.InProgress;
                break;
            }
        }

        if (newCurrentMilestone < campaign.currentMilestone) {
            uint8 currentMilestone = campaign.currentMilestone;
            for (uint8 i = newCurrentMilestone + 1; i <= currentMilestone; i++) {
                campaign.milestones[i].status = MilestoneStatus.Pending;
            }

            campaign.currentMilestone = newCurrentMilestone;
        }
    }

    /// @notice Removes an address from an array
    /// @dev Internal function used to remove a donor's address when they have no remaining donation
    /// @param addresses The array of addresses to modify
    /// @param addressToRemove The address to remove from the array
    /// @return bool Returns true if the address was successfully removed, false otherwise
    function _removeAddress(address[] storage addresses, address addressToRemove) internal returns (bool) {
        uint256 totalAddresses = addresses.length;
        for (uint256 i = 0; i < totalAddresses; i++) {
            if (addresses[i] == addressToRemove) {
                addresses[i] = addresses[totalAddresses - 1];
                addresses.pop();
                return true;
            }
        }
        return false;
    }
}
