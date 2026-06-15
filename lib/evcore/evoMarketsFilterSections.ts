import { FilterType, Method } from "@/lib/filter-utils";
import type { DropdownOption } from "@/components/lamt/dropdown";
import type { ColumnPref } from "@/components/lamt/evo-preferences-drawer";

export interface EvoMarketsFilterField {
  name: string;
  headerName: string;
  title?: string;
  type: FilterType;
  defaultMethod: Method;
  defaultValue: string;
  options?: DropdownOption[];
  shortcut?: boolean;
}

export interface EvoMarketsFilterSection {
  id: string;
  title: string;
  filters: EvoMarketsFilterField[];
}

const COUNTRY_OPTIONS: DropdownOption[] = [
  { id: "DRC", name: "DRC — Dem. Rep. of Congo" },
  { id: "RWA", name: "RWA — Rwanda" },
  { id: "UGA", name: "UGA — Uganda" },
  { id: "BDI", name: "BDI — Burundi" },
  { id: "TZA", name: "TZA — Tanzania" },
];

// ─── Countries ────────────────────────────────────────────────────────────────

export const COUNTRY_FILTER_SECTIONS: EvoMarketsFilterSection[] = [
  {
    id: "country",
    title: "Country",
    filters: [
      { name: "name",       headerName: "Name",        type: FilterType.Str,    defaultMethod: Method.Contains, defaultValue: "", shortcut: true },
      { name: "frenchName", headerName: "French Name", type: FilterType.Str,    defaultMethod: Method.Contains, defaultValue: "" },
      { name: "acronym",    headerName: "Acronym",     type: FilterType.Str,    defaultMethod: Method.Equals,   defaultValue: "" },
    ],
  },
];

export function getCountryFilterDefaults() {
  const d: Record<string, { method: string; value: string }> = {};
  COUNTRY_FILTER_SECTIONS.forEach(s => s.filters.forEach(f => { d[f.name] = { method: f.defaultMethod, value: f.defaultValue }; }));
  return d;
}

// ─── Zones ────────────────────────────────────────────────────────────────────

export const ZONE_FILTER_SECTIONS: EvoMarketsFilterSection[] = [
  {
    id: "zone",
    title: "Zone",
    filters: [
      { name: "name",    headerName: "Zone Name", type: FilterType.Str,    defaultMethod: Method.Contains, defaultValue: "", shortcut: true },
      { name: "country", headerName: "Country",   type: FilterType.Select, defaultMethod: Method.Equals,   defaultValue: "", options: COUNTRY_OPTIONS },
    ],
  },
];

export function getZoneFilterDefaults() {
  const d: Record<string, { method: string; value: string }> = {};
  ZONE_FILTER_SECTIONS.forEach(s => s.filters.forEach(f => { d[f.name] = { method: f.defaultMethod, value: f.defaultValue }; }));
  return d;
}

// ─── Cities ───────────────────────────────────────────────────────────────────

export const CITY_FILTER_SECTIONS: EvoMarketsFilterSection[] = [
  {
    id: "city",
    title: "City",
    filters: [
      { name: "name",    headerName: "City Name", type: FilterType.Str,    defaultMethod: Method.Contains, defaultValue: "", shortcut: true },
      { name: "zone",    headerName: "Zone",      type: FilterType.Str,    defaultMethod: Method.Contains, defaultValue: "" },
      { name: "country", headerName: "Country",   type: FilterType.Select, defaultMethod: Method.Equals,   defaultValue: "", options: COUNTRY_OPTIONS },
    ],
  },
];

export function getCityFilterDefaults() {
  const d: Record<string, { method: string; value: string }> = {};
  CITY_FILTER_SECTIONS.forEach(s => s.filters.forEach(f => { d[f.name] = { method: f.defaultMethod, value: f.defaultValue }; }));
  return d;
}

// ─── EMC ──────────────────────────────────────────────────────────────────────

export const EMC_MARKETS_FILTER_SECTIONS: EvoMarketsFilterSection[] = [
  {
    id: "emc",
    title: "EMC",
    filters: [
      { name: "code",    headerName: "EMC Code", type: FilterType.Str,    defaultMethod: Method.Contains, defaultValue: "", shortcut: true },
      { name: "name",    headerName: "Name",     type: FilterType.Str,    defaultMethod: Method.Contains, defaultValue: "" },
      { name: "zone",    headerName: "Zone",     type: FilterType.Str,    defaultMethod: Method.Contains, defaultValue: "" },
    ],
  },
];

export function getEmcMarketsFilterDefaults() {
  const d: Record<string, { method: string; value: string }> = {};
  EMC_MARKETS_FILTER_SECTIONS.forEach(s => s.filters.forEach(f => { d[f.name] = { method: f.defaultMethod, value: f.defaultValue }; }));
  return d;
}

// ─── Default column prefs ─────────────────────────────────────────────────────

export const COUNTRY_DEFAULT_COLUMNS: ColumnPref[] = [
  { key: "name",          label: "Name",         visible: true,  required: true },
  { key: "frenchName",    label: "French Name",  visible: true,  required: false },
  { key: "acronym",       label: "Acronym",      visible: true,  required: false },
  { key: "numberOfZones", label: "# Zones",      visible: true,  required: false },
  { key: "createdAt",     label: "Created",      visible: false, required: false },
];

export const ZONE_DEFAULT_COLUMNS: ColumnPref[] = [
  { key: "name",           label: "Name",     visible: true,  required: true },
  { key: "country",        label: "Country",  visible: true,  required: false },
  { key: "numberOfCities", label: "# Cities", visible: true,  required: false },
  { key: "createdAt",      label: "Created",  visible: false, required: false },
];

export const CITY_DEFAULT_COLUMNS: ColumnPref[] = [
  { key: "name",        label: "Name",    visible: true,  required: true },
  { key: "zone",        label: "Zone",    visible: true,  required: false },
  { key: "country",     label: "Country", visible: true,  required: false },
  { key: "numberOfEmcs",label: "# EMCs",  visible: true,  required: false },
  { key: "createdAt",   label: "Created", visible: false, required: false },
];

export const EMC_MARKETS_DEFAULT_COLUMNS: ColumnPref[] = [
  { key: "code",           label: "Code",    visible: true,  required: true },
  { key: "name",           label: "Name",    visible: true,  required: false },
  { key: "zone",           label: "Zone",    visible: true,  required: false },
  { key: "manager",        label: "Manager", visible: true,  required: false },
  { key: "operatingHours", label: "Hours",   visible: false, required: false },
  { key: "status",         label: "Status",  visible: true,  required: false },
];
