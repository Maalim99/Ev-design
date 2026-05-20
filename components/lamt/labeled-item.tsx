import * as React from "react";
import { cn } from "@/lib/utils";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/**
 * LAMT LabeledItem Component
 * Migrated from @lamt/components LabeledItem.tsx
 *
 * Displays a label with an optional value and tooltip
 * Supports both normal and large (heading) text sizes
 */

export interface LabeledItemProps {
  /** Use larger heading-style text for the value */
  isBig?: boolean;
  /** Tooltip text to display on info icon hover */
  tooltip?: string | null;
  /** The value to display (can be any type) */
  value?: string | Array<string> | number | Date | object | boolean;
  /** The label text */
  label?: string;
  /** Hide the value display */
  hideValue?: boolean;
  /** Additional content to render below */
  children?: React.ReactNode;
  /** Title attribute for accessibility */
  title?: string;
  /** Custom CSS class */
  className?: string;
  /** Style variant for download contexts */
  forDownload?: boolean;
}

function renderValue(
  props: Pick<LabeledItemProps, "hideValue" | "value">
): React.ReactNode {
  if (props.hideValue) return null;

  return props.value || props.value === 0 ? (
    String(props.value)
  ) : (
    <em className="italic text-lamt-neutral">Not available</em>
  );
}

export const LabeledItem = React.forwardRef<HTMLDivElement, LabeledItemProps>(
  (
    {
      label,
      className,
      isBig = false,
      hideValue = false,
      value,
      tooltip = null,
      children,
      title,
      forDownload = false,
      ...props
    },
    ref
  ) => {
    const valueContent = renderValue({ hideValue, value });

    return (
      <div ref={ref} className={cn("flex flex-col", className)} {...props}>
        {label && (
          <p
            title={title}
            className={cn(
              "text-[13.17px] leading-4",
              forDownload ? "font-bold text-lamt-neutral-dark" : "text-lamt-neutral"
            )}
          >
            {label}
          </p>
        )}
        <div
          title={title}
          className={cn(
            "flex items-start gap-1",
            isBig
              ? forDownload
                ? "text-[23.61px] leading-8 font-normal"
                : "text-[23.61px] leading-8"
              : "text-[14px] leading-6",
            "disabled:italic disabled:opacity-50"
          )}
        >
          {valueContent}
          {tooltip && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex items-center mt-0.5 text-lamt-neutral-medium hover:text-lamt-neutral focus:outline-none"
                    aria-label={`More information: ${tooltip}`}
                  >
                    <Info size={11} />
                  </button>
                </TooltipTrigger>
                <TooltipContent
                  className="max-w-xs bg-lamt-neutral-dark-medium text-white p-[15px] rounded-lg shadow-lg text-[14px] leading-6"
                  sideOffset={5}
                >
                  {tooltip}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        {children}
      </div>
    );
  }
);

LabeledItem.displayName = "LabeledItem";

export default LabeledItem;
