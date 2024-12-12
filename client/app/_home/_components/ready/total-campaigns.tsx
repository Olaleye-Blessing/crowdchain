"use client";

import { useCrowdchainRequest } from "@/hooks/use-crowdchain-request";
import { TotalStats } from "../../interfaces";

export default function TotalCampaigns() {
  const { data } = useCrowdchainRequest<TotalStats>({
    url: "/crowdchain/totalStats",
    options: {
      queryKey: ["crowdchain-stats", "homepage"],
      staleTime: 1000 * 60 * 59,
    },
  });

  return (
    <p className="text-sm text-center mt-8 text-gray-500">
      Total Campaigns on CrowdChain:{" "}
      <span className="font-bold">
        {typeof data !== "undefined" ? data.totalCampaigns : "-"}
      </span>
    </p>
  );
}
