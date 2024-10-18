"use client";

import { Button, ButtonProps } from "@/components/ui/button";
import { useCrowdchainAddress } from "@/hooks/use-crowdchain-address";
import { toast } from "@/hooks/use-toast";
import { ICampaignDetail } from "@/interfaces/campaign";
import { wagmiAbi } from "@/lib/contracts/crowd-chain/abi";
import { useWriteContract } from "wagmi";

interface WithdrawFundsProps extends Pick<ICampaignDetail, "id"> {
  buttonProps?: ButtonProps;
}

export default function WithdrawFunds({ id, buttonProps }: WithdrawFundsProps) {
  const { writeContractAsync } = useWriteContract();
  const contractAddress = useCrowdchainAddress();

  const withdraw = async () => {
    try {
      await writeContractAsync({
        abi: wagmiAbi,
        address: contractAddress,
        functionName: "withdraw",
        args: [BigInt(id)],
      });

      toast({
        title: "Funds has been sent to your wallet",
      });
    } catch (error) {
      console.log("__ THERE IS AN ERROR __");
      console.log(error);
    }
  };

  return (
    <Button {...buttonProps} onClick={withdraw}>
      Withdraw
    </Button>
  );
}
