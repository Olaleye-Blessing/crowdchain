"use client";

import { useSupportedCoins } from "@/hooks/use-supported-coins";
import { TotalStats } from "../../interfaces";
import { useCrowdchainRequest } from "@/hooks/use-crowdchain-request";
import Detail from "./detail";

export default function Details() {
  const { data: totalStats, isFetching: isFetchingTotalStats } =
    useCrowdchainRequest<TotalStats>({
      url: "/crowdchain/totalStats",
      options: {
        queryKey: ["crowdchain-stats", "homepage"],
        staleTime: 1000 * 60 * 59,
      },
    });
  const { supportedTokens, isFetching: isFetchingCoins } = useSupportedCoins({
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  return (
    <section className="layout">
      <ul className="bg-primary grid grid-cols-1 gap-4 max-w-[75rem] mx-auto rounded-md py-10 px-5 md:grid-cols-3">
        <Detail
          title="Campaigns on Crowdchain"
          body={totalStats?.totalCampaigns || 0}
          isLoading={isFetchingTotalStats}
        />
        <Detail
          title="Amount Donated"
          body={totalStats?.totalDonated || 0}
          isLoading={isFetchingTotalStats}
          type="amount"
        />
        <Detail
          title="Supported Tokens"
          body={Object.keys(supportedTokens).length}
          isLoading={isFetchingCoins}
        />
      </ul>
    </section>
  );
}
