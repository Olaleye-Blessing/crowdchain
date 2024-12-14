import { getGeneralContractError } from "@/utils/contract-error";

type CustomPostUpdateErrorType = "CampaignUpdates__IvalidData";

export const postErrMsg = (error: unknown) => {
  const originalError = getGeneralContractError(error);

  if (typeof originalError === "string") return originalError;

  const errorName = originalError.data?.errorName as CustomPostUpdateErrorType;

  const defaultMsg =
    "There is an error posting your update. Try again later or contact support if error perist";

  if (errorName === "CampaignUpdates__IvalidData") {
    return (originalError.data?.args?.[0] as string) || defaultMsg;
  }

  return defaultMsg;
};
