"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { AppShell }    from "@/components/evcore/layout/AppShell";
import { LabeledItem } from "@/components/lamt/labeled-item";
import { StatusChip, StatusChipType } from "@/components/lamt/status-chip";
import { Table, TableCellType, PaginationStrategy } from "@/components/lamt/table";
import { EditEvoModal }       from "@/components/evcore/modals/EditEvoModal";
import { DeleteConfirmModal } from "@/components/evcore/ui/EvoDetailModal";
import {
  EVO_ACCOUNTS, BGC_TASKS, OSP_TASKS, PAYMENT_RECORDS,
  type EvoAccount, type BgcDecision, type OspStatus, type EvoStatus,
} from "@/data/dummy";
import { EVCORE_COLORS } from "@/lib/evcore/constants";

// ─── Chip maps ────────────────────────────────────────────────────────────────

const EVO_STATUS_CHIP: Record<EvoStatus, { type: StatusChipType; label: string }> = {
  ACTIVE:      { type: StatusChipType.Success, label: "Active"      },
  PENDING_BGC: { type: StatusChipType.Warning, label: "Pending BGC" },
  PENDING_OSP: { type: StatusChipType.Accent,  label: "Pending OSP" },
  PENDING_RP:  { type: StatusChipType.Info,    label: "Pending RP"  },
  PARTIAL_RP:  { type: StatusChipType.AccentM, label: "Partial RP"  },
  PENDING_HO:  { type: StatusChipType.AccentM, label: "Pending HO"  },
  INACTIVE:    { type: StatusChipType.Normal,  label: "Inactive"    },
  DISENGAGED:  { type: StatusChipType.Danger,  label: "Disengaged"  },
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

const PAY_TYPE: Record<string, { type: StatusChipType; label: string }> = {
  SUBSCRIPTION: { type: StatusChipType.Info,   label: "Subscription" },
  RENTAL:       { type: StatusChipType.Accent, label: "Rental"       },
};
const PAY_STATUS: Record<string, { type: StatusChipType; label: string }> = {
  COMPLETED: { type: StatusChipType.Success, label: "Completed" },
  PENDING:   { type: StatusChipType.Warning, label: "Pending"   },
  FAILED:    { type: StatusChipType.Danger,  label: "Failed"    },
};

const WORK_LABEL: Record<string, string> = {
  MOTO_TAXI: "Moto-Taxi", SMALL_COMMERCE: "Small Commerce",
  EMPLOYEE: "Employee", AGRICULTURE: "Agriculture",
  UNEMPLOYED: "Unemployed", OTHER: "Other",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtDate(s: string | null | undefined) {
  if (!s) return undefined;
  return new Date(s).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

// ─── Primitives matching LAMT design ─────────────────────────────────────────

function QuickAction({ label, context, onClick, disabled, primary }: { label: string; context: string; onClick?: () => void; disabled?: boolean; primary?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        padding: "8px 20px", borderRadius: 99,
        border: `1.5px solid ${EVCORE_COLORS.green}`,
        backgroundColor: primary ? EVCORE_COLORS.green : EVCORE_COLORS.white,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.4 : 1,
        gap: 2,
        transition: "background-color 0.15s",
      }}
    >
      <span style={{ fontSize: 13, fontWeight: 600, color: primary ? "#fff" : EVCORE_COLORS.green, whiteSpace: "nowrap" }}>{label}</span>
      <span style={{ fontSize: 10, color: primary ? "rgba(255,255,255,0.75)" : EVCORE_COLORS.green, opacity: 0.8 }}>{context}</span>
    </button>
  );
}

// Box matches LAMT's DetailBoxInner — 7px radius, 1px border, 15px padding
function Box({ title, chip, actions, children }: {
  title: string;
  chip?: React.ReactNode;
  actions?: { label: string; onClick: () => void }[];
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <div style={{ border: "1px solid #D5DCE3", borderRadius: 7, padding: 15, backgroundColor: EVCORE_COLORS.white, position: "relative" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 15 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 16, fontWeight: 600, color: EVCORE_COLORS.textPrimary }}>{title}</span>
          {chip}
        </div>
        {actions && actions.length > 0 && (
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setOpen(o => !o)}
              style={{ display: "flex", alignItems: "center", gap: 4, height: 32, padding: "0 12px", borderRadius: 16, border: `1px solid ${EVCORE_COLORS.border}`, backgroundColor: EVCORE_COLORS.white, fontSize: 13, color: EVCORE_COLORS.textPrimary, cursor: "pointer", fontWeight: 500 }}
            >
              Actions <ChevronDown size={12} />
            </button>
            {open && (
              <>
                <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 10 }} />
                <div style={{ position: "absolute", right: 0, top: 36, zIndex: 20, backgroundColor: EVCORE_COLORS.white, border: `1px solid ${EVCORE_COLORS.border}`, borderRadius: 7, minWidth: 160, boxShadow: "0 4px 16px rgba(0,0,0,0.1)", overflow: "hidden" }}>
                  {actions.map(a => (
                    <button key={a.label} onClick={() => { a.onClick(); setOpen(false); }}
                      style={{ display: "block", width: "100%", textAlign: "left", padding: "9px 14px", fontSize: 13, color: EVCORE_COLORS.textPrimary, border: "none", backgroundColor: "transparent", cursor: "pointer" }}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = EVCORE_COLORS.pageBg)}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
                    >
                      {a.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
      {children}
    </div>
  );
}

function Item({ label, value, chip }: { label: string; value?: string; chip?: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 15 }}>
      {chip
        ? <><p className="text-[13.17px] leading-4 text-lamt-neutral mb-1">{label}</p>{chip}</>
        : <LabeledItem label={label} value={value} />
      }
    </div>
  );
}

function ScoreBar({ label, score }: { label: string; score: number | null }) {
  const passed = score !== null && score >= 70;
  return (
    <div style={{ marginBottom: 15 }}>
      <p className="text-[13.17px] leading-4 text-lamt-neutral mb-1">{label}</p>
      {score === null
        ? <p className="text-[14px] leading-6 italic text-lamt-neutral">Not available</p>
        : <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ flex: 1, height: 5, borderRadius: 99, backgroundColor: "#EDF1F5", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${score}%`, borderRadius: 99, backgroundColor: passed ? EVCORE_COLORS.green : EVCORE_COLORS.danger }} />
            </div>
            <span style={{ fontSize: 13, fontWeight: 700, color: passed ? "#0F6E56" : "#991B1B", minWidth: 52 }}>{score}/100</span>
          </div>
      }
    </div>
  );
}

function PhaseItem({ label, complete, pass }: { label: string; complete: boolean; pass?: boolean }) {
  const color = !complete ? EVCORE_COLORS.textSecondary : pass ? "#0F6E56" : "#991B1B";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
      <span style={{ fontSize: 9, color, flexShrink: 0 }}>{!complete ? "○" : "●"}</span>
      <span style={{ fontSize: 13, color: EVCORE_COLORS.textSecondary, flex: 1 }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 600, color, whiteSpace: "nowrap" }}>
        {!complete ? "Pending" : pass ? "Passed" : "Failed"}
      </span>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EvoDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const evo = EVO_ACCOUNTS.find(e => e.id === id || e.evoCode === id) ?? null;

  const [editOpen,   setEditOpen]   = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [payPage,    setPayPage]    = React.useState(1);

  React.useEffect(() => { if (!evo) router.push("/accounts"); }, [evo]);
  if (!evo) return null;

  const bgcTask  = BGC_TASKS.find(t => t.evoCode === evo.evoCode);
  const ospTask  = OSP_TASKS.find(t => t.evoCode === evo.evoCode);
  const payments = PAYMENT_RECORDS.filter(p => p.evoCode === evo.evoCode);

  const statusChip = EVO_STATUS_CHIP[evo.status];
  const bgcChip    = BGC_CHIP[evo.bgcDecision];
  const ospChip    = OSP_CHIP[evo.ospStatus];
  const rentalParts = evo.rentalPlan?.match(/SF(\d+)\.RF(\d+)\.RP(\d+)/);

  const payTableData = payments.map(p => ({
    id: p.id,
    ref:     <span style={{ fontFamily: "monospace", fontSize: 11, color: EVCORE_COLORS.green }}>{p.paymentReference}</span>,
    type:    <StatusChip type={PAY_TYPE[p.paymentType].type}>{PAY_TYPE[p.paymentType].label}</StatusChip>,
    channel: <span style={{ fontSize: 12 }}>{p.paymentChannel.replace(/_/g, " ")}</span>,
    amount:  <span style={{ fontSize: 12, fontWeight: 700 }}>USD {p.amount}.00</span>,
    status:  <StatusChip type={PAY_STATUS[p.status].type}>{PAY_STATUS[p.status].label}</StatusChip>,
    date:    <span style={{ fontSize: 11, color: EVCORE_COLORS.textSecondary }}>{fmtDate(p.paymentDatetime)}</span>,
  }));

  const payColDefs = [
    { headerName: "Reference", type: TableCellType.component, key: "ref"     },
    { headerName: "Type",      type: TableCellType.component, key: "type"    },
    { headerName: "Channel",   type: TableCellType.component, key: "channel" },
    { headerName: "Amount",    type: TableCellType.component, key: "amount"  },
    { headerName: "Status",    type: TableCellType.component, key: "status"  },
    { headerName: "Date",      type: TableCellType.component, key: "date"    },
  ];

  return (
    <>
      <AppShell pageTitle={`${evo.evoCode} — ${evo.fullName}`}>
        <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>

          {/* ── Page header ─────────────────────────────────────────────── */}
          <div>
            <button
              onClick={() => router.push("/accounts")}
              style={{ fontSize: 12, color: EVCORE_COLORS.textSecondary, background: "none", border: "none", cursor: "pointer", padding: "0 0 12px", display: "flex", alignItems: "center", gap: 4 }}
            >
              ← Back to Accounts
            </button>

            {/* EVO code + status + name */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <span style={{ fontFamily: "monospace", fontSize: 28, fontWeight: 700, color: EVCORE_COLORS.textPrimary }}>{evo.evoCode}</span>
                <StatusChip type={statusChip.type}>{statusChip.label}</StatusChip>
              </div>
              <div style={{ fontSize: 13, color: EVCORE_COLORS.textSecondary }}>{evo.fullName} · {evo.emcName} · {evo.assignedAarove}</div>
            </div>

            {/* Quick actions row — LAMT pill style */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              <QuickAction label="Edit Details"   context="Account"  onClick={() => setEditOpen(true)} primary />
              <QuickAction label="Change Status"  context="Account" />
              <QuickAction label="Assign Asset"   context="Asset" />
              <QuickAction label="Record Payment" context="Payments" disabled={!["ACTIVE", "PENDING_RP", "PARTIAL_RP"].includes(evo.status)} />
              <QuickAction label="Delete Account" context="Account"  onClick={() => setDeleteOpen(true)} />
            </div>
          </div>

          {/* ── Top metrics — LAMT's DetailContentTop ───────────────────── */}
          <div style={{ border: "1px solid #D5DCE3", borderRadius: 17, padding: 30, display: "flex", justifyContent: "space-between", gap: 20, backgroundColor: EVCORE_COLORS.white }}>
            <LabeledItem isBig label="Phone"         value={evo.phoneNumbers[0]} />
            <LabeledItem isBig label="EMC Zone"      value={evo.emcName} />
            <LabeledItem isBig label="Rental Plan"   value={evo.rentalPlan ?? undefined} />
            <LabeledItem isBig label="Balance"       value={evo.balance > 0 ? `$${evo.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}` : "$0.00"} />
            <LabeledItem isBig label="Last Payment"  value={fmtDate(evo.lastPaymentDate)} />
            <LabeledItem isBig label="Registered"    value={fmtDate(evo.registeredAt)} />
          </div>

          {/* ── Box grid — LAMT's 3-column DetailContentBoxes ───────────── */}
          <div style={{ display: "flex", flexWrap: "wrap", marginLeft: -15 }}>

            {/* Account box */}
            <div style={{ width: "33.333%", paddingLeft: 15, marginBottom: 30, boxSizing: "border-box" }}>
              <Box
                title="Account"
                chip={<StatusChip type={statusChip.type}>{statusChip.label}</StatusChip>}
                actions={[
                  { label: "Change Status",  onClick: () => {} },
                  { label: "Assign Asset",   onClick: () => {} },
                  { label: "Delete Account", onClick: () => setDeleteOpen(true) },
                ]}
              >
                <div style={{ display: "flex", gap: 0 }}>
                  <div style={{ flex: 1, paddingRight: 15 }}>
                    <Item label="EVO Code"    value={evo.evoCode} />
                    <Item label="EMC"         value={`${evo.emcCode} — ${evo.emcName}`} />
                    <Item label="AAROVE"      value={evo.assignedAarove} />
                    <Item label="EV Product"  value={evo.evProductCode} />
                    <Item label="Rental Plan" value={evo.rentalPlan ?? undefined} />
                  </div>
                  <div style={{ flex: 1 }}>
                    {rentalParts && <>
                      <Item label="Joining Fee"  value={`$${rentalParts[1]}.00 one-time`} />
                      <Item label="Daily Rental" value={`$${rentalParts[2]}.00 / day`} />
                      <Item label="Period"       value={`${rentalParts[3]} months`} />
                    </>}
                    <Item label="Payments" value={`${payments.length} recorded`} />
                  </div>
                </div>
              </Box>
            </div>

            {/* Customer box */}
            <div style={{ width: "33.333%", paddingLeft: 15, marginBottom: 30, boxSizing: "border-box" }}>
              <Box
                title="Customer"
                actions={[
                  { label: "Edit Customer Data", onClick: () => setEditOpen(true) },
                ]}
              >
                <div style={{ display: "flex", gap: 0 }}>
                  <div style={{ flex: 1, paddingRight: 15 }}>
                    <Item label="Full Name"      value={evo.fullName} />
                    <Item label="Phone"          value={evo.phoneNumbers.join(", ")} />
                    <Item label="Gender"         value={evo.gender === "M" ? "Male" : "Female"} />
                    <Item label="Date of Birth"  value={fmtDate(evo.dateOfBirth)} />
                    <Item label="Marital Status" value={evo.maritalStatus.charAt(0) + evo.maritalStatus.slice(1).toLowerCase()} />
                    <Item label="Current Work"   value={WORK_LABEL[evo.currentWork] ?? evo.currentWork} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <Item label="Housing"        value={evo.housingStatus === "OWNER" ? "Owner" : "Tenant"} />
                    <Item label="Has Smartphone" value={evo.hasSmartphone ? "Yes" : "No"} />
                    <Item label="Works Saturday" value={evo.worksSaturday ? "Yes" : "No"} />
                    <Item label="Works Sunday"   value={evo.worksSunday   ? "Yes" : "No"} />
                  </div>
                </div>
              </Box>
            </div>

            {/* Location box */}
            <div style={{ width: "33.333%", paddingLeft: 15, marginBottom: 30, boxSizing: "border-box" }}>
              <Box
                title="Location"
                actions={[
                  { label: "Edit Location", onClick: () => setEditOpen(true) },
                ]}
              >
                <div style={{ display: "flex", gap: 0 }}>
                  <div style={{ flex: 1, paddingRight: 15 }}>
                    <Item label="City"        value={evo.address.city} />
                    <Item label="Commune"     value={evo.address.commune} />
                    <Item label="Quartier"    value={evo.address.quartier} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <Item label="Avenue"      value={evo.address.avenue} />
                    <Item label="Plot Number" value={evo.address.plotNumber} />
                    <Item label="EMC Zone"    value={evo.emcName} />
                  </div>
                </div>
              </Box>
            </div>

            {/* BGC box */}
            <div style={{ width: "33.333%", paddingLeft: 15, marginBottom: 30, boxSizing: "border-box" }}>
              <Box title="Background Check" chip={<StatusChip type={bgcChip.type}>{bgcChip.label}</StatusChip>}>
                <div style={{ display: "flex", gap: 0 }}>
                  <div style={{ flex: 1, paddingRight: 15 }}>
                    <Item label="Task Status" value={bgcTask?.status.replace(/_/g, " ")} />
                    <Item label="Assigned To" value={bgcTask?.assignedTo ?? undefined} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <PhaseItem label="Operator residence"  complete={!!bgcTask?.phase1Complete} pass={bgcTask?.phase1Data?.operatorLivesHere} />
                    <PhaseItem label="Sponsor verification" complete={!!bgcTask?.phase2Complete} pass={bgcTask?.phase2Data?.recommendsEvo} />
                    <PhaseItem label="Neighbor reputation"  complete={!!bgcTask?.phase3Complete} pass={bgcTask?.phase3Data?.reputation === "GOOD"} />
                  </div>
                </div>
              </Box>
            </div>

            {/* OSP box */}
            <div style={{ width: "33.333%", paddingLeft: 15, marginBottom: 30, boxSizing: "border-box" }}>
              <Box title="OSP Training" chip={<StatusChip type={ospChip.type}>{ospChip.label}</StatusChip>}>
                <div style={{ display: "flex", gap: 0 }}>
                  <div style={{ flex: 1, paddingRight: 15 }}>
                    <Item label="Trainer"       value={ospTask?.assignedTrainer ?? undefined} />
                    <Item label="Training Date" value={fmtDate(ospTask?.trainingDate)} />
                    <Item label="Location"      value={ospTask?.trainingLocation ?? undefined} />
                    {ospTask?.certifiedAt && <Item label="Certified On" value={fmtDate(ospTask.certifiedAt)} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <ScoreBar label="Written score" score={evo.ospWrittenScore} />
                    <ScoreBar label="On-Road score" score={evo.ospOnroadScore} />
                  </div>
                </div>
              </Box>
            </div>

          </div>

          {/* ── Payments table ──────────────────────────────────────────── */}
          <div>
            <Box title={`Payments (${payments.length})`}>
              {payments.length === 0 ? (
                <div style={{ padding: "32px 0", textAlign: "center", fontSize: 13, color: EVCORE_COLORS.textSecondary }}>
                  No payments recorded yet.
                </div>
              ) : (
                <div style={{ margin: "0 -15px -15px" }}>
                  <Table
                    hasActions={false}
                    data={payTableData}
                    colDefs={payColDefs}
                    currentPageNumber={payPage}
                    limit={8}
                    totalData={payments.length}
                    paginationStrategy={PaginationStrategy.LOCAL}
                    onPageChange={setPayPage}
                    showCheckbox={false}
                  />
                </div>
              )}
            </Box>
          </div>

        </div>
      </AppShell>

      <EditEvoModal evo={editOpen ? evo : null} onClose={() => setEditOpen(false)} />
      {deleteOpen && (
        <DeleteConfirmModal
          evo={evo}
          onConfirm={() => { setDeleteOpen(false); router.push("/accounts"); }}
          onCancel={() => setDeleteOpen(false)}
        />
      )}
    </>
  );
}
