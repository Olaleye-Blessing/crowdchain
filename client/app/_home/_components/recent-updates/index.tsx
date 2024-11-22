"use client";

import { useQuery } from "@tanstack/react-query";
import { useCrowdchainInstance } from "@/hooks/use-crowdchain-instance";
import SlideShow, { IUpdate } from "./slideshow";

export default function RecentUpdates() {
  const { crowdchainInstance } = useCrowdchainInstance();
  const {
    data: updates,
    error,
    isFetching,
  } = useQuery({
    queryKey: ["crowdchain-stats", "homepage", "updates"],
    staleTime: 1000 * 60 * 59,
    queryFn: async () => {
      try {
        const { data } = await crowdchainInstance().get<{ data: IUpdate[] }>(
          "/crowdchain/recentUpdates",
        );

        return data.data;
      } catch (error) {
        throw new Error("Internal server error");
      }
    },
  });

  if (isFetching || error || !updates || updates?.length === 0) return null;

  return (
    <section className="mt-6">
      <header className="text-center">
        <h2>Recent Updates</h2>
      </header>
      <SlideShow updates={updates} />
    </section>
  );
}
