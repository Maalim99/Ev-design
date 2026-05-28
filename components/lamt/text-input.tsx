import * as React from "react";
import { cn } from "@/lib/utils";
import { UseFormRegister, RegisterOptions } from "react-hook-form";

/**
 * LAMT TextInput Component
 * Migrated from @lamt/components forms/TextInput.tsx
 *
 * Text input with React Hook Form integration
 * Supports various heights, rounded borders, and validation states
 */

export enum HEIGHT_OPTION {
  SMALL,
  MEDIUM,
  LARGE,
}

export interface TextInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "name"> {
  /** Field name for form registration */
  name: string;
  /** Input type */
  type?: "text" | "email" | "number" | "password" | "hidden" | "phone";
  /** React Hook Form register function */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register?: UseFormRegister<any>;
  /** Validation rules for React Hook Form */
  rules?: RegisterOptions;
  /** Error message to display */
  error?: string;
  /** Height variant */
  option?: HEIGHT_OPTION;
  /** Use rounded borders (27px) instead of default (7px) */
  rounded?: boolean;
}

export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      name,
      type = "text",
      register,
      rules = {},
      error,
      option = HEIGHT_OPTION.LARGE,
      rounded = false,
      disabled = false,
      className,
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = React.useState(false);

    const registration = register ? register(name, rules) : {};

    const heightClasses = {
      [HEIGHT_OPTION.SMALL]: "h-[29px]",
      [HEIGHT_OPTION.MEDIUM]: "h-[36px]",
      [HEIGHT_OPTION.LARGE]: "h-[44px]",
    };

    return (
      <input
        {...registration}
        {...props}
        ref={ref}
        type={type}
        id={name}
        disabled={disabled}
        className={cn(
          "w-full px-2.5 py-2",
          "text-[14px] leading-6",
          "text-[#11171E]",
          "transition-all duration-300 ease-in-out",
          "outline-none",
          rounded ? "rounded-[27px]" : "rounded-[7px]",
          heightClasses[option],
          disabled
            ? "bg-[#EDF1F5] cursor-not-allowed"
            : "bg-white cursor-text",
          error
            ? "border border-[#FF4507] shadow-[0_0_0_3px_rgba(255,69,7,0.4)]"
            : isFocused
              ? "border border-[#1D9E75] shadow-[0_0_0_3px_rgba(29,158,117,0.2)]"
              : "border border-[#C9D0D9]",
          className
        )}
        onFocus={(e) => {
          setIsFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          onBlur?.(e);
        }}
      />
    );
  }
);

TextInput.displayName = "TextInput";

export default TextInput;
