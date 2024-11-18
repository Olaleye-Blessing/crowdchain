"use client";

import { useEffect, useState } from "react";
import { formatUnits, parseUnits } from "viem";
import { useReadContract } from "wagmi";
import { constructCampaign } from "@/app/campaigns/[id]/_utils/construct-campaign";
import { useCrowdchainAddress } from "@/hooks/use-crowdchain-address";
import { IAddress } from "@/interfaces/address";
import { ICampaignDetail } from "@/interfaces/campaign";
import { wagmiAbi } from "@/lib/contracts/crowd-chain/abi";
import Campaign from "@/components/campaigns/campaign";
import Loading from "@/app/loading";
import { Button } from "@/components/ui/button";

const perPage = process.env.NODE_ENV === "production" ? "20" : "2";

export default function Campaigns({ account }: { account: IAddress }) {
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [campaigns, setCampaigns] = useState<ICampaignDetail[] | null>(null);
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

    if (_campaigns.length === 0) return;

    setCampaigns(_campaigns.map((cam) => constructCampaign(cam)));

    if (!totalPages) setTotalPages(+formatUnits(_total, 0));

    return () => {};
  }, [data]);

  return (
    <>
      {!isFetching && !error && !campaigns && (
        <p className="text-center">No Campaigns</p>
      )}
      {campaigns && (
        <ul className="mb-4 grid gap-4 grid-cols-1 sm:grid-cols-[repeat(auto-fit,minmax(18rem,_1fr))] md:grid-cols-[repeat(auto-fit,minmax(21rem,_1fr))]">
          {campaigns.map((cam: any) => (
            <Campaign
              key={cam.id}
              campaign={cam}
              className="max-w-96 md:max-w-[28rem]"
            />
          ))}
        </ul>
      )}
      {isFetching && <Loading />}
      {error && <p className="text-red-800">Error</p>}
      {Boolean(
        !isFetching &&
          !error &&
          totalPages &&
          campaigns &&
          campaigns.length < totalPages,
      ) && (
        <Button
          onClick={() => {
            setPage((prev) => prev + 1);
          }}
          className="block mx-auto"
          variant="secondary"
        >
          Load More
        </Button>
      )}
    </>
  );
}
