import { formatUnits } from "viem";
import { ISupportedTokensDetails } from "@/hooks/use-supported-coins";
import { IDonation, IDonationChain } from "@/interfaces/donation";

export const constructDonation = (
  _donation: IDonationChain,
  supportedTokens: ISupportedTokensDetails,
): IDonation => {
  const coin = supportedTokens[_donation.coin as keyof ISupportedTokensDetails];

  return {
    amount: +formatUnits(_donation.amount, coin?.decimal || 18),
    coin: _donation.coin,
    coinUnit: coin?.name || "-",
    donor: _donation.donor,
    timestamp: +formatUnits(_donation.timestamp, 0) * 1000,
  };
};
