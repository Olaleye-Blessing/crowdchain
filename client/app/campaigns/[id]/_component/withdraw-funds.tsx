"use client";

import { Button, ButtonProps } from "@/components/ui/button";
import { useAccountCheck } from "@/hooks/use-account-check";
import { useCrowdchainAddress } from "@/hooks/use-crowdchain-address";
import { toast } from "@/hooks/use-toast";
import { ICampaignDetail } from "@/interfaces/campaign";
import { wagmiAbi } from "@/lib/contracts/crowd-chain/abi";
import { useWriteContract } from "wagmi";
import { getWithdrawErrMsg } from "../_utils/getErrorMsg";

interface WithdrawFundsProps extends Pick<ICampaignDetail, "id"> {
  buttonProps?: ButtonProps;
}

export default function WithdrawFunds({ id, buttonProps }: WithdrawFundsProps) {
  const { isAccountAndCorrectNetwork } = useAccountCheck();
  const { writeContractAsync } = useWriteContract();
  const contractAddress = useCrowdchainAddress();

  const withdraw = async () => {
    try {
      if (!(await isAccountAndCorrectNetwork())) return;

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
      toast({
        description: getWithdrawErrMsg(error),
        variant: "destructive",
      });
    }
  };

  return (
    <Button {...buttonProps} onClick={withdraw}>
      Withdraw
    </Button>
  );
}
