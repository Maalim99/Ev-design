import type { Meta, StoryObj } from "@storybook/nextjs";
import React from "react";
import { useForm } from "react-hook-form";
import { FilterExpandable } from "./filter-expandable";
import { FilterType, Method } from "@/lib/filter-utils";

const meta: Meta<typeof FilterExpandable> = {
  title: "LAMT/Filters/FilterExpandable",
  component: FilterExpandable,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof FilterExpandable>;

export const Default: Story = {
  render: () => {
    const methods = useForm({
      defaultValues: {
        customerName: { method: Method.Contains, value: "" },
      },
    });

    const handleFilterChange = (values: Record<string, unknown>) => {
      console.log("Filter changed:", values);
    };

    return (
      <div style={{ minHeight: "600px" }}>
        <div className="max-w-lg">
          <FilterExpandable
            headerName="Customer Name"
            name="customerName"
            type={FilterType.Str}
            method={Method.Contains}
            formControl={methods}
            onChangeFilter={handleFilterChange}
          />
        </div>
      </div>
    );
  },
};

export const WithTooltip: Story = {
  render: () => {
    const methods = useForm({
      defaultValues: {
        orderAmount: { method: Method.GreaterThan, value: "" },
      },
    });

    const handleFilterChange = (values: Record<string, unknown>) => {
      console.log("Filter changed:", values);
    };

    return (
      <div style={{ minHeight: "600px" }}>
        <div className="max-w-lg">
          <FilterExpandable
            headerName="Order Amount"
            title="Filter orders by their total amount. Use greater than, less than, or equals operators."
            name="orderAmount"
            type={FilterType.Num}
            method={Method.GreaterThan}
            formControl={methods}
            onChangeFilter={handleFilterChange}
          />
        </div>
      </div>
    );
  },
};

export const ActiveFilter: Story = {
  render: () => {
    const methods = useForm({
      defaultValues: {
        email: { method: Method.Contains, value: "test@example.com" },
      },
    });

    const handleFilterChange = (values: Record<string, unknown>) => {
      console.log("Filter changed:", values);
    };

    return (
      <div style={{ minHeight: "600px" }}>
        <div className="max-w-lg">
          <FilterExpandable
            headerName="Email Address"
            name="email"
            type={FilterType.Str}
            method={Method.Contains}
            formControl={methods}
            onChangeFilter={handleFilterChange}
          />
        </div>
      </div>
    );
  },
};

export const DateFilter: Story = {
  render: () => {
    const methods = useForm({
      defaultValues: {
        createdDate: { method: Method.GreaterThan, value: "" },
      },
    });

    const handleFilterChange = (values: Record<string, unknown>) => {
      console.log("Filter changed:", values);
    };

    return (
      <div style={{ minHeight: "600px" }}>
        <div className="max-w-lg">
          <FilterExpandable
            headerName="Created Date"
            title="Filter by the date when the record was created"
            name="createdDate"
            type={FilterType.Date}
            method={Method.GreaterThan}
            formControl={methods}
            onChangeFilter={handleFilterChange}
          />
        </div>
      </div>
    );
  },
};

export const SelectFilter: Story = {
  render: () => {
    const methods = useForm({
      defaultValues: {
        status: { method: Method.Equals, value: "" },
      },
    });

    const handleFilterChange = (values: Record<string, unknown>) => {
      console.log("Filter changed:", values);
    };

    const statusOptions = [
      { id: "pending", name: "Pending" },
      { id: "approved", name: "Approved" },
      { id: "rejected", name: "Rejected" },
      { id: "completed", name: "Completed" },
    ];

    return (
      <div style={{ minHeight: "600px" }}>
        <div className="max-w-lg">
          <FilterExpandable
            headerName="Status"
            title="Filter by approval status"
            name="status"
            type={FilterType.Select}
            method={Method.Equals}
            formControl={methods}
            options={statusOptions}
            onChangeFilter={handleFilterChange}
          />
        </div>
      </div>
    );
  },
};

export const MultipleFilters: Story = {
  render: () => {
    const methods = useForm({
      defaultValues: {
        customerName: { method: Method.Contains, value: "" },
        orderAmount: { method: Method.GreaterThan, value: "100" },
        status: { method: Method.Equals, value: "pending" },
        createdDate: { method: Method.GreaterThan, value: "" },
      },
    });

    const handleFilterChange = (values: Record<string, unknown>) => {
      console.log("Filter changed:", values);
    };

    const statusOptions = [
      { id: "pending", name: "Pending" },
      { id: "approved", name: "Approved" },
      { id: "rejected", name: "Rejected" },
    ];

    return (
      <div style={{ minHeight: "600px" }}>
        <div className="max-w-lg space-y-2">
          <FilterExpandable
            headerName="Customer Name"
            name="customerName"
            type={FilterType.Str}
            method={Method.Contains}
            formControl={methods}
            onChangeFilter={handleFilterChange}
          />
          <FilterExpandable
            headerName="Order Amount"
            title="Filter by order total amount"
            name="orderAmount"
            type={FilterType.Num}
            method={Method.GreaterThan}
            formControl={methods}
            onChangeFilter={handleFilterChange}
          />
          <FilterExpandable
            headerName="Status"
            name="status"
            type={FilterType.Select}
            method={Method.Equals}
            formControl={methods}
            options={statusOptions}
            onChangeFilter={handleFilterChange}
          />
          <FilterExpandable
            headerName="Created Date"
            name="createdDate"
            type={FilterType.Date}
            method={Method.GreaterThan}
            formControl={methods}
            onChangeFilter={handleFilterChange}
          />
        </div>
      </div>
    );
  },
};
