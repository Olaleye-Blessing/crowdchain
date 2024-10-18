"use client";

import Link from "next/link";
import { ArrowDownUp, Copy, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import "./index.css";
import { formatAddress } from "@/utils/format-address";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";

const Wallet = () => {
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const account = useAccount();
  const address = account.address;

  const connectWallet = () => connect({ connector: injected() });
  const switchWallet = () => {
    connectWallet();
  };

  return (
    <div className="border-t border-border px-4 md:border-0 md:flex md:items-center md:justify-start md:px-0 md:ml-4">
      {address ? (
        <Popover>
          <PopoverTrigger asChild>
            <Button className="connection__btn">
              {formatAddress(address)}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="!p-0">
            <ul className="flex flex-col text-left">
              <button type="button" className="connected__item">
                <span>
                  <Copy />
                </span>
                <span>Copy</span>
              </button>
              <button
                type="button"
                className="connected__item"
                onClick={switchWallet}
              >
                <span>
                  <ArrowDownUp />
                </span>
                <span>Switch</span>
              </button>
              <Link href={"/"} className="connected__item">
                <span>
                  <User />
                </span>
                <span>My Account</span>
              </Link>
              <button
                type="button"
                className="connected__item"
                onClick={() => disconnect()}
              >
                <span>
                  <LogOut />
                </span>
                <span>Disconnect</span>
              </button>
            </ul>
          </PopoverContent>
        </Popover>
      ) : (
        <Button className="connection__btn" onClick={connectWallet}>
          Connect Wallet
        </Button>
      )}
    </div>
  );
};

export default Wallet;
