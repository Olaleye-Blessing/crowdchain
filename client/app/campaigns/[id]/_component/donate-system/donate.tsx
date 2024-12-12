import { useState } from "react";
import { Address, formatUnits, parseUnits } from "viem";
import { ISupportedCoins } from "@/hooks/use-supported-coins";
import { Button } from "@/components/ui/button";
import { ETH_ADDRESS } from "@/constants/contracts";
import { useAllowance } from "@/hooks/use-allowance";
import { useApproval } from "@/hooks/use-approval";
import Form from "./form";
import { useConfig, useWriteContract } from "wagmi";
import { donate } from "./utils";
import { useCrowdchainAddress } from "@/hooks/use-crowdchain-address";
import { waitForTransactionReceipt } from "@wagmi/core";
import { toast } from "@/hooks/use-toast";

interface DonateProps {
  supportedCoins: ISupportedCoins;
  campaignId: number;
}

export default function Donate({ supportedCoins, campaignId }: DonateProps) {
  const config = useConfig();
  const crowdchainAddress = useCrowdchainAddress();
  const [donationAmount, setDonationAmount] = useState("");
  const [token, setToken] = useState<Address>(ETH_ADDRESS);
  const [donating, setDonating] = useState(false);
  const { writeContractAsync } = useWriteContract();
  const {
    data: allowance,
    refetch: refetchAllowance,
    isFetching: fetchingAllowance,
  } = useAllowance({
    token,
    unique: true,
  });
  const {
    approve,
    approvalResult: { isFetching: fetchingApproval },
  } = useApproval({
    token,
    amount: donationAmount,
    enabled: allowance !== undefined,
  });
  const coinDecimals = supportedCoins.supportedTokens?.[token]?.decimal;

  const approveDonation = async () => {
    await approve(token, parseUnits(donationAmount, coinDecimals));

    refetchAllowance();
  };

  const _donate = async () => {
    console.log("_ DONATE _");
    if (!donationAmount) return;

    if (token !== ETH_ADDRESS) {
      if (!coinDecimals || !allowance) return;
      if (+formatUnits(allowance, coinDecimals) < +donationAmount) return;
    }

    toast({ title: "Donating.." });

    try {
      const txHash = await donate({
        tokenDecimal: coinDecimals,
        token,
        contractAddress: crowdchainAddress,
        writeContractAsync,
        campaignId,
        amount: donationAmount,
      });

      await waitForTransactionReceipt(config, {
        hash: txHash,
        confirmations: 1,
      });

      toast({ title: "Donated" });
      setDonating(false);
    } catch (error) {
      console.log("__ ERROR __");
      console.log(error);
    }
  };

  return (
    <Form
      type="donate"
      token={token}
      setToken={setToken}
      supportedCoins={supportedCoins}
      title="Make a Donation"
      description="You can contribute to the goal of this campaign. The more the contribution, the less time to achieve its goal."
      disabledBtn={
        token === ETH_ADDRESS
          ? !donationAmount
          : Boolean(coinDecimals) &&
            (donating ||
              fetchingAllowance ||
              fetchingApproval ||
              !donationAmount ||
              !allowance ||
              +formatUnits(allowance, coinDecimals) < +donationAmount)
      }
      inputValue={donationAmount}
      handleInputChange={(val) => {
        setDonationAmount(val);
      }}
      handleSubmit={() => _donate()}
      btnText="Donate"
    >
      {token !== ETH_ADDRESS && (
        <Button
          type="button"
          disabled={!donationAmount || fetchingAllowance || fetchingApproval}
          onClick={approveDonation}
          className="mr-2 w-full"
        >
          Approve
        </Button>
      )}
    </Form>
  );
}
