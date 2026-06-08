import * as React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import type { EvoStatus } from "@/data/dummy";
import { EVO_STATUS_LABELS } from "@/lib/evcore/constants";

/**
 * LAMT EVO Status Chip Component
 * Refactored from EV Core to use Tailwind CSS with enhanced modularity
 *
 * Features:
 * - Consistent status color mapping
 * - Flexible sizing with responsive design
 * - Enhanced accessibility
 * - Customizable variants for different contexts
 * - Animation support for state transitions
 */

const evoStatusChipVariants = cva(
  cn(
    "inline-flex items-center gap-[5px] rounded-full",
    "font-semibold whitespace-nowrap tracking-wider transition-all duration-200",
    "hover:scale-105"
  ),
  {
    variants: {
      status: {
        ACTIVE: "bg-[#E1F5EE] text-[#0F6E56]",
        PENDING_BGC: "bg-[#FAEEDA] text-[#854F0B]",
        PENDING_OSP: "bg-[#E6F1FB] text-[#185FA5]",
        PENDING_RP: "bg-[#F0EAFB] text-[#5B21B6]",
        PARTIAL_RP: "bg-[#E0F2F1] text-[#00695C]",
        PENDING_HO: "bg-[#EEF2FF] text-[#3730A3]",
        INACTIVE: "bg-[#F3F3F1] text-[#6B7280]",
        DISENGAGED: "bg-[#FEE2E2] text-[#991B1B]",
      },
      size: {
        sm: "h-5 px-[7px] text-[10px]",
        md: "h-[22px] px-[9px] text-[11px]",
        lg: "h-6 px-3 text-xs",
      },
      variant: {
        default: "",
        compact: "gap-1 px-2",
        pill: "px-4",
      },
    },
    defaultVariants: {
      status: "INACTIVE",
      size: "md",
      variant: "default",
    },
  }
);

const statusDotVariants = cva(
  "w-[5px] h-[5px] rounded-full flex-shrink-0",
  {
    variants: {
      status: {
        ACTIVE: "bg-[#0F6E56]",
        PENDING_BGC: "bg-[#854F0B]",
        PENDING_OSP: "bg-[#185FA5]",
        PENDING_RP: "bg-[#5B21B6]",
        PARTIAL_RP: "bg-[#00695C]",
        PENDING_HO: "bg-[#3730A3]",
        INACTIVE: "bg-[#6B7280]",
        DISENGAGED: "bg-[#991B1B]",
      },
      animated: {
        true: "animate-pulse",
        false: "",
      },
    },
    defaultVariants: {
      status: "INACTIVE",
      animated: false,
    },
  }
);

export interface EvoStatusChipProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof evoStatusChipVariants> {
  /** EVO status enum value */
  status: EvoStatus;
  /** Show animated status dot for active states */
  animated?: boolean;
  /** Hide the status dot */
  hideDot?: boolean;
  /** Custom label override */
  customLabel?: string;
}

export const EvoStatusChip = React.forwardRef<HTMLSpanElement, EvoStatusChipProps>(
  ({
    className,
    status,
    size = "md",
    variant = "default",
    animated = false,
    hideDot = false,
    customLabel,
    ...props
  }, ref) => {
    const label = customLabel || EVO_STATUS_LABELS[status];

    // Determine if status should be animated (typically for active/in-progress states)
    const shouldAnimate = animated && (status === "ACTIVE" || status.includes("PENDING"));

    return (
      <span
        ref={ref}
        className={cn(evoStatusChipVariants({ status, size, variant }), className)}
        role="status"
        aria-label={`Status: ${label}`}
        {...props}
      >
        {!hideDot && (
          <span
            className={statusDotVariants({ status, animated: shouldAnimate })}
            aria-hidden="true"
          />
        )}
        {label}
      </span>
    );
  }
);

EvoStatusChip.displayName = "EvoStatusChip";

// Helper component for custom status chips
export interface CustomStatusChipProps
  extends Omit<EvoStatusChipProps, "status"> {
  /** Custom background color */
  bgColor: string;
  /** Custom text color */
  textColor: string;
  /** Custom dot color */
  dotColor?: string;
  /** Label text */
  label: string;
}

export const CustomStatusChip = React.forwardRef<HTMLSpanElement, CustomStatusChipProps>(
  ({
    className,
    bgColor,
    textColor,
    dotColor,
    label,
    size = "md",
    variant = "default",
    animated = false,
    hideDot = false,
    style,
    ...props
  }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center gap-[5px] rounded-full",
          "font-semibold whitespace-nowrap tracking-wider transition-all duration-200",
          "hover:scale-105",
          {
            "h-5 px-[7px] text-[10px]": size === "sm",
            "h-[22px] px-[9px] text-[11px]": size === "md",
            "h-6 px-3 text-xs": size === "lg",
            "gap-1 px-2": variant === "compact",
            "px-4": variant === "pill",
          },
          className
        )}
        style={{
          backgroundColor: bgColor,
          color: textColor,
          ...style,
        }}
        role="status"
        aria-label={`Status: ${label}`}
        {...props}
      >
        {!hideDot && (
          <span
            className={cn(
              "w-[5px] h-[5px] rounded-full flex-shrink-0",
              animated && "animate-pulse"
            )}
            style={{ backgroundColor: dotColor || textColor }}
            aria-hidden="true"
          />
        )}
        {label}
      </span>
    );
  }
);

CustomStatusChip.displayName = "CustomStatusChip";

export default EvoStatusChip;