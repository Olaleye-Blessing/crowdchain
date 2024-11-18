import { parseAbiItem } from "viem";
import { usePublicClient } from "wagmi";
import { useQuery } from "@tanstack/react-query";
import { clientEnv } from "@/constants/env/client";
import { useCrowdchainAddress } from "@/hooks/use-crowdchain-address";
import { IAddress } from "@/interfaces/address";
import { donationEvent } from "@/lib/contracts/crowd-chain/abi";

interface IDonation {
  donor: string;
  campaignId: bigint;
  amount: bigint;
  campaignTitle: string;
  blockNumber: number;
  transactionHash: string;
}

export const useFetchDonations = ({ account }: { account: IAddress }) => {
  const publicClient = usePublicClient();
  const contractAddress = useCrowdchainAddress();

  const result = useQuery({
    queryKey: ["accounts", account, "donations"],
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    enabled: Boolean(publicClient),
    queryFn: async () => {
      try {
        const logs = await publicClient?.getLogs({
          address: contractAddress,
          event: parseAbiItem([donationEvent]),
          args: { donor: account },
          fromBlock: BigInt(clientEnv.NEXT_PUBLIC_CROWDCHAIN_DEPLOYMENT_BLOCK),
          toBlock: "latest",
        });

        if (!logs) return [];

        // Parse logs into more readable format
        const parsedDonations = logs.map((log) => {
          return {
            campaignId: log.args.campaignId,
            campaignTitle: log.args.campaignTitle,
            amount: log.args.amount,
            transactionHash: log.transactionHash,
          };
        });

        return parsedDonations;
      } catch (error) {
        throw Error("Error fetching donation history. Try again later.");
      }
    },
  });

  return result;
};
