import * as React from "react";
import { FormProvider, UseFormReturn, FieldValues } from "react-hook-form";
import { cn } from "@/lib/utils";

/**
 * LAMT Form Component
 * Migrated from @lamt/components forms/Form.tsx
 * Simplified wrapper with React Hook Form FormProvider
 */

export interface FormProps<T extends FieldValues = FieldValues>
  extends Omit<React.FormHTMLAttributes<HTMLFormElement>, "onSubmit"> {
  methods: UseFormReturn<T>;
  onSubmit: (data: T) => void;
}

export function Form<T extends FieldValues = FieldValues>({
  methods,
  onSubmit,
  children,
  className,
  ...props
}: FormProps<T>) {
  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className={cn("space-y-5", className)}
        {...props}
      >
        {children}
      </form>
    </FormProvider>
  );
}

Form.displayName = "Form";

export default Form;
