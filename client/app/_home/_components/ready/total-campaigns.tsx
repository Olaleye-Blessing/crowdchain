"use client";

import { useCrowdchainAddress } from "@/hooks/use-crowdchain-address";
import { wagmiAbi } from "@/lib/contracts/crowd-chain/abi";
import { formatUnits } from "viem";
import { useReadContract } from "wagmi";

export default function TotalCampaigns() {
  const { data } = useReadContract({
    address: useCrowdchainAddress(),
    functionName: "totalCampaigns",
    abi: wagmiAbi,
  });

  return (
    <p className="text-sm text-center mt-8 text-gray-500">
      Total Campaigns on CrowdChain:{" "}
      <span className="font-bold">
        {typeof data !== "undefined" ? formatUnits(data, 0) : "-"}
      </span>
    </p>
  );
}
