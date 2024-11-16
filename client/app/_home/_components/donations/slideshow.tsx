"use client";

import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/free-mode";
import "./slideshow.css";
import { IAddress } from "@/interfaces/address";
import { formatAddress } from "@/utils/format-address";

export interface IDonation {
  amount: number;
  campaignId: string;
  donor: IAddress;
}

interface SlideShowProps {
  donations: IDonation[];
}

export default function SlideShow({ donations }: SlideShowProps) {
  return (
    <Swiper
      className="slideshow"
      modules={[Autoplay, FreeMode]}
      speed={5000}
      spaceBetween={10}
      direction={"horizontal"}
      autoplay={{ delay: 0, pauseOnMouseEnter: true }}
      loop
      slidesPerView={1}
      freeMode
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
          <SwiperSlide key={donation.campaignId}>
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
                  {donation.amount} ETH{" "}
                </span>{" "}
              </span>
              <span>
                <span>to </span>{" "}
                {/* Todo: Provide campaign name in the event */}
                <span className="text-black font-semibold">
                  campaign {donation.campaignId.slice(0, 12)}
                </span>
              </span>
            </Link>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
}
