import { Address } from 'viem';

export interface IDonation {
  donor: Address;
  campaignId: number;
  amount: string;
  campaignTitle: string;
  coinUnit: string;
}

export interface IRefund {
  donor: Address;
  campaignId: number;
  amount: string;
  coinUnit: string;
}

export interface IUpdate {
  campaignId: number;
  updateId: number;
  owner: Address;
  title: string;
}

export interface ITotalStats {
  totalDonated: number;
  // totalDonors: number;
  totalCampaigns: number;
  lastProcessedBlock: number;
}

export type IBLOCK_RANGES = {
  RECENT: number;
  TOTAL: number;
};

export type ISupportedCoinsDetails = {
  [key: Address]: {
    name: string;
    decimal: number;
  };
};

export type ICampaignDetailsChain = {
  id: bigint;
  amountRaised: bigint;
  deadline: bigint;
  refundDeadline: bigint;
  goal: bigint;
  totalDonors: bigint;
  tokensAllocated: bigint;
  totalMilestones: number;
  currentMilestone: number;
  owner: `0x${string}`;
  title: string;
  summary: string;
  description: string;
  coverImage: string;
  claimed: boolean;
  categories: readonly string[];
};
