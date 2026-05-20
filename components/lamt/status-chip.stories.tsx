import type { Meta, StoryObj } from "@storybook/nextjs";
import StatusChip, { StatusChipType } from "./status-chip";

const meta: Meta<typeof StatusChip> = {
  title: "LAMT/StatusChip",
  component: StatusChip,
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: Object.values(StatusChipType),
      description: "Color variant of the status chip",
    },
  },
};

export default meta;

type Story = StoryObj<typeof StatusChip>;

export const Normal: Story = {
  args: {
    type: "normal",
    children: "Normal",
  },
};

export const Danger: Story = {
  args: {
    type: "danger",
    children: "Danger",
  },
};

export const Warning: Story = {
  args: {
    type: "warning",
    children: "Warning",
  },
};

export const Success: Story = {
  args: {
    type: "success",
    children: "Success",
  },
};

export const Accent: Story = {
  args: {
    type: "accent",
    children: "Accent",
  },
};

export const Info: Story = {
  args: {
    type: "info",
    children: "Info",
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <StatusChip type="normal">Normal</StatusChip>
      <StatusChip type="danger">Danger</StatusChip>
      <StatusChip type="dangerM">Danger Medium</StatusChip>
      <StatusChip type="dangerL">Danger Light</StatusChip>
      <StatusChip type="warning">Warning</StatusChip>
      <StatusChip type="success">Success</StatusChip>
      <StatusChip type="accent">Accent</StatusChip>
      <StatusChip type="accentM">Accent Medium</StatusChip>
      <StatusChip type="info">Info</StatusChip>
      <StatusChip type="infoM">Info Medium</StatusChip>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "All available status chip color variants",
      },
    },
  },
};

export const StatusExamples: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium w-32">Payment Status:</span>
        <StatusChip type="success">Paid</StatusChip>
        <StatusChip type="warning">Pending</StatusChip>
        <StatusChip type="danger">Overdue</StatusChip>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium w-32">Order Status:</span>
        <StatusChip type="accent">Processing</StatusChip>
        <StatusChip type="success">Shipped</StatusChip>
        <StatusChip type="normal">Delivered</StatusChip>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium w-32">Alert Level:</span>
        <StatusChip type="info">Info</StatusChip>
        <StatusChip type="warning">Warning</StatusChip>
        <StatusChip type="danger">Critical</StatusChip>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Real-world usage examples of status chips in different contexts",
      },
    },
  },
};

export const MediumVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <StatusChip type="accentM">Accent Medium</StatusChip>
      <StatusChip type="dangerM">Danger Medium</StatusChip>
      <StatusChip type="infoM">Info Medium</StatusChip>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Medium intensity color variants with darker text",
      },
    },
  },
};

export const LightVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <StatusChip type="dangerL">Danger Light</StatusChip>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Light color variants for subtle status indicators",
      },
    },
  },
};

export const CustomContent: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <StatusChip type="success">✓ Verified</StatusChip>
      <StatusChip type="danger">✗ Failed</StatusChip>
      <StatusChip type="warning">⚠ Alert</StatusChip>
      <StatusChip type="info">ⓘ Notice</StatusChip>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Status chips with icons or special characters",
      },
    },
  },
};
