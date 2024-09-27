"use client";

import { ReactNode, useEffect, useState } from "react";
import { ethers, providers } from "ethers";
import { clientEnv } from "@/constants/env/client";
import { crowdChainABI } from "@/lib/contracts/crowd-chain/abi";
import { crowdChainAddress } from "@/lib/contracts/crowd-chain/address";
import useWalletStore from "@/stores/wallet";
import { useStore } from "@/stores/store";
import { crowdChainTokenABI } from "@/lib/contracts/crowd-chain/token/abi";
import { crowdChainTokenAddress } from "@/lib/contracts/crowd-chain/token/address";

export default function ContractProviders({
  children,
}: {
  children: ReactNode;
}) {
  const setReadOnlyContract = useWalletStore(
    (state) => state.setReadOnlyContract,
  );
  const setReadonlyProvider = useWalletStore(
    (state) => state.setReadonlyProvider,
  );
  const disconnect = useWalletStore((state) => state.disconnect);
  const setWritableContracts = useWalletStore(
    (state) => state.setWritableContracts,
  );
  const setWritableProvider = useWalletStore(
    (state) => state.setWritableProvider,
  );
  const address = useStore(useWalletStore, (state) => state.address);
  const setAddress = useWalletStore((state) => state.setAddress);

  const [loadings, setLoadings] = useState({
    readonly: true,
    writable: true,
  });

  useEffect(function setupReadonlyWallet() {
    async function setUp() {
      const readonlyProvider = new providers.JsonRpcProvider(
        clientEnv.NEXT_PUBLIC_RPC_URL,
      );

      const contract = new ethers.Contract(
        crowdChainAddress,
        crowdChainABI,
        readonlyProvider,
      );

      setReadonlyProvider(readonlyProvider);
      setReadOnlyContract(contract);
      setLoadings((prev) => ({ ...prev, readonly: false }));
    }

    setUp();
  }, []);

  useEffect(
    function setupWritableWallet() {
      function accountChanged(accounts: Array<string>) {
        const account = accounts[0] || null;

        setAddress(account);

        if (!account) disconnect();
      }

      async function setUp() {
        if (!window.ethereum)
          return setLoadings((prev) => ({ ...prev, writable: false }));

        const writableProvider = new ethers.providers.Web3Provider(
          window.ethereum,
          "any",
        );

        setWritableProvider(writableProvider);

        (window.ethereum as any).on("accountsChanged", accountChanged);

        if (address === undefined) return;

        if (address === null)
          return setLoadings((prev) => ({ ...prev, writable: false }));

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
          // setAddress(null);
        } finally {
          setLoadings((prev) => ({ ...prev, writable: false }));
        }
      }

      setUp();

      return () => {};
    },
    [address],
  );

  if (loadings.readonly || loadings.writable) return null;

  return <>{children}</>;
}
