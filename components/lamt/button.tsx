import * as React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

/**
 * LAMT Button Component
 * Migrated from @lamt/components Button.tsx
 *
 * Supports all original Button variants and features:
 * - Kinds: primary, normal, ghost, secondary, transparent
 * - Sizes: xs, sm, m, l, xl
 * - Features: icon, badge, context, dashed borders
 */

export enum ButtonSize {
  ExtraSmall = "xs",
  Small = "sm",
  Medium = "m",
  Large = "l",
  ExtraLarge = "xl",
}

export enum ButtonKind {
  Primary = "primary",
  Normal = "normal",
  Ghost = "ghost",
  Secondary = "secondary",
  Transparent = "transparent",
}

const buttonVariants = cva(
  cn(
    "relative inline-flex items-center justify-center",
    "rounded-[50px]",
    "transition-all duration-300 ease-in-out",
    "outline-none focus:outline-none",
    "disabled:opacity-40 disabled:cursor-not-allowed",
    "font-ubuntu"
  ),
  {
    variants: {
      kind: {
        primary: cn(
          "bg-[#1D9E75] text-white border-none",
          "hover:bg-[#179060]",
          "active:brightness-90"
        ),
        normal: cn(
          "bg-[#374A61] text-white border-none",
          "hover:bg-[#4a5f7a]",
          "active:bg-[#2d3d50]"
        ),
        ghost: cn(
          "border-2 border-[#1D9E75] text-[#1D9E75] bg-transparent",
          "hover:bg-[#1D9E75] hover:text-white",
          "active:bg-[#166b50]"
        ),
        secondary: cn(
          "border-2 border-[#374A61] text-[#374A61] bg-transparent",
          "hover:bg-[#374A61] hover:text-white",
          "active:bg-[#2d3d50]"
        ),
        transparent: cn(
          "bg-transparent border-none text-[#374A61]",
          "hover:text-[#4a5f7a]",
          "active:text-[#2d3d50]"
        ),
      },
      size: {
        xs: "text-[11px] leading-4 px-4 py-1.5",
        sm: "text-[13.17px] leading-4 px-6 py-1.5",
        m: "text-[14px] leading-6 px-[30px] py-[7.5px]",
        l: "text-[23.61px] leading-8 px-[30px] py-[7.5px]",
        xl: "text-[26.88px] leading-10 px-[30px] py-[7.5px]",
      },
      dashed: {
        true: "border-dashed",
        false: "",
      },
    },
    defaultVariants: {
      kind: "normal",
      size: "m",
      dashed: false,
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Additional context text shown below the main button text */
  context?: string | null;
  /** Icon element to display before the button text */
  icon?: React.ReactNode;
  /** Badge content to display in top-right corner */
  badge?: React.ReactNode;
  /** Color variant for the badge */
  badgeColor?: "primary" | "success" | "danger" | "neutral";
  /** Size of the badge */
  badgeSize?: "xs" | "sm" | "md";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      kind = "normal",
      size = "m",
      dashed = false,
      context = null,
      icon = null,
      badge = null,
      badgeColor = "neutral",
      badgeSize = "md",
      children,
      type = "button",
      ...props
    },
    ref
  ) => {
    const badgeColorClasses = {
      primary: "bg-lamt-primary",
      success: "bg-lamt-success",
      danger: "bg-lamt-danger",
      neutral: "bg-lamt-neutral-dark-medium",
    };

    const badgeSizeClasses = {
      xs: "w-[10px] h-[10px] text-[8px]",
      sm: "w-[15px] h-[15px] text-[10px]",
      md: "w-[20px] h-[20px] text-[13.17px]",
    };

    return (
      <button
        type={type}
        className={cn(buttonVariants({ kind, size, dashed, className }))}
        ref={ref}
        {...props}
      >
        <span className="flex flex-col items-center">
          <span className="flex items-center gap-2">
            {icon && <span className="inline-flex">{icon}</span>}
            {children}
          </span>
          {context && (
            <span className="text-[11px] leading-none mt-0.5 opacity-80">
              {context}
            </span>
          )}
        </span>
        {badge && (
          <span
            className={cn(
              "absolute -top-[7.5px] -right-[7.5px]",
              "flex items-center justify-center",
              "rounded-full text-white",
              badgeColorClasses[badgeColor],
              badgeSizeClasses[badgeSize]
            )}
          >
            {badge}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
