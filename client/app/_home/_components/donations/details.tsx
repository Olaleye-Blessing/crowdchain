"use client";

import { useCrowdchainAddress } from "@/hooks/use-crowdchain-address";
import { useCrowdchainInstance } from "@/hooks/use-crowdchain-instance";
import { wagmiAbi } from "@/lib/contracts/crowd-chain/abi";
import { useQuery } from "@tanstack/react-query";
import { formatUnits } from "viem";
import { useReadContract } from "wagmi";
import { formatDigit } from "./format-digit";

interface TotalStats {
  totalDonated: number;
  totalDonors: number;
}

export default function Details() {
  const { data } = useReadContract({
    address: useCrowdchainAddress(),
    functionName: "totalCampaigns",
    abi: wagmiAbi,
  });
  const { crowdchainInstance } = useCrowdchainInstance();
  const { data: totalStats } = useQuery({
    queryKey: ["crowdchain-stats", "homepage"],
    staleTime: 1000 * 60 * 59,
    queryFn: async () => {
      try {
        const { data } = await crowdchainInstance().get<{ data: TotalStats }>(
          "/crowdchain/totalStats",
        );

        return data.data;
      } catch (error) {
        throw new Error("Internal server error");
      }
    },
  });

  const totalDonated = totalStats?.totalDonated
    ? `~${formatDigit(totalStats.totalDonated)} ETH`
    : "-";
  const donors = totalStats?.totalDonors
    ? `${formatDigit(totalStats.totalDonors)}`
    : "-";

  return (
    <section className="layout">
      <ul className="bg-primary grid grid-cols-1 gap-4 max-w-[75rem] mx-auto rounded-md py-10 px-5 md:grid-cols-3">
        <Detail
          title="Campaigns on Crowdchain"
          body={data ? formatUnits(data, 0) : "-"}
        />
        <Detail title="Amount Donated" body={totalDonated} />
        <Detail title="Donators" body={donors} />
      </ul>
    </section>
  );
}

interface DetailProps {
  title: string;
  body: string;
}

function Detail({ title, body }: DetailProps) {
  return (
    <li className="flex items-center justify-center flex-col text-white">
      <p className="text-base font-light">{title}</p>
      <p className="text-[2rem] font-bold">{body}</p>
    </li>
  );
}
