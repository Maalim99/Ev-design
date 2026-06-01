"use client";
import * as React from "react";
import Select from "react-select";
import { components, type DropdownIndicatorProps, type OptionProps } from "react-select";
import { cn } from "@/lib/utils";
import { Button, ButtonKind, ButtonSize } from "./button";
import { ChevronDown, X } from "lucide-react";

/**
 * LAMT PaginationDropdown Component
 * Migrated from @lamt/components PaginationDropdown.tsx
 *
 * Select dropdown for pagination with form and pagination variants
 */

export interface SelectOption {
  label: string;
  value: string | number;
  description?: string;
}

export enum SelectVariant {
  FORM = "form",
  PAGINATION = "pagination",
}

export interface PaginationDropdownProps {
  variant?: SelectVariant;
  value: string | number;
  defaultValue?: string | number;
  placeholder?: string;
  options: SelectOption[];
  onClickClear?: () => void;
  onClickOption?: (option: SelectOption) => void;
  disabled?: boolean;
  hideClearButton?: boolean;
  upperCaseInput?: boolean;
  hideBorder?: boolean;
  className?: string;
}

const DropdownIndicator = (props: DropdownIndicatorProps<SelectOption>) => {
  return (
    <components.DropdownIndicator {...props}>
      <ChevronDown className="h-4 w-4" />
    </components.DropdownIndicator>
  );
};

const Option = (props: OptionProps<SelectOption>) => {
  return (
    <components.Option {...props}>
      <div className="text-sm">{props.label}</div>
      {props.data.description && (
        <small className="inline-block text-xs text-[#92A5BA]">
          {props.data.description}
        </small>
      )}
    </components.Option>
  );
};

export const PaginationDropdown = React.forwardRef<
  HTMLDivElement,
  PaginationDropdownProps
>(
  (
    {
      variant = SelectVariant.PAGINATION,
      value: valueProp,
      defaultValue,
      options,
      onClickOption,
      onClickClear,
      placeholder = "Select",
      disabled,
      hideClearButton = false,
      upperCaseInput,
      hideBorder = false,
      className,
    },
    ref
  ) => {
    const value = options.find((option) => option.value === valueProp);
    const [currentValue, setCurrentValue] = React.useState<
      SelectOption | undefined
    >(value);

    React.useEffect(() => {
      setCurrentValue(value);
    }, [valueProp, value]);

    const handleChange = React.useCallback(
      (newValue: unknown) => {
        const selectedOption = newValue as SelectOption;
        if (onClickOption) {
          onClickOption(selectedOption);
        }
        setCurrentValue(selectedOption);
      },
      [onClickOption]
    );

    const handleClear = React.useCallback(() => {
      if (onClickClear) {
        onClickClear();
      }
      setCurrentValue(undefined);
    }, [onClickClear]);

    return (
      <div
        ref={ref}
        className={cn("w-full flex flex-col justify-between relative", className)}
      >
        {variant === SelectVariant.FORM &&
          !hideClearButton &&
          currentValue && (
            <Button
              kind={ButtonKind.Transparent}
              size={ButtonSize.ExtraSmall}
              onClick={handleClear}
              className="ml-auto absolute right-2 top-4 z-1000 pt-0 pb-0 text-[#313E4F]"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        <Select
          value={currentValue ? currentValue : null}
          onChange={handleChange}
          options={options}
          placeholder={placeholder}
          classNamePrefix="select_dropdown"
          menuPlacement="bottom"
          isDisabled={disabled}
          defaultValue={defaultValue !== undefined ? options[0] : undefined}
          components={{
            DropdownIndicator,
            IndicatorSeparator: () => null,
            Option,
          }}
          onInputChange={(inputValue: string) => {
            if (upperCaseInput) return inputValue.toUpperCase();
            return inputValue;
          }}
          styles={{
            control: (base, state) => ({
              ...base,
              height: "38px",
              minHeight: "38px",
              fontSize: "14px",
              lineHeight: "24px",
              color: "#92A5BA",
              border: hideBorder ? "none" : "1px solid #C9D0D9",
              borderRadius: "7px",
              transition: "all 0.3s ease-in-out",
              backgroundColor: "transparent",
              borderColor: hideBorder
                ? "transparent"
                : state.isFocused
                ? "#92A5BA"
                : "#C9D0D9",
              boxShadow: state.isFocused
                ? "0 0 0 3px rgba(7, 193, 255, 0.4)"
                : "none",
              "&:hover": {
                backgroundColor: "#F9FAFB",
                borderColor: hideBorder ? "transparent" : "#92A5BA",
              },
            }),
            option: (base, state) => ({
              ...base,
              color: "#2D3A4A",
              padding: "7.5px 15px",
              minHeight: "40px",
              lineHeight: "16px",
              cursor: "pointer",
              whiteSpace: "pre-wrap",
              wordWrap: "break-word",
              textAlign: variant === SelectVariant.FORM ? "left" : "right",
              backgroundColor:
                state.isFocused || state.isSelected ? "#F9FAFB" : "white",
              fontWeight: state.isSelected ? "bold" : "normal",
              "&:hover": {
                backgroundColor: "#F9FAFB",
              },
            }),
            menu: (base) => ({
              ...base,
              boxShadow: "0 5px 30px rgba(0, 0, 0, 0.15)",
              borderRadius: "7px",
              backgroundColor: "white",
              marginTop: "0",
              position: "relative",
            }),
            menuList: (base) => ({
              ...base,
              padding: "0",
              borderRadius: "7px",
              maxHeight: "160px",
              overflowY: "auto",
            }),
            dropdownIndicator: (base, state) => ({
              ...base,
              color: "#92A5BA",
              transition: "all 0.4s cubic-bezier(0.645, 0.045, 0.355, 1)",
              transform: state.selectProps.menuIsOpen
                ? "rotate(-180deg)"
                : "rotate(0)",
              "&:hover": {
                color: "#92A5BA",
              },
            }),
            singleValue: (base) => ({
              ...base,
              color: "#92A5BA",
            }),
          }}
        />
      </div>
    );
  }
);

PaginationDropdown.displayName = "PaginationDropdown";

export default PaginationDropdown;
