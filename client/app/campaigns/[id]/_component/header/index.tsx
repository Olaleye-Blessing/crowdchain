/* eslint-disable @next/next/no-img-element */

import { Clock, Users, DollarSign, CheckCircle, User } from "lucide-react";
import { ICampaignDetail } from "@/interfaces/campaign";
import { useAccount } from "wagmi";
import Link from "next/link";
import WithdrawFunds from "../withdraw-funds";
import PostUpdates from "../info/updates/post-update";
import CampaignProgress from "../progress";

export interface HeaderProps {
  campaign: ICampaignDetail;
}

const currentTime = Date.now() / 1000;

export default function Header({ campaign }: HeaderProps) {
  const { address } = useAccount();

  return (
    <>
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
            {address === campaign.owner && (
              <div className="mt-2">
                {campaign.amountRaised > campaign.goal &&
                  !campaign.claimed &&
                  currentTime > campaign.refundDeadline &&
                  campaign.totalMilestones === 0 && (
                    <WithdrawFunds
                      id={campaign.id}
                      buttonProps={{ className: "mt-4 max-w-max ml-auto" }}
                    />
                  )}
                <PostUpdates className="mt-2" campaignId={campaign.id} />
              </div>
            )}
          </div>
        </div>
      </div>
      <p className="mt-4">{campaign.summary}</p>

      <CampaignProgress
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
              {new Date(campaign.refundDeadline * 1000).toLocaleDateString()}
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
    </>
  );
}
