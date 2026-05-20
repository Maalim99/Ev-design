"use client";
import * as React from "react";
import { ArrowDown, ArrowUp, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, ButtonKind, ButtonSize } from "./button";
import { CheckboxInput } from "./checkbox-input";
import { Pagination } from "./pagination";
import { Spinner } from "./spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/**
 * LAMT Table Component
 * Migrated from @lamt/components table/
 *
 * Data table with sorting, pagination, checkboxes, and actions
 */

export interface Dictionary {
  [index: string]: number | string | React.ReactNode | object;
}

export enum PaginationStrategy {
  LOCAL = "local",
  REMOTE = "remote",
}

export enum TableCellType {
  number = "number",
  id = "id",
  text = "string",
  component = "component",
  action = "action",
}

export enum TableRenderType {
  TEXT = "text",
  HTML = "html",
}

export interface ColumnData {
  headerName: string;
  type: TableCellType;
  key: string;
  viewTotal?: boolean;
  checked?: boolean;
  renderType?: TableRenderType;
}

export interface TableProps {
  hasActions: boolean;
  rowActions?: React.ReactNode | ((rowData: Dictionary) => React.ReactNode);
  data: Dictionary[];
  colDefs: ColumnData[];
  currentPageNumber: number;
  limit: number;
  totalData: number;
  onPageChange?: (pageNumber: number) => void;
  onLimitChange?: (limit: number) => void;
  paginationStrategy?: PaginationStrategy;
  sortState?: { sortBy: string; sortOrder: "asc" | "desc" };
  onTogglePagination?: (sortBy: string) => void;
  disabled?: boolean;
  isLoading?: boolean;
  showCheckbox?: boolean;
  downloadFileName?: string;
  showPagination?: boolean;
  className?: string;
}

