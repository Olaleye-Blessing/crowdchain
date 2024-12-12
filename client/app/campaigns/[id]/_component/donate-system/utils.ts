import { Address, parseEther, parseUnits } from "viem";
import { Config } from "wagmi";
import { WriteContractMutateAsync } from "wagmi/query";
import { ETH_ADDRESS } from "@/constants/contracts";
import { wagmiAbi } from "@/lib/contracts/crowd-chain/abi";

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
  console.log({
    tokenDecimal,
    amountSent: parseUnits(amount, tokenDecimal),
    token,
  });

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
