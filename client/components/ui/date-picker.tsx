"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button, ButtonProps } from "@/components/ui/button";
import { Calendar, CalendarProps } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  calendar: CalendarProps;
  triggerProps?: ButtonProps;
}

export function DatePicker({ calendar, triggerProps = {} }: DatePickerProps) {
  const { className: btnClassName, ...btnProps } = triggerProps;
  const { selected: date } = calendar;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !date && "text-muted-foreground",
            btnClassName,
          )}
          {...btnProps}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {/* TODO: Type  */}
          {date ? format(date as any, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          {...calendar}
          initialFocus
          // onDayClick={(day, modifiers, e) => {
          //   calendar.onDayClick?.(day, modifiers, e);
          // }}
          defaultMonth={new Date(date as any)}
        />
      </PopoverContent>
    </Popover>
  );
}
