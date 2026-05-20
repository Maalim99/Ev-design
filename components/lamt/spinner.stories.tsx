import type { Meta, StoryObj } from "@storybook/nextjs";
import Spinner from "./spinner";

const meta: Meta<typeof Spinner> = {
  title: "LAMT/Forms/Spinner",
  component: Spinner,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Spinner>;

export const Default: Story = {
  args: {
    id: "spinner-1",
  },
};

export const CustomSize: Story = {
  render: () => (
    <div className="flex gap-4 items-center">
      <Spinner size={24} />
      <Spinner size={36} />
      <Spinner size={48} />
      <Spinner size={64} />
    </div>
  ),
};

export const CustomColor: Story = {
  render: () => (
    <div className="flex gap-4">
      <Spinner baseColor="#F5A623" />
      <Spinner baseColor="#07C1FF" />
      <Spinner baseColor="#36D977" />
      <Spinner baseColor="#FF4507" />
    </div>
  ),
};

export const InButton: Story = {
  render: () => (
    <button className="px-4 py-2 bg-primary text-white rounded flex items-center gap-2">
      <Spinner size={16} baseColor="white" />
      Loading...
    </button>
  ),
};
