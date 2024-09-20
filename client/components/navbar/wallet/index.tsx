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
import useWalletStore from "@/stores/wallet";
import { ethers } from "ethers";
import { crowdChainAddress } from "@/lib/contracts/crowd-chain/address";
import { crowdChainABI } from "@/lib/contracts/crowd-chain/abi";

const formatAddress = (address: string) =>
  `${address.slice(0, 6)}...${address.slice(-6)}`;

const Wallet = () => {
  const setAddress = useWalletStore((state) => state.setAddress);
  const disconnect = useWalletStore((state) => state.disconnect);
  const address = useWalletStore((state) => state.address);
  const writableProvider = useWalletStore((state) => state.writableProvider);
  const writableContract = useWalletStore((state) => state.writableContract);
  const setWritableContract = useWalletStore(
    (state) => state.setWritableContract,
  );

  const connectWallet = async () => {
    // TODO: Show Modal
    if (!writableProvider) return alert("Install metamask");

    await writableProvider.send("eth_requestAccounts", []);

    setAddress(await writableProvider.getSigner().getAddress());

    if (writableContract) return;

    const connectedSigner = writableProvider.getSigner();

    setWritableContract(
      new ethers.Contract(crowdChainAddress, crowdChainABI, connectedSigner),
    );
  };

  const switchWallet = async () => {
    await window.ethereum!.request!({
      method: "wallet_requestPermissions",
      params: [{ eth_accounts: {} }],
    });

    await window.ethereum!.request!({
      method: "eth_requestAccounts",
    });
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
                onClick={disconnect}
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
