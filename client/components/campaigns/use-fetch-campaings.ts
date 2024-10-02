import { constructCampaign } from "@/app/campaigns/[id]/_utils/construct-campaign";
import { ICampaignDetail } from "@/interfaces/campaign";
import { IFetch } from "@/interfaces/fetch";
import useWalletStore from "@/stores/wallet";
import { sleep } from "@/utils/sleep";
import { arrayOfUniqueObjs } from "@/utils/unique-arr-objects";
import { useEffect, useState } from "react";

type IOwnerCampaigns = {
  address: string;
};

type IAllCampaigns = {
  address?: never;
};

export type IFetchCampaigns = (IOwnerCampaigns | IAllCampaigns) & {
  page: number;
  perPage?: number;
};

export const useFetchCampaigns = ({
  address,
  page,
  perPage = 2,
}: IFetchCampaigns) => {
  const readonlyContract = useWalletStore((state) => state.readonlyContract!);

  const [campaigns, setCampaigns] = useState<IFetch<ICampaignDetail[] | null>>({
    loading: true,
    error: null,
    data: null,
  });
  const [totalPage, setTotalPage] = useState(null);
  const [currentPage, setCurrentPage] = useState(page);

  const fetchCampaigns = async () => {
    setCampaigns((prev) => ({ ...prev, loading: true }));

    await sleep(2_000);

    try {
      const [sCampaigns, __total] = address
        ? ((await readonlyContract.getOwnerCampaigns(
            address,
            currentPage,
            perPage,
          )) as [any, any])
        : ((await readonlyContract.getCampaigns(currentPage, perPage)) as [
            any,
            any,
          ]);
      const _camps = sCampaigns.map((c: any) =>
        constructCampaign(c),
      ) as ICampaignDetail[];

      setCampaigns((prev) => ({
        ...prev,
        data:
          process.env.NODE_ENV === "development"
            ? arrayOfUniqueObjs([...(prev.data || []), ..._camps], "id")
            : [...(prev.data || []), ..._camps],
      }));

      if (totalPage === null) setTotalPage(__total.toNumber());
    } catch (error) {
      console.log("__ THERE IS AN ERROR __");
      console.log(error);
      setCampaigns((prev) => ({ ...prev, error: "There is an error" }));
    } finally {
      setCampaigns((prev) => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, [currentPage]);

  const showLoadMore = Boolean(
    !campaigns.loading &&
      totalPage &&
      campaigns.data &&
      campaigns.data.length < totalPage,
  );

  const fetchMore = () => setCurrentPage((prev) => prev + 1);

  return { campaigns, showLoadMore, fetchMore };
};
