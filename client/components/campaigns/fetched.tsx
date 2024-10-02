"use client";

import Loading from "@/app/loading";
import Campaign from "./campaign";
import { IFetchCampaigns, useFetchCampaigns } from "./use-fetch-campaings";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type IFetchedCampaigns = IFetchCampaigns & {
  ulClassName?: string;
};

export default function FetchedCampaigns({
  address,
  page,
  perPage,
  ulClassName,
}: IFetchedCampaigns) {
  const { campaigns, showLoadMore, fetchMore } = useFetchCampaigns({
    address,
    page,
    perPage,
  });

  return (
    <>
      {campaigns.data && (
        <>
          {campaigns.data.length === 0 ? (
            <p className="">No campaigns yet</p>
          ) : (
            <ul
              className={cn(
                "mb-4 grid gap-4 grid-cols-1 sm:grid-cols-[repeat(auto-fit,minmax(18rem,_1fr))] md:grid-cols-[repeat(auto-fit,minmax(21rem,_1fr))]",
                ulClassName,
              )}
            >
              {campaigns.data.map((cam) => (
                <Campaign
                  key={cam.id}
                  campaign={cam}
                  className="max-w-96 md:max-w-[28rem]"
                />
              ))}
            </ul>
          )}
        </>
      )}

      <div className="flex items-center justify-center">
        {campaigns.error && <p>{campaigns.error}</p>}
        {campaigns.loading && <Loading />}
        {showLoadMore && (
          <Button
            onClick={fetchMore}
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
