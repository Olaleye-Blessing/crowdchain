import { ReadContractErrorType } from "viem";
import { ICampaignDetail } from "@/interfaces/campaign";
import Loading from "@/app/loading";
import Campaign from "./campaign";
import { Button } from "../ui/button";

interface PaginatedCampaignsProps {
  totalCampaigns: number | null;
  campaigns: ICampaignDetail[];
  isFetching: boolean;
  error: ReadContractErrorType | Error | null;
  loadMore(): void;
  emptyCampaignsMsg: string;
}

export default function PaginatedCampaigns({
  totalCampaigns,
  campaigns,
  isFetching,
  error,
  emptyCampaignsMsg,
  loadMore,
}: PaginatedCampaignsProps) {
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
        <p className="text-center">{emptyCampaignsMsg}</p>
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
