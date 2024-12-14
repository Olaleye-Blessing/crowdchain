import { getGeneralContractError } from "@/utils/contract-error";
import { formatUnits } from "viem";

// Possible errors gotten from ABI
type CustomCommonErrorType =
  | "Campaign__CoinNotSupported"
  | "CampaignDonation__CampaignAlreadyClaimed";

type CustomDonateErrorType =
  | CustomCommonErrorType
  | "CampaignDonation__EmptyDonation"
  | "CampaignDonation__DonationFailed"
  | "CampaignDonation__CampaignClosed"
  | "CampaignDonation__InsufficientAllowance";

export const getDonateErrorMsg = (error: unknown, coinDecimals: number) => {
  const originalError = getGeneralContractError(error);

  if (typeof originalError === "string") return originalError;

  const errorName = originalError.data?.errorName as CustomDonateErrorType;

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

type CustomRefundErrorType =
  | CustomCommonErrorType
  | "CampaignDonation__WithdrawNotAllowed"
  | "CampaignDonation__RefundDeadlineElapsed"
  | "CampaignDonation__NoDonationFound"
  | "CampaignDonation__InsufficientDonation"
  | "CampaignDonation__WithdrawNotAllowed"
  | "CampaignDonation__RefundFailed";

export const getRefundErrorMsg = (error: unknown, coinDecimals: number) => {
  const originalError = getGeneralContractError(error);

  if (typeof originalError === "string") return originalError;

  const errorName = originalError.data?.errorName as CustomRefundErrorType;

  if (errorName === "CampaignDonation__InsufficientDonation") {
    const [_, refund, donated] = originalError.data?.args as [
      bigint,
      bigint,
      bigint,
    ];

    return `Your refund of ${formatUnits(refund, coinDecimals)} is above the amount you donated: ${formatUnits(donated, coinDecimals)}.`;
  }

  if (errorName === "CampaignDonation__WithdrawNotAllowed") {
    return (originalError.data?.args?.[0] as string) || "Refund Failed.";
  }

  if (errorName === "CampaignDonation__RefundDeadlineElapsed") {
    return "The refund period for this campaign has expired. Refunds are no longer available.";
  }

  if (errorName === "CampaignDonation__NoDonationFound") {
    return "No donation record found for this campaign.";
  }

  if (errorName === "Campaign__CoinNotSupported") {
    return "The selected coin is not supported.";
  }

  if (errorName === "CampaignDonation__CampaignAlreadyClaimed") {
    return "This campaign has already been claimed.";
  }

  if (errorName === "CampaignDonation__RefundFailed") {
    return "Refund processing failed due to an unexpected error. Please try again later or contact support";
  }

  return "Refund failed. An unknown contract error occurred. Contact support if issue persist.";
};

type CustomWithdrawErrorType =
  | "CampaignDonation__CampaignAlreadyClaimed"
  | "CampaignDonation__NotCampaignOwner"
  | "CampaignDonation__WithdrawalFailed"
  | "CampaignDonation__WithdrawNotAllowed";

export const getWithdrawErrMsg = (error: unknown) => {
  const originalError = getGeneralContractError(error);

  if (typeof originalError === "string") return originalError;

  const errorName = originalError.data?.errorName as CustomWithdrawErrorType;
  const defaultMsg = "Withdraw Failed. Try again later or contact support.";

  if (errorName === "CampaignDonation__CampaignAlreadyClaimed") {
    return "This campaign has already been claimed.";
  }

  if (errorName === "CampaignDonation__NotCampaignOwner") {
    return "This campaign does not belong to the current address.";
  }

  if (errorName === "CampaignDonation__WithdrawalFailed") {
    return defaultMsg;
  }

  if (errorName === "CampaignDonation__WithdrawNotAllowed") {
    return (originalError.data?.args?.[0] as string) || defaultMsg;
  }

  return defaultMsg;
};
