import { Progress } from "@/components/ui/progress";
import { ICampaignDetail } from "@/interfaces/campaign";
import { formatUsd } from "@/utils/format-USD";

interface CampaignProgreeProps
  extends Pick<ICampaignDetail, "amountRaised" | "goal"> {}

export default function CampaignProgress({
  amountRaised,
  goal,
}: CampaignProgreeProps) {
  const _progress = Math.min((amountRaised * 100) / goal, 100);

  return (
    <div>
      <h3 className="text-xl font-semibold mb-2">Progress</h3>
      <Progress
        value={_progress}
        className="w-full h-4 border-primary border"
      />
      <div className="flex justify-between mt-2 text-sm sm:text-base">
        <span className="font-medium">{formatUsd(amountRaised)}</span>
        <span className="font-medium">{formatUsd(goal)}</span>
      </div>
    </div>
  );
}
