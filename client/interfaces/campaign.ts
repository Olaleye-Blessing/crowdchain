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
