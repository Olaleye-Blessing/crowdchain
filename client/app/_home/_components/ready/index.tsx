import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import TotalCampaigns from "./total-campaigns";

export default function Ready() {
  return (
    <section className="">
      <div className="layout">
        <header className="text-center mb-4">
          <h2>Ready to Make a Difference?</h2>
          <p className="text-sm text-center text-gray-500 -mt-1">
            Join our community of changemakers and support projects that matter.
          </p>
        </header>
        <div className="flex items-center justify-center">
          <Link
            href="/create"
            className={buttonVariants({ className: "mr-4" })}
          >
            Launch a Campaign
          </Link>
          <Link
            href="/create"
            className={buttonVariants({
              variant: "secondary",
              className: "mr-4",
            })}
          >
            Explore
          </Link>
        </div>
        <TotalCampaigns />
      </div>
    </section>
  );
}
