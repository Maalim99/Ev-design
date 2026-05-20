import type { Meta, StoryObj } from "@storybook/nextjs";
import ExpandableContent, { DetailsLabel } from "./expandable-content";

const meta: Meta<typeof ExpandableContent> = {
  title: "LAMT/ExpandableContent",
  component: ExpandableContent,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ExpandableContent>;

const oldPayplanData: DetailsLabel[] = [
  { label: "Plan Type", value: "Basic" },
  { label: "Monthly Cost", value: "$50" },
  { label: "Data Limit", value: "10GB" },
  { label: "Speed", value: "100 Mbps" },
];

const newPayplanData: DetailsLabel[] = [
  { label: "Plan Type", value: "Premium" },
  { label: "Monthly Cost", value: "$80" },
  { label: "Data Limit", value: "Unlimited" },
  { label: "Speed", value: "500 Mbps" },
];

export const Default: Story = {
  args: {
    leftItem: oldPayplanData,
    rightItem: newPayplanData,
  },
};

export const CustomTitles: Story = {
  args: {
    leftItem: oldPayplanData,
    rightItem: newPayplanData,
    leftTitle: "Current Plan",
    rightTitle: "Upgraded Plan",
  },
};

export const WithMissingValues: Story = {
  args: {
    leftItem: [
      { label: "Plan Type", value: "Basic" },
      { label: "Monthly Cost", value: "" },
      { label: "Data Limit", value: "10GB" },
    ],
    rightItem: [
      { label: "Plan Type", value: "Premium" },
      { label: "Monthly Cost", value: "$80" },
      { label: "Data Limit", value: "" },
    ],
    leftTitle: "Old Configuration",
    rightTitle: "New Configuration",
  },
};

export const WithCustomContent: Story = {
  args: {
    leftItem: (
      <div className="space-y-3">
        <p className="text-sm text-neutral">Original Package</p>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Feature A</li>
          <li>Feature B</li>
          <li>Feature C</li>
        </ul>
      </div>
    ),
    rightItem: (
      <div className="space-y-3">
        <p className="text-sm text-neutral">Updated Package</p>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Feature A (Enhanced)</li>
          <li>Feature B (Enhanced)</li>
          <li>Feature C (Enhanced)</li>
          <li>Feature D (New)</li>
        </ul>
      </div>
    ),
    leftTitle: "Before",
    rightTitle: "After",
  },
};

export const ComparisonScenario: Story = {
  args: {
    leftItem: [
      { label: "Status", value: "Pending" },
      { label: "Priority", value: "Low" },
      { label: "Assignee", value: "John Doe" },
      { label: "Due Date", value: "2024-12-31" },
    ],
    rightItem: [
      { label: "Status", value: "In Progress" },
      { label: "Priority", value: "High" },
      { label: "Assignee", value: "Jane Smith" },
      { label: "Due Date", value: "2024-12-15" },
    ],
    leftTitle: "Previous State",
    rightTitle: "Current State",
  },
};
