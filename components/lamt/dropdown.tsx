import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * LAMT Dropdown Component
 * Migrated from @lamt/components Dropdown.tsx
 * Uses shadcn/ui Select as base
 * Supports both controlled (value prop) and uncontrolled usage.
 */

export interface DropdownOption {
  id: string;
  name: string;
  disabled?: boolean;
}

export interface DropdownProps {
  label: string;
  options: DropdownOption[];
  disabled?: boolean;
  onClickOption: (option: DropdownOption) => void;
  /** Pass to make the dropdown controlled. Must be a non-empty string matching an option id. */
  value?: string;
  className?: string;
}

export const Dropdown = React.forwardRef<HTMLButtonElement, DropdownProps>(
  ({ label, options, disabled, onClickOption, value: controlledValue, className }, ref) => {
    const [internalValue, setInternalValue] = React.useState<string>("");
    const value = controlledValue !== undefined ? controlledValue : internalValue;

    const handleValueChange = (selectedId: string) => {
      if (controlledValue === undefined) {
        setInternalValue(selectedId);
      }
      const selectedOption = options.find((opt) => opt.id === selectedId);
      if (selectedOption) {
        onClickOption(selectedOption);
      }
    };

    const displayLabel = value
      ? (options.find((opt) => opt.id === value)?.name ?? label)
      : label;

    return (
      <Select
        disabled={disabled}
        value={value}
        onValueChange={handleValueChange}
      >
        <SelectTrigger
          ref={ref}
          className={cn(
            "w-fit px-4 py-2",
            "text-[14px] leading-6",
            "rounded-[50px]",
            "border border-[#566E8B]",
            "bg-transparent",
            "text-[#566E8B]",
            "transition-all duration-300 ease-in-out",
            "hover:bg-[#F3F4F6]",
            "disabled:bg-[#8899AC] disabled:text-[#92A5BA] disabled:opacity-40 disabled:cursor-not-allowed",
            "[&>svg]:hidden",
            className
          )}
        >
          <SelectValue placeholder={label}>{displayLabel}</SelectValue>
          <ChevronDown
            className={cn(
              "ml-2 h-[11px] w-[11px]",
              "transition-transform duration-400 ease-in-out-cubic",
              "data-[state=open]:rotate-180"
            )}
          />
        </SelectTrigger>
        <SelectContent
          position="popper"
          side="bottom"
          align="start"
          className={cn(
            "bg-[#EFF1F4]",
            "rounded-[5px]",
            "p-2",
            "shadow-[0_5px_30px_rgba(0,0,0,0.15)]",
            "max-h-[400px]",
            "overflow-auto"
          )}
        >
          {options.map((option) => (
            <SelectItem
              key={option.id}
              value={option.id}
              disabled={option.disabled}
              className={cn(
                "text-[#2D3A4A]",
                "whitespace-nowrap",
                "cursor-pointer",
                "px-3 py-2",
                "rounded-sm",
                "hover:bg-[#1D9E75] hover:text-white",
                "focus:bg-[#1D9E75] focus:text-white",
                "data-[state=checked]:bg-[#E1F5EE] data-[state=checked]:text-[#0F6E56] data-[state=checked]:font-semibold",
                "data-disabled:opacity-40 data-disabled:cursor-not-allowed data-disabled:pointer-events-none",
                "mb-2 last:mb-0"
              )}
            >
              {option.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }
);

Dropdown.displayName = "Dropdown";

export default Dropdown;
