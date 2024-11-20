import { Address } from 'viem';

export interface IDonation {
  donor: Address;
  campaignId: number;
  amount: string;
  campaignTitle: string;
  timestamp: number;
  blockNumber: number;
}
