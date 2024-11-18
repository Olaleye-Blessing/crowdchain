"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IAddress } from "@/interfaces/address";
import { useSearchParameters } from "@/hooks/use-search-parameters";
import Campaigns from "./campaigns";
import Overview from "./overview";
import Donations from "./donations";

const tabs = ["overview", "campaigns", "donations"];

interface MainProps {
  account: IAddress;
}

export default function Main({ account }: MainProps) {
  const { getParam, updateParams, deleteParams } = useSearchParameters();
  const selectedTab = getParam("tab") || tabs[0];

  return (
    <Tabs defaultValue={selectedTab} className="mt-4">
      <TabsList className="w-full overflow-x-auto bg-white">
        {tabs.map((tab) => {
          return (
            <TabsTrigger
              key={tab}
              value={tab}
              className="capitalize data-[state=active]:text-primary"
              onClick={() => {
                tab === tabs[0]
                  ? deleteParams({ params: [tabs[0]] })
                  : updateParams({ params: { tab } });
              }}
            >
              {tab}
            </TabsTrigger>
          );
        })}
      </TabsList>
      <div className="layout">
        <TabsContent value="overview">
          <Overview account={account} />
        </TabsContent>
        <TabsContent value="campaigns">
          <Campaigns account={account} />
        </TabsContent>
        <TabsContent value="donations">
          <Donations account={account} />
        </TabsContent>
      </div>
    </Tabs>
  );
}
