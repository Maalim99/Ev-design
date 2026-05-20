"use client";

import * as React from "react";
import { Drawer } from "@/components/lamt/drawer";
import { Button, ButtonKind, ButtonSize } from "@/components/lamt/button";
import { TextInput } from "@/components/lamt/text-input";
import { CheckboxInput } from "@/components/lamt/checkbox-input";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ColumnPref {
  key: string;
  label: string;
  /** whether the column is currently visible */
  visible: boolean;
  /** columns marked required cannot be hidden */
  required?: boolean;
}

export interface EvoPreferencesDrawerProps {
  opened: boolean;
  onClose: () => void;
  columns: ColumnPref[];
  onChange: (key: string, visible: boolean) => void;
  onReset: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function EvoPreferencesDrawer({
  opened,
  onClose,
  columns,
  onChange,
  onReset,
}: EvoPreferencesDrawerProps) {
  const [search, setSearch] = React.useState("");

  const visible = React.useMemo(() => {
    if (!search.trim()) return columns;
    const q = search.toLowerCase();
    return columns.filter((c) => c.label.toLowerCase().includes(q));
  }, [columns, search]);

  return (
    <Drawer title="Preferences" opened={opened} onClose={onClose}>
      <div className="flex flex-col gap-4">
        {/* Header actions */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Column visibility</span>
          <Button kind={ButtonKind.Transparent} size={ButtonSize.Small} onClick={onReset}>
            Reset all
          </Button>
        </div>

        {/* Search columns */}
        <TextInput
          name="prefSearch"
          placeholder="Search preferences…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Column toggles */}
        <div className="flex flex-col gap-3 overflow-y-auto max-h-[calc(100vh-220px)] pr-1">
          {visible.map((col) => (
            <CheckboxInput
              key={col.key}
              name={`pref-${col.key}`}
              label={col.label}
              checked={col.visible}
              disabled={col.required}
              onCheckedChange={(checked) => onChange(col.key, checked as boolean)}
            />
          ))}
        </div>
      </div>
    </Drawer>
  );
}
