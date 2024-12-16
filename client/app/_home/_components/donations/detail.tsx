"use client";

import AnimatedNumber from "@/components/animated-number";
import { IFormatter } from "@/components/animated-number/utils";

interface DetailProps {
  title: string;
  body: number;
  isLoading: boolean;
  type?: "amount";
}

const formatter: IFormatter = {
  options: { currency: "USD", style: "currency" },
};

export default function Detail({ title, body, isLoading, type }: DetailProps) {
  return (
    <li className="flex items-center justify-center flex-col text-white">
      <p className="text-base font-light">{title}</p>
      <p className="text-[2rem] font-bold">
        {isLoading ? (
          0
        ) : (
          <>
            {type === "amount" && "~"}
            <AnimatedNumber
              value={body}
              formatter={type === "amount" ? formatter : undefined}
            />
          </>
        )}
      </p>
    </li>
  );
}
