"use client";

import { useCrowdchainAddress } from "@/hooks/use-crowdchain-address";
import { wagmiAbi } from "@/lib/contracts/crowd-chain/abi";
import { formatUnits } from "viem";
import { useReadContract } from "wagmi";

export default function Details() {
  const { data } = useReadContract({
    address: useCrowdchainAddress(),
    functionName: "totalCampaigns",
    abi: wagmiAbi,
  });

  // TODO: Fetch from contract
  return (
    <section className="layout">
      <ul className="bg-primary grid grid-cols-1 gap-4 max-w-[75rem] mx-auto rounded-md py-10 px-5 md:grid-cols-3">
        <Detail
          title="Campaigns on Crowdchain"
          body={data ? formatUnits(data, 0) : "-"}
        />
        <Detail title="Amount Donated" body="3,500,200 ETH" />
        <Detail title="Donators" body="15,000" />
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