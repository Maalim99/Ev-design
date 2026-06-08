import type { Meta, StoryObj } from "@storybook/nextjs";
import React, { useState } from "react";
import { EvoFiltersDrawer, type FilterSection } from "./evo-filters-drawer";
import { Button } from "./button";

const meta: Meta<typeof EvoFiltersDrawer> = {
  title: "LAMT/Filters/EvoFiltersDrawer",
  component: EvoFiltersDrawer,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof EvoFiltersDrawer>;

// Mock filter sections data
const mockFilterSections: FilterSection[] = [
  {
    id: "status",
    label: "Order Status",
    options: [
      { id: "pending", name: "Pending" },
      { id: "processing", name: "Processing" },
      { id: "shipped", name: "Shipped" },
      { id: "delivered", name: "Delivered" },
      { id: "cancelled", name: "Cancelled" },
      { id: "returned", name: "Returned" },
    ],
  },
  {
    id: "category",
    label: "Product Category",
    options: [
      { id: "electronics", name: "Electronics" },
      { id: "clothing", name: "Clothing & Accessories" },
      { id: "books", name: "Books & Media" },
      { id: "home", name: "Home & Garden" },
      { id: "sports", name: "Sports & Outdoors" },
      { id: "beauty", name: "Beauty & Health" },
      { id: "automotive", name: "Automotive" },
      { id: "toys", name: "Toys & Games" },
    ],
  },
  {
    id: "price",
    label: "Price Range",
    options: [
      { id: "under25", name: "Under $25" },
      { id: "25to50", name: "$25 - $50" },
      { id: "50to100", name: "$50 - $100" },
      { id: "100to200", name: "$100 - $200" },
      { id: "200to500", name: "$200 - $500" },
      { id: "over500", name: "Over $500" },
    ],
  },
  {
    id: "shipping",
    label: "Shipping Options",
    options: [
      { id: "free", name: "Free Shipping" },
      { id: "express", name: "Express Delivery" },
      { id: "overnight", name: "Overnight" },
      { id: "pickup", name: "Store Pickup" },
    ],
  },
  {
    id: "brand",
    label: "Brand",
    options: [
      { id: "apple", name: "Apple" },
      { id: "samsung", name: "Samsung" },
      { id: "nike", name: "Nike" },
      { id: "adidas", name: "Adidas" },
      { id: "sony", name: "Sony" },
      { id: "microsoft", name: "Microsoft" },
      { id: "amazon", name: "Amazon" },
    ],
  },
];

export const Default: Story = {
  render: () => {
    const [opened, setOpened] = useState(false);
    const [filterValues, setFilterValues] = useState<Record<string, string[]>>({
      status: [],
      category: [],
      price: [],
      shipping: [],
      brand: [],
    });

    const handleChange = (sectionId: string, selected: string[]) => {
      setFilterValues(prev => ({
        ...prev,
        [sectionId]: selected,
      }));
      console.log(`Filter ${sectionId} changed:`, selected);
    };

    const handleReset = () => {
      setFilterValues({
        status: [],
        category: [],
        price: [],
        shipping: [],
        brand: [],
      });
      console.log("All filters reset");
    };

    const totalActive = Object.values(filterValues).reduce(
      (acc, arr) => acc + arr.length,
      0
    );

    return (
      <div className="p-4">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Current Filters</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>Active filters: {totalActive}</p>
              {Object.entries(filterValues)
                .filter(([, values]) => values.length > 0)
                .map(([section, values]) => (
                  <p key={section}>
                    <span className="font-medium">{section}:</span> {values.join(", ")}
                  </p>
                ))}
            </div>
          </div>
          <Button onClick={() => setOpened(true)}>Open Filters Drawer</Button>
        </div>
        <EvoFiltersDrawer
          opened={opened}
          onClose={() => setOpened(false)}
          sections={mockFilterSections}
          values={filterValues}
          onChange={handleChange}
          onReset={handleReset}
        />
      </div>
    );
  },
};

export const WithSelectedFilters: Story = {
  render: () => {
    const [opened, setOpened] = useState(false);
    const [filterValues, setFilterValues] = useState<Record<string, string[]>>({
      status: ["pending", "processing"],
      category: ["electronics", "clothing"],
      price: ["50to100", "100to200"],
      shipping: ["free"],
      brand: ["apple", "nike"],
    });

    const handleChange = (sectionId: string, selected: string[]) => {
      setFilterValues(prev => ({
        ...prev,
        [sectionId]: selected,
      }));
      console.log(`Filter ${sectionId} changed:`, selected);
    };

    const handleReset = () => {
      setFilterValues({
        status: [],
        category: [],
        price: [],
        shipping: [],
        brand: [],
      });
      console.log("All filters reset");
    };

    const totalActive = Object.values(filterValues).reduce(
      (acc, arr) => acc + arr.length,
      0
    );

    return (
      <div className="p-4">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Pre-selected Filters</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>Active filters: {totalActive}</p>
              {Object.entries(filterValues)
                .filter(([, values]) => values.length > 0)
                .map(([section, values]) => (
                  <p key={section}>
                    <span className="font-medium">{section}:</span> {values.join(", ")}
                  </p>
                ))}
            </div>
          </div>
          <Button onClick={() => setOpened(true)}>Open Filters Drawer (Pre-selected)</Button>
        </div>
        <EvoFiltersDrawer
          opened={opened}
          onClose={() => setOpened(false)}
          sections={mockFilterSections}
          values={filterValues}
          onChange={handleChange}
          onReset={handleReset}
        />
      </div>
    );
  },
};

export const SingleSection: Story = {
  render: () => {
    const [opened, setOpened] = useState(false);
    const singleSection = [mockFilterSections[0]]; // Just status section
    const [filterValues, setFilterValues] = useState<Record<string, string[]>>({
      status: [],
    });

    const handleChange = (sectionId: string, selected: string[]) => {
      setFilterValues(prev => ({
        ...prev,
        [sectionId]: selected,
      }));
      console.log(`Filter ${sectionId} changed:`, selected);
    };

    const handleReset = () => {
      setFilterValues({
        status: [],
      });
      console.log("All filters reset");
    };

    const totalActive = Object.values(filterValues).reduce(
      (acc, arr) => acc + arr.length,
      0
    );

    return (
      <div className="p-4">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Single Filter Section</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>Active filters: {totalActive}</p>
              {filterValues.status.length > 0 && (
                <p>
                  <span className="font-medium">status:</span> {filterValues.status.join(", ")}
                </p>
              )}
            </div>
          </div>
          <Button onClick={() => setOpened(true)}>Open Single Section Filters</Button>
        </div>
        <EvoFiltersDrawer
          opened={opened}
          onClose={() => setOpened(false)}
          sections={singleSection}
          values={filterValues}
          onChange={handleChange}
          onReset={handleReset}
        />
      </div>
    );
  },
};

export const ManyOptionsSection: Story = {
  render: () => {
    const [opened, setOpened] = useState(false);
    const manySections: FilterSection[] = [
      {
        id: "countries",
        label: "Countries",
        options: [
          { id: "us", name: "United States" },
          { id: "ca", name: "Canada" },
          { id: "uk", name: "United Kingdom" },
          { id: "de", name: "Germany" },
          { id: "fr", name: "France" },
          { id: "es", name: "Spain" },
          { id: "it", name: "Italy" },
          { id: "jp", name: "Japan" },
          { id: "au", name: "Australia" },
          { id: "br", name: "Brazil" },
          { id: "in", name: "India" },
          { id: "cn", name: "China" },
          { id: "mx", name: "Mexico" },
          { id: "nl", name: "Netherlands" },
          { id: "se", name: "Sweden" },
          { id: "ch", name: "Switzerland" },
          { id: "no", name: "Norway" },
          { id: "dk", name: "Denmark" },
          { id: "fi", name: "Finland" },
          { id: "be", name: "Belgium" },
        ],
      },
    ];

    const [filterValues, setFilterValues] = useState<Record<string, string[]>>({
      countries: [],
    });

    const handleChange = (sectionId: string, selected: string[]) => {
      setFilterValues(prev => ({
        ...prev,
        [sectionId]: selected,
      }));
      console.log(`Filter ${sectionId} changed:`, selected);
    };

    const handleReset = () => {
      setFilterValues({
        countries: [],
      });
      console.log("All filters reset");
    };

    const totalActive = Object.values(filterValues).reduce(
      (acc, arr) => acc + arr.length,
      0
    );

    return (
      <div className="p-4">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Many Options Section</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>Active filters: {totalActive}</p>
              <p>Available countries: {manySections[0].options.length}</p>
              {filterValues.countries.length > 0 && (
                <p>
                  <span className="font-medium">Selected:</span> {filterValues.countries.join(", ")}
                </p>
              )}
            </div>
          </div>
          <Button onClick={() => setOpened(true)}>Open Many Options Filters</Button>
        </div>
        <EvoFiltersDrawer
          opened={opened}
          onClose={() => setOpened(false)}
          sections={manySections}
          values={filterValues}
          onChange={handleChange}
          onReset={handleReset}
        />
      </div>
    );
  },
};