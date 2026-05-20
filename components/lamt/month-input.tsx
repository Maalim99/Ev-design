import * as React from "react";
import { format } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { cn } from "@/lib/utils";

/**
 * LAMT MonthInput Component
 * Migrated from @lamt/components forms/MonthInput.tsx
 */

export interface MonthInputProps {
  name?: string;
  date?: Date | string | null;
  onChange?: (date: Date | [Date | null, Date | null] | null) => void;
  onSelect?: (date: Date) => void;
  disabled?: boolean;
  minDate?: Date;
  className?: string;
}

export const MonthInput = React.forwardRef<DatePicker, MonthInputProps>(
  (
    {
      name,
      date: dateProp,
      onChange,
      onSelect,
      disabled,
      minDate,
      className,
    },
    ref
  ) => {
    const date =
      dateProp && typeof dateProp === "string"
        ? new Date(dateProp)
        : typeof dateProp === "object"
          ? dateProp
          : null;

    return (
      <div className={cn("w-full", className)}>
        <DatePicker
          ref={ref}
          placeholderText={format(new Date(), "MM/yyyy")}
          name={name}
          disabled={disabled}
          minDate={minDate}
          dateFormat="MM/yyyy"
          showMonthYearPicker
          selected={date}
          onSelect={onSelect}
          onChange={(date) => {
            if (onChange) {
              onChange(date as Date | [Date | null, Date | null] | null);
            }
          }}
          className={cn(
            "w-full",
            "px-2.5 py-2",
            "h-11",
            "rounded-[7px]",
            "bg-white",
            "text-[14px] leading-6",
            "text-[#11171E]",
            "border border-[#C9D0D9]",
            "transition-all duration-300 ease-in-out",
            "outline-none",
            "focus:border-[#07C1FF] focus:shadow-[0_0_0_3px_rgba(7,193,255,0.4)]",
            disabled ? "cursor-not-allowed opacity-60" : "cursor-text"
          )}
        />
      </div>
    );
  }
);

MonthInput.displayName = "MonthInput";

export default MonthInput;
