import * as React from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { LabeledItem } from "./labeled-item";

/**
 * LAMT ExpandableContent Component
 * Migrated from @lamt/components ExpandableContent.tsx
 * Used for comparing two sets of data side-by-side
 */

export type DetailsLabel = {
  label: string;
  value: string | number;
};

export interface ExpandableContentProps {
  leftItem: DetailsLabel[] | React.ReactNode;
  rightItem: DetailsLabel[] | React.ReactNode;
  leftTitle?: string;
  rightTitle?: string;
  className?: string;
}

export const ExpandableContent = React.forwardRef<
  HTMLDivElement,
  ExpandableContentProps
>(({ leftItem, rightItem, leftTitle, rightTitle, className }, ref) => {
  const isLeftArray = Array.isArray(leftItem);
  const isRightArray = Array.isArray(rightItem);

  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-row w-[525px]",
        "bg-[#F9FAFB]",
        className
      )}
    >
      {/* Left Section */}
      <div className="flex-1 max-w-[50%] p-[15px]">
        <div className="flex flex-col">
          <p className="mb-[15px]">
            <strong>{leftTitle || "Old Payplan"}</strong>
          </p>
          {isLeftArray
            ? (leftItem as DetailsLabel[]).map((item, index) => (
                <LabeledItem
                  key={index}
                  label={item.label}
                  value={item.value || "Not Available"}
                  className="mb-[15px]"
                />
              ))
            : (leftItem as React.ReactNode)}
        </div>
      </div>

      {/* Arrow (only shown when left item is an array) */}
      {isLeftArray && (
        <div className="w-auto p-0 flex-auto self-center my-[15px]">
          <ArrowRight className="text-[#566E8B]" size={20} />
        </div>
      )}

      {/* Right Section */}
      <div className="flex-1 max-w-[50%] p-[15px]">
        <div className="flex flex-col">
          <p className="mb-[15px]">
            <strong>{rightTitle || "New Payplan"}</strong>
          </p>
          {isRightArray
            ? (rightItem as DetailsLabel[]).map((item, index) => (
                <LabeledItem
                  key={index}
                  label={item.label}
                  value={item.value || "Not Available"}
                  className="mb-[15px]"
                />
              ))
            : (rightItem as React.ReactNode)}
        </div>
      </div>
    </div>
  );
});

ExpandableContent.displayName = "ExpandableContent";

export default ExpandableContent;