export const Table = React.forwardRef<HTMLDivElement, TableProps>(
  (
    {
      hasActions,
      rowActions,
      data,
      colDefs,
      currentPageNumber,
      limit,
      totalData,
      onPageChange,
      onLimitChange,
      paginationStrategy = PaginationStrategy.REMOTE,
      sortState,
      onTogglePagination,
      disabled,
      isLoading,
      showCheckbox,
      downloadFileName,
      showPagination = true,
      className,
    },
    ref
  ) => {
    const [activePage, setActivePage] = React.useState(currentPageNumber);
    const [activeLimit, setActiveLimit] = React.useState(limit);
    const [checkedData, setCheckedData] = React.useState<Dictionary>({});

    const onDataChecked = React.useCallback(
      (record: Record<string, string | boolean>) => {
        setCheckedData({
          ...checkedData,
          ...record,
        });
      },
      [checkedData]
    );

    const onToggleAllCheckbox = (checked: boolean) => {
      const newState = data.reduce(
        (acc, item) => ({
          ...acc,
          [item.id as string]: checked,
        }),
        {} as Dictionary
      );

      setCheckedData({
        ...newState,
        all: checked,
      });
    };

    const canDownload = () =>
      Object.values(checkedData).some((value) => value);

    const onClickDownload = () => {
      // Simple CSV download implementation
      const headers = colDefs.map((col) => col.headerName).join(",");
      const rows = data
        .filter((item) => checkedData[item.id as string])
        .map((item) =>
          colDefs
            .map((col) => {
              const value = item[col.key];
              if (typeof value === "string" || typeof value === "number") {
                return value;
              }
              return "";
            })
            .join(",")
        );

      const csv = [headers, ...rows].join("\\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${downloadFileName || "download"}.csv`;
      link.click();
    };

    const offset = (activePage - 1) * activeLimit;
    const displayData = data.slice(offset, offset + activeLimit);
    const tableData =
      paginationStrategy === PaginationStrategy.LOCAL ? displayData : data;

    return (
      <div
        ref={ref}
        className={cn(
          "w-full",
          disabled && "opacity-70 pointer-events-none",
          className
        )}
      >
        <div className="w-full overflow-x-auto overflow-y-hidden">
          <table className="min-w-full text-sm text-center border-spacing-0">
            {/* Table Header */}
            <thead>
              <tr role="row">
                {showCheckbox && (
                  <th
                    className={cn(
                      "px-4 py-3",
                      "bg-[#F9FAFB] border-b border-[#C9D0D9]",
                      "first:rounded-tl-[7px] last:rounded-tr-[7px]",
                      "transition-all duration-300"
                    )}
                  >
                    <div className="flex items-center">
                      <CheckboxInput
                        name="select-all"
                        checked={!!checkedData.all}
                        onCheckedChange={(checked) => onToggleAllCheckbox(checked as boolean)}
                      />
                      {canDownload() && (
                        <Button
                          kind={ButtonKind.Transparent}
                          size={ButtonSize.ExtraSmall}
                          onClick={onClickDownload}
                          disabled={!canDownload()}
                          className="ml-1.5 pr-0"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </th>
                )}
                {hasActions && (
                  <th
                    className={cn(
                      "px-4 py-3",
                      "bg-[#F9FAFB] border-b border-[#C9D0D9]",
                      "first:rounded-tl-[7px] last:rounded-tr-[7px]"
                    )}
                  ></th>
                )}
                {colDefs.map((column, index) => (
                  <th
                    key={index}
                    onClick={() => {
                      if (onTogglePagination) {
                        onTogglePagination(column.key);
                      }
                    }}
                    className={cn(
                      "px-4 py-5 whitespace-nowrap cursor-pointer",
                      "bg-[#F9FAFB] border-b border-[#C9D0D9]",
                      "transition-all duration-300",
                      "hover:bg-[#EFF1F4] active:bg-[#E5E7EB]",
                      "first:rounded-tl-[7px] last:rounded-tr-[7px]",
                      "relative",
                      "after:content-[''] after:absolute after:top-1/4 after:right-0",
                      "after:h-1/2 after:w-px after:bg-[rgba(201,208,217,0.5)]",
                      "last:after:hidden"
                    )}
                  >
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center justify-center">
                            <span className="font-bold text-[#92A5BA]">
                              {column.headerName}
                            </span>
                            {sortState?.sortBy === column.key && (
                              <span className="ml-2">
                                {sortState.sortOrder === "desc" ? (
                                  <ArrowDown className="w-3 h-3" />
                                ) : (
                                  <ArrowUp className="w-3 h-3" />
                                )}
                              </span>
                            )}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                          {column.headerName}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </th>
                ))}
              </tr>
            </thead>

            {/* Table Body */}
            {isLoading ? (
              <tbody>
                <tr>
                  <td
                    colSpan={
                      colDefs.length +
                      (hasActions ? 1 : 0) +
                      (showCheckbox ? 1 : 0)
                    }
                    className="py-24"
                  >
                    <div className="flex items-center justify-center">
                      <Spinner size={40} />
                    </div>
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody role="rowgroup" className="min-h-[200px]">
                {tableData?.map((item, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className={cn(
                      "w-full min-h-[200px]",
                      rowIndex % 2 === 1 && "[&>td]:bg-[#F9FAFB]"
                    )}
                  >
                    {showCheckbox && (
                      <td className="px-4 py-3">
                        <div className="flex">
                          <CheckboxInput
                            name={`check-${item.id}`}
                            checked={!!checkedData[item.id as string]}
                            onCheckedChange={(checked) =>
                              onDataChecked({
                                [item.id as string]: checked as boolean,
                              })
                            }
                          />
                        </div>
                      </td>
                    )}
                    {hasActions && (
                      <td className="px-4 py-3 pr-0">
                        <div className="flex text-[#92A5BA] transition-all duration-300 hover:opacity-80">
                          {rowActions && typeof rowActions === "function"
                            ? rowActions(item)
                            : rowActions &&
                              React.cloneElement(
                                rowActions as React.ReactElement<Record<string, unknown>>,
                                { data: item }
                              )}
                        </div>
                      </td>
                    )}
                    {colDefs.map((column, colIndex) => (
                      <td key={colIndex} className="px-4 py-3 text-center">
                        <div className="whitespace-nowrap">
                          {column.renderType === TableRenderType.HTML ? (
                            <div
                              dangerouslySetInnerHTML={{
                                __html: item[column.key] as string,
                              }}
                            />
                          ) : (
                            (item[column.key] as React.ReactNode)
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>

        {/* Pagination */}
        {totalData >= 5 && showPagination && (
          <Pagination
            currentPageNumber={currentPageNumber}
            limit={limit}
            totalData={totalData}
            onPageChange={(page) => {
              if (onPageChange) {
                onPageChange(page);
              }
              setActivePage(page);
            }}
            onChangeLimit={(newLimit) => {
              if (onLimitChange) {
                onLimitChange(newLimit);
              }
              setActiveLimit(newLimit);
            }}
          />
        )}
      </div>
    );
  }
);

Table.displayName = "Table";

export default Table;
