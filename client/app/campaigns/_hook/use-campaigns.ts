import { useEffect, useState } from "react";
import { useSearchParameters } from "@/hooks/use-search-parameters";
import { constructCampaign } from "../[id]/_utils/construct-campaign";
import { ICampaignDetail, ICampaignsResult } from "@/interfaces/campaign";
import { arrayOfUniqueObjs } from "@/utils/unique-arr-objects";
import { useCrowdchainRequest } from "@/hooks/use-crowdchain-request";

type IMethod = "by" | "category";

export const useCampaigns = () => {
  const { getParam } = useSearchParameters();
  const category = getParam("category") || "all";
  const campaignTitle = getParam("title") || "";
  const method = (getParam("by") || "category") as IMethod;
  const [page, setPage] = useState(0);
  const [totalCampaigns, setTotalCampaigns] = useState<number | null>(null);
  const [campaigns, setCampaigns] = useState<ICampaignDetail[]>([]);

  const loadMore = () => setPage((prev) => prev + 1);

  const { data, isFetching, error } = useCrowdchainRequest<ICampaignsResult>({
    url: `/crowdchain/campaigns?page=${page}&category=${category}`,
    options: {
      queryKey: ["campaigns", { category, page }],
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

    const { campaigns: _campaigns, total: _total } = data;

    setCampaigns((prev) => {
      let newCampaigns = [
        ...prev,
        ..._campaigns.map((cam) => constructCampaign(cam)),
      ];

      if (process.env.NODE_ENV !== "production")
        newCampaigns = arrayOfUniqueObjs(newCampaigns, "id");

      return newCampaigns;
    });

    setTotalCampaigns(+_total);
  }, [data]);

  return { campaigns, error, isFetching, totalCampaigns, loadMore };
};
