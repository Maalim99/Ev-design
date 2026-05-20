import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * LAMT InputLabel Component
 * Migrated from @lamt/components forms/InputLabel.tsx
 */

export interface InputLabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  disabled?: boolean;
  secondary?: boolean;
}

export const InputLabel = React.forwardRef<HTMLLabelElement, InputLabelProps>(
  ({ className, disabled, secondary: _secondary, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(
          "w-full inline-block mb-2",
          "text-[14px] leading-6",
          "text-lamt-neutral",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
        {...props}
      />
    );
  }
);

InputLabel.displayName = "InputLabel";

export default InputLabel;
