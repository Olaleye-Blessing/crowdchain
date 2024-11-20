import { parseAbi } from 'viem';

export const donationEvent =
  'event NewDonation(address indexed donor, uint256 indexed campaignId, uint256 amount, string campaignTitle)';

export const crowdchainAbi = parseAbi([
  // ============= Structs ==========

  // =============== Functions ==============

  // =============== Events ==============
  donationEvent,
]);
