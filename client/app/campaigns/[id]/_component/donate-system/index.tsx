"use client";

import { ICampaignDetail } from "@/interfaces/campaign";
import Donators from "./donators";
import RefundOrDonate from "./refund-or-donate";
import { useEffect, useState } from "react";
import { IFetch } from "@/interfaces/fetch";
import useWalletStore from "@/stores/wallet";
import { sleep } from "@/utils/sleep";
import { formatEther } from "ethers/lib/utils";
import { type IContributionSystem } from "@/interfaces/contribution-system";
import { EventFilter } from "ethers";

export interface DonateSystemProps {
  campaign: ICampaignDetail;
  campaignDonorFilter: EventFilter;
  campaignRefundFilter: EventFilter;
}

export default function DonateSystem({
  campaign,
  campaignDonorFilter,
  campaignRefundFilter,
}: DonateSystemProps) {
  console.log("__ CAMPAIGN __", campaign);
  const readonlyContract = useWalletStore((state) => state.readonlyContract!);
  const [donors, setDonors] = useState<IFetch<IContributionSystem | null>>({
    loading: true,
    error: null,
    data: null,
  });

  useEffect(() => {
    const fetchDonors = async () => {
      await sleep(1_000);

      try {
        const [_donors, _contributions] =
          await readonlyContract.getCampaignDonors(campaign.id);

        const _contributionSystem = (
          _donors as string[]
        ).reduce<IContributionSystem>((db, current, index) => {
          db[current] = +formatEther(_contributions[index]);

          return db;
        }, {} as IContributionSystem);

        setDonors((prev) => ({ ...prev, data: _contributionSystem }));
      } catch (error) {
        console.log("__ THERE IS AN ERROR __");
        console.log(error);
        setDonors((prev) => ({ ...prev, error: "There is an error" }));
      } finally {
        setDonors((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchDonors();

    function listenToDonateSystemEvent(
      _donor: any,
      campaignId: any,
      _amount: any,
    ) {
      fetchDonors();
    }

    readonlyContract.on(campaignDonorFilter, listenToDonateSystemEvent);
    readonlyContract.on(campaignRefundFilter, listenToDonateSystemEvent);

    return () => {
      readonlyContract.off(campaignDonorFilter, listenToDonateSystemEvent);
      readonlyContract.off(campaignRefundFilter, listenToDonateSystemEvent);
    };
  }, []);

  return (
    <div className="lg:w-1/3 mt-6 lg:mt-0">
      <div className="sticky top-20 grid grid-cols-1 gap-4 md:grid-cols-[repeat(auto-fit,minmax(18.75rem,_1fr))] lg:grid-cols-1">
        <RefundOrDonate campaign={campaign} />
        <Donators donors={donors} />
      </div>
    </div>
  );
}
