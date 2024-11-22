import Link from "next/link";
import { Address } from "viem";
import { SwiperSlide } from "swiper/react";
import { formatAddress } from "@/utils/format-address";
import SlideShowComp from "@/components/slideshow";

export interface IUpdate {
  campaignId: number;
  updateId: number;
  owner: Address;
  title: string;
}

interface SlideShowProps {
  updates: IUpdate[];
}

export default function SlideShow({ updates }: SlideShowProps) {
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
      {updates.map((update) => {
        return (
          <SwiperSlide key={update.updateId} className="!h-auto">
            <Link
              href={`/campaigns/${update.campaignId}?tab=updates`}
              className="block text-center text-[#82899a] border border-[#ebecf2] rounded-md py-2 px-1 bg-white flex-col text-sm transition-shadow duration-300 hover:shadow-[0.125rem_0.0625rem_0.75rem_-0.375rem_#16a34a] h-full w-full"
            >
              <h3 className="truncate">{update.title}</h3>
              <p>{formatAddress(update.owner)}</p>
            </Link>
          </SwiperSlide>
        );
      })}
    </SlideShowComp>
  );
}
