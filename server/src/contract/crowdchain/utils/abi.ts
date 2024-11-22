import { parseAbi } from 'viem';

export const DONATION_EVENT =
  'event NewDonation(address indexed donor, uint256 indexed campaignId, uint256 amount, string campaignTitle)';

export const UPDATE_EVENT =
  'event NewUpdate(uint256 indexed campaignId, uint256 indexed updateId, address indexed owner, string title)';

export const crowdchainAbi = parseAbi([
  // ============= Structs ==========

  // =============== Functions ==============

  // =============== Events ==============
  DONATION_EVENT,
  UPDATE_EVENT,
]);
