import { FilterType, Method } from "@/lib/filter-utils";
import type { DropdownOption } from "@/components/lamt/dropdown";

export interface EvoFilterField {
  name: string;
  headerName: string;
  title?: string;
  type: FilterType;
  defaultMethod: Method;
  defaultValue: string;
  options?: DropdownOption[];
  shortcut?: boolean;
}

export interface EvoFilterSection {
  id: string;
  title: string;
  filters: EvoFilterField[];
}

// ─── Options ──────────────────────────────────────────────────────────────────

const EVO_STATUS_OPTIONS: DropdownOption[] = [
  { id: "AWAITING_BGC",      name: "Awaiting BGC" },
  { id: "AWAITING_TRAINING", name: "Awaiting Training" },
  { id: "AWAITING_PAYMENT",  name: "Awaiting Payment" },
  { id: "PARTIAL_PAYMENT",   name: "Partial Payment" },
  { id: "AWAITING_HANDOVER", name: "Awaiting Handover" },
  { id: "ACTIVE",            name: "Active" },
  { id: "INACTIVE",          name: "Inactive" },
  { id: "DISENGAGED",        name: "Disengaged" },
];

const BGC_DECISION_OPTIONS: DropdownOption[] = [
  { id: "NOT_ASSESSED",  name: "Not Assessed" },
  { id: "RECOMMENDED",   name: "Recommended" },
  { id: "REJECTED",      name: "Rejected" },
  { id: "MANUAL_REVIEW", name: "Manual Review" },
];

const OSP_STATUS_OPTIONS: DropdownOption[] = [
  { id: "NOT_STARTED", name: "Not Started" },
  { id: "IN_PROGRESS", name: "In Progress" },
  { id: "PASSED",      name: "Passed" },
  { id: "FAILED",      name: "Failed" },
];

const EMC_ZONE_OPTIONS: DropdownOption[] = [
  { id: "Kinshasa Nord", name: "Kinshasa Nord" },
  { id: "Kinshasa Sud",  name: "Kinshasa Sud" },
  { id: "Katanga EMC",   name: "Katanga EMC" },
  { id: "Nord-Kivu",     name: "Nord-Kivu" },
];

// ─── Filter sections (LAMT pattern, EVO data from specs) ──────────────────────

