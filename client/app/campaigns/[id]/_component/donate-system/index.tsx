"use client";

import { ICampaignDetail } from "@/interfaces/campaign";
import RefundOrDonate from "./refund-or-donate";
import DonationsPerCoin from "./donations-per-coin";
import { useSupportedCoins } from "@/hooks/use-supported-coins";

export interface DonateSystemProps {
  campaign: ICampaignDetail;
}

export default function DonateSystem({ campaign }: DonateSystemProps) {
  const supportedCoins = useSupportedCoins();

  return (
    <div className="lg:w-1/3 mt-6 lg:mt-0">
      <div className="sticky top-20 grid grid-cols-1 gap-4 md:grid-cols-[repeat(auto-fit,minmax(18.75rem,_1fr))] lg:grid-cols-1">
        <RefundOrDonate campaign={campaign} supportedCoins={supportedCoins} />
        <DonationsPerCoin
          campaignId={campaign.id}
          supportedCoins={supportedCoins}
        />
      </div>
    </div>
  );
}
