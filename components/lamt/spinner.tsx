import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * LAMT Spinner Component
 * Migrated from @lamt/components forms/Spinner.tsx
 * Uses lucide-react Loader2 icon
 */

export interface SpinnerProps {
  id?: string;
  baseColor?: string;
  className?: string;
  size?: number;
}

export const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ id, baseColor = "#F5A623", size = 48, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        id={id}
        className={cn("flex justify-center", className)}
        style={{ width: size ? `${size}px` : "auto" }}
        {...props}
      >
        <Loader2
          className="animate-spin"
          size={size}
          style={{ color: baseColor }}
        />
      </div>
    );
  }
);

Spinner.displayName = "Spinner";

export default Spinner;
