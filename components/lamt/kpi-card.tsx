import * as React from "react";
import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

/**
 * LAMT KPI Card Component
 * Refactored from EV Core to use Tailwind CSS with enhanced modularity
 *
 * Features:
 * - Responsive design with Tailwind utilities
 * - Flexible theming support
 * - Enhanced hover states and animations
 * - Accessible design patterns
 */

const kpiCardVariants = cva(
  cn(
    "bg-white rounded-xl p-5 pb-[18px] flex flex-col gap-[14px] transition-all duration-300",
    "border-[0.5px] border-lamt-primary",
    "hover:shadow-md hover:-translate-y-0.5"
  ),
  {
    variants: {
      variant: {
        default: "border-lamt-primary",
        success: "border-lamt-success",
        warning: "border-lamt-warning",
        danger: "border-lamt-danger",
        neutral: "border-lamt-neutral-medium",
      },
      size: {
        sm: "p-3 gap-2",
        md: "p-5 pb-[18px] gap-[14px]",
        lg: "p-6 gap-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

const iconWrapperVariants = cva(
  "rounded-md flex items-center justify-center flex-shrink-0",
  {
    variants: {
      variant: {
        default: "bg-[#EBF8F3]",
        success: "bg-lamt-success-light",
        warning: "bg-lamt-warning-light",
        danger: "bg-lamt-danger-light",
        neutral: "bg-lamt-neutral-light",
      },
      size: {
        sm: "w-6 h-6",
        md: "w-7 h-7",
        lg: "w-8 h-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

const valueVariants = cva(
  "font-bold text-lamt-neutral-dark leading-none tracking-tight",
  {
    variants: {
      size: {
        sm: "text-lg",
        md: "text-2xl",
        lg: "text-3xl",
      },
      dynamic: {
        true: "", // Will be calculated based on content length
        false: "",
      },
    },
    defaultVariants: {
      size: "md",
      dynamic: true,
    },
  }
);

export interface KpiCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof kpiCardVariants> {
  /** Label text displayed above the value */
  label: string;
  /** Main value to display */
  value: string | number;
  /** Delta/change text shown below value */
  delta?: string;
  /** Type of delta for color coding */
  deltaType?: "positive" | "negative" | "neutral";
  /** Lucide icon component */
  icon: LucideIcon;
  /** Makes the card clickable */
  clickable?: boolean;
  /** Click handler */
  onClick?: () => void;
}

export const KpiCard = React.forwardRef<HTMLDivElement, KpiCardProps>(
  ({
    className,
    variant = "default",
    size = "md",
    label,
    value,
    delta,
    deltaType = "neutral",
    icon: Icon,
    clickable = false,
    onClick,
    ...props
  }, ref) => {
    const stringValue = String(value);

    // Dynamic font sizing based on content length
    const dynamicValueSize =
      stringValue.length > 8 ? "text-base" :
      stringValue.length > 5 ? "text-xl" :
      "text-3xl";

    const deltaColors = {
      positive: "text-lamt-success",
      negative: "text-lamt-danger",
      neutral: "text-lamt-neutral",
    };

    const iconColors = {
      default: "#1D9E75",
      success: "#1D9E75",
      warning: "#FFEA30",
      danger: "#FF4507",
      neutral: "#374A61",
    };

    const iconSizes = {
      sm: 12,
      md: 15,
      lg: 18,
    };

    return (
      <div
        ref={ref}
        className={cn(
          kpiCardVariants({ variant, size }),
          clickable && "cursor-pointer hover:shadow-lg",
          className
        )}
        onClick={clickable ? onClick : undefined}
        {...props}
      >
        {/* Header with label and icon */}
        <div className="flex justify-between items-start">
          <span className="text-[11px] font-semibold text-lamt-neutral uppercase tracking-[0.07em]">
            {label}
          </span>
          <div className={iconWrapperVariants({ variant, size })}>
            <Icon
              size={iconSizes[size || "md"]}
              color={iconColors[variant || "default"]}
              strokeWidth={1.75}
            />
          </div>
        </div>

        {/* Value and delta */}
        <div>
          <div className={cn(
            valueVariants({ size: size === "sm" ? "sm" : size === "lg" ? "lg" : undefined }),
            dynamicValueSize
          )}>
            {value}
          </div>
          {delta && (
            <div className={cn(
              "text-[11px] font-medium mt-[7px]",
              deltaColors[deltaType]
            )}>
              {delta}
            </div>
          )}
        </div>
      </div>
    );
  }
);

KpiCard.displayName = "KpiCard";

export default KpiCard;