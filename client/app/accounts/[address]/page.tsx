import { IAddress } from "@/interfaces/address";
import Main from "./_components/main";
import { IPage } from "@/interfaces/page";

export default function Page({ params }: IPage<{ address: IAddress }>) {
  return (
    <div className="mt-4 layout">
      <header>
        <h1 className="text-5xl font-bold mb-6">
          Campaigns for{" "}
          <span className="text-primary text-[0.6em]">{params.address}</span>
        </h1>
      </header>
      <main>
        {params.address.startsWith("0x") ? (
          <Main owner={params.address} />
        ) : (
          <p className="text-red-800">Invalid Account</p>
        )}
      </main>
    </div>
  );
}
