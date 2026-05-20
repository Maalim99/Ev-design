import type { FilterSection } from "@/components/evcore/filters/EvoFiltersDrawer";
import type { ColumnPref } from "@/components/evcore/filters/EvoPreferencesDrawer";
import { EMC_ZONES } from "@/data/dummy";

// ─── Shared filter option sets ────────────────────────────────────────────────

export const EMC_FILTER_OPTIONS = EMC_ZONES.map((z) => ({ id: z, name: z }));

export const PROVINCE_OPTIONS = [
  { id: "Kinshasa",    name: "Kinshasa" },
  { id: "Katanga",     name: "Katanga" },
  { id: "Nord-Kivu",   name: "Nord-Kivu" },
  { id: "Sud-Kivu",    name: "Sud-Kivu" },
];

// ─── Accounts ────────────────────────────────────────────────────────────────

export const ACCOUNTS_FILTER_SECTIONS: FilterSection[] = [
  {
    id: "status", label: "Status",
    options: [
      { id: "AWAITING_BGC",      name: "Awaiting BGC" },
      { id: "AWAITING_TRAINING", name: "Awaiting Training" },
      { id: "AWAITING_PAYMENT",  name: "Awaiting Payment" },
      { id: "PARTIAL_PAYMENT",   name: "Partial Payment" },
      { id: "AWAITING_HANDOVER", name: "Awaiting Handover" },
      { id: "ACTIVE",            name: "Active" },
      { id: "INACTIVE",          name: "Inactive" },
      { id: "DISENGAGED",        name: "Disengaged" },
    ],
  },
  { id: "emc", label: "EMC Zone", options: EMC_FILTER_OPTIONS },
  {
    id: "bgc", label: "BGC Decision",
    options: [
      { id: "NOT_ASSESSED",  name: "Not Assessed" },
      { id: "RECOMMENDED",   name: "Recommended" },
      { id: "REJECTED",      name: "Rejected" },
      { id: "MANUAL_REVIEW", name: "Manual Review" },
    ],
  },
  {
    id: "osp", label: "OSP Status",
    options: [
      { id: "NOT_STARTED", name: "Not Started" },
      { id: "IN_PROGRESS", name: "In Progress" },
      { id: "PASSED",      name: "Passed" },
      { id: "FAILED",      name: "Failed" },
    ],
  },
];

export const ACCOUNTS_DEFAULT_COLUMNS: ColumnPref[] = [
  { key: "evoCode",      label: "EVO Code",       visible: true,  required: true },
  { key: "fullName",     label: "Full Name",       visible: true,  required: true },
  { key: "phone",        label: "Phone",           visible: true },
  { key: "emc",          label: "EMC Zone",        visible: true },
  { key: "product",      label: "Product",         visible: true },
  { key: "status",       label: "Status",          visible: true },
  { key: "balance",      label: "Balance",         visible: true },
  { key: "bgc",          label: "BGC Decision",    visible: false },
  { key: "osp",          label: "OSP Status",      visible: false },
  { key: "rentalPlan",   label: "Rental Plan",     visible: false },
  { key: "registeredAt", label: "Registered At",   visible: false },
];

// ─── Assets ───────────────────────────────────────────────────────────────────

export const ASSETS_FILTER_SECTIONS: FilterSection[] = [
  {
    id: "status", label: "Status",
    options: [
      { id: "ON_ROAD",        name: "On Road" },
      { id: "OFF_ROAD_IDLE",  name: "Off Road – Idle" },
      { id: "OFF_ROAD_FAULTY",name: "Off Road – Faulty" },
    ],
  },
  {
    id: "evType", label: "Vehicle Type",
    options: [
      { id: "TWO_WHEELER",   name: "Two Wheel" },
      { id: "THREE_WHEELER", name: "Three Wheel" },
      { id: "CART",          name: "Cart" },
    ],
  },
  { id: "emc", label: "EMC Zone", options: EMC_FILTER_OPTIONS },
];

