"use client";

import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import "./index.css";
import { formatAddress } from "@/utils/format-address";
import { useAccount, useDisconnect } from "wagmi";
import ConnectWalletButton from "./connect";

const Wallet = () => {
  const { disconnect } = useDisconnect();
  const { address, chain } = useAccount();

  const connetedPages = [
    { label: "My Account", href: `/accounts/${address}` },
    { label: "My Projects", href: `/accounts/${address}` },
    { label: "Create a Campaign", href: "/create" },
  ];

  return (
    <div className="ml-2">
      {address ? (
        <Sheet>
          <SheetTrigger>
            <Button className="connection__btn bg-white text-primary hover:bg-white">
              {formatAddress(address)}
            </Button>
          </SheetTrigger>
          <SheetContent className="px-4">
            <SheetHeader>
              <SheetTitle className="pl-4">
                <p className="flex flex-col items-start justify-start text-sm mt-[-0.8rem]">
                  <span>{formatAddress(address)}</span>
                  <span className="text-[0.6rem] text-primary">
                    Connected to {chain?.name || "-"}
                  </span>
                </p>
              </SheetTitle>
            </SheetHeader>
            <div className="h-[0.1px] w-full bg-muted" />
            <ul className="flex flex-col text-left mt-2">
              {connetedPages.map((page) => {
                const href = "";
                return (
                  <li key={page.label} className="mb-2">
                    <Link
                      href={page.href}
                      className={buttonVariants({
                        variant: "ghost",
                        className: "w-full !justify-start font-light",
                      })}
                    >
                      {page.label}
                    </Link>
                  </li>
                );
              })}
              <Button
                type="button"
                variant="destructive"
                className="w-full !justify-start font-light"
                onClick={() => disconnect()}
              >
                Disconnect
              </Button>
            </ul>
          </SheetContent>
        </Sheet>
      ) : (
        <ConnectWalletButton />
      )}
    </div>
  );
};

export default Wallet;
