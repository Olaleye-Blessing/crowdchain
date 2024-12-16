import { IAddress } from "@/interfaces/address";
import { useFetchDonations } from "./use-fetch-donations";
import Loading from "@/app/loading";
import Link from "next/link";
import { formatAddress } from "@/utils/format-address";
import { Button } from "@/components/ui/button";
import { formatUnits } from "viem";
import { formatNumber } from "@/utils/format-number";

export default function Donations({ account }: { account: IAddress }) {
  const {
    donations,
    error,
    loadMoreDonations,
    isFetching,
    latestBlock,
    toBlock,
  } = useFetchDonations({ account });

  return (
    <section className="overflow-hidden">
      <div className="flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="simple_table">
              <thead>
                <tr className="[&>*]:!whitespace-normal">
                  <th scope="col" className="w-2/4">
                    Campaign
                  </th>
                  <th scope="col" className="w-1/4">
                    Amount
                  </th>
                  <th scope="col" className="w-1/4">
                    Coin
                  </th>
                  <th scope="col" className="w-1/4">
                    Tx hash
                  </th>
                </tr>
              </thead>
              <tbody>
                {Boolean(
                  !isFetching && !error && donations && donations.length === 0,
                ) && (
                  <tr>
                    <td colSpan={4}>
                      <span className="flex items-center justify-center w-full text-center pt-4">
                        <span>There is no donations.</span>
                      </span>
                    </td>
                  </tr>
                )}
                <>
                  {donations?.map((donation) => {
                    const formattedTxHash = formatAddress(
                      donation.transactionHash,
                    );

                    console.log({ donation });

                    return (
                      <tr
                        key={donation.transactionHash}
                        className="[&>*]:!whitespace-normal"
                      >
                        <td className="">
                          <Link
                            href={`/campaigns/${donation.campaignId}`}
                            className="text-primary"
                          >
                            {donation.campaignTitle}
                          </Link>
                        </td>
                        <td>{donation.amount}</td>
                        <td>{donation.coinUnit}</td>
                        <td>
                          {process.env.NODE_ENV === "production" ? (
                            <Link href={`/`} className="text-primary">
                              {formattedTxHash}
                            </Link>
                          ) : (
                            <span>{formattedTxHash}</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </>
                {error && (
                  <tr>
                    <td colSpan={4}>
                      <span className="flex items-center justify-center w-full text-center pt-4">
                        <span>There is an error</span>
                      </span>
                    </td>
                  </tr>
                )}
                {isFetching && (
                  <tr>
                    <td colSpan={4}>
                      <span className="flex items-center justify-center w-full pt-4">
                        <Loading />
                      </span>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center mt-4">
        <p className="mr-3 text-sm text-muted-foreground">
          <span className="">Current block: </span>
          <span className="font-semibold">
            {toBlock ? formatNumber(+formatUnits(toBlock, 0)) : "-"}
          </span>
        </p>
        <p className="mr-3 text-sm text-muted-foreground">
          <span className="">Lastest block: </span>
          <span className="font-semibold">
            {latestBlock ? formatNumber(+formatUnits(latestBlock, 0)) : "-"}
          </span>
        </p>
      </div>
      {!isFetching && (
        <div className="flex items-center justify-center my-4">
          <Button
            type="button"
            className="w-full max-w-[15rem]"
            onClick={loadMoreDonations}
          >
            Check for more donations
          </Button>
        </div>
      )}
    </section>
  );
}
