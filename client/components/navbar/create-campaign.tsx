import { Plus } from "lucide-react";
import Link from "next/link";

export default function CreateCampaign() {
  return (
    <Link
      href="/create"
      className="hidden more__shadow w-full max-w-max md:inline-flex items-center justify-center bg-primary text-white md:rounded-[50%] md:p-2 lg:rounded-md whitespace-nowrap ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <span className="text-sm md:sr-only lg:not-sr-only">
        Create A Campaign
      </span>
      <span className="w-6 h-6 lg:hidden">
        <Plus className="w-6 h-6" />
      </span>
    </Link>
  );
}
