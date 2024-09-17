import { ethers } from "ethers";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface State {
  provider: ethers.providers.Web3Provider | null;
  address: string | null;
}

interface Actions {
  setProvider(provider: ethers.providers.Web3Provider): void;
  setAddress(address: string | null): void;
  disconnect(): void;
}

type Store = State & Actions;

const useWalletStore = create<Store>()(
  devtools(
    immer(
      persist(
        (set) => ({
          provider: null,
          address: null,
          setProvider(provider) {
            set({ provider });
          },
          setAddress(address) {
            set({ address });
          },
          disconnect() {
            set({ address: null });
          },
        }),
        { name: "wallet", partialize: (state) => ({ address: state.address }) },
      ),
    ),
  ),
);

export default useWalletStore;
