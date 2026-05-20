import type { Meta, StoryObj } from "@storybook/nextjs";
import { LabelForForm } from "./label-for-form";

const meta: Meta<typeof LabelForForm> = {
  title: "LAMT/Forms/LabelForForm",
  component: LabelForForm,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof LabelForForm>;

export const Default: Story = {
  args: {
    label: "Email Address",
  },
};

export const WithTooltip: Story = {
  args: {
    label: "Password",
    tooltip: "Password must be at least 8 characters long and contain at least one number and one special character.",
  },
};

export const LongLabel: Story = {
  args: {
    label: "Enterprise Account Configuration Settings",
    tooltip: "This setting controls the default configuration for all enterprise accounts in your organization.",
  },
};

export const TooltipOnly: Story = {
  args: {
    label: "API Key",
    tooltip: "Your API key is used to authenticate requests to our service. Keep it secure and do not share it publicly.",
  },
};

export const MultipleLabels: Story = {
  render: () => (
    <div className="space-y-4">
      <LabelForForm label="First Name" />
      <LabelForForm label="Last Name" />
      <LabelForForm
        label="Phone Number"
        tooltip="Enter your phone number in international format (e.g., +1234567890)"
      />
      <LabelForForm
        label="Date of Birth"
        tooltip="You must be at least 18 years old to register"
      />
    </div>
  ),
};

export const InFormContext: Story = {
  render: () => (
    <div className="max-w-md space-y-4">
      <div className="space-y-2">
        <LabelForForm
          label="Username"
          tooltip="Choose a unique username between 3-20 characters"
        />
        <input
          type="text"
          className="w-full px-2.5 py-2 border border-[#C9D0D9] rounded-[7px] text-sm"
          placeholder="Enter username"
        />
      </div>

      <div className="space-y-2">
        <LabelForForm
          label="Email"
          tooltip="We'll send verification to this email address"
        />
        <input
          type="email"
          className="w-full px-2.5 py-2 border border-[#C9D0D9] rounded-[7px] text-sm"
          placeholder="Enter email"
        />
      </div>

      <div className="space-y-2">
        <LabelForForm label="Bio" />
        <textarea
          className="w-full px-2.5 py-2 border border-[#C9D0D9] rounded-[7px] text-sm"
          placeholder="Tell us about yourself"
          rows={3}
        />
      </div>
    </div>
  ),
};
