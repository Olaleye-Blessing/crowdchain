"use client";

import { useCampaigns } from "../../_hook/use-campaigns";
import PaginatedCampaigns from "@/components/campaigns/paginated";

export default function Output() {
  const { campaigns, error, isFetching, loadMore, totalCampaigns } =
    useCampaigns();

  return (
    <PaginatedCampaigns
      totalCampaigns={totalCampaigns}
      campaigns={campaigns}
      isFetching={isFetching}
      error={error}
      loadMore={loadMore}
      emptyCampaignsMsg="There are no campaigns matching your search."
    />
  );
}
