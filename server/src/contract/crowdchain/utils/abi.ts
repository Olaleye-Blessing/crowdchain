import { parseAbi } from 'viem';

export const DONATION_EVENT =
  'event NewDonation(address indexed donor, uint256 indexed campaignId, address coin, uint256 amount, string campaignTitle)';

export const UPDATE_EVENT =
  'event NewUpdate(uint256 indexed campaignId, uint256 indexed updateId, address indexed owner, string title)';

export const crowdchainAbi = parseAbi([
  // ============= Structs ==========

  // =============== Functions ==============
  'function totalCampaigns() external view returns (uint256)',
  'function getSupportedCoins() public view returns (address[] memory)',
  'function coinValueInUSD(address coin, uint256 amount) public view returns (uint256)',

  // =============== Events ==============
  DONATION_EVENT,
  UPDATE_EVENT,
]);
