import type { Meta, StoryObj } from "@storybook/nextjs";
import SimpleProgressCircle, { SimpleProgressCircleType } from "./simple-progress-circle";

const meta: Meta<typeof SimpleProgressCircle> = {
  title: "LAMT/SimpleProgressCircle",
  component: SimpleProgressCircle,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SimpleProgressCircle>;

export const Default: Story = {
  args: {
    progress: 65,
    maxSize: 100,
  },
};

export const NormalType: Story = {
  args: {
    type: SimpleProgressCircleType.Normal,
    progress: 45,
    maxSize: 120,
  },
};

export const SuccessType: Story = {
  args: {
    type: SimpleProgressCircleType.Success,
    progress: 85,
    maxSize: 120,
  },
};

export const DangerType: Story = {
  args: {
    type: SimpleProgressCircleType.Danger,
    progress: 25,
    maxSize: 120,
  },
};

export const SmallSize: Story = {
  args: {
    progress: 50,
    maxSize: 60,
  },
};

export const LargeSize: Story = {
  args: {
    progress: 75,
    maxSize: 200,
  },
};

export const ZeroProgress: Story = {
  args: {
    progress: 0,
    maxSize: 100,
  },
};

export const FullProgress: Story = {
  args: {
    type: SimpleProgressCircleType.Success,
    progress: 100,
    maxSize: 100,
  },
};

export const CustomStrokeWidth: Story = {
  args: {
    progress: 60,
    maxSize: 120,
    strokeWidth: 12,
  },
};

export const MultipleCircles: Story = {
  render: () => (
    <div className="flex gap-8 items-center">
      <SimpleProgressCircle
        type={SimpleProgressCircleType.Danger}
        progress={20}
        maxSize={80}
      />
      <SimpleProgressCircle
        type={SimpleProgressCircleType.Normal}
        progress={50}
        maxSize={80}
      />
      <SimpleProgressCircle
        type={SimpleProgressCircleType.Success}
        progress={90}
        maxSize={80}
      />
    </div>
  ),
};
