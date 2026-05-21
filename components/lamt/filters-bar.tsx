import * as React from "react";
import { Filter, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, ButtonKind, ButtonSize } from "./button";

/**
 * LAMT FiltersBar Component
 * Migrated from @lamt/components FiltersBar.tsx
 *
 * Action bar with filter, preferences, and custom actions
 */

export interface FiltersBarProps {
  activeFiltersCount: string | number;
  leftActions?: React.ReactNode[];
  onClickFilter?: () => void;
  onClickPreferences?: () => void;
  onClickActive?: () => void;
  onClearFilter?: () => void;
  className?: string;
}

export const FiltersBar = React.forwardRef<HTMLDivElement, FiltersBarProps>(
  (
    {
      activeFiltersCount,
      leftActions,
      onClickFilter,
      onClickPreferences,
      onClearFilter,
      className,
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center flex-wrap",
          "mb-6",
          "gap-3",
          className
        )}
      >
        {leftActions &&
          leftActions.map((action, idx) => <span key={idx}>{action}</span>)}

        <Button kind={ButtonKind.Ghost} size={ButtonSize.Small} onClick={onClickFilter}>
          <Filter className="mr-2 h-3 w-3" />
          Filter ({activeFiltersCount})
        </Button>

        <Button kind={ButtonKind.Ghost} size={ButtonSize.Small} onClick={onClickPreferences}>
          <Settings className="mr-2 h-3 w-3" />
          Preferences
        </Button>

        {onClearFilter && (
          <Button kind={ButtonKind.Primary} size={ButtonSize.Small} onClick={onClearFilter} className="min-w-40">
            Clear Filter
          </Button>
        )}
      </div>
    );
  }
);

FiltersBar.displayName = "FiltersBar";

export default FiltersBar;
