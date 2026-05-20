import type { Meta, StoryObj } from "@storybook/nextjs";
import React from "react";
import MonthInput from "./month-input";

const meta: Meta<typeof MonthInput> = {
  title: "LAMT/Forms/MonthInput",
  component: MonthInput,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof MonthInput>;

export const Default: Story = {
  render: () => {
    const [date, setDate] = React.useState<Date | null>(null);
    return (
      <div style={{ minHeight: "400px" }}>
        <div className="max-w-xs">
          <MonthInput
            date={date}
            onChange={(newDate) => setDate(newDate as Date | null)}
          />
        </div>
      </div>
    );
  },
};

export const WithInitialMonth: Story = {
  render: () => {
    const [date, setDate] = React.useState<Date | null>(new Date());
    return (
      <div style={{ minHeight: "400px" }}>
        <div className="max-w-xs">
          <MonthInput
            date={date}
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
    minDate.setMonth(minDate.getMonth() - 6); // 6 months ago

    return (
      <div style={{ minHeight: "400px" }}>
        <div className="max-w-xs">
          <MonthInput
            date={date}
            minDate={minDate}
            onChange={(newDate) => setDate(newDate as Date | null)}
          />
          <p className="mt-2 text-sm text-gray-600">
            Min date: {minDate.toLocaleDateString()}
          </p>
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
          <MonthInput
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
      "2024-12-01"
    );
    return (
      <div style={{ minHeight: "400px" }}>
        <div className="max-w-xs">
          <MonthInput
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
          <MonthInput
            date={date}
            onChange={(newDate) => setDate(newDate as Date | null)}
            onSelect={(selectedDate) =>
              setSelected(
                `Selected: ${selectedDate.toLocaleDateString("default", { month: "long", year: "numeric" })}`
              )
            }
          />
          {selected && <p className="text-sm text-gray-600">{selected}</p>}
        </div>
      </div>
    );
  },
};
