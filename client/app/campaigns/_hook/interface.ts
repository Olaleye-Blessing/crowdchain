export type ICampaignResult = readonly [
  readonly {
    deadline: bigint;
    description: string;
    id: bigint;
    amountRaised: bigint;
    refundDeadline: bigint;
    goal: bigint;
    totalDonors: bigint;
    tokensAllocated: bigint;
    totalMilestones: number;
    currentMilestone: number;
    nextWithdrawableMilestone: number;
    title: string;
    summary: string;
    coverImage: string;
    owner: `0x${string}`;
    categories: readonly string[];
    claimed: boolean;
  }[],
  bigint,
];
