"use client";

import { PropsWithChildren } from "react";
import { wagmiConfig } from "@/configs/wagmi";
import { WagmiProvider as Provider } from "wagmi";

export default function WagmiProvider({ children }: PropsWithChildren<{}>) {
  return <Provider config={wagmiConfig}>{children}</Provider>;
}
