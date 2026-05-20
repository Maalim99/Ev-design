import type { Meta, StoryObj } from "@storybook/nextjs";
import Expandable from "./expandable";

const meta: Meta<typeof Expandable> = {
  title: "LAMT/Expandable",
  component: Expandable,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Expandable>;

export const Default: Story = {
  args: {
    headerComponent: (
      <div className="flex items-center justify-between w-full">
        <h4 className="font-semibold text-base">Click to expand</h4>
      </div>
    ),
    contentComponent: (
      <div className="space-y-2">
        <p>This is the expandable content.</p>
        <p>It can contain any React components.</p>
      </div>
    ),
  },
};

export const WithBackground: Story = {
  args: {
    headerComponent: (
      <div className="flex items-center justify-between w-full">
        <h4 className="font-semibold text-base">Section with background</h4>
      </div>
    ),
    contentComponent: (
      <div className="space-y-2">
        <p>This content has a custom background color.</p>
        <p>The background is applied to the content area.</p>
      </div>
    ),
    contentBackground: "#F3F4F6",
  },
};

export const FullWidth: Story = {
  args: {
    headerComponent: (
      <div className="flex items-center justify-between w-full">
        <h4 className="font-semibold text-base">Full width content</h4>
      </div>
    ),
    contentComponent: (
      <div className="space-y-2">
        <p>This content takes the full width available.</p>
        <p>It extends beyond the header margins.</p>
      </div>
    ),
    shouldExpandedItemTakeFullWidth: true,
    contentBackground: "#EFF1F4",
  },
};

export const WithRichHeader: Story = {
  args: {
    headerComponent: (
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white text-sm font-bold">
            1
          </span>
          <div>
            <h4 className="font-semibold text-base">Step 1: Getting Started</h4>
            <p className="text-sm text-neutral">Click to view details</p>
          </div>
        </div>
      </div>
    ),
    contentComponent: (
      <div className="space-y-3">
        <p>Follow these steps to get started:</p>
        <ol className="list-decimal list-inside space-y-1">
          <li>Install the package</li>
          <li>Configure your settings</li>
          <li>Run the application</li>
        </ol>
      </div>
    ),
  },
};

export const MultipleExpandables: Story = {
  render: () => (
    <div className="space-y-4">
      <Expandable
        headerComponent={<h4 className="font-semibold">First Section</h4>}
        contentComponent={<p>Content for the first section.</p>}
      />
      <Expandable
        headerComponent={<h4 className="font-semibold">Second Section</h4>}
        contentComponent={<p>Content for the second section.</p>}
      />
      <Expandable
        headerComponent={<h4 className="font-semibold">Third Section</h4>}
        contentComponent={<p>Content for the third section.</p>}
      />
    </div>
  ),
};
