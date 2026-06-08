"use client";

import * as React from "react";
import { Drawer } from "@/components/lamt/drawer";
import { TextInput } from "@/components/lamt/text-input";
import { Button, ButtonKind, ButtonSize } from "@/components/lamt/button";
import { CheckboxInput } from "@/components/lamt/checkbox-input";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FilterOption {
  id: string;
  name: string;
}

export interface FilterSection {
  id: string;
  label: string;
  options: FilterOption[];
}

export interface EvoFiltersDrawerProps {
  opened: boolean;
  onClose: () => void;
  sections: FilterSection[];
  values: Record<string, string[]>;
  onChange: (sectionId: string, selected: string[]) => void;
  onReset: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function EvoFiltersDrawer({
  opened,
  onClose,
  sections,
  values,
  onChange,
  onReset,
}: EvoFiltersDrawerProps) {
  const [search, setSearch] = React.useState("");

  const visibleSections = React.useMemo(() => {
    if (!search.trim()) return sections;
    const q = search.toLowerCase();
    return sections
      .map((s) => ({
        ...s,
        options: s.options.filter((o) => o.name.toLowerCase().includes(q)),
      }))
      .filter((s) => s.options.length > 0 || s.label.toLowerCase().includes(q));
  }, [sections, search]);

  const totalActive = Object.values(values).reduce(
    (acc, arr) => acc + arr.length,
    0
  );

  return (
    <Drawer title="Filters" opened={opened} onClose={onClose}>
      <div className="flex flex-col gap-4">
        {/* Header actions */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {totalActive} active
          </span>
          <Button kind={ButtonKind.Transparent} size={ButtonSize.Small} onClick={onReset}>
            Reset all
          </Button>
        </div>

        {/* Search filters */}
        <TextInput
          name="filterSearch"
          placeholder="Search filters…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Filter sections */}
        <div className="flex flex-col gap-5 overflow-y-auto max-h-[calc(100vh-220px)] pr-1">
          {visibleSections.map((section) => {
            const selected = values[section.id] ?? [];
            return (
              <div key={section.id} className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {section.label}
                  </span>
                  {selected.length > 0 && (
                    <button
                      className="text-xs text-lamt-primary hover:underline"
                      onClick={() => onChange(section.id, [])}
                    >
                      Clear
                    </button>
                  )}
                </div>
                {section.options.map((opt) => (
                  <CheckboxInput
                    key={opt.id}
                    name={`${section.id}-${opt.id}`}
                    label={opt.name}
                    checked={selected.includes(opt.id)}
                    onCheckedChange={(checked) => {
                      const next = checked
                        ? [...selected, opt.id]
                        : selected.filter((v) => v !== opt.id);
                      onChange(section.id, next);
                    }}
                  />
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </Drawer>
  );
}
