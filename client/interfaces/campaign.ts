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
  nextWithdrawableMilestone: number;
}
