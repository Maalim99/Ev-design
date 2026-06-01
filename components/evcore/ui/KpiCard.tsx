import * as React from "react";
import { type LucideIcon } from "lucide-react";
import { EVCORE_COLORS } from "@/lib/evcore/constants";

interface KpiCardProps {
  label: string;
  value: string;
  delta: string;
  deltaType: "positive" | "negative" | "neutral";
  icon: LucideIcon;
}

export function KpiCard({
  label,
  value,
  delta,
  deltaType,
  icon: Icon,
}: KpiCardProps) {
  const deltaColor =
    deltaType === "positive"
      ? EVCORE_COLORS.green
      : deltaType === "negative"
        ? EVCORE_COLORS.danger
        : EVCORE_COLORS.textSecondary;

  return (
    <div
      style={{
        backgroundColor: EVCORE_COLORS.white,
        border: `0.5px solid ${EVCORE_COLORS.kpiBorder}`,
        borderRadius: 12,
        padding: "20px 20px 18px",
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: EVCORE_COLORS.textSecondary,
            textTransform: "uppercase",
            letterSpacing: "0.07em",
          }}
        >
          {label}
        </span>
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 6,
            backgroundColor: "#EBF8F3",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Icon size={15} color={EVCORE_COLORS.green} strokeWidth={1.75} />
        </div>
      </div>

      <div>
        <div
          style={{
            fontSize: value.length > 8 ? 16 : value.length > 5 ? 22 : 30,
            fontWeight: 700,
            color: EVCORE_COLORS.textPrimary,
            lineHeight: 1,
            letterSpacing: "-0.02em",
          }}
        >
          {value}
        </div>
        <div
          style={{
            fontSize: 11,
            color: deltaColor,
            marginTop: 7,
            fontWeight: 500,
          }}
        >
          {delta}
        </div>
      </div>
    </div>
  );
}
