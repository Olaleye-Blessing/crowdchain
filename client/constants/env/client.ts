"use client";

import z from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_BACKEND_URL: z.string().url(),
  NEXT_PUBLIC_CROWD_CHAIN_ETH_SEPOLIA_ADDRESS: z.string(),
  NEXT_PUBLIC_CROWD_CHAIN_ANVIL_ADDRESS: z.string(),
  NEXT_PUBLIC_CROWD_CHAIN_TOKEN_ADDRESS: z.string(),
  NEXT_PUBLIC_ANVIL_RPC_URL: z.string(),
  NEXT_PUBLIC_ANVIL_CHAIN_ID: z.coerce.number(),
  NEXT_PUBLIC_ETH_SEPOLIA_RPC_URL: z.string(),
  NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: z.string(),
  NEXT_PUBLIC_CROWDCHAIN_DEPLOYMENT_BLOCK: z.coerce.number(),
});

const parsedSchema = envSchema.safeParse({
  NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
  NEXT_PUBLIC_CROWD_CHAIN_ETH_SEPOLIA_ADDRESS:
    process.env.NEXT_PUBLIC_CROWD_CHAIN_ETH_SEPOLIA_ADDRESS,
  NEXT_PUBLIC_CROWD_CHAIN_ANVIL_ADDRESS:
    process.env.NEXT_PUBLIC_CROWD_CHAIN_ANVIL_ADDRESS,
  NEXT_PUBLIC_CROWD_CHAIN_TOKEN_ADDRESS:
    process.env.NEXT_PUBLIC_CROWD_CHAIN_TOKEN_ADDRESS,
  NEXT_PUBLIC_ANVIL_RPC_URL: process.env.NEXT_PUBLIC_ANVIL_RPC_URL,
  NEXT_PUBLIC_ANVIL_CHAIN_ID: process.env.NEXT_PUBLIC_ANVIL_CHAIN_ID,
  NEXT_PUBLIC_ETH_SEPOLIA_RPC_URL: process.env.NEXT_PUBLIC_ETH_SEPOLIA_RPC_URL,
  NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID:
    process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
  NEXT_PUBLIC_CROWDCHAIN_DEPLOYMENT_BLOCK:
    process.env.NEXT_PUBLIC_CROWDCHAIN_DEPLOYMENT_BLOCK,
});

if (!parsedSchema.success) {
  const errMsg = "___ Provide all CLIENT env variables ___";
  // eslint-disable-next-line no-console
  console.log(errMsg);
  // eslint-disable-next-line no-console
  console.log(parsedSchema.error.issues);
  throw new Error(errMsg);
}

export const clientEnv = parsedSchema.data;
