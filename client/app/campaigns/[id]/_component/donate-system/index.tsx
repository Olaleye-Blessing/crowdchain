"use client";

import { ICampaignDetail } from "@/interfaces/campaign";
import Donators from "./donators";
import RefundOrDonate from "./refund-or-donate";
import { type IContributionSystem } from "@/interfaces/contribution-system";
import { useReadContract, useWatchContractEvent } from "wagmi";
import { wagmiAbi } from "@/lib/contracts/crowd-chain/abi";
import { formatEther } from "viem";
import { useCrowdchainAddress } from "@/hooks/use-crowdchain-address";

export interface DonateSystemProps {
  campaign: ICampaignDetail;
}

export default function DonateSystem({ campaign }: DonateSystemProps) {
  const { data, isFetching, error, refetch } = useReadContract({
    abi: wagmiAbi,
    address: useCrowdchainAddress(),
    functionName: "getCampaignDonors",
    args: [BigInt(campaign.id)],
  });

  const [_donors, _contributions] = data || [];

  const _contributionSystem = _donors?.reduce<IContributionSystem>(
    (db, current, index) => {
      db[current] = +formatEther(_contributions![index]);

      return db;
    },
    {} as IContributionSystem,
  );

  const donors = {
    loading: isFetching,
    error: error && "There is an error",
    data: _contributionSystem || null,
  };

  useWatchContractEvent({
    address: useCrowdchainAddress(),
    abi: wagmiAbi,
    eventName: "NewDonation",
    onLogs() {
      refetch();
    },
  });

  useWatchContractEvent({
    address: useCrowdchainAddress(),
    abi: wagmiAbi,
    eventName: "DonationRefunded",
    onLogs() {
      refetch();
    },
  });

  return (
    <div className="lg:w-1/3 mt-6 lg:mt-0">
      <div className="sticky top-20 grid grid-cols-1 gap-4 md:grid-cols-[repeat(auto-fit,minmax(18.75rem,_1fr))] lg:grid-cols-1">
        <RefundOrDonate campaign={campaign} />
        <Donators donors={donors} />
      </div>
    </div>
  );
}
