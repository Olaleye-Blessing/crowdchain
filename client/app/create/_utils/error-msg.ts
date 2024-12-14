import { getGeneralContractError } from "@/utils/contract-error";

type CustomCreateErrorType = "Campaign__CampaignCreationFailed";

export const getCreateErrMsg = (error: unknown) => {
  const originalError = getGeneralContractError(error);

  if (typeof originalError === "string") return originalError;

  const errorName = originalError.data?.errorName as CustomCreateErrorType;
  const defaultErrMsg =
    "Unable to create campaign. Try agan later or contact support";

  if (errorName === "Campaign__CampaignCreationFailed") {
    return (originalError.data?.args?.[0] as string) || defaultErrMsg;
  }

  return defaultErrMsg;
};
