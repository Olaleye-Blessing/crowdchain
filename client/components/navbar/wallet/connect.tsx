/* eslint-disable @next/next/no-img-element */
"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { wallets } from "./wallets";

export default function Connect() {
  const connectWallet = async (wallet: (typeof wallets)[number]) => {
    console.log("__ WALLET __", wallet);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="connection__btn">Connect Wallet</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-48 relative right-4">
        <DropdownMenuLabel>Connect a wallet</DropdownMenuLabel>
        {wallets.map((wallet) => {
          return (
            <DropdownMenuItem key={wallet.id} asChild>
              <Button
                type="button"
                className="w-full flex items-center justify-start mb-2 last:mb-0 cursor-pointer hover:opacity-80"
                variant="secondary"
                onClick={() => connectWallet(wallet)}
              >
                <span className="flex items-center justify-center mr-2">
                  <img src={wallet.img} alt="" className="w-5 h-5 rounded" />
                </span>
                <span className="text-sm">{wallet.name}</span>
              </Button>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
