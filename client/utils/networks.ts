import { clientEnv } from "@/constants/env/client";
import {
  ISupportedNetworks,
  IWalletNetworkConnection,
} from "@/interfaces/network";

export const networks: Record<ISupportedNetworks, IWalletNetworkConnection> = {
  anvil: {
    chainId: clientEnv.NEXT_PUBLIC_ANVIL_CHAIN_ID,
    rpcUrls: [clientEnv.NEXT_PUBLIC_METAMASK_ANVIL_RPC_URL],
    chainName: "Anvil",
    nativeCurrency: {
      name: "Anvil Eth",
      symbol: "ETH",
      decimals: 18,
    },
  },
  sepolia: {
    chainId: 11155111,
    rpcUrls: ["https://rpc.sepolia.org"],
    chainName: "Sepolia",
    nativeCurrency: {
      name: "Sepolia Ether",
      symbol: "ETH",
      decimals: 18,
    },
    blockExplorerUrls: ["https://sepolia.etherscan.io"],
  },
  // "arbitrum-sepolia": {
  //   chainId: 421614,
  //   rpcUrls: ["https://arbitrum-sepolia.blockpi.network/v1/rpc/public"],
  //   chainName: "Arbitrum Sepolia",
  //   nativeCurrency: {
  //     name: "Ether",
  //     symbol: "ETH",
  //     decimals: 18,
  //   },
  //   blockExplorerUrls: ["https://sepolia.arbiscan.io/"],
  // },
};

export const networkIds: Record<number, ISupportedNetworks> = {
  [clientEnv.NEXT_PUBLIC_ANVIL_CHAIN_ID]: "anvil",
  11155111: "sepolia",
  // 421614: "arbitrum-sepolia"
};

export const rpcProviders: Record<ISupportedNetworks, string> = {
  anvil: clientEnv.NEXT_PUBLIC_ANVIL_RPC_URL,
  sepolia: clientEnv.NEXT_PUBLIC_ETH_SEPOLIA_RPC_URL,
  // "arbitrum-sepolia": clientEnv.NEXT_PUBLIC_ANVIL_RPC_URL, // TODO: Deploy to arbitrum-sepolia testnet
};

export const crowdchainAddresses: Record<ISupportedNetworks, string> = {
  anvil: clientEnv.NEXT_PUBLIC_CROWD_CHAIN_ANVIL_ADDRESS,
  sepolia: clientEnv.NEXT_PUBLIC_CROWD_CHAIN_ETH_SEPOLIA_ADDRESS,
  // "arbitrum-sepolia": clientEnv.NEXT_PUBLIC_CROWD_CHAIN_ANVIL_ADDRESS, // TODO: Deploy to arbitrum-sepolia testnet
};
