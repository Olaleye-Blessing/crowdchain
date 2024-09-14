// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.26;

import {BaseCampaign} from "./Campaign.sol";

contract CrowdFunding is BaseCampaign {
    event CrowdFunding_NewDonor(address donor, uint256 campaignID, uint256 amount);
    event CrowdFunding_Refund(uint256 campaignID, uint256 amount);

    error CrowdFunding_NoDonation(uint256 campaignID);
    error CrowdFunding_Insufficient_Donation(uint256 campaignID, uint256 amountToRefund, uint256 amountDonated);
    error CrowdFunding_Refund_Failed(uint256 campaignID);

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
            emit Campaign_Goal_Completed(campaign.owner, _campaignID, campaign.amountRaised);
        }
    }

    function refund(uint256 _campaignID, uint256 _amount) public CampaignExist(_campaignID) {
        Campaign storage campaign = campaigns[_campaignID];

        if (campaign.claimed) revert Campaign_Claimed();
        if (block.timestamp >= campaign.refundDeadline) revert Campaign_Refund_Deadline_Elasped(_campaignID);

        address donor = msg.sender;
        uint256 amountDonated = campaign.donors[donor];

        if (amountDonated == 0) revert CrowdFunding_NoDonation(_campaignID);

        uint256 amountInWEI = _amount * ONE_ETH;

        if (amountDonated < amountInWEI) revert CrowdFunding_Insufficient_Donation(_campaignID, _amount, amountDonated);

        campaign.amountRaised -= amountInWEI;
        campaign.donors[donor] -= amountInWEI;

        if ((amountDonated - amountInWEI) == 0) _removeAddress(campaign.donorAddresses, donor);

        (bool withdrawSuccess,) = payable(donor).call{value: _amount}("");

        if (!withdrawSuccess) revert CrowdFunding_Refund_Failed(_campaignID);

        emit CrowdFunding_Refund(_campaignID, _amount);
    }

    function _removeAddress(address[] storage array, address addressToRemove) internal returns (bool) {
        for (uint256 i = 0; i < array.length; i++) {
            if (array[i] == addressToRemove) {
                if (i < array.length - 1) {
                    array[i] = array[array.length - 1];
                }
                array.pop();
                return true;
            }
        }

        return false;
    }
}
