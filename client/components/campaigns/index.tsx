"use client";
import { AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import Campaign from "./campaign";
import { ICampaignDetail } from "@/interfaces/campaign";

interface CampaignsProps {
  campaigns: ICampaignDetail[];
  emptyClass?: string;
  ulClass?: string;
  liClass?: string;
  detailClassName?: string;
  type?: "paginated";
}

export default function Campaigns({
  campaigns,
  emptyClass,
  ulClass,
  liClass,
  detailClassName,
  type,
}: CampaignsProps) {
  if (campaigns.length === 0 && type !== "paginated")
    return <p className={cn("", emptyClass)}>No campaigns yet</p>;

  return (
    <ul
      className={cn(
        "grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
        ulClass,
      )}
    >
      <AnimatePresence>
        {campaigns.map((campaign) => (
          <Campaign
            key={campaign.id}
            campaign={campaign}
            className={liClass}
            detailClassName={detailClassName}
          />
        ))}
      </AnimatePresence>
    </ul>
  );
}
