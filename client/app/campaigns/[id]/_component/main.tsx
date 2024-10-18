"use client";

import Details from "./details";
import { constructCampaign } from "../_utils/construct-campaign";
import Loading from "@/app/loading";
import { useReadContract, useWatchContractEvent } from "wagmi";
import { wagmiAbi } from "@/lib/contracts/crowd-chain/abi";
import { useCrowdchainAddress } from "@/hooks/use-crowdchain-address";

export default function Main({ id }: { id: string }) {
  const { data, error, refetch } = useReadContract({
    address: useCrowdchainAddress(),
    abi: wagmiAbi,
    functionName: "getCampaign",
    args: [BigInt(id)],
  });

  const campaign = data && constructCampaign(data);

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
