import { Progress } from "@/components/ui/progress";
import { ICampaignDetail } from "@/interfaces/campaign";

interface CampaignProgreeProps
  extends Pick<ICampaignDetail, "amountRaised" | "goal"> {}

export default function CampaignProgree({
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
        <span className="font-medium">{amountRaised} USD</span>
        <span className="font-medium">{goal} USD</span>
      </div>
    </div>
  );
}
