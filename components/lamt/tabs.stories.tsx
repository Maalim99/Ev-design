import type { Meta, StoryObj } from "@storybook/nextjs";
import { useState } from "react";
import Tabs, { TabItem } from "./tabs";

const meta: Meta<typeof Tabs> = {
  title: "LAMT/Tabs",
  component: Tabs,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Tabs>;

const sampleTabs: TabItem[] = [
  {
    id: "overview",
    label: "Overview",
    content: (
      <div className="p-4">
        <h3 className="text-xl font-bold mb-2">Overview Content</h3>
        <p>This is the overview tab content with important information.</p>
      </div>
    ),
  },
  {
    id: "details",
    label: "Details",
    content: (
      <div className="p-4">
        <h3 className="text-xl font-bold mb-2">Details Content</h3>
        <p>Detailed information goes here.</p>
      </div>
    ),
  },
  {
    id: "settings",
    label: "Settings",
    content: (
      <div className="p-4">
        <h3 className="text-xl font-bold mb-2">Settings Content</h3>
        <p>Configure your settings here.</p>
      </div>
    ),
  },
];

export const Default: Story = {
  render: () => {
    const [activeTab, setActiveTab] = useState("overview");
    return <Tabs tabs={sampleTabs} activeTab={activeTab} onTabChange={setActiveTab} />;
  },
};

export const ManyTabs: Story = {
  render: () => {
    const [activeTab, setActiveTab] = useState("tab1");
    const tabs: TabItem[] = [
      { id: "tab1", label: "Tab 1", content: <div className="p-4">Content 1</div> },
      { id: "tab2", label: "Tab 2", content: <div className="p-4">Content 2</div> },
      { id: "tab3", label: "Tab 3", content: <div className="p-4">Content 3</div> },
      { id: "tab4", label: "Tab 4", content: <div className="p-4">Content 4</div> },
      { id: "tab5", label: "Tab 5", content: <div className="p-4">Content 5</div> },
    ];
    return <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />;
  },
};
