import { baseSepolia } from "viem/chains";
import { clientEnv } from "@/constants/env/client";
import { IAddress } from "@/interfaces/address";

interface IWagmiCrowdInfos {
  contractAddress: IAddress;
  name: string;
}

export const defaultNetworkId =
  process.env.NODE_ENV === "production"
    ? baseSepolia.id
    : clientEnv.NEXT_PUBLIC_ANVIL_CHAIN_ID;

export const wagmiCrowdchainInfos: Record<number, IWagmiCrowdInfos> = {
  [clientEnv.NEXT_PUBLIC_ANVIL_CHAIN_ID]: {
    contractAddress:
      clientEnv.NEXT_PUBLIC_CROWD_CHAIN_ANVIL_ADDRESS as IAddress,
    name: "Anvil",
  },
  [baseSepolia.id]: {
    contractAddress:
      clientEnv.NEXT_PUBLIC_CROWD_CHAIN_ETH_SEPOLIA_ADDRESS as IAddress,
    name: "Base Sepolia",
  },
};

export const wagmiCrowdContractAddress = (chainId: number) =>
  wagmiCrowdchainInfos[chainId || defaultNetworkId].contractAddress;
