import type { Meta, StoryObj } from "@storybook/nextjs";
import React from "react";
import { useForm } from "react-hook-form";
import { FieldArray } from "./field-array";
import { Form } from "./form";
import { TextInput } from "./text-input";
import { LabeledInput } from "./labeled-input";
import { InputLabel } from "./input-label";
import { Button, ButtonKind } from "./button";

const meta: Meta<typeof FieldArray> = {
  title: "LAMT/Forms/FieldArray",
  component: FieldArray,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof FieldArray>;

export const Default: Story = {
  render: () => {
    const FormDemo = () => {
      const methods = useForm({
        defaultValues: {
          items: [{ name: "", quantity: "" }],
        },
      });

      const { control, register } = methods;

      const onSubmit = (data: Record<string, unknown>) => {
        console.log("Form submitted:", data);
        alert(JSON.stringify(data, null, 2));
      };

      return (
        <Form methods={methods} onSubmit={onSubmit} className="max-w-2xl">
          <FieldArray
            name="items"
            control={control}
            actionLabel="Add Item"
            defaultValue={{ name: "", quantity: "" }}
          >
            {(field, index) => (
              <>
                <div className="flex-1">
                  <InputLabel htmlFor={`items.${index}.name`}>Item Name</InputLabel>
                  <TextInput
                    {...register(`items.${index}.name` as const)}
                    placeholder="Enter item name"
                  />
                </div>
                <div className="flex-1">
                  <InputLabel htmlFor={`items.${index}.quantity`}>Quantity</InputLabel>
                  <TextInput
                    {...register(`items.${index}.quantity` as const)}
                    type="number"
                    placeholder="0"
                  />
                </div>
              </>
            )}
          </FieldArray>

          <Button kind={ButtonKind.Primary} type="submit">
            Submit
          </Button>
        </Form>
      );
    };

    return <FormDemo />;
  },
};

export const WithLabeledInputs: Story = {
  render: () => {
    const FormDemo = () => {
      const methods = useForm({
        defaultValues: {
          products: [{ name: "", price: "", stock: "" }],
        },
      });

      const { control, register } = methods;

      const onSubmit = (data: Record<string, unknown>) => {
        console.log("Form submitted:", data);
        alert(JSON.stringify(data, null, 2));
      };

      return (
        <Form methods={methods} onSubmit={onSubmit} className="max-w-3xl">
          <FieldArray
            name="products"
            control={control}
            actionLabel="Add Product"
            defaultValue={{ name: "", price: "", stock: "" }}
          >
            {(field, index) => (
              <>
                <div className="flex-1">
                  <InputLabel htmlFor={`products.${index}.name`}>Product Name</InputLabel>
                  <TextInput
                    {...register(`products.${index}.name` as const)}
                    placeholder="Product name"
                  />
                </div>
                <div className="w-40">
                  <InputLabel htmlFor={`products.${index}.price`}>Price</InputLabel>
                  <LabeledInput
                    {...register(`products.${index}.price` as const)}
                    inputLabel="USD"
                    placeholder="0.00"
                  />
                </div>
                <div className="w-32">
                  <InputLabel htmlFor={`products.${index}.stock`}>Stock</InputLabel>
                  <LabeledInput
                    {...register(`products.${index}.stock` as const)}
                    inputLabel="units"
                    placeholder="0"
                  />
                </div>
              </>
            )}
          </FieldArray>

          <Button kind={ButtonKind.Primary} type="submit">
            Submit
          </Button>
        </Form>
      );
    };

    return <FormDemo />;
  },
};

export const SingleField: Story = {
  render: () => {
    const FormDemo = () => {
      const methods = useForm({
        defaultValues: {
          emails: [{ value: "" }],
        },
      });

      const { control, register } = methods;

      const onSubmit = (data: Record<string, unknown>) => {
        console.log("Form submitted:", data);
        alert(JSON.stringify(data, null, 2));
      };

      return (
        <Form methods={methods} onSubmit={onSubmit} className="max-w-md">
          <FieldArray
            name="emails"
            control={control}
            actionLabel="Add Email"
            defaultValue={{ value: "" }}
          >
            {(field, index) => (
              <div className="flex-1">
                <InputLabel htmlFor={`emails.${index}.value`}>Email {index + 1}</InputLabel>
                <TextInput
                  {...register(`emails.${index}.value` as const)}
                  type="email"
                  placeholder="email@example.com"
                />
              </div>
            )}
          </FieldArray>

          <Button kind={ButtonKind.Primary} type="submit">
            Submit
          </Button>
        </Form>
      );
    };

    return <FormDemo />;
  },
};
