import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import Lists from "./lists";

export default function Campaigns() {
  return (
    <section className="mt-10">
      <div className="layout">
        <header className="flex items-center justify-between flex-wrap">
          <h2>Featured Campaigns</h2>
          <Link
            className={buttonVariants({ variant: "link", className: "!pr-0" })}
            href="/explore"
          >
            Explore More
          </Link>
        </header>
      </div>
      <Lists />
    </section>
  );
}
