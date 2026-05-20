import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * LAMT InputError Component
 * Migrated from @lamt/components forms/InputError.tsx
 */

export interface InputErrorProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const InputError = React.forwardRef<HTMLDivElement, InputErrorProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "min-h-[18px] w-full inline-block",
          "text-[13.17px] leading-4",
          "text-lamt-danger",
          "mt-[5px] text-left",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

InputError.displayName = "InputError";

export default InputError;
