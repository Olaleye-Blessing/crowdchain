"use client";

import { FormEventHandler } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSearchParameters } from "@/hooks/use-search-parameters";
import { categories } from "@/utils/categories";

const _categories = ["All", ...categories];

export default function Form() {
  const { deleteParams, getParam, updateParams } = useSearchParameters();
  const defaultCategory = getParam("category") || "all";

  const searchForCampaignTitle: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    const campaignTitle = Object.fromEntries(
      new FormData(e.target as HTMLFormElement).entries(),
    ).search;

    updateParams({ params: { by: "title", title: campaignTitle as string } });
  };

  return (
    <div className="more__shadow mb-8 px-4 py-4 sticky top-16 z-[45] bg-[#F5F5F8] left-0 right-0 rounded-md">
      <div className="md:flex md:items-center md:justify-between md:flex-row">
        <form className="w-full flex-1">
          <Label htmlFor="category" className="sr-only">
            Select Category
          </Label>
          <Select
            defaultValue={defaultCategory}
            onValueChange={(category) => {
              if (category === "all") {
                deleteParams({ params: ["category"] });
              } else {
                updateParams({ params: { category, by: "category" } });
              }
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {_categories.map((category) => {
                const value = category.replaceAll(" ", "_").toLowerCase();

                return (
                  <SelectItem key={value} value={value}>
                    {category}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </form>
        <div className="w-full h-[0.0625rem] bg-input my-2 md:w-[0.0625rem] md:h-auto md:self-stretch md:my-0 md:mx-2" />
        <form
          className="relative w-full flex-1"
          onSubmit={searchForCampaignTitle}
        >
          <fieldset
            aria-disabled
            disabled
            className="w-full relative"
            title="Coming Soon"
          >
            <label htmlFor="search" className="sr-only">
              Search
            </label>
            <Input
              type="search"
              placeholder="Search for full campaign title"
              name="search"
              id="search"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-white rounded-lg text-xs px-2 py-1"
            >
              Search
            </button>
          </fieldset>
        </form>
      </div>
    </div>
  );
}
