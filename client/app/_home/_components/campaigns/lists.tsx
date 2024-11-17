"use client";

import { constructCampaign } from "@/app/campaigns/[id]/_utils/construct-campaign";
import Loading from "@/app/loading";
import Campaigns from "@/components/campaigns";
import { useCrowdchainAddress } from "@/hooks/use-crowdchain-address";
import { wagmiAbi } from "@/lib/contracts/crowd-chain/abi";
import { parseUnits } from "viem";
import { useReadContract } from "wagmi";

export default function Lists() {
  const { data, isFetching, error } = useReadContract({
    abi: wagmiAbi,
    address: useCrowdchainAddress(),
    functionName: "getCampaigns",
    args: [parseUnits("0", 0), parseUnits("3", 0)],
  });

  const campaigns = data?.[0].map((cam) => constructCampaign(cam));

  return (
    <div className="layout">
      {isFetching ? (
        <Loading />
      ) : error ? (
        <p>Error</p>
      ) : campaigns ? (
        <Campaigns
          campaigns={campaigns}
          emptyClass="text-sm"
          ulClass="flex flex-col sm:flex-row sm:justify-between sm:flex-wrap"
          liClass="max-w-none sm:flex-1 sm:min-w-[20rem] sm:max-w-[21rem]"
          detailClassName="lg:group-hover:top-60"
        />
      ) : null}
    </div>
  );
}
