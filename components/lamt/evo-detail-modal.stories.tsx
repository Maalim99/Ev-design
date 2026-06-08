import type { Meta, StoryObj } from "@storybook/nextjs";
import { useState } from "react";
import { EvoDetailModal, DeleteConfirmModal } from "./evo-detail-modal";
import { Button, ButtonKind } from "./button";
import type { EvoAccount } from "@/data/dummy";

// Mock EVO data for stories
const mockEvoActive: EvoAccount = {
  id: "1",
  evoCode: "EVO-1001",
  fullName: "John Doe",
  phoneNumbers: ["+243 123 456 789", "+243 987 654 321"],
  gender: "M",
  dateOfBirth: "1990-05-15",
  maritalStatus: "MARRIED",
  currentWork: "MOTO_TAXI",
  housingStatus: "OWNER",
  hasSmartphone: true,
  worksSaturday: true,
  worksSunday: false,
  address: {
    city: "Kinshasa",
    commune: "Gombe",
    quartier: "Socimat",
    avenue: "Avenue de la Paix",
    plotNumber: "123A"
  },
  emcCode: "EMC-KIN-001",
  emcName: "Kinshasa Central",
  assignedAarove: "AAROVE Kinshasa",
  evProductCode: "EV-MOTO-001",
  rentalPlan: "SF50.RF15.RP12",
  registeredAt: "2024-01-15",
  lastPaymentDate: "2024-06-01",
  status: "ACTIVE",
  bgcDecision: "RECOMMENDED",
  ospStatus: "PASSED",
  ospWrittenScore: 92,
  ospOnroadScore: 88,
  balance: 1250.50
};

const mockEvoPending: EvoAccount = {
  ...mockEvoActive,
  id: "2",
  evoCode: "EVO-1002",
  fullName: "Jane Smith",
  gender: "F",
  maritalStatus: "SINGLE",
  status: "PENDING_BGC",
  bgcDecision: "NOT_ASSESSED",
  ospStatus: "NOT_STARTED",
  ospWrittenScore: null,
  ospOnroadScore: null,
  balance: 0,
  lastPaymentDate: null,
  phoneNumbers: ["+243 555 123 456"]
};

const mockEvoDisengaged: EvoAccount = {
  ...mockEvoActive,
  id: "3",
  evoCode: "EVO-1003",
  fullName: "Bob Johnson",
  status: "DISENGAGED",
  bgcDecision: "REJECTED",
  ospStatus: "FAILED",
  ospWrittenScore: 45,
  ospOnroadScore: 32,
  balance: -150.00,
  maritalStatus: "DIVORCED",
  hasSmartphone: false,
  currentWork: "UNEMPLOYED"
};

const meta: Meta<typeof EvoDetailModal> = {
  title: "LAMT/EvoDetailModal",
  component: EvoDetailModal,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
A comprehensive modal component for displaying EVO (Electric Vehicle Operator) account details.
Refactored from EV Core with Tailwind CSS integration and enhanced modularity.

## Features
- Responsive design with adaptive layouts
- Multiple sections with organized information display
- Status chips integration for visual status indication
- Loading states and error handling
- Action buttons for edit/delete operations
- Accessible modal structure with ARIA support
- Delete confirmation modal with safety measures

## Sections
- **Summary**: High-level overview with name, status, and balance
- **Personal Details**: Demographics and personal information
- **Address**: Location information with structured fields
- **Assignment**: EMC assignment and rental plan details
- **BGC & OSP Training**: Background check and training status

## EVO Status Types
The modal displays various EVO statuses with appropriate visual indicators:
- ACTIVE, PENDING_BGC, PENDING_OSP, PENDING_RP, PARTIAL_RP, PENDING_HO, INACTIVE, DISENGAGED
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    evo: {
      control: false,
      description: "EVO account data object",
    },
    loading: {
      control: "boolean",
      description: "Loading state of the modal",
    },
    onClose: {
      control: false,
      description: "Function called when modal is closed",
    },
    onEdit: {
      control: false,
      description: "Optional function for edit action",
    },
    onDelete: {
      control: false,
      description: "Optional function for delete action",
    },
  },
};

