import Loading from "@/app/loading";
import { useCrowdchainAddress } from "@/hooks/use-crowdchain-address";
import { ISupportedCoins } from "@/hooks/use-supported-coins";
import { wagmiAbi } from "@/lib/contracts/crowd-chain/abi";
import { formatUnits } from "viem";
import { useReadContract, useWatchContractEvent } from "wagmi";

interface DonationsPerCoinProps {
  campaignId: number;
  supportedCoins: ISupportedCoins;
}

export default function DonationsPerCoin({
  campaignId,
  supportedCoins,
}: DonationsPerCoinProps) {
  const { supportedTokens } = supportedCoins;

  const { data, isFetching, error, refetch } = useReadContract({
    address: useCrowdchainAddress(),
    abi: wagmiAbi,
    functionName: "getAmountRaisedPerCoin",
    args: [BigInt(campaignId)],
  });

  const [_coins, _amounts] = data || [];

  const _donations: { coin: string; amount: number }[] = [];

  _coins?.reduce((prev, currentCoin, index) => {
    const amount = _amounts?.[index];

    if (!amount) return prev;

    const coin = supportedTokens[currentCoin];

    console.log({ coin, currentCoin });

    _donations.push({
      coin: coin?.name || "-",
      amount: +formatUnits(amount, coin?.decimal || 18),
    });

    return _donations;
  }, _donations);

  useWatchContractEvent({
    address: useCrowdchainAddress(),
    abi: wagmiAbi,
    eventName: "NewDonation",
    onLogs() {
      refetch();
    },
  });

  useWatchContractEvent({
    address: useCrowdchainAddress(),
    abi: wagmiAbi,
    eventName: "DonationRefunded",
    onLogs() {
      refetch();
    },
  });

  return (
    <section className="border text-card-foreground shadow bg-card p-4 pt-3 rounded-lg">
      <header>
        <h2>Donation Per Coin</h2>
      </header>
      {data ? (
        <>
          {_donations.length === 0 ? (
            <p>No donations yet</p>
          ) : (
            <ul>
              {_donations.map((don) => (
                <li
                  key={don.coin}
                  className="flex items-center justify-between mb-2 last:mb-0"
                >
                  <p>{don.coin}</p>
                  <p className="font-semibold">{don.amount}</p>
                </li>
              ))}
            </ul>
          )}
        </>
      ) : error ? (
        <p className="text-center">There is an error</p>
      ) : isFetching ? (
        <Loading />
      ) : null}
    </section>
  );
}
