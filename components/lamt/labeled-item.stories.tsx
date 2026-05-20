import type { Meta, StoryObj } from "@storybook/nextjs";
import LabeledItem from "./labeled-item";

const meta: Meta<typeof LabeledItem> = {
  title: "LAMT/LabeledItem",
  component: LabeledItem,
  tags: ["autodocs"],
  argTypes: {
    isBig: {
      control: "boolean",
      description: "Use larger heading-style text",
    },
    hideValue: {
      control: "boolean",
      description: "Hide the value display",
    },
    forDownload: {
      control: "boolean",
      description: "Style variant for download contexts",
    },
  },
};

export default meta;

type Story = StoryObj<typeof LabeledItem>;

export const Default: Story = {
  args: {
    label: "Customer Name",
    value: "John Doe",
  },
};

export const WithTooltip: Story = {
  args: {
    label: "Account Balance",
    value: "$1,234.56",
    tooltip: "This is the current account balance including pending transactions",
  },
};

export const BigText: Story = {
  args: {
    label: "Total Revenue",
    value: "$45,890",
    isBig: true,
  },
};

export const NoValue: Story = {
  args: {
    label: "Secondary Email",
    value: undefined,
  },
  parameters: {
    docs: {
      description: {
        story: 'When no value is provided, displays "Not available"',
      },
    },
  },
};

export const ZeroValue: Story = {
  args: {
    label: "Failed Attempts",
    value: 0,
  },
  parameters: {
    docs: {
      description: {
        story: "Zero values are properly displayed (not treated as empty)",
      },
    },
  },
};

export const ForDownload: Story = {
  args: {
    label: "Document Name",
    value: "Q4_Financial_Report.pdf",
    forDownload: true,
  },
  parameters: {
    docs: {
      description: {
        story: "Styled for download/export contexts with bolder label",
      },
    },
  },
};

export const Examples: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <LabeledItem label="User ID" value="USR-12345" />
        <LabeledItem label="Email" value="user@example.com" />
        <LabeledItem label="Phone" value="+1 (555) 123-4567" />
        <LabeledItem label="Status" value="Active" />
      </div>

      <hr className="my-6" />

      <div className="grid grid-cols-3 gap-6">
        <LabeledItem
          label="Total Sales"
          value="$125,430"
          isBig
          tooltip="Total sales for the current fiscal year"
        />
        <LabeledItem
          label="New Customers"
          value="342"
          isBig
          tooltip="New customer signups this month"
        />
        <LabeledItem
          label="Growth Rate"
          value="+23.5%"
          isBig
          tooltip="Year-over-year growth percentage"
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Real-world usage examples in a grid layout",
      },
    },
  },
};

export const DataDisplay: Story = {
  render: () => (
    <div className="p-6 bg-white rounded-lg border border-gray-200 space-y-4">
      <h3 className="text-lg font-semibold mb-4">User Information</h3>
      <div className="grid grid-cols-2 gap-4">
        <LabeledItem label="Full Name" value="Jane Smith" />
        <LabeledItem label="Username" value="jsmith" />
        <LabeledItem
          label="Email Address"
          value="jane.smith@company.com"
          tooltip="Primary contact email for this account"
        />
        <LabeledItem label="Phone Number" value="+1 (555) 987-6543" />
        <LabeledItem label="Department" value="Engineering" />
        <LabeledItem label="Role" value="Senior Developer" />
        <LabeledItem label="Employee ID" value="EMP-9876" />
        <LabeledItem
          label="Manager"
          value="Not assigned"
          tooltip="No manager has been assigned to this employee yet"
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Complete user profile data display example",
      },
    },
  },
};

export const Dashboard: Story = {
  render: () => (
    <div className="grid grid-cols-4 gap-6">
      <div className="p-4 bg-white rounded-lg border border-gray-200">
        <LabeledItem
          label="Active Users"
          value="1,248"
          isBig
          tooltip="Currently logged in users"
        />
      </div>
      <div className="p-4 bg-white rounded-lg border border-gray-200">
        <LabeledItem
          label="Revenue"
          value="$89,500"
          isBig
          tooltip="Revenue generated this month"
        />
      </div>
      <div className="p-4 bg-white rounded-lg border border-gray-200">
        <LabeledItem
          label="Conversion Rate"
          value="3.42%"
          isBig
          tooltip="Percentage of visitors who convert to customers"
        />
      </div>
      <div className="p-4 bg-white rounded-lg border border-gray-200">
        <LabeledItem
          label="Avg. Order Value"
          value="$156.78"
          isBig
          tooltip="Average transaction amount"
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Dashboard KPI cards using LabeledItem",
      },
    },
  },
};
