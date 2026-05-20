import type { Meta, StoryObj } from "@storybook/nextjs";
import React from "react";
import { StatusSummary } from "./status-summary";
import { StatusChip, StatusChipType } from "./status-chip";

const meta: Meta<typeof StatusSummary> = {
  title: "LAMT/Display/StatusSummary",
  component: StatusSummary,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof StatusSummary>;

export const Default: Story = {
  args: {
    status: "Pending",
    count: 42,
  },
};

export const WithHighCount: Story = {
  args: {
    status: "Completed",
    count: 1234,
  },
};

export const WithZeroCount: Story = {
  args: {
    status: "Failed",
    count: 0,
  },
};

export const WithStatusChip: Story = {
  args: {
    status: <StatusChip type={StatusChipType.Success}>Active</StatusChip>,
    count: 87,
  },
};

export const MultipleStatuses: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <StatusSummary status="Pending" count={12} />
      <StatusSummary status="In Progress" count={8} />
      <StatusSummary status="Completed" count={45} />
      <StatusSummary status="Failed" count={3} />
    </div>
  ),
};

export const WithStatusChips: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <StatusSummary
        status={<StatusChip type={StatusChipType.Normal}>Pending</StatusChip>}
        count={12}
      />
      <StatusSummary
        status={<StatusChip type={StatusChipType.Info}>In Progress</StatusChip>}
        count={8}
      />
      <StatusSummary
        status={<StatusChip type={StatusChipType.Success}>Completed</StatusChip>}
        count={45}
      />
      <StatusSummary
        status={<StatusChip type={StatusChipType.Danger}>Failed</StatusChip>}
        count={3}
      />
    </div>
  ),
};

export const LargeNumbers: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <StatusSummary status="Total Users" count={12500} />
      <StatusSummary status="Active Sessions" count={3847} />
      <StatusSummary status="Total Revenue" count={98765} />
    </div>
  ),
};
