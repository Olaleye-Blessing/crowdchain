/* eslint-disable @next/next/no-img-element */
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import Milestones from "./milestones";
import ImportantNotice from "./important-notice";
import { useCreateCampaign } from "../_hooks/use-create-campaign";

const oneDay = 1 * 24 * 60 * 60 * 1000;

const CampaignForm = () => {
  const { form, coverImage, handleChangeImage, onSubmit, preview } =
    useCreateCampaign();
  const {
    formState: { errors },
  } = form;
  const deadline = form.watch("deadline");

  return (
    <div className="container mx-auto px-4 py-8">
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-2xl mx-auto"
      >
        <Card className="">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-left">
              Create New Campaign
            </CardTitle>
            <CardDescription>
              <ImportantNotice className="mt-[-0.7rem]" />
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Campaign Title</Label>
              <Input
                id="title"
                {...form.register("title", {
                  required: "Title is required",
                  minLength: 1,
                  maxLength: 200,
                })}
                placeholder="Enter campaign title"
              />
              {errors.title && (
                <p className="text-red-500 text-sm">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...form.register("description", {
                  required: "Description is required",
                  minLength: 10,
                })}
                placeholder="Describe your campaign"
                rows={4}
              />
              {errors.description && (
                <p className="text-red-500 text-sm">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="goal">Funding Goal (in ETH)</Label>
              <Input
                id="goal"
                type="number"
                {...form.register("goal", {
                  required: "Funding goal is required",
                  // min: { value: 0, message: "Goal must be positive" },
                  validate: (value) =>
                    value > 0 || "Goal must be greater than 0",
                })}
                placeholder="Enter funding goal"
                step="0.00000000001"
              />
              {errors.goal && (
                <p className="text-red-500 text-sm">{errors.goal.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="deadline">Campaign Deadline</Label>
              <div>
                <DatePicker
                  triggerProps={{ className: "w-full" }}
                  calendar={{
                    selected: deadline,
                    mode: "single",
                    fromDate: new Date(Date.now() + oneDay),
                    onSelect: (date) => {
                      form.setValue("deadline", date);

                      if (!date) {
                        return form.setError("deadline", {
                          message: "Select a date",
                        });
                      }

                      form.clearErrors("deadline");
                    },
                  }}
                />
              </div>
              {errors.deadline && (
                <p className="text-red-500 text-sm">
                  {errors.deadline.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="refundDeadline">Refund Deadline</Label>
              <div>
                <DatePicker
                  triggerProps={{ className: "w-full", disabled: !deadline }}
                  calendar={{
                    selected: form.watch("refundDeadline"),
                    mode: "single",
                    disabled: !deadline,
                    fromDate: deadline
                      ? new Date(new Date(deadline).getTime() + 6 * oneDay)
                      : undefined,
                    onSelect: (date) => {
                      form.setValue("refundDeadline", date);

                      if (!date)
                        return form.setError("refundDeadline", {
                          message: "Select a deadline date",
                        });

                      form.clearErrors("refundDeadline");
                    },
                  }}
                />
              </div>
              {errors.refundDeadline && (
                <p className="text-red-500 text-sm">
                  {errors.refundDeadline.message}
                </p>
              )}
            </div>

            {/* TODO: Upload image instead */}
            <div className="space-y-2">
              <Label htmlFor="coverImage">Cover Image</Label>
              <Input
                id="coverImage"
                name="coverImage"
                onChange={handleChangeImage}
                placeholder="Provide a campaign image"
                type="file"
                accept="image/*"
                multiple={false}
              />
              {!coverImage && (
                <p className="text-red-500 text-sm">Cover Image is required</p>
              )}
              {preview && (
                <figure className="flex items-center justify-center rounded-lg max-h-[25rem] overflow-hidden">
                  <img src={preview} alt="" />
                </figure>
              )}
            </div>
          </CardContent>
        </Card>

        <Milestones form={form} />
        <ImportantNotice className="mt-2" />

        <Button
          type="submit"
          className="w-full mt-8 max-w-80 mx-auto block"
          disabled={form.formState.isSubmitting}
        >
          Create Campaign
        </Button>
      </form>
    </div>
  );
};

export default CampaignForm;
