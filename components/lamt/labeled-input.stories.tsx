import type { Meta, StoryObj } from "@storybook/nextjs";
import React from "react";
import { useForm } from "react-hook-form";
import LabeledInput from "./labeled-input";
import Form from "./form";
import Button from "./button";

const meta: Meta<typeof LabeledInput> = {
  title: "LAMT/Forms/LabeledInput",
  component: LabeledInput,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof LabeledInput>;

export const Default: Story = {
  args: {
    name: "amount",
    inputLabel: "USD",
    placeholder: "Enter amount",
  },
};

export const WithValue: Story = {
  args: {
    name: "price",
    inputLabel: "$",
    defaultValue: "1500",
  },
};

export const DifferentLabels: Story = {
  render: () => (
    <div className="space-y-4 max-w-xs">
      <LabeledInput name="weight" inputLabel="kg" placeholder="Weight" />
      <LabeledInput name="distance" inputLabel="km" placeholder="Distance" />
      <LabeledInput name="temperature" inputLabel="°C" placeholder="Temperature" />
      <LabeledInput name="percentage" inputLabel="%" placeholder="Percentage" />
    </div>
  ),
};

export const WithError: Story = {
  args: {
    name: "amount",
    inputLabel: "USD",
    error: "Amount is required",
    placeholder: "Enter amount",
  },
};

export const Disabled: Story = {
  args: {
    name: "amount",
    inputLabel: "USD",
    defaultValue: "5000",
    disabled: true,
  },
};

export const WithReactHookForm: Story = {
  render: () => {
    const FormDemo = () => {
      const methods = useForm({
        defaultValues: {
          price: "",
          quantity: "",
        },
      });

      const { register, formState: { errors } } = methods;

      const onSubmit = (data: Record<string, unknown>) => {
        console.log("Form submitted:", data);
        alert(JSON.stringify(data, null, 2));
      };

      return (
        <Form methods={methods} onSubmit={onSubmit} className="max-w-md">
          <div>
            <label className="block text-sm font-medium mb-1">Price</label>
            <LabeledInput
              name="price"
              inputLabel="USD"
              register={register}
              rules={{ required: "Price is required", min: 0 }}
              error={errors.price?.message as string}
              placeholder="0.00"
            />
            {errors.price && (
              <p className="text-sm text-danger mt-1">{errors.price.message as string}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Quantity</label>
            <LabeledInput
              name="quantity"
              inputLabel="units"
              register={register}
              rules={{ required: "Quantity is required", min: 1 }}
              error={errors.quantity?.message as string}
              placeholder="0"
            />
            {errors.quantity && (
              <p className="text-sm text-danger mt-1">{errors.quantity.message as string}</p>
            )}
          </div>

          <Button kind="primary" type="submit">
            Submit
          </Button>
        </Form>
      );
    };

    return <FormDemo />;
  },
};
