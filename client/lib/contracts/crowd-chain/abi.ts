export const crowdChainABI = [
  "function createCampaign(string title, string description, string coverImage, uint256 goal, uint64 duration, uint256 refundDeadline)",
  "function getCampaign(uint256 campaignId) view returns (tuple(uint256 id, uint256 amountRaised, uint256 deadline, uint256 refundDeadline, uint256 goal, address owner, string title, string description, string coverImage, bool claimed, uint256 totalDonors))",
  "function donate(uint256 campaignId) public payable",
  "function getCampaignDonors(uint256 campaignId) public view returns (address[] donors, uint256[] contributions)",

  // =============== EVENTS ==============
  "event NewDonation(address indexed donor, uint256 indexed campaignId, uint256 amount)",
];
