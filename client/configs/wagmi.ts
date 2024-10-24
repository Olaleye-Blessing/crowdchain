"use client";

import { defineChain } from "viem";
import { http, createConfig } from "wagmi";
import { sepolia } from "wagmi/chains";
import { coinbaseWallet, injected, metaMask } from "wagmi/connectors";
import { clientEnv } from "@/constants/env/client";
import { getDefaultConfig } from "connectkit";
import { appDescription } from "@/utils/site-metadata";

// local
const anvil = defineChain({
  id: clientEnv.NEXT_PUBLIC_ANVIL_CHAIN_ID,
  name: "Anvil",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: [clientEnv.NEXT_PUBLIC_ANVIL_RPC_URL] },
  },
  testnet: true,
});

// https://dashboard.tenderly.co/
const tenderly = defineChain({
  id: 11155111,
  name: "Tenderly",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: {
      http: [clientEnv.NEXT_PUBLIC_ETH_SEPOLIA_RPC_URL],
    },
  },
  testnet: true,
});

export const wagmiConfig = createConfig(
  getDefaultConfig({
    ssr: true,
    connectors: [
      injected(),
      metaMask({
        dappMetadata: {
          name: "Crowdchain",
          url: "https://crowdchain-two.vercel.app",
          iconUrl: "https://crowdchain-two.vercel.app/favicon-32x32.png",
        },
      }),
      coinbaseWallet(),
    ],
    chains: (() =>
      process.env.NODE_ENV === "production" ? [sepolia] : [anvil, tenderly])(),
    transports:
      process.env.NODE_ENV === "production"
        ? { [sepolia.id]: http(clientEnv.NEXT_PUBLIC_ETH_SEPOLIA_RPC_URL) }
        : {
            [anvil.id]: http(),
            [tenderly.id]: http(clientEnv.NEXT_PUBLIC_ETH_SEPOLIA_RPC_URL),
          },

    // Required API Keys
    walletConnectProjectId: clientEnv.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,

    // TODO: Update this info
    // Required App Info
    appName: "Crowdchain",

    // Optional App Info
    appDescription: appDescription,
    appUrl: "https://crowdchain-two.vercel.app", // your app's url
    appIcon: "https://crowdchain-two.vercel.app/favicon-32x32.png", // your app's icon, no bigger than 1024x1024px (max. 1MB)
  }),
);
