"use client";

import * as React from "react";
import { AlertTriangle, User } from "lucide-react";
import { Modal } from "@/components/lamt/modal";
import { LabeledItem } from "@/components/lamt/labeled-item";
import { StatusChip, StatusChipType } from "@/components/lamt/status-chip";
import { EVCORE_COLORS } from "@/lib/evcore/constants";
import type { EvoAccount, EvoStatus, BgcDecision, OspStatus } from "@/data/dummy";

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

// ─── Layout helpers ───────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ fontSize: 11, fontWeight: 700, color: EVCORE_COLORS.textSecondary, letterSpacing: "0.07em", textTransform: "uppercase", paddingBottom: 10, marginBottom: 14, borderBottom: `0.5px solid ${EVCORE_COLORS.border}` }}>
        {title}
      </div>
      {children}
    </div>
  );
}

function Grid2({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      {children}
    </div>
  );
}

function Col({ children, full }: { children: React.ReactNode; full?: boolean }) {
  return (
    <div style={{ width: full ? "100%" : "50%", paddingRight: full ? 0 : 20, marginBottom: 16 }}>
      {children}
    </div>
  );
}

// LabeledItem wrapper for values that need a chip (hides the "Not available" text)
function ChipField({ label, chip }: { label: string; chip: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <p className="text-[13.17px] leading-4 text-lamt-neutral">{label}</p>
      <div className="mt-1">{chip}</div>
    </div>
  );
}

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────

