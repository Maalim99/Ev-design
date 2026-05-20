"use client";
import * as React from "react";
import { useWatch } from "react-hook-form";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Expandable, ExpandableProps } from "./expandable";
import { FilterMethod, FilterMethodProps } from "./filter-method";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/**
 * LAMT FilterExpandable Component
 * Migrated from @lamt/components filters/FilterExpandable.tsx
 *
 * Expandable filter section with active indicator and optional tooltip
 */

export interface FilterExpandableProps
  extends FilterMethodProps,
    Pick<ExpandableProps, "shouldExpandedItemTakeFullWidth"> {
  headerName: string;
  title?: string;
  active?: boolean;
  onChangeFilter: (values: Record<string, unknown>) => void;
}

export const FilterExpandable = React.forwardRef<
  HTMLDivElement,
  FilterExpandableProps
>(
  (
    {
      headerName,
      name,
      type,
      title,
      formControl,
      options,
      method,
      onChangeFilter,
      shouldExpandedItemTakeFullWidth,
    },
    ref
  ) => {
    const watchedValue = useWatch({
      control: formControl.control,
      name: `${name}.value`,
    });

    const isActive = !!watchedValue;

    const FilterExpandableHeader = () => (
      <div className="flex flex-1 items-center justify-between pr-4">
        <label
          className={cn(
            "flex items-center cursor-pointer",
            "before:inline-block before:content-[''] before:w-[11px] before:h-[11px] before:mr-3",
            "before:border-2 before:border-[#92A5BA] before:rounded-full",
            "before:transition-all before:duration-300 before:ease-in-out",
            isActive &&
              "before:border-none before:bg-[#36D977] before:w-[15px] before:h-[15px]"
          )}
        >
          {headerName}
        </label>
        {title && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-[#92A5BA]" />
              </TooltipTrigger>
              <TooltipContent
                side="top"
                className={cn(
                  "rounded-[7px]",
                  "shadow-[0_5px_30px_rgba(0,0,0,0.1)]",
                  "px-4 py-4",
                  "text-sm",
                  "bg-[#313E4F]"
                )}
              >
                {title}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    );

    return (
      <Expandable
        ref={ref}
        shouldExpandedItemTakeFullWidth={shouldExpandedItemTakeFullWidth}
        headerComponent={<FilterExpandableHeader />}
        contentBackground="#F9FAFB"
        contentComponent={
          <FilterMethod
            name={name}
            type={type}
            options={options}
            method={method}
            formControl={formControl}
            onChangeFilter={onChangeFilter}
          />
        }
      />
    );
  }
);

FilterExpandable.displayName = "FilterExpandable";

export default FilterExpandable;
