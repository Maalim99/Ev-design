import * as React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormRegister, RegisterOptions } from "react-hook-form";
import { cn } from "@/lib/utils";

/**
 * LAMT CheckboxInput Component
 * Migrated from @lamt/components forms/CheckboxInput.tsx
 */

export interface CheckboxInputProps {
  name: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  className?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register?: UseFormRegister<any>;
  rules?: RegisterOptions;
}

export const CheckboxInput = React.forwardRef<
  HTMLButtonElement,
  CheckboxInputProps
>(
  (
    {
      name,
      checked,
      onCheckedChange,
      disabled,
      label,
      className,
      register,
      rules,
      ...props
    },
    ref
  ) => {
    const registration = register ? register(name, rules) : {};

    return (
      <div className={cn("flex items-center gap-2", className)}>
        <Checkbox
          {...registration}
          ref={ref}
          checked={checked}
          onCheckedChange={onCheckedChange}
          disabled={disabled}
          {...props}
        />
        {label && (
          <label
            htmlFor={name}
            className={cn(
              "text-[14px] leading-6 cursor-pointer",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            {label}
          </label>
        )}
      </div>
    );
  }
);

CheckboxInput.displayName = "CheckboxInput";

export default CheckboxInput;
