import { ICampaignDetail } from "@/interfaces/campaign";
import { formatEther, formatUnits } from "viem";

export const constructCampaign = (_campaign: any): ICampaignDetail => {
  let coverImage = _campaign.coverImage as string;
  // IPFS service provider was switched to another service at some point
  if (!coverImage.startsWith("https")) {
    coverImage = `https://aquamarine-definite-canidae-414.mypinata.cloud/ipfs/${_campaign.coverImage || "QmZK7UDVm4EpSzvwWjGDvBfvrCduyPW5vHWwtC9u5wjULS"}`;
  }

  return {
    id: +formatUnits(_campaign.id, 0),
    amountRaised: +formatEther(_campaign.amountRaised),
    deadline: +formatUnits(_campaign.deadline, 0),
    refundDeadline: +formatUnits(_campaign.refundDeadline, 0),
    goal: +formatEther(_campaign.goal),
    owner: _campaign.owner,
    title: _campaign.title,
    summary: _campaign.summary,
    description: _campaign.description,
    coverImage,
    claimed: _campaign.claimed,
    totalDonors: +formatUnits(_campaign.totalDonors, 0),
    totalMilestones: _campaign.totalMilestones,
    currentMilestone: _campaign.currentMilestone,
    categories: _campaign.categories,
  };
};
