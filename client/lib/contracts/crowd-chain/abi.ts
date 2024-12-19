import { parseAbi } from "viem";

export const donationEvent =
  "event NewDonation(address indexed donor, uint256 indexed campaignId, address indexed coin, uint256 amount, string campaignTitle)";

export const wagmiAbi = parseAbi([
  // ============= Structs ==========
  "struct BasicMilestone {uint256 targetAmount; uint256 deadline; string description; }",
  "struct CampaignDetails { uint256 id; uint256 amountRaised; uint256 deadline; uint256 refundDeadline; uint256 goal; uint256 totalDonors; uint256 tokensAllocated; uint8 totalMilestones; uint8 currentMilestone; address owner; string title; string summary; string description; string coverImage; bool claimed; string[] categories; }",
  "struct Milestone { uint8 id; uint256 targetAmount; uint256 deadline; string description; uint8 status; }",
  "struct Donation {address donor; address coin; uint256 amount; uint256 timestamp; }",
  "struct Update { uint256 id; uint256 timestamp; string title; string content; }",

  // =============== FUNCTIONS ==============
  "function createCampaign(string title, string summary, string description, string coverImage, BasicMilestone[] milestones, string[] categories, uint256 goal, uint256 duration, uint256 refundDeadline) external",
  "function getCampaign(uint256 campaignId) view returns (CampaignDetails)",
  "function getCampaignMileStones(uint256 campaignId) view returns (Milestone[], uint8, uint8)",
  "function donateETH(uint256 campaignId) external payable",
  "function donateToken(uint256 campaignId, uint256 amount, address coin) external payable",
  "function refundETH(uint256 campaignId, uint256 amount) external",
  "function refundToken(uint256 campaignId, uint256 amount, address coin) public",
  "function withdraw(uint256 campaignId) public",
  "function getSupportedCoins() public view returns (address[] memory)",
  "function getCampaignDonations(uint256 campaignId, uint256 page, uint256 perPage) external view returns (Donation[] memory donations, uint256 totalDonations)",
  "function getAmountRaisedPerCoin(uint256 campaignId) external view returns (address[] memory coins, uint256[] memory amount)",
  "function postUpdate(uint256 campaignId, string title, string content) external",
  "function getCampaignUpdates(uint256 campaignId, uint256 page, uint256 perPage) external view returns (Update[] memory updates, uint256 total)",

  // =============== EVENTS ==============
  donationEvent,
  "event DonationRefunded(address indexed donor, uint256 indexed campaignId, uint256 amount)",
  "event CampaignFundWithdrawn(uint256 indexed campaignId, address indexed owner, address indexed coin, uint256 amount)",

  // ============= ERRORS =============
  "error Campaign__CampaignCreationFailed(string reason)",
  "error CampaignDonation__NotCampaignOwner()",

  "error CampaignDonation__EmptyDonation()",
  "error Campaign__CoinNotSupported(address coin)",
  "error CampaignDonation__DonationFailed(string reason)",
  "error CampaignDonation__CampaignAlreadyClaimed()",
  "error CampaignDonation__CampaignClosed()",
  "error CampaignDonation__InsufficientAllowance(address coin, uint256 amount)",

  "error CampaignDonation__WithdrawNotAllowed(string message)",
  "error CampaignDonation__RefundDeadlineElapsed(uint256 campaignId)",
  "error CampaignDonation__NoDonationFound(uint256 campaignId)",
  "error CampaignDonation__InsufficientDonation(uint256 campaignId, uint256 amountToRefund, uint256 amountDonated)",
  "error CampaignDonation__RefundFailed(uint256 campaignId)",
  "error CampaignDonation__WithdrawalFailed()",

  "error CampaignUpdates__IvalidData(string reason)",
  "error CampaignUpdates__UpdateNotExist(uint256 updateId)",
]);
