import type { Meta, StoryObj } from "@storybook/nextjs";
import {
  Eye,
  Edit,
  Trash2,
  Download,
  Copy,
  Share2,
  Settings,
  MoreHorizontal,
  UserPlus,
  FileText,
  Star,
  Heart,
  Bookmark,
  Send,
} from "lucide-react";
import { RowActionBtn } from "./row-action-btn";

const meta: Meta<typeof RowActionBtn> = {
  title: "LAMT/RowActionBtn",
  component: RowActionBtn,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
A compact action button component designed for table rows and compact layouts.
Refactored from EV Core with Tailwind CSS integration and enhanced interactions.

## Features
- Multiple color variants for different action types
- Hover and focus animations with scale effects
- Loading state support
- Consistent sizing options
- Enhanced accessibility with ARIA labels
- Smooth transitions and micro-interactions
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "green", "blue", "amber", "danger", "purple"],
      description: "Visual variant of the button",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Size of the button",
    },
    loading: {
      control: "boolean",
      description: "Shows loading spinner when true",
    },
    disabled: {
      control: "boolean",
      description: "Disables the button",
    },
    icon: {
      control: false,
      description: "Icon element to display",
    },
  },
};

export default meta;
type Story = StoryObj<typeof RowActionBtn>;

// Default story
export const Default: Story = {
  args: {
    icon: <Eye size={14} />,
    title: "View details",
    onClick: () => console.log("View clicked"),
  },
};

// Different variants
export const Green: Story = {
  args: {
    icon: <UserPlus size={14} />,
    title: "Add user",
    variant: "green",
    onClick: () => console.log("Add clicked"),
  },
};

export const Blue: Story = {
  args: {
    icon: <FileText size={14} />,
    title: "View document",
    variant: "blue",
    onClick: () => console.log("Document clicked"),
  },
};

export const Amber: Story = {
  args: {
    icon: <Edit size={14} />,
    title: "Edit item",
    variant: "amber",
    onClick: () => console.log("Edit clicked"),
  },
};

export const Danger: Story = {
  args: {
    icon: <Trash2 size={14} />,
    title: "Delete item",
    variant: "danger",
    onClick: () => console.log("Delete clicked"),
  },
};

export const Purple: Story = {
  args: {
    icon: <Settings size={14} />,
    title: "Settings",
    variant: "purple",
    onClick: () => console.log("Settings clicked"),
  },
};

// Different sizes
export const Small: Story = {
  args: {
    icon: <Star size={12} />,
    title: "Favorite",
    variant: "amber",
    size: "sm",
    onClick: () => console.log("Favorite clicked"),
  },
};

export const Large: Story = {
  args: {
    icon: <Download size={16} />,
    title: "Download",
    variant: "blue",
    size: "lg",
    onClick: () => console.log("Download clicked"),
  },
};

// States
export const Loading: Story = {
  args: {
    icon: <Send size={14} />,
    title: "Sending...",
    variant: "green",
    loading: true,
    onClick: () => console.log("Send clicked"),
  },
};

export const Disabled: Story = {
  args: {
    icon: <Share2 size={14} />,
    title: "Share (disabled)",
    variant: "blue",
    disabled: true,
    onClick: () => console.log("Share clicked"),
  },
};

// Common actions showcase
export const CommonActions: Story = {
  render: () => (
    <div className="flex items-center gap-2 p-4">
      <RowActionBtn
        icon={<Eye size={14} />}
        title="View details"
        variant="default"
        onClick={() => console.log("View")}
      />
      <RowActionBtn
        icon={<Edit size={14} />}
        title="Edit item"
        variant="amber"
        onClick={() => console.log("Edit")}
      />
      <RowActionBtn
        icon={<Copy size={14} />}
        title="Duplicate"
        variant="blue"
        onClick={() => console.log("Copy")}
      />
      <RowActionBtn
        icon={<Download size={14} />}
        title="Download"
        variant="green"
        onClick={() => console.log("Download")}
      />
      <RowActionBtn
        icon={<Trash2 size={14} />}
        title="Delete"
        variant="danger"
        onClick={() => console.log("Delete")}
      />
      <RowActionBtn
        icon={<MoreHorizontal size={14} />}
        title="More options"
        variant="default"
        onClick={() => console.log("More")}
      />
    </div>
  ),
};

