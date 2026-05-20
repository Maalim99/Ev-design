import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * LAMT PreferencesDrawer Component
 * Migrated from @lamt/components PreferencesDrawer.tsx
 *
 * Simple drawer container for preferences with header
 */

export interface PreferencesDrawerProps {
  headerComponent: React.ReactNode;
  contentComponent?: React.ReactNode;
  shouldExpandedItemTakeFullWidth?: boolean;
  contentBackground?: string;
  className?: string;
}

export const PreferencesDrawer = React.forwardRef<
  HTMLDivElement,
  PreferencesDrawerProps
>(
  (
    {
      headerComponent,
      contentComponent,
      contentBackground,
      className,
      ...otherProps
    },
    ref
  ) => {
    const [opened, setOpened] = React.useState<boolean>(false);

    return (
      <div ref={ref} className={cn("text-sm", className)} {...otherProps}>
        <div
          className="flex cursor-pointer p-4 items-center justify-between"
          onClick={() => setOpened(!opened)}
        >
          <div className="flex flex-1 items-center justify-between">
            {headerComponent}
          </div>
        </div>
        {opened && contentComponent && (
          <div
            className={cn(
              "p-4",
              contentBackground && `bg-[${contentBackground}]`
            )}
          >
            {contentComponent}
          </div>
        )}
      </div>
    );
  }
);

PreferencesDrawer.displayName = "PreferencesDrawer";

export default PreferencesDrawer;
