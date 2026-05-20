import type { Meta, StoryObj } from "@storybook/nextjs";
import React from "react";
import DateInput from "./date-input";

const meta: Meta<typeof DateInput> = {
  title: "LAMT/Forms/DateInput",
  component: DateInput,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof DateInput>;

export const Default: Story = {
  render: () => {
    const [date, setDate] = React.useState<Date | null>(null);
    return (
      <div style={{ minHeight: "400px" }}>
        <div className="max-w-xs">
          <DateInput
            date={date}
            onChange={(newDate) => setDate(newDate as Date | null)}
          />
        </div>
      </div>
    );
  },
};

export const WithInitialDate: Story = {
  render: () => {
    const [date, setDate] = React.useState<Date | null>(new Date());
    return (
      <div style={{ minHeight: "400px" }}>
        <div className="max-w-xs">
          <DateInput
            date={date}
            onChange={(newDate) => setDate(newDate as Date | null)}
          />
        </div>
      </div>
    );
  },
};

export const WithPlaceholder: Story = {
  render: () => {
    const [date, setDate] = React.useState<Date | null>(null);
    return (
      <div style={{ minHeight: "400px" }}>
        <div className="max-w-xs">
          <DateInput
            date={date}
            placeholder="Select a date"
            onChange={(newDate) => setDate(newDate as Date | null)}
          />
        </div>
      </div>
    );
  },
};

export const WithMinDate: Story = {
  render: () => {
    const [date, setDate] = React.useState<Date | null>(null);
    const minDate = new Date();
    minDate.setDate(minDate.getDate() - 7); // 7 days ago

    return (
      <div style={{ minHeight: "400px" }}>
        <div className="max-w-xs">
          <DateInput
            date={date}
            minDate={minDate}
            placeholder="Select date (min 7 days ago)"
            onChange={(newDate) => setDate(newDate as Date | null)}
          />
        </div>
      </div>
    );
  },
};

export const Disabled: Story = {
  render: () => {
    const [date, setDate] = React.useState<Date | null>(new Date());
    return (
      <div style={{ minHeight: "400px" }}>
        <div className="max-w-xs">
          <DateInput
            date={date}
            disabled
            onChange={(newDate) => setDate(newDate as Date | null)}
          />
        </div>
      </div>
    );
  },
};

export const WithStringDate: Story = {
  render: () => {
    const [date, setDate] = React.useState<Date | string | null>(
      "2024-12-25"
    );
    return (
      <div style={{ minHeight: "400px" }}>
        <div className="max-w-xs">
          <DateInput
            date={date}
            onChange={(newDate) =>
              setDate(newDate ? (newDate as Date) : null)
            }
          />
          <p className="mt-2 text-sm text-gray-600">
            Selected: {date ? date.toString() : "None"}
          </p>
        </div>
      </div>
    );
  },
};

export const WithCallback: Story = {
  render: () => {
    const [date, setDate] = React.useState<Date | null>(null);
    const [selected, setSelected] = React.useState<string>("");

    return (
      <div style={{ minHeight: "400px" }}>
        <div className="max-w-xs space-y-2">
          <DateInput
            date={date}
            onChange={(newDate) => setDate(newDate as Date | null)}
            onSelect={(selectedDate) =>
              setSelected(`Selected: ${selectedDate.toLocaleDateString()}`)
            }
          />
          {selected && <p className="text-sm text-gray-600">{selected}</p>}
        </div>
      </div>
    );
  },
};
