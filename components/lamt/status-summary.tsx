import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * LAMT StatusSummary Component
 * Migrated from @lamt/components StatusSummary.tsx
 *
 * Displays a summary card showing a status label and count
 */

export interface StatusSummaryProps {
  status: string | React.ReactNode;
  count: number;
  className?: string;
}

export const StatusSummary = React.forwardRef<
  HTMLDivElement,
  StatusSummaryProps
>(({ status, count, className }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "m-1.5",
        "inline-table",
        "flex-col",
        "border border-[#D1D5DB]",
        "rounded-[5px]",
        "px-2.5 py-2.5",
        "min-w-[150px]",
        className
      )}
    >
      <p className="text-center w-max mx-auto">{status}</p>
      <p className="text-center mt-1.5 text-2xl">{count}</p>
    </div>
  );
});

StatusSummary.displayName = "StatusSummary";

export default StatusSummary;
