import type { Meta, StoryObj } from "@storybook/nextjs";
import { useState } from "react";
import Modal from "./modal";
import Button from "./button";
import { User } from "lucide-react";

const meta: Meta<typeof Modal> = {
  title: "LAMT/Modal",
  component: Modal,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Modal>;

export const Default: Story = {
  render: () => {
    const [opened, setOpened] = useState(false);
    return (
      <>
        <Button onClick={() => setOpened(true)}>Open Modal</Button>
        <Modal title="Modal Title" opened={opened} onClose={() => setOpened(false)}>
          <p>This is the modal content. You can put any React components here.</p>
        </Modal>
      </>
    );
  },
};

export const WithIcon: Story = {
  render: () => {
    const [opened, setOpened] = useState(false);
    return (
      <>
        <Button onClick={() => setOpened(true)}>Open Modal with Icon</Button>
        <Modal
          title="User Profile"
          icon={<User size={24} />}
          opened={opened}
          onClose={() => setOpened(false)}
        >
          <p>Modal with an icon in the header.</p>
        </Modal>
      </>
    );
  },
};

export const LargeModal: Story = {
  render: () => {
    const [opened, setOpened] = useState(false);
    return (
      <>
        <Button onClick={() => setOpened(true)}>Open Large Modal</Button>
        <Modal
          title="Large Modal"
          maxWidth={900}
          opened={opened}
          onClose={() => setOpened(false)}
        >
          <div className="space-y-4">
            <p>This modal has a custom max width of 900px.</p>
            <p>It can contain more content and be wider than the default.</p>
          </div>
        </Modal>
      </>
    );
  },
};
