import { parseAbi } from "viem";

export const wagmiAbi = parseAbi([
  "struct BasicMilestone {uint256 targetAmount; uint256 deadline; string description; }",
  "struct CampaignDetails { uint256 id; uint256 amountRaised; uint256 deadline; uint256 refundDeadline; uint256 goal; uint256 totalDonors; uint256 tokensAllocated; uint8 totalMilestones; uint8 currentMilestone; uint8 nextWithdrawableMilestone; address owner; string title; string summary; string description; string coverImage; bool claimed; string[] categories }",
  "struct Milestone { uint8 id; uint256 targetAmount; uint256 deadline; string description; uint8 status; }",

  // =============== FUNCTIONS ==============
  "function createCampaign(string title, string summary, string description, string coverImage, BasicMilestone[] milestones, string[] categories, uint256 goal, uint256 duration, uint256 refundDeadline) public",
  "function totalCampaigns() public view returns (uint256)",
  "function getCampaigns(uint256 page, uint256 perPage) view returns (CampaignDetails[], uint256)",
  "function getOwnerCampaigns(address owner, uint256 page, uint256 perPage) view returns (CampaignDetails[], uint256)",
  "function getCampaign(uint256 campaignId) view returns (CampaignDetails)",
  "function getCampaignMileStones(uint256 campaignId) view returns (Milestone[], uint8, uint8)",
  "function donate(uint256 campaignId) public payable",
  "function getCampaignDonors(uint256 campaignId) public view returns (address[] donors, uint256[] contributions)",
  "function refund(uint256 campaignId, uint256 amount) public",
  "function withdraw(uint256 campaignId)",

  // =============== EVENTS ==============
  "event NewDonation(address indexed donor, uint256 indexed campaignId, uint256 amount, string campaignTitle)",
  "event DonationRefunded(address indexed donor, uint256 indexed campaignId, uint256 amount)",
  "event CampaignFundWithdrawn(uint256 indexed campaignId, address indexed owner, uint256 amount)",
]);
