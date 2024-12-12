"use client";

import { formatUSD } from "./format-digit";
import { useCrowdchainRequest } from "@/hooks/use-crowdchain-request";

interface TotalStats {
  totalDonated: number;
  totalDonors: number;
  totalCampaigns: number;
}

export default function Details() {
  const { data: totalStats } = useCrowdchainRequest<TotalStats>({
    url: "/crowdchain/totalStats",
    options: {
      queryKey: ["crowdchain-stats", "homepage"],
      staleTime: 1000 * 60 * 59,
    },
  });

  const totalDonated = totalStats?.totalDonated
    ? `~${formatUSD(totalStats.totalDonated)}`
    : "-";

  return (
    <section className="layout">
      <ul className="bg-primary grid grid-cols-1 gap-4 max-w-[75rem] mx-auto rounded-md py-10 px-5 md:grid-cols-3">
        <Detail
          title="Campaigns on Crowdchain"
          body={totalStats?.totalCampaigns || "-"}
        />
        <Detail title="Amount Donated" body={totalDonated} />
        <Detail title="Donators" body={totalStats?.totalDonors || "-"} />
      </ul>
    </section>
  );
}

interface DetailProps {
  title: string;
  body: string | number;
}

function Detail({ title, body }: DetailProps) {
  return (
    <li className="flex items-center justify-center flex-col text-white">
      <p className="text-base font-light">{title}</p>
      <p className="text-[2rem] font-bold">{body}</p>
    </li>
  );
}
