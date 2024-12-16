import { ReadContractErrorType } from "viem";
import { ICampaignDetail } from "@/interfaces/campaign";
import Loading from "@/app/loading";
import { Button } from "../ui/button";
import Campaigns from ".";

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
        <Campaigns
          type="paginated"
          campaigns={campaigns}
          emptyClass="text-sm"
        />
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
