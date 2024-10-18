"use client";

import { ICampaignDetail } from "@/interfaces/campaign";
import {
  constructMilestone,
  milestoneStatuses,
} from "../../_utils/construct-milestone";
import { MilestoneStatus } from "@/interfaces/milestone";
import { getMilestoneStatusColor } from "../../_utils/milestone-color";
import WithdrawFunds from "../withdraw-funds";
import { useReadContract, useWatchContractEvent } from "wagmi";
import { wagmiAbi } from "@/lib/contracts/crowd-chain/abi";
import Loading from "@/app/loading";
import { useCrowdchainAddress } from "@/hooks/use-crowdchain-address";

interface MilestonesProps {
  campaignId: ICampaignDetail["id"];
  owned: boolean;
}

export default function Milestones({ campaignId, owned }: MilestonesProps) {
  const { data, isFetching, error, refetch } = useReadContract({
    address: useCrowdchainAddress(),
    abi: wagmiAbi,
    functionName: "getCampaignMileStones",
    args: [BigInt(campaignId)],
  });

  const milestones = data?.[0].map((milestone) =>
    constructMilestone(milestone),
  );
  const withdrawable = data?.[2];

  useWatchContractEvent({
    address: useCrowdchainAddress(),
    abi: wagmiAbi,
    eventName: "NewDonation",
    onLogs(logs) {
      const [{ args }] = logs;
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

  useWatchContractEvent({
    address: useCrowdchainAddress(),
    abi: wagmiAbi,
    eventName: "CampaignFundWithdrawn",
    onLogs() {
      refetch();
    },
  });

  return (
    <>
      <section className="mt-2">
        <header className="mb-4">
          <h2>Milestones</h2>
          <div className="-mt-2 flex items-center justify-start">
            <p className="mr-2">Statuses: </p>
            <ul className="inline-flex items-center justify-start">
              {Object.values(milestoneStatuses).map((status, index) => (
                <li key={status} className="text-xs mr-2 mt-[0.1rem]">
                  <span
                    className={`capitalize inline-block mr-2 ${getMilestoneStatusColor(status).foreground}`}
                  >
                    {status.toLowerCase()}
                  </span>
                  {index !== 4 && <span>-&gt;</span>}
                </li>
              ))}
            </ul>
          </div>
        </header>
        <div>
          {isFetching ? (
            <Loading />
          ) : error ? (
            <p>Error</p>
          ) : milestones ? (
            <ul className="space-y-4">
              {milestones.map((milestone) => {
                const bgColor = getMilestoneStatusColor(
                  milestone.status,
                ).background;

                return (
                  <li
                    key={milestone.id}
                    className={`border p-4 rounded-lg bg-opacity-30 ${bgColor}`}
                  >
                    {owned &&
                      withdrawable === milestone.id &&
                      milestone.status === MilestoneStatus.Completed && (
                        <WithdrawFunds
                          id={campaignId}
                          buttonProps={{
                            variant: "outline",
                            className: "!px-2 !py-1",
                          }}
                        />
                      )}
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold">
                        Milestone {milestone.id + 1}
                      </h3>
                      <p
                        className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs transition-colors border-transparent text-primary-foreground shadow capitalize ${bgColor}`}
                      >
                        {milestone.status.toLowerCase()}
                      </p>
                    </div>
                    <p className="text-gray-600 mb-2 max-h-56 overflow-auto">
                      {milestone.description}
                    </p>
                    <div className="flex justify-between text-sm">
                      <p className="flex items-center justify-start">
                        <span className="text-lg font-semibold mr-1">
                          Target:{" "}
                        </span>
                        <span className="text-sm mt-[0.1rem]">
                          {milestone.targetAmount} ETH
                        </span>
                      </p>
                      <p className="flex items-center justify-start">
                        <span className="text-lg font-semibold mr-1">
                          Deadline:{" "}
                        </span>
                        <span className="text-sm mt-[0.1rem]">
                          {new Date(
                            milestone.deadline * 1000,
                          ).toLocaleDateString()}
                        </span>
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : null}
        </div>
      </section>

      {/* Barchart for milestone progress */}
    </>
  );
}
