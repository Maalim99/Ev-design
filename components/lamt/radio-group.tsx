import * as React from "react";
import { RadioGroup as ShadcnRadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { UseFormRegister, RegisterOptions } from "react-hook-form";

/**
 * LAMT RadioGroup Component
 * Migrated from @lamt/components forms/RadioGroup.tsx
 */

export interface RadioOption {
  value: string;
  label: string;
}

export interface RadioGroupProps {
  name: string;
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
  items?: RadioOption[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register?: UseFormRegister<any>;
  rules?: RegisterOptions;
}

export const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ name, value, onValueChange, children, items, register, rules, ...props }, ref) => {
    const registration = register ? register(name, rules) : {};

    return (
      <ShadcnRadioGroup
        {...registration}
        ref={ref}
        value={value}
        onValueChange={onValueChange}
        {...props}
      >
        {items
          ? items.map((item) => (
              <div key={item.value} className="flex items-center space-x-2">
                <RadioGroupItem value={item.value} id={`${name}-${item.value}`} />
                <Label htmlFor={`${name}-${item.value}`}>{item.label}</Label>
              </div>
            ))
          : children}
      </ShadcnRadioGroup>
    );
  }
);

RadioGroup.displayName = "RadioGroup";

export default RadioGroup;
