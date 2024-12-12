"use client";

import TablePagination from "@/components/table-pagination";
import { useCrowdchainAddress } from "@/hooks/use-crowdchain-address";
import { useSupportedCoins } from "@/hooks/use-supported-coins";
import { ICampaignDetail } from "@/interfaces/campaign";
import { IDonation } from "@/interfaces/donation";
import { wagmiAbi } from "@/lib/contracts/crowd-chain/abi";
import { constructDonation } from "@/utils/construct-donation";
import { useEffect, useState } from "react";
import { formatUnits } from "viem";
import { useReadContract } from "wagmi";
import Table from "./table";

export default function Donations({ campaign }: { campaign: ICampaignDetail }) {
  const supportedCoins = useSupportedCoins();
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(2);
  const [totalDonations, setTotalDonations] = useState<number | null>(null);
  const [donations, setDonations] = useState<IDonation[]>([]);
  const { data, error, isFetching } = useReadContract({
    abi: wagmiAbi,
    address: useCrowdchainAddress(),
    functionName: "getCampaignDonations",
    args: [BigInt(campaign.id), BigInt(page), BigInt(perPage)],
  });

  useEffect(() => {
    setPage(0);
    setTotalDonations(null);
    setDonations([]);
  }, [perPage]);

  useEffect(() => {
    if (isFetching) return;
    if (error) return;

    const [_donations, _totalDonations] = data || [];

    setTotalDonations(+formatUnits(_totalDonations || 0n, 0));

    setDonations(
      (_donations || []).map((d) =>
        constructDonation(d, supportedCoins.supportedTokens || {}),
      ),
    );
  }, [data, isFetching]);

  const onPageChange = (diff: number) => setPage((prev) => prev + diff);

  return (
    <div>
      <Table error={error} donations={donations} isFetching={isFetching} />
      {!!totalDonations && (
        <div>
          {
            <TablePagination
              perPage={perPage}
              totalItems={totalDonations}
              currentPage={page}
              onSelectPerPage={(page) => setPerPage(page)}
              onPageChange={onPageChange}
            />
          }
        </div>
      )}
    </div>
  );
}
