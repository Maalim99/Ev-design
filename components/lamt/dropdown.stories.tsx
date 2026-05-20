import type { Meta, StoryObj } from "@storybook/nextjs";
import Dropdown, { DropdownOption } from "./dropdown";

const meta: Meta<typeof Dropdown> = {
  title: "LAMT/Dropdown",
  component: Dropdown,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Dropdown>;

const sampleOptions: DropdownOption[] = [
  { id: "1", name: "Option 1" },
  { id: "2", name: "Option 2" },
  { id: "3", name: "Option 3" },
  { id: "4", name: "Option 4" },
  { id: "5", name: "Option 5" },
];

const optionsWithDisabled: DropdownOption[] = [
  { id: "1", name: "Active Option 1" },
  { id: "2", name: "Disabled Option", disabled: true },
  { id: "3", name: "Active Option 2" },
  { id: "4", name: "Another Disabled", disabled: true },
  { id: "5", name: "Active Option 3" },
];

export const Default: Story = {
  args: {
    label: "Select an option",
    options: sampleOptions,
    onClickOption: (option) => {
      console.log("Selected:", option);
    },
  },
};

export const WithDisabledOptions: Story = {
  args: {
    label: "Choose one",
    options: optionsWithDisabled,
    onClickOption: (option) => {
      console.log("Selected:", option);
    },
  },
};

export const DisabledDropdown: Story = {
  args: {
    label: "Disabled dropdown",
    options: sampleOptions,
    disabled: true,
    onClickOption: (option) => {
      console.log("Selected:", option);
    },
  },
};

export const LongList: Story = {
  args: {
    label: "Select country",
    options: [
      { id: "1", name: "United States" },
      { id: "2", name: "United Kingdom" },
      { id: "3", name: "Canada" },
      { id: "4", name: "Australia" },
      { id: "5", name: "Germany" },
      { id: "6", name: "France" },
      { id: "7", name: "Spain" },
      { id: "8", name: "Italy" },
      { id: "9", name: "Japan" },
      { id: "10", name: "China" },
      { id: "11", name: "Brazil" },
      { id: "12", name: "Mexico" },
      { id: "13", name: "India" },
      { id: "14", name: "South Korea" },
      { id: "15", name: "Netherlands" },
    ],
    onClickOption: (option) => {
      console.log("Selected:", option);
    },
  },
};
