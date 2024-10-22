/* eslint-disable @next/next/no-img-element */
import {
  Clock,
  Users,
  DollarSign,
  CheckCircle,
  Milestone as MilestoneIcon,
  HandCoins,
  Waypoints,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { Progress } from "../ui/progress";
import { ICampaignDetail } from "@/interfaces/campaign";
import { cn } from "@/lib/utils";
import CampaignInfo from "./campaign-info";
import { milestones } from "@/utils/milestone";

interface CampaignProps {
  campaign: ICampaignDetail;
  className?: string;
}

export default function Campaign({ campaign, className }: CampaignProps) {
  const _progress = (campaign.amountRaised * 100) / campaign.goal;

  return (
    <li className={cn("max-w-[23.4375rem]", className)}>
      <Card className="h-full flex flex-col">
        <figure className="w-full h-36 rounded-lg rounded-b-none overflow-hidden block items-center justify-center sm:h-64">
          <img
            src={campaign.coverImage}
            alt={campaign.title}
            className="object-cover rounded-lg rounded-b-none w-full h-full"
          />
        </figure>
        <CardHeader className="p-3">
          <CardTitle>{campaign.title}</CardTitle>
          <CardDescription className="!-mt-1">
            {campaign.description.slice(0, 40)}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <div>
            <Progress
              value={_progress}
              className="w-full h-2 border-primary border"
            />
            <div className="flex justify-between text-muted-foreground font-bold text-sm sm:text-base">
              <span className="font-medium">{campaign.amountRaised} ETH</span>
              <span className="font-medium">{campaign.goal} ETH</span>
            </div>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-4 text-sm sm:text-base">
            <CampaignInfo
              Icon={Clock}
              iconClassName="text-blue-500"
              title="Deadline"
              body={new Date(campaign.deadline * 1000).toLocaleDateString()}
            />
            <CampaignInfo
              Icon={Users}
              iconClassName="text-green-500"
              title="Total Donors"
              body={campaign.totalDonors}
            />
            <CampaignInfo
              Icon={DollarSign}
              iconClassName="text-yellow-500"
              title="Refund Deadline"
              body={new Date(
                campaign.refundDeadline * 1000,
              ).toLocaleDateString()}
            />
            <CampaignInfo
              Icon={CheckCircle}
              iconClassName="text-purple-500"
              title="Claimed"
              body={campaign.claimed ? "Yes" : "No"}
            />
            {Boolean(campaign.totalMilestones) && (
              <>
                <CampaignInfo
                  Icon={MilestoneIcon}
                  iconClassName="text-primary"
                  title="Milestones"
                  body={campaign.totalMilestones}
                />
                <CampaignInfo
                  Icon={Waypoints}
                  iconClassName="text-yellow-500"
                  title="Current milestone"
                  body={`${milestones[campaign.currentMilestone as keyof typeof milestones]}`}
                />
                <CampaignInfo
                  Icon={HandCoins}
                  iconClassName="text-pink-800"
                  title="Withdrawable milestone"
                  body={`${milestones[campaign.nextWithdrawableMilestone as keyof typeof milestones]}`}
                />
              </>
            )}
          </div>
        </CardContent>
        <CardFooter className="p-3 flex flex-col mt-auto">
          <p className="mb-2 font-semibold">
            <span>Owner: </span>
            <Link
              href={`/accounts/${campaign.owner}`}
              className="address__long"
            >
              {campaign.owner}
            </Link>
          </p>
          <Link
            href={`/campaigns/${campaign.id}`}
            className={buttonVariants({ className: "w-full block" })}
          >
            View Campaign
          </Link>
        </CardFooter>
      </Card>
    </li>
  );
}