export const EVO_ACCOUNT_FILTER_SECTIONS: EvoFilterSection[] = [
  {
    id: "evo",
    title: "EVO",
    filters: [
      {
        name: "evoCode",
        headerName: "EVO Code",
        title: "Unique EVO identifier assigned at registration (e.g. EVO-1001)",
        type: FilterType.Str,
        defaultMethod: Method.Contains,
        defaultValue: "",
      },
      {
        name: "fullName",
        headerName: "Full Name",
        title: "Full legal name of the Electric Vehicle Operator",
        type: FilterType.Str,
        defaultMethod: Method.Contains,
        defaultValue: "",
      },
      {
        name: "phone",
        headerName: "Phone Number",
        title: "EVO primary DRC phone number (+243)",
        type: FilterType.Phone,
        defaultMethod: Method.Contains,
        defaultValue: "",
      },
      {
        name: "registeredAt",
        headerName: "Registered At",
        title: "Date the EVO was registered on the Jungle Platform",
        type: FilterType.Date,
        defaultMethod: Method.GreaterThan,
        defaultValue: "",
      },
      {
        name: "lastPaymentDate",
        headerName: "Last Payment Date",
        title: "Date of the most recent rental fee (RF) payment",
        type: FilterType.Date,
        defaultMethod: Method.GreaterThan,
        defaultValue: "",
      },
      {
        name: "rentalPlan",
        headerName: "Rental Plan",
        title: "Rental plan assigned to this EVO (format: SF{x}.RF{y}.RP{z} — subscription fee, daily rental fee, rental period in months)",
        type: FilterType.Str,
        defaultMethod: Method.Contains,
        defaultValue: "",
      },
    ],
  },
  {
    id: "accountStatus",
    title: "Account Status",
    filters: [
      {
        name: "status",
        headerName: "Account Status",
        title: "Current lifecycle status of the EVO account (Awaiting BGC → Awaiting Training → Awaiting Payment → Active → Inactive / Disengaged)",
        type: FilterType.Select,
        defaultMethod: Method.Equals,
        defaultValue: "",
        options: EVO_STATUS_OPTIONS,
      },
      {
        name: "balance",
        headerName: "Balance (USD)",
        title: "Outstanding rental balance on the account in USD",
        type: FilterType.Num,
        defaultMethod: Method.GreaterThan,
        defaultValue: "",
      },
    ],
  },
  {
    id: "bgc",
    title: "BGC",
    filters: [
      {
        name: "bgcDecision",
        headerName: "BGC Decision",
        title: "Result of the 3-phase Background Check conducted by AAROVE field agent (Phase 1: Operator residence, Phase 2: Sponsor residence, Phase 3: Neighbor verification)",
        type: FilterType.Select,
        defaultMethod: Method.Equals,
        defaultValue: "",
        options: BGC_DECISION_OPTIONS,
      },
    ],
  },
  {
    id: "osp",
    title: "OSP Training",
    filters: [
      {
        name: "ospStatus",
        headerName: "OSP Status",
        title: "Status of the Operator Support Package training — written (10 questions) and on-road (12 items) evaluations, pass threshold: ≥ 70 on both",
        type: FilterType.Select,
        defaultMethod: Method.Equals,
        defaultValue: "",
        options: OSP_STATUS_OPTIONS,
      },
      {
        name: "ospWrittenScore",
        headerName: "Written Score",
        title: "Written evaluation score out of 100 (10 questions covering road safety, customer service, environmental and payment topics). Pass: ≥ 70",
        type: FilterType.Num,
        defaultMethod: Method.GreaterThan,
        defaultValue: "",
      },
      {
        name: "ospOnroadScore",
        headerName: "On-Road Score",
        title: "On-road evaluation score out of 100 (12 items covering technical, driving and safety skills). Pass: ≥ 70",
        type: FilterType.Num,
        defaultMethod: Method.GreaterThan,
        defaultValue: "",
      },
    ],
  },
  {
    id: "emcAsset",
    title: "EMC & Asset",
    filters: [
      {
        name: "emcZone",
        headerName: "EMC Zone",
        title: "E-Mobility Center zone assigned to this EVO (Kinshasa Nord, Kinshasa Sud, Katanga EMC, Nord-Kivu)",
        type: FilterType.Select,
        defaultMethod: Method.Equals,
        defaultValue: "",
        options: EMC_ZONE_OPTIONS,
      },
      {
        name: "assetSerialNumber",
        headerName: "Asset Serial Number",
        title: "Serial number (assetKey) of the EV frame assigned to this EVO via VCU handover (1 EV frame + 2 batteries)",
        type: FilterType.Str,
        defaultMethod: Method.Contains,
        defaultValue: "",
        shortcut: true,
      },
      {
        name: "paymentReference",
        headerName: "Payment Reference",
        title: "Most recent payment reference for this EVO (format: PAY-YYYYMMDD-XXXX)",
        type: FilterType.Str,
        defaultMethod: Method.Contains,
        defaultValue: "",
        shortcut: true,
      },
    ],
  },
];

// ─── Default form values for useForm ──────────────────────────────────────────

export function getEvoFilterDefaults(): Record<string, { method: string; value: string }> {
  const defaults: Record<string, { method: string; value: string }> = {};
  EVO_ACCOUNT_FILTER_SECTIONS.forEach(section => {
    section.filters.forEach(f => {
      defaults[f.name] = { method: f.defaultMethod, value: f.defaultValue };
    });
  });
  return defaults;
}
