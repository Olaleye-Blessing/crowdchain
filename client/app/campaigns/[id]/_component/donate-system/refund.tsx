import { ISupportedCoins } from "@/hooks/use-supported-coins";
import Form from "./form";
import { useState } from "react";
import { ETH_ADDRESS } from "@/constants/contracts";
import { Address } from "viem";
import { refund } from "./utils";
import { useConfig, useWriteContract } from "wagmi";
import { useCrowdchainAddress } from "@/hooks/use-crowdchain-address";
import { waitForTransactionReceipt } from "@wagmi/core";
import { toast } from "@/hooks/use-toast";
import { getRefundErrorMsg } from "../../_utils/getErrorMsg";

interface RefundProps {
  supportedCoins: ISupportedCoins;
  campaignId: number;
}

export default function Refund({ supportedCoins, campaignId }: RefundProps) {
  const config = useConfig();
  const [refundAmount, setRefundAmount] = useState("");
  const [token, setToken] = useState<Address>(ETH_ADDRESS);
  const { writeContractAsync, isPending } = useWriteContract();
  const contractAddress = useCrowdchainAddress();

  const _refund = async () => {
    const tokenDecimal = supportedCoins.supportedTokens?.[token]?.decimal;

    if (!tokenDecimal) return;

    toast({ title: "Making refund." });

    try {
      const txHash = await refund({
        tokenDecimal,
        writeContractAsync,
        contractAddress,
        token,
        campaignId,
        amount: refundAmount,
      });

      await waitForTransactionReceipt(config, {
        hash: txHash,
        confirmations: 1,
      });

      toast({ title: "Refund successful" });
    } catch (error) {
      toast({
        title: getRefundErrorMsg(error, tokenDecimal),
        variant: "destructive",
      });
    }
  };

  return (
    <Form
      supportedCoins={supportedCoins}
      token={token}
      setToken={setToken}
      title="Request a Refund"
      description="You can request a refund for your contribution if the campaign hasn't reached its goal."
      disabledBtn={+refundAmount <= 0 || isPending}
      inputValue={refundAmount}
      handleInputChange={(val) => {
        setRefundAmount(val);
      }}
      handleSubmit={() => _refund()}
      btnText="Request Refund"
    />
  );
}
