import type { Meta, StoryObj } from "@storybook/nextjs";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { EvoFormFiltersDrawer } from "./evo-form-filters-drawer";
import { Button } from "./button";
import { FilterType, Method } from "@/lib/filter-utils";
import type { EvoFormFilterSection } from "./evo-form-filters-drawer";

const meta: Meta<typeof EvoFormFiltersDrawer> = {
  title: "LAMT/Filters/EvoFormFiltersDrawer",
  component: EvoFormFiltersDrawer,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof EvoFormFiltersDrawer>;

// Mock filter sections data
const mockFilterSections: EvoFormFilterSection[] = [
  {
    id: "customer",
    title: "Customer Information",
    filters: [
      {
        name: "customerName",
        headerName: "Customer Name",
        title: "Filter by customer name",
        type: FilterType.Str,
        defaultMethod: Method.Contains,
        defaultValue: "",
      },
      {
        name: "customerEmail",
        headerName: "Email Address",
        title: "Filter by email address",
        type: FilterType.Str,
        defaultMethod: Method.Contains,
        defaultValue: "",
      },
      {
        name: "customerType",
        headerName: "Customer Type",
        type: FilterType.Select,
        defaultMethod: Method.Equals,
        defaultValue: "",
        options: [
          { id: "individual", name: "Individual" },
          { id: "business", name: "Business" },
          { id: "enterprise", name: "Enterprise" },
        ],
      },
    ],
  },
  {
    id: "order",
    title: "Order Details",
    filters: [
      {
        name: "orderAmount",
        headerName: "Order Amount",
        title: "Filter by order total amount",
        type: FilterType.Num,
        defaultMethod: Method.GreaterThan,
        defaultValue: "",
      },
      {
        name: "orderDate",
        headerName: "Order Date",
        title: "Filter by order date",
        type: FilterType.Date,
        defaultMethod: Method.GreaterThan,
        defaultValue: "",
      },
      {
        name: "orderStatus",
        headerName: "Order Status",
        type: FilterType.Select,
        defaultMethod: Method.Equals,
        defaultValue: "",
        options: [
          { id: "pending", name: "Pending" },
          { id: "processing", name: "Processing" },
          { id: "shipped", name: "Shipped" },
          { id: "delivered", name: "Delivered" },
          { id: "cancelled", name: "Cancelled" },
        ],
      },
    ],
  },
  {
    id: "product",
    title: "Product Information",
    filters: [
      {
        name: "productName",
        headerName: "Product Name",
        title: "Filter by product name",
        type: FilterType.Str,
        defaultMethod: Method.Contains,
        defaultValue: "",
      },
      {
        name: "productCategory",
        headerName: "Category",
        type: FilterType.Select,
        defaultMethod: Method.Equals,
        defaultValue: "",
        options: [
          { id: "electronics", name: "Electronics" },
          { id: "clothing", name: "Clothing" },
          { id: "books", name: "Books" },
          { id: "home", name: "Home & Garden" },
        ],
      },
      {
        name: "productPrice",
        headerName: "Price Range",
        title: "Filter by product price",
        type: FilterType.Num,
        defaultMethod: Method.LessThan,
        defaultValue: "",
      },
    ],
  },
];

export const Default: Story = {
  render: () => {
    const [opened, setOpened] = useState(false);
    const formControl = useForm({
      defaultValues: {
        customerName: { method: Method.Contains, value: "" },
        customerEmail: { method: Method.Contains, value: "" },
        customerType: { method: Method.Equals, value: "" },
        orderAmount: { method: Method.GreaterThan, value: "" },
        orderDate: { method: Method.GreaterThan, value: "" },
        orderStatus: { method: Method.Equals, value: "" },
        productName: { method: Method.Contains, value: "" },
        productCategory: { method: Method.Equals, value: "" },
        productPrice: { method: Method.LessThan, value: "" },
      },
    });

    const handleFilterChange = (values: Record<string, unknown>) => {
      console.log("Filter changed:", values);
    };

    const handleResetAll = () => {
      formControl.reset();
      console.log("All filters reset");
    };

    return (
      <div className="p-4">
        <Button onClick={() => setOpened(true)}>Open Filters Drawer</Button>
        <EvoFormFiltersDrawer
          opened={opened}
          onClose={() => setOpened(false)}
          sections={mockFilterSections}
          formControl={formControl}
          onChangeFilter={handleFilterChange}
          onResetAll={handleResetAll}
        />
      </div>
    );
  },
};

export const WithPreFilledFilters: Story = {
  render: () => {
    const [opened, setOpened] = useState(false);
    const formControl = useForm({
      defaultValues: {
        customerName: { method: Method.Contains, value: "John" },
        customerType: { method: Method.Equals, value: "business" },
        orderAmount: { method: Method.GreaterThan, value: "100" },
        orderStatus: { method: Method.Equals, value: "pending" },
        productCategory: { method: Method.Equals, value: "electronics" },
        productPrice: { method: Method.LessThan, value: "500" },
      },
    });

    const handleFilterChange = (values: Record<string, unknown>) => {
      console.log("Filter changed:", values);
    };

    const handleResetAll = () => {
      formControl.reset();
      console.log("All filters reset");
    };

    return (
      <div className="p-4">
        <Button onClick={() => setOpened(true)}>Open Filters Drawer (Pre-filled)</Button>
        <EvoFormFiltersDrawer
          opened={opened}
          onClose={() => setOpened(false)}
          sections={mockFilterSections}
          formControl={formControl}
          onChangeFilter={handleFilterChange}
          onResetAll={handleResetAll}
        />
      </div>
    );
  },
};

export const SingleSection: Story = {
  render: () => {
    const [opened, setOpened] = useState(false);
    const singleSection = [mockFilterSections[0]]; // Just customer information
    const formControl = useForm({
      defaultValues: {
        customerName: { method: Method.Contains, value: "" },
        customerEmail: { method: Method.Contains, value: "" },
        customerType: { method: Method.Equals, value: "" },
      },
    });

    const handleFilterChange = (values: Record<string, unknown>) => {
      console.log("Filter changed:", values);
    };

    const handleResetAll = () => {
      formControl.reset();
      console.log("All filters reset");
    };

    return (
      <div className="p-4">
        <Button onClick={() => setOpened(true)}>Open Single Section Filters</Button>
        <EvoFormFiltersDrawer
          opened={opened}
          onClose={() => setOpened(false)}
          sections={singleSection}
          formControl={formControl}
          onChangeFilter={handleFilterChange}
          onResetAll={handleResetAll}
        />
      </div>
    );
  },
};