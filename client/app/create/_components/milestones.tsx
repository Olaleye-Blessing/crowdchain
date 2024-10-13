import { nanoid } from "nanoid";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { ICampaignForm } from "../_interfaces/form";
import Milestone, { type MilestoneProps } from "./milestone";
import MilestonesRules from "./milestone-rules";

interface MilestonesProps {
  form: UseFormReturn<ICampaignForm, any, undefined>;
}

const oneDay = 1 * 24 * 60 * 60 * 1000;

export default function Milestones({ form }: MilestonesProps) {
  const milestones = form.watch("milestones");
  const goal = form.watch("goal");
  const deadline = form.watch("deadline");

  const addMilestone = () => {
    const milestones = form.getValues("milestones");

    if (milestones.length >= 4) return;

    form.setValue("milestones", [
      ...milestones,
      {
        id: nanoid(),
        targetAmount: 1,
        deadline: new Date(Date.now() + oneDay),
        description: "",
      },
    ]);
  };

  const removeMilestone: MilestoneProps["removeMilestone"] = (id) => {
    form.setValue(
      "milestones",
      form.getValues("milestones").filter((milestone) => milestone.id !== id),
    );
  };

  const updateMilestone: MilestoneProps["updateMilestone"] = (
    id,
    field,
    value,
  ) => {
    const milestones = form.getValues("milestones");
    const oldMilestone = milestones.find((mile) => mile.id === id);
    // @ts-ignore
    if (oldMilestone) oldMilestone[field] = value;

    form.setValue("milestones", milestones);
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Milestones (Optional)</CardTitle>
        <CardDescription className="!mt-[-0.4rem]">
          Maximum of 4 milestones
        </CardDescription>
      </CardHeader>
      <MilestonesRules
        milestones={milestones}
        goal={goal}
        deadline={deadline}
      />
      <CardContent className="space-y-4">
        {milestones.map((milestone) => (
          <Milestone
            key={milestone.id}
            updateMilestone={updateMilestone}
            removeMilestone={removeMilestone}
            milestone={milestone}
            deadline={deadline}
          />
        ))}
        <Button
          type="button"
          onClick={addMilestone}
          variant="outline"
          disabled={milestones.length >= 4}
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Add Milestone
        </Button>
      </CardContent>
    </Card>
  );
}
