import { ethers } from "ethers";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface State {
  address: string | null;
  network: number | null;
  readonlyProvider: ethers.providers.JsonRpcProvider | null;
  readonlyContract: ethers.Contract | null;
  writableProvider: ethers.providers.Web3Provider | null;
  writeableCrowdChainContract: ethers.Contract | null;
  writablePlatformTokenContract: ethers.Contract | null;
}

type ContractsKeys = Pick<
  State,
  "writablePlatformTokenContract" | "writeableCrowdChainContract"
>;

interface Actions {
  setAddress(address: string | null): void;
  setNetwork(network: number | null): void;
  disconnect(): void;
  setReadonlyProvider(provider: ethers.providers.JsonRpcProvider): void;
  setReadOnlyContract: (contract: ethers.Contract | null) => void;
  setWritableProvider(provider: ethers.providers.Web3Provider): void;
  setWritableContracts(contracts: Partial<ContractsKeys>): void;
  setWriteableCrowdChainContract: (contract: ethers.Contract | null) => void;
  setWritablePlatformTokenContract: (contract: ethers.Contract | null) => void;
}

type Store = State & Actions;

const useWalletStore = create<Store>()(
  devtools(
    immer(
      persist(
        (set) => ({
          address: null,
          network: null,
          readonlyProvider: null,
          readonlyContract: null,
          writableProvider: null,
          writeableCrowdChainContract: null,
          writablePlatformTokenContract: null,
          writablePlatformTokenProvider: null,
          setReadonlyProvider(provider) {
            set({ readonlyProvider: provider });
          },
          setWritableProvider(provider) {
            set({ writableProvider: provider });
          },
          setAddress(address) {
            set({ address });
          },
          setNetwork(network) {
            set({ network });
          },
          disconnect() {
            set({
              address: null,
              writeableCrowdChainContract: null,
              writablePlatformTokenContract: null,
            });
          },
          setReadOnlyContract(contract) {
            set({ readonlyContract: contract });
          },
          setWriteableCrowdChainContract(contract) {
            set({ writeableCrowdChainContract: contract });
          },
          setWritablePlatformTokenContract(contract) {
            set({ writablePlatformTokenContract: contract });
          },
          setWritableContracts(contracts) {
            set((state) => ({
              ...state,
              ...contracts,
            }));
          },
        }),
        {
          name: "wallet",
          partialize: (state) => ({
            address: state.address,
            network: state.network,
          }),
        },
      ),
    ),
  ),
);

export default useWalletStore;
