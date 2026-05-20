import * as React from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * LAMT Expandable Component
 * Migrated from @lamt/components Expandable.tsx
 * Uses shadcn/ui Collapsible as base
 */

export interface ExpandableProps {
  headerComponent: React.ReactNode;
  contentComponent: React.ReactNode;
  shouldExpandedItemTakeFullWidth?: boolean;
  contentBackground?: string;
  className?: string;
}

export const Expandable = React.forwardRef<HTMLDivElement, ExpandableProps>(
  (
    {
      headerComponent,
      contentComponent,
      shouldExpandedItemTakeFullWidth,
      contentBackground,
      className,
    },
    ref
  ) => {
    const [opened, setOpened] = React.useState(false);

    return (
      <Collapsible
        ref={ref}
        open={opened}
        onOpenChange={setOpened}
        className={cn("text-[14px] leading-6", className)}
      >
        <CollapsibleTrigger asChild>
          <div
            className={cn(
              "flex cursor-pointer items-center justify-between",
              "p-4"
            )}
          >
            <div className="flex flex-1 items-center justify-between">
              {headerComponent}
              <ChevronRight
                className={cn(
                  "h-4 w-4 text-[#566E8B]",
                  "transition-transform duration-400 ease-in-out-cubic",
                  opened && "rotate-90"
                )}
              />
            </div>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent
          className={cn(
            "overflow-hidden",
            "transition-all duration-400 ease-in-out-cubic",
            "data-[state=open]:animate-collapsible-down",
            "data-[state=closed]:animate-collapsible-up",
            shouldExpandedItemTakeFullWidth && [
              "-ml-4 w-[calc(100%+32px)]",
              "md:-ml-8 md:w-[calc(100%+64px)]",
            ]
          )}
          style={{
            backgroundColor: contentBackground,
          }}
        >
          <div className="p-4 pl-8">{contentComponent}</div>
        </CollapsibleContent>
      </Collapsible>
    );
  }
);

Expandable.displayName = "Expandable";

export const ExpandableContentWrapper: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return <div className={cn("p-4 pl-8", className)}>{children}</div>;
};

export default Expandable;
