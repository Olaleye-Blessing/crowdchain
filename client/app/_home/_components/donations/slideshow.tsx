"use client";

import Link from "next/link";
import { SwiperSlide } from "swiper/react";
import SlideShowComp from "@/components/slideshow";
import { IAddress } from "@/interfaces/address";
import { formatAddress } from "@/utils/format-address";

export interface IDonation {
  amount: number;
  campaignId: string;
  donor: IAddress;
  campaignTitle: string;
  coinUnit: string;
}

interface SlideShowProps {
  donations: IDonation[];
}

export default function SlideShow({ donations }: SlideShowProps) {
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
      {donations.map((donation) => {
        return (
          <SwiperSlide key={donation.campaignId} className="!h-auto">
            <Link
              href={`/campaigns/${donation.campaignId}`}
              className="block text-center text-[#82899a] border border-[#ebecf2] rounded-md py-2 px-1 bg-white flex-col text-sm transition-shadow duration-300 hover:shadow-[0.125rem_0.0625rem_1.75rem_-0.375rem_#16a34a]"
            >
              <span className="pr-1">
                <span className="text-primary font-semibold">
                  {formatAddress(donation.donor)}{" "}
                </span>{" "}
                <span>donated </span>{" "}
                <span className="rounded-sm bg-[#ebecf2] font-bold py-0.5 px-1">
                  {donation.amount} {donation.coinUnit}{" "}
                </span>{" "}
              </span>
              <span>
                <span>to </span>{" "}
                <span className="text-black font-semibold address__long">
                  {donation.campaignTitle.slice(0, 25)}
                </span>
              </span>
            </Link>
          </SwiperSlide>
        );
      })}
    </SlideShowComp>
  );
}
