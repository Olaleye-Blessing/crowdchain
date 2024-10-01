"use client";

import { ReactNode, useEffect, useState } from "react";
import { ethers, providers } from "ethers";
import { crowdChainABI } from "@/lib/contracts/crowd-chain/abi";
import useWalletStore from "@/stores/wallet";
import { useStore } from "@/stores/store";
import { crowdChainTokenABI } from "@/lib/contracts/crowd-chain/token/abi";
import { crowdChainTokenAddress } from "@/lib/contracts/crowd-chain/token/address";
import { IWalletNetworkInfo } from "@/interfaces/network";
import {
  crowdchainAddresses,
  networkIds,
  rpcProviders,
} from "@/utils/networks";
import Loading from "@/app/loading";
import { toast } from "@/hooks/use-toast";

export default function ContractProviders({
  children,
}: {
  children: ReactNode;
}) {
  const {
    setReadOnlyContract,
    setReadonlyProvider,
    disconnect,
    setWritableContracts,
    setWritableProvider,
    setAddress,
    setNetwork,
  } = useWalletStore();
  const address = useStore(useWalletStore, (state) => state.address);
  const network = useStore(useWalletStore, (state) => state.network);
  const _writableProvider = useWalletStore((state) => state.writableProvider);

  const [loading, setLoading] = useState(true);

  function networkChanged(
    newNetwork: IWalletNetworkInfo,
    oldNetwork: IWalletNetworkInfo | null,
  ) {
    if (!networkIds[newNetwork.chainId])
      return toast({
        title: "This network is not supported!",
        variant: "destructive",
      });

    setNetwork(newNetwork.chainId);
    if (oldNetwork) window.location.reload();
  }

  useEffect(
    function setupProviders() {
      let timer;
      if (network === undefined) return;

      // TODO: Find a way to load the correct network on initial load
      async function setUp() {
        const loadedNetworkId = network ? networkIds[network] : "anvil";
        const rpc = rpcProviders[loadedNetworkId];
        const crowdChainAddress = crowdchainAddresses[loadedNetworkId];

        const readonlyProvider = new providers.JsonRpcProvider(rpc);
        const readonlyContract = new ethers.Contract(
          crowdChainAddress,
          crowdChainABI,
          readonlyProvider,
        );
        setReadonlyProvider(readonlyProvider);
        setReadOnlyContract(readonlyContract);

        if (!window.ethereum) return setLoading(false);

        const writableProvider = new ethers.providers.Web3Provider(
          window.ethereum,
          "any",
        );

        writableProvider.on("network", networkChanged);

        setWritableProvider(writableProvider);

        (window.ethereum as any).on("accountsChanged", (accounts: string[]) => {
          const account = accounts[0] || null;
          setAddress(account);

          if (!account) disconnect();
        });

        if (!address) return setLoading(false);

        try {
          await writableProvider.send("eth_requestAccounts", []);
          const signer = writableProvider.getSigner();

          setWritableContracts({
            writeableCrowdChainContract: new ethers.Contract(
              crowdChainAddress,
              crowdChainABI,
              signer,
            ),
            writablePlatformTokenContract: new ethers.Contract(
              crowdChainTokenAddress,
              crowdChainTokenABI,
              signer,
            ),
          });
        } catch (e) {
          console.error("Failed to set up writable contracts:", e);
        } finally {
          setLoading(false);
        }
      }

      timer = setTimeout(() => {
        // allow zustand to load correct data
        setUp();
      }, 1_000);

      return () => {
        clearTimeout(timer);

        if (window.ethereum) {
          (window.ethereum as any).removeAllListeners("accountsChanged");
          (window.ethereum as any).removeAllListeners("chainChanged");
          _writableProvider?.removeAllListeners("network");
        }
      };
    },
    [address, network],
  );

  if (loading) return <Loading />;

  return <>{children}</>;
}
