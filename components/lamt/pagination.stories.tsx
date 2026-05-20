import type { Meta, StoryObj } from "@storybook/nextjs";
import { useState } from "react";
import Pagination from "./pagination";

const meta: Meta<typeof Pagination> = {
  title: "LAMT/Pagination",
  component: Pagination,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Pagination>;

export const Default: Story = {
  args: {
    currentPageNumber: 1,
    totalData: 100,
    limit: 10,
    onPageChange: (page) => console.log("Page changed to:", page),
    onChangeLimit: (limit) => console.log("Limit changed to:", limit),
  },
};

export const Interactive: Story = {
  render: () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const totalData = 247;

    return (
      <div className="space-y-4">
        <div className="p-4 bg-gray-100 rounded">
          <p className="font-semibold mb-2">Current State:</p>
          <p>Page: {currentPage}</p>
          <p>Items per page: {limit}</p>
          <p>Total items: {totalData}</p>
          <p>
            Showing: {(currentPage - 1) * limit + 1} -{" "}
            {Math.min(currentPage * limit, totalData)}
          </p>
        </div>
        <Pagination
          currentPageNumber={currentPage}
          totalData={totalData}
          limit={limit}
          onPageChange={(page) => {
            console.log("Page changed to:", page);
            setCurrentPage(page);
          }}
          onChangeLimit={(newLimit) => {
            console.log("Limit changed to:", newLimit);
            setLimit(newLimit);
            setCurrentPage(1);
          }}
        />
      </div>
    );
  },
};

export const LargeDataset: Story = {
  args: {
    currentPageNumber: 5,
    totalData: 1000,
    limit: 20,
    onPageChange: (page) => console.log("Page changed to:", page),
    onChangeLimit: (limit) => console.log("Limit changed to:", limit),
  },
};

export const LastPage: Story = {
  args: {
    currentPageNumber: 10,
    totalData: 100,
    limit: 10,
    onPageChange: (page) => console.log("Page changed to:", page),
    onChangeLimit: (limit) => console.log("Limit changed to:", limit),
  },
};

export const SmallDataset: Story = {
  args: {
    currentPageNumber: 1,
    totalData: 25,
    limit: 10,
    onPageChange: (page) => console.log("Page changed to:", page),
    onChangeLimit: (limit) => console.log("Limit changed to:", limit),
  },
};

export const SinglePage: Story = {
  args: {
    currentPageNumber: 1,
    totalData: 8,
    limit: 10,
    onPageChange: (page) => console.log("Page changed to:", page),
    onChangeLimit: (limit) => console.log("Limit changed to:", limit),
  },
};
