"use client";

import { constructCampaign } from "@/app/campaigns/[id]/_utils/construct-campaign";
import Loading from "@/app/loading";
import Campaigns from "@/components/campaigns";
import { useCrowdchainRequest } from "@/hooks/use-crowdchain-request";
import { ICampaignsResult } from "@/interfaces/campaign";

export default function Lists() {
  const { data, isFetching, error } = useCrowdchainRequest<ICampaignsResult>({
    url: `/crowdchain/campaigns?page=0&category=all`,
    options: {
      queryKey: ["campaigns", { category: "all", page: 0 }],
    },
  });

  const campaigns = data?.campaigns.map((cam) => constructCampaign(cam));

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
