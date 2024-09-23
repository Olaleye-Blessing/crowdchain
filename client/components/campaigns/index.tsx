import { cn } from "@/lib/utils";
import Campaign from "./campaign";
import { ICampaignDetail } from "@/interfaces/campaign";

interface CampaignsProps {
  campaigns: ICampaignDetail[];
  emptyClass?: string;
  ulClass?: string;
  liClass?: string;
}

export default function Campaigns({
  campaigns,
  emptyClass,
  ulClass,
  liClass,
}: CampaignsProps) {
  if (campaigns.length === 0)
    return <p className={cn("", emptyClass)}>No campaigns yet</p>;

  return (
    <ul
      className={cn(
        "grid gap-4 grid-cols-1 sm:grid-cols-[repeat(auto-fit,minmax(18.75rem,_1fr))]",
        ulClass,
      )}
    >
      {campaigns.map((campaign) => (
        <Campaign key={campaign.id} campaign={campaign} className={liClass} />
      ))}
    </ul>
  );
}
