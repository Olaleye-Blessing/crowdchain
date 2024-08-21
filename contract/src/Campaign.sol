// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.26;

contract BaseCampaign {
    event Campaign_Fund_Withdrawn(uint256 _campaignID, address owner, uint256 amount);

    error Campaign_Not_Exist();
    error Campaign_Creation(string message);
    error Campaign_EmptyDonation();
    error Campaign_Closed();
    error Campaign_Claimed();
    error Campaign_Not_Owner();
    error Campaign_Withdraw_Failed();

    uint16 private constant ONE_DAY = 1 * 24 * 60 seconds;
    uint256 constant ONE_ETH = 10 ** 18; // wei

    mapping(address => uint256[]) private campaignsOwner;

    struct Campaign {
        uint256 id;
        uint256 amountRaised; // 195 ETH * 10**18 wei
        uint256 deadline; // 1724006777 in seconds
        uint32 goal; // 200 ETH
        address owner;
        string title;
        string description;
        bool claimed;
        mapping(address => uint256) donors;
        address[] donorAddresses;
    }

    Campaign[] internal campaigns;

    modifier CampaignExist(uint256 _campaignID) {
        if (_campaignID > campaigns.length) {
            revert Campaign_Not_Exist();
        }

        _;
    }

    function totalCampaigns() public view returns (uint256) {
        return campaigns.length;
    }

    function createCampaign(string memory _title, string memory _description, uint32 _goal, uint64 _duration) public {
        if (msg.sender == address(0)) {
            revert Campaign_Creation("Invalid sender address");
        }
        if (bytes(_title).length <= 0 || bytes(_title).length > 200) {
            revert Campaign_Creation("Title must be between 1 and 200 characters");
        }
        if (bytes(_description).length < 10) {
            revert Campaign_Creation("Description must be greater than 100 characters");
        }

        // uint32 goal = uint32(_goal / (10 ** 18));

        if (_goal <= 0) {
            revert Campaign_Creation("Goal must be greater than 0");
        }

        uint256 deadline = uint256(_duration * ONE_DAY);

        if (deadline < ONE_DAY) {
            revert Campaign_Creation("Duration must be at least 1 day");
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

    function withdraw(uint256 _campaignID) public payable CampaignExist(_campaignID) {
        Campaign storage campaign = campaigns[_campaignID];

        address owner = msg.sender;

        if (campaign.claimed) revert Campaign_Claimed();
        if (owner != campaign.owner) revert Campaign_Not_Owner();

        campaign.claimed = true;
        uint256 amount = campaign.amountRaised;

        (bool withdrawSuccess,) = payable(owner).call{value: amount}("");
        if (!withdrawSuccess) revert Campaign_Withdraw_Failed();

        emit Campaign_Fund_Withdrawn(_campaignID, owner, amount);
    }
}
