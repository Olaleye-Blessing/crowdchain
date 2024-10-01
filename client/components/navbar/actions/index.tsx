"use client";
import useWalletStore from "@/stores/wallet";
import SwitchNetwork from "./network";

const Actions = () => {
  const address = useWalletStore((state) => state.address);

  return (
    <div className="md:flex md:items-center md:justify-start md:mr-4">
      {/* <p>Search Icon</p> */}
      {/* <p>Theme Button</p> */}
      {address && <SwitchNetwork />}
    </div>
  );
};

export default Actions;
