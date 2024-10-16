import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function Header() {
  return (
    <header className="home__header relative">
      <div className="absolute inset-0 bg-black/10 z-[1]" />
      <div className="relative z-[2] layout flex flex-col items-center justify-center text-center text-white">
        <h1>Welcome to ČrôwdChǎin</h1>
        <p className="w-full max-w-[64rem]">
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
