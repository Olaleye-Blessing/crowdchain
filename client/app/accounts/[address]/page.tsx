import { IAddress } from "@/interfaces/address";
import Main from "./_components/main";
import { IPage } from "@/interfaces/page";
import Header from "./_components/header";

export default function Page({ params }: IPage<{ address: IAddress }>) {
  return (
    <div className="">
      <Header owner={params.address} />
      <main>
        {params.address.startsWith("0x") ? (
          <Main account={params.address} />
        ) : (
          <p className="text-red-800">Invalid Account</p>
        )}
      </main>
    </div>
  );
}
