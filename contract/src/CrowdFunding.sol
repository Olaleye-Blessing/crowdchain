// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.26;

import {BaseCampaign} from "./Campaign.sol";

contract CrowdFunding is BaseCampaign {
    event CrowdFunding_NewDonor(address donor, uint256 campaignID, uint256 amount);

    function getCampaignDonors(uint256 _campaignID)
        public
        view
        CampaignExist(_campaignID)
        returns (address[] memory, uint256[] memory)
    {
        Campaign storage campaign = campaigns[_campaignID];

        uint256 totalDonors = campaign.donorAddresses.length;

        address[] memory donors = new address[](totalDonors);
        uint256[] memory contributions = new uint256[](totalDonors);

        for (uint256 i = 0; i < totalDonors; i++) {
            address donor = campaign.donorAddresses[i];

            donors[i] = donor;
            contributions[i] = campaign.donors[donor];
        }

        return (donors, contributions);
    }

    function donate(uint256 _campaignID) public payable CampaignExist(_campaignID) {
        uint256 donation = msg.value;
        address donor = msg.sender;

        if (donation <= 0) revert Campaign_EmptyDonation();

        Campaign storage campaign = campaigns[_campaignID];
        if (campaign.claimed) revert Campaign_Claimed();
        if (campaign.deadline < block.timestamp) revert Campaign_Closed();

        // first time donating to this campaign
        if (campaign.donors[donor] == 0) campaign.donorAddresses.push(donor);

        campaign.amountRaised += donation;
        campaign.donors[donor] += donation;

        emit CrowdFunding_NewDonor(donor, campaign.id, donation);

        if (campaign.amountRaised >= campaign.goal * ONE_ETH) {
            autoWithdrawFundsWhenGoalIsMet(campaign.owner, _campaignID);
        }
    }
}
