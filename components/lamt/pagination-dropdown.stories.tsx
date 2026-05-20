import type { Meta, StoryObj } from "@storybook/nextjs";
import React from "react";
import { PaginationDropdown, SelectVariant } from "./pagination-dropdown";

const meta: Meta<typeof PaginationDropdown> = {
  title: "LAMT/Selection/PaginationDropdown",
  component: PaginationDropdown,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof PaginationDropdown>;

const paginationOptions = [
  { value: 10, label: "10" },
  { value: 25, label: "25" },
  { value: 50, label: "50" },
  { value: 100, label: "100" },
];

const formOptions = [
  { value: "option1", label: "Option 1", description: "First option" },
  { value: "option2", label: "Option 2", description: "Second option" },
  { value: "option3", label: "Option 3", description: "Third option" },
  { value: "option4", label: "Option 4", description: "Fourth option" },
];

export const PaginationVariant: Story = {
  render: () => {
    const [value, setValue] = React.useState<string | number>(25);

    return (
      <div style={{ minHeight: "400px" }}>
        <div className="max-w-xs">
          <PaginationDropdown
            variant={SelectVariant.PAGINATION}
            value={value}
            options={paginationOptions}
            placeholder="Items per page"
            onClickOption={(option) => {
              console.log("Selected:", option);
              setValue(option.value);
            }}
          />
          <p className="mt-4 text-sm text-gray-600">
            Selected value: {value}
          </p>
        </div>
      </div>
    );
  },
};

export const FormVariant: Story = {
  render: () => {
    const [value, setValue] = React.useState<string | number>("");

    return (
      <div style={{ minHeight: "400px" }}>
        <div className="max-w-md">
          <PaginationDropdown
            variant={SelectVariant.FORM}
            value={value}
            options={formOptions}
            placeholder="Select an option..."
            onClickOption={(option) => {
              console.log("Selected:", option);
              setValue(option.value);
            }}
            onClickClear={() => {
              console.log("Cleared");
              setValue("");
            }}
          />
          <p className="mt-4 text-sm text-gray-600">
            Selected value: {value || "None"}
          </p>
        </div>
      </div>
    );
  },
};

export const WithDefaultValue: Story = {
  render: () => {
    const [value, setValue] = React.useState<string | number>(50);

    return (
      <div style={{ minHeight: "400px" }}>
        <div className="max-w-xs">
          <PaginationDropdown
            variant={SelectVariant.PAGINATION}
            value={value}
            defaultValue={50}
            options={paginationOptions}
            placeholder="Items per page"
            onClickOption={(option) => {
              console.log("Selected:", option);
              setValue(option.value);
            }}
          />
          <p className="mt-4 text-sm text-gray-600">
            Selected value: {value}
          </p>
        </div>
      </div>
    );
  },
};

export const HideBorder: Story = {
  render: () => {
    const [value, setValue] = React.useState<string | number>(25);

    return (
      <div style={{ minHeight: "400px" }}>
        <div className="max-w-xs bg-gray-100 p-4 rounded">
          <PaginationDropdown
            variant={SelectVariant.PAGINATION}
            value={value}
            options={paginationOptions}
            hideBorder={true}
            onClickOption={(option) => {
              console.log("Selected:", option);
              setValue(option.value);
            }}
          />
          <p className="mt-4 text-sm text-gray-600">
            Selected value: {value}
          </p>
        </div>
      </div>
    );
  },
};

export const Disabled: Story = {
  render: () => {
    const [value, setValue] = React.useState<string | number>(25);

    return (
      <div style={{ minHeight: "400px" }}>
        <div className="max-w-xs">
          <PaginationDropdown
            variant={SelectVariant.PAGINATION}
            value={value}
            options={paginationOptions}
            disabled={true}
            onClickOption={(option) => {
              console.log("Selected:", option);
              setValue(option.value);
            }}
          />
          <p className="mt-4 text-sm text-gray-600">
            Dropdown is disabled
          </p>
        </div>
      </div>
    );
  },
};

export const FormWithClearButton: Story = {
  render: () => {
    const [value, setValue] = React.useState<string | number>("option2");

    return (
      <div style={{ minHeight: "400px" }}>
        <div className="max-w-md">
          <PaginationDropdown
            variant={SelectVariant.FORM}
            value={value}
            options={formOptions}
            placeholder="Select an option..."
            hideClearButton={false}
            onClickOption={(option) => {
              console.log("Selected:", option);
              setValue(option.value);
            }}
            onClickClear={() => {
              console.log("Cleared");
              setValue("");
            }}
          />
          <p className="mt-4 text-sm text-gray-600">
            Selected value: {value || "None"}
          </p>
        </div>
      </div>
    );
  },
};

export const UppercaseInput: Story = {
  render: () => {
    const [value, setValue] = React.useState<string | number>("");

    const codeOptions = [
      { value: "NYC", label: "NYC", description: "New York City" },
      { value: "LAX", label: "LAX", description: "Los Angeles" },
      { value: "CHI", label: "CHI", description: "Chicago" },
      { value: "MIA", label: "MIA", description: "Miami" },
    ];

    return (
      <div style={{ minHeight: "400px" }}>
        <div className="max-w-md">
          <PaginationDropdown
            variant={SelectVariant.FORM}
            value={value}
            options={codeOptions}
            placeholder="Enter airport code..."
            upperCaseInput={true}
            onClickOption={(option) => {
              console.log("Selected:", option);
              setValue(option.value);
            }}
            onClickClear={() => {
              console.log("Cleared");
              setValue("");
            }}
          />
          <p className="mt-4 text-sm text-gray-600">
            Selected value: {value || "None"}
          </p>
        </div>
      </div>
    );
  },
};
