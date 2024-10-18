"use client";

import { useEffect } from "react";
import { useReadContract } from "wagmi";
import { formatUnits, parseUnits } from "viem";
import { constructCampaign } from "../[id]/_utils/construct-campaign";
import Campaign from "@/components/campaigns/campaign";
import Loading from "@/app/loading";
import { Button } from "@/components/ui/button";
import { useHomeCampaigns } from "./store";
import { wagmiAbi } from "@/lib/contracts/crowd-chain/abi";
import { useCrowdchainAddress } from "@/hooks/use-crowdchain-address";

const perPage = process.env.NODE_ENV === "production" ? "20" : "5";

export default function Main() {
  const page = useHomeCampaigns((state) => state.page);
  const totalPage = useHomeCampaigns((state) => state.totalPage);
  const campaigns = useHomeCampaigns((state) => state.campaigns);
  const increasePage = useHomeCampaigns((state) => state.increasePage);
  const setTotalPage = useHomeCampaigns((state) => state.setTotalPage);
  const setCampaigns = useHomeCampaigns((state) => state.setCampaigns);

  const { data, isFetching, error } = useReadContract({
    abi: wagmiAbi,
    address: useCrowdchainAddress(),
    functionName: "getCampaigns",
    args: [parseUnits(String(page), 0), parseUnits(perPage, 0)],
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

    if (!totalPage) setTotalPage(+formatUnits(_total, 0));
  }, [data]);

  return (
    <main className="">
      <ul className="grid gap-4 grid-cols-1 sm:grid-cols-[repeat(auto-fit,minmax(18rem,_1fr))] md:grid-cols-[repeat(auto-fit,minmax(21rem,_1fr))]">
        {campaigns.map((cam) => (
          <Campaign
            key={cam.id}
            campaign={cam}
            className="max-w-96 md:max-w-[28rem]"
          />
        ))}
      </ul>
      <div className="flex items-center justify-center mt-4">
        {error && <p>error</p>}
        {isFetching && <Loading />}
        {!isFetching && campaigns.length < totalPage && (
          <Button
            onClick={() => {
              increasePage();
            }}
            className="block mx-auto"
            variant="secondary"
          >
            Load More
          </Button>
        )}
      </div>
    </main>
  );
}
