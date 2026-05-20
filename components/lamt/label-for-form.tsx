import * as React from "react";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/**
 * LAMT LabelForForm Component
 * Migrated from @lamt/components labelForForm.tsx
 *
 * Label with optional tooltip for form fields
 */

export interface LabelForFormProps {
  label: string;
  tooltip?: string | null;
  className?: string;
}

export const LabelForForm = React.forwardRef<HTMLDivElement, LabelForFormProps>(
  ({ label, tooltip, className }, ref) => {
    return (
      <div ref={ref} className={cn("flex items-center gap-2.5", className)}>
        {label && (
          <p className="text-sm text-[#92A5BA] m-0">{label}</p>
        )}
        {tooltip && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-3.5 w-3.5 text-[#C9D0D9] cursor-pointer hover:text-[#92A5BA] transition-colors" />
              </TooltipTrigger>
              <TooltipContent
                side="top"
                className="bg-[#313E4F] text-white text-sm max-w-xs"
              >
                <p>{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    );
  }
);

LabelForForm.displayName = "LabelForForm";

export default LabelForForm;