export default meta;
type Story = StoryObj<typeof EvoDetailModal>;

// Helper component to manage modal state
function ModalWrapper({
  evo,
  loading = false,
  showActions = true
}: {
  evo: EvoAccount;
  loading?: boolean;
  showActions?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  return (
    <>
      <Button kind={ButtonKind.Primary} onClick={() => setIsOpen(true)}>
        Open EVO Details
      </Button>

      <EvoDetailModal
        evo={isOpen ? evo : null}
        onClose={() => setIsOpen(false)}
        loading={loading}
        onEdit={showActions ? () => alert("Edit clicked") : undefined}
        onDelete={showActions ? () => setShowDeleteConfirm(true) : undefined}
      />

      {showDeleteConfirm && (
        <DeleteConfirmModal
          evo={evo}
          onConfirm={() => {
            setShowDeleteConfirm(false);
            setIsOpen(false);
            alert("Account deleted");
          }}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
    </>
  );
}

// Default story - Active EVO
export const Default: Story = {
  render: () => <ModalWrapper evo={mockEvoActive} />,
};

// Active EVO with full data
export const ActiveEvo: Story = {
  render: () => <ModalWrapper evo={mockEvoActive} />,
};

// Pending BGC EVO
export const PendingBgc: Story = {
  render: () => <ModalWrapper evo={mockEvoPending} />,
};

// Disengaged EVO
export const DisengagedEvo: Story = {
  render: () => <ModalWrapper evo={mockEvoDisengaged} />,
};

// Loading state
export const Loading: Story = {
  render: () => <ModalWrapper evo={mockEvoActive} loading={true} />,
};

// Without action buttons
export const ReadOnly: Story = {
  render: () => <ModalWrapper evo={mockEvoActive} showActions={false} />,
};

// Different rental plans
export const NoRentalPlan: Story = {
  render: () => (
    <ModalWrapper
      evo={{
        ...mockEvoActive,
        rentalPlan: null,
        evProductCode: "EV-PENDING"
      }}
    />
  ),
};

export const DifferentRentalPlan: Story = {
  render: () => (
    <ModalWrapper
      evo={{
        ...mockEvoActive,
        rentalPlan: "SF100.RF25.RP24",
        evProductCode: "EV-PREMIUM-001"
      }}
    />
  ),
};

// Various status combinations
export const StatusVariations: Story = {
  render: () => {
    const [currentEvo, setCurrentEvo] = useState(0);

    const evos = [
      { ...mockEvoActive, status: "ACTIVE" as const, evoCode: "EVO-ACTIVE" },
      { ...mockEvoActive, status: "PENDING_BGC" as const, evoCode: "EVO-PBGC" },
      { ...mockEvoActive, status: "PENDING_OSP" as const, evoCode: "EVO-POSP" },
      { ...mockEvoActive, status: "PENDING_RP" as const, evoCode: "EVO-PRP" },
      { ...mockEvoActive, status: "PARTIAL_RP" as const, evoCode: "EVO-PARTRP" },
      { ...mockEvoActive, status: "PENDING_HO" as const, evoCode: "EVO-PHO" },
      { ...mockEvoActive, status: "INACTIVE" as const, evoCode: "EVO-INACTIVE" },
      { ...mockEvoActive, status: "DISENGAGED" as const, evoCode: "EVO-DISENG" },
    ];

    return (
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {evos.map((evo, index) => (
            <Button
              key={evo.evoCode}
              kind={currentEvo === index ? ButtonKind.Primary : ButtonKind.Ghost}
              onClick={() => setCurrentEvo(index)}
              size="sm"
            >
              {evo.status.replace(/_/g, ' ')}
            </Button>
          ))}
        </div>
        <ModalWrapper evo={evos[currentEvo]} />
      </div>
    );
  },
};

// Delete confirmation modal
export const DeleteConfirmation: Story = {
  render: () => {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleDelete = () => {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setShowDeleteConfirm(false);
        alert("Account deleted successfully");
      }, 2000);
    };

    return (
      <>
        <Button
          kind={ButtonKind.Primary}
          onClick={() => setShowDeleteConfirm(true)}
          className="bg-lamt-danger hover:bg-lamt-danger/90"
        >
          Show Delete Confirmation
        </Button>

        {showDeleteConfirm && (
          <DeleteConfirmModal
            evo={mockEvoActive}
            onConfirm={handleDelete}
            onCancel={() => setShowDeleteConfirm(false)}
            isLoading={isLoading}
          />
        )}
      </>
    );
  },
};

// Edge cases
export const EdgeCases: Story = {
  render: () => {
    const [caseIndex, setCaseIndex] = useState(0);

    const edgeCases = [
      {
        name: "Minimal Data",
        evo: {
          ...mockEvoActive,
          phoneNumbers: ["+243 123 456 789"],
          dateOfBirth: null,
          lastPaymentDate: null,
          ospWrittenScore: null,
          ospOnroadScore: null,
          rentalPlan: null,
          balance: 0
        }
      },
      {
        name: "Very Long Name",
        evo: {
          ...mockEvoActive,
          fullName: "Jean-Baptiste Claude Emmanuel Mbuyi Kabongo wa Diwengo",
          evoCode: "EVO-VERYLONGCODE-001"
        }
      },
      {
        name: "Multiple Phone Numbers",
        evo: {
          ...mockEvoActive,
          phoneNumbers: [
            "+243 123 456 789",
            "+243 987 654 321",
            "+243 555 111 222",
            "+243 777 888 999"
          ]
        }
      },
      {
        name: "Negative Balance",
        evo: {
          ...mockEvoActive,
          balance: -2500.75,
          status: "INACTIVE" as const
        }
      }
    ];

    return (
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {edgeCases.map((testCase, index) => (
            <Button
              key={testCase.name}
              kind={caseIndex === index ? ButtonKind.Primary : ButtonKind.Ghost}
              onClick={() => setCaseIndex(index)}
              size="sm"
            >
              {testCase.name}
            </Button>
          ))}
        </div>
        <ModalWrapper evo={edgeCases[caseIndex].evo} />
      </div>
    );
  },
};

// Responsive showcase
export const ResponsiveShowcase: Story = {
  render: () => (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">
        This modal is responsive and adapts to different screen sizes.
        Try resizing your browser window to see the responsive behavior.
      </p>
      <ModalWrapper evo={mockEvoActive} />
    </div>
  ),
  parameters: {
    viewport: {
      defaultViewport: "responsive",
    },
  },
};

// Interactive demo
export const InteractiveDemo: Story = {
  render: () => {
    const [selectedEvo, setSelectedEvo] = useState(mockEvoActive);
    const [isEditing, setIsEditing] = useState(false);

    const evos = [
      { ...mockEvoActive, fullName: "John Doe (Active)" },
      { ...mockEvoPending, fullName: "Jane Smith (Pending BGC)" },
      { ...mockEvoDisengaged, fullName: "Bob Johnson (Disengaged)" }
    ];

    return (
      <div className="space-y-6 p-6 bg-gray-50 rounded-lg">
        <div>
          <h3 className="text-lg font-semibold mb-4">Interactive Demo</h3>
          <p className="text-sm text-gray-600 mb-4">
            Select different EVO accounts to see how the modal displays various states and data configurations.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {evos.map((evo) => (
            <Button
              key={evo.id}
              kind={selectedEvo.id === evo.id ? ButtonKind.Primary : ButtonKind.Ghost}
              onClick={() => setSelectedEvo(evo)}
            >
              {evo.fullName}
            </Button>
          ))}
        </div>

        <ModalWrapper
          evo={selectedEvo}
          showActions={true}
        />

        <div className="text-xs text-gray-500 bg-white p-3 rounded border">
          <strong>Current EVO:</strong> {selectedEvo.evoCode} - {selectedEvo.status}
          <br />
          <strong>BGC Status:</strong> {selectedEvo.bgcDecision}
          <br />
          <strong>OSP Status:</strong> {selectedEvo.ospStatus}
        </div>
      </div>
    );
  },
  parameters: {
    layout: "fullscreen",
  },
};