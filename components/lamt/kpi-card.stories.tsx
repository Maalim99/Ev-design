import type { Meta, StoryObj } from "@storybook/nextjs";
import {
  Award,
  Clock,
  AlertCircle,
  ShieldCheck,
  Users,
  DollarSign,
  TrendingUp,
  Target,
  Activity,
  Zap
} from "lucide-react";
import { KpiCard } from "./kpi-card";

const meta: Meta<typeof KpiCard> = {
  title: "LAMT/KpiCard",
  component: KpiCard,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
A flexible KPI Card component built with Tailwind CSS for displaying key performance indicators.
Refactored from EV Core with enhanced modularity and theming support.

## Features
- Multiple size variants (sm, md, lg)
- Color-coded variants for different states
- Dynamic font sizing based on content length
- Hover animations and accessibility
- Clickable variant for interactive cards
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "success", "warning", "danger", "neutral"],
      description: "Visual variant of the card",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Size of the card",
    },
    deltaType: {
      control: "select",
      options: ["positive", "negative", "neutral"],
      description: "Type of delta for color coding",
    },
    clickable: {
      control: "boolean",
      description: "Makes the card clickable with hover effects",
    },
    icon: {
      control: false,
      description: "Lucide icon component",
    },
  },
};

export default meta;
type Story = StoryObj<typeof KpiCard>;

// Default story
export const Default: Story = {
  args: {
    label: "Total Users",
    value: "1,234",
    delta: "↑ 12% from last month",
    deltaType: "positive",
    icon: Users,
  },
};

// Different variants
export const Success: Story = {
  args: {
    label: "Completed Tasks",
    value: "856",
    delta: "↑ 23% increase",
    deltaType: "positive",
    icon: ShieldCheck,
    variant: "success",
  },
};

export const Warning: Story = {
  args: {
    label: "Pending Reviews",
    value: "42",
    delta: "⚠ Needs attention",
    deltaType: "neutral",
    icon: AlertCircle,
    variant: "warning",
  },
};

export const Danger: Story = {
  args: {
    label: "Failed Operations",
    value: "8",
    delta: "↑ 3 more than yesterday",
    deltaType: "negative",
    icon: Target,
    variant: "danger",
  },
};

// Different sizes
export const SmallSize: Story = {
  args: {
    label: "Active Sessions",
    value: "127",
    delta: "Live now",
    deltaType: "positive",
    icon: Activity,
    size: "sm",
  },
};

export const LargeSize: Story = {
  args: {
    label: "Revenue",
    value: "$45,231",
    delta: "↑ 15% growth",
    deltaType: "positive",
    icon: DollarSign,
    size: "lg",
  },
};

// Long values (dynamic sizing)
export const LongValue: Story = {
  args: {
    label: "Very Long Number",
    value: "1,234,567,890",
    delta: "Dynamic font sizing",
    deltaType: "neutral",
    icon: TrendingUp,
  },
};

export const ShortValue: Story = {
  args: {
    label: "Count",
    value: "5",
    delta: "Large display",
    deltaType: "positive",
    icon: Zap,
  },
};

// Clickable variant
export const Clickable: Story = {
  args: {
    label: "Click Me",
    value: "Interactive",
    delta: "Hover to see effect",
    deltaType: "positive",
    icon: TrendingUp,
    clickable: true,
    onClick: () => alert("KPI Card clicked!"),
  },
};

// Without delta
export const WithoutDelta: Story = {
  args: {
    label: "Simple Display",
    value: "999",
    icon: Award,
  },
};

// Multiple cards showcase
export const MultipleCards: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
      <KpiCard
        label="Total Revenue"
        value="$52,480"
        delta="↑ 12% from last month"
        deltaType="positive"
        icon={DollarSign}
        variant="success"
      />
      <KpiCard
        label="Active Users"
        value="2,847"
        delta="↑ 8% increase"
        deltaType="positive"
        icon={Users}
        variant="default"
      />
      <KpiCard
        label="Pending Tasks"
        value="156"
        delta="⚠ Review needed"
        deltaType="neutral"
        icon={Clock}
        variant="warning"
      />
      <KpiCard
        label="Failed Requests"
        value="23"
        delta="↓ 5% decrease"
        deltaType="positive"
        icon={AlertCircle}
        variant="danger"
      />
    </div>
  ),
  parameters: {
    layout: "fullscreen",
  },
};

// Responsive showcase
export const ResponsiveShowcase: Story = {
  render: () => (
    <div className="space-y-6 p-4">
      <div>
        <h3 className="text-lg font-semibold mb-4">Small Cards</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <KpiCard label="Orders" value="1.2K" icon={Award} size="sm" />
          <KpiCard label="Revenue" value="$45K" icon={DollarSign} size="sm" variant="success" />
          <KpiCard label="Users" value="890" icon={Users} size="sm" variant="warning" />
          <KpiCard label="Issues" value="12" icon={AlertCircle} size="sm" variant="danger" />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Medium Cards (Default)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <KpiCard label="Conversion Rate" value="12.5%" delta="↑ 2.1% increase" deltaType="positive" icon={TrendingUp} />
          <KpiCard label="Active Sessions" value="1,847" delta="→ No change" deltaType="neutral" icon={Activity} />
          <KpiCard label="Bounce Rate" value="34.2%" delta="↓ 1.8% decrease" deltaType="positive" icon={Target} />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Large Cards</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <KpiCard
            label="Monthly Recurring Revenue"
            value="$125,480"
            delta="↑ 18% growth this quarter"
            deltaType="positive"
            icon={DollarSign}
            size="lg"
            variant="success"
          />
          <KpiCard
            label="Customer Satisfaction"
            value="4.8/5.0"
            delta="↑ 0.2 improvement"
            deltaType="positive"
            icon={Award}
            size="lg"
            variant="success"
          />
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: "fullscreen",
  },
};