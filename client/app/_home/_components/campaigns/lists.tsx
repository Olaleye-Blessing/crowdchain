"use client";

import { constructCampaign } from "@/app/campaigns/[id]/_utils/construct-campaign";
import Campaigns from "@/components/campaigns";
import FetchedData from "@/components/fetched-data";
import { ICampaignDetail } from "@/interfaces/campaign";
import { IFetch } from "@/interfaces/fetch";
import useWalletStore from "@/stores/wallet";
import { sleep } from "@/utils/sleep";
import { useEffect, useState } from "react";

export default function Lists() {
  const readonlyContract = useWalletStore((state) => state.readonlyContract!);

  const [campaigns, setCampaigns] = useState<IFetch<ICampaignDetail[] | null>>({
    loading: true,
    error: null,
    data: null,
  });

  useEffect(() => {
    const fetchCampaigns = async () => {
      await sleep(1_000);

      try {
        const [sCampaigns, __total] = (await readonlyContract.getCampaigns(
          0,
          3,
        )) as [any, any];
        const _camps = sCampaigns.map((c: any) =>
          constructCampaign(c),
        ) as ICampaignDetail[];

        setCampaigns((prev) => ({
          ...prev,
          data: _camps,
        }));
      } catch (error) {
        console.log("__ THERE IS AN ERROR __");
        console.log(error);
        setCampaigns((prev) => ({ ...prev, error: "There is an error" }));
      } finally {
        setCampaigns((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchCampaigns();
  }, []);

  return (
    <div className="layout">
      <FetchedData item={campaigns}>
        {campaigns.data && (
          <Campaigns campaigns={campaigns.data} emptyClass="text-sm" />
        )}
      </FetchedData>
    </div>
  );
}
