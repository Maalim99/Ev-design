"use client";
import * as React from "react";
import type { UseFormReturn } from "react-hook-form";
import { Drawer } from "@/components/lamt/drawer";
import { FilterExpandable } from "@/components/lamt/filter-expandable";
import { TextInput } from "@/components/lamt/text-input";
import { Button, ButtonKind, ButtonSize } from "@/components/lamt/button";
import {
  EVO_PAYMENT_FILTER_SECTIONS,
  type EvoPaymentFilterSection,
} from "@/lib/evcore/evoPaymentFilterSections";

interface EvoPaymentFiltersDrawerProps {
  opened: boolean;
  onClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formControl: UseFormReturn<any>;
  onChangeFilter: (values: Record<string, unknown>) => void;
  onResetAll: () => void;
}

export function EvoPaymentFiltersDrawer({
  opened,
  onClose,
  formControl,
  onChangeFilter,
  onResetAll,
}: EvoPaymentFiltersDrawerProps) {
  const [searchKeyword, setSearchKeyword] = React.useState("");

  const filteredSections = React.useMemo((): EvoPaymentFilterSection[] => {
    if (!searchKeyword.trim()) return EVO_PAYMENT_FILTER_SECTIONS;
    const kw = searchKeyword.toLowerCase();
    return EVO_PAYMENT_FILTER_SECTIONS
      .map(section => ({
        ...section,
        filters: section.filters.filter(
          f =>
            f.headerName.toLowerCase().includes(kw) ||
            (f.title ?? "").toLowerCase().includes(kw)
        ),
      }))
      .filter(section => section.filters.length > 0);
  }, [searchKeyword]);

  return (
    <Drawer opened={opened} onClose={onClose}>
      <div className="flex flex-col">
        {/* Drawer header — mirrors LAMT TableFilters header */}
        <div className="flex flex-col gap-3 mb-4 px-1">
          <TextInput
            name="searchFilters"
            type="text"
            placeholder="Search filters"
            onChange={e => setSearchKeyword(e.currentTarget.value)}
          />
          <div className="flex items-baseline justify-between">
            <h6 className="text-base font-semibold text-[#11171E]">Filters</h6>
            <Button
              kind={ButtonKind.Transparent}
              size={ButtonSize.Small}
              onClick={() => {
                setSearchKeyword("");
                onResetAll();
              }}
            >
              Reset all
            </Button>
          </div>
        </div>

        {/* Filter sections */}
        {filteredSections.map(section => (
          <div key={section.id} className="mb-2">
            <div className="px-4 py-2 text-[11px] font-bold text-[#92A5BA] uppercase tracking-widest border-b border-[#E8EDF2]">
              {section.title}
            </div>
            {section.filters.map(filter => (
              <FilterExpandable
                key={filter.name}
                name={filter.name}
                headerName={filter.headerName}
                title={filter.title}
                type={filter.type}
                method={filter.defaultMethod}
                options={filter.options}
                formControl={formControl}
                onChangeFilter={onChangeFilter}
              />
            ))}
          </div>
        ))}
      </div>
    </Drawer>
  );
}
