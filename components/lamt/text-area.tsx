import * as React from "react";
import { cn } from "@/lib/utils";
import { UseFormRegister, RegisterOptions } from "react-hook-form";


/**
 * LAMT TextArea Component
 * Migrated from @lamt/components forms/TextArea.tsx
 */

export enum HEIGHT_OPTION {
  SMALL,
  MEDIUM,
  LARGE,
}

export interface TextAreaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "name"> {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register?: UseFormRegister<any>;
  rules?: RegisterOptions;
  error?: string;
  option?: HEIGHT_OPTION;
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      name,
      register,
      rules = {},
      error,
      option = HEIGHT_OPTION.LARGE,
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
      [HEIGHT_OPTION.LARGE]: "h-[85px]",
    };

    return (
      <textarea
        {...registration}
        {...props}
        ref={ref}
        id={name}
        aria-labelledby={`${name}_label`}
        className={cn(
          "w-full px-2.5 py-2",
          "text-[14px] leading-6",
          "text-[#11171E]",
          "rounded-[7px]",
          "resize-none",
          "bg-white",
          "transition-all duration-300 ease-in-out",
          "outline-none",
          heightClasses[option],
          error
            ? "border border-[#FF4507] shadow-[0_0_0_3px_rgba(255,69,7,0.4)]"
            : isFocused
              ? "border border-[#07C1FF] shadow-[0_0_0_3px_rgba(7,193,255,0.4)]"
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

TextArea.displayName = "TextArea";

export default TextArea;
