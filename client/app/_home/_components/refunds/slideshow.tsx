"use client";

import Link from "next/link";
import { SwiperSlide } from "swiper/react";
import SlideShowComp from "@/components/slideshow";
import { formatAddress } from "@/utils/format-address";
import { Address } from "viem";

export interface IRefund {
  donor: Address;
  campaignId: number;
  amount: string;
  coinUnit: string;
}

interface SlideShowProps {
  refunds: IRefund[];
}

export default function SlideShow({ refunds }: SlideShowProps) {
  return (
    <SlideShowComp
      breakpoints={{
        540: {
          slidesPerView: 2,
        },
        768: {
          slidesPerView: 3,
        },
      }}
    >
      {refunds.map((refund) => {
        return (
          <SwiperSlide key={refund.campaignId} className="!h-auto">
            <Link
              href={`/campaigns/${refund.campaignId}`}
              className="h-full text-center text-[#82899a] border border-[#ebecf2] rounded-md py-2 px-1 bg-white text-sm transition-shadow duration-300 hover:shadow-[0.125rem_0.0625rem_1.75rem_-0.375rem_#16a34a] flex items-center justify-center flex-row flex-wrap"
            >
              <span className="text-primary font-semibold">
                {formatAddress(refund.donor)}{" "}
              </span>
              <span className="mx-0.5">got a refund of </span>
              <span className="rounded-sm bg-[#ebecf2] font-bold py-0.5 px-1">
                {refund.amount} {refund.coinUnit}
              </span>
            </Link>
          </SwiperSlide>
        );
      })}
    </SlideShowComp>
  );
}
