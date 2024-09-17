"use client";

import Link from "next/link";
import { useEffect } from "react";
import { ethers } from "ethers";
import { ArrowDownUp, Copy, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import "./index.css";
import useWalletStore from "@/stores/wallet";

const formatAddress = (address: string) =>
  `${address.slice(0, 6)}...${address.slice(-6)}`;

const Wallet = () => {
  const setAddress = useWalletStore((state) => state.setAddress);
  const setProvider = useWalletStore((state) => state.setProvider);
  const disconnect = useWalletStore((state) => state.disconnect);
  const address = useWalletStore((state) => state.address);
  const provider = useWalletStore((state) => state.provider);

  const connectWallet = async () => {
    // TODO: Show Modal
    if (!window.ethereum) return alert("Install Metamask");

    const _provider =
      provider || new ethers.providers.Web3Provider(window.ethereum, "any");
    await _provider.send("eth_requestAccounts", []);

    const signer = _provider.getSigner();
    const address = await signer.getAddress();

    if (!provider) setProvider(_provider);
    setAddress(address);
  };

  const switchWallet = async () => {
    alert("switch address");
  };

  useEffect(() => {
    (async function getPreviouslyConnectedAddress() {
      if (!window.ethereum) return;

      const _provider = new ethers.providers.Web3Provider(
        window.ethereum,
        "any",
      );

      setProvider(_provider);
    })();
  }, []);

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
