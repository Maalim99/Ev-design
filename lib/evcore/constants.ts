import type { EvoStatus } from "@/data/dummy";

export const EVCORE_COLORS = {
  green: "#1D9E75",
  greenLight: "#9FE1CB",
  blue: "#378ADD",
  amber: "#EF9F27",
  gray: "#B4B2A9",
  border: "#E5E5E0",
  kpiBorder: "#1D9E75",
  pageBg: "#F7F6F2",
  textPrimary: "#11171E",
  textSecondary: "#888780",
  white: "#FFFFFF",
  danger: "#C0392B",
} as const;

export const BADGE_STYLES = {
  BGC: { bg: "#FAEEDA", text: "#854F0B" },
  OSP: { bg: "#E6F1FB", text: "#185FA5" },
  Asset: { bg: "#E1F5EE", text: "#0F6E56" },
} as const;

export const ACTIVITY_DOT_COLORS = {
  success: "#1D9E75",
  warning: "#EF9F27",
  info: "#378ADD",
} as const;

// ─── EVO status ──────────────────────────────────────────────────────────────

export const EVO_STATUS_LABELS: Record<EvoStatus, string> = {
  AWAITING_BGC:      "Awaiting BGC",
  AWAITING_TRAINING: "Awaiting Training",
  AWAITING_PAYMENT:  "Awaiting Payment",
  PARTIAL_PAYMENT:   "Partial Payment",
  AWAITING_HANDOVER: "Awaiting Handover",
  ACTIVE:            "Active",
  INACTIVE:          "Inactive",
  DISENGAGED:        "Disengaged",
};

export const EVO_STATUS_STYLES: Record<EvoStatus, { bg: string; text: string }> = {
  ACTIVE:            { bg: "#E1F5EE", text: "#0F6E56" },
  AWAITING_BGC:      { bg: "#FAEEDA", text: "#854F0B" },
  AWAITING_TRAINING: { bg: "#E6F1FB", text: "#185FA5" },
  AWAITING_PAYMENT:  { bg: "#F0EAFB", text: "#5B21B6" },
  PARTIAL_PAYMENT:   { bg: "#E0F2F1", text: "#00695C" },
  AWAITING_HANDOVER: { bg: "#EEF2FF", text: "#3730A3" },
  INACTIVE:          { bg: "#F3F3F1", text: "#6B7280" },
  DISENGAGED:        { bg: "#FEE2E2", text: "#991B1B" },
};

// Allowed status transitions
export const EVO_STATUS_TRANSITIONS: Record<EvoStatus, EvoStatus[]> = {
  AWAITING_BGC:      ["AWAITING_TRAINING", "DISENGAGED"],
  AWAITING_TRAINING: ["AWAITING_PAYMENT",  "DISENGAGED"],
  AWAITING_PAYMENT:  ["PARTIAL_PAYMENT", "AWAITING_HANDOVER", "DISENGAGED"],
  PARTIAL_PAYMENT:   ["AWAITING_PAYMENT", "AWAITING_HANDOVER", "DISENGAGED"],
  AWAITING_HANDOVER: ["ACTIVE",            "DISENGAGED"],
  ACTIVE:            ["INACTIVE",          "DISENGAGED"],
  INACTIVE:          ["ACTIVE",            "DISENGAGED"],
  DISENGAGED:        ["AWAITING_BGC"],
};
