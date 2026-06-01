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
  PENDING_BGC:      "Pending BGC",
  PENDING_OSP: "Pending OSP",
  PENDING_RP:  "Pending RP",
  PARTIAL_RP:   "Partial RP",
  PENDING_HO: "Pending HO",
  ACTIVE:            "Active",
  INACTIVE:          "Inactive",
  DISENGAGED:        "Disengaged",
};

export const EVO_STATUS_STYLES: Record<EvoStatus, { bg: string; text: string }> = {
  ACTIVE:            { bg: "#E1F5EE", text: "#0F6E56" },
  PENDING_BGC:      { bg: "#FAEEDA", text: "#854F0B" },
  PENDING_OSP: { bg: "#E6F1FB", text: "#185FA5" },
  PENDING_RP:  { bg: "#F0EAFB", text: "#5B21B6" },
  PARTIAL_RP:   { bg: "#E0F2F1", text: "#00695C" },
  PENDING_HO: { bg: "#EEF2FF", text: "#3730A3" },
  INACTIVE:          { bg: "#F3F3F1", text: "#6B7280" },
  DISENGAGED:        { bg: "#FEE2E2", text: "#991B1B" },
};

// Allowed status transitions
export const EVO_STATUS_TRANSITIONS: Record<EvoStatus, EvoStatus[]> = {
  PENDING_BGC:      ["PENDING_OSP", "DISENGAGED"],
  PENDING_OSP: ["PENDING_RP",  "DISENGAGED"],
  PENDING_RP:  ["PARTIAL_RP", "PENDING_HO", "DISENGAGED"],
  PARTIAL_RP:   ["PENDING_RP", "PENDING_HO", "DISENGAGED"],
  PENDING_HO: ["ACTIVE",            "DISENGAGED"],
  ACTIVE:            ["INACTIVE",          "DISENGAGED"],
  INACTIVE:          ["ACTIVE",            "DISENGAGED"],
  DISENGAGED:        ["PENDING_BGC"],
};
