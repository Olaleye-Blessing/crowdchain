import { Address } from "viem";
import { QueryObserverResult, UseQueryOptions } from "@tanstack/react-query";
import { useCrowdchainRequest } from "./use-crowdchain-request";

export type ISupportedTokensDetails = {
  [key: Address]: {
    name: string;
    decimal: number;
  };
};

export type ISupportedCoins = {
  supportedTokens: ISupportedTokensDetails;
  isFetching: boolean;
  error: Error | null;
  refetch: () => Promise<QueryObserverResult<ISupportedTokensDetails, Error>>;
};

export const useSupportedCoins = (
  options?: Omit<UseQueryOptions<ISupportedTokensDetails>, "queryKey">,
): ISupportedCoins => {
  const {
    data: supportedTokens = {},
    isFetching,
    error,
    refetch: _refetch,
  } = useCrowdchainRequest<ISupportedTokensDetails>({
    url: `/crowdchain/coins`,
    options: {
      ...options,
      queryKey: ["list-of-supported-coins"],
    },
  });

  const refetch = () => _refetch();

  return { supportedTokens, isFetching, error, refetch };
};
