/* eslint-disable @next/next/no-img-element */
import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";

interface HomeLinkProps {
  className?: string;
}

export const HomeLink = ({ className }: HomeLinkProps) => {
  return (
    <Link
      href={"/"}
      className={cn(
        "inline-flex items-center justify-center rounded-full shadow-2xl drop-shadow-2xl",
        className,
      )}
    >
      <img
        src="/android-chrome-192x192.png"
        alt="Crowdchain logo"
        className="w-8 h-8 rounded-full shadow-2xl drop-shadow-2xl"
      />
      <span className="sr-only">ČrôwdChǎin</span>
    </Link>
  );
};
