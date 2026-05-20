import type { Meta, StoryObj } from "@storybook/nextjs";
import Button, { ButtonKind, ButtonSize } from "./button";
import { Plus, Download, Check, AlertCircle } from "lucide-react";

const meta: Meta<typeof Button> = {
  title: "LAMT/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    kind: {
      control: "select",
      options: Object.values(ButtonKind),
      description: "Visual style variant of the button",
    },
    size: {
      control: "select",
      options: Object.values(ButtonSize),
      description: "Size of the button",
    },
    dashed: {
      control: "boolean",
      description: "Whether to show dashed border (for ghost/secondary)",
    },
    disabled: {
      control: "boolean",
      description: "Whether the button is disabled",
    },
  },
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    kind: "primary",
    children: "Primary Button",
  },
};

export const Normal: Story = {
  args: {
    kind: "normal",
    children: "Normal Button",
  },
};

export const Ghost: Story = {
  args: {
    kind: "ghost",
    children: "Ghost Button",
  },
};

export const Secondary: Story = {
  args: {
    kind: "secondary",
    children: "Secondary Button",
  },
};

export const Transparent: Story = {
  args: {
    kind: "transparent",
    children: "Transparent Button",
  },
};

export const WithIcon: Story = {
  args: {
    kind: "primary",
    icon: <Plus size={16} />,
    children: "Add Item",
  },
};

export const WithContext: Story = {
  args: {
    kind: "normal",
    children: "Submit",
    context: "Cmd + Enter",
  },
  parameters: {
    docs: {
      description: {
        story: "Button with contextual hint text below the main label",
      },
    },
  },
};

export const WithBadge: Story = {
  args: {
    kind: "normal",
    children: "Messages",
    badge: "5",
    badgeColor: "danger",
  },
};

export const Dashed: Story = {
  args: {
    kind: "ghost",
    dashed: true,
    children: "Dashed Border",
  },
};

export const Disabled: Story = {
  args: {
    kind: "primary",
    disabled: true,
    children: "Disabled Button",
  },
};

export const AllKinds: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button kind="primary">Primary</Button>
      <Button kind="normal">Normal</Button>
      <Button kind="ghost">Ghost</Button>
      <Button kind="secondary">Secondary</Button>
      <Button kind="transparent">Transparent</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "All button kind variants displayed together",
      },
    },
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button size="xs">Extra Small</Button>
      <Button size="sm">Small</Button>
      <Button size="m">Medium</Button>
      <Button size="l">Large</Button>
      <Button size="xl">Extra Large</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "All button sizes from xs to xl",
      },
    },
  },
};

export const IconVariations: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button kind="primary" icon={<Plus size={16} />}>
        Add
      </Button>
      <Button kind="normal" icon={<Download size={16} />}>
        Download
      </Button>
      <Button kind="ghost" icon={<Check size={16} />}>
        Confirm
      </Button>
      <Button kind="secondary" icon={<AlertCircle size={16} />}>
        Alert
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Buttons with various lucide-react icons",
      },
    },
  },
};

export const BadgeVariations: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button badge="3" badgeColor="primary">
        Primary Badge
      </Button>
      <Button badge="5" badgeColor="success">
        Success Badge
      </Button>
      <Button badge="!" badgeColor="danger">
        Danger Badge
      </Button>
      <Button badge="99" badgeColor="neutral" badgeSize="md">
        Large Badge
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Buttons with different badge colors and sizes",
      },
    },
  },
};

export const ComplexExample: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button
        kind="primary"
        icon={<Plus size={16} />}
        badge="3"
        badgeColor="danger"
        context="Ctrl + N"
      >
        New Item
      </Button>
      <Button
        kind="ghost"
        dashed
        icon={<Download size={16} />}
        context="⌘ + D"
      >
        Export
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Buttons with combined features: icons, badges, and context hints",
      },
    },
  },
};
