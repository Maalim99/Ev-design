import * as React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

/**
 * LAMT StatusChip Component
 * Migrated from @lamt/components StatusChip.tsx
 *
 * A badge-style component for displaying status information
 * Supports all original color variants from the LAMT design system
 */

export enum StatusChipType {
  Normal = "normal",
  Danger = "danger",
  Warning = "warning",
  Success = "success",
  Accent = "accent",
  AccentM = "accentM",
  DangerM = "dangerM",
  Info = "info",
  InfoM = "infoM",
  DangerL = "dangerL",
}

const statusChipVariants = cva(
  cn(
    "inline-flex items-center justify-center",
    "h-fit w-fit",
    "px-[15px] py-[3.75px]",
    "text-white uppercase",
    "rounded-[22px]",
    "text-[11px] leading-4",
    "font-ubuntu"
  ),
  {
    variants: {
      type: {
        normal: "bg-[#374A61]",
        danger: "bg-[#FF4507]",
        warning: "bg-[#FFEA30] text-[#11171E]",
        success: "bg-[#1D9E75]",
        accent: "bg-[#07C1FF]",
        accentM: "bg-[#BAEEFF] text-[#11171E]",
        dangerM: "bg-[#F49E8B]",
        info: "bg-[#B247AE]",
        infoM: "bg-[#E5B8E4] text-[#11171E]",
        dangerL: "bg-[#FBE0DA] text-[#11171E]",
      },
    },
    defaultVariants: {
      type: "normal",
    },
  }
);

export interface StatusChipProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusChipVariants> {}

export const StatusChip = React.forwardRef<HTMLSpanElement, StatusChipProps>(
  ({ className, type = "normal", children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(statusChipVariants({ type }), className)}
        {...props}
      >
        {children}
      </span>
    );
  }
);

StatusChip.displayName = "StatusChip";

export default StatusChip;
