import type { Meta, StoryObj } from "@storybook/nextjs";
import React from "react";
import { AsyncDropdown } from "./async-dropdown";

const meta: Meta<typeof AsyncDropdown> = {
  title: "LAMT/Forms/AsyncDropdown",
  component: AsyncDropdown,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof AsyncDropdown>;

// Mock data for demonstrations
const mockUsers = [
  { value: "uuid-1", label: "John Doe", description: "john@example.com" },
  { value: "uuid-2", label: "Jane Smith", description: "jane@example.com" },
  { value: "uuid-3", label: "Bob Johnson", description: "bob@example.com" },
  { value: "uuid-4", label: "Alice Williams", description: "alice@example.com" },
  { value: "uuid-5", label: "Charlie Brown", description: "charlie@example.com" },
];

const mockCountries = [
  { value: "us", label: "United States", description: "North America" },
  { value: "uk", label: "United Kingdom", description: "Europe" },
  { value: "ca", label: "Canada", description: "North America" },
  { value: "au", label: "Australia", description: "Oceania" },
  { value: "de", label: "Germany", description: "Europe" },
  { value: "fr", label: "France", description: "Europe" },
  { value: "jp", label: "Japan", description: "Asia" },
];

export const Default: Story = {
  render: () => {
    const [selectedValue, setSelectedValue] = React.useState("");

    const loadOptions = (inputValue: string): Promise<{ value: string; label: string; description: string; match?: string }[]> => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const filtered = mockUsers.filter((user) =>
            user.label.toLowerCase().includes(inputValue.toLowerCase())
          );
          const withMatch = filtered.map((user) => ({
            ...user,
            match: inputValue,
          }));
          resolve(withMatch);
        }, 500);
      });
    };

    return (
      <div style={{ minHeight: "400px" }}>
        <div className="max-w-md">
          <AsyncDropdown
            loadOptions={loadOptions}
            value={selectedValue}
            placeholder="Search for a user..."
            onClickOption={(value) => {
              console.log("Selected:", value);
              setSelectedValue(String(value));
            }}
            onClickClear={() => {
              console.log("Cleared");
              setSelectedValue("");
            }}
          />
          <p className="mt-4 text-sm text-gray-600">
            Selected value: {selectedValue || "None"}
          </p>
        </div>
      </div>
    );
  },
};

export const WithDefaultValue: Story = {
  render: () => {
    const [selectedValue, setSelectedValue] = React.useState("Jane Smith");

    const loadOptions = (inputValue: string): Promise<{ value: string; label: string; description: string; match?: string }[]> => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const filtered = mockUsers.filter((user) =>
            user.label.toLowerCase().includes(inputValue.toLowerCase())
          );
          const withMatch = filtered.map((user) => ({
            ...user,
            match: inputValue,
          }));
          resolve(withMatch);
        }, 500);
      });
    };

    return (
      <div style={{ minHeight: "400px" }}>
        <div className="max-w-md">
          <AsyncDropdown
            loadOptions={loadOptions}
            value={selectedValue}
            defaultValue="Jane Smith"
            placeholder="Search for a user..."
            onClickOption={(value) => {
              console.log("Selected:", value);
              setSelectedValue(String(value));
            }}
            onClickClear={() => {
              console.log("Cleared");
              setSelectedValue("");
            }}
          />
          <p className="mt-4 text-sm text-gray-600">
            Selected value: {selectedValue || "None"}
          </p>
        </div>
      </div>
    );
  },
};

