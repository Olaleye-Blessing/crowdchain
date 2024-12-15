import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import Lists from "./lists";

export default function Campaigns() {
  return (
    <section>
      <div className="layout">
        <header className="flex items-center justify-between flex-wrap mb-4 sm:mb-2">
          <h2 className="mb-1">Featured Campaigns</h2>
          <Link
            className={buttonVariants({
              variant: "link",
              className: "!p-0 !mb-1",
            })}
            href="/campaigns"
          >
            Explore More
          </Link>
        </header>
      </div>
      <Lists />
    </section>
  );
}
