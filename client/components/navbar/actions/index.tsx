"use client";
import { useAccount } from "wagmi";
import SwitchNetwork from "./network";

const Actions = () => {
  const { address } = useAccount();

  return (
    <div className="pl-4 mb-4 md:pl-0 md:flex md:items-center md:justify-start md:mr-4 md:mb-0">
      {/* <p>Search Icon</p> */}
      {/* <p>Theme Button</p> */}
      {address && <SwitchNetwork />}
    </div>
  );
};

export default Actions;
