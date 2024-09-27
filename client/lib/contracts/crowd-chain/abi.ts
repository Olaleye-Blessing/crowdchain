const campaignDetails = `tuple(uint256 id, uint256 amountRaised, uint256 deadline, uint256 refundDeadline, uint256 goal, address owner, string title, string description, string coverImage, bool claimed, uint256 totalDonors, uint256 tokensAllocated)`;

export const crowdChainABI = [
  "function createCampaign(string title, string description, string coverImage, uint256 goal, uint64 duration, uint256 refundDeadline)",
  "function totalCampaigns() public view returns (uint256)",
  `function getCampaigns(uint256 page, uint256 perPage) external view returns (${campaignDetails}[], uint256)`,
  `function getCampaign(uint256 campaignId) view returns (${campaignDetails})`,
  "function donate(uint256 campaignId) public payable",
  "function getCampaignDonors(uint256 campaignId) public view returns (address[] donors, uint256[] contributions)",
  "function refund(uint256 campaignId, uint256 amount) public",

  // =============== EVENTS ==============
  "event NewDonation(address indexed donor, uint256 indexed campaignId, uint256 amount)",
  "event DonationRefunded(address indexed donor, uint256 indexed campaignId, uint256 amount)",
];
