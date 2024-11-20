"use client";

import SlideShow, { IDonation } from "./slideshow";
import { useQuery } from "@tanstack/react-query";
import { useCrowdchainInstance } from "@/hooks/use-crowdchain-instance";

export default function Recent() {
  const { crowdchainInstance } = useCrowdchainInstance();
  const {
    data: donations,
    error,
    isFetching,
  } = useQuery({
    queryKey: ["recentDonations"],
    staleTime: 1000 * 60 * 59,
    queryFn: async () => {
      try {
        const {
          data: { data: donations },
        } = await crowdchainInstance().get<{ data: IDonation[] }>(
          "/crowdchain/recentDonations",
        );

        return donations;
      } catch (error) {
        throw new Error("Internal server error");
      }
    },
  });

  if (isFetching || error || !donations || donations?.length === 0) return null;

  return (
    <section className="mt-6">
      <div className="layout sm:flex items-center justify-start">
        <p className="mb-3 sm:mb-0 sm:flex-shrink-0">Recent Donations</p>
        <div className="hidden sm:block sm:w-[0.07rem] sm:bg-input sm:mx-3 sm:h-9" />
        <SlideShow donations={donations} />
      </div>
    </section>
  );
}
