"use client";

import z from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_BACKEND_URL: z.string().url(),
  NEXT_PUBLIC_CROWD_CHAIN_ADDRESS: z.string(),
  NEXT_PUBLIC_CROWD_CHAIN_TOKEN_ADDRESS: z.string(),
  NEXT_PUBLIC_RPC_URL: z.string(),
});

const parsedSchema = envSchema.safeParse({
  NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
  NEXT_PUBLIC_CROWD_CHAIN_ADDRESS: process.env.NEXT_PUBLIC_CROWD_CHAIN_ADDRESS,
  NEXT_PUBLIC_CROWD_CHAIN_TOKEN_ADDRESS:
    process.env.NEXT_PUBLIC_CROWD_CHAIN_TOKEN_ADDRESS,
  NEXT_PUBLIC_RPC_URL: process.env.NEXT_PUBLIC_RPC_URL,
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
