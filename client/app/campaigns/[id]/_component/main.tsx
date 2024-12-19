"use client";

import Details from "./details";
import { constructCampaign } from "../_utils/construct-campaign";
import Loading from "@/app/loading";
import { useReadContract, useWatchContractEvent } from "wagmi";
import { wagmiAbi } from "@/lib/contracts/crowd-chain/abi";
import { useCrowdchainAddress } from "@/hooks/use-crowdchain-address";
import { publicConfig } from "@/configs/public";

export default function Main({ id }: { id: string }) {
  const { data, error, refetch } = useReadContract({
    address: useCrowdchainAddress(),
    abi: wagmiAbi,
    functionName: "getCampaign",
    args: [BigInt(id)],
  });

  const campaign = data && constructCampaign(data);

  useWatchContractEvent({
    config: publicConfig,
    address: useCrowdchainAddress(),
    abi: wagmiAbi,
    eventName: "NewDonation",
    args: { campaignId: BigInt(id) },
    onLogs() {
      refetch();
    },
  });

  useWatchContractEvent({
    config: publicConfig,
    address: useCrowdchainAddress(),
    abi: wagmiAbi,
    eventName: "DonationRefunded",
    args: { campaignId: BigInt(id) },
    onLogs() {
      refetch();
    },
  });


  return (
    <div>
      {campaign ? (
        <Details campaign={campaign} />
      ) : error ? (
        <p className="text-red-600">error</p>
      ) : (
        <Loading />
      )}
    </div>
  );
}