export const CountrySearch: Story = {
  render: () => {
    const [selectedValue, setSelectedValue] = React.useState("");

    const loadOptions = (inputValue: string): Promise<{ value: string; label: string; description: string; match?: string }[]> => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const filtered = mockCountries.filter((country) =>
            country.label.toLowerCase().includes(inputValue.toLowerCase())
          );
          const withMatch = filtered.map((country) => ({
            ...country,
            match: inputValue,
          }));
          resolve(withMatch);
        }, 300);
      });
    };

    return (
      <div style={{ minHeight: "400px" }}>
        <div className="max-w-md">
          <AsyncDropdown
            loadOptions={loadOptions}
            value={selectedValue}
            placeholder="Search for a country..."
            onClickOption={(value) => {
              console.log("Selected:", value);
              setSelectedValue(String(value));
            }}
            onClickClear={() => {
              console.log("Cleared");
              setSelectedValue("");
            }}
          />
          <p className="mt-4 text-sm text-gray-600">
            Selected value: {selectedValue || "None"}
          </p>
        </div>
      </div>
    );
  },
};

export const UppercaseInput: Story = {
  render: () => {
    const [selectedValue, setSelectedValue] = React.useState("");

    const mockCodes = [
      { value: "NYC", label: "NYC", description: "New York City" },
      { value: "LAX", label: "LAX", description: "Los Angeles" },
      { value: "CHI", label: "CHI", description: "Chicago" },
      { value: "MIA", label: "MIA", description: "Miami" },
    ];

    const loadOptions = (inputValue: string): Promise<{ value: string; label: string; description: string; match?: string }[]> => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const filtered = mockCodes.filter((code) =>
            code.label.includes(inputValue.toUpperCase())
          );
          const withMatch = filtered.map((code) => ({
            ...code,
            match: inputValue,
          }));
          resolve(withMatch);
        }, 300);
      });
    };

    return (
      <div style={{ minHeight: "400px" }}>
        <div className="max-w-md">
          <AsyncDropdown
            loadOptions={loadOptions}
            value={selectedValue}
            placeholder="Enter airport code..."
            upperCaseInput={true}
            onClickOption={(value) => {
              console.log("Selected:", value);
              setSelectedValue(String(value));
            }}
            onClickClear={() => {
              console.log("Cleared");
              setSelectedValue("");
            }}
          />
          <p className="mt-4 text-sm text-gray-600">
            Selected value: {selectedValue || "None"}
          </p>
        </div>
      </div>
    );
  },
};

export const LoadingState: Story = {
  render: () => {
    const [selectedValue, setSelectedValue] = React.useState("");

    const loadOptions = (inputValue: string): Promise<{ value: string; label: string; description: string; match?: string }[]> => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const filtered = mockUsers.filter((user) =>
            user.label.toLowerCase().includes(inputValue.toLowerCase())
          );
          const withMatch = filtered.map((user) => ({
            ...user,
            match: inputValue,
          }));
          resolve(withMatch);
        }, 2000); // Longer delay to show loading state
      });
    };

    return (
      <div style={{ minHeight: "400px" }}>
        <div className="max-w-md">
          <AsyncDropdown
            loadOptions={loadOptions}
            value={selectedValue}
            placeholder="Type to search (slow loading)..."
            onClickOption={(value) => {
              console.log("Selected:", value);
              setSelectedValue(String(value));
            }}
            onClickClear={() => {
              console.log("Cleared");
              setSelectedValue("");
            }}
          />
          <p className="mt-4 text-sm text-gray-600">
            Selected value: {selectedValue || "None"}
          </p>
        </div>
      </div>
    );
  },
};

export const NoResults: Story = {
  render: () => {
    const [selectedValue, setSelectedValue] = React.useState("");

    const loadOptions = (_inputValue: string): Promise<{ value: string; label: string; description: string; match?: string }[]> => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([]); // Always return empty results
        }, 500);
      });
    };

    return (
      <div style={{ minHeight: "400px" }}>
        <div className="max-w-md">
          <AsyncDropdown
            loadOptions={loadOptions}
            value={selectedValue}
            placeholder="Try searching (no results)..."
            onClickOption={(value) => {
              console.log("Selected:", value);
              setSelectedValue(String(value));
            }}
            onClickClear={() => {
              console.log("Cleared");
              setSelectedValue("");
            }}
          />
          <p className="mt-4 text-sm text-gray-600">
            Selected value: {selectedValue || "None"}
          </p>
        </div>
      </div>
    );
  },
};
