import type { Meta, StoryObj } from "@storybook/nextjs";
import React, { useState } from "react";
import { EvoPreferencesDrawer, type ColumnPref } from "./evo-preferences-drawer";
import { Button } from "./button";

const meta: Meta<typeof EvoPreferencesDrawer> = {
  title: "LAMT/Filters/EvoPreferencesDrawer",
  component: EvoPreferencesDrawer,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof EvoPreferencesDrawer>;

// Mock column preferences data
const mockColumns: ColumnPref[] = [
  { key: "id", label: "ID", visible: true, required: true },
  { key: "customerName", label: "Customer Name", visible: true, required: true },
  { key: "email", label: "Email Address", visible: true },
  { key: "phone", label: "Phone Number", visible: false },
  { key: "address", label: "Address", visible: false },
  { key: "city", label: "City", visible: true },
  { key: "state", label: "State/Province", visible: false },
  { key: "country", label: "Country", visible: true },
  { key: "zipCode", label: "ZIP/Postal Code", visible: false },
  { key: "orderCount", label: "Total Orders", visible: true },
  { key: "totalSpent", label: "Total Spent", visible: true },
  { key: "lastOrderDate", label: "Last Order Date", visible: true },
  { key: "accountStatus", label: "Account Status", visible: true },
  { key: "customerType", label: "Customer Type", visible: false },
  { key: "loyaltyTier", label: "Loyalty Tier", visible: false },
  { key: "createdDate", label: "Created Date", visible: false },
  { key: "lastLoginDate", label: "Last Login", visible: false },
];

export const Default: Story = {
  render: () => {
    const [opened, setOpened] = useState(false);
    const [columns, setColumns] = useState<ColumnPref[]>(mockColumns);

    const handleChange = (key: string, visible: boolean) => {
      setColumns(prev =>
        prev.map(col =>
          col.key === key ? { ...col, visible } : col
        )
      );
      console.log(`Column ${key} visibility changed to:`, visible);
    };

    const handleReset = () => {
      setColumns(mockColumns);
      console.log("All preferences reset to default");
    };

    return (
      <div className="p-4">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Current Column Visibility</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>Visible columns: {columns.filter(c => c.visible).length}</p>
              <p>Hidden columns: {columns.filter(c => !c.visible).length}</p>
              <p>Required columns (cannot hide): {columns.filter(c => c.required).length}</p>
            </div>
          </div>
          <Button onClick={() => setOpened(true)}>Open Preferences Drawer</Button>
        </div>
        <EvoPreferencesDrawer
          opened={opened}
          onClose={() => setOpened(false)}
          columns={columns}
          onChange={handleChange}
          onReset={handleReset}
        />
      </div>
    );
  },
};

export const MostlyHidden: Story = {
  render: () => {
    const [opened, setOpened] = useState(false);
    const mostlyHiddenColumns = mockColumns.map(col => ({
      ...col,
      visible: col.required || ["customerName", "email", "orderCount"].includes(col.key),
    }));
    const [columns, setColumns] = useState<ColumnPref[]>(mostlyHiddenColumns);

    const handleChange = (key: string, visible: boolean) => {
      setColumns(prev =>
        prev.map(col =>
          col.key === key ? { ...col, visible } : col
        )
      );
      console.log(`Column ${key} visibility changed to:`, visible);
    };

    const handleReset = () => {
      setColumns(mockColumns);
      console.log("All preferences reset to default");
    };

    return (
      <div className="p-4">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Minimal Column Configuration</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>Visible columns: {columns.filter(c => c.visible).length}</p>
              <p>Hidden columns: {columns.filter(c => !c.visible).length}</p>
            </div>
          </div>
          <Button onClick={() => setOpened(true)}>Open Preferences Drawer</Button>
        </div>
        <EvoPreferencesDrawer
          opened={opened}
          onClose={() => setOpened(false)}
          columns={columns}
          onChange={handleChange}
          onReset={handleReset}
        />
      </div>
    );
  },
};

export const AllVisible: Story = {
  render: () => {
    const [opened, setOpened] = useState(false);
    const allVisibleColumns = mockColumns.map(col => ({
      ...col,
      visible: true,
    }));
    const [columns, setColumns] = useState<ColumnPref[]>(allVisibleColumns);

    const handleChange = (key: string, visible: boolean) => {
      setColumns(prev =>
        prev.map(col =>
          col.key === key ? { ...col, visible } : col
        )
      );
      console.log(`Column ${key} visibility changed to:`, visible);
    };

    const handleReset = () => {
      setColumns(mockColumns);
      console.log("All preferences reset to default");
    };

    return (
      <div className="p-4">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">All Columns Visible</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>Visible columns: {columns.filter(c => c.visible).length}</p>
              <p>Hidden columns: {columns.filter(c => !c.visible).length}</p>
            </div>
          </div>
          <Button onClick={() => setOpened(true)}>Open Preferences Drawer</Button>
        </div>
        <EvoPreferencesDrawer
          opened={opened}
          onClose={() => setOpened(false)}
          columns={columns}
          onChange={handleChange}
          onReset={handleReset}
        />
      </div>
    );
  },
};

export const FewColumns: Story = {
  render: () => {
    const [opened, setOpened] = useState(false);
    const fewColumns: ColumnPref[] = [
      { key: "id", label: "ID", visible: true, required: true },
      { key: "name", label: "Name", visible: true, required: true },
      { key: "email", label: "Email", visible: true },
      { key: "status", label: "Status", visible: false },
    ];
    const [columns, setColumns] = useState<ColumnPref[]>(fewColumns);

    const handleChange = (key: string, visible: boolean) => {
      setColumns(prev =>
        prev.map(col =>
          col.key === key ? { ...col, visible } : col
        )
      );
      console.log(`Column ${key} visibility changed to:`, visible);
    };

    const handleReset = () => {
      setColumns(fewColumns);
      console.log("All preferences reset to default");
    };

    return (
      <div className="p-4">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Simple Table with Few Columns</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>Visible columns: {columns.filter(c => c.visible).length}</p>
              <p>Hidden columns: {columns.filter(c => !c.visible).length}</p>
            </div>
          </div>
          <Button onClick={() => setOpened(true)}>Open Preferences Drawer</Button>
        </div>
        <EvoPreferencesDrawer
          opened={opened}
          onClose={() => setOpened(false)}
          columns={columns}
          onChange={handleChange}
          onReset={handleReset}
        />
      </div>
    );
  },
};