"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ICampaignDetail } from "@/interfaces/campaign";
import { toast } from "@/hooks/use-toast";
import { useWriteContract } from "wagmi";
import { wagmiAbi } from "@/lib/contracts/crowd-chain/abi";
import { parseEther } from "viem";
import { useCrowdchainAddress } from "@/hooks/use-crowdchain-address";

interface RefundOrDonateProps {
  campaign: ICampaignDetail;
}

export default function RefundOrDonate({ campaign }: RefundOrDonateProps) {
  const { writeContractAsync } = useWriteContract();
  const contractAddress = useCrowdchainAddress();
  const [donationAmount, setDonationAmount] = useState("");
  const [refundAmount, setRefundAmount] = useState("");

  const currentTime = Date.now() / 1000;
  const canDonate = currentTime < campaign.deadline;
  const canRefund = currentTime < campaign.refundDeadline;

  const handleAction = async (type: "refund" | "donate", amount: string) => {
    try {
      const { dismiss } = toast({ title: "Processing..." });

      await writeContractAsync({
        abi: wagmiAbi,
        address: contractAddress,
        functionName: type === "donate" ? "donate" : "refund",
        args:
          type === "donate"
            ? [BigInt(campaign.id)]
            : [BigInt(campaign.id), parseEther(`${amount}`)],
        value: type === "donate" ? parseEther(`${amount}`) : undefined,
      });

      dismiss();

      toast({
        title:
          type === "donate"
            ? `You donated ${amount}!`
            : `${amount} has been sent to your wallet!`,
      });
    } catch (error) {
      console.log("__ THERE IS AN ERROR __");
      console.log(error);
    }
  };

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
            <Form
              title="Make a Donation"
              description="You can contribute to the goal of this campaign. The more the contribution, the less time to achieve its goal."
              disabledBtn={!donationAmount}
              inputValue={donationAmount}
              handleInputChange={(val) => {
                setDonationAmount(val);
              }}
              handleSubmit={() => handleAction("donate", donationAmount)}
              btnText="Donate"
            />
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
              campaign.nextWithdrawableMilestone === 0) ? (
            <Form
              title="Request a Refund"
              description="You can request a refund for your contribution if the campaign hasn't reached its goal."
              disabledBtn={!refundAmount}
              inputValue={refundAmount}
              handleInputChange={(val) => {
                setRefundAmount(val);
              }}
              handleSubmit={() => handleAction("refund", refundAmount)}
              btnText="Request Refund"
            />
          ) : (
            <p className="h-full flex items-center justify-center text-center">
              Refund is not possible again because the first milestone has been
              approved(withdrawn by the campaign owner).
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

interface FormProps {
  title: string;
  description: string;
  inputValue: string;
  disabledBtn: boolean;
  handleInputChange(value: string): void;
  handleSubmit(): void;
  btnText: string;
}

function Form(props: FormProps) {
  return (
    <form
      className="flex flex-col space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        props.handleSubmit();
      }}
    >
      <p className="text-sm text-muted-foreground">{props.description}</p>
      <Input
        type="number"
        placeholder="Amount in ETH"
        value={props.inputValue}
        onChange={(e) => props.handleInputChange(e.target.value)}
        className="w-full"
      />
      <Button type="submit" disabled={props.disabledBtn} className="w-full">
        {props.btnText}
      </Button>
    </form>
  );
}
