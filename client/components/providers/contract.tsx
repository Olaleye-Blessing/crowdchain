"use client";

import { ReactNode, useEffect, useState } from "react";
import { ethers, providers } from "ethers";
import { clientEnv } from "@/constants/env/client";
import { crowdChainABI } from "@/lib/contracts/crowd-chain/abi";
import { crowdChainAddress } from "@/lib/contracts/crowd-chain/address";
import useWalletStore from "@/stores/wallet";

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
  const setWritableContract = useWalletStore(
    (state) => state.setWritableContract,
  );
  const setWritableProvider = useWalletStore(
    (state) => state.setWritableProvider,
  );

  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

      if (!window.ethereum) return setLoading(false);

      const writableProvider = new ethers.providers.Web3Provider(
        window.ethereum,
        "any",
      );

      await writableProvider.send("eth_requestAccounts", []);

      const connectedSigner = writableProvider.getSigner();

      const _contract = new ethers.Contract(
        crowdChainAddress,
        crowdChainABI,
        connectedSigner,
      );

      setWritableProvider(writableProvider);
      setWritableContract(_contract);
      setLoading(false);
    }

    setUp();
  }, []);

  if (loading) return null;

  return <>{children}</>;
}
