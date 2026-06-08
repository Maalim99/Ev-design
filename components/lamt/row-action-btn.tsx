import * as React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

/**
 * LAMT Row Action Button Component
 * Refactored from EV Core to use Tailwind CSS with enhanced modularity
 *
 * Features:
 * - Consistent design system integration
 * - Enhanced hover and focus states
 * - Better accessibility with proper ARIA attributes
 * - Flexible sizing and variant options
 */

const rowActionBtnVariants = cva(
  cn(
    "inline-flex items-center justify-center flex-shrink-0 rounded-[7px]",
    "border-[1.5px] transition-all duration-200 ease-in-out",
    "focus:outline-none focus:ring-2 focus:ring-offset-1",
    "disabled:cursor-not-allowed disabled:opacity-40",
    "hover:scale-105 active:scale-95"
  ),
  {
    variants: {
      variant: {
        default: cn(
          "border-[#C8C7C1] bg-[#EEEDEA] text-[#3D3C38]",
          "hover:border-[#B5B4B0] hover:bg-[#E5E4E1]",
          "focus:ring-[#C8C7C1]"
        ),
        green: cn(
          "border-[#7DCDB0] bg-[#D8F3EA] text-[#0F6E56]",
          "hover:border-[#6BC4A6] hover:bg-[#C8F0E3]",
          "focus:ring-[#7DCDB0]"
        ),
        blue: cn(
          "border-[#93B8E8] bg-[#DCECf9] text-[#185FA5]",
          "hover:border-[#81AEE5] hover:bg-[#CEE4F7]",
          "focus:ring-[#93B8E8]"
        ),
        amber: cn(
          "border-[#F6C97A] bg-[#FEF3DC] text-[#854F0B]",
          "hover:border-[#F4C066] hover:bg-[#FDF0D1]",
          "focus:ring-[#F6C97A]"
        ),
        danger: cn(
          "border-[#F5A8A8] bg-[#FEE2E2] text-[#991B1B]",
          "hover:border-[#F39595] hover:bg-[#FDD5D5]",
          "focus:ring-[#F5A8A8]"
        ),
        purple: cn(
          "border-[#C4B0E8] bg-[#F0EAFB] text-[#5B21B6]",
          "hover:border-[#B8A2E5] hover:bg-[#E8DDF9]",
          "focus:ring-[#C4B0E8]"
        ),
      },
      size: {
        sm: "w-7 h-7",
        md: "w-8 h-8", // 32px default
        lg: "w-10 h-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface RowActionBtnProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof rowActionBtnVariants> {
  /** Icon element to display */
  icon: React.ReactNode;
  /** Tooltip text for the button */
  title: string;
  /** Click handler */
  onClick: () => void;
  /** Loading state */
  loading?: boolean;
}

export const RowActionBtn = React.forwardRef<
  HTMLButtonElement,
  RowActionBtnProps
>(({
  className,
  variant = "default",
  size = "md",
  icon,
  title,
  onClick,
  disabled,
  loading = false,
  ...props
}, ref) => {
  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      title={title}
      disabled={disabled || loading}
      aria-label={title}
      className={cn(rowActionBtnVariants({ variant, size }), className)}
      {...props}
    >
      {loading ? (
        <div className="animate-spin rounded-full h-3 w-3 border-[1.5px] border-current border-t-transparent" />
      ) : (
        icon
      )}
    </button>
  );
});

RowActionBtn.displayName = "RowActionBtn";

export default RowActionBtn;