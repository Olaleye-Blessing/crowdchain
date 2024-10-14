"use client";

import { useEffect, useState } from "react";
import Details from "./details";
import useWalletStore from "@/stores/wallet";
import { IFetch } from "@/interfaces/fetch";
import { ICampaignDetail } from "@/interfaces/campaign";
import { constructCampaign } from "../_utils/construct-campaign";
import { sleep } from "@/utils/sleep";
import Loading from "@/app/loading";
import {
  campaignClaimedEventFilter,
  campaignDonorEventFilter,
  campaignRefundEventFilter,
} from "../_utils/events-filter";

export default function Main({ id }: { id: string }) {
  const readonlyContract = useWalletStore((state) => state.readonlyContract!);
  const campaignDonorFilter = campaignDonorEventFilter(readonlyContract, +id);
  const campaignRefundFilter = campaignRefundEventFilter(readonlyContract, +id);
  const campaignClaimedFilter = campaignClaimedEventFilter(
    readonlyContract,
    +id,
  );
  const [campaign, setCampaign] = useState<IFetch<ICampaignDetail | null>>({
    loading: true,
    error: null,
    data: null,
  });

  useEffect(() => {
    const fetchCampaign = async () => {
      await sleep(1_000);

      try {
        const _campaign = await readonlyContract.getCampaign(id);

        setCampaign((prev) => ({
          ...prev,
          data: constructCampaign(_campaign),
        }));
      } catch (error) {
        console.log("__ THERE IS AN ERROR __");
        console.log(error);
        setCampaign((prev) => ({ ...prev, error: "There is an error" }));
      } finally {
        setCampaign((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchCampaign();

    function listenToDonateSystemEvent(
      _donor: any,
      _campaignId: any,
      _amount: any,
    ) {
      fetchCampaign();
    }

    readonlyContract.on(campaignDonorFilter, listenToDonateSystemEvent);
    readonlyContract.on(campaignRefundFilter, listenToDonateSystemEvent);
    readonlyContract.on(campaignClaimedFilter, listenToDonateSystemEvent);

    return () => {
      readonlyContract.off(campaignDonorFilter, listenToDonateSystemEvent);
      readonlyContract.off(campaignRefundFilter, listenToDonateSystemEvent);
      readonlyContract.off(campaignClaimedFilter, listenToDonateSystemEvent);
    };
  }, []);

  return (
    <div>
      {campaign.data ? (
        <Details
          campaign={campaign.data}
          campaignDonorFilter={campaignDonorFilter}
          campaignRefundFilter={campaignRefundFilter}
          campaignClaimedFilter={campaignClaimedFilter}
        />
      ) : campaign.error ? (
        <p className="text-red-600">{campaign.error}</p>
      ) : (
        <Loading />
      )}
    </div>
  );
}
