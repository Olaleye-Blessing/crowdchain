export interface ICampaign {
  id: number;
  amountRaised: number;
  deadline: number;
  refundDeadline: number;
  goal: number;
  owner: string;
  title: string;
  description: string;
  coverImage: string;
  claimed: boolean;
}

export interface ICampaignDetail extends ICampaign {
  totalDonors: number;
  totalMilestones: number;
  currentMilestone: number;
  nextWithdrawableMilestone: number;
}
