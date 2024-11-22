import { Address } from 'viem';

export interface IDonation {
  donor: Address;
  campaignId: number;
  amount: string;
  campaignTitle: string;
}

export interface IUpdate {
  campaignId: number;
  updateId: number;
  owner: string;
  title: string;
}

export interface ITotalStats {
  totalDonated: number;
  totalDonors: number;
}

export type IBLOCK_RANGES = {
  RECENT: number;
  TOTAL: number;
};
