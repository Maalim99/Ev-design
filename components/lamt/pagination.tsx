import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Button, ButtonKind } from "./button";

/**
 * LAMT Pagination Component
 * Migrated from @lamt/components Pagination.tsx
 */

export interface PaginationProps {
  currentPageNumber: number;
  totalData: number;
  limit: number;
  onChangeLimit?: (limit: number) => void;
  onPageChange?: (page: number) => void;
  className?: string;
}

const limitOptions = [
  { label: "10", value: 10 },
  { label: "20", value: 20 },
  { label: "50", value: 50 },
];

export const Pagination = React.forwardRef<HTMLDivElement, PaginationProps>(
  (
    {
      currentPageNumber,
      totalData,
      limit,
      onChangeLimit,
      onPageChange,
      className,
    },
    ref
  ) => {
    const [activePage, setActivePage] = React.useState(currentPageNumber);
    const [selectedLimit, setSelectedLimit] = React.useState(limit);

    const totalPages = Math.ceil(totalData / selectedLimit);

    const changePage = (page: number) => {
      setActivePage(page);
      if (onPageChange) {
        onPageChange(page);
      }
    };

    const changeLimit = (newLimit: number) => {
      setSelectedLimit(newLimit);
      if (onChangeLimit) {
        onChangeLimit(newLimit);
      }
    };

    const startItem = (activePage - 1) * selectedLimit + 1;
    const endItem = Math.min(activePage * selectedLimit, totalData);

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col items-center justify-end",
          "pt-4 pb-8 px-4",
          "md:flex-row md:pt-[15px] md:pb-[15px]",
          className
        )}
      >
        {/* Items Per Page */}
        <div className="flex items-center mb-4 md:mb-0">
          <p className="text-[13.17px] leading-4 text-[#566E8B] whitespace-nowrap">
            Items Per Page
          </p>
          <div className="ml-4 mr-4 md:mr-12">
            <Select
              value={selectedLimit.toString()}
              onValueChange={(value) => changeLimit(parseInt(value))}
            >
              <SelectTrigger className="w-[70px] h-[38px] text-[14px]">
                <SelectValue placeholder={selectedLimit.toString()} />
              </SelectTrigger>
              <SelectContent>
                {limitOptions.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value.toString()}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Summary */}
        <p className="text-[13.17px] leading-4 text-[#92A5BA] mb-4 md:mb-0 md:mr-12">
          {`${startItem} to ${endItem} of ${totalData}`}
        </p>

        {/* Controls */}
        <div className="flex items-center pb-8 pt-4">
          {/* First Page */}
          <Button
            kind={ButtonKind.Transparent}
            disabled={activePage === 1}
            onClick={() => changePage(1)}
            icon={
              <>
                <ChevronLeft className="text-[#92A5BA]" size={16} />
                <ChevronLeft className="text-[#92A5BA] -ml-3" size={16} />
              </>
            }
            className="mr-2 text-[#92A5BA]"
          />

          {/* Previous Page */}
          <Button
            kind={ButtonKind.Transparent}
            disabled={activePage === 1}
            onClick={() => changePage(Math.max(activePage - 1, 1))}
            icon={<ChevronLeft className="text-[#92A5BA]" size={16} />}
            className="text-[#92A5BA]"
          />

          {/* Page Number */}
          <p className="mx-8 text-[13.17px] leading-4 text-[#92A5BA]">
            {`${activePage} of ${totalPages}`}
          </p>

          {/* Next Page */}
          <Button
            kind={ButtonKind.Transparent}
            disabled={activePage === totalPages}
            onClick={() =>
              changePage(Math.min(activePage + 1, totalPages))
            }
            icon={<ChevronRight className="text-[#92A5BA]" size={16} />}
            className="mr-2 text-[#92A5BA]"
          />

          {/* Last Page */}
          <Button
            kind={ButtonKind.Transparent}
            disabled={activePage === totalPages}
            onClick={() => changePage(totalPages)}
            icon={
              <>
                <ChevronRight className="text-[#92A5BA]" size={16} />
                <ChevronRight className="text-[#92A5BA] -ml-3" size={16} />
              </>
            }
            className="text-[#92A5BA]"
          />
        </div>
      </div>
    );
  }
);

Pagination.displayName = "Pagination";

export default Pagination;
