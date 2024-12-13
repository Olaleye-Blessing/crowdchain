import { Address, erc20Abi, parseEther, parseUnits } from "viem";
import { Config } from "wagmi";
import { WriteContractMutateAsync } from "wagmi/query";
import { ETH_ADDRESS } from "@/constants/contracts";
import { wagmiAbi } from "@/lib/contracts/crowd-chain/abi";
import { waitForTransactionReceipt } from "@wagmi/core";
import { toast } from "@/hooks/use-toast";

export const approveAllowance = async ({
  tokenDecimal,
  writeContractAsync,
  contractAddress,
  token,
  amount,
  config,
}: {
  tokenDecimal: number;
  writeContractAsync: WriteContractMutateAsync<Config, unknown>;
  contractAddress: Address;
  token: Address;
  amount: string;
  config: Config;
}) => {
  toast({ title: "Approving allowance" });

  const approvalTxHash = await writeContractAsync({
    abi: erc20Abi,
    address: token,
    functionName: "approve",
    args: [contractAddress, parseUnits(amount, tokenDecimal)],
  });

  toast({ title: "Confirming tx hash" });

  await waitForTransactionReceipt(config, {
    hash: approvalTxHash,
    confirmations: 1,
  });
};

export const donate = async ({
  tokenDecimal,
  writeContractAsync,
  contractAddress,
  token,
  campaignId,
  amount,
}: {
  tokenDecimal: number;
  writeContractAsync: WriteContractMutateAsync<Config, unknown>;
  contractAddress: Address;
  token: Address;
  campaignId: number;
  amount: string;
}) => {
  const txHash = await writeContractAsync({
    abi: wagmiAbi,
    address: contractAddress,
    functionName: token === ETH_ADDRESS ? "donateETH" : "donateToken",
    args:
      token === ETH_ADDRESS
        ? [BigInt(campaignId)]
        : [BigInt(campaignId), parseUnits(amount, tokenDecimal), token],
    value: (token === ETH_ADDRESS && parseEther(amount)) || undefined,
  });

  return txHash;
};

export const refund = async ({
  tokenDecimal,
  writeContractAsync,
  contractAddress,
  token,
  campaignId,
  amount,
}: {
  tokenDecimal: number;
  writeContractAsync: WriteContractMutateAsync<Config, unknown>;
  contractAddress: Address;
  token: Address;
  campaignId: number;
  amount: string;
}) => {
  const txHash = await writeContractAsync({
    abi: wagmiAbi,
    address: contractAddress,
    functionName: token === ETH_ADDRESS ? "refundETH" : "refundToken",
    args:
      token === ETH_ADDRESS
        ? [BigInt(campaignId), parseEther(amount)]
        : [BigInt(campaignId), parseUnits(amount, tokenDecimal), token],
  });

  return txHash;
};