// Table row simulation
export const InTableRow: Story = {
  render: () => (
    <div className="bg-white border rounded-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Name</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Status</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Date</th>
            <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          <tr>
            <td className="px-4 py-3 text-sm text-gray-900">John Doe</td>
            <td className="px-4 py-3 text-sm">
              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                Active
              </span>
            </td>
            <td className="px-4 py-3 text-sm text-gray-500">2024-01-15</td>
            <td className="px-4 py-3 text-right">
              <div className="flex items-center justify-end gap-2">
                <RowActionBtn
                  icon={<Eye size={14} />}
                  title="View user"
                  variant="default"
                  onClick={() => console.log("View John")}
                />
                <RowActionBtn
                  icon={<Edit size={14} />}
                  title="Edit user"
                  variant="amber"
                  onClick={() => console.log("Edit John")}
                />
                <RowActionBtn
                  icon={<Trash2 size={14} />}
                  title="Delete user"
                  variant="danger"
                  onClick={() => console.log("Delete John")}
                />
              </div>
            </td>
          </tr>
          <tr>
            <td className="px-4 py-3 text-sm text-gray-900">Jane Smith</td>
            <td className="px-4 py-3 text-sm">
              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                Pending
              </span>
            </td>
            <td className="px-4 py-3 text-sm text-gray-500">2024-01-12</td>
            <td className="px-4 py-3 text-right">
              <div className="flex items-center justify-end gap-2">
                <RowActionBtn
                  icon={<Eye size={14} />}
                  title="View user"
                  variant="default"
                  onClick={() => console.log("View Jane")}
                />
                <RowActionBtn
                  icon={<UserPlus size={14} />}
                  title="Approve user"
                  variant="green"
                  onClick={() => console.log("Approve Jane")}
                />
                <RowActionBtn
                  icon={<Send size={14} />}
                  title="Send reminder"
                  variant="blue"
                  loading={true}
                  onClick={() => console.log("Send reminder")}
                />
              </div>
            </td>
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

// Interactive showcase
export const InteractiveShowcase: Story = {
  render: () => (
    <div className="space-y-8 p-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">All Variants</h3>
        <div className="flex flex-wrap gap-3">
          <RowActionBtn icon={<Eye size={14} />} title="Default" variant="default" onClick={() => {}} />
          <RowActionBtn icon={<UserPlus size={14} />} title="Green" variant="green" onClick={() => {}} />
          <RowActionBtn icon={<FileText size={14} />} title="Blue" variant="blue" onClick={() => {}} />
          <RowActionBtn icon={<Edit size={14} />} title="Amber" variant="amber" onClick={() => {}} />
          <RowActionBtn icon={<Trash2 size={14} />} title="Danger" variant="danger" onClick={() => {}} />
          <RowActionBtn icon={<Settings size={14} />} title="Purple" variant="purple" onClick={() => {}} />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">All Sizes</h3>
        <div className="flex items-end gap-3">
          <RowActionBtn icon={<Star size={12} />} title="Small" size="sm" onClick={() => {}} />
          <RowActionBtn icon={<Heart size={14} />} title="Medium" size="md" onClick={() => {}} />
          <RowActionBtn icon={<Bookmark size={16} />} title="Large" size="lg" onClick={() => {}} />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">States</h3>
        <div className="flex gap-3">
          <RowActionBtn icon={<Eye size={14} />} title="Normal" variant="blue" onClick={() => {}} />
          <RowActionBtn icon={<Send size={14} />} title="Loading" variant="green" loading={true} onClick={() => {}} />
          <RowActionBtn icon={<Trash2 size={14} />} title="Disabled" variant="danger" disabled={true} onClick={() => {}} />
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: "fullscreen",
  },
};