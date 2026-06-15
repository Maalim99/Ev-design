import * as React from "react";
import { StatusChip, StatusChipType } from "./status-chip";
import type { EvoStatus } from "@/data/dummy";

/**
 * EvoStatusChip Component
 * A wrapper around LAMT StatusChip that maps EVO-specific status types
 * to the appropriate LAMT StatusChipType for consistent styling
 */

const EVO_STATUS_TO_LAMT: Record<EvoStatus, { type: StatusChipType; label: string }> = {
  ACTIVE: { type: StatusChipType.Success, label: "Active" },
  PENDING_BGC: { type: StatusChipType.Warning, label: "Pending BGC" },
  PENDING_OSP: { type: StatusChipType.Accent, label: "Pending OSP" },
  PENDING_RP: { type: StatusChipType.Info, label: "Pending RP" },
  PARTIAL_RP: { type: StatusChipType.AccentM, label: "Partial RP" },
  PENDING_HO: { type: StatusChipType.AccentM, label: "Pending HO" },
  INACTIVE: { type: StatusChipType.Normal, label: "Inactive" },
  DISENGAGED: { type: StatusChipType.Danger, label: "Disengaged" },
};

export interface EvoStatusChipProps {
  status: EvoStatus;
  className?: string;
}

/**
 * Status chip for EVO-specific status values
 * Uses LAMT's StatusChip component for consistent styling
 */
export const EvoStatusChip = React.forwardRef<HTMLSpanElement, EvoStatusChipProps>(
  ({ status, className }, ref) => {
    const { type, label } = EVO_STATUS_TO_LAMT[status];

    return (
      <StatusChip
        ref={ref}
        type={type}
        className={className}
      >
        {label}
      </StatusChip>
    );
  }
);

EvoStatusChip.displayName = "EvoStatusChip";

export default EvoStatusChip;
