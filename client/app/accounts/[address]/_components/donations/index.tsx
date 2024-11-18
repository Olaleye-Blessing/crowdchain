import { IAddress } from "@/interfaces/address";
import { useFetchDonations } from "./use-fetch-donations";
import Loading from "@/app/loading";
import Link from "next/link";
import { formatEther, parseEther } from "viem";
import { formatAddress } from "@/utils/format-address";

export default function Donations({ account }: { account: IAddress }) {
  const { data: donations, error } = useFetchDonations({ account });
  const totalDonations = donations?.length;

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
                    Tx hash
                  </th>
                </tr>
              </thead>
              <tbody>
                {donations ? (
                  <>
                    {totalDonations === 0 ? (
                      <tr>
                        <td className="text-center" colSpan={3}>
                          No donations yet
                        </td>
                      </tr>
                    ) : (
                      <>
                        {donations.map((donation) => {
                          const formattedTxHash = formatAddress(
                            donation.transactionHash,
                          );

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
                              <td>
                                {donation.amount
                                  ? formatEther(donation.amount)
                                  : "-"}
                              </td>
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
                    )}
                  </>
                ) : error ? (
                  <tr>
                    <td colSpan={3}>
                      <span className="flex items-center justify-center w-full text-center pt-4">
                        <span>There is an error</span>
                      </span>
                    </td>
                  </tr>
                ) : (
                  <tr>
                    <td colSpan={3}>
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
    </section>
  );
}