export const ASSETS_DEFAULT_COLUMNS: ColumnPref[] = [
  { key: "assetCode",   label: "Asset Code",   visible: true,  required: true },
  { key: "productCode", label: "Product Code", visible: true },
  { key: "evType",      label: "Type",         visible: true },
  { key: "emc",         label: "EMC",          visible: true },
  { key: "status",      label: "Status",       visible: true },
  { key: "assignedEvo", label: "Assigned EVO", visible: true },
  { key: "invoiceDate", label: "Invoice Date", visible: false },
];

// ─── BGC ─────────────────────────────────────────────────────────────────────

export const BGC_FILTER_SECTIONS: FilterSection[] = [
  {
    id: "status", label: "Status",
    options: [
      { id: "UNASSIGNED", name: "Unassigned" },
      { id: "ASSIGNED",   name: "Assigned" },
      { id: "SUBMITTED",  name: "Submitted" },
      { id: "APPROVED",   name: "Approved" },
      { id: "REJECTED",   name: "Rejected" },
    ],
  },
  { id: "province", label: "Province", options: PROVINCE_OPTIONS },
  {
    id: "agent", label: "Assigned Agent",
    options: [
      { id: "Jean-Pierre Ndinga", name: "Jean-Pierre Ndinga" },
      { id: "Patience Wa Mwila",  name: "Patience Wa Mwila" },
      { id: "Ambroise Kabong",    name: "Ambroise Kabong" },
    ],
  },
];

export const BGC_DEFAULT_COLUMNS: ColumnPref[] = [
  { key: "evo",            label: "EVO",            visible: true, required: true },
  { key: "province",       label: "Province",       visible: true },
  { key: "agent",          label: "Agent",          visible: true },
  { key: "phase",          label: "Phase",          visible: true },
  { key: "status",         label: "Status",         visible: true },
  { key: "recommendation", label: "Recommendation", visible: true },
  { key: "daysOpen",       label: "Days Open",      visible: false },
];

// ─── EMCs ────────────────────────────────────────────────────────────────────

export const EMCS_FILTER_SECTIONS: FilterSection[] = [
  {
    id: "status", label: "Status",
    options: [
      { id: "ACTIVE",   name: "Active" },
      { id: "INACTIVE", name: "Inactive" },
    ],
  },
  { id: "province", label: "Province", options: PROVINCE_OPTIONS },
];

export const EMCS_DEFAULT_COLUMNS: ColumnPref[] = [
  { key: "code",     label: "Code",     visible: true, required: true },
  { key: "name",     label: "Name",     visible: true },
  { key: "province", label: "Province", visible: true },
  { key: "manager",  label: "Manager",  visible: true },
  { key: "capacity", label: "Capacity", visible: true },
  { key: "status",   label: "Status",   visible: true },
];

// ─── OSP ─────────────────────────────────────────────────────────────────────

export const OSP_FILTER_SECTIONS: FilterSection[] = [
  {
    id: "status", label: "OSP Status",
    options: [
      { id: "NOT_STARTED", name: "Not Started" },
      { id: "IN_PROGRESS", name: "In Progress" },
      { id: "PASSED",      name: "Passed" },
      { id: "FAILED",      name: "Failed" },
    ],
  },
  { id: "emc", label: "EMC Zone", options: EMC_FILTER_OPTIONS },
];

export const OSP_DEFAULT_COLUMNS: ColumnPref[] = [
  { key: "evoCode",  label: "EVO Code",  visible: true, required: true },
  { key: "fullName", label: "Full Name", visible: true },
  { key: "emc",      label: "EMC",       visible: true },
  { key: "status",   label: "OSP Status",visible: true },
  { key: "written",  label: "Written",   visible: true },
  { key: "onroad",   label: "On-Road",   visible: true },
  { key: "result",   label: "Result",    visible: false },
];

// ─── Payments ─────────────────────────────────────────────────────────────────

