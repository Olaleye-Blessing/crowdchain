/* eslint-disable @next/next/no-img-element */
import {
  Clock,
  Users,
  CheckCircle,
  Milestone as MilestoneIcon,
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

interface CampaignProps {
  campaign: ICampaignDetail;
  className?: string;
  detailClassName?: string;
}

export default function Campaign({
  campaign,
  className,
  detailClassName,
}: CampaignProps) {
  const _progress = (campaign.amountRaised * 100) / campaign.goal;

  return (
    <li className={cn("group max-w-[23.4375rem] lg:h-[34rem]", className)}>
      <Card className="h-full flex flex-col relative overflow-hidden">
        <figure className="w-full h-36 rounded-lg rounded-b-none overflow-hidden block items-center justify-center flex-shrink-0 sm:h-64">
          <img
            src={campaign.coverImage}
            alt={campaign.title}
            className="object-cover rounded-lg rounded-b-none w-full h-full"
          />
        </figure>
        <CardHeader className="p-3">
          <CardTitle>{campaign.title}</CardTitle>
          <CardDescription className="!mt-1 h-24 overflow-y-auto">
            {campaign.summary}
          </CardDescription>
        </CardHeader>
        <div
          className={cn(
            "flex flex-col h-full lg:absolute lg:top-[27rem] lg:group-hover:top-64 lg:pt-4 lg:left-0 lg:right-0 lg:group-hover:rounded-lg lg:bg-white lg:more__shadow lg:transition-all lg:duration-300 lg:h-auto",
            detailClassName,
          )}
        >
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
                </>
              )}
            </div>
          </CardContent>
          <CardFooter className="p-3 flex flex-col mt-auto !items-stretch">
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
        </div>
      </Card>
    </li>
  );
}
