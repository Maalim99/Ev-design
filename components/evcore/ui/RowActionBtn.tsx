import * as React from "react";

const VARIANTS = {
  default: { border: "#C8C7C1", bg: "#EEEDEA", color: "#3D3C38" },
  green:   { border: "#7DCDB0", bg: "#D8F3EA", color: "#0F6E56" },
  blue:    { border: "#93B8E8", bg: "#DCECf9", color: "#185FA5" },
  amber:   { border: "#F6C97A", bg: "#FEF3DC", color: "#854F0B" },
  danger:  { border: "#F5A8A8", bg: "#FEE2E2", color: "#991B1B" },
  purple:  { border: "#C4B0E8", bg: "#F0EAFB", color: "#5B21B6" },
} as const;

export type RowActionVariant = keyof typeof VARIANTS;

interface RowActionBtnProps {
  icon: React.ReactNode;
  title: string;
  onClick: () => void;
  variant?: RowActionVariant;
  disabled?: boolean;
}

export function RowActionBtn({ icon, title, onClick, variant = "default", disabled }: RowActionBtnProps) {
  const s = VARIANTS[variant];
  return (
    <button
      onClick={onClick}
      title={title}
      disabled={disabled}
      style={{
        width: 32, height: 32,
        borderRadius: 7,
        border: `1.5px solid ${s.border}`,
        backgroundColor: s.bg,
        cursor: disabled ? "not-allowed" : "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: s.color,
        flexShrink: 0,
        opacity: disabled ? 0.4 : 1,
        transition: "opacity 0.15s",
      }}
    >
      {icon}
    </button>
  );
}