export function DeleteConfirmModal({ evo, onConfirm, onCancel }: { evo: EvoAccount; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div onClick={onCancel} style={{ position: "fixed", inset: 0, zIndex: 60, backgroundColor: "rgba(17,23,30,0.55)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div onClick={e => e.stopPropagation()} style={{ backgroundColor: EVCORE_COLORS.white, borderRadius: 14, width: "100%", maxWidth: 460, border: `0.5px solid ${EVCORE_COLORS.border}` }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 22px", borderBottom: `0.5px solid ${EVCORE_COLORS.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 9, backgroundColor: "#FEE2E2", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <AlertTriangle size={18} color="#991B1B" strokeWidth={1.75} />
            </div>
            <span style={{ fontSize: 16, fontWeight: 700, color: EVCORE_COLORS.textPrimary }}>Delete EVO Account</span>
          </div>
        </div>
        <div style={{ padding: "22px" }}>
          <p style={{ fontSize: 14, color: EVCORE_COLORS.textPrimary, marginBottom: 10, lineHeight: 1.65 }}>
            Are you sure you want to delete the EVO account for <strong>{evo.fullName}</strong> (<span style={{ fontFamily: "monospace" }}>{evo.evoCode}</span>)?
          </p>
          <p style={{ fontSize: 13, color: EVCORE_COLORS.textSecondary, lineHeight: 1.65 }}>
            This is permanent. All BGC records, OSP records, asset history and payment history will be removed.
          </p>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, padding: "16px 22px", borderTop: `0.5px solid ${EVCORE_COLORS.border}` }}>
          <button onClick={onCancel} style={{ height: 38, padding: "0 20px", borderRadius: 8, border: `0.5px solid ${EVCORE_COLORS.border}`, backgroundColor: "transparent", fontSize: 13, fontWeight: 500, color: EVCORE_COLORS.textSecondary, cursor: "pointer" }}>Cancel</button>
          <button onClick={onConfirm} style={{ height: 38, padding: "0 20px", borderRadius: 8, border: "none", backgroundColor: "#DC2626", fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer" }}>Delete Account</button>
        </div>
      </div>
    </div>
  );
}

// ─── EVO Detail Modal ─────────────────────────────────────────────────────────

interface EvoDetailModalProps {
  evo: EvoAccount | null;
  onClose: () => void;
}

export function EvoDetailModal({ evo, onClose }: EvoDetailModalProps) {
  if (!evo) return null;

  const statusChip = EVO_STATUS_CHIP[evo.status];
  const bgcChip    = BGC_CHIP[evo.bgcDecision];
  const ospChip    = OSP_CHIP[evo.ospStatus];

  const fmtDate = (s: string | null) =>
    s ? new Date(s).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : undefined;

  const rentalParts = evo.rentalPlan?.match(/SF(\d+)\.RF(\d+)\.RP(\d+)/);

  const modalTitle = (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      EVO Account
      <span style={{ fontFamily: "monospace", fontSize: 11, fontWeight: 700, color: EVCORE_COLORS.green, backgroundColor: "#EBF8F3", border: `0.5px solid ${EVCORE_COLORS.greenLight}`, borderRadius: 5, padding: "2px 8px" }}>
        {evo.evoCode}
      </span>
    </span>
  );

  return (
    <Modal opened onClose={onClose} title={modalTitle} maxWidth={660} icon={<User size={18} color={EVCORE_COLORS.green} />}>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

        {/* ── Top summary: big metrics row ───────────────────────────────── */}
        <div style={{ display: "flex", gap: 0, backgroundColor: EVCORE_COLORS.pageBg, borderRadius: 10, border: `0.5px solid ${EVCORE_COLORS.border}`, overflow: "hidden" }}>
          <div style={{ flex: 1, padding: "16px 20px", borderRight: `0.5px solid ${EVCORE_COLORS.border}` }}>
            <LabeledItem isBig label="Full Name" value={evo.fullName} />
          </div>
          <div style={{ flex: "0 0 auto", padding: "16px 20px", borderRight: `0.5px solid ${EVCORE_COLORS.border}`, display: "flex", flexDirection: "column", gap: 6 }}>
            <p className="text-[13.17px] leading-4 text-lamt-neutral">Status</p>
            <StatusChip type={statusChip.type}>{statusChip.label}</StatusChip>
          </div>
          <div style={{ flex: "0 0 auto", padding: "16px 20px" }}>
            <LabeledItem isBig label="Balance" value={evo.balance > 0 ? `$${evo.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}` : "$0.00"} />
          </div>
        </div>

        {/* ── Section 1: Personal ─────────────────────────────────────────── */}
        <Section title="Personal Details">
          <Grid2>
            <Col><LabeledItem label="EVO Code"       value={evo.evoCode} /></Col>
            <Col><LabeledItem label="Phone"          value={evo.phoneNumbers.join(", ")} /></Col>
            <Col><LabeledItem label="Gender"         value={evo.gender === "M" ? "Male" : "Female"} /></Col>
            <Col><LabeledItem label="Date of Birth"  value={fmtDate(evo.dateOfBirth)} /></Col>
            <Col><LabeledItem label="Marital Status" value={evo.maritalStatus.charAt(0) + evo.maritalStatus.slice(1).toLowerCase()} /></Col>
            <Col><LabeledItem label="Current Work"   value={WORK_LABELS[evo.currentWork] ?? evo.currentWork} /></Col>
            <Col><LabeledItem label="Housing"        value={evo.housingStatus === "OWNER" ? "Owner" : "Tenant"} /></Col>
            <Col><LabeledItem label="Has Smartphone" value={evo.hasSmartphone ? "Yes" : "No"} /></Col>
            <Col><LabeledItem label="Works Saturday" value={evo.worksSaturday ? "Yes" : "No"} /></Col>
            <Col><LabeledItem label="Works Sunday"   value={evo.worksSunday   ? "Yes" : "No"} /></Col>
          </Grid2>
        </Section>

        {/* ── Section 2: Address ──────────────────────────────────────────── */}
        <Section title="Address">
          <Grid2>
            <Col><LabeledItem label="City"        value={evo.address.city} /></Col>
            <Col><LabeledItem label="Commune"     value={evo.address.commune} /></Col>
            <Col><LabeledItem label="Quartier"    value={evo.address.quartier} /></Col>
            <Col><LabeledItem label="Avenue"      value={evo.address.avenue} /></Col>
            <Col><LabeledItem label="Plot Number" value={evo.address.plotNumber} /></Col>
          </Grid2>
        </Section>

        {/* ── Section 3: Assignment ───────────────────────────────────────── */}
        <Section title="Assignment">
          <Grid2>
            <Col><LabeledItem label="EMC"        value={`${evo.emcCode} — ${evo.emcName}`} /></Col>
            <Col><LabeledItem label="AAROVE"     value={evo.assignedAarove} /></Col>
            <Col><LabeledItem label="EV Product" value={evo.evProductCode} /></Col>
            <Col><LabeledItem label="Rental Plan" value={evo.rentalPlan ?? undefined} /></Col>
            {rentalParts && <>
              <Col><LabeledItem label="Subscription Fee" value={`$${rentalParts[1]}.00 (one-time)`} /></Col>
              <Col><LabeledItem label="Daily Rental"     value={`$${rentalParts[2]}.00 / day`} /></Col>
              <Col><LabeledItem label="Rental Period"    value={`${rentalParts[3]} months`} /></Col>
            </>}
            <Col><LabeledItem label="Registered"   value={fmtDate(evo.registeredAt)} /></Col>
            <Col><LabeledItem label="Last Payment" value={fmtDate(evo.lastPaymentDate)} /></Col>
          </Grid2>
        </Section>

        {/* ── Section 4: BGC & OSP ────────────────────────────────────────── */}
        <Section title="BGC & OSP Training">
          <Grid2>
            <Col>
              <ChipField label="BGC Decision" chip={<StatusChip type={bgcChip.type}>{bgcChip.label}</StatusChip>} />
            </Col>
            <Col>
              <ChipField label="OSP Status" chip={<StatusChip type={ospChip.type}>{ospChip.label}</StatusChip>} />
            </Col>
            <Col><LabeledItem label="Written Score"  value={evo.ospWrittenScore !== null ? `${evo.ospWrittenScore}/100` : undefined} /></Col>
            <Col><LabeledItem label="On-Road Score"  value={evo.ospOnroadScore  !== null ? `${evo.ospOnroadScore}/100`  : undefined} /></Col>
          </Grid2>
        </Section>

        {/* ── Footer ──────────────────────────────────────────────────────── */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ height: 38, padding: "0 22px", border: `0.5px solid ${EVCORE_COLORS.border}`, borderRadius: 8, backgroundColor: "transparent", fontSize: 13, color: EVCORE_COLORS.textSecondary, cursor: "pointer" }}>
            Close
          </button>
        </div>

      </div>
    </Modal>
  );
}