export const PAYMENTS_FILTER_SECTIONS: FilterSection[] = [
  {
    id: "paymentChannel", label: "Channel",
    options: [
      { id: "MPESA",        name: "M-Pesa" },
      { id: "AIRTEL_MONEY", name: "Airtel Money" },
      { id: "ORANGE_MONEY", name: "Orange Money" },
    ],
  },
  {
    id: "paymentType", label: "Type",
    options: [
      { id: "SUBSCRIPTION", name: "Subscription" },
      { id: "RENTAL",       name: "Rental" },
    ],
  },
  {
    id: "status", label: "Status",
    options: [
      { id: "COMPLETED", name: "Completed" },
      { id: "PENDING",   name: "Pending" },
      { id: "FAILED",    name: "Failed" },
    ],
  },
  { id: "emc", label: "EMC Zone", options: EMC_FILTER_OPTIONS },
];

export const PAYMENTS_DEFAULT_COLUMNS: ColumnPref[] = [
  { key: "evoCode",    label: "EVO Code",   visible: true, required: true },
  { key: "evoName",    label: "EVO Name",   visible: true },
  { key: "emc",        label: "EMC",        visible: true },
  { key: "type",       label: "Type",       visible: true },
  { key: "amount",     label: "Amount",     visible: true },
  { key: "channel",    label: "Channel",    visible: true },
  { key: "status",     label: "Status",     visible: true },
  { key: "activation", label: "Activation", visible: false },
  { key: "date",       label: "Date",       visible: true },
];

// ─── Plans ────────────────────────────────────────────────────────────────────

export const PLANS_FILTER_SECTIONS: FilterSection[] = [
  {
    id: "status", label: "Status",
    options: [
      { id: "ACTIVE",   name: "Active" },
      { id: "INACTIVE", name: "Inactive" },
    ],
  },
  {
    id: "product", label: "Product",
    options: [
      { id: "ALTECH-F3-2B",   name: "ALTECH-F3-2B" },
      { id: "ALTECH-E3-2B",   name: "ALTECH-E3-2B" },
      { id: "ALTECH-T1-2B",   name: "ALTECH-T1-2B" },
      { id: "ALTECH-ECAT-A1", name: "ALTECH-ECAT-A1" },
    ],
  },
];

export const PLANS_DEFAULT_COLUMNS: ColumnPref[] = [
  { key: "code",    label: "Code",             visible: true, required: true },
  { key: "name",    label: "Name",             visible: true },
  { key: "product", label: "Product",          visible: true },
  { key: "sf",      label: "Subscription Fee", visible: true },
  { key: "rf",      label: "Daily Rate",       visible: true },
  { key: "rp",      label: "Rental Period",    visible: true },
  { key: "tcv",     label: "Contract Value",   visible: false },
  { key: "evos",    label: "EVOs",             visible: true },
  { key: "status",  label: "Status",           visible: true },
];

// ─── Products ─────────────────────────────────────────────────────────────────

export const PRODUCTS_FILTER_SECTIONS: FilterSection[] = [
  {
    id: "evType", label: "EV Type",
    options: [
      { id: "TWO_WHEELER",   name: "Two-Wheeler" },
      { id: "THREE_WHEELER", name: "Three-Wheeler" },
      { id: "CART",          name: "Cart" },
    ],
  },
  {
    id: "status", label: "Status",
    options: [
      { id: "ACTIVE",   name: "Active" },
      { id: "INACTIVE", name: "Inactive" },
    ],
  },
];

export const PRODUCTS_DEFAULT_COLUMNS: ColumnPref[] = [
  { key: "code",         label: "Product Code",  visible: true, required: true },
  { key: "type",         label: "Type",          visible: true },
  { key: "label",        label: "Label",         visible: true },
  { key: "evType",       label: "EV Type",       visible: true },
  { key: "activeAssets", label: "Active Assets", visible: true },
  { key: "status",       label: "Status",        visible: false },
];
