"use client";

import { createConfig, http } from "wagmi";
import { baseSepolia } from "wagmi/chains";
import { anvil } from "./chains";

export const publicConfig = createConfig({
  chains: process.env.NODE_ENV === "production" ? [baseSepolia] : [anvil],
  transports:
    process.env.NODE_ENV === "production"
      ? { [baseSepolia.id]: http() }
      : { [anvil.id]: http() },
  batch: { multicall: true },
});
