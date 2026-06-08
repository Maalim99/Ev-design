"use client";

import * as React from "react";
import { Clock, CheckCircle2, AlertCircle, FileCheck, Eye, UserPlus, ClipboardCheck, ShieldCheck, XCircle } from "lucide-react";
import { AppShell } from "@/components/evcore/layout/AppShell";
import { KpiCard } from "@/components/evcore/ui/KpiCard";
import { useForm } from "react-hook-form";
import { EvoFormFiltersDrawer } from "@/components/lamt/evo-form-filters-drawer";
import { EvoPreferencesDrawer } from "@/components/lamt/evo-preferences-drawer";
import { PageHeader } from "@/components/lamt/page-header";
import { FiltersBar } from "@/components/lamt/filters-bar";
import { Table, TableCellType, PaginationStrategy } from "@/components/lamt/table";
import { Modal } from "@/components/lamt/modal";
import { Button, ButtonKind } from "@/components/lamt/button";
import { LabeledItem } from "@/components/lamt/labeled-item";
import { LabelForForm } from "@/components/lamt/label-for-form";
import { TextArea } from "@/components/lamt/text-area";
import { BGC_TASKS, type BgcTask, type BgcTaskStatus, type BgcRecommendation } from "@/data/dummy";
import { EVCORE_COLORS } from "@/lib/evcore/constants";
import { BGC_DEFAULT_COLUMNS } from "@/lib/evcore/filterConfigs";
import { EVO_BGC_FILTER_SECTIONS, getBgcFilterDefaults } from "@/lib/evcore/evoBgcFilterSections";
import { Method } from "@/lib/filter-utils";
import { StatusChip, StatusChipType } from "@/components/lamt/status-chip";
import { RowActionBtn } from "@/components/evcore/ui/RowActionBtn";
import { BgcDetailModal } from "./BgcDetailModal";

// ─── Constants ────────────────────────────────────────────────────────────────

const BGC_AGENTS    = ["Jean-Pierre Ndinga", "Patience Wa Mwila", "Ambroise Kabong"];

const STATUS_CHIP: Record<BgcTaskStatus, { type: StatusChipType; label: string }> = {
  NOT_YET_ASSIGNED: { type: StatusChipType.Normal,  label: "Not Yet Assigned" },
  ASSIGNED:   { type: StatusChipType.Accent,  label: "Assigned"   },
  SUBMITTED:  { type: StatusChipType.Info,    label: "Submitted"  },
  APPROVED:   { type: StatusChipType.Success, label: "Approved"   },
  REJECTED:   { type: StatusChipType.Danger,  label: "Rejected"   },
  RETURNED:   { type: StatusChipType.Warning, label: "Returned"   },
};

