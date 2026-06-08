"use client";

import * as React from "react";
import { AlertTriangle, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Modal } from "@/components/lamt/modal";
import { LabeledItem } from "@/components/lamt/labeled-item";
import { StatusChip, StatusChipType } from "@/components/lamt/status-chip";
import { Button, ButtonKind } from "@/components/lamt/button";
import type { EvoAccount, EvoStatus, BgcDecision, OspStatus } from "@/data/dummy";

/**
 * LAMT EVO Detail Modal Component
 * Refactored from EV Core to use Tailwind CSS with enhanced modularity
 *
 * Features:
 * - Responsive design with Tailwind utilities
 * - Modular section components
 * - Enhanced accessibility
 * - Better loading states
 * - Improved typography and spacing
 */

// ─── Status chip mappings ─────────────────────────────────────────────────────

const EVO_STATUS_CHIP: Record<EvoStatus, { type: StatusChipType; label: string }> = {
  ACTIVE:       { type: StatusChipType.Success,  label: "Active"       },
  PENDING_BGC:  { type: StatusChipType.Warning,  label: "Pending BGC"  },
  PENDING_OSP:  { type: StatusChipType.Accent,   label: "Pending OSP"  },
  PENDING_RP:   { type: StatusChipType.Info,     label: "Pending RP"   },
  PARTIAL_RP:   { type: StatusChipType.AccentM,  label: "Partial RP"   },
  PENDING_HO:   { type: StatusChipType.AccentM,  label: "Pending HO"   },
  INACTIVE:     { type: StatusChipType.Normal,   label: "Inactive"     },
  DISENGAGED:   { type: StatusChipType.Danger,   label: "Disengaged"   },
};

const BGC_CHIP: Record<BgcDecision, { type: StatusChipType; label: string }> = {
  NOT_ASSESSED:  { type: StatusChipType.Normal,  label: "Not Assessed"  },
  RECOMMENDED:   { type: StatusChipType.Success, label: "Recommended"   },
  REJECTED:      { type: StatusChipType.Danger,  label: "Rejected"      },
  MANUAL_REVIEW: { type: StatusChipType.Warning, label: "Manual Review" },
};

const OSP_CHIP: Record<OspStatus, { type: StatusChipType; label: string }> = {
  NOT_STARTED: { type: StatusChipType.Normal,  label: "Not Started" },
  IN_PROGRESS: { type: StatusChipType.Accent,  label: "In Progress" },
  PASSED:      { type: StatusChipType.Success, label: "Passed"      },
  FAILED:      { type: StatusChipType.Danger,  label: "Failed"      },
};

const WORK_LABELS: Record<string, string> = {
  MOTO_TAXI:      "Moto-Taxi",
  SMALL_COMMERCE: "Small Commerce",
  EMPLOYEE:       "Employee",
  AGRICULTURE:    "Agriculture",
  UNEMPLOYED:     "Unemployed",
  OTHER:          "Other",
};

// ─── Modular Layout Components ────────────────────────────────────────────────

interface SectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

function Section({ title, children, className }: SectionProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="text-[11px] font-bold text-lamt-neutral uppercase tracking-wider pb-2.5 mb-3.5 border-b border-lamt-neutral-medium">
        {title}
      </div>
      {children}
    </div>
  );
}

interface GridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3;
  className?: string;
}

function Grid({ children, columns = 2, className }: GridProps) {
  return (
    <div className={cn(
      "grid gap-y-4 gap-x-5",
      {
        "grid-cols-1": columns === 1,
        "grid-cols-1 lg:grid-cols-2": columns === 2,
        "grid-cols-1 md:grid-cols-2 lg:grid-cols-3": columns === 3,
      },
      className
    )}>
      {children}
    </div>
  );
}

interface ChipFieldProps {
  label: string;
  chip: React.ReactNode;
  className?: string;
}

function ChipField({ label, chip, className }: ChipFieldProps) {
  return (
    <div className={cn("flex flex-col space-y-1", className)}>
      <p className="text-[13.17px] leading-4 text-lamt-neutral font-medium">{label}</p>
      {chip}
    </div>
  );
}

interface SummaryCardProps {
  children: React.ReactNode;
  className?: string;
}

