import { IAddress } from "@/interfaces/address";
import { User } from "lucide-react";

export default function Header({ owner }: { owner: IAddress }) {
  return (
    <header className="bg-white py-8">
      <div className="layout flex items-center justify-start">
        <figure className="flex items-center justify-center more__shadow border border-border rounded-md mr-4">
          <User className="w-16 h-16" />
        </figure>
        <h1 className="font-bold mb-0 text-[2rem]">
          <span className="address__long text-[0.6em]">{owner}</span>
        </h1>
      </div>
    </header>
  );
}
