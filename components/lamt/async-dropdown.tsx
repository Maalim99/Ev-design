"use client";
import * as React from "react";
import AsyncSelect from "react-select/async";
import { components, type OptionProps } from "react-select";
import { cn } from "@/lib/utils";
import { Button, ButtonKind, ButtonSize } from "./button";
import { Spinner } from "./spinner";
/**
 * LAMT AsyncDropdown Component
 * Migrated from @lamt/components AsyncDropdown.tsx
 *
 * Async searchable dropdown with loading states and highlighting
 */

export interface AsyncDropdownProps {
  isLoading?: boolean;
  loadOptions: (
    inputValue: string,
    callback?: (options: SelectOptionWithMatch[]) => void
  ) => Promise<SelectOptionWithMatch[]> | void;
  value?: string;
  defaultValue?: string;
  onClickOption: (value: string | number) => void;
  placeholder?: string;
  onClickClear?: () => void;
  upperCaseInput?: boolean;
  className?: string;
}

interface SelectOptionWithMatch {
  value: string;
  label: string;
  description?: string;
  match?: string;
}

const Option = (props: OptionProps<SelectOptionWithMatch>) => {
  const matchString = props.data.match || "";
  const matchedStringIndex = matchString
    ? props.label.toLowerCase().indexOf(matchString.toLowerCase())
    : -1;

  if (matchedStringIndex === -1) {
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
  }

  const stringBeforeMatch = props.label.substring(0, matchedStringIndex);
  const stringMatching = props.label.substring(
    matchedStringIndex,
    matchedStringIndex + matchString.length
  );
  const stringAfterMatch = props.label.substring(
    matchedStringIndex + matchString.length
  );

  return (
    <components.Option {...props}>
      <div className="text-sm">
        {stringBeforeMatch}
        <b>{stringMatching}</b>
        {stringAfterMatch}
      </div>
      {props.data.description && (
        <small className="inline-block text-xs text-[#92A5BA]">
          {props.data.description}
        </small>
      )}
    </components.Option>
  );
};

const LoadingIndicator = () => <Spinner size={24} className="mr-2" />;

export const AsyncDropdown = React.forwardRef<HTMLDivElement, AsyncDropdownProps>(
  (
    {
      isLoading,
      loadOptions,
      value: valueProp,
      defaultValue,
      onClickOption,
      placeholder,
      onClickClear,
      upperCaseInput,
      className,
    },
    ref
  ) => {
    const [value, selectValue] = React.useState<SelectOptionWithMatch | null>(
      defaultValue
        ? {
            label: defaultValue,
            value: defaultValue,
            description: defaultValue,
          }
        : null
    );

    const change = React.useCallback(
      (newValue: unknown) => {
        const selectedOption = newValue as SelectOptionWithMatch;
        if (onClickOption) {
          onClickOption(selectedOption.value);
        }
        selectValue(selectedOption);
      },
      [onClickOption]
    );

    React.useEffect(() => {
      if (valueProp === "") {
        selectValue(null);
      }
    }, [valueProp]);

    return (
      <div ref={ref} className={cn("w-full flex flex-col justify-between", className)}>
        <Button
          kind={ButtonKind.Transparent}
          size={ButtonSize.ExtraSmall}
          onClick={() => {
            if (onClickClear) {
              onClickClear();
            }
            selectValue(null);
          }}
          className="ml-auto -mt-8 mb-2 pt-0 pb-0 text-sm text-[#313E4F]"
        >
          Clear
        </Button>
        <AsyncSelect
          value={value}
          placeholder={placeholder}
          classNamePrefix="select_dropdown"
          isLoading={isLoading}
          loadOptions={loadOptions}
          onChange={change}
          defaultOptions
          menuPlacement="bottom"
          components={{ Option, LoadingIndicator }}
          onInputChange={(inputValue: string) => {
            if (upperCaseInput) return inputValue.toUpperCase();
            return inputValue;
          }}
          styles={{
            control: (base, state) => ({
              ...base,
              height: "44px",
              minHeight: "40px",
              fontSize: "14px",
              lineHeight: "24px",
              color: "#92A5BA",
              border: "1px solid #C9D0D9",
              borderRadius: "7px",
              transition: "all 0.3s ease-in-out",
              backgroundColor: state.isFocused ? "#F9FAFB" : "white",
              borderColor: state.isFocused ? "#92A5BA" : "#C9D0D9",
              boxShadow: state.isFocused
                ? "0 0 0 3px rgba(7, 193, 255, 0.4)"
                : "none",
              "&:hover": {
                backgroundColor: "#F9FAFB",
                borderColor: "#92A5BA",
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
              backgroundColor: state.isFocused || state.isSelected ? "#F9FAFB" : "white",
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
            }),
            menuList: (base) => ({
              ...base,
              padding: "0",
              borderRadius: "7px",
            }),
            dropdownIndicator: (base, state) => ({
              ...base,
              color: "#92A5BA",
              transition: "all 0.4s cubic-bezier(0.645, 0.045, 0.355, 1)",
              transform: state.selectProps.menuIsOpen ? "rotate(-180deg)" : "rotate(0)",
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

AsyncDropdown.displayName = "AsyncDropdown";

export default AsyncDropdown;
