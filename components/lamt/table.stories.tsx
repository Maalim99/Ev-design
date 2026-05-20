import type { Meta, StoryObj } from "@storybook/nextjs";
import React from "react";
import { Table, TableCellType, PaginationStrategy } from "./table";
import { StatusChip, StatusChipType } from "./status-chip";
import { Button, ButtonKind, ButtonSize } from "./button";
import { Edit, Trash2, MoreVertical } from "lucide-react";

const meta: Meta<typeof Table> = {
  title: "LAMT/Data Display/Table",
  component: Table,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof Table>;

// Mock data
const mockData = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    age: 28,
    status: <StatusChip type={StatusChipType.Success}>Active</StatusChip>,
    salary: 75000,
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    age: 32,
    status: <StatusChip type={StatusChipType.Success}>Active</StatusChip>,
    salary: 85000,
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bob@example.com",
    age: 45,
    status: <StatusChip type={StatusChipType.Warning}>Pending</StatusChip>,
    salary: 95000,
  },
  {
    id: 4,
    name: "Alice Williams",
    email: "alice@example.com",
    age: 29,
    status: <StatusChip type={StatusChipType.Danger}>Inactive</StatusChip>,
    salary: 70000,
  },
  {
    id: 5,
    name: "Charlie Brown",
    email: "charlie@example.com",
    age: 38,
    status: <StatusChip type={StatusChipType.Success}>Active</StatusChip>,
    salary: 90000,
  },
];

const columns = [
  { headerName: "ID", key: "id", type: TableCellType.id },
  { headerName: "Name", key: "name", type: TableCellType.text },
  { headerName: "Email", key: "email", type: TableCellType.text },
  { headerName: "Age", key: "age", type: TableCellType.number },
  { headerName: "Status", key: "status", type: TableCellType.component },
  {
    headerName: "Salary",
    key: "salary",
    type: TableCellType.number,
    viewTotal: true,
  },
];

export const Default: Story = {
  args: {
    hasActions: false,
    data: mockData,
    colDefs: columns,
    currentPageNumber: 1,
    limit: 10,
    totalData: mockData.length,
  },
};

export const WithActions: Story = {
  render: () => {
    const [currentPage, setCurrentPage] = React.useState(1);

    const rowActions = (data: unknown) => (
      <div className="flex gap-2">
        <Button
          kind={ButtonKind.Transparent}
          size={ButtonSize.ExtraSmall}
          onClick={() => console.log("Edit", data)}
        >
          <Edit className="w-4 h-4" />
        </Button>
        <Button
          kind={ButtonKind.Transparent}
          size={ButtonSize.ExtraSmall}
          onClick={() => console.log("Delete", data)}
        >
          <Trash2 className="w-4 h-4 text-red-500" />
        </Button>
      </div>
    );

    return (
      <Table
        hasActions={true}
        rowActions={rowActions}
        data={mockData}
        colDefs={columns}
        currentPageNumber={currentPage}
        limit={10}
        totalData={mockData.length}
        onPageChange={setCurrentPage}
      />
    );
  },
};

export const WithSorting: Story = {
  render: () => {
    const [currentPage, setCurrentPage] = React.useState(1);
    const [sortState, setSortState] = React.useState({
      sortBy: "name",
      sortOrder: "asc" as "asc" | "desc",
    });

    const handleSort = (sortBy: string) => {
      setSortState((prev) => ({
        sortBy,
        sortOrder:
          prev.sortBy === sortBy && prev.sortOrder === "asc" ? "desc" : "asc",
      }));
    };

    const sortedData = [...mockData].sort((a, b) => {
      const aVal = a[sortState.sortBy as keyof typeof a];
      const bVal = b[sortState.sortBy as keyof typeof b];

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortState.sortOrder === "asc" ? aVal - bVal : bVal - aVal;
      }

      const aStr = String(aVal);
      const bStr = String(bVal);
      return sortState.sortOrder === "asc"
        ? aStr.localeCompare(bStr)
        : bStr.localeCompare(aStr);
    });

    return (
      <Table
        hasActions={false}
        data={sortedData}
        colDefs={columns}
        currentPageNumber={currentPage}
        limit={10}
        totalData={mockData.length}
        onPageChange={setCurrentPage}
        sortState={sortState}
        onTogglePagination={handleSort}
      />
    );
  },
};

export const WithCheckboxes: Story = {
  render: () => {
    const [currentPage, setCurrentPage] = React.useState(1);

    return (
      <Table
        hasActions={false}
        data={mockData}
        colDefs={columns}
        currentPageNumber={currentPage}
        limit={10}
        totalData={mockData.length}
        onPageChange={setCurrentPage}
        showCheckbox={true}
        downloadFileName="users"
      />
    );
  },
};

