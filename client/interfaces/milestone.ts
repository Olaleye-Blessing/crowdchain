export enum MilestoneStatus {
  Pending = "PENDING",
  Funding = "FUNDING",
  Withdrawn = "WITHDRAWN",
  Started = "STARTED",
  Completed = "COMPLETED",
  Rejected = "REJECTED",
}

export interface IBasicMilestone {
  targetAmount: number;
  deadline: number;
  description: string;
}

export interface Milestone extends IBasicMilestone {
  id: number;
  status: MilestoneStatus;
}