function SummaryCard({ children, className }: SummaryCardProps) {
  return (
    <div className={cn(
      "flex bg-lamt-neutral-light rounded-lg border border-lamt-neutral-medium overflow-hidden",
      className
    )}>
      {children}
    </div>
  );
}

interface SummaryCardItemProps {
  children: React.ReactNode;
  isLast?: boolean;
  className?: string;
}

function SummaryCardItem({ children, isLast = false, className }: SummaryCardItemProps) {
  return (
    <div className={cn(
      "p-4 lg:p-5",
      !isLast && "border-r border-lamt-neutral-medium",
      className
    )}>
      {children}
    </div>
  );
}

// ─── Delete Confirmation Modal ────────────────────────────────────────────────

export interface DeleteConfirmModalProps {
  evo: EvoAccount;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function DeleteConfirmModal({ evo, onConfirm, onCancel, isLoading = false }: DeleteConfirmModalProps) {
  return (
    <div
      onClick={onCancel}
      className="fixed inset-0 z-60 bg-lamt-neutral-dark/55 flex items-center justify-center p-5"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl w-full max-w-lg border border-lamt-neutral-medium shadow-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 lg:p-6 border-b border-lamt-neutral-medium">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-lamt-danger-light flex items-center justify-center">
              <AlertTriangle size={18} className="text-lamt-danger" strokeWidth={1.75} />
            </div>
            <span className="text-base font-bold text-lamt-neutral-dark">Delete EVO Account</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 lg:p-6">
          <p className="text-sm text-lamt-neutral-dark mb-2.5 leading-relaxed">
            Are you sure you want to delete the EVO account for{" "}
            <strong>{evo.fullName}</strong> ({" "}
            <span className="font-mono text-sm">{evo.evoCode}</span>
            )?
          </p>
          <p className="text-[13px] text-lamt-neutral leading-relaxed">
            This is permanent. All BGC records, OSP records, asset history and payment history will be removed.
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2.5 p-4 lg:p-6 border-t border-lamt-neutral-medium">
          <Button kind={ButtonKind.Ghost} onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            kind={ButtonKind.Primary}
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-lamt-danger hover:bg-lamt-danger/90"
          >
            {isLoading ? "Deleting..." : "Delete Account"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Main EVO Detail Modal ────────────────────────────────────────────────────

export interface EvoDetailModalProps {
  evo: EvoAccount | null;
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  loading?: boolean;
}

export function EvoDetailModal({
  evo,
  onClose,
  onEdit,
  onDelete,
  loading = false
}: EvoDetailModalProps) {
  if (!evo) return null;

  const statusChip = EVO_STATUS_CHIP[evo.status];
  const bgcChip = BGC_CHIP[evo.bgcDecision];
  const ospChip = OSP_CHIP[evo.ospStatus];

  const fmtDate = (s: string | null) =>
    s ? new Date(s).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }) : undefined;

  const rentalParts = evo.rentalPlan?.match(/SF(\d+)\.RF(\d+)\.RP(\d+)/);

  const modalTitle = (
    <span className="inline-flex items-center gap-2">
      EVO Account
      <span className="font-mono text-[11px] font-bold text-lamt-primary bg-lamt-primary/10 border border-lamt-primary/20 rounded px-2 py-0.5">
        {evo.evoCode}
      </span>
    </span>
  );

  if (loading) {
    return (
      <Modal
        opened
        onClose={onClose}
        title="Loading..."
        maxWidth={660}
        icon={<User size={18} className="text-lamt-primary" />}
      >
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-lamt-primary border-t-transparent"></div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      opened
      onClose={onClose}
      title={modalTitle}
      maxWidth={660}
      icon={<User size={18} className="text-lamt-primary" />}
    >
      <div className="flex flex-col space-y-6">

        {/* Summary Card */}
        <SummaryCard>
          <SummaryCardItem className="flex-1">
            <LabeledItem isBig label="Full Name" value={evo.fullName} />
          </SummaryCardItem>
          <SummaryCardItem className="flex-none">
            <ChipField
              label="Status"
              chip={<StatusChip type={statusChip.type}>{statusChip.label}</StatusChip>}
            />
          </SummaryCardItem>
          <SummaryCardItem isLast className="flex-none">
            <LabeledItem
              isBig
              label="Balance"
              value={evo.balance > 0 ? `$${evo.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}` : "$0.00"}
            />
          </SummaryCardItem>
        </SummaryCard>

        {/* Personal Details */}
        <Section title="Personal Details">
          <Grid>
            <LabeledItem label="EVO Code" value={evo.evoCode} />
            <LabeledItem label="Phone" value={evo.phoneNumbers.join(", ")} />
            <LabeledItem label="Gender" value={evo.gender === "M" ? "Male" : "Female"} />
            <LabeledItem label="Date of Birth" value={fmtDate(evo.dateOfBirth)} />
            <LabeledItem label="Marital Status" value={evo.maritalStatus.charAt(0) + evo.maritalStatus.slice(1).toLowerCase()} />
            <LabeledItem label="Current Work" value={WORK_LABELS[evo.currentWork] ?? evo.currentWork} />
            <LabeledItem label="Housing" value={evo.housingStatus === "OWNER" ? "Owner" : "Tenant"} />
            <LabeledItem label="Has Smartphone" value={evo.hasSmartphone ? "Yes" : "No"} />
            <LabeledItem label="Works Saturday" value={evo.worksSaturday ? "Yes" : "No"} />
            <LabeledItem label="Works Sunday" value={evo.worksSunday ? "Yes" : "No"} />
          </Grid>
        </Section>

        {/* Address */}
        <Section title="Address">
          <Grid>
            <LabeledItem label="City" value={evo.address.city} />
            <LabeledItem label="Commune" value={evo.address.commune} />
            <LabeledItem label="Quartier" value={evo.address.quartier} />
            <LabeledItem label="Avenue" value={evo.address.avenue} />
            <LabeledItem label="Plot Number" value={evo.address.plotNumber} />
          </Grid>
        </Section>

        {/* Assignment */}
        <Section title="Assignment">
          <Grid>
            <LabeledItem label="EMC" value={`${evo.emcCode} — ${evo.emcName}`} />
            <LabeledItem label="AAROVE" value={evo.assignedAarove} />
            <LabeledItem label="EV Product" value={evo.evProductCode} />
            <LabeledItem label="Rental Plan" value={evo.rentalPlan ?? undefined} />
            {rentalParts && (
              <>
                <LabeledItem label="Subscription Fee" value={`$${rentalParts[1]}.00 (one-time)`} />
                <LabeledItem label="Daily Rental" value={`$${rentalParts[2]}.00 / day`} />
                <LabeledItem label="Rental Period" value={`${rentalParts[3]} months`} />
              </>
            )}
            <LabeledItem label="Registered" value={fmtDate(evo.registeredAt)} />
            <LabeledItem label="Last Payment" value={fmtDate(evo.lastPaymentDate)} />
          </Grid>
        </Section>

        {/* BGC & OSP Training */}
        <Section title="BGC & OSP Training">
          <Grid>
            <ChipField
              label="BGC Decision"
              chip={<StatusChip type={bgcChip.type}>{bgcChip.label}</StatusChip>}
            />
            <ChipField
              label="OSP Status"
              chip={<StatusChip type={ospChip.type}>{ospChip.label}</StatusChip>}
            />
            <LabeledItem
              label="Written Score"
              value={evo.ospWrittenScore !== null ? `${evo.ospWrittenScore}/100` : undefined}
            />
            <LabeledItem
              label="On-Road Score"
              value={evo.ospOnroadScore !== null ? `${evo.ospOnroadScore}/100` : undefined}
            />
          </Grid>
        </Section>

        {/* Footer Actions */}
        <div className="flex justify-between pt-4">
          <div className="flex gap-2">
            {onEdit && (
              <Button kind={ButtonKind.Normal} onClick={onEdit}>
                Edit Account
              </Button>
            )}
            {onDelete && (
              <Button kind={ButtonKind.Ghost} onClick={onDelete} className="text-lamt-danger hover:text-lamt-danger">
                Delete Account
              </Button>
            )}
          </div>
          <Button kind={ButtonKind.Ghost} onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default EvoDetailModal;