import type { Meta, StoryObj } from "@storybook/nextjs";
import React from "react";
import { FiltersBar } from "./filters-bar";
import { Button, ButtonKind } from "./button";
import { Download, Upload, RefreshCw } from "lucide-react";

const meta: Meta<typeof FiltersBar> = {
  title: "LAMT/Layout/FiltersBar",
  component: FiltersBar,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof FiltersBar>;

export const Default: Story = {
  args: {
    activeFiltersCount: "0",
    onClickFilter: () => console.log("Filter clicked"),
    onClickPreferences: () => console.log("Preferences clicked"),
  },
};

export const WithActiveFilters: Story = {
  args: {
    activeFiltersCount: "3",
    onClickFilter: () => console.log("Filter clicked"),
    onClickPreferences: () => console.log("Preferences clicked"),
  },
};

export const WithClearButton: Story = {
  args: {
    activeFiltersCount: "5",
    onClickFilter: () => console.log("Filter clicked"),
    onClickPreferences: () => console.log("Preferences clicked"),
    onClearFilter: () => console.log("Clear filter clicked"),
  },
};

export const WithLeftActions: Story = {
  args: {
    activeFiltersCount: "2",
    leftActions: [
      <Button key="export" kind={ButtonKind.Ghost}>
        <Download className="mr-2 h-4 w-4" />
        Export
      </Button>,
      <Button key="import" kind={ButtonKind.Ghost}>
        <Upload className="mr-2 h-4 w-4" />
        Import
      </Button>,
    ],
    onClickFilter: () => console.log("Filter clicked"),
    onClickPreferences: () => console.log("Preferences clicked"),
  },
};

export const WithMultipleLeftActions: Story = {
  args: {
    activeFiltersCount: "4",
    leftActions: [
      <Button key="export" kind={ButtonKind.Ghost}>
        <Download className="mr-2 h-4 w-4" />
        Export
      </Button>,
      <Button key="import" kind={ButtonKind.Ghost}>
        <Upload className="mr-2 h-4 w-4" />
        Import
      </Button>,
      <Button key="refresh" kind={ButtonKind.Ghost}>
        <RefreshCw className="mr-2 h-4 w-4" />
        Refresh
      </Button>,
    ],
    onClickFilter: () => console.log("Filter clicked"),
    onClickPreferences: () => console.log("Preferences clicked"),
    onClearFilter: () => console.log("Clear filter clicked"),
  },
};

export const FullExample: Story = {
  render: () => {
    const [filterCount, setFilterCount] = React.useState(3);

    return (
      <div className="space-y-8">
        <FiltersBar
          activeFiltersCount={filterCount}
          leftActions={[
            <Button key="export" kind={ButtonKind.Ghost}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>,
            <Button key="import" kind={ButtonKind.Ghost}>
              <Upload className="mr-2 h-4 w-4" />
              Import
            </Button>,
          ]}
          onClickFilter={() => {
            console.log("Filter clicked");
            alert("Filter panel would open here");
          }}
          onClickPreferences={() => {
            console.log("Preferences clicked");
            alert("Preferences panel would open here");
          }}
          onClearFilter={() => {
            console.log("Clear filter clicked");
            setFilterCount(0);
          }}
        />
        <div className="p-4 border rounded-lg bg-gray-50">
          <p className="text-sm text-gray-600">
            Content area with active filters: {filterCount}
          </p>
          <div className="mt-4 space-x-2">
            <button
              onClick={() => setFilterCount((c) => c + 1)}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Add Filter
            </button>
            <button
              onClick={() => setFilterCount((c) => Math.max(0, c - 1))}
              className="px-4 py-2 bg-gray-500 text-white rounded"
            >
              Remove Filter
            </button>
          </div>
        </div>
      </div>
    );
  },
};

export const NoLeftActions: Story = {
  args: {
    activeFiltersCount: "1",
    onClickFilter: () => console.log("Filter clicked"),
    onClickPreferences: () => console.log("Preferences clicked"),
    onClearFilter: () => console.log("Clear filter clicked"),
  },
};

export const HighFilterCount: Story = {
  args: {
    activeFiltersCount: "42",
    leftActions: [
      <Button key="export" kind={ButtonKind.Ghost}>
        <Download className="mr-2 h-4 w-4" />
        Export
      </Button>,
    ],
    onClickFilter: () => console.log("Filter clicked"),
    onClickPreferences: () => console.log("Preferences clicked"),
    onClearFilter: () => console.log("Clear filter clicked"),
  },
};
