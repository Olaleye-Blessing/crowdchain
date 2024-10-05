import { ISupportedNetworks } from "@/interfaces/network";
import { crowdchainAddresses, networkIds } from "@/utils/networks";

export const getCrowdChainDetail = (network: number | null | undefined) => {
  const defaultNetworkId: ISupportedNetworks =
    process.env.NODE_ENV === "production" ? "sepolia" : "anvil";

  const loadedNetworkId = network ? networkIds[network] : defaultNetworkId;

  return {
    crowdchainAddress: crowdchainAddresses[loadedNetworkId],
    loadedNetworkId,
  };
};
