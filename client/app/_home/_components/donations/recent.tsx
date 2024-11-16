"use client";

import { useState } from "react";
import { formatEther, formatUnits } from "viem";
import { useWatchContractEvent } from "wagmi";
import { useCrowdchainAddress } from "@/hooks/use-crowdchain-address";
import { wagmiAbi } from "@/lib/contracts/crowd-chain/abi";
import SlideShow, { IDonation } from "./slideshow";

export default function Recent() {
  const [donations, setDonations] = useState<IDonation[]>([]);

  useWatchContractEvent({
    address: useCrowdchainAddress(),
    abi: wagmiAbi,
    eventName: "NewDonation",
    onLogs([{ args: donation }]) {
      setDonations((prev) => {
        const newDonations = [
          ...prev,
          {
            donor: donation.donor!,
            campaignId: formatUnits(donation.campaignId!, 0),
            amount: +formatEther(donation.amount!),
            campaignTitle: donation.campaignTitle!,
          },
        ];

        return newDonations;
      });
    },
  });

  if (donations.length === 0) return null;

  return (
    <section className="mt-6">
      <div className="layout sm:flex items-center justify-start">
        <p className="mb-3 sm:mb-0 sm:flex-shrink-0">Recent Donations</p>
        <div className="hidden sm:block sm:w-[0.07rem] sm:bg-input sm:mx-3 sm:h-9" />
        <SlideShow donations={donations} />
      </div>
    </section>
  );
}
