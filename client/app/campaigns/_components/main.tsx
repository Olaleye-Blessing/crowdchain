"use client";

import { useEffect, useState } from "react";
import { ICampaignDetail } from "@/interfaces/campaign";
import useWalletStore from "@/stores/wallet";
import { sleep } from "@/utils/sleep";
import { constructCampaign } from "../[id]/_utils/construct-campaign";
import Campaign from "@/components/campaigns/campaign";
import Loading from "@/app/loading";
import { Button } from "@/components/ui/button";
import { useHomeCampaigns } from "./store";

export default function Main() {
  const readonlyContract = useWalletStore((state) => state.readonlyContract!);
  const page = useHomeCampaigns((state) => state.page);
  const totalPage = useHomeCampaigns((state) => state.totalPage);
  const campaigns = useHomeCampaigns((state) => state.campaigns);
  const increasePage = useHomeCampaigns((state) => state.increasePage);
  const setTotalPage = useHomeCampaigns((state) => state.setTotalPage);
  const setCampaigns = useHomeCampaigns((state) => state.setCampaigns);

  const [data, setData] = useState<{ loading: boolean; error: null | string }>({
    loading: true,
    error: null,
  });

  const fetchCampaigns = async (page = 0) => {
    if (totalPage && campaigns.length >= totalPage)
      return setData((prev) => ({ ...prev, loading: false }));

    setData((prev) => ({ ...prev, loading: true }));

    await sleep(2_000);

    try {
      const [sCampaigns, _total] = (await readonlyContract.getCampaigns(
        page,
        2,
      )) as [any, any];

      setCampaigns(
        sCampaigns.map((c: any) => constructCampaign(c)) as ICampaignDetail[],
      );
      if (totalPage === null) setTotalPage(_total.toNumber());
    } catch (error) {
      console.log("__ THERE IS AN ERROR __");
      console.log(error);
      setData((prev) => ({ ...prev, error: "There is an error" }));
    } finally {
      setData((prev) => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    function intialFetch() {
      if (totalPage !== null)
        return setData((prev) => ({ ...prev, loading: false }));

      fetchCampaigns();
    }

    intialFetch();
  }, []);

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
        {data.error && <p>{data.error}</p>}
        {data.loading && <Loading />}
        {!data.loading && totalPage && campaigns.length < totalPage && (
          <Button
            onClick={() => {
              increasePage();
              fetchCampaigns(page + 1);
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
