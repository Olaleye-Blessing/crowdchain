export enum MilestoneStatus {
  Pending = "PENDING",
  InProgress = "IN PROGRESS",
  Completed = "COMPLETED",
  Approved = "APPROVED",
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