export const WithPagination: Story = {
  render: () => {
    const [currentPage, setCurrentPage] = React.useState(1);
    const [limit, setLimit] = React.useState(5);

    // Create more data for pagination
    const largeData = Array.from({ length: 25 }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      age: 25 + (i % 20),
      status:
        i % 3 === 0 ? (
          <StatusChip type={StatusChipType.Success}>Active</StatusChip>
        ) : i % 3 === 1 ? (
          <StatusChip type={StatusChipType.Warning}>Pending</StatusChip>
        ) : (
          <StatusChip type={StatusChipType.Danger}>Inactive</StatusChip>
        ),
      salary: 60000 + i * 1000,
    }));

    const handleLimitChange = (newLimit: number) => {
      setLimit(newLimit);
      setCurrentPage(1); // Reset to first page when limit changes
    };

    return (
      <Table
        hasActions={false}
        data={largeData}
        colDefs={columns}
        currentPageNumber={currentPage}
        limit={limit}
        totalData={largeData.length}
        onPageChange={setCurrentPage}
        onLimitChange={handleLimitChange}
        paginationStrategy={PaginationStrategy.LOCAL}
      />
    );
  },
};

export const LoadingState: Story = {
  args: {
    hasActions: false,
    data: mockData,
    colDefs: columns,
    currentPageNumber: 1,
    limit: 10,
    totalData: mockData.length,
    isLoading: true,
  },
};

export const DisabledState: Story = {
  args: {
    hasActions: false,
    data: mockData,
    colDefs: columns,
    currentPageNumber: 1,
    limit: 10,
    totalData: mockData.length,
    disabled: true,
  },
};

export const WithoutPagination: Story = {
  args: {
    hasActions: false,
    data: mockData,
    colDefs: columns,
    currentPageNumber: 1,
    limit: 10,
    totalData: mockData.length,
    showPagination: false,
  },
};

export const CompleteExample: Story = {
  render: () => {
    const [currentPage, setCurrentPage] = React.useState(1);
    const [limit, setLimit] = React.useState(5);
    const [sortState, setSortState] = React.useState({
      sortBy: "name",
      sortOrder: "asc" as "asc" | "desc",
    });

    const largeData = Array.from({ length: 15 }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      age: 25 + (i % 20),
      status:
        i % 3 === 0 ? (
          <StatusChip type={StatusChipType.Success}>Active</StatusChip>
        ) : i % 3 === 1 ? (
          <StatusChip type={StatusChipType.Warning}>Pending</StatusChip>
        ) : (
          <StatusChip type={StatusChipType.Danger}>Inactive</StatusChip>
        ),
      salary: 60000 + i * 1000,
    }));

    const handleSort = (sortBy: string) => {
      setSortState((prev) => ({
        sortBy,
        sortOrder:
          prev.sortBy === sortBy && prev.sortOrder === "asc" ? "desc" : "asc",
      }));
    };

    const sortedData = [...largeData].sort((a, b) => {
      const aVal = a[sortState.sortBy as keyof typeof a];
      const bVal = b[sortState.sortBy as keyof typeof b];

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortState.sortOrder === "asc" ? aVal - bVal : bVal - aVal;
      }

      const aStr = String(aVal);
      const bStr = String(bVal);
      return sortState.sortOrder === "asc"
        ? aStr.localeCompare(bStr)
        : bStr.localeCompare(aStr);
    });

    const handleLimitChange = (newLimit: number) => {
      setLimit(newLimit);
      setCurrentPage(1); // Reset to first page when limit changes
    };

    const rowActions = (data: unknown) => (
      <div className="flex gap-1">
        <Button
          kind={ButtonKind.Transparent}
          size={ButtonSize.ExtraSmall}
          onClick={() => console.log("More options", data)}
        >
          <MoreVertical className="w-4 h-4" />
        </Button>
      </div>
    );

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">User Management Table</h3>
        <Table
          hasActions={true}
          rowActions={rowActions}
          data={sortedData}
          colDefs={columns}
          currentPageNumber={currentPage}
          limit={limit}
          totalData={largeData.length}
          onPageChange={setCurrentPage}
          onLimitChange={handleLimitChange}
          sortState={sortState}
          onTogglePagination={handleSort}
          showCheckbox={true}
          downloadFileName="users"
          paginationStrategy={PaginationStrategy.LOCAL}
        />
      </div>
    );
  },
};
