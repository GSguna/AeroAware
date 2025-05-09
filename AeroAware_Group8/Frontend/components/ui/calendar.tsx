"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
// import { fr } from "date-fns/locale";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function CalendarDropdown({
  displayMonth,
  displayYear,
  onChangeMonth,
  onChangeYear,
}: {
  displayMonth: Date;
  displayYear: number;
  onChangeMonth: (date: Date) => void;
  onChangeYear: (year: number) => void;
}) {
  const months = Array.from({ length: 12 }, (_, i) => {
    const month = new Date(displayYear, i, 1);
    return {
      value: i.toString(),
      label: format(month, "MMMM"), // removed { locale: fr }
    };
  });

  const years = Array.from(
    { length: 20 },
    (_, i) => new Date().getFullYear() - 5 + i,
  ).sort((a, b) => a - b);

  return (
    <div className="flex items-center justify-center gap-1 pt-1">
      <Select
        value={displayMonth.getMonth().toString()}
        onValueChange={(value) => {
          const newDate = new Date(displayMonth);
          newDate.setMonth(parseInt(value));
          onChangeMonth(newDate);
        }}
      >
        <SelectTrigger className="h-7 w-[110px]">
          <SelectValue>
            {format(displayMonth, "MMMM")}  
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {months.map((month) => (
            <SelectItem
              key={month.value}
              value={month.value}
              className="cursor-pointer"
            >
              {month.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={displayYear.toString()}
        onValueChange={(value) => {
          onChangeYear(parseInt(value));
        }}
      >
        <SelectTrigger className="h-7 w-[80px]">
          <SelectValue>{displayYear}</SelectValue>
        </SelectTrigger>
        <SelectContent className="max-h-[300px]">
          {years.map((year) => (
            <SelectItem
              key={year}
              value={year.toString()}
              className="cursor-pointer"
            >
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  defaultMonth,
  index = 0, // Ajout d'un index pour gérer plusieurs calendriers
  ...props
}: CalendarProps & { index?: number }) {
  const [currentMonth, setCurrentMonth] = React.useState<Date>(() => {
    if (props.selected instanceof Date) {
      return props.selected;
    }
    if (Array.isArray(props.selected) && props.selected[0]) {
      const selectedDate = props.selected[0];
      if (selectedDate instanceof Date) {
        return new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth() + index,
          1,
        );
      }
      return new Date();
    }
    if (defaultMonth) {
      return new Date(
        defaultMonth.getFullYear(),
        defaultMonth.getMonth() + index,
        1,
      );
    }
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + index, 1);
  });

  const [currentYear, setCurrentYear] = React.useState<number>(() =>
    currentMonth.getFullYear(),
  );

  React.useEffect(() => {
    if (props.selected instanceof Date) {
      const newDate = new Date(props.selected);
      newDate.setMonth(newDate.getMonth() + index);
      setCurrentMonth(newDate);
      setCurrentYear(newDate.getFullYear());
    } else if (
      Array.isArray(props.selected) &&
      props.selected[0] instanceof Date
    ) {
      const newDate = new Date(props.selected[0]);
      newDate.setMonth(newDate.getMonth() + index);
      setCurrentMonth(newDate);
      setCurrentYear(newDate.getFullYear());
    }
  }, [props.selected, index]);

  const handleMonthChange = (newMonth: Date) => {
    setCurrentMonth(newMonth);
    props.onMonthChange?.(newMonth);
  };

  const handleYearChange = (year: number) => {
    const newDate = new Date(currentMonth);
    newDate.setFullYear(year);
    setCurrentYear(year);
    setCurrentMonth(newDate);
    props.onMonthChange?.(newDate);
  };

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      month={currentMonth}
      defaultMonth={defaultMonth}
      onMonthChange={handleMonthChange}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-8.25 font-normal text-[0.8rem]", // changed from w-9
        row: "flex w-full mt-2",
        cell: "h-9 w-8.25 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn( // changed from w-9 ^^
          buttonVariants({ variant: "ghost" }),
          "h-9 w-8 p-0 font-normal aria-selected:opacity-100", // changed from w-9
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ className, ...props }) => (
          <ChevronLeft className={cn("h-4 w-4", className)} {...props} />
        ),
        IconRight: ({ className, ...props }) => (
          <ChevronRight className={cn("h-4 w-4", className)} {...props} />
        ),
        Caption: () => (
          <CalendarDropdown
            displayMonth={currentMonth}
            displayYear={currentYear}
            onChangeMonth={handleMonthChange}
            onChangeYear={handleYearChange}
          />
        ),
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };