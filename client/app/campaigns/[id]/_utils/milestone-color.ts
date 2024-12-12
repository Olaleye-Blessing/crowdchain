import { MilestoneStatus } from "@/interfaces/milestone";

const colors: Record<
  MilestoneStatus,
  { background: string; foreground: string }
> = {
  PENDING: { background: "bg-gray-500", foreground: "text-gray-600" },
  FUNDING: { background: "bg-blue-500", foreground: "text-blue-600" },
  WITHDRAWN: { background: "bg-purple-500", foreground: "text-purple-600" },
  STARTED: { background: "bg-yellow-500", foreground: "text-yellow-600" },
  COMPLETED: { background: "bg-green-500", foreground: "text-green-600" },
  REJECTED: { background: "bg-red-500", foreground: "text-red-600" },
};

export const getMilestoneStatusColor = (status: MilestoneStatus) =>
  colors[status];
