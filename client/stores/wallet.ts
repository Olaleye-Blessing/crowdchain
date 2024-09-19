import { ethers } from "ethers";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface State {
  address: string | null;
  readonlyProvider: ethers.providers.JsonRpcProvider | null;
  readonlyContract: ethers.Contract | null;
  writableProvider: ethers.providers.Web3Provider | null;
  writableContract: ethers.Contract | null;
}

interface Actions {
  setAddress(address: string | null): void;
  disconnect(): void;
  setReadonlyProvider(provider: ethers.providers.JsonRpcProvider): void;
  setReadOnlyContract: (contract: ethers.Contract | null) => void;
  setWritableProvider(provider: ethers.providers.Web3Provider): void;
  setWritableContract: (contract: ethers.Contract | null) => void;
}

type Store = State & Actions;

const useWalletStore = create<Store>()(
  devtools(
    immer(
      persist(
        (set) => ({
          address: null,
          readonlyProvider: null,
          readonlyContract: null,
          writableProvider: null,
          writableContract: null,
          setReadonlyProvider(provider) {
            set({ readonlyProvider: provider });
          },
          setWritableProvider(provider) {
            set({ writableProvider: provider });
          },
          setAddress(address) {
            set({ address });
          },
          disconnect() {
            set({ address: null });
          },
          setReadOnlyContract(contract) {
            set({ readonlyContract: contract });
          },
          setWritableContract(contract) {
            set({ writableContract: contract });
          },
        }),
        { name: "wallet", partialize: (state) => ({ address: state.address }) },
      ),
    ),
  ),
);

export default useWalletStore;
