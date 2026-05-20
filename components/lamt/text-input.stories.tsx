import type { Meta, StoryObj } from "@storybook/nextjs";
import { useForm } from "react-hook-form";
import TextInput, { HEIGHT_OPTION } from "./text-input";
import Button from "./button";

const meta: Meta<typeof TextInput> = {
  title: "LAMT/Forms/TextInput",
  component: TextInput,
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: ["text", "email", "number", "password", "phone"],
    },
    option: {
      control: "select",
      options: [HEIGHT_OPTION.SMALL, HEIGHT_OPTION.MEDIUM, HEIGHT_OPTION.LARGE],
    },
  },
};

export default meta;
type Story = StoryObj<typeof TextInput>;

export const Default: Story = {
  args: {
    name: "username",
    placeholder: "Enter your username",
  },
};

export const WithError: Story = {
  args: {
    name: "email",
    type: "email",
    placeholder: "email@example.com",
    error: "This field is required",
  },
};

export const Disabled: Story = {
  args: {
    name: "disabled",
    placeholder: "Disabled input",
    disabled: true,
    value: "Cannot edit this",
  },
};

export const Rounded: Story = {
  args: {
    name: "search",
    placeholder: "Search...",
    rounded: true,
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="space-y-4">
      <TextInput
        name="small"
        placeholder="Small input"
        option={HEIGHT_OPTION.SMALL}
      />
      <TextInput
        name="medium"
        placeholder="Medium input"
        option={HEIGHT_OPTION.MEDIUM}
      />
      <TextInput
        name="large"
        placeholder="Large input (default)"
        option={HEIGHT_OPTION.LARGE}
      />
    </div>
  ),
};

export const AllTypes: Story = {
  render: () => (
    <div className="space-y-4">
      <TextInput name="text" type="text" placeholder="Text input" />
      <TextInput name="email" type="email" placeholder="email@example.com" />
      <TextInput name="password" type="password" placeholder="Password" />
      <TextInput name="number" type="number" placeholder="123" />
      <TextInput name="phone" type="phone" placeholder="+1 (555) 123-4567" />
    </div>
  ),
};

export const WithReactHookForm: Story = {
  render: () => {
    const FormExample = () => {
      const { register, handleSubmit, formState: { errors } } = useForm();
      const onSubmit = (data: Record<string, unknown>) => console.log(data);

      return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block mb-2 text-sm">Username *</label>
            <TextInput
              name="username"
              register={register}
              rules={{ required: "Username is required" }}
              error={errors.username?.message as string}
              placeholder="Enter username"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm">Email *</label>
            <TextInput
              name="email"
              type="email"
              register={register}
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address"
                }
              }}
              error={errors.email?.message as string}
              placeholder="email@example.com"
            />
          </div>
          <Button kind="primary" type="submit">
            Submit
          </Button>
        </form>
      );
    };
    return <FormExample />;
  },
};
