import type { Meta, StoryObj } from "@storybook/nextjs";
import React from "react";
import { PreferencesDrawer } from "./preferences-drawer";
import { Settings, ChevronDown, User, Bell, Shield } from "lucide-react";
import { SwitchInput } from "./switch-input";

const meta: Meta<typeof PreferencesDrawer> = {
  title: "LAMT/Layout/PreferencesDrawer",
  component: PreferencesDrawer,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof PreferencesDrawer>;

export const Default: Story = {
  args: {
    headerComponent: (
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          <span className="font-semibold">General Preferences</span>
        </div>
        <ChevronDown className="h-4 w-4" />
      </div>
    ),
    contentComponent: (
      <div className="text-sm text-gray-600">
        <p>This is where preference content would go.</p>
      </div>
    ),
  },
};

export const WithForm: Story = {
  render: () => {
    const [emailNotifications, setEmailNotifications] = React.useState(true);
    const [pushNotifications, setPushNotifications] = React.useState(false);

    return (
      <div className="max-w-2xl border border-gray-200 rounded-lg">
        <PreferencesDrawer
          headerComponent={
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                <span className="font-semibold">Notification Settings</span>
              </div>
              <ChevronDown className="h-4 w-4" />
            </div>
          }
          contentComponent={
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm">Email Notifications</label>
                <SwitchInput
                  name="email"
                  checked={emailNotifications}
                  onChange={() => setEmailNotifications(!emailNotifications)}
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm">Push Notifications</label>
                <SwitchInput
                  name="push"
                  checked={pushNotifications}
                  onChange={() => setPushNotifications(!pushNotifications)}
                />
              </div>
            </div>
          }
        />
      </div>
    );
  },
};

export const MultipleDrawers: Story = {
  render: () => {
    const [darkMode, setDarkMode] = React.useState(false);
    const [compactView, setCompactView] = React.useState(true);

    return (
      <div className="max-w-2xl space-y-2 border border-gray-200 rounded-lg divide-y">
        <PreferencesDrawer
          headerComponent={
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="font-semibold">Account Settings</span>
              </div>
              <ChevronDown className="h-4 w-4" />
            </div>
          }
          contentComponent={
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Email: user@example.com</p>
              <p className="text-sm text-gray-600">Username: johndoe</p>
              <button className="text-sm text-blue-600 hover:underline">
                Change Password
              </button>
            </div>
          }
        />

        <PreferencesDrawer
          headerComponent={
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span className="font-semibold">Display Preferences</span>
              </div>
              <ChevronDown className="h-4 w-4" />
            </div>
          }
          contentComponent={
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm">Dark Mode</label>
                <SwitchInput
                  name="darkMode"
                  checked={darkMode}
                  onChange={() => setDarkMode(!darkMode)}
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm">Compact View</label>
                <SwitchInput
                  name="compactView"
                  checked={compactView}
                  onChange={() => setCompactView(!compactView)}
                />
              </div>
            </div>
          }
        />

        <PreferencesDrawer
          headerComponent={
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span className="font-semibold">Privacy & Security</span>
              </div>
              <ChevronDown className="h-4 w-4" />
            </div>
          }
          contentComponent={
            <div className="space-y-2 text-sm text-gray-600">
              <p>Manage your privacy and security settings here.</p>
              <button className="text-blue-600 hover:underline">
                View Privacy Policy
              </button>
            </div>
          }
        />
      </div>
    );
  },
};

export const WithCustomBackground: Story = {
  render: () => (
    <div className="max-w-2xl border border-gray-200 rounded-lg">
      <PreferencesDrawer
        headerComponent={
          <div className="flex items-center justify-between w-full">
            <span className="font-semibold">Advanced Options</span>
            <ChevronDown className="h-4 w-4" />
          </div>
        }
        contentComponent={
          <div className="text-sm">
            <p className="mb-2">Custom background color for content area</p>
            <code className="text-xs bg-white p-2 rounded">
              contentBackground=&quot;#F3F4F6&quot;
            </code>
          </div>
        }
        contentBackground="#F3F4F6"
      />
    </div>
  ),
};

export const SimpleText: Story = {
  render: () => (
    <div className="max-w-2xl border border-gray-200 rounded-lg">
      <PreferencesDrawer
        headerComponent={
          <div className="flex items-center justify-between w-full">
            <span className="font-semibold">Click to expand</span>
            <ChevronDown className="h-4 w-4" />
          </div>
        }
        contentComponent={
          <p className="text-sm text-gray-600">
            This is a simple text content that appears when the drawer is opened.
            Click the header again to collapse it.
          </p>
        }
      />
    </div>
  ),
};
