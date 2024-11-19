import { useEffect, useState } from "react";
import { formatUnits } from "viem";
import { useAccount, useReadContract } from "wagmi";
import { useCrowdchainAddress } from "@/hooks/use-crowdchain-address";
import { ICampaignDetail } from "@/interfaces/campaign";
import { wagmiAbi } from "@/lib/contracts/crowd-chain/abi";
import { IUpdate } from "@/interfaces/update";
import { constructUpdate } from "@/utils/construct-update";
import Loading from "@/app/loading";
import { Button } from "@/components/ui/button";
import { arrayOfUniqueObjs } from "@/utils/unique-arr-objects";
import PostUpdates from "./post-update";
import Update from "./update";
import "./updates.css";

const perPage = process.env.NODE_ENV === "production" ? 10 : 2;

export default function Updates({ campaign }: { campaign: ICampaignDetail }) {
  const { address } = useAccount();
  const [page, setPage] = useState(0);
  const [updates, setUpdates] = useState<IUpdate[]>([]);
  const [totalUpdates, setTotalUpdates] = useState<number | null>(null);
  const { data, isFetching, error } = useReadContract({
    abi: wagmiAbi,
    address: useCrowdchainAddress(),
    functionName: "getCampaignUpdates",
    args: [BigInt(campaign.id), BigInt(page), BigInt(perPage)],
  });

  const loadMore = () => setPage((prev) => prev + 1);

  useEffect(() => {
    if (!data) return;

    const [_updates, _total] = data;

    if (totalUpdates === null) setTotalUpdates(+formatUnits(_total, 0));

    if (_updates.length === 0) return;

    setUpdates((prev) => {
      let newUpdates = [
        ...prev,
        ..._updates.map((update) => constructUpdate(update)),
      ];

      if (process.env.NODE_ENV !== "production")
        newUpdates = arrayOfUniqueObjs(newUpdates, "id");

      return newUpdates;
    });
  }, [data]);

  return (
    <section>
      {address === campaign.owner && (
        <div className="mb-2 border-b border-border pb-2">
          <PostUpdates campaignId={campaign.id} />
        </div>
      )}
      <div>
        {Boolean(totalUpdates) && (
          <ul className="">
            {updates.map((update) => (
              <Update key={update.id} {...update} />
            ))}
          </ul>
        )}
        {!isFetching && !error && totalUpdates === 0 && (
          <p className="text-center">There are no updates yet</p>
        )}
        <div className="flex items-center justify-center mt-4">
          {error && <p>error</p>}
          {isFetching && <Loading />}
          {totalUpdates !== null &&
            !isFetching &&
            updates.length < totalUpdates && (
              <Button
                onClick={loadMore}
                className="block mx-auto"
                variant="secondary"
              >
                Load More
              </Button>
            )}
        </div>
      </div>
    </section>
  );
}
