import { Address } from "viem";

export interface ICampaign {
  id: number;
  amountRaised: number;
  deadline: number;
  refundDeadline: number;
  goal: number;
  owner: string;
  title: string;
  summary: string;
  description: string;
  coverImage: string;
  claimed: boolean;
  categories: string[];
}

export interface ICampaignDetail extends ICampaign {
  totalDonors: number;
  totalMilestones: number;
  currentMilestone: number;
}

export interface ICampaignDetailBackend {
  id: string;
  amountRaised: string;
  deadline: string;
  refundDeadline: string;
  goal: string;
  totalDonors: string;
  tokensAllocated: string;
  totalMilestones: number;
  currentMilestone: number;
  owner: Address;
  title: string;
  summary: string;
  description: string;
  coverImage: string;
  claimed: boolean;
  categories: string[];
}

export type ICampaignsResult = {
  campaigns: ICampaignDetailBackend[];
  total: string;
};
