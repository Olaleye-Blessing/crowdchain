import { parseAbi } from 'viem';

export const DONATION_EVENT =
  'event NewDonation(address indexed donor, uint256 indexed campaignId, address coin, uint256 amount, string campaignTitle)';

export const UPDATE_EVENT =
  'event NewUpdate(uint256 indexed campaignId, uint256 indexed updateId, address indexed owner, string title)';

export const CAMPAIGN_CREATED_EVENT =
  'event CampaignCreated(address owner, uint256 campaignId, string title, uint256 totalCampaigns, string strCategories)';

export const crowdchainAbi = parseAbi([
  // ============= Structs ==========
  'struct CampaignDetails { uint256 id; uint256 amountRaised; uint256 deadline; uint256 refundDeadline; uint256 goal; uint256 totalDonors; uint256 tokensAllocated; uint8 totalMilestones; uint8 currentMilestone; address owner; string title; string summary; string description; string coverImage; bool claimed; string[] categories; }',

  // =============== Functions ==============
  'function totalCampaigns() external view returns (uint256)',
  'function getCampaigns(uint256 page, uint256 perPage) view returns (CampaignDetails[], uint256)',
  'function getCampaignsByCategory(string category, uint256 page, uint256 perPage) view returns (CampaignDetails[], uint256)',
  'function getOwnerCampaigns(address owner, uint256 page, uint256 perPage) view returns (CampaignDetails[], uint256)',
  'function getSupportedCoins() public view returns (address[] memory)',
  'function coinValueInUSD(address coin, uint256 amount) public view returns (uint256)',

  // =============== Events ==============
  DONATION_EVENT,
  UPDATE_EVENT,
  CAMPAIGN_CREATED_EVENT,
]);
