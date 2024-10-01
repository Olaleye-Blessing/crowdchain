"use client";

import { hexlify } from "ethers/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useWalletStore from "@/stores/wallet";
import { networkIds, networks } from "@/utils/networks";

export default function SwitchNetwork() {
  const network = useWalletStore((state) => state.network) || undefined;

  return (
    <Select
      value={network ? `${network}` : undefined}
      onValueChange={async (val) => {
        try {
          if (!val) return;

          const network =
            networks[networkIds[val as unknown as keyof typeof networkIds]];

          await window?.ethereum?.request?.({
            method: "wallet_addEthereumChain",
            params: [{ ...network, chainId: hexlify(network.chainId) }],
          });
        } catch (error) {
          console.log("__ ERROR __");
          console.log(error);
        }
      }}
    >
      <SelectTrigger className="w-[180px] capitalize">
        <SelectValue placeholder="Choose Network" />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(networkIds).map(([id, name]) => {
          return (
            <SelectItem key={id} value={id} className="capitalize">
              {name}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
