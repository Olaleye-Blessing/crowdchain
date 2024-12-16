import { Address, formatUnits, parseAbiItem } from "viem";
import { usePublicClient } from "wagmi";
import { useQuery } from "@tanstack/react-query";
import { clientEnv } from "@/constants/env/client";
import { useCrowdchainAddress } from "@/hooks/use-crowdchain-address";
import { IAddress } from "@/interfaces/address";
import { donationEvent } from "@/lib/contracts/crowd-chain/abi";
import {
  ISupportedTokensDetails,
  useSupportedCoins,
} from "@/hooks/use-supported-coins";
import { useState } from "react";
import { IDonation } from "@/interfaces/donation";
import { arrayOfUniqueObjs } from "@/utils/unique-arr-objects";

interface IAddressDonation extends Omit<IDonation, "timestamp" | "campaignId"> {
  campaignTitle: string;
  transactionHash: Address;
  campaignId: string;
}

export const useFetchDonations = ({ account }: { account: IAddress }) => {
  const [page, setPage] = useState(1);
  const [toBlock, setToBlock] = useState<bigint | null>();
  const [donations, setDonations] = useState<IAddressDonation[] | null>(null);
  const [latestBlock, setLatestBlock] = useState<bigint | null>(null);

  const supportedCoins = useSupportedCoins();
  const publicClient = usePublicClient();
  const contractAddress = useCrowdchainAddress();

  const result = useQuery({
    queryKey: ["accounts", account, "donations", page],
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    enabled:
      Boolean(publicClient) &&
      Object.keys(supportedCoins.supportedTokens).length > 0,
    queryFn: async () => {
      try {
        const startBlock = BigInt(
          clientEnv.NEXT_PUBLIC_CROWDCHAIN_DEPLOYMENT_BLOCK,
        );
        const _latestBlock = (await publicClient?.getBlockNumber()) || 0n;

        const totalBlocks = _latestBlock - startBlock;
        const blocksPerPage = Math.ceil(
          Number(totalBlocks) /
            (process.env.NODE_ENV === "production" ? 2000 : 10),
        );

        const fromBlock = startBlock + BigInt((page - 1) * blocksPerPage);
        let toBlock = startBlock + BigInt(page * blocksPerPage);
        if (toBlock > _latestBlock) toBlock = _latestBlock;

        const logs = await publicClient?.getLogs({
          address: contractAddress,
          event: parseAbiItem([donationEvent]),
          args: { donor: account },
          fromBlock,
          toBlock,
        });

        setLatestBlock(_latestBlock);

        if (!logs) return [];

        const supportedTokens = supportedCoins.supportedTokens;

        const parsedDonations: IAddressDonation[] = logs.map((log) => {
          const coin =
            supportedTokens[log.args.coin as keyof ISupportedTokensDetails];

          return {
            campaignId: log.args.campaignId!.toString(),
            campaignTitle: log.args.campaignTitle!,
            amount: +formatUnits(log.args.amount!, coin?.decimal || 18),
            transactionHash: log.transactionHash,
            donor: log.args.donor!,
            coinUnit: coin?.name || "ETH",
            coin: log.args.coin!,
          };
        });

        const _donations = arrayOfUniqueObjs(
          [...(donations || []), ...parsedDonations],
          "transactionHash",
        );
        setDonations(_donations);
        setToBlock(toBlock);

        return _donations;
      } catch (error) {
        console.error("Error fetching donation history:", error);
        throw Error("Error fetching donation history. Try again later.");
      }
    },
  });

  const loadMoreDonations = async () => {
    const _latestBlock = (await publicClient?.getBlockNumber()) || 0n;

    setLatestBlock(_latestBlock);

    if (toBlock === _latestBlock) return;

    setPage((prev) => prev + 1);
  };

  return {
    donations,
    loadMoreDonations,
    error: result.error,
    isFetching: result.isFetching,
    toBlock,
    latestBlock,
  };
};
