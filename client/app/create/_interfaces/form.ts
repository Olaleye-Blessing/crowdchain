import { ICampaign } from "@/interfaces/campaign";
import { IBasicMilestone } from "@/interfaces/milestone";

type TMilestone = Pick<IBasicMilestone, "description" | "targetAmount"> & {
  id: string;
  deadline: Date | undefined;
};

export interface ICampaignForm
  extends Pick<ICampaign, "description" | "goal" | "title"> {
  deadline: Date | undefined;
  refundDeadline: Date | undefined;
  milestones: TMilestone[];
  coverImage: File | null;
}

export type IRuleKey =
  | "last-milestone-target-amount"
  | "last-milestone-deadline"
  | "previous-milestone-target-amount"
  | "previous-milestone-deadline";

export interface IRule {
  description: string;
  valid: boolean;
}
