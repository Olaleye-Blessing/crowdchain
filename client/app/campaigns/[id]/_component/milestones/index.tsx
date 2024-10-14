"use client";

import { useEffect, useState } from "react";
import { ICampaignDetail } from "@/interfaces/campaign";
import useWalletStore from "@/stores/wallet";
import { sleep } from "@/utils/sleep";
import {
  constructMilestone,
  milestoneStatuses,
} from "../../_utils/construct-milestone";
import { IFetch } from "@/interfaces/fetch";
import { Milestone, MilestoneStatus } from "@/interfaces/milestone";
import FetchedData from "@/components/fetched-data";
import { getMilestoneStatusColor } from "../../_utils/milestone-color";
import WithdrawFunds from "../withdraw-funds";
import { EventFilter } from "ethers";

interface Data {
  lists: Milestone[];
  current: number;
  withdrawable: number;
}

interface MilestonesProps {
  campaignId: ICampaignDetail["id"];
  owned: boolean;
  campaignClaimedFilter: EventFilter;
}

export default function Milestones({
  campaignId,
  owned,
  campaignClaimedFilter,
}: MilestonesProps) {
  const readonlyContract = useWalletStore((state) => state.readonlyContract!);
  const [milestones, setMilestones] = useState<IFetch<Data | null>>({
    loading: true,
    error: null,
    data: null,
  });

  useEffect(() => {
    const fetchCampaignMilestone = async () => {
      process.env.NODE_ENV === "development" && (await sleep(1_000));

      try {
        const [_milestones, current, withdrawable] =
          await readonlyContract.getCampaignMileStones(campaignId);

        setMilestones((prev) => ({
          ...prev,
          data: {
            lists: _milestones.map((milestone: any) =>
              constructMilestone(milestone),
            ),
            current,
            withdrawable,
          },
        }));
      } catch (error) {
        console.log("__ THERE IS AN ERROR __");
        console.log(error);
        setMilestones((prev) => ({ ...prev, error: "There is an error" }));
      } finally {
        setMilestones((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchCampaignMilestone();

    function listenToFundsClaim(
      _campaignId: number,
      _sender: string,
      _amount: string,
    ) {
      fetchCampaignMilestone();
    }

    readonlyContract.on(campaignClaimedFilter, listenToFundsClaim);

    return () => {
      readonlyContract.off(campaignClaimedFilter, listenToFundsClaim);
    };
  }, []);

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
          <FetchedData item={milestones}>
            {milestones.data && (
              <ul className="space-y-4">
                {milestones.data.lists.map((milestone) => {
                  const bgColor = getMilestoneStatusColor(
                    milestone.status,
                  ).background;

                  return (
                    <li
                      key={milestone.id}
                      className={`border p-4 rounded-lg bg-opacity-30 ${bgColor}`}
                    >
                      {owned &&
                        milestones.data?.withdrawable === milestone.id &&
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
            )}
          </FetchedData>
        </div>
      </section>

      {/* Barchart for milestone progress */}
    </>
  );
}
