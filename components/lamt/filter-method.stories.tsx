import type { Meta, StoryObj } from "@storybook/nextjs";
import React from "react";
import { useForm } from "react-hook-form";
import { FilterMethod } from "./filter-method";
import { FilterType, Method } from "@/lib/filter-utils";

const meta: Meta<typeof FilterMethod> = {
  title: "LAMT/Filters/FilterMethod",
  component: FilterMethod,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof FilterMethod>;

export const TextFilter: Story = {
  render: () => {
    const methods = useForm({
      defaultValues: {
        searchText: { method: Method.Contains, value: "" },
      },
    });

    const handleFilterChange = (values: Record<string, unknown>) => {
      console.log("Filter changed:", values);
    };

    return (
      <div style={{ minHeight: "500px" }}>
        <div className="max-w-md border rounded-lg p-4">
          <FilterMethod
            name="searchText"
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

export const NumberFilter: Story = {
  render: () => {
    const methods = useForm({
      defaultValues: {
        amount: { method: Method.GreaterThan, value: "" },
      },
    });

    const handleFilterChange = (values: Record<string, unknown>) => {
      console.log("Filter changed:", values);
    };

    return (
      <div style={{ minHeight: "500px" }}>
        <div className="max-w-md border rounded-lg p-4">
          <FilterMethod
            name="amount"
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
      <div style={{ minHeight: "500px" }}>
        <div className="max-w-md border rounded-lg p-4">
          <FilterMethod
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

export const DateRangeFilter: Story = {
  render: () => {
    const methods = useForm({
      defaultValues: {
        dateRange: { method: Method.Between, value: "" },
      },
    });

    const handleFilterChange = (values: Record<string, unknown>) => {
      console.log("Filter changed:", values);
    };

    return (
      <div style={{ minHeight: "500px" }}>
        <div className="max-w-md border rounded-lg p-4">
          <FilterMethod
            name="dateRange"
            type={FilterType.Date}
            method={Method.Between}
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
      { id: "active", name: "Active" },
      { id: "inactive", name: "Inactive" },
      { id: "pending", name: "Pending" },
      { id: "completed", name: "Completed" },
    ];

    return (
      <div style={{ minHeight: "500px" }}>
        <div className="max-w-md border rounded-lg p-4">
          <FilterMethod
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

export const PhoneFilter: Story = {
  render: () => {
    const methods = useForm({
      defaultValues: {
        phoneNumber: { method: Method.Contains, value: "" },
      },
    });

    const handleFilterChange = (values: Record<string, unknown>) => {
      console.log("Filter changed:", values);
    };

    return (
      <div style={{ minHeight: "500px" }}>
        <div className="max-w-md border rounded-lg p-4">
          <FilterMethod
            name="phoneNumber"
            type={FilterType.Phone}
            method={Method.Contains}
            formControl={methods}
            onChangeFilter={handleFilterChange}
          />
        </div>
      </div>
    );
  },
};
