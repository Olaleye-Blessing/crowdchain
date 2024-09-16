"use client";

import Link from "next/link";
import { Copy, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import "./index.css";

const Wallet = () => {
  let walletConnected = false;
  // walletConnected = true;

  const address = "0x40Fd612a0530485FC6595F969c1855D37DCf6a10";
  const formattedAddress = `${address.slice(0, 6)}...${address.slice(-6)}`;

  return (
    <div className="border-t border-border px-4 md:border-0 md:flex md:items-center md:justify-start md:px-0 md:ml-4">
      {walletConnected ? (
        <Popover>
          <PopoverTrigger asChild>
            <Button className="connection__btn">{formattedAddress}</Button>
          </PopoverTrigger>
          <PopoverContent className="!p-0">
            <ul className="flex flex-col text-left">
              <button type="button" className="connected__item">
                <span>
                  <Copy />
                </span>
                <span>Copy</span>
              </button>
              <Link href={"/"} className="connected__item">
                <span>
                  <User />
                </span>
                <span>My Account</span>
              </Link>
              <button type="button" className="connected__item">
                <span>
                  <LogOut />
                </span>
                <span>Disconnect</span>
              </button>
            </ul>
          </PopoverContent>
        </Popover>
      ) : (
        <Button className="connection__btn">Connect Wallet</Button>
      )}
    </div>
  );
};

export default Wallet;
