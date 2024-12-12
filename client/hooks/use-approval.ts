import { Address, erc20Abi, parseUnits } from "viem";
import {
  useSimulateContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { useCrowdchainAddress } from "./use-crowdchain-address";

type IUseApprovalArgs = {
  token: Address | undefined;
  amount: string;
  enabled: boolean;
};

export const useApproval = ({ token, amount, enabled }: IUseApprovalArgs) => {
  const crowdchainAddress = useCrowdchainAddress();

  const {
    data: writeContractResult,
    writeContractAsync: writeContract,
    error,
  } = useWriteContract();

  const approvalResult = useWaitForTransactionReceipt({
    hash: writeContractResult,
    confirmations: 1,
  });

  const approve = async (token: Address, amount: bigint) => {
    if (!token) return;

    await writeContract({
      abi: erc20Abi,
      address: token,
      functionName: "approve",
      args: [crowdchainAddress, amount],
    });
  };

  return { approvalResult, approve };
};
