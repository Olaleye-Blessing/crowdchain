import { getGeneralContractError } from "@/utils/contract-error";
import { formatUnits } from "viem";

// Possible errors gotten from ABI
type CustomErrorType =
  | "CampaignDonation__EmptyDonation"
  | "Campaign__CoinNotSupported"
  | "CampaignDonation__DonationFailed"
  | "CampaignDonation__CampaignAlreadyClaimed"
  | "CampaignDonation__CampaignClosed"
  | "CampaignDonation__InsufficientAllowance";

export const getDonateErrorMsg = (error: unknown, coinDecimals: number) => {
  const originalError = getGeneralContractError(error);

  if (typeof originalError === "string") return originalError;

  const errorName = originalError.data?.errorName as CustomErrorType;

  if (errorName === "CampaignDonation__DonationFailed") {
    const donationFailedReason = originalError.data?.args?.[0] as string;

    return donationFailedReason || "Donation failed.";
  }

  if (errorName === "CampaignDonation__EmptyDonation") {
    return "Donation amount cannot be zero.";
  }

  if (errorName === "CampaignDonation__InsufficientAllowance") {
    const [coin, amount] = originalError.data?.args as [string, bigint];

    return `Insufficient token allowance for ${coin}. Requested amount: ${formatUnits(amount, coinDecimals)}`;
  }

  if (errorName === "Campaign__CoinNotSupported") {
    return "The selected coin is not supported.";
  }

  if (errorName === "CampaignDonation__CampaignAlreadyClaimed") {
    return "This campaign has already been claimed.";
  }

  if (errorName === "CampaignDonation__CampaignClosed") {
    return "This campaign is currently closed.";
  }

  return "An unknown contract error occurred.";
};
