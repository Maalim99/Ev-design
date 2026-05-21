import { FilterType, Method } from "@/lib/filter-utils";
import type { DropdownOption } from "@/components/lamt/dropdown";

export interface EvoPaymentFilterField {
  name: string;
  headerName: string;
  title?: string;
  type: FilterType;
  defaultMethod: Method;
  defaultValue: string;
  options?: DropdownOption[];
  shortcut?: boolean;
}

export interface EvoPaymentFilterSection {
  id: string;
  title: string;
  filters: EvoPaymentFilterField[];
}

// ─── Options ──────────────────────────────────────────────────────────────────

const PAYMENT_CHANNEL_OPTIONS: DropdownOption[] = [
  { id: "MPESA",        name: "M-Pesa" },
  { id: "AIRTEL_MONEY", name: "Airtel Money" },
  { id: "ORANGE_MONEY", name: "Orange Money" },
];

const PAYMENT_TYPE_OPTIONS: DropdownOption[] = [
  { id: "SUBSCRIPTION", name: "Subscription" },
  { id: "RENTAL",       name: "Rental" },
];

const PAYMENT_STATUS_OPTIONS: DropdownOption[] = [
  { id: "COMPLETED", name: "Completed" },
  { id: "PENDING",   name: "Pending" },
  { id: "FAILED",    name: "Failed" },
];

const EMC_ZONE_OPTIONS: DropdownOption[] = [
  { id: "Kinshasa Nord", name: "Kinshasa Nord" },
  { id: "Kinshasa Sud",  name: "Kinshasa Sud" },
  { id: "Katanga EMC",   name: "Katanga EMC" },
  { id: "Nord-Kivu",     name: "Nord-Kivu" },
];

// ─── Filter sections ──────────────────────────────────────────────────────────

export const EVO_PAYMENT_FILTER_SECTIONS: EvoPaymentFilterSection[] = [
  {
    id: "payment",
    title: "Payment",
    filters: [
      {
        name: "paymentReference",
        headerName: "Payment Reference",
        title: "Unique payment reference assigned at recording (format: PAY-YYYYMMDD-XXXX)",
        type: FilterType.Str,
        defaultMethod: Method.Contains,
        defaultValue: "",
        shortcut: true,
      },
      {
        name: "evoCode",
        headerName: "EVO Code",
        title: "EVO Code of the operator who made this payment (format: EVO-XXXX)",
        type: FilterType.Str,
        defaultMethod: Method.Contains,
        defaultValue: "",
      },
      {
        name: "evoName",
        headerName: "EVO Name",
        title: "Full name of the Electric Vehicle Operator who made this payment",
        type: FilterType.Str,
        defaultMethod: Method.Contains,
        defaultValue: "",
      },
      {
        name: "paymentDatetime",
        headerName: "Payment Date",
        title: "Date and time the payment was recorded on the Jungle Platform (UTC)",
        type: FilterType.Date,
        defaultMethod: Method.GreaterThan,
        defaultValue: "",
      },
      {
        name: "amount",
        headerName: "Amount (USD)",
        title: "Payment amount in USD — Subscription Fee: $5 one-time; Daily Rental Fee: $6–$10 depending on rental plan",
        type: FilterType.Num,
        defaultMethod: Method.GreaterThan,
        defaultValue: "",
      },
    ],
  },
  {
    id: "classification",
    title: "Classification",
    filters: [
      {
        name: "paymentChannel",
        headerName: "Payment Channel",
        title: "Mobile money channel used for this payment (M-Pesa, Airtel Money, Orange Money — all DRC operators)",
        type: FilterType.Select,
        defaultMethod: Method.Equals,
        defaultValue: "",
        options: PAYMENT_CHANNEL_OPTIONS,
      },
      {
        name: "paymentType",
        headerName: "Payment Type",
        title: "Type of payment — Subscription: one-time $5 registration fee; Rental: daily fee per the EVO's rental plan (RF component)",
        type: FilterType.Select,
        defaultMethod: Method.Equals,
        defaultValue: "",
        options: PAYMENT_TYPE_OPTIONS,
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
        title: "Processing status of the payment — Completed: confirmed by mobile money provider; Pending: awaiting confirmation; Failed: rejected or timed out",
        type: FilterType.Select,
        defaultMethod: Method.Equals,
        defaultValue: "",
        options: PAYMENT_STATUS_OPTIONS,
      },
    ],
  },
  {
    id: "location",
    title: "Location",
    filters: [
      {
        name: "emcName",
        headerName: "EMC Zone",
        title: "E-Mobility Center zone where this payment was processed (tied to the EVO's assigned EMC)",
        type: FilterType.Select,
        defaultMethod: Method.Equals,
        defaultValue: "",
        options: EMC_ZONE_OPTIONS,
      },
    ],
  },
];

// ─── Default form values for useForm ──────────────────────────────────────────

export function getPaymentFilterDefaults(): Record<string, { method: string; value: string }> {
  const defaults: Record<string, { method: string; value: string }> = {};
  EVO_PAYMENT_FILTER_SECTIONS.forEach(section => {
    section.filters.forEach(f => {
      defaults[f.name] = { method: f.defaultMethod, value: f.defaultValue };
    });
  });
  return defaults;
}
