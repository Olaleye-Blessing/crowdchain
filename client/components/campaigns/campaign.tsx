/* eslint-disable @next/next/no-img-element */
import { Clock, Users, DollarSign, CheckCircle } from "lucide-react";
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

export default function Campaign({ campaign }: { campaign: ICampaignDetail }) {
  const _progress = (campaign.amountRaised * 100) / campaign.goal;

  return (
    <li className="max-w-[23.4375rem]">
      <Card>
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
        </CardContent>
        <CardFooter className="p-3 flex flex-col">
          {/* <p>{campaign.owner}</p> */}
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
