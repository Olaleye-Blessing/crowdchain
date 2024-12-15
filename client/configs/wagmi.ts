"use client";

import { http, createConfig } from "wagmi";
import { baseSepolia } from "wagmi/chains";
import { coinbaseWallet, injected, metaMask } from "wagmi/connectors";
import { clientEnv } from "@/constants/env/client";
import { getDefaultConfig } from "connectkit";
import { appDescription } from "@/utils/site-metadata";
import { anvil } from "./chains";

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
      process.env.NODE_ENV === "production" ? [baseSepolia] : [anvil])(),
    transports:
      process.env.NODE_ENV === "production"
        ? {
            [baseSepolia.id]: http(
              clientEnv.NEXT_PUBLIC_BASE_SEPOLIA_ALCHEMY_RPC_URL,
            ),
          }
        : {
            [anvil.id]: http(),
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
