import * as React from "react";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

/**
 * LAMT RadioButton Component
 * Migrated from @lamt/components forms/RadioButton.tsx
 */

export interface RadioButtonProps {
  value: string;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export const RadioButton = React.forwardRef<HTMLButtonElement, RadioButtonProps>(
  ({ value, label, disabled, className, ...props }, ref) => {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <RadioGroupItem ref={ref} value={value} disabled={disabled} {...props} />
        {label && (
          <label
            htmlFor={value}
            className={cn(
              "text-[14px] leading-6 cursor-pointer",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            {label}
          </label>
        )}
      </div>
    );
  }
);

RadioButton.displayName = "RadioButton";

export default RadioButton;
