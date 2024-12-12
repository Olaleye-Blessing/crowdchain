"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ICampaignDetail } from "@/interfaces/campaign";
import { ISupportedCoins } from "@/hooks/use-supported-coins";
import Donate from "./donate";
import Refund from "./refund";

interface RefundOrDonateProps {
  campaign: ICampaignDetail;
  supportedCoins: ISupportedCoins;
}

export default function RefundOrDonate({ campaign, supportedCoins }: RefundOrDonateProps) {
  const currentTime = Date.now() / 1000;
  const canDonate = currentTime < campaign.deadline;
  const canRefund = currentTime < campaign.refundDeadline;

  return (
    <section className="border text-card-foreground shadow bg-card p-4 rounded-lg">
      <Tabs defaultValue="donate">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="donate">Donate</TabsTrigger>
          <TabsTrigger value="refund">Refund</TabsTrigger>
        </TabsList>
        <TabsContent value="donate">
          {campaign.claimed ? (
            <p className="h-full flex items-center justify-center text-center">
              This campaign has been claimed!
            </p>
          ) : !canDonate ? (
            <p className="h-full flex items-center justify-center text-center">
              Deadline passed!
            </p>
          ) : (
            <Donate supportedCoins={supportedCoins} campaignId={campaign.id} />
          )}
        </TabsContent>
        <TabsContent value="refund">
          {campaign.claimed ? (
            <p className="h-full flex items-center justify-center text-center">
              This campaign has been claimed!
            </p>
          ) : !canRefund ? (
            <p className="h-full flex items-center justify-center text-center">
              Refund period has been closed!
            </p>
          ) : campaign.totalMilestones === 0 ||
            (campaign.totalMilestones > 0 &&
              campaign.currentMilestone === 0) ? (
            <Refund supportedCoins={supportedCoins} campaignId={campaign.id} />
          ) : (
            <p className="h-full flex items-center justify-center text-center">
              Refund is not possible again because the first milestone has been
              approved (withdrawn by the campaign owner).
            </p>
          )}
        </TabsContent>
      </Tabs>
      <Button variant="outline" className="w-full mt-4">
        Share Campaign
      </Button>
    </section>
  );
}
