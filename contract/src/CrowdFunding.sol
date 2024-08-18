// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

error CrowdFunding_Campaign_Creation(string message);
error CrowdFunding_Campaign_NotExist();

contract CrowdFunding {
    struct Campaign {
        uint256 id;
        uint256 goal;
        uint256 deadline;
        uint256 amountRaised;
        address owner;
        string title;
        string description;
        bool claimed;
        mapping(address => uint256) donors;
        address[] donorAddresses;
    }

    uint32 private constant ONE_DAY = 1 * 24 * 60 seconds;

    Campaign[] private campaigns;
    mapping(address => uint256[]) private campaignsOwner;

    modifier CampaignExist(uint256 _campaignID) {
        if (_campaignID > campaigns.length) {
            revert CrowdFunding_Campaign_NotExist();
        }

        _;
    }

    function createCampaign(string memory _title, string memory _description, uint256 _goal, uint256 _duration)
        public
    {
        if (msg.sender == address(0)) {
            revert CrowdFunding_Campaign_Creation("Invalid sender address");
        }
        if (bytes(_title).length < 0 || bytes(_title).length > 200) {
            revert CrowdFunding_Campaign_Creation("Title must be between 1 and 200 characters");
        }
        if (bytes(_description).length < 10) {
            revert CrowdFunding_Campaign_Creation("Description must be greater than 100 characters");
        }
        if (_goal <= 0) {
            revert CrowdFunding_Campaign_Creation("Goal must be greater than 0");
        }

        uint256 deadline = uint256(_duration * ONE_DAY);

        if (deadline < ONE_DAY) {
            revert CrowdFunding_Campaign_Creation("Duration must be at least 1 day");
        }

        uint256 campaignID = campaigns.length;
        Campaign storage newCampaign = campaigns.push();

        newCampaign.id = campaignID;
        newCampaign.goal = _goal;
        newCampaign.deadline = block.timestamp + deadline;
        newCampaign.amountRaised = 0;
        newCampaign.owner = msg.sender;
        newCampaign.title = _title;
        newCampaign.description = _description;
        newCampaign.claimed = false;

        campaignsOwner[msg.sender].push(campaignID);
    }

    function getCampaign(uint256 _campaignID)
        public
        view
        CampaignExist(_campaignID)
        returns (
            uint256 id,
            uint256 goal,
            uint256 deadline,
            uint256 amountRaised,
            address owner,
            string memory title,
            string memory description,
            bool claimed
        )
    {
        Campaign storage campaign = campaigns[_campaignID];

        return (
            campaign.id,
            campaign.goal,
            campaign.deadline,
            campaign.amountRaised,
            campaign.owner,
            campaign.title,
            campaign.description,
            campaign.claimed
        );
    }

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
}
