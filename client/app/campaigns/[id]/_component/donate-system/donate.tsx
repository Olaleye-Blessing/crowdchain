import { useState } from "react";
import { Address } from "viem";
import { ISupportedCoins } from "@/hooks/use-supported-coins";
import { ETH_ADDRESS } from "@/constants/contracts";
import Form from "./form";
import { useConfig, useWriteContract } from "wagmi";
import { approveAllowance, donate } from "./utils";
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
  const coinDecimals = supportedCoins.supportedTokens?.[token]?.decimal;

  const _donate = async () => {
    try {
      setDonating(true);

      if (token !== ETH_ADDRESS) {
        await approveAllowance({
          tokenDecimal: coinDecimals,
          token,
          contractAddress: crowdchainAddress,
          writeContractAsync,
          amount: donationAmount,
          config,
        });
      }

      toast({ title: "Donating" });

      const donateTxHash = await donate({
        tokenDecimal: coinDecimals,
        token,
        contractAddress: crowdchainAddress,
        writeContractAsync,
        campaignId,
        amount: donationAmount,
      });

      toast({ title: "Confirming tx hash" });

      await waitForTransactionReceipt(config, {
        hash: donateTxHash,
        confirmations: 1,
      });

      toast({ title: "Donation successful" });
    } catch (error) {
      console.error("__ There is an error __", error);
      toast({ title: "Donation failed" });
    } finally {
      setDonating(false);
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
      disabledBtn={+donationAmount <= 0 || donating}
      inputValue={donationAmount}
      handleInputChange={(val) => {
        setDonationAmount(val);
      }}
      handleSubmit={() => _donate()}
      btnText="Donate"
    />
  );
}
