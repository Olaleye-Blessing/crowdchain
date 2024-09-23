"use client";

import FetchedData from "@/components/fetched-data";
import { IFetch } from "@/interfaces/fetch";
import useWalletStore from "@/stores/wallet";
import { sleep } from "@/utils/sleep";
import { useEffect, useState } from "react";

export default function TotalCampaigns() {
  const readonlyContract = useWalletStore((state) => state.readonlyContract!);

  const [totalCampaigns, setTotalCampaigns] = useState<IFetch<number | null>>({
    loading: true,
    error: null,
    data: null,
  });

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const _total = await readonlyContract.totalCampaigns();

        setTotalCampaigns((prev) => ({
          ...prev,
          data: _total.toNumber(),
        }));
      } catch (error) {
        console.log("__ THERE IS AN ERROR __");
        console.log(error);
        setTotalCampaigns((prev) => ({ ...prev, error: "There is an error" }));
      } finally {
        setTotalCampaigns((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchCampaigns();
  }, []);

  return (
    <p className="text-sm text-center mt-8 text-gray-500">
      Total Campaigns on CrowdChain:{" "}
      <span className="font-bold">
        {totalCampaigns.data ?? totalCampaigns.error ?? "Loading..."}
      </span>
    </p>
  );
}
