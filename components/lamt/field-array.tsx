import * as React from "react";
import { useFieldArray, Control, FieldValues, FieldArrayPath, FieldArrayWithId } from "react-hook-form";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, ButtonKind } from "./button";

/**
 * LAMT FieldArray Component
 * Migrated from @lamt/components forms/FieldArray.tsx
 * Simplified wrapper around React Hook Form's useFieldArray
 */

export interface FieldArrayProps<TFieldValues extends FieldValues = FieldValues> {
  name: FieldArrayPath<TFieldValues>;
  control: Control<TFieldValues>;
  actionLabel?: string;
  defaultValue?: Record<string, unknown>;
  children: (field: FieldArrayWithId<TFieldValues>, index: number, remove: (index: number) => void) => React.ReactNode;
  className?: string;
}

export function FieldArray<TFieldValues extends FieldValues = FieldValues>({
  name,
  control,
  actionLabel = "Add Item",
  defaultValue = {},
  children,
  className,
}: FieldArrayProps<TFieldValues>) {
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  return (
    <div className={cn("space-y-4", className)}>
      {fields.map((field, index) => (
        <div
          key={field.id}
          className={cn(
            "flex flex-row items-start gap-8",
            "mb-4"
          )}
        >
          <div className="flex-1 flex gap-8">
            {children(field, index, remove)}
          </div>
          <div className="flex justify-center items-center mt-[50px]">
            <Button
              kind={ButtonKind.Transparent}
              onClick={() => remove(index)}
              icon={<Trash2 className="text-danger" size={16} />}
              type="button"
            />
          </div>
        </div>
      ))}
      <Button
        kind={ButtonKind.Ghost}
        type="button"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onClick={() => append(defaultValue as any)}
      >
        {actionLabel}
      </Button>
    </div>
  );
}

FieldArray.displayName = "FieldArray";

export default FieldArray;
