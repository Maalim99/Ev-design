import * as React from "react";
import type { EvoStatus } from "@/data/dummy";
import { EVO_STATUS_LABELS, EVO_STATUS_STYLES } from "@/lib/evcore/constants";

interface EvoStatusChipProps {
  status: EvoStatus;
  size?: "sm" | "md";
}

export function EvoStatusChip({ status, size = "md" }: EvoStatusChipProps) {
  const { bg, text } = EVO_STATUS_STYLES[status];
  const label = EVO_STATUS_LABELS[status];

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        height: size === "sm" ? 20 : 22,
        padding: size === "sm" ? "0 7px" : "0 9px",
        borderRadius: 99,
        backgroundColor: bg,
        color: text,
        fontSize: size === "sm" ? 10 : 11,
        fontWeight: 600,
        whiteSpace: "nowrap",
        letterSpacing: "0.02em",
      }}
    >
      <span
        style={{
          width: 5,
          height: 5,
          borderRadius: "50%",
          backgroundColor: text,
          flexShrink: 0,
        }}
      />
      {label}
    </span>
  );
}
