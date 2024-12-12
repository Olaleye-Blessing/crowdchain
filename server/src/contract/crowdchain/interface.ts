import { Address } from 'viem';

export interface IDonation {
  donor: Address;
  campaignId: number;
  amount: string;
  campaignTitle: string;
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
  totalDonors: number;
  totalCampaigns: number;
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
