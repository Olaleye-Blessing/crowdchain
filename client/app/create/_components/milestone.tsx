import { Input } from "@/components/ui/input";
import { ICampaignForm } from "../_interfaces/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MinusCircle } from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";

export interface MilestoneProps {
  milestone: ICampaignForm["milestones"][number];
  deadline: ICampaignForm["deadline"];
  updateMilestone: (
    id: string,
    field: keyof ICampaignForm["milestones"][number],
    value: any,
  ) => void;
  removeMilestone: (id: string) => void;
}
export default function Milestone({
  milestone,
  deadline,
  updateMilestone,
  removeMilestone,
}: MilestoneProps) {
  return (
    <div className="space-y-2 p-4 border rounded-md even:bg-gray-100 even:bg-opacity-70">
      <div>
        <label
          htmlFor={`milestone-target-${milestone.id}`}
          className="block text-sm font-medium text-gray-700"
        >
          Target Amount
        </label>
        <Input
          id={`milestone-target-${milestone.id}`}
          type="number"
          value={milestone.targetAmount}
          onChange={(e) => {
            updateMilestone(milestone.id, "targetAmount", +e.target.value);
          }}
          className="mt-1"
        />
      </div>
      <div>
        <label
          htmlFor={`milestone-deadline-${milestone.id}`}
          className="block text-sm font-medium text-gray-700"
        >
          Deadline
        </label>
        <DatePicker
          triggerProps={{ className: "w-full" }}
          calendar={{
            selected: milestone.deadline,
            mode: "single",
            disabled: !deadline,
            // fromDate: deadline
            //   ? new Date(new Date(deadline).getTime() + 6 * oneDay)
            //   : undefined,
            onSelect: (date) => {
              updateMilestone(milestone.id, "deadline", date);
              // form.setValue("refundDeadline", date);
              // if (!date)
              //   return form.setError("refundDeadline", {
              //     message: "Select a deadline date",
              //   });
              // form.clearErrors("refundDeadline");
            },
          }}
        />
      </div>
      <div>
        <label
          htmlFor={`milestone-description-${milestone.id}`}
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <Textarea
          id={`milestone-description-${milestone.id}`}
          value={milestone.description}
          onChange={(e) => {
            updateMilestone(milestone.id, "description", e.target.value);
          }}
          className="mt-1"
        />
      </div>
      <Button
        type="button"
        onClick={() => removeMilestone(milestone.id)}
        variant="destructive"
        className="mt-2"
      >
        <MinusCircle className="mr-2 h-4 w-4" /> Remove Milestone
      </Button>
    </div>
  );
}
