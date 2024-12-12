"use client";

import { useEffect, useState } from "react";
import { constructCampaign } from "@/app/campaigns/[id]/_utils/construct-campaign";
import { IAddress } from "@/interfaces/address";
import { ICampaignDetail, ICampaignsResult } from "@/interfaces/campaign";
import PaginatedCampaigns from "@/components/campaigns/paginated";
import { useCrowdchainRequest } from "@/hooks/use-crowdchain-request";
import { arrayOfUniqueObjs } from "@/utils/unique-arr-objects";

export default function Campaigns({ account }: { account: IAddress }) {
  const [page, setPage] = useState(0);
  const [totalCampaigns, setTotalCampaigns] = useState<number | null>(null);
  const [campaigns, setCampaigns] = useState<ICampaignDetail[]>([]);
  const { data, isFetching, error } = useCrowdchainRequest<ICampaignsResult>({
    url: `/crowdchain/campaigns/${account}?page=${page}`,
    options: {
      queryKey: ["campaigns", "account", { account, page }],
      refetchInterval: false,
      refetchIntervalInBackground: false,
      refetchOnWindowFocus: false,
    },
  });

  useEffect(() => {
    if (!data) return;

    const { campaigns: _campaigns, total: _total } = data;

    setCampaigns((prev) => {
      let newCampaigns = [
        ...prev,
        ..._campaigns.map((cam) => constructCampaign(cam)),
      ];

      if (process.env.NODE_ENV !== "production")
        newCampaigns = arrayOfUniqueObjs(newCampaigns, "id");

      return newCampaigns;
    });

    setTotalCampaigns(+_total);
  }, [data]);

  return (
    <PaginatedCampaigns
      totalCampaigns={totalCampaigns}
      campaigns={campaigns}
      isFetching={isFetching}
      error={error}
      emptyCampaignsMsg="No campaigns"
      loadMore={() => setPage((prev) => prev + 1)}
    />
  );
}
