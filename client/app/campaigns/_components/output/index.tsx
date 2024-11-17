"use client";

import Loading from "@/app/loading";
import { Button } from "@/components/ui/button";
import Campaign from "@/components/campaigns/campaign";
import { useCampaigns } from "../../_hook/use-campaigns";

export default function Output() {
  const { campaigns, error, isFetching, loadMore, totalCampaigns } =
    useCampaigns();

  return (
    <>
      {Boolean(totalCampaigns) && (
        <ul className="grid gap-4 grid-cols-1 sm:grid-cols-[repeat(auto-fit,minmax(18rem,_1fr))] md:grid-cols-[repeat(auto-fit,minmax(21rem,_1fr))]">
          {campaigns.map((cam) => (
            <Campaign
              key={cam.id}
              campaign={cam}
              className="max-w-96 md:max-w-[28rem]"
            />
          ))}
        </ul>
      )}
      {!isFetching && !error && totalCampaigns === 0 && (
        <p className="text-center">
          There are no campaigns matching your search.
        </p>
      )}
      <div className="flex items-center justify-center mt-4">
        {error && <p>error</p>}
        {isFetching && <Loading />}
        {totalCampaigns !== null &&
          !isFetching &&
          campaigns.length < totalCampaigns && (
            <Button
              onClick={loadMore}
              className="block mx-auto"
              variant="secondary"
            >
              Load More
            </Button>
          )}
      </div>
    </>
  );
}
