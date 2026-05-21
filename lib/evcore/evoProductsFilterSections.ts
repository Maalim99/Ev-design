import { FilterType, Method } from "@/lib/filter-utils";
import type { DropdownOption } from "@/components/lamt/dropdown";

export interface EvoProductsFilterField {
  name: string;
  headerName: string;
  title?: string;
  type: FilterType;
  defaultMethod: Method;
  defaultValue: string;
  options?: DropdownOption[];
  shortcut?: boolean;
}

export interface EvoProductsFilterSection {
  id: string;
  title: string;
  filters: EvoProductsFilterField[];
}

// ─── Options ──────────────────────────────────────────────────────────────────

const EV_TYPE_OPTIONS: DropdownOption[] = [
  { id: "TWO_WHEELER",   name: "Two-Wheeler" },
  { id: "THREE_WHEELER", name: "Three-Wheeler" },
  { id: "CART",          name: "Cart" },
];

const PRODUCT_STATUS_OPTIONS: DropdownOption[] = [
  { id: "ACTIVE",   name: "Active" },
  { id: "INACTIVE", name: "Inactive" },
];

// ─── Filter sections ──────────────────────────────────────────────────────────

export const EVO_PRODUCTS_FILTER_SECTIONS: EvoProductsFilterSection[] = [
  {
    id: "product",
    title: "Product",
    filters: [
      {
        name: "code",
        headerName: "Product Code",
        title: "Unique product code (e.g. ALTECH-F3-2B). Used across EVO accounts, fleet assets and rental plans.",
        type: FilterType.Str,
        defaultMethod: Method.Contains,
        defaultValue: "",
        shortcut: true,
      },
      {
        name: "label",
        headerName: "Label",
        title: "Human-readable product name (e.g. F3 Premium, Tricycle T1)",
        type: FilterType.Str,
        defaultMethod: Method.Contains,
        defaultValue: "",
      },
      {
        name: "evType",
        headerName: "EV Type",
        title: "Vehicle class — Two-Wheeler: motorcycle/scooter; Three-Wheeler: tricycle; Cart: electric cargo cart",
        type: FilterType.Select,
        defaultMethod: Method.Equals,
        defaultValue: "",
        options: EV_TYPE_OPTIONS,
      },
    ],
  },
  {
    id: "status",
    title: "Status",
    filters: [
      {
        name: "status",
        headerName: "Status",
        title: "Whether this product is currently active and available for new asset assignments",
        type: FilterType.Select,
        defaultMethod: Method.Equals,
        defaultValue: "",
        options: PRODUCT_STATUS_OPTIONS,
      },
    ],
  },
];

// ─── Default form values for useForm ──────────────────────────────────────────

export function getProductsFilterDefaults(): Record<string, { method: string; value: string }> {
  const defaults: Record<string, { method: string; value: string }> = {};
  EVO_PRODUCTS_FILTER_SECTIONS.forEach(section => {
    section.filters.forEach(f => {
      defaults[f.name] = { method: f.defaultMethod, value: f.defaultValue };
    });
  });
  return defaults;
}
