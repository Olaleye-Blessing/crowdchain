import Loading from "@/app/loading";
import { IDonation } from "@/interfaces/donation";
import { copyToClipboard } from "@/utils/copy-to-clipboard";
import { humanReadAbleDate } from "@/utils/dates";
import { formatAddress } from "@/utils/format-address";
import { ReadContractErrorType } from "@wagmi/core";
import { Copy } from "lucide-react";

interface TableProps {
  donations: IDonation[];
  error: ReadContractErrorType | null;
  isFetching: boolean;
}

const formatDate = (date: number) =>
  humanReadAbleDate({
    date,
    options: {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    },
  });

export default function Table({ donations, error, isFetching }: TableProps) {
  return (
    <div className="my-4 flow-root relative">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          {isFetching && (
            <div className="flex items-center justify-center absolute inset-0 bg-[#0003]">
              <Loading />
            </div>
          )}
          <table className="simple_table">
            <thead>
              <tr>
                <th scope="col">Donor</th>
                <th scope="col">Amount</th>
                <th scope="col">Coin</th>
                <th scope="col">Date</th>
              </tr>
            </thead>
            <tbody>
              {error ? (
                <tr>
                  <td colSpan={3}>
                    <span className="flex items-center justify-center w-full text-center pt-4">
                      <span>There is an error</span>
                    </span>
                  </td>
                </tr>
              ) : (
                <>
                  {donations.map((donation) => {
                    return (
                      <tr key={`${donation.timestamp}-${donation.donor}`}>
                        <td>
                          <span className="flex items-center justify-start">
                            <span className="mr-0.5">
                              {formatAddress(donation.donor)}
                            </span>
                            <button
                              className=""
                              type="button"
                              onClick={() => copyToClipboard(donation.donor)}
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                          </span>
                        </td>
                        <td>{donation.amount}</td>
                        <td>{donation.coinUnit}</td>
                        <td>{formatDate(donation.timestamp)}</td>
                      </tr>
                    );
                  })}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
