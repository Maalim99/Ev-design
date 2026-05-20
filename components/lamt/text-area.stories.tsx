import type { Meta, StoryObj } from "@storybook/nextjs";
import TextArea, { HEIGHT_OPTION } from "./text-area";

const meta: Meta<typeof TextArea> = {
  title: "LAMT/Forms/TextArea",
  component: TextArea,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof TextArea>;

export const Default: Story = {
  args: {
    name: "description",
    placeholder: "Enter description...",
  },
};

export const WithError: Story = {
  args: {
    name: "bio",
    placeholder: "Tell us about yourself",
    error: "Bio is required",
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="space-y-4">
      <TextArea
        name="small"
        placeholder="Small textarea"
        option={HEIGHT_OPTION.SMALL}
      />
      <TextArea
        name="medium"
        placeholder="Medium textarea"
        option={HEIGHT_OPTION.MEDIUM}
      />
      <TextArea
        name="large"
        placeholder="Large textarea (default)"
        option={HEIGHT_OPTION.LARGE}
      />
    </div>
  ),
};
