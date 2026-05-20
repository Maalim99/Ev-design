"use client";
import * as React from "react";
import { debounce } from "lodash";
import { Controller, UseFormReturn, useWatch } from "react-hook-form";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button, ButtonKind } from "./button";
import { TextInput } from "./text-input";
import { DateInput } from "./date-input";
import { RadioGroup } from "./radio-group";
import { Dropdown, DropdownOption } from "./dropdown";
import {
  DATE_RANGE_STRING_DELIMITER,
  FilterType,
  getMethods,
  getPlaceholder,
  Method,
} from "@/lib/filter-utils";

/**
 * LAMT FilterMethod Component
 * Migrated from @lamt/components filters/FilterMethod.tsx
 *
 * Provides a filtering interface with method selection and value input
 */

export interface FilterMethodProps {
  name: string;
  method?: Method;
  type: FilterType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formControl: UseFormReturn<any>;
  onChangeFilter: (values: Record<string, unknown>) => void;
  options?: DropdownOption[];
}

export const FilterMethod = React.forwardRef<HTMLDivElement, FilterMethodProps>(
  ({ name, method, type, formControl, onChangeFilter, options }, ref) => {
    let router: ReturnType<typeof useRouter> | null;
    try {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      router = useRouter();
    } catch {
      router = null;
    }

    const methods = getMethods(type);
    const placeholder = getPlaceholder(type);
    const selectedMethod = useWatch({
      control: formControl.control,
      name: `${name}.method`,
      defaultValue: method,
    });
    const selectedMethodObj = methods.find((m) => m.value === selectedMethod);

    const onClickReset = React.useCallback(() => {
      formControl.setValue(`${name}.method`, method);
      formControl.setValue(`${name}.value`, "");
      onChangeFilter({ [name]: { method, value: "" } });

      // Remove query parameters from URL
      if (typeof window !== "undefined" && router) {
        router.push(window.location.pathname);
      }
    }, [formControl, method, name, onChangeFilter, router]);

    const onClick = React.useCallback((e: React.MouseEvent) => {
      e.stopPropagation();
    }, []);

    return (
      <div
        ref={ref}
        onClick={onClick}
        className={cn("flex flex-col px-4")}
      >
        <div className="mb-2">
          <p className="block text-sm text-[#92A5BA] mb-4">
            <strong>Filtering method</strong>
          </p>
          <Controller
            name={`${name}.method`}
            control={formControl.control}
            defaultValue={method}
            render={({ field: { value, onChange } }) => (
              <RadioGroup
                items={methods}
                name={`${name}.method`}
                value={value}
                onValueChange={(newValue) => {
                  onChange(newValue);
                  onChangeFilter({
                    [name]: formControl.getValues()[name],
                  });
                }}
              />
            )}
          />
        </div>

        <div
          className={cn(
            "[&_input::-webkit-outer-spin-button]:appearance-none",
            "[&_input::-webkit-inner-spin-button]:appearance-none",
            "[&_input[type=number]]:appearance-textfield"
          )}
        >
          <p className="block text-sm text-[#92A5BA] mb-4">
            <strong>
              {(selectedMethodObj && selectedMethodObj.label) || "Value"}
            </strong>
          </p>
          <Controller
            name={`${name}.value`}
            control={formControl.control}
            defaultValue=""
            render={({ field: { value, onChange } }) => {
              if (type === FilterType.Num || type === FilterType.Phone) {
                return (
                  <TextInput
                    name={`${name}.value`}
                    type="number"
                    placeholder={placeholder}
                    inputMode={type === FilterType.Phone ? "tel" : undefined}
                    onClick={onClick}
                    value={value}
                    onChange={(e) => {
                      onChange(e.currentTarget.value);
                      debounce(() => {
                        onChangeFilter({
                          [name]: formControl.getValues()[name],
                        });
                      }, 500)();
                    }}
                  />
                );
              }

              if (type === FilterType.Select) {
                const currentOption = (options || []).find(opt => opt.id === value);
                return (
                  <Dropdown
                    label={currentOption?.name || placeholder || "Select"}
                    options={options || []}
                    onClickOption={(option) => {
                      onChange(option.id);
                      onChangeFilter({
                        [name]: formControl.getValues()[name],
                      });
                    }}
                  />
                );
              }

              if (type === FilterType.Date) {
                if (selectedMethod === Method.Between) {
                  return (
                    <div className="[&>:not(:last-child)]:mb-4">
                      <DateInput
                        name={`${name}.value`}
                        date={value.split(DATE_RANGE_STRING_DELIMITER)[0]}
                        onSelect={(date) => {
                          if (!date) return;
                          const valueArray = value.split(
                            DATE_RANGE_STRING_DELIMITER
                          );
                          valueArray[0] = date.toISOString();
                          onChange(valueArray.join(DATE_RANGE_STRING_DELIMITER));
                          onChangeFilter({
                            [name]: formControl.getValues()[name],
                          });
                        }}
                      />
                      <DateInput
                        name={`${name}.value`}
                        date={value.split(DATE_RANGE_STRING_DELIMITER)[1]}
                        disabled={
                          !Boolean(value.split(DATE_RANGE_STRING_DELIMITER)[0])
                        }
                        minDate={
                          value.split(DATE_RANGE_STRING_DELIMITER)[0]
                            ? new Date(
                                value.split(DATE_RANGE_STRING_DELIMITER)[0]
                              )
                            : undefined
                        }
                        onSelect={(date) => {
                          if (!date) return;
                          const valueArray = value.split(
                            DATE_RANGE_STRING_DELIMITER
                          );
                          valueArray[1] = date.toISOString();
                          onChange(valueArray.join(DATE_RANGE_STRING_DELIMITER));
                          onChangeFilter({
                            [name]: formControl.getValues()[name],
                          });
                        }}
                      />
                    </div>
                  );
                }

                return (
                  <DateInput
                    name={`${name}.value`}
                    date={value.split(DATE_RANGE_STRING_DELIMITER)[0]}
                    onSelect={(date) => {
                      if (!date) return;
                      onChange(date.toISOString());
                      onChangeFilter({
                        [name]: formControl.getValues()[name],
                      });
                    }}
                  />
                );
              }

              return (
                <TextInput
                  name={`${name}.value`}
                  type="text"
                  placeholder={placeholder}
                  onClick={onClick}
                  value={value}
                  onChange={(e) => {
                    onChange(e.currentTarget.value);
                    debounce(() => {
                      onChangeFilter({
                        [name]: formControl.getValues()[name],
                      });
                    }, 500)();
                  }}
                />
              );
            }}
          />
        </div>

        <div className="mt-4">
          <Button
            kind={ButtonKind.Ghost}
            onClick={(e) => {
              e.stopPropagation();
              onClickReset();
            }}
          >
            Reset
          </Button>
        </div>
      </div>
    );
  }
);

FilterMethod.displayName = "FilterMethod";

export default FilterMethod;
