"use client";
/* eslint-disable @next/next/no-img-element */

import { Clock, Users, DollarSign, CheckCircle, User } from "lucide-react";
import CampaignProgrees from "./progress";
import DonateSystem, { type DonateSystemProps } from "./donate-system";
import WithdrawFunds from "./withdraw-funds";
import Link from "next/link";
import Milestones from "./milestones";
import { useAccount } from "wagmi";
import Info from "./info";

const currentTime = Date.now() / 1000;

interface DetailsProps extends DonateSystemProps {}

export default function Details({ campaign }: DetailsProps) {
  const { address } = useAccount();

  return (
    <section className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="lg:flex lg:space-x-8">
        <div className="lg:w-2/3">
          <div className="relative">
            <figure className="w-full h-96 rounded-lg mb-6 overflow-hidden flex items-center justify-center sm:h-64">
              <img
                src={campaign.coverImage}
                alt={campaign.title}
                className="object-cover rounded-lg w-full h-96"
              />
            </figure>
            <div className="absolute inset-0 bg-[#0003] rounded-lg">
              <div className="p-4 h-full flex flex-col justify-end">
                <h1 className="text-2xl break-all font-bold mb-2 text-white sm:text-3xl">
                  {campaign.title}
                </h1>
                <p className="flex items-center justify-start">
                  <span className="">
                    <User className="w-6 h-6" />
                  </span>
                  <Link
                    href={`/accounts/${campaign.owner}`}
                    className="address__long block font-mono"
                  >
                    {campaign.owner}
                  </Link>
                </p>
                {address === campaign.owner &&
                  campaign.amountRaised > campaign.goal &&
                  !campaign.claimed &&
                  currentTime > campaign.refundDeadline &&
                  campaign.totalMilestones === 0 && (
                    <WithdrawFunds
                      id={campaign.id}
                      buttonProps={{ className: "mt-4 max-w-max ml-auto" }}
                    />
                  )}
              </div>
            </div>
          </div>
          <p className="mt-4">{campaign.summary}</p>

          <CampaignProgrees
            amountRaised={campaign.amountRaised}
            goal={campaign.goal}
          />

          <div className="grid grid-cols-2 gap-4 text-sm sm:text-base">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-blue-500 flex-shrink-0" />
              <div>
                <p className="font-medium">Deadline</p>
                <p>{new Date(campaign.deadline * 1000).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-green-500 flex-shrink-0" />
              <div>
                <p className="font-medium">Total Donors</p>
                <p>{campaign.totalDonors}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-yellow-500 flex-shrink-0" />
              <div>
                <p className="font-medium">Refund Deadline</p>
                <p>
                  {new Date(
                    campaign.refundDeadline * 1000,
                  ).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0" />
              <div>
                <p className="font-medium">Claimed</p>
                <p>{campaign.claimed ? "Yes" : "No"}</p>
              </div>
            </div>
          </div>
          <Info campaign={campaign} />
        </div>

        <DonateSystem campaign={campaign} />
      </div>
    </section>
  );
}
