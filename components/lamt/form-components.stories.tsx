import type { Meta, StoryObj } from "@storybook/nextjs";
import React from "react";
import { useForm } from "react-hook-form";
import Form from "./form";
import TextInput from "./text-input";
import TextArea from "./text-area";
import InputLabel from "./input-label";
import InputError from "./input-error";
import SwitchInput from "./switch-input";
import RadioGroup from "./radio-group";
import RadioButton from "./radio-button";
import CheckboxInput from "./checkbox-input";
import Button from "./button";

const meta: Meta = {
  title: "LAMT/Forms/Complete Form Example",
  tags: ["autodocs"],
};

export default meta;

export const CompleteFormExample: StoryObj = {
  render: () => {
    const FormDemo = () => {
      const methods = useForm({
        defaultValues: {
          username: "",
          email: "",
          bio: "",
          notifications: false,
          role: "",
          terms: false,
        },
      });

      const { register, formState: { errors }, setValue, watch } = methods;
      const notifications = watch("notifications");
      const terms = watch("terms");

      const onSubmit = (data: Record<string, unknown>) => {
        console.log("Form submitted:", data);
        alert(JSON.stringify(data, null, 2));
      };

      return (
        <Form methods={methods} onSubmit={onSubmit} className="max-w-md">
          <div>
            <InputLabel htmlFor="username">Username *</InputLabel>
            <TextInput
              name="username"
              register={register}
              rules={{ required: "Username is required" }}
              error={errors.username?.message as string}
              placeholder="Enter username"
            />
            {errors.username && (
              <InputError>{errors.username.message as string}</InputError>
            )}
          </div>

          <div>
            <InputLabel htmlFor="email">Email Address *</InputLabel>
            <TextInput
              name="email"
              type="email"
              register={register}
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              }}
              error={errors.email?.message as string}
              placeholder="email@example.com"
            />
            {errors.email && (
              <InputError>{errors.email.message as string}</InputError>
            )}
          </div>

          <div>
            <InputLabel htmlFor="bio">Bio</InputLabel>
            <TextArea
              name="bio"
              register={register}
              placeholder="Tell us about yourself..."
            />
          </div>

          <div>
            <InputLabel htmlFor="role">Select Role *</InputLabel>
            <RadioGroup
              name="role"
              register={register}
              rules={{ required: "Please select a role" }}
            >
              <RadioButton value="admin" label="Admin" />
              <RadioButton value="user" label="User" />
              <RadioButton value="guest" label="Guest" />
            </RadioGroup>
            {errors.role && (
              <InputError>{errors.role.message as string}</InputError>
            )}
          </div>

          <div className="flex items-center gap-3">
            <SwitchInput
              name="notifications"
              checked={notifications}
              onChange={(checked) => setValue("notifications", checked)}
            />
            <InputLabel htmlFor="notifications" className="mb-0">
              Enable email notifications
            </InputLabel>
          </div>

          <div>
            <CheckboxInput
              name="terms"
              checked={terms}
              onCheckedChange={(checked) => setValue("terms", !!checked)}
              label="I agree to the terms and conditions *"
            />
            {errors.terms && (
              <InputError>{errors.terms.message as string}</InputError>
            )}
          </div>

          <Button kind="primary" type="submit">
            Submit Form
          </Button>
        </Form>
      );
    };

    return <FormDemo />;
  },
  parameters: {
    docs: {
      description: {
        story:
          "Complete form example showing all form components working together with React Hook Form",
      },
    },
  },
};

export const InputLabelExamples: StoryObj = {
  render: () => (
    <div className="space-y-4">
      <div>
        <InputLabel htmlFor="input1">Normal Label</InputLabel>
        <TextInput name="input1" placeholder="Input field" />
      </div>
      <div>
        <InputLabel htmlFor="input2" disabled>
          Disabled Label
        </InputLabel>
        <TextInput name="input2" placeholder="Disabled input" disabled />
      </div>
    </div>
  ),
};

export const InputErrorExamples: StoryObj = {
  render: () => (
    <div className="space-y-4">
      <div>
        <InputLabel htmlFor="email">Email</InputLabel>
        <TextInput
          name="email"
          type="email"
          error="Email is required"
        />
        <InputError>Email is required</InputError>
      </div>
      <div>
        <InputLabel htmlFor="password">Password</InputLabel>
        <TextInput
          name="password"
          type="password"
          error="Password must be at least 8 characters"
        />
        <InputError>Password must be at least 8 characters</InputError>
      </div>
    </div>
  ),
};

export const SwitchExamples: StoryObj = {
  render: () => {
    const SwitchDemo = () => {
      const [enabled, setEnabled] = React.useState(false);
      const [notifications, setNotifications] = React.useState(true);

      return (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <SwitchInput
              name="switch1"
              checked={enabled}
              onChange={setEnabled}
            />
            <span className="text-sm">Feature {enabled ? "enabled" : "disabled"}</span>
          </div>
          <div className="flex items-center gap-3">
            <SwitchInput
              name="switch2"
              checked={notifications}
              onChange={setNotifications}
            />
            <span className="text-sm">Notifications {notifications ? "on" : "off"}</span>
          </div>
          <div className="flex items-center gap-3">
            <SwitchInput name="switch3" disabled />
            <span className="text-sm">Disabled switch</span>
          </div>
        </div>
      );
    };
    return <SwitchDemo />;
  },
};

export const RadioGroupExamples: StoryObj = {
  render: () => {
    const RadioDemo = () => {
      const [value, setValue] = React.useState("option1");

      return (
        <div className="space-y-4">
          <div>
            <InputLabel>Choose an option:</InputLabel>
            <RadioGroup name="options" value={value} onValueChange={setValue}>
              <RadioButton value="option1" label="Option 1" />
              <RadioButton value="option2" label="Option 2" />
              <RadioButton value="option3" label="Option 3" />
            </RadioGroup>
            <p className="mt-2 text-sm text-gray-600">Selected: {value}</p>
          </div>
        </div>
      );
    };
    return <RadioDemo />;
  },
};

export const CheckboxExamples: StoryObj = {
  render: () => {
    const CheckboxDemo = () => {
      const [checked1, setChecked1] = React.useState(false);
      const [checked2, setChecked2] = React.useState(true);

      return (
        <div className="space-y-3">
          <CheckboxInput
            name="checkbox1"
            checked={checked1}
            onCheckedChange={(c) => setChecked1(!!c)}
            label="Accept terms and conditions"
          />
          <CheckboxInput
            name="checkbox2"
            checked={checked2}
            onCheckedChange={(c) => setChecked2(!!c)}
            label="Subscribe to newsletter"
          />
          <CheckboxInput
            name="checkbox3"
            disabled
            label="Disabled checkbox"
          />
        </div>
      );
    };
    return <CheckboxDemo />;
  },
};