const REC_CHIP: Record<BgcRecommendation, { type: StatusChipType; label: string }> = {
  RECOMMENDED:   { type: StatusChipType.Success, label: "Recommended"   },
  REJECTED:      { type: StatusChipType.Danger,  label: "Rejected"      },
  MANUAL_REVIEW: { type: StatusChipType.Info,    label: "Manual Review" },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getPhase(t: BgcTask): "1" | "2" | "3" | "done" {
  if (!t.phase1Complete) return "1";
  if (!t.phase2Complete) return "2";
  if (!t.phase3Complete) return "3";
  return "done";
}

function getDaysOpen(t: BgcTask): number {
  const start = new Date(t.createdAt).getTime();
  const end   = t.completedAt ? new Date(t.completedAt).getTime() : Date.now();
  return Math.max(0, Math.floor((end - start) / 86_400_000));
}

function fmtDate(s: string) {
  return new Date(s).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

// ─── Primitives ───────────────────────────────────────────────────────────────


function DaysCell({ days }: { days: number }) {
  const color  = days < 7 ? "#0F6E56" : days <= 14 ? "#854F0B" : "#991B1B";
  const weight = days > 14 ? 700 : 500;
  return <span style={{ fontSize: 12, color, fontWeight: weight }}>{days}d</span>;
}


// ─── Phase Card (used inside BgcViewModal) ────────────────────────────────────

type PhaseResult = "pass" | "fail" | "pending";

interface PhaseField { label: string; value: string; check?: boolean }

function PhaseCard({ title, result, fields }: { title: string; result: PhaseResult; fields: PhaseField[] }) {
  const badge =
    result === "pass"    ? { label: "COMPLETE", bg: "#E1F5EE", text: "#1D9E75", border: "#1D9E75" } :
    result === "fail"    ? { label: "FAILED",   bg: "#FEE2E2", text: "#DC2626", border: "#EF4444" } :
                           { label: "PENDING",  bg: "#F1F5F9", text: "#64748B", border: "#CBD5E1" };
  return (
    <div style={{
      background: "linear-gradient(145deg, #ffffff 0%, #fafafa 100%)",
      border: `1px solid ${badge.border}40`,
      borderRadius: 12,
      padding: "18px 20px",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
      position: "relative"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: EVCORE_COLORS.textPrimary, lineHeight: 1.3 }}>{title}</div>
        <span style={{
          fontSize: 10,
          fontWeight: 700,
          color: badge.text,
          backgroundColor: badge.bg,
          border: `1px solid ${badge.border}30`,
          borderRadius: 6,
          padding: "4px 8px",
          letterSpacing: "0.05em"
        }}>
          {badge.label}
        </span>
      </div>
      {fields.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {fields.map(f => (
            <div key={f.label} style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: 13,
              padding: "8px 12px",
              backgroundColor: "rgba(255, 255, 255, 0.6)",
              borderRadius: 6,
              border: "1px solid #f1f5f9"
            }}>
              <span style={{ color: EVCORE_COLORS.textSecondary, fontWeight: 500 }}>{f.label}</span>
              {f.check !== undefined ? (
                <span style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  color: f.check ? "#1D9E75" : "#DC2626",
                  fontWeight: 600
                }}>
                  <span style={{
                    width: 16,
                    height: 16,
                    borderRadius: 3,
                    backgroundColor: f.check ? "#D1FAE5" : "#FEE2E2",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 10
                  }}>
                    {f.check ? "✓" : "✗"}
                  </span>
                  {f.value}
                </span>
              ) : (
                <span style={{ fontWeight: 600, color: EVCORE_COLORS.textPrimary }}>{f.value}</span>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div style={{
          textAlign: "center",
          padding: "24px 16px",
          color: EVCORE_COLORS.textSecondary,
          fontSize: 13,
          fontStyle: "italic",
          backgroundColor: "rgba(255, 255, 255, 0.6)",
          borderRadius: 8,
          border: "1px dashed #e5e7eb"
        }}>
          Phase not yet started
        </div>
      )}
    </div>
  );
}

// ─── BGC View / Detail modal ──────────────────────────────────────────────────

function BgcViewModal({ task, onClose, onAssign, onApprove, onReject, onReturn }: {
  task: BgcTask | null;
  onClose: () => void;
  onAssign: () => void;
  onApprove: () => void;
  onReject: () => void;
  onReturn: () => void;
}) {
  if (!task) return null;
  const stSt = STATUS_CHIP[task.status];
  const days = getDaysOpen(task);
  const daysColor = days > 14 ? EVCORE_COLORS.danger : days > 7 ? EVCORE_COLORS.amber : EVCORE_COLORS.green;

  // Phase result helpers (using new comprehensive data structure)
  const p1Result: PhaseResult = !task.phase1Complete ? "pending" : task.phase1Data?.phase1Result === "OK" ? "pass" : "fail";
  const p2Result: PhaseResult = !task.phase2Complete ? "pending" : task.phase2Data?.phase2Result === "OK" ? "pass" : "fail";
  const p3Result: PhaseResult = !task.phase3Complete ? "pending" : task.phase3Data?.phase3Result === "OK" ? "pass" : "fail";

  const p1Fields: PhaseField[] = task.phase1Data ? [
    { label: "Operator Present", value: task.phase1Data.operatorLivesHere ? "Confirmed" : "Not Present", check: task.phase1Data.operatorLivesHere },
    { label: "Address Match", value: task.phase1Data.addressMatchesRegistration ? "Matches" : "Different", check: task.phase1Data.addressMatchesRegistration },
    { label: "Work Verified", value: task.phase1Data.workMatchesRegistration ? "Verified" : "Unverified", check: task.phase1Data.workMatchesRegistration },
    { label: "Housing Status", value: `${task.phase1Data.verifiedHousingStatus} (${task.phase1Data.housingMatchesRegistration ? "Verified" : "Unverified"})`, check: task.phase1Data.housingMatchesRegistration },
    { label: "Respondent", value: task.phase1Data.respondentRelationship },
    { label: "Location", value: task.phase1Location ? `${task.phase1Location.lat.toFixed(4)}, ${task.phase1Location.lng.toFixed(4)}` : "Not recorded" },
  ] : [];

  const p2Fields: PhaseField[] = task.phase2Data ? [
    { label: "Name Verified", value: task.phase2Data.nameMatchesRegistration ? "Matches" : "Different", check: task.phase2Data.nameMatchesRegistration },
    { label: "Phone Verified", value: task.phase2Data.phoneMatchesRegistration ? "Matches" : "Different", check: task.phase2Data.phoneMatchesRegistration },
    { label: "Address Match", value: task.phase2Data.addressMatchesRegistration ? "Matches" : "Different", check: task.phase2Data.addressMatchesRegistration },
    { label: "Work Verified", value: task.phase2Data.workMatchesRegistration ? "Verified" : "Unverified", check: task.phase2Data.workMatchesRegistration },
    { label: "Relationship Verified", value: task.phase2Data.relationshipMatchesRegistration ? "Verified" : "Unverified", check: task.phase2Data.relationshipMatchesRegistration },
    { label: "Sponsor Endorsement", value: task.phase2Data.recommendsEvo ? "Endorses EVO" : "Does Not Endorse", check: task.phase2Data.recommendsEvo },
    { label: "Location", value: task.phase2Location ? `${task.phase2Location.lat.toFixed(4)}, ${task.phase2Location.lng.toFixed(4)}` : "Not recorded" },
  ] : [];

  const p3Fields: PhaseField[] = task.phase3Data ? [
    { label: "Knows Operator", value: task.phase3Data.knowsOperator ? "Yes" : "No", check: task.phase3Data.knowsOperator },
    { label: "Community Reputation", value: task.phase3Data.reputation, check: task.phase3Data.reputation === "GOOD" },
    { label: "Neighbors Interviewed", value: `${task.phase3Data.neighborsConsulted} consulted` },
    { label: "Location", value: task.phase3Location ? `${task.phase3Location.lat.toFixed(4)}, ${task.phase3Location.lng.toFixed(4)}` : "Not recorded" },
  ] : [];

  // Rich modal title with EVO code + recommendation chips inline
  const modalTitle = (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: 18, fontWeight: 700, color: EVCORE_COLORS.textPrimary }}>
          Background Check — {task.evoName}
        </span>
        <span style={{
          fontFamily: "monospace",
          fontSize: 12,
          fontWeight: 700,
          color: EVCORE_COLORS.green,
          backgroundColor: "#E8F5F0",
          border: "1px solid #A7F3D0",
          borderRadius: 8,
          padding: "4px 10px"
        }}>
          {task.evoCode}
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 14, color: EVCORE_COLORS.textSecondary }}>
          {task.province} Province
        </span>
        {task.finalRecommendation && (
          <>
            <span style={{ color: EVCORE_COLORS.textSecondary }}>•</span>
            <StatusChip type={REC_CHIP[task.finalRecommendation].type}>{REC_CHIP[task.finalRecommendation].label}</StatusChip>
          </>
        )}
      </div>
    </div>
  );

  return (
    <Modal opened title={modalTitle} maxWidth={760} icon={<ShieldCheck size={20} color={EVCORE_COLORS.green} />} onClose={onClose}>

      {/* Two info tiles */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
        <div style={{
          background: "linear-gradient(145deg, #ffffff 0%, #fafafa 100%)",
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          padding: "20px 22px",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)"
        }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: EVCORE_COLORS.textSecondary, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Province</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: EVCORE_COLORS.textPrimary, marginBottom: 10, letterSpacing: "-0.01em" }}>{task.province}</div>
          <div style={{ fontSize: 13, color: EVCORE_COLORS.textSecondary, marginBottom: 4 }}>EMC · <span style={{ fontFamily: "monospace", fontWeight: 600 }}>{task.emcCode}</span></div>
          <div style={{ fontSize: 13, color: EVCORE_COLORS.textSecondary }}>
            {task.assignedTo ? (
              <>
                Assigned to · <span style={{ fontWeight: 600 }}>{task.assignedTo}</span>
                {task.assignedAt && (
                  <div style={{ fontSize: 11, marginTop: 2 }}>
                    {new Date(task.assignedAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                  </div>
                )}
              </>
            ) : (
              <span style={{ color: EVCORE_COLORS.amber, fontWeight: 600 }}>Not yet assigned</span>
            )}
          </div>
        </div>
        <div style={{
          background: "linear-gradient(145deg, #ffffff 0%, #fafafa 100%)",
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          padding: "20px 22px",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)"
        }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: EVCORE_COLORS.textSecondary, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Timeline</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: daysColor, marginBottom: 10, letterSpacing: "-0.01em" }}>{days}d</div>
          <div style={{ fontSize: 13, marginBottom: 4 }}>
            <span style={{ color: EVCORE_COLORS.textSecondary }}>Status · </span>
            <StatusChip type={stSt.type}>{stSt.label}</StatusChip>
          </div>
          <div style={{ fontSize: 13, color: EVCORE_COLORS.textSecondary }}>Created · <span style={{ fontWeight: 500 }}>{fmtDate(task.createdAt)}</span></div>
          {task.submittedAt && (
            <div style={{ fontSize: 13, color: EVCORE_COLORS.textSecondary }}>Submitted · <span style={{ fontWeight: 500 }}>{fmtDate(task.submittedAt)}</span></div>
          )}
          {task.evaluatedBy && task.evaluatedAt && (
            <div style={{ fontSize: 13, color: EVCORE_COLORS.textSecondary }}>Evaluated by · <span style={{ fontWeight: 500 }}>{task.evaluatedBy}</span></div>
          )}
        </div>
      </div>

      {/* Three phase cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 14 }}>
        <PhaseCard title="Phase 1 — Operator"  result={p1Result} fields={p1Fields} />
        <PhaseCard title="Phase 2 — Sponsor"   result={p2Result} fields={p2Fields} />
        <PhaseCard title="Phase 3 — Neighbors" result={p3Result} fields={p3Fields} />
      </div>

      {/* Evaluation Section for completed tasks */}
      {task.evaluationNotes && task.evaluatedBy && (
        <div style={{
          backgroundColor: "#F8F9FA",
          border: "1px solid #E5E7EB",
          borderRadius: 12,
          padding: "20px 22px",
          marginBottom: 20
        }}>
          <div style={{
            fontSize: 14,
            fontWeight: 700,
            color: EVCORE_COLORS.textPrimary,
            marginBottom: 12,
            display: "flex",
            alignItems: "center",
            gap: 8
          }}>
            Manager Evaluation
            <div style={{
              fontSize: 11,
              fontWeight: 600,
              padding: "2px 8px",
              borderRadius: 6,
              backgroundColor: task.evaluationResult === "APPROVED" ? "#D1FAE5" : task.evaluationResult === "REJECTED" ? "#FEE2E2" : "#FEF3C7",
              color: task.evaluationResult === "APPROVED" ? "#1D9E75" : task.evaluationResult === "REJECTED" ? "#DC2626" : "#D97706"
            }}>
              {task.evaluationResult}
            </div>
          </div>
          <div style={{
            fontSize: 13,
            color: EVCORE_COLORS.textSecondary,
            marginBottom: 8,
            lineHeight: 1.5
          }}>
            <strong>{task.evaluatedBy}</strong> · {task.evaluatedAt ? fmtDate(task.evaluatedAt) : ""}
          </div>
          <div style={{
            fontSize: 14,
            color: EVCORE_COLORS.textPrimary,
            lineHeight: 1.6,
            fontStyle: "italic"
          }}>
            "{task.evaluationNotes}"
          </div>
        </div>
      )}

      {/* Footer actions — UNASSIGNED and SUBMITTED only; all others use the X button to close */}
      {task.status === "NOT_YET_ASSIGNED" && (
        <div style={{
          display: "flex",
          justifyContent: "flex-end",
          paddingTop: 20,
          borderTop: `1px solid #e5e7eb`,
          marginTop: 4
        }}>
          <button
            onClick={() => { onClose(); onAssign(); }}
            style={{
              height: 40,
              padding: "0 20px",
              borderRadius: 6,
              border: "1px solid #1d9e75",
              backgroundColor: "#1d9e75",
              fontSize: 13,
              fontWeight: 600,
              color: "white",
              cursor: "pointer",
              fontFamily: "inherit"
            }}
          >
            Assign AAROVE Agent
          </button>
        </div>
      )}
      {task.status === "SUBMITTED" && (
        <div style={{
          paddingTop: 20,
          borderTop: `1px solid #e5e7eb`,
          marginTop: 4
        }}>
          <div style={{
            fontSize: 12,
            fontWeight: 600,
            color: EVCORE_COLORS.textPrimary,
            marginBottom: 16,
            paddingBottom: 12,
            borderBottom: "1px solid #f1f5f9"
          }}>
            Manager Review Decision
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => { onClose(); onApprove(); }}
              style={{
                flex: 1,
                height: 40,
                borderRadius: 6,
                border: "1px solid #10b981",
                backgroundColor: "#10b981",
                fontSize: 13,
                fontWeight: 600,
                color: "white",
                cursor: "pointer",
                fontFamily: "inherit"
              }}
            >
              ✓ Approve
            </button>
            <button
              onClick={() => { onClose(); onReturn(); }}
              style={{
                flex: 1,
                height: 40,
                borderRadius: 6,
                border: "1px solid #f59e0b",
                backgroundColor: "white",
                fontSize: 13,
                fontWeight: 600,
                color: "#d97706",
                cursor: "pointer",
                fontFamily: "inherit"
              }}
            >
              ↩ Return
            </button>
            <button
              onClick={() => { onClose(); onReject(); }}
              style={{
                flex: 1,
                height: 40,
                borderRadius: 6,
                border: "1px solid #ef4444",
                backgroundColor: "white",
                fontSize: 13,
                fontWeight: 600,
                color: "#dc2626",
                cursor: "pointer",
                fontFamily: "inherit"
              }}
            >
              ✗ Reject
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}

