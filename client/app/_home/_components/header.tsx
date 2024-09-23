import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function Header() {
  return (
    <header className="min-h-[60vh] bg-primary/80 flex items-center justify-center">
      <div className="layout flex flex-col items-center justify-center text-center h-full">
        <h1>Welcome to ČrôwdChǎin</h1>
        <p>
          Empowering innovation through blockchain-based crowdfunding. Launch
          your ideas, support groundbreaking projects or ask for help with
          transparency and security.
        </p>
        <Link
          href="/create"
          className={buttonVariants({
            className: "mt-8",
            variant: "secondary",
          })}
        >
          Start a Campaign
        </Link>
      </div>
    </header>
  );
}
