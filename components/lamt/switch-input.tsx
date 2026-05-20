import * as React from "react";
import { Switch } from "@/components/ui/switch";
import { UseFormRegister, RegisterOptions } from "react-hook-form";

/**
 * LAMT Switch Component
 * Migrated from @lamt/components forms/Switch.tsx
 * Uses shadcn/ui Switch as base
 */

export interface SwitchInputProps {
  name: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register?: UseFormRegister<any>;
  rules?: RegisterOptions;
}

export const SwitchInput = React.forwardRef<
  HTMLButtonElement,
  SwitchInputProps
>(({ name, checked, onChange, disabled, register, rules, ...props }, ref) => {
  const registration = register ? register(name, rules) : {};

  return (
    <Switch
      {...registration}
      ref={ref}
      checked={checked}
      onCheckedChange={onChange}
      disabled={disabled}
      {...props}
    />
  );
});

SwitchInput.displayName = "SwitchInput";

export default SwitchInput;
