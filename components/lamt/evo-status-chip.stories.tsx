import type { Meta, StoryObj } from "@storybook/nextjs";
import { EvoStatusChip } from "./evo-status-chip";
import type { EvoStatus } from "@/data/dummy";

const meta: Meta<typeof EvoStatusChip> = {
  title: "LAMT/EvoStatusChip",
  component: EvoStatusChip,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
A domain-specific status chip component for EVO platform statuses.
This component wraps LAMT's StatusChip and maps EVO-specific status types
to the appropriate LAMT StatusChipType for consistent styling.

## Features
- Domain-specific status handling for EVO platform
- Uses LAMT's clean, minimalist styling
- Supports all 8 EVO status types
- Consistent color coding across the application
        `,
      },
    },
  },
  argTypes: {
    status: {
      control: "select",
      options: [
        "ACTIVE",
        "PENDING_BGC",
        "PENDING_OSP",
        "PENDING_RP",
        "PARTIAL_RP",
        "PENDING_HO",
        "INACTIVE",
        "DISENGAGED",
      ] as EvoStatus[],
      description: "EVO status type",
    },
  },
};

export default meta;
type Story = StoryObj<typeof EvoStatusChip>;

export const Active: Story = {
  args: {
    status: "ACTIVE",
  },
};

export const PendingBGC: Story = {
  args: {
    status: "PENDING_BGC",
  },
};

export const PendingOSP: Story = {
  args: {
    status: "PENDING_OSP",
  },
};

export const PendingRP: Story = {
  args: {
    status: "PENDING_RP",
  },
};

export const PartialRP: Story = {
  args: {
    status: "PARTIAL_RP",
  },
};

export const PendingHO: Story = {
  args: {
    status: "PENDING_HO",
  },
};

export const Inactive: Story = {
  args: {
    status: "INACTIVE",
  },
};

export const Disengaged: Story = {
  args: {
    status: "DISENGAGED",
  },
};

export const AllStatuses: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <EvoStatusChip status="ACTIVE" />
      <EvoStatusChip status="PENDING_BGC" />
      <EvoStatusChip status="PENDING_OSP" />
      <EvoStatusChip status="PENDING_RP" />
      <EvoStatusChip status="PARTIAL_RP" />
      <EvoStatusChip status="PENDING_HO" />
      <EvoStatusChip status="INACTIVE" />
      <EvoStatusChip status="DISENGAGED" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Shows all available EVO status types with their LAMT-styled chip appearance",
      },
    },
  },
};
