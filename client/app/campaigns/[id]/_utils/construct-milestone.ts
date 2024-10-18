import { Milestone, MilestoneStatus } from "@/interfaces/milestone";
import { formatEther, formatUnits } from "viem";

export const milestoneStatuses = {
  0: MilestoneStatus.Pending,
  1: MilestoneStatus.InProgress,
  2: MilestoneStatus.Completed,
  3: MilestoneStatus.Approved,
  4: MilestoneStatus.Rejected,
};

export const constructMilestone = (_milestone: any): Milestone => {
  return {
    id: _milestone.id,
    targetAmount: +formatEther(_milestone.targetAmount),
    deadline: +formatUnits(_milestone.deadline, 0),
    description: _milestone.description,
    status:
      milestoneStatuses[_milestone.status as keyof typeof milestoneStatuses],
  };
};
