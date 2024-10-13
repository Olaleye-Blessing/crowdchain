import { ICampaignForm, IRule, IRuleKey } from "../_interfaces/form";

export const milestonesRules: Record<IRuleKey, IRule> = {
  "last-milestone-target-amount": {
    description: "Last milestone target amount must be equal to campaign goal",
    valid: false,
  },
  "last-milestone-deadline": {
    description:
      "Deadline of last milestone must be less than the campaign deadline",
    valid: false,
  },
  "previous-milestone-target-amount": {
    description:
      "Target amount of previous milestone must be less than the next one",
    valid: false,
  },
  "previous-milestone-deadline": {
    description:
      "Deadline of previous milestone must be less than the next one",
    valid: false,
  },
};

interface ValidateMilestoneRulesProps {
  milestones: ICampaignForm["milestones"];
  goal: ICampaignForm["goal"];
  deadline: ICampaignForm["deadline"];
}

export const validateMilestoneRules = ({
  milestones,
  goal,
  deadline,
}: ValidateMilestoneRulesProps) => {
  const rules = { ...milestonesRules };
  const totalMilestones = milestones.length;

  if (totalMilestones === 0) return rules;

  rules["last-milestone-target-amount"].valid =
    milestones[totalMilestones - 1].targetAmount === +(goal || 0);

  const lastMilestoneDeadline = milestones[totalMilestones - 1].deadline;

  rules["last-milestone-deadline"].valid = Boolean(
    lastMilestoneDeadline &&
      deadline &&
      new Date(
        new Date(lastMilestoneDeadline).setHours(0, 0, 0, 0),
      ).getTime() <=
        new Date(new Date(deadline).setHours(0, 0, 0, 0)).getTime(),
  );

  let skipPreviousMilestoneDeadlineRule = false;
  let previousMilestoneDeadlineError = false;
  let skipPreviousMilestoneTargetAmountRule = false;
  let previousMilestoneTargetAmountError = false;

  for (let index = 0; index < totalMilestones; index++) {
    if (index === totalMilestones - 1) continue;

    if (!skipPreviousMilestoneTargetAmountRule) {
      const _previousMilestoneTargetAmountError =
        milestones[index].targetAmount >= milestones[index + 1].targetAmount;

      if (_previousMilestoneTargetAmountError) {
        previousMilestoneTargetAmountError = true;
        skipPreviousMilestoneTargetAmountRule = true;
      } else {
        previousMilestoneTargetAmountError = false;
      }
    }

    if (!skipPreviousMilestoneDeadlineRule) {
      let _previousMilestoneDeadlineError: boolean;
      const currentDeadline = milestones[index].deadline;
      const nextDeadline = milestones[index + 1].deadline;

      if (!currentDeadline || !nextDeadline) {
        _previousMilestoneDeadlineError = true;
      } else {
        _previousMilestoneDeadlineError =
          new Date(new Date(currentDeadline).setHours(0, 0, 0, 0)).getTime() >=
          new Date(new Date(nextDeadline).setHours(0, 0, 0, 0)).getTime();
      }

      if (_previousMilestoneDeadlineError) {
        previousMilestoneDeadlineError = true;
        skipPreviousMilestoneDeadlineRule = true;
      } else {
        previousMilestoneDeadlineError = false;
      }
    }
  }

  rules["previous-milestone-target-amount"].valid =
    !previousMilestoneTargetAmountError;

  rules["previous-milestone-deadline"].valid = !previousMilestoneDeadlineError;

  return rules;
};
