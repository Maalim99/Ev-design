import type { Meta, StoryObj } from "@storybook/nextjs";
import PageHeader from "./page-header";
import { ButtonKind } from "./button";

const meta: Meta<typeof PageHeader> = {
  title: "LAMT/PageHeader",
  component: PageHeader,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof PageHeader>;

export const Default: Story = {
  args: {
    title: "Page Title",
    actions: [
      {
        label: "Primary Action",
        kind: ButtonKind.Primary,
        onClick: () => console.log("Primary action clicked"),
      },
      {
        label: "Secondary Action",
        kind: ButtonKind.Secondary,
        onClick: () => console.log("Secondary action clicked"),
      },
    ],
  },
};

export const WithDownload: Story = {
  args: {
    title: "Reports Dashboard",
    actions: [
      {
        label: "Create Report",
        kind: ButtonKind.Primary,
        onClick: () => console.log("Create report clicked"),
      },
    ],
    onClickDownload: () => console.log("Download clicked"),
  },
};

export const WithDisabledDownload: Story = {
  args: {
    title: "Empty Report",
    actions: [
      {
        label: "Configure",
        kind: ButtonKind.Normal,
        onClick: () => console.log("Configure clicked"),
      },
    ],
    onClickDownload: () => console.log("Download clicked"),
    downloadDisabled: true,
  },
};

export const MultipleActions: Story = {
  args: {
    title: "User Management",
    actions: [
      {
        label: "Add User",
        kind: ButtonKind.Primary,
        onClick: () => console.log("Add user clicked"),
      },
      {
        label: "Import",
        kind: ButtonKind.Normal,
        onClick: () => console.log("Import clicked"),
      },
      {
        label: "Export",
        kind: ButtonKind.Ghost,
        onClick: () => console.log("Export clicked"),
      },
    ],
    onClickDownload: () => console.log("Download clicked"),
  },
};

export const WithDisabledAction: Story = {
  args: {
    title: "Settings",
    actions: [
      {
        label: "Save",
        kind: ButtonKind.Primary,
        onClick: () => console.log("Save clicked"),
        disabled: true,
      },
      {
        label: "Cancel",
        kind: ButtonKind.Ghost,
        onClick: () => console.log("Cancel clicked"),
      },
    ],
  },
};

export const LongTitle: Story = {
  args: {
    title: "This is a Very Long Page Title That Should Still Display Properly",
    actions: [
      {
        label: "Action",
        kind: ButtonKind.Primary,
        onClick: () => console.log("Action clicked"),
      },
    ],
  },
};
