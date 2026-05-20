import type { Meta, StoryObj } from "@storybook/nextjs";
import { useState } from "react";
import Drawer from "./drawer";
import Button from "./button";

const meta: Meta<typeof Drawer> = {
  title: "LAMT/Drawer",
  component: Drawer,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Drawer>;

export const Default: Story = {
  render: () => {
    const [opened, setOpened] = useState(false);
    return (
      <>
        <Button onClick={() => setOpened(true)}>Open Drawer</Button>
        <Drawer title="Drawer Title" opened={opened} onClose={() => setOpened(false)}>
          <div className="space-y-4">
            <p>This is the drawer content.</p>
            <p>Drawers slide in from the side.</p>
          </div>
        </Drawer>
      </>
    );
  },
};

export const FromLeft: Story = {
  render: () => {
    const [opened, setOpened] = useState(false);
    return (
      <>
        <Button onClick={() => setOpened(true)}>Open from Left</Button>
        <Drawer
          title="Left Drawer"
          side="left"
          opened={opened}
          onClose={() => setOpened(false)}
        >
          <p>This drawer slides in from the left.</p>
        </Drawer>
      </>
    );
  },
};
