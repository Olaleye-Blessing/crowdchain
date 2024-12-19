"use client";
import { Address } from "viem";
import { useCrowdchainRequest } from "@/hooks/use-crowdchain-request";
import SlideShow, { IRefund } from "./slideshow";

export default function Refunds() {
  const {
    data: refunds,
    error,
    isFetching,
  } = useCrowdchainRequest<IRefund[]>({
    url: `/crowdchain/recentRefunds`,
    options: { queryKey: ["recent-refunds"] },
  });

  console.log({ refunds });

  if (isFetching || error || !refunds || refunds?.length === 0) return null;

  return (
    <section>
      <div className="layout">
        <header className="flex flex-col items-center justify-center text-center">
          <h2>Refunds</h2>
          <p className="text-sm text-gray-600 mt-1 mb-4">
            We respect your choice to withdraw. Donations can be refunded at any
            time before project completion/refund deadline; no questions asked.
          </p>
        </header>
        <div className="layout sm:flex items-center justify-start">
          <p className="mb-3 sm:mb-0 sm:flex-shrink-0">Recent Refunds</p>
          <div className="hidden sm:block sm:w-[0.07rem] sm:bg-input sm:mx-3 sm:h-9" />
          <SlideShow refunds={refunds} />
        </div>
      </div>
    </section>
  );
}
