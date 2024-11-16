/* eslint-disable @next/next/no-img-element */
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import CurlySvg from "./curly-svg";

export default function Header() {
  return (
    <header className="relative bg-white px-4 mt-8 py-12 md:py-16 md:mt-2">
      <CurlySvg className="absolute top-0 left-0 md:left-14 md:top-8" />
      <div className="layout relative pt-8 max-w-[80rem] md:flex md:items-center md:justify-between md:pt-2 md:max-w-[75rem]">
        <div className="max-w-[33rem]">
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
              variant: "default",
            })}
          >
            Start a Campaign
          </Link>
        </div>
        <figure className="flex items-center justify-center w-full mx-auto mt-8 md:max-w-max">
          <img
            src="/assets/home/header_bg.jpg"
            alt=""
            className="max-w-80 md:max-w-96"
          />
        </figure>
      </div>
      <CurlySvg
        className="absolute -bottom-8 right-0 md:right-8"
        color="#e77"
      />
    </header>
  );
}
