"use client";
/* eslint-disable @next/next/no-img-element */

import { Clock, Users, DollarSign, CheckCircle } from "lucide-react";
import CampaignProgrees from "./progress";
import DonateSystem, { type DonateSystemProps } from "./donate-system";
import WithdrawFunds from "./withdraw-funds";
import useWalletStore from "@/stores/wallet";
import Link from "next/link";

const currentTime = Date.now() / 1000;

interface DetailsProps extends DonateSystemProps {}

export default function Details({
  campaign,
  campaignDonorFilter,
  campaignRefundFilter,
}: DetailsProps) {
  const address = useWalletStore((state) => state.address);

  return (
    <section className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="lg:flex lg:space-x-8">
        <div className="lg:w-2/3">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">
              {campaign.title}
            </h1>
            {address === campaign.owner &&
              campaign.amountRaised > campaign.goal &&
              !campaign.claimed &&
              currentTime > campaign.refundDeadline && (
                <WithdrawFunds id={campaign.id} />
              )}
          </div>
          <p className="text-sm text-gray-500 mb-4">
            Campaign ID: {campaign.id}
            <span className="inline-block ml-2">show socials here</span>
          </p>

          <figure className="w-full h-48 rounded-lg mb-6 overflow-hidden flex items-center justify-center sm:h-64">
            <img
              src={campaign.coverImage}
              alt={campaign.title}
              className="object-cover rounded-lg"
            />
          </figure>

          <div className="space-y-6">
            <div>
              <p className="text-xl font-semibold mb-2">Description</p>
              <p className="text-sm max-h-96 overflow-y-auto sm:text-base">
                {campaign.description}
              </p>
            </div>

            <CampaignProgrees
              amountRaised={campaign.amountRaised}
              goal={campaign.goal}
            />

            <div className="grid grid-cols-2 gap-4 text-sm sm:text-base">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-blue-500 flex-shrink-0" />
                <div>
                  <p className="font-medium">Deadline</p>
                  <p>
                    {new Date(campaign.deadline * 1000).toLocaleDateString()}
                  </p>
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

            <p>
              <span className="block text-xl font-semibold mb-2">
                Campaign Owner
              </span>
              <Link
                href={`/accounts/${campaign.owner}`}
                className="block font-mono text-sm break-all text-primary"
              >
                {campaign.owner}
              </Link>
            </p>
          </div>
        </div>

        <DonateSystem
          campaign={campaign}
          campaignDonorFilter={campaignDonorFilter}
          campaignRefundFilter={campaignRefundFilter}
        />
      </div>
    </section>
  );
}
