import type { Meta, StoryObj } from "@storybook/nextjs";
import { EvoStatusChip, CustomStatusChip } from "./evo-status-chip";
import type { EvoStatus } from "@/data/dummy";

const meta: Meta<typeof EvoStatusChip> = {
  title: "LAMT/EvoStatusChip",
  component: EvoStatusChip,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
A status chip component specifically designed for EVO (Electric Vehicle Operator) status display.
Refactored from EV Core with Tailwind CSS integration and enhanced features.

## Features
- Predefined EVO status mapping with consistent colors
- Multiple size variants (sm, md, lg)
- Visual variants for different contexts
- Optional animated dots for active states
- Accessibility support with ARIA labels
- Custom status chip variant for flexible use cases

## EVO Status Types
- **ACTIVE**: Operator is currently active and operational
- **PENDING_BGC**: Awaiting background check completion
- **PENDING_OSP**: Awaiting onboard service provider training
- **PENDING_RP**: Awaiting route planning assignment
- **PARTIAL_RP**: Partially assigned to routes
- **PENDING_HO**: Awaiting handover completion
- **INACTIVE**: Operator is inactive
- **DISENGAGED**: Operator has been disengaged from the system
        `,
      },
    },
  },
  tags: ["autodocs"],
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
        "DISENGAGED"
      ] as EvoStatus[],
      description: "EVO status enum value",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Size of the chip",
    },
    variant: {
      control: "select",
      options: ["default", "compact", "pill"],
      description: "Visual variant of the chip",
    },
    animated: {
      control: "boolean",
      description: "Show animated status dot for active states",
    },
    hideDot: {
      control: "boolean",
      description: "Hide the status dot",
    },
  },
};

export default meta;
type Story = StoryObj<typeof EvoStatusChip>;

// Default story
export const Default: Story = {
  args: {
    status: "ACTIVE",
  },
};

// All statuses showcase
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
};

// Different sizes
export const SmallSize: Story = {
  args: {
    status: "ACTIVE",
    size: "sm",
  },
};

export const MediumSize: Story = {
  args: {
    status: "PENDING_BGC",
    size: "md",
  },
};

export const LargeSize: Story = {
  args: {
    status: "DISENGAGED",
    size: "lg",
  },
};

// Size comparison
export const SizeComparison: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <div className="text-center">
        <EvoStatusChip status="ACTIVE" size="sm" />
        <div className="text-xs text-gray-500 mt-2">Small</div>
      </div>
      <div className="text-center">
        <EvoStatusChip status="ACTIVE" size="md" />
        <div className="text-xs text-gray-500 mt-2">Medium</div>
      </div>
      <div className="text-center">
        <EvoStatusChip status="ACTIVE" size="lg" />
        <div className="text-xs text-gray-500 mt-2">Large</div>
      </div>
    </div>
  ),
};

// Variants
export const CompactVariant: Story = {
  args: {
    status: "PENDING_OSP",
    variant: "compact",
  },
};

export const PillVariant: Story = {
  args: {
    status: "PARTIAL_RP",
    variant: "pill",
  },
};

export const VariantComparison: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <EvoStatusChip status="ACTIVE" variant="default" />
        <span className="text-sm text-gray-500">Default</span>
      </div>
      <div className="flex items-center gap-4">
        <EvoStatusChip status="ACTIVE" variant="compact" />
        <span className="text-sm text-gray-500">Compact</span>
      </div>
      <div className="flex items-center gap-4">
        <EvoStatusChip status="ACTIVE" variant="pill" />
        <span className="text-sm text-gray-500">Pill</span>
      </div>
    </div>
  ),
};

// Animated states
export const Animated: Story = {
  args: {
    status: "ACTIVE",
    animated: true,
  },
};

export const AnimatedPending: Story = {
  args: {
    status: "PENDING_BGC",
    animated: true,
  },
};

export const AnimationShowcase: Story = {
  render: () => (
    <div className="space-y-3">
      <div className="flex items-center gap-4">
        <EvoStatusChip status="ACTIVE" animated={true} />
        <span className="text-sm text-gray-500">Active (Animated)</span>
      </div>
      <div className="flex items-center gap-4">
        <EvoStatusChip status="PENDING_BGC" animated={true} />
        <span className="text-sm text-gray-500">Pending BGC (Animated)</span>
      </div>
      <div className="flex items-center gap-4">
        <EvoStatusChip status="PENDING_OSP" animated={true} />
        <span className="text-sm text-gray-500">Pending OSP (Animated)</span>
      </div>
    </div>
  ),
};

// Without dots
export const WithoutDot: Story = {
  args: {
    status: "ACTIVE",
    hideDot: true,
  },
};

export const WithoutDotsShowcase: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <EvoStatusChip status="ACTIVE" hideDot={true} />
      <EvoStatusChip status="PENDING_BGC" hideDot={true} />
      <EvoStatusChip status="DISENGAGED" hideDot={true} />
    </div>
  ),
};

// Custom labels
export const CustomLabel: Story = {
  args: {
    status: "ACTIVE",
    customLabel: "Online Now",
  },
};

// In table context
export const InTableContext: Story = {
  render: () => (
    <div className="bg-white border rounded-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Operator</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Status</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Last Updated</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          <tr>
            <td className="px-4 py-3 text-sm text-gray-900">John Doe</td>
            <td className="px-4 py-3">
              <EvoStatusChip status="ACTIVE" size="sm" />
            </td>
            <td className="px-4 py-3 text-sm text-gray-500">2 mins ago</td>
          </tr>
          <tr>
            <td className="px-4 py-3 text-sm text-gray-900">Jane Smith</td>
            <td className="px-4 py-3">
              <EvoStatusChip status="PENDING_BGC" size="sm" />
            </td>
            <td className="px-4 py-3 text-sm text-gray-500">1 hour ago</td>
          </tr>
          <tr>
            <td className="px-4 py-3 text-sm text-gray-900">Bob Johnson</td>
            <td className="px-4 py-3">
              <EvoStatusChip status="DISENGAGED" size="sm" />
            </td>
            <td className="px-4 py-3 text-sm text-gray-500">3 days ago</td>
          </tr>
        </tbody>
      </table>
    </div>
  ),
  parameters: {
    layout: "fullscreen",
    backgrounds: {
      default: "light",
    },
  },
};

// Custom status chip examples
export const CustomStatusChipExample: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <CustomStatusChip
        bgColor="#E8F5E8"
        textColor="#2E7D32"
        dotColor="#4CAF50"
        label="Verified"
      />
      <CustomStatusChip
        bgColor="#FFF3E0"
        textColor="#E65100"
        dotColor="#FF9800"
        label="Under Review"
      />
      <CustomStatusChip
        bgColor="#F3E5F5"
        textColor="#7B1FA2"
        dotColor="#9C27B0"
        label="Premium"
        variant="pill"
      />
    </div>
  ),
};

// Responsive showcase
export const ResponsiveShowcase: Story = {
  render: () => (
    <div className="space-y-6 p-4">
      <div>
        <h3 className="text-lg font-semibold mb-4">Status Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border text-center">
            <EvoStatusChip status="ACTIVE" animated={true} />
            <div className="text-2xl font-bold text-green-600 mt-2">156</div>
            <div className="text-sm text-gray-500">Active Operators</div>
          </div>
          <div className="bg-white p-4 rounded-lg border text-center">
            <EvoStatusChip status="PENDING_BGC" animated={true} />
            <div className="text-2xl font-bold text-orange-600 mt-2">23</div>
            <div className="text-sm text-gray-500">Pending BGC</div>
          </div>
          <div className="bg-white p-4 rounded-lg border text-center">
            <EvoStatusChip status="PENDING_OSP" animated={true} />
            <div className="text-2xl font-bold text-blue-600 mt-2">45</div>
            <div className="text-sm text-gray-500">Pending OSP</div>
          </div>
          <div className="bg-white p-4 rounded-lg border text-center">
            <EvoStatusChip status="DISENGAGED" />
            <div className="text-2xl font-bold text-red-600 mt-2">8</div>
            <div className="text-sm text-gray-500">Disengaged</div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">All Status Types</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <EvoStatusChip status="ACTIVE" />
          <EvoStatusChip status="PENDING_BGC" />
          <EvoStatusChip status="PENDING_OSP" />
          <EvoStatusChip status="PENDING_RP" />
          <EvoStatusChip status="PARTIAL_RP" />
          <EvoStatusChip status="PENDING_HO" />
          <EvoStatusChip status="INACTIVE" />
          <EvoStatusChip status="DISENGAGED" />
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: "fullscreen",
  },
};