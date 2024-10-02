"use client";

import FetchedCampaigns from "@/components/campaigns/fetched";

export default function Main({ address }: { address: string }) {
  return <FetchedCampaigns address={address} page={0} />;
}
