"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useChainId, useSwitchChain } from "wagmi";

export default function SwitchNetwork() {
  const currentChain = useChainId();
  const { chains, switchChainAsync } = useSwitchChain();

  return (
    <Select
      value={`${currentChain}`}
      onValueChange={async (chain) => {
        await switchChainAsync({ chainId: +chain });
        window.location.reload();
      }}
    >
      <SelectTrigger className="w-[180px] capitalize">
        <SelectValue placeholder="Choose Network" />
      </SelectTrigger>
      <SelectContent>
        {chains.map((chain) => {
          return (
            <SelectItem
              key={chain.id}
              value={`${chain.id}`}
              className="capitalize"
            >
              {chain.name}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
