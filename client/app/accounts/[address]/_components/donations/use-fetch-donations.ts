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
import { sleep } from "@/utils/sleep";

interface IAddressDonation extends Omit<IDonation, "timestamp" | "campaignId"> {
  campaignTitle: string;
  transactionHash: Address;
  campaignId: string;
}

const range = BigInt(process.env.NODE_ENV === "production" ? 100 : 50);

export const useFetchDonations = ({ account }: { account: IAddress }) => {
  const [page, setPage] = useState(1);
  const [lastFetchedBlock, setLastFetchedBlock] = useState(
    BigInt(clientEnv.NEXT_PUBLIC_CROWDCHAIN_DEPLOYMENT_BLOCK),
  );
  const [donations, setDonations] = useState<IAddressDonation[] | null>(null);
  const [latestBlock, setLatestBlock] = useState<bigint | null>(null);

  const supportedCoins = useSupportedCoins();
  const publicClient = usePublicClient();
  const contractAddress = useCrowdchainAddress();

  const fetchDonations = async (
    attempt: number,
    fromBlock: bigint,
    _latestBlock: bigint | null,
    _donations: IAddressDonation[] = [],
  ) => {
    if (attempt > 5) {
      setLastFetchedBlock(fromBlock);
      setLatestBlock(_latestBlock);
      const uniqueDonation = arrayOfUniqueObjs(
        [..._donations],
        "transactionHash",
      );

      setDonations((prev) => {
        let newD = [...(prev || []), ...uniqueDonation];
        return newD;
      });

      return uniqueDonation;
    }

    try {
      _latestBlock =
        _latestBlock || (await publicClient?.getBlockNumber()) || fromBlock;

      let toBlock = fromBlock + range;

      if (toBlock > _latestBlock) toBlock = _latestBlock;

      const logs = await publicClient?.getLogs({
        address: contractAddress,
        event: parseAbiItem([donationEvent]),
        args: { donor: account },
        fromBlock,
        toBlock,
      });

      if (!logs) throw new Error("Unknown error! Try again later.");

      if (logs.length > 0) {
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

        _donations.push(...parsedDonations);
      }

      return fetchDonations(attempt + 1, toBlock, _latestBlock, _donations);
    } catch (error) {
      console.log("__error__", error);
      throw new Error((error as any).message || "Try again");
    }
  };

  const result = useQuery({
    queryKey: ["accounts", account, "donations", page],
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    enabled:
      Boolean(publicClient) &&
      Object.keys(supportedCoins.supportedTokens).length > 0,
    queryFn: () => fetchDonations(1, lastFetchedBlock, latestBlock),
  });

  const loadMoreDonations = async () => {
    const _latestBlock =
      (await publicClient?.getBlockNumber()) || lastFetchedBlock;

    setLatestBlock(_latestBlock);

    if (lastFetchedBlock === _latestBlock) return;

    setPage((prev) => prev + 1);
  };

  return {
    donations,
    loadMoreDonations,
    error: result.error,
    isFetching: result.isFetching,
    lastFetchedBlock,
    latestBlock,
  };
};