// ─── Shared modal EVO info header ─────────────────────────────────────────────

function ModalEvoInfo({ task }: { task: BgcTask }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 24, paddingBottom: 20, borderBottom: `0.5px solid ${EVCORE_COLORS.border}` }}>
      <LabeledItem label="EVO" value={task.evoName} />
      <LabeledItem label="Code" value={task.evoCode} />
      <LabeledItem label="Province" value={task.province} />
    </div>
  );
}

function ModalFooter({ onClose, onConfirm, confirmLabel, disabled }: {
  onClose: () => void;
  onConfirm?: () => void;
  confirmLabel: string;
  disabled?: boolean;
}) {
  return (
    <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 24 }}>
      <Button kind={ButtonKind.Ghost} onClick={onClose}>Cancel</Button>
      <Button kind={ButtonKind.Normal} onClick={onConfirm ?? onClose} disabled={disabled}>{confirmLabel}</Button>
    </div>
  );
}

// ─── Assign Agent Modal ───────────────────────────────────────────────────────

function AssignAgentModal({ task, onClose }: { task: BgcTask | null; onClose: () => void }) {
  const [agent, setAgent] = React.useState("");
  React.useEffect(() => { if (!task) setAgent(""); }, [task]);
  if (!task) return null;
  return (
    <Modal opened title="Assign AAROVE Agent" maxWidth={440} onClose={onClose}>
      <ModalEvoInfo task={task} />
      <div style={{ marginBottom: 4 }}>
        <LabelForForm label="AAROVE Agent" />
        <select value={agent} onChange={e => setAgent(e.target.value)}
          style={{ width: "100%", height: 40, border: `1px solid ${EVCORE_COLORS.border}`, borderRadius: 7, padding: "0 12px", fontSize: 14, color: EVCORE_COLORS.textPrimary, backgroundColor: EVCORE_COLORS.white, outline: "none", cursor: "pointer", boxSizing: "border-box" }}>
          <option value="">Select agent…</option>
          {BGC_AGENTS.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
      </div>
      <ModalFooter onClose={onClose} confirmLabel="Assign" disabled={!agent} />
    </Modal>
  );
}

// ─── Approve BGC Modal ────────────────────────────────────────────────────────

function ApproveBgcModal({ task, onClose }: { task: BgcTask | null; onClose: () => void }) {
  const [notes, setNotes] = React.useState("");
  React.useEffect(() => { if (!task) setNotes(""); }, [task]);
  if (!task) return null;
  const rec = task.finalRecommendation ? REC_CHIP[task.finalRecommendation] : null;
  return (
    <Modal opened title="Approve BGC" maxWidth={440} onClose={onClose}>
      <ModalEvoInfo task={task} />
      {rec && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <LabeledItem label="System recommendation" value="" />
          <StatusChip type={rec.type}>{rec.label}</StatusChip>
        </div>
      )}
      <LabelForForm label="Evaluation notes (optional)" />
      <TextArea name="approvalNotes" value={notes} onChange={e => setNotes(e.currentTarget.value)} placeholder="Add any notes on this approval…" />
      <ModalFooter onClose={onClose} confirmLabel="Approve" />
    </Modal>
  );
}

