"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ICampaignDetail } from "@/interfaces/campaign";
import useWalletStore from "@/stores/wallet";
import { parseEther } from "ethers/lib/utils";
import { toast } from "@/hooks/use-toast";

export default function RefundOrDonate({
  deadline,
  refundDeadline,
  claimed,
  id,
}: Pick<ICampaignDetail, "deadline" | "refundDeadline" | "claimed" | "id">) {
  const writableContract = useWalletStore((state) => state.writableContract);
  const [donationAmount, setDonationAmount] = useState("");
  const [refundAmount, setRefundAmount] = useState("");

  const currentTime = Date.now() / 1000;
  const canDonate = currentTime < deadline;
  const canRefund = currentTime < refundDeadline;

  const handleDonate = async () => {
    if (!writableContract || !donationAmount) return;

    try {
      const tx = await writableContract.donate(+id, {
        value: parseEther(`${donationAmount}`),
      });

      await tx.wait();

      toast({ title: `You donated ${donationAmount}!` });
    } catch (error) {
      console.log("__ THERE IS AN ERROR __");
      console.log(error);
    }
  };

  const handleRefund = () => {
    alert("Requesting refund");
  };

  return (
    <section className="bg-gray-100 p-4 rounded-lg ">
      <Tabs defaultValue="donate">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="donate">Donate</TabsTrigger>
          <TabsTrigger value="refund">Refund</TabsTrigger>
        </TabsList>
        <TabsContent value="donate">
          {claimed ? (
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
              handleSubmit={handleDonate}
              btnText="Donate"
            />
          )}
        </TabsContent>
        <TabsContent value="refund">
          {claimed ? (
            <p className="h-full flex items-center justify-center text-center">
              This campaign has been claimed!
            </p>
          ) : !canRefund ? (
            <p className="h-full flex items-center justify-center text-center">
              Refund period has been closed!
            </p>
          ) : (
            <Form
              title="Request a Refund"
              description="You can request a refund for your contribution if the campaign hasn't reached its goal."
              disabledBtn={!refundAmount}
              inputValue={refundAmount}
              handleInputChange={(val) => {
                setRefundAmount(val);
              }}
              handleSubmit={handleRefund}
              btnText="Request Refund"
            />
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
      {/* <h4 className="!-mb-4 font-medium">{props.title}</h4> */}
      <p className="text-sm text-gray-600">{props.description}</p>
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
