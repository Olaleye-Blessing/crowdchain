import { PropsWithChildren } from "react";
import WagmiProvider from "./wagmi";
import ReactQueryProvider from "./react-query";

export default function Providers({ children }: PropsWithChildren<{}>) {
  return (
    <WagmiProvider>
      <ReactQueryProvider>{children}</ReactQueryProvider>
    </WagmiProvider>
  );
}
