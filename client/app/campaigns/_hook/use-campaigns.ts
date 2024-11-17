import { useEffect, useState } from "react";
import { formatUnits, parseUnits } from "viem";
import { useReadContract } from "wagmi";
import { useCrowdchainAddress } from "@/hooks/use-crowdchain-address";
import { useSearchParameters } from "@/hooks/use-search-parameters";
import { wagmiAbi } from "@/lib/contracts/crowd-chain/abi";
import { constructCampaign } from "../[id]/_utils/construct-campaign";
import { ICampaignDetail } from "@/interfaces/campaign";
import { ICampaignResult } from "./interface";
import { arrayOfUniqueObjs } from "@/utils/unique-arr-objects";

const perPage = process.env.NODE_ENV === "production" ? "20" : "2";

type IMethod = "by" | "category";

const constructFunctionAndArgs = (
  category: string,
  campaignTitle: string,
  method: IMethod,
  page: number,
) => {
  // TODO: Modify this function to include search by title.
  if (method === "category" && category !== "all") {
    return {
      functionName: "getCampaignsByCategory",
      args: [category, parseUnits(String(page), 0), parseUnits(perPage, 0)],
    };
  }

  return {
    functionName: "getCampaigns",
    args: [parseUnits(String(page), 0), parseUnits(perPage, 0)],
  };
};

// Cache result in order to reduce RPC calls
export const useCampaigns = () => {
  const { getParam } = useSearchParameters();
  const category = getParam("category") || "all";
  const campaignTitle = getParam("title") || "";
  const method = (getParam("by") || "category") as IMethod;

  const [page, setPage] = useState(0);
  const [totalCampaigns, setTotalCampaigns] = useState<number | null>(null);
  const [campaigns, setCampaigns] = useState<ICampaignDetail[]>([]);

  const loadMore = () => setPage((prev) => prev + 1);

  const { args, functionName } = constructFunctionAndArgs(
    category,
    campaignTitle,
    method,
    page,
  );

  const { data, error, isFetching } = useReadContract({
    abi: wagmiAbi,
    address: useCrowdchainAddress(),
    functionName: functionName as any,
    args: args as any,
    query: {
      refetchInterval: false,
      refetchIntervalInBackground: false,
      refetchOnWindowFocus: false,
    },
  });

  useEffect(() => {
    setPage(0);
    setTotalCampaigns(null);
    setCampaigns([]);
  }, [category, campaignTitle, method]);

  useEffect(() => {
    if (!data) return;

    const [_campaigns, _total] = data as unknown as ICampaignResult;

    if (_campaigns.length === 0)
      return setTotalCampaigns(+formatUnits(_total, 0));

    setCampaigns((prev) => {
      let newCampaigns = [
        ...prev,
        ..._campaigns.map((cam) => constructCampaign(cam)),
      ];

      if (process.env.NODE_ENV !== "production")
        newCampaigns = arrayOfUniqueObjs(newCampaigns, "id");

      return newCampaigns;
    });

    if (!totalCampaigns) setTotalCampaigns(+formatUnits(_total, 0));
  }, [data]);

  return { campaigns, error, isFetching, totalCampaigns, loadMore };
};