// ─── Reject BGC Modal ─────────────────────────────────────────────────────────

function RejectBgcModal({ task, onClose }: { task: BgcTask | null; onClose: () => void }) {
  const [reason, setReason] = React.useState("");
  React.useEffect(() => { if (!task) setReason(""); }, [task]);
  if (!task) return null;
  return (
    <Modal opened title="Reject BGC" maxWidth={440} onClose={onClose}>
      <ModalEvoInfo task={task} />
      <LabelForForm label="Rejection reason *" />
      <TextArea name="rejectionReason" value={reason} onChange={e => setReason(e.currentTarget.value)} placeholder="Provide a clear reason for rejection…" />
      <ModalFooter onClose={onClose} confirmLabel="Reject" disabled={!reason.trim()} />
    </Modal>
  );
}

// ─── Return for Re-verification Modal ────────────────────────────────────────

function ReturnBgcModal({ task, onClose }: { task: BgcTask | null; onClose: () => void }) {
  const [phase, setPhase] = React.useState("");
  const [notes, setNotes] = React.useState("");
  React.useEffect(() => { if (!task) { setPhase(""); setNotes(""); } }, [task]);
  if (!task) return null;
  return (
    <Modal opened title="Return for Re-verification" maxWidth={460} onClose={onClose}>
      <ModalEvoInfo task={task} />
      <div style={{ marginBottom: 16 }}>
        <LabelForForm label="Return to phase *" />
        <select value={phase} onChange={e => setPhase(e.target.value)}
          style={{ width: "100%", height: 40, border: `1px solid ${EVCORE_COLORS.border}`, borderRadius: 7, padding: "0 12px", fontSize: 14, color: EVCORE_COLORS.textPrimary, backgroundColor: EVCORE_COLORS.white, outline: "none", cursor: "pointer", boxSizing: "border-box" }}>
          <option value="">Select phase…</option>
          <option value="1">Phase 1 — Operator Residence</option>
          <option value="2">Phase 2 — Sponsor Residence</option>
          <option value="3">Phase 3 — Neighbor Verification</option>
        </select>
      </div>
      <LabelForForm label="Notes for AAROVE *" />
      <TextArea name="returnNotes" value={notes} onChange={e => setNotes(e.currentTarget.value)} placeholder="Explain what needs to be re-verified…" />
      <ModalFooter onClose={onClose} confirmLabel="Return" disabled={!phase || !notes.trim()} />
    </Modal>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BgcPage() {
  const [view,         setView]         = React.useState<"all" | "my">("all");
  const [filterData,   setFilterData]   = React.useState<Record<string, { method: string; value: string }>>(getBgcFilterDefaults());
  const formMethods = useForm({ defaultValues: getBgcFilterDefaults() });
  const [columns,      setColumns]      = React.useState(BGC_DEFAULT_COLUMNS);
  const [filtersOpen,  setFiltersOpen]  = React.useState(false);
  const [prefsOpen,    setPrefsOpen]    = React.useState(false);
  const [page,         setPage]         = React.useState(1);

  const [viewTask,    setViewTask]    = React.useState<BgcTask | null>(null);
  const [assignTask,  setAssignTask]  = React.useState<BgcTask | null>(null);
  const [approveTask, setApproveTask] = React.useState<BgcTask | null>(null);
  const [rejectTask,  setRejectTask]  = React.useState<BgcTask | null>(null);
  const [returnTask,  setReturnTask]  = React.useState<BgcTask | null>(null);

  const unassignedCt = BGC_TASKS.filter(t => t.status === "NOT_YET_ASSIGNED").length;
  const assignedCt   = BGC_TASKS.filter(t => t.status === "ASSIGNED").length;
  const submittedCt  = BGC_TASKS.filter(t => t.status === "SUBMITTED").length;
  const approvedMtd  = BGC_TASKS.filter(t => t.status === "APPROVED" && t.completedAt?.startsWith("2026-05")).length;

  const STATUS_SORT: Record<BgcTaskStatus, number> = {
    NOT_YET_ASSIGNED: 0, SUBMITTED: 1, REJECTED: 2, RETURNED: 3, ASSIGNED: 4, APPROVED: 5,
  };

  const applyFilter = React.useCallback((value: string | null | undefined, f: { method: string; value: string }) => {
    if (!f.value) return true;
    const v = String(value ?? "").toLowerCase();
    const fv = f.value.toLowerCase();
    switch (f.method) {
      case Method.Contains:       return v.includes(fv);
      case Method.DoesNotContain: return !v.includes(fv);
      case Method.Equals:         return v === fv;
      default:                    return true;
    }
  }, []);

  const filtered = React.useMemo(() => {
    let list = BGC_TASKS;
    if (view === "my") list = list.filter(t => t.status === "NOT_YET_ASSIGNED" || t.status === "SUBMITTED");
    return list
      .filter(t =>
        applyFilter(t.evoName,            filterData.evoName           ?? { method: Method.Contains, value: "" }) &&
        applyFilter(t.evoCode,            filterData.evoCode           ?? { method: Method.Contains, value: "" }) &&
        applyFilter(t.status,             filterData.status            ?? { method: Method.Equals,   value: "" }) &&
        applyFilter(t.finalRecommendation ?? "", filterData.finalRecommendation ?? { method: Method.Equals, value: "" }) &&
        applyFilter(t.province,           filterData.province          ?? { method: Method.Equals,   value: "" }) &&
        applyFilter(t.assignedTo ?? "",   filterData.assignedTo        ?? { method: Method.Contains, value: "" })
      )
      .sort((a, b) => STATUS_SORT[a.status] - STATUS_SORT[b.status]);
  }, [view, filterData, applyFilter]);

  const activeFiltersCount = Object.values(filterData).filter(f => f.value).length;
  const onChangeFilter     = React.useCallback((values: Record<string, unknown>) => {
    setFilterData(prev => ({ ...prev, ...(values as Record<string, { method: string; value: string }>) }));
    setPage(1);
  }, []);
  const onResetAllFilters  = () => { const d = getBgcFilterDefaults(); setFilterData(d); formMethods.reset(d); setPage(1); };
  const handleColumnReset  = () => setColumns(BGC_DEFAULT_COLUMNS);

  const tableData = filtered.map(t => {
    const phase = getPhase(t);
    const phaseChip = { "1": { type: StatusChipType.Accent, label: "Phase 1" }, "2": { type: StatusChipType.Warning, label: "Phase 2" }, "3": { type: StatusChipType.Success, label: "Phase 3" }, "done": { type: StatusChipType.Success, label: "Complete" } }[phase];
    const stSt = STATUS_CHIP[t.status];
    const days = getDaysOpen(t);

    return {
      id: t.id,
      evo: (
        <div style={{ textAlign: "left" }}>
          <button onClick={() => setViewTask(t)}
            style={{ background: "none", border: "none", padding: 0, cursor: "pointer", fontSize: 13, fontWeight: 600, color: EVCORE_COLORS.textPrimary, fontFamily: "inherit", textDecoration: "underline", textDecorationColor: "transparent", textUnderlineOffset: 2 }}
            onMouseEnter={e => (e.currentTarget.style.textDecorationColor = EVCORE_COLORS.green)}
            onMouseLeave={e => (e.currentTarget.style.textDecorationColor = "transparent")}>
            {t.evoName}
          </button>
          <div style={{ fontFamily: "monospace", fontSize: 11, color: EVCORE_COLORS.green, marginTop: 1 }}>{t.evoCode}</div>
        </div>
      ),
      province: <span style={{ fontSize: 12 }}>{t.province}</span>,
      agent: t.assignedTo
        ? <span style={{ fontSize: 12 }}>{t.assignedTo}</span>
        : <span style={{ fontSize: 12, fontWeight: 600, color: EVCORE_COLORS.amber }}>Unassigned</span>,
      phase:  <StatusChip type={phaseChip.type}>{phaseChip.label}</StatusChip>,
      status: <StatusChip type={stSt.type}>{stSt.label}</StatusChip>,
      recommendation: t.finalRecommendation
        ? <StatusChip type={REC_CHIP[t.finalRecommendation].type}>{REC_CHIP[t.finalRecommendation].label}</StatusChip>
        : <span style={{ fontSize: 11, color: EVCORE_COLORS.textSecondary }}>—</span>,
      daysOpen: <DaysCell days={days} />,
      _raw: t,
    };
  });

  const colDefsMap: Record<string, string> = {
    evo: "EVO", province: "Province", agent: "Agent",
    phase: "Phase", status: "Status", recommendation: "Recommendation", daysOpen: "Days Open",
  };
  const colDefs = columns.filter(c => c.visible).map(c => ({ headerName: colDefsMap[c.key] ?? c.label, type: TableCellType.component, key: c.key }));

  const rowActions = (row: Record<string, number | string | React.ReactNode | object>) => {
    const t = row._raw as BgcTask;
    const secondSlot =
      t.status === "NOT_YET_ASSIGNED" ? (
        <RowActionBtn icon={<UserPlus size={15} />} title="Assign AAROVE agent" onClick={() => setAssignTask(t)} variant="blue" />
      ) : t.status === "SUBMITTED" ? (
        <RowActionBtn icon={<ClipboardCheck size={15} />} title="Review BGC" onClick={() => setViewTask(t)} variant="green" />
      ) : (
        <div style={{ width: 34, height: 34, flexShrink: 0 }} />
      );
    return (
      <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
        <RowActionBtn icon={<Eye size={15} />} title="View BGC details" onClick={() => setViewTask(t)} />
        {secondSlot}
      </div>
    );
  };

  return (
    <>
      <AppShell pageTitle="Underwriting">
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          <div>
            <PageHeader title="Underwriting" actions={[]} />
            <div style={{ fontSize: 12, color: EVCORE_COLORS.textSecondary, marginTop: 4 }}>
              {filtered.length} {filtered.length === 1 ? "task" : "tasks"}{activeFiltersCount > 0 ? " matching filters" : " total"}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
            <KpiCard label="Not Yet Assigned"   value={String(unassignedCt)} delta="Needs AAROVE"      deltaType="negative" icon={Clock} />
            <KpiCard label="In Progress"  value={String(assignedCt)}   delta="Active field work" deltaType="neutral"  icon={AlertCircle} />
            <KpiCard label="Submitted"    value={String(submittedCt)}  delta="Awaiting review"   deltaType="neutral"  icon={FileCheck} />
            <KpiCard label="Approved MTD" value={String(approvedMtd)}  delta="May 2026"           deltaType="positive" icon={CheckCircle2} />
          </div>

          <div style={{ display: "flex", borderBottom: `1px solid ${EVCORE_COLORS.border}` }}>
            {(["all", "my"] as const).map(v => (
              <button key={v} onClick={() => { setView(v); setPage(1); }}
                style={{ height: 38, padding: "0 20px", border: "none", borderBottom: view === v ? `2px solid ${EVCORE_COLORS.green}` : "2px solid transparent", marginBottom: -1, backgroundColor: "transparent", color: view === v ? EVCORE_COLORS.green : EVCORE_COLORS.textSecondary, fontSize: 13, fontWeight: view === v ? 700 : 500, cursor: "pointer", transition: "color 0.15s" }}>
                {v === "all" ? "All tasks" : "My tasks"}
              </button>
            ))}
          </div>

          <FiltersBar
            activeFiltersCount={activeFiltersCount}
            onClickFilter={() => setFiltersOpen(true)}
            onClickPreferences={() => setPrefsOpen(true)}
          />

          <div style={{ backgroundColor: EVCORE_COLORS.white, border: `0.5px solid ${EVCORE_COLORS.border}`, borderRadius: 12, overflow: "hidden" }}>
            <Table hasActions rowActions={rowActions} data={tableData} colDefs={colDefs}
              currentPageNumber={page} limit={10} totalData={filtered.length}
              paginationStrategy={PaginationStrategy.LOCAL} onPageChange={setPage} showCheckbox={false} />
          </div>

        </div>
      </AppShell>

      <BgcDetailModal
        task={viewTask}
        onClose={() => setViewTask(null)}
        onAssign={() => setAssignTask(viewTask)}
        onApprove={() => setApproveTask(viewTask)}
        onReject={() => setRejectTask(viewTask)}
        onReturn={() => setReturnTask(viewTask)}
      />
      <AssignAgentModal task={assignTask}  onClose={() => setAssignTask(null)} />
      <ApproveBgcModal  task={approveTask} onClose={() => setApproveTask(null)} />
      <RejectBgcModal   task={rejectTask}  onClose={() => setRejectTask(null)} />
      <ReturnBgcModal   task={returnTask}  onClose={() => setReturnTask(null)} />

      <EvoFormFiltersDrawer
        opened={filtersOpen} onClose={() => setFiltersOpen(false)}
        sections={EVO_BGC_FILTER_SECTIONS}
        formControl={formMethods}
        onChangeFilter={onChangeFilter}
        onResetAll={onResetAllFilters}
      />
      <EvoPreferencesDrawer
        opened={prefsOpen} onClose={() => setPrefsOpen(false)}
        columns={columns} onChange={(k, v) => setColumns(p => p.map(c => c.key === k ? { ...c, visible: v } : c))}
        onReset={handleColumnReset}
      />
    </>
  );
}
