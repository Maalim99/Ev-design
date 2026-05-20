import type { Meta, StoryObj } from "@storybook/nextjs";
import DownloadButton from "./download-button";
import { ButtonKind } from "./button";

const meta: Meta<typeof DownloadButton> = {
  title: "LAMT/DownloadButton",
  component: DownloadButton,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof DownloadButton>;

export const Default: Story = {
  args: {
    text: "Download CSV",
    endpoint: "https://api.example.com/export",
    resource: "users",
    fields: ["id", "name", "email"],
  },
};

export const WithFilters: Story = {
  args: {
    text: "Download Filtered Data",
    endpoint: "https://api.example.com/export",
    resource: "transactions",
    fields: ["id", "date", "amount", "status"],
    filters: {
      status: "completed",
      dateFrom: "2024-01-01",
    },
  },
};

export const PrimaryButton: Story = {
  args: {
    text: "Export Report",
    endpoint: "https://api.example.com/export",
    resource: "report",
    fields: ["all"],
    kind: ButtonKind.Primary,
  },
};

export const GhostButton: Story = {
  args: {
    text: "Download",
    endpoint: "https://api.example.com/export",
    resource: "data",
    fields: ["id", "value"],
    kind: ButtonKind.Ghost,
  },
};

export const Disabled: Story = {
  args: {
    text: "Download",
    endpoint: "https://api.example.com/export",
    resource: "data",
    fields: ["id"],
    disabled: true,
  },
};

export const CustomText: Story = {
  args: {
    text: "Export to CSV",
    endpoint: "https://api.example.com/export",
    resource: "customers",
    fields: ["customer_id", "name", "email", "phone"],
  },
};
