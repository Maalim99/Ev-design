import * as React from "react";
import { cn } from "@/lib/utils";
import { TextInput, type TextInputProps } from "./text-input";

/**
 * LAMT LabeledInput Component
 * Migrated from @lamt/components forms/LabeledInput.tsx
 * Text input with a label badge on the right side
 */

export interface LabeledInputProps extends TextInputProps {
  inputLabel: string;
}

export const LabeledInput = React.forwardRef<HTMLInputElement, LabeledInputProps>(
  ({ inputLabel, className, ...inputProps }, ref) => {
    return (
      <div className="relative flex flex-grow w-full items-center">
        <TextInput
          {...inputProps}
          ref={ref}
          type={inputProps.type || "number"}
          className={cn(
            "pr-12",
            // Hide number input spinners
            "[&::-webkit-outer-spin-button]:appearance-none",
            "[&::-webkit-inner-spin-button]:appearance-none",
            "[&::-webkit-outer-spin-button]:m-0",
            "[&::-webkit-inner-spin-button]:m-0",
            "[appearance:textfield]",
            className
          )}
        />
        <div
          className={cn(
            "absolute top-0.5 right-0.5",
            "flex items-center justify-center",
            "h-[calc(100%-4px)]",
            "px-2",
            "text-[13.17px] leading-4",
            "capitalize",
            "bg-[#F3F4F6]",
            "rounded-tr-[7px] rounded-br-[7px]"
          )}
        >
          {inputLabel}
        </div>
      </div>
    );
  }
);

LabeledInput.displayName = "LabeledInput";

export default LabeledInput;
