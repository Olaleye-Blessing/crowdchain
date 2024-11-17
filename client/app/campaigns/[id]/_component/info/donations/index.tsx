"use client";

import Loading from "@/app/loading";
import { useCrowdchainAddress } from "@/hooks/use-crowdchain-address";
import { ICampaignDetail } from "@/interfaces/campaign";
import { IContributionSystem } from "@/interfaces/contribution-system";
import { wagmiAbi } from "@/lib/contracts/crowd-chain/abi";
import { formatAddress } from "@/utils/format-address";
import { Copy } from "lucide-react";
import { formatEther } from "viem";
import { useReadContract } from "wagmi";

export default function Donations({ campaign }: { campaign: ICampaignDetail }) {
  const { data, isFetching, error, refetch } = useReadContract({
    abi: wagmiAbi,
    address: useCrowdchainAddress(),
    functionName: "getCampaignDonors",
    args: [BigInt(campaign.id)],
  });

  const [_donors, _contributions] = data || [];

  const _contributionSystem = _donors?.reduce<IContributionSystem>(
    (db, current, index) => {
      db[current] = +formatEther(_contributions![index]);

      return db;
    },
    {} as IContributionSystem,
  );

  const donorsList = _contributionSystem && Object.entries(_contributionSystem);

  return (
    <div className="my-4 flow-root">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <table className="simple_table">
            <thead>
              <tr>
                <th scope="col">Donor</th>
                <th scope="col">Amount</th>
                <th scope="col">USD Value</th>
              </tr>
            </thead>
            <tbody>
              {data ? (
                <>
                  {donorsList?.map((donor) => {
                    const [account, amount] = donor;

                    return (
                      <tr key={account}>
                        <td>
                          <span className="flex items-center justify-start">
                            <span className="mr-0.5">
                              {formatAddress(account)}
                            </span>
                            <button className="">
                              <Copy className="w-4 h-4" />
                            </button>
                          </span>
                        </td>
                        <td>{amount}</td>
                        <td>3,000</td>
                      </tr>
                    );
                  })}
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
  );
}
