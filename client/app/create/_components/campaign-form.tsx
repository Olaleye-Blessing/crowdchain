/* eslint-disable @next/next/no-img-element */
"use client";

import { useRef } from "react";
import { MDXEditorMethods } from "@mdxeditor/editor";
import { Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { MDXEditor } from "@/components/markdown/editor";
import Milestones from "./milestones";
import ImportantNotice from "./important-notice";
import { useCreateCampaign } from "../_hooks/use-create-campaign";
import { categories } from "@/utils/categories";

const oneDay = 1 * 24 * 60 * 60 * 1000;

const _categories = [...categories];

const validateCategories = (cats: string[]) => {
  if (cats.length === 0) {
    return "Select at least 1 category";
  } else if (cats.length > 5) {
    return "Maximum of 4 categories";
  } else {
    return true;
  }
};

const CampaignForm = () => {
  const ref = useRef<MDXEditorMethods>(null);
  const { form, onChangeCategory, handleChangeImage, onSubmit, preview } =
    useCreateCampaign();
  const {
    formState: { errors },
    control,
  } = form;
  const deadline = form.watch("deadline");

  return (
    <div className="mx-auto px-4 py-8">
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
              <Controller
                name="description"
                rules={{
                  required: true,
                  minLength: {
                    value: 100,
                    message: "Provide at least 100 character",
                  },
                }}
                control={control}
                render={({ field }) => (
                  <MDXEditor
                    ref={ref}
                    markdown={field.value}
                    onChange={(markdown) => {
                      field.onChange(markdown);
                    }}
                  />
                )}
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
              <p className="text-muted-foreground text-sm !mt-0">
                Maximum: 1MB
              </p>
              {errors.coverImage && (
                <p className="text-red-500 text-sm !mt-0">
                  {errors.coverImage.message}
                </p>
              )}
              {preview && (
                <figure className="flex items-center justify-center rounded-lg max-h-[25rem] overflow-hidden">
                  <img src={preview} alt="" />
                </figure>
              )}
            </div>

            <div className="space-y-2 -mt-3">
              <p className="font-medium">Categories</p>
              <p className="text-muted-foreground text-sm !-mt-0.5">
                Minimum of 1, maximum of 5
              </p>
              <Controller
                name="categories"
                rules={{ validate: validateCategories }}
                control={control}
                render={({ field }) => {
                  const selectedCategories = field.value;

                  return (
                    <ul className="grid gap-x-8 gap-y-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                      {_categories.map((category) => {
                        const value = category
                          .replaceAll(" ", "_")
                          .toLowerCase();

                        return (
                          <div
                            key={category}
                            className="flex items-center justify-start"
                          >
                            <Checkbox
                              id={value}
                              disabled={selectedCategories.length >= 5}
                              className="mr-1"
                              onCheckedChange={(checked) =>
                                onChangeCategory(value, checked as boolean)
                              }
                            />
                            <Label htmlFor={value}>{category}</Label>
                          </div>
                        );
                      })}
                    </ul>
                  );
                }}
              />
              {errors.categories && (
                <p className="text-red-500 text-sm">
                  {errors.categories.message}
                </p>
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
