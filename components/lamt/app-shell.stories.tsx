import type { Meta, StoryObj } from "@storybook/nextjs";
import React from "react";
import { AppShell, PageHeader } from "./app-shell";
import { Button, ButtonKind } from "./button";
import { KpiCard } from "./kpi-card";
import { Users, DollarSign, Activity, TrendingUp } from "lucide-react";

const meta: Meta<typeof AppShell> = {
  title: "LAMT/AppShell",
  component: AppShell,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
A comprehensive application shell component that provides the main layout structure.
Refactored from EV Core with Tailwind CSS integration and enhanced modularity.

## Features
- Fixed topbar with responsive navigation
- User menu with dropdown actions
- Notification indicator
- Customizable logo and branding
- Badge support for navigation items
- Responsive design with mobile support
- Keyboard accessibility
- Modular sub-components for easy customization

## Layout Structure
- **Header**: Fixed topbar with logo, navigation, and user controls
- **Main Content**: Scrollable content area with proper spacing
- **Navigation**: Horizontal navigation with active state indicators
- **User Menu**: Dropdown with user info and actions

## Sub-components
- **NotificationButton**: Notification bell with badge indicator
- **UserMenu**: User avatar with dropdown menu
- **PageHeader**: Reusable page header with title and actions
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    navigation: {
      control: false,
      description: "Array of navigation items",
    },
    user: {
      control: false,
      description: "User information object",
    },
    notificationCount: {
      control: "number",
      description: "Number of unread notifications",
    },
    logo: {
      control: "text",
      description: "Logo text or component",
    },
    pageTitle: {
      control: "text",
      description: "Page title for browser tab",
    },
  },
};

export default meta;
type Story = StoryObj<typeof AppShell>;

// Sample content components
const SampleDashboard = () => (
  <div className="space-y-6">
    <PageHeader
      title="Analytics Dashboard"
      subtitle="Overview of key metrics and performance indicators"
      actions={[
        <Button key="export" kind={ButtonKind.Ghost}>Export Data</Button>,
        <Button key="refresh" kind={ButtonKind.Primary}>Refresh</Button>,
      ]}
    />

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <KpiCard
        label="Total Users"
        value="2,847"
        delta="↑ 8% increase"
        deltaType="positive"
        icon={Users}
      />
      <KpiCard
        label="Revenue"
        value="$52,480"
        delta="↑ 12% growth"
        deltaType="positive"
        icon={DollarSign}
      />
      <KpiCard
        label="Active Sessions"
        value="1,234"
        delta="→ No change"
        deltaType="neutral"
        icon={Activity}
      />
      <KpiCard
        label="Conversion"
        value="4.2%"
        delta="↓ 0.5% decrease"
        deltaType="negative"
        icon={TrendingUp}
      />
    </div>

    <div className="bg-white rounded-lg p-6 border">
      <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-sm font-semibold">{i}</span>
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium">Sample Activity {i}</div>
              <div className="text-xs text-gray-500">2 hours ago</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Default story
export const Default: Story = {
  args: {
    children: <SampleDashboard />,
  },
};

// With custom navigation
export const CustomNavigation: Story = {
  args: {
    navigation: [
      { label: "Home", href: "/" },
      { label: "Projects", href: "/projects", badge: { count: 3, variant: "warning" } },
      { label: "Team", href: "/team" },
      { label: "Settings", href: "/settings" },
      { label: "Reports", href: "/reports", badge: { count: 12, variant: "danger" } },
    ],
    children: (
      <div className="space-y-6">
        <PageHeader
          title="Custom Navigation Example"
          subtitle="This shows a custom navigation configuration"
        />
        <div className="bg-white rounded-lg p-6 border">
          <p>Content area with custom navigation items and badges.</p>
        </div>
      </div>
    ),
  },
};

// With custom user
export const CustomUser: Story = {
  args: {
    user: {
      name: "Sarah Johnson",
      role: "Product Manager",
      initials: "SJ",
    },
    children: (
      <div className="space-y-6">
        <PageHeader
          title="Custom User Example"
          subtitle="Different user information in the header"
        />
        <div className="bg-white rounded-lg p-6 border">
          <p>The user menu shows custom user information.</p>
        </div>
      </div>
    ),
  },
};

// With avatar image
export const WithAvatar: Story = {
  args: {
    user: {
      name: "Alex Chen",
      role: "Senior Developer",
      initials: "AC",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face",
    },
    children: (
      <div className="space-y-6">
        <PageHeader
          title="User with Avatar"
          subtitle="Shows how user avatars are displayed"
        />
        <div className="bg-white rounded-lg p-6 border">
          <p>User menu displays the avatar image instead of initials.</p>
        </div>
      </div>
    ),
  },
};

// No notifications
export const NoNotifications: Story = {
  args: {
    notificationCount: 0,
    children: (
      <div className="space-y-6">
        <PageHeader
          title="No Notifications"
          subtitle="Notification bell without badge indicator"
        />
        <div className="bg-white rounded-lg p-6 border">
          <p>No notification badge is shown when count is 0.</p>
        </div>
      </div>
    ),
  },
};

// Many notifications
export const ManyNotifications: Story = {
  args: {
    notificationCount: 42,
    children: (
      <div className="space-y-6">
        <PageHeader
          title="Many Notifications"
          subtitle="Shows notification indicator with high count"
        />
        <div className="bg-white rounded-lg p-6 border">
          <p>Notification badge shows when there are unread items.</p>
        </div>
      </div>
    ),
  },
};

// With topbar actions
export const WithTopbarActions: Story = {
  args: {
    topbarAction: (
      <div className="flex items-center gap-2">
        <Button kind={ButtonKind.Ghost} size="sm">
          Quick Action
        </Button>
        <Button kind={ButtonKind.Primary} size="sm">
          Create New
        </Button>
      </div>
    ),
    children: (
      <div className="space-y-6">
        <PageHeader
          title="Custom Topbar Actions"
          subtitle="Additional action buttons in the topbar"
        />
        <div className="bg-white rounded-lg p-6 border">
          <p>Custom actions can be added to the topbar for quick access.</p>
        </div>
      </div>
    ),
  },
};

// With breadcrumbs
export const WithBreadcrumbs: Story = {
  args: {
    children: (
      <div className="space-y-6">
        <PageHeader
          title="User Profile"
          subtitle="Manage user account settings"
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Users", href: "/users" },
            { label: "John Doe" },
          ]}
          actions={[
            <Button key="edit" kind={ButtonKind.Primary}>Edit Profile</Button>,
          ]}
        />
        <div className="bg-white rounded-lg p-6 border">
          <p>Page with breadcrumb navigation and header actions.</p>
        </div>
      </div>
    ),
  },
};

