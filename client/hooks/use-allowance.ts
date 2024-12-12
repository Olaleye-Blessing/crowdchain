import { Address, erc20Abi } from "viem";
import { useAccount, useReadContract } from "wagmi";
import { useCrowdchainAddress } from "./use-crowdchain-address";

type IUseApprovalArgs = {
  token: Address | undefined;
  enabled?: boolean;
  unique?: boolean;
};

export const useAllowance = ({
  token,
  enabled = true,
  unique,
}: IUseApprovalArgs) => {
  const crowdchainAddress = useCrowdchainAddress();
  const account = useAccount();

  const result = useReadContract({
    address: token,
    abi: erc20Abi,
    functionName: "allowance",
    args: [account.address!, crowdchainAddress],
    query: { enabled: Boolean(token) && enabled, staleTime: 0, gcTime: 0 },
    scopeKey: unique ? new Date().toString() : undefined,
  });

  return result;
};
