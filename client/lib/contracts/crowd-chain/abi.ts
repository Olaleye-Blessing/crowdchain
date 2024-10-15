const campaignDetails = `tuple(uint256 id, uint256 amountRaised, uint256 deadline, uint256 refundDeadline, uint256 goal, address owner, string title, string description, string coverImage, bool claimed, uint256 totalDonors, uint256 tokensAllocated, uint8 totalMilestones, uint8 currentMilestone, uint8 nextWithdrawableMilestone)`;

const basicMilestone = `tuple(uint256 targetAmount, uint256 deadline, string description)`;

const milestone = `tuple(uint8 id, uint256 targetAmount, uint256 deadline, string description, uint8 status)`;

export const crowdChainABI = [
  `function createCampaign(string title, string description, string coverImage, ${basicMilestone}[] milestones, uint256 goal, uint256 duration, uint256 refundDeadline)`,
  "function totalCampaigns() public view returns (uint256)",
  `function getCampaigns(uint256 page, uint256 perPage) external view returns (${campaignDetails}[], uint256)`,
  `function getOwnerCampaigns(address owner, uint256 page, uint256 perPage) external view returns (${campaignDetails}[] memory, uint256)`,
  `function getCampaign(uint256 campaignId) view returns (${campaignDetails})`,
  `function getCampaignMileStones(uint256 campaignId) view returns (${milestone}[], uint8, uint8)`,
  "function donate(uint256 campaignId) public payable",
  "function getCampaignDonors(uint256 campaignId) public view returns (address[] donors, uint256[] contributions)",
  "function refund(uint256 campaignId, uint256 amount) public",
  "function withdraw(uint256 campaignId) external",

  // =============== EVENTS ==============
  "event NewDonation(address indexed donor, uint256 indexed campaignId, uint256 amount)",
  "event DonationRefunded(address indexed donor, uint256 indexed campaignId, uint256 amount)",
  "event CampaignFundWithdrawn(uint256 indexed campaignId, address indexed owner, uint256 amount)",
];