// Custom logo
export const CustomLogo: Story = {
  args: {
    logo: (
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
          <span className="text-white text-xs font-bold">A</span>
        </div>
        <span className="font-bold">Acme Corp</span>
      </div>
    ),
    logoHref: "/dashboard",
    children: (
      <div className="space-y-6">
        <PageHeader
          title="Custom Logo Example"
          subtitle="Shows how to customize the logo area"
        />
        <div className="bg-white rounded-lg p-6 border">
          <p>Logo can be customized with components, images, or text.</p>
        </div>
      </div>
    ),
  },
};

// Interactive demo
export const InteractiveDemo: Story = {
  render: () => {
    const [notificationCount, setNotificationCount] = React.useState(5);
    const [currentUser, setCurrentUser] = React.useState({
      name: "Demo User",
      role: "Administrator",
      initials: "DU",
    });

    const handleNotificationClick = () => {
      setNotificationCount(0);
      alert("Notifications opened!");
    };

    const handleLogout = () => {
      alert("Logout clicked!");
    };

    const handleSettings = () => {
      alert("Settings clicked!");
    };

    const users = [
      { name: "Demo User", role: "Administrator", initials: "DU" },
      { name: "Jane Smith", role: "Manager", initials: "JS" },
      { name: "Bob Johnson", role: "Developer", initials: "BJ" },
    ];

    return (
      <AppShell
        user={currentUser}
        notificationCount={notificationCount}
        onNotificationClick={handleNotificationClick}
        onLogoutClick={handleLogout}
        onSettingsClick={handleSettings}
      >
        <div className="space-y-6">
          <PageHeader
            title="Interactive Demo"
            subtitle="Try the interactive elements"
          />

          <div className="grid gap-6 md:grid-cols-2">
            <div className="bg-white rounded-lg p-6 border">
              <h3 className="text-lg font-semibold mb-4">Notifications</h3>
              <p className="text-sm text-gray-600 mb-4">
                Current count: {notificationCount}
              </p>
              <div className="space-y-2">
                <Button
                  kind={ButtonKind.Ghost}
                  size="sm"
                  onClick={() => setNotificationCount(prev => prev + 1)}
                >
                  Add Notification
                </Button>
                <Button
                  kind={ButtonKind.Ghost}
                  size="sm"
                  onClick={() => setNotificationCount(0)}
                >
                  Clear All
                </Button>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border">
              <h3 className="text-lg font-semibold mb-4">Switch User</h3>
              <div className="space-y-2">
                {users.map((user, index) => (
                  <Button
                    key={index}
                    kind={currentUser.name === user.name ? ButtonKind.Primary : ButtonKind.Ghost}
                    size="sm"
                    onClick={() => setCurrentUser(user)}
                    className="w-full justify-start"
                  >
                    {user.name} ({user.role})
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border">
            <h3 className="text-lg font-semibold mb-4">Instructions</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Click the notification bell to clear notifications</li>
              <li>• Try the user menu for settings and logout options</li>
              <li>• Switch between different users to see the changes</li>
              <li>• Navigate between different sections using the topbar</li>
            </ul>
          </div>
        </div>
      </AppShell>
    );
  },
  parameters: {
    layout: "fullscreen",
  },
};

// Responsive showcase
export const ResponsiveShowcase: Story = {
  args: {
    children: (
      <div className="space-y-6">
        <PageHeader
          title="Responsive Layout"
          subtitle="Resize the viewport to see responsive behavior"
        />

        <div className="bg-white rounded-lg p-6 border">
          <h3 className="text-lg font-semibold mb-4">Responsive Features</h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>• Navigation becomes scrollable on smaller screens</li>
            <li>• User info text hides on mobile devices</li>
            <li>• Content area maintains proper spacing</li>
            <li>• Touch targets are appropriately sized</li>
          </ul>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-gray-50 rounded-lg p-4 border">
              <h4 className="font-semibold mb-2">Card {i}</h4>
              <p className="text-sm text-gray-600">
                Sample content that demonstrates responsive grid behavior.
              </p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  parameters: {
    viewport: {
      defaultViewport: "responsive",
    },
  },
};