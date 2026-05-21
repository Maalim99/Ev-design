import { FilterType, Method } from "@/lib/filter-utils";
import type { DropdownOption } from "@/components/lamt/dropdown";

export interface EvoPlansFilterField {
  name: string;
  headerName: string;
  title?: string;
  type: FilterType;
  defaultMethod: Method;
  defaultValue: string;
  options?: DropdownOption[];
  shortcut?: boolean;
}

export interface EvoPlansFilterSection {
  id: string;
  title: string;
  filters: EvoPlansFilterField[];
}

// ─── Options ──────────────────────────────────────────────────────────────────

const PLAN_STATUS_OPTIONS: DropdownOption[] = [
  { id: "ACTIVE",   name: "Active" },
  { id: "INACTIVE", name: "Inactive" },
];

const PRODUCT_CODE_OPTIONS: DropdownOption[] = [
  { id: "ALTECH-F3-2B",   name: "ALTECH-F3-2B" },
  { id: "ALTECH-E3-2B",   name: "ALTECH-E3-2B" },
  { id: "ALTECH-T1-2B",   name: "ALTECH-T1-2B" },
  { id: "ALTECH-ECAT-A1", name: "ALTECH-ECAT-A1" },
];

// ─── Filter sections ──────────────────────────────────────────────────────────

export const EVO_PLANS_FILTER_SECTIONS: EvoPlansFilterSection[] = [
  {
    id: "plan",
    title: "Plan",
    filters: [
      {
        name: "code",
        headerName: "Plan Code",
        title: "Unique plan code in SF{X}.RF{Y}.RP{Z} format — Subscription Fee, Daily Rental Fee, Rental Period in months",
        type: FilterType.Str,
        defaultMethod: Method.Contains,
        defaultValue: "",
        shortcut: true,
      },
      {
        name: "name",
        headerName: "Plan Name",
        title: "Descriptive name of the rental plan (e.g. F3 Premium 36M)",
        type: FilterType.Str,
        defaultMethod: Method.Contains,
        defaultValue: "",
      },
      {
        name: "productCode",
        headerName: "Product Code",
        title: "EV product this plan applies to (e.g. ALTECH-F3-2B = F3 two-wheeler, ALTECH-T1-2B = T1 tricycle)",
        type: FilterType.Select,
        defaultMethod: Method.Equals,
        defaultValue: "",
        options: PRODUCT_CODE_OPTIONS,
      },
    ],
  },
  {
    id: "fees",
    title: "Fees",
    filters: [
      {
        name: "subscriptionFee",
        headerName: "Subscription Fee ($)",
        title: "One-time registration fee charged to the EVO on enrolment (USD)",
        type: FilterType.Num,
        defaultMethod: Method.GreaterThan,
        defaultValue: "",
      },
      {
        name: "dailyRentalFee",
        headerName: "Daily Rental Fee ($)",
        title: "Daily rental rate charged Mon–Sat (USD). Sunday rate is separate and reduced.",
        type: FilterType.Num,
        defaultMethod: Method.GreaterThan,
        defaultValue: "",
      },
      {
        name: "rentalPeriodMonths",
        headerName: "Rental Period (months)",
        title: "Contract duration in months before the EVO owns the vehicle outright",
        type: FilterType.Num,
        defaultMethod: Method.Equals,
        defaultValue: "",
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
        title: "Whether this plan is currently active and available for new EVO enrolments",
        type: FilterType.Select,
        defaultMethod: Method.Equals,
        defaultValue: "",
        options: PLAN_STATUS_OPTIONS,
      },
    ],
  },
];

// ─── Default form values for useForm ──────────────────────────────────────────

export function getPlansFilterDefaults(): Record<string, { method: string; value: string }> {
  const defaults: Record<string, { method: string; value: string }> = {};
  EVO_PLANS_FILTER_SECTIONS.forEach(section => {
    section.filters.forEach(f => {
      defaults[f.name] = { method: f.defaultMethod, value: f.defaultValue };
    });
  });
  return defaults;
}
