import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { ICampaignDetail } from "@/interfaces/campaign";

interface State {
  page: number;
  totalPage: number | null;
  campaigns: ICampaignDetail[];
}

interface Actions {
  increasePage(): void;
  setTotalPage(page: number): void;
  setCampaigns(campaigns: ICampaignDetail[]): void;
}

type Store = State & Actions;

export const useHomeCampaigns = create<Store>()(
  devtools(
    immer((set) => ({
      page: 0,
      totalPage: null,
      campaigns: [],
      increasePage() {
        set((state) => ({ page: state.page + 1 }));
      },
      setTotalPage(totalPage) {
        set({ totalPage });
      },
      setCampaigns(campaigns) {
        set((state) => ({
          campaigns: [...state.campaigns, ...campaigns],
        }));
      },
    })),
  ),
);
