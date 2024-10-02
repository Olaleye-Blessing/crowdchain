import Main from "./_components/main";
import { IPage } from "@/interfaces/page";

export default function Page({ params }: IPage<{ address: string }>) {
  return (
    <div className="mt-4 layout">
      <header>
        <h1 className="text-5xl font-bold mb-6">
          Campaigns for{" "}
          <span className="text-primary text-[0.6em]">{params.address}</span>
        </h1>
      </header>
      <main>
        <Main address={params.address} />
      </main>
    </div>
  );
}
