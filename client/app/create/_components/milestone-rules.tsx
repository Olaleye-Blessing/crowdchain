import { ICampaignForm } from "../_interfaces/form";
import { validateMilestoneRules } from "../_utils/milestone-rules";

interface MilestoneRulesProps {
  milestones: ICampaignForm["milestones"];
  goal: ICampaignForm["goal"];
  deadline: ICampaignForm["deadline"];
}

export default function MilestonesRules({
  milestones,
  goal,
  deadline,
}: MilestoneRulesProps) {
  const rules = validateMilestoneRules({ milestones, goal, deadline });

  return (
    <ul
      className={`sticky top-14 left-0 right-0 px-6 -mt-4 flex flex-col space-y-2 bg-background ${milestones.length === 0 ? "h-0 overflow-hidden" : "h-auto mb-4"}`}
    >
      {Object.entries(rules).map(([key, value]) => {
        return (
          <li
            key={key}
            className={`text-sm ${value.valid ? "text-green-800" : "text-red-800"}`}
          >
            <p>{value.description}</p>
          </li>
        );
      })}
    </ul>
  );
}
