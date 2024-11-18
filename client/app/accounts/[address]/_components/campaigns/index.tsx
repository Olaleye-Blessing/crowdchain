"use client";

import { useEffect, useState } from "react";
import { formatUnits, parseUnits } from "viem";
import { useReadContract } from "wagmi";
import { constructCampaign } from "@/app/campaigns/[id]/_utils/construct-campaign";
import { useCrowdchainAddress } from "@/hooks/use-crowdchain-address";
import { IAddress } from "@/interfaces/address";
import { ICampaignDetail } from "@/interfaces/campaign";
import { wagmiAbi } from "@/lib/contracts/crowd-chain/abi";
import PaginatedCampaigns from "@/components/campaigns/paginated";

const perPage = process.env.NODE_ENV === "production" ? "20" : "2";

export default function Campaigns({ account }: { account: IAddress }) {
  const [page, setPage] = useState(0);
  const [totalCampaigns, setTotalCampaigns] = useState<number | null>(null);
  const [campaigns, setCampaigns] = useState<ICampaignDetail[]>([]);
  const { data, isFetching, error } = useReadContract({
    abi: wagmiAbi,
    address: useCrowdchainAddress(),
    functionName: "getOwnerCampaigns",
    args: [account, parseUnits(String(page), 0), parseUnits(perPage, 0)],
    query: {
      refetchInterval: false,
      refetchIntervalInBackground: false,
      refetchOnWindowFocus: false,
    },
  });

  useEffect(() => {
    if (!data) return;

    const [_campaigns, _total] = data;

    if (_campaigns.length === 0)
      return setTotalCampaigns(+formatUnits(_total, 0));

    setCampaigns(_campaigns.map((cam) => constructCampaign(cam)));

    if (!totalCampaigns) setTotalCampaigns(+formatUnits(_total, 0));

    return () => {};
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
