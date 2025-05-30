"use client";

import MDXVisual from "@/components/markdown/visual";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ICampaignDetail } from "@/interfaces/campaign";
import Milestones from "../milestones";
import { useAccount } from "wagmi";
import Donations from "./donations";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Updates from "./updates";

const tabs = ["about", "donations", "updates", "milestones"];

export default function Info({ campaign }: { campaign: ICampaignDetail }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { address } = useAccount();
  const _tabs = [...tabs];
  if (campaign.totalMilestones === 0) _tabs.pop();

  const selectedTab = searchParams.get("tab") || tabs[0];

  function selectTab(tab: string) {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set("tab", tab);

    router.push(`${pathname}?${current.toString()}`, { scroll: false });
  }

  return (
    <section className="mt-4 border text-card-foreground shadow bg-card p-4 rounded-lg">
      <Tabs defaultValue={selectedTab}>
        <TabsList className="w-full overflow-x-auto">
          {_tabs.map((tab) => {
            return (
              <TabsTrigger
                key={tab}
                value={tab}
                className="capitalize data-[state=active]:text-primary"
                onClick={() => {
                  selectTab(tab);
                }}
              >
                {tab}
              </TabsTrigger>
            );
          })}
        </TabsList>
        <TabsContent value="about">
          <MDXVisual markdown={campaign.description} />
        </TabsContent>
        <TabsContent value="donations">
          <Donations campaign={campaign} />
        </TabsContent>
        <TabsContent value="updates">
          <Updates campaign={campaign} />
        </TabsContent>
        {campaign.totalMilestones > 0 && (
          <TabsContent value="milestones">
            <Milestones
              campaignId={campaign.id}
              owned={campaign.owner.toLowerCase() === address?.toLowerCase()}
            />
          </TabsContent>
        )}
      </Tabs>
    </section>
  );
}
