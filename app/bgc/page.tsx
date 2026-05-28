"use client";

import * as React from "react";
import { Clock, CheckCircle2, AlertCircle, FileCheck, Eye, UserPlus, ClipboardCheck, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/evcore/layout/AppShell";
import { KpiCard } from "@/components/evcore/ui/KpiCard";
import { EvoFiltersDrawer } from "@/components/evcore/filters/EvoFiltersDrawer";
import { EvoPreferencesDrawer } from "@/components/evcore/filters/EvoPreferencesDrawer";
import { PageHeader } from "@/components/lamt/page-header";
import { FiltersBar } from "@/components/lamt/filters-bar";
import { Table, TableCellType, PaginationStrategy } from "@/components/lamt/table";
import { Modal } from "@/components/lamt/modal";
import { BGC_TASKS, type BgcTask, type BgcTaskStatus, type BgcRecommendation } from "@/data/dummy";
import { EVCORE_COLORS } from "@/lib/evcore/constants";
import { BGC_FILTER_SECTIONS, BGC_DEFAULT_COLUMNS } from "@/lib/evcore/filterConfigs";
import { StatusChip, StatusChipType } from "@/components/lamt/status-chip";

// ─── Constants ────────────────────────────────────────────────────────────────

const BGC_AGENTS    = ["Jean-Pierre Ndinga", "Patience Wa Mwila", "Ambroise Kabong"];

const STATUS_CHIP: Record<BgcTaskStatus, { type: StatusChipType; label: string }> = {
  UNASSIGNED: { type: StatusChipType.Normal,  label: "Unassigned" },
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

const ICON_BTN_VARIANTS = {
  default: { border: "#C8C7C1", bg: "#EEEDEA", color: "#3D3C38" },
  blue:    { border: "#93B8E8", bg: "#DCECf9", color: "#185FA5" },
  green:   { border: "#7DCDB0", bg: "#D8F3EA", color: "#0F6E56" },
} as const;

function IconBtn({ icon, title, onClick, variant = "default" }: {
  icon: React.ReactNode;
  title: string;
  onClick: () => void;
  variant?: keyof typeof ICON_BTN_VARIANTS;
}) {
  const s = ICON_BTN_VARIANTS[variant];
  return (
    <button onClick={onClick} title={title}
      style={{ width: 34, height: 34, borderRadius: 8, border: `1.5px solid ${s.border}`, backgroundColor: s.bg, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: s.color, flexShrink: 0 }}>
      {icon}
    </button>
  );
}

// ─── Phase Card (used inside BgcViewModal) ────────────────────────────────────

type PhaseResult = "pass" | "fail" | "pending";

interface PhaseField { label: string; value: string; check?: boolean }

function PhaseCard({ title, result, fields }: { title: string; result: PhaseResult; fields: PhaseField[] }) {
  const badge =
    result === "pass"    ? { label: "OK",      bg: "#E1F5EE", text: "#0F6E56" } :
    result === "fail"    ? { label: "FAIL",    bg: "#FEE2E2", text: "#991B1B" } :
                           { label: "Pending", bg: "#F3F3F1", text: "#6B7280" };
  return (
    <div style={{ backgroundColor: EVCORE_COLORS.pageBg, borderRadius: 10, padding: "14px 16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: EVCORE_COLORS.textPrimary }}>{title}</div>
        <span style={{ fontSize: 10, fontWeight: 700, color: badge.text, backgroundColor: badge.bg, borderRadius: 4, padding: "2px 7px" }}>
          {badge.label}
        </span>
      </div>
      {fields.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
          {fields.map(f => (
            <div key={f.label} style={{ fontSize: 12, color: EVCORE_COLORS.textPrimary }}>
              <span style={{ color: EVCORE_COLORS.textSecondary }}>{f.label}: </span>
              {f.check !== undefined ? (
                <span style={{ color: f.check ? "#0F6E56" : "#991B1B", fontWeight: 500 }}>
                  {f.check ? "✓ " : "✗ "}{f.value}
                </span>
              ) : (
                <span style={{ fontWeight: 600 }}>{f.value}</span>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div style={{ fontSize: 12, color: EVCORE_COLORS.textSecondary, fontStyle: "italic" }}>Not started yet</div>
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

  // Phase result helpers
  const p1Result: PhaseResult = !task.phase1Complete ? "pending" : task.phase1Details?.livesAtAddress ? "pass" : "fail";
  const p2Result: PhaseResult = !task.phase2Complete ? "pending" : task.phase2Details?.recommendsEvo  ? "pass" : "fail";
  const p3Result: PhaseResult = !task.phase3Complete ? "pending" : task.phase3Details?.reputation === "GOOD" ? "pass" : "fail";

  const p1Fields: PhaseField[] = task.phase1Details ? [
    { label: "Lives at address", value: task.phase1Details.livesAtAddress ? "Yes" : "No", check: task.phase1Details.livesAtAddress },
    { label: "Work verified",    value: task.phase1Details.workVerified    ? "Yes" : "No", check: task.phase1Details.workVerified },
    { label: "Housing status",   value: task.phase1Details.housingStatus === "OWNER" ? "Owner" : "Tenant" },
  ] : [];

  const p2Fields: PhaseField[] = task.phase2Details ? [
    { label: "Name verified",   value: task.phase2Details.nameVerified   ? "Yes" : "No", check: task.phase2Details.nameVerified },
    { label: "Recommends EVO",  value: task.phase2Details.recommendsEvo  ? "Yes" : "No", check: task.phase2Details.recommendsEvo },
    { label: "Address match",   value: task.phase2Details.addressMatch   ? "Yes" : "No", check: task.phase2Details.addressMatch },
  ] : [];

  const p3Fields: PhaseField[] = task.phase3Details ? [
    { label: "Reputation",          value: task.phase3Details.reputation },
    { label: "Neighbors consulted", value: String(task.phase3Details.neighborsConsulted) },
  ] : [];

  // Rich modal title with EVO code + recommendation chips inline
  const modalTitle = (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
      BGC Task — {task.evoName}
      <span style={{ fontFamily: "monospace", fontSize: 11, fontWeight: 700, color: EVCORE_COLORS.green, backgroundColor: "#EBF8F3", border: `0.5px solid ${EVCORE_COLORS.greenLight}`, borderRadius: 5, padding: "2px 8px" }}>
        {task.evoCode}
      </span>
      {task.finalRecommendation && (
        <StatusChip type={REC_CHIP[task.finalRecommendation].type}>{REC_CHIP[task.finalRecommendation].label}</StatusChip>
      )}
    </span>
  );

  return (
    <Modal opened title={modalTitle} maxWidth={760} icon={<ShieldCheck size={20} color={EVCORE_COLORS.green} />} onClose={onClose}>

      {/* Two info tiles */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
        <div style={{ backgroundColor: EVCORE_COLORS.pageBg, borderRadius: 10, padding: "16px 18px" }}>
          <div style={{ fontSize: 11, color: EVCORE_COLORS.textSecondary, marginBottom: 6 }}>Province</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: EVCORE_COLORS.textPrimary, marginBottom: 8 }}>{task.province}</div>
          <div style={{ fontSize: 12, color: EVCORE_COLORS.textSecondary, marginBottom: 3 }}>EMC · <span style={{ fontFamily: "monospace" }}>{task.emcCode}</span></div>
          <div style={{ fontSize: 12, color: EVCORE_COLORS.textSecondary }}>
            {task.assignedTo ? <>Assigned to · {task.assignedTo}</> : <span style={{ color: EVCORE_COLORS.amber, fontWeight: 600 }}>Not yet assigned</span>}
          </div>
        </div>
        <div style={{ backgroundColor: EVCORE_COLORS.pageBg, borderRadius: 10, padding: "16px 18px" }}>
          <div style={{ fontSize: 11, color: EVCORE_COLORS.textSecondary, marginBottom: 6 }}>Days open</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: daysColor, marginBottom: 8 }}>{days}d</div>
          <div style={{ fontSize: 12, marginBottom: 3 }}>
            <span style={{ color: EVCORE_COLORS.textSecondary }}>Task status · </span>
            <StatusChip type={stSt.type}>{stSt.label}</StatusChip>
          </div>
          <div style={{ fontSize: 12, color: EVCORE_COLORS.textSecondary }}>Registered · {fmtDate(task.createdAt)}</div>
        </div>
      </div>

      {/* Three phase cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 14 }}>
        <PhaseCard title="Phase 1 — Operator"  result={p1Result} fields={p1Fields} />
        <PhaseCard title="Phase 2 — Sponsor"   result={p2Result} fields={p2Fields} />
        <PhaseCard title="Phase 3 — Neighbors" result={p3Result} fields={p3Fields} />
      </div>

      {/* Footer actions — UNASSIGNED and SUBMITTED only; all others use the X button to close */}
      {task.status === "UNASSIGNED" && (
        <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 16, borderTop: `0.5px solid ${EVCORE_COLORS.border}` }}>
          <button onClick={() => { onClose(); onAssign(); }} style={{ height: 34, padding: "0 18px", borderRadius: 8, border: "none", backgroundColor: EVCORE_COLORS.green, fontSize: 13, fontWeight: 600, color: "#fff", cursor: "pointer" }}>Assign AAROVE Agent</button>
        </div>
      )}
      {task.status === "SUBMITTED" && (
        <div style={{ paddingTop: 16, borderTop: `0.5px solid ${EVCORE_COLORS.border}` }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: EVCORE_COLORS.textSecondary, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>Manager Review Decision</div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => { onClose(); onApprove(); }}
              style={{ flex: 1, height: 40, borderRadius: 8, border: "none", backgroundColor: EVCORE_COLORS.green, fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer" }}>
              ✓ Approve
            </button>
            <button onClick={() => { onClose(); onReturn(); }}
              style={{ flex: 1, height: 40, borderRadius: 8, border: `1.5px solid ${EVCORE_COLORS.amber}`, backgroundColor: "transparent", fontSize: 13, fontWeight: 700, color: "#854F0B", cursor: "pointer" }}>
              ↩ Return
            </button>
            <button onClick={() => { onClose(); onReject(); }}
              style={{ flex: 1, height: 40, borderRadius: 8, border: `1.5px solid ${EVCORE_COLORS.danger}`, backgroundColor: "transparent", fontSize: 13, fontWeight: 700, color: EVCORE_COLORS.danger, cursor: "pointer" }}>
              ✗ Reject
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}

// ─── Assign Agent Modal ───────────────────────────────────────────────────────

function AssignAgentModal({ task, onClose }: { task: BgcTask | null; onClose: () => void }) {
  const [agent,   setAgent]   = React.useState("");
  const [focused, setFocused] = React.useState(false);
  React.useEffect(() => { if (!task) setAgent(""); }, [task]);
  if (!task) return null;
  return (
    <Modal opened title="Assign AAROVE Agent" maxWidth={440} onClose={onClose}>
      <div style={{ padding: "12px 16px", borderRadius: 10, backgroundColor: EVCORE_COLORS.pageBg, border: `0.5px solid ${EVCORE_COLORS.border}`, marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: EVCORE_COLORS.textPrimary }}>{task.evoName}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
            <span style={{ fontFamily: "monospace", fontSize: 11, color: EVCORE_COLORS.green }}>{task.evoCode}</span>
            <span style={{ fontSize: 11, color: EVCORE_COLORS.textSecondary }}>· {task.province}</span>
          </div>
        </div>
        <StatusChip type={STATUS_CHIP.UNASSIGNED.type}>{STATUS_CHIP.UNASSIGNED.label}</StatusChip>
      </div>
      <div style={{ marginBottom: 22 }}>
        <label style={{ fontSize: 12, fontWeight: 600, color: EVCORE_COLORS.textSecondary, textTransform: "uppercase", letterSpacing: "0.04em", display: "block", marginBottom: 7 }}>Select AAROVE agent</label>
        <select value={agent} onChange={e => setAgent(e.target.value)} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{ width: "100%", height: 40, border: `1px solid ${focused ? EVCORE_COLORS.green : EVCORE_COLORS.border}`, borderRadius: 8, padding: "0 13px", fontSize: 14, color: EVCORE_COLORS.textPrimary, backgroundColor: EVCORE_COLORS.white, outline: "none", cursor: "pointer", boxSizing: "border-box", transition: "border-color 0.15s" }}>
          <option value="">Choose an agent…</option>
          {BGC_AGENTS.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button onClick={onClose} style={{ height: 40, padding: "0 20px", borderRadius: 8, border: `0.5px solid ${EVCORE_COLORS.border}`, backgroundColor: "transparent", fontSize: 13, fontWeight: 500, color: EVCORE_COLORS.textSecondary, cursor: "pointer" }}>Cancel</button>
        <button onClick={onClose} disabled={!agent}
          style={{ height: 40, padding: "0 22px", borderRadius: 8, border: "none", backgroundColor: !agent ? EVCORE_COLORS.greenLight : EVCORE_COLORS.green, fontSize: 13, fontWeight: 700, color: "#fff", cursor: !agent ? "not-allowed" : "pointer" }}>
          Assign agent
        </button>
      </div>
    </Modal>
  );
}

// ─── Approve BGC Modal ────────────────────────────────────────────────────────

function ApproveBgcModal({ task, onClose }: { task: BgcTask | null; onClose: () => void }) {
  if (!task) return null;
  const rec = task.finalRecommendation ? REC_CHIP[task.finalRecommendation] : null;
  return (
    <Modal opened title="Approve BGC" maxWidth={440} onClose={onClose}>
      <div style={{ padding: "12px 16px", borderRadius: 10, backgroundColor: EVCORE_COLORS.pageBg, border: `0.5px solid ${EVCORE_COLORS.border}`, marginBottom: 16 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: EVCORE_COLORS.textPrimary }}>{task.evoName}</div>
        <div style={{ fontSize: 12, fontFamily: "monospace", color: EVCORE_COLORS.green, marginTop: 3 }}>{task.evoCode} · {task.province}</div>
      </div>
      {rec && (
        <div style={{ marginBottom: 14, display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 12, color: EVCORE_COLORS.textSecondary }}>System recommendation:</span>
          <StatusChip type={rec.type}>{rec.label}</StatusChip>
        </div>
      )}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button onClick={onClose} style={{ height: 40, padding: "0 20px", borderRadius: 8, border: `0.5px solid ${EVCORE_COLORS.border}`, backgroundColor: "transparent", fontSize: 13, fontWeight: 500, color: EVCORE_COLORS.textSecondary, cursor: "pointer" }}>Cancel</button>
        <button onClick={onClose} style={{ height: 40, padding: "0 22px", borderRadius: 8, border: "none", backgroundColor: EVCORE_COLORS.green, fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer" }}>
          Confirm approval
        </button>
      </div>
    </Modal>
  );
}

// ─── Reject BGC Modal ─────────────────────────────────────────────────────────

function RejectBgcModal({ task, onClose }: { task: BgcTask | null; onClose: () => void }) {
  const [reason, setReason]   = React.useState("");
  const [focused, setFocused] = React.useState(false);
  React.useEffect(() => { if (!task) setReason(""); }, [task]);
  if (!task) return null;
  const ok = reason.trim().length > 0;
  return (
    <Modal opened title="Reject BGC" maxWidth={440} onClose={onClose}>
      <div style={{ padding: "12px 16px", borderRadius: 10, backgroundColor: EVCORE_COLORS.pageBg, border: `0.5px solid ${EVCORE_COLORS.border}`, marginBottom: 16 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: EVCORE_COLORS.textPrimary }}>{task.evoName}</div>
        <div style={{ fontSize: 12, fontFamily: "monospace", color: EVCORE_COLORS.green, marginTop: 3 }}>{task.evoCode} · {task.province}</div>
      </div>
      <div style={{ marginBottom: 22 }}>
        <label style={{ fontSize: 12, fontWeight: 600, color: EVCORE_COLORS.textSecondary, textTransform: "uppercase", letterSpacing: "0.04em", display: "block", marginBottom: 7 }}>
          Rejection reason <span style={{ color: EVCORE_COLORS.danger }}>*</span>
        </label>
        <textarea value={reason} onChange={e => setReason(e.target.value)} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          placeholder="Provide a clear reason for rejection…" rows={4}
          style={{ width: "100%", border: `1px solid ${focused ? EVCORE_COLORS.green : EVCORE_COLORS.border}`, borderRadius: 8, padding: "10px 13px", fontSize: 14, color: EVCORE_COLORS.textPrimary, backgroundColor: EVCORE_COLORS.white, outline: "none", resize: "none", boxSizing: "border-box", fontFamily: "inherit", lineHeight: 1.6, transition: "border-color 0.15s" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button onClick={onClose} style={{ height: 40, padding: "0 20px", borderRadius: 8, border: `0.5px solid ${EVCORE_COLORS.border}`, backgroundColor: "transparent", fontSize: 13, fontWeight: 500, color: EVCORE_COLORS.textSecondary, cursor: "pointer" }}>Cancel</button>
        <button onClick={onClose} disabled={!ok}
          style={{ height: 40, padding: "0 22px", borderRadius: 8, border: `1.5px solid ${ok ? EVCORE_COLORS.danger : EVCORE_COLORS.border}`, backgroundColor: "transparent", fontSize: 13, fontWeight: 700, color: ok ? EVCORE_COLORS.danger : EVCORE_COLORS.textSecondary, cursor: ok ? "pointer" : "not-allowed" }}>
          Confirm rejection
        </button>
      </div>
    </Modal>
  );
}

// ─── Return for Re-verification Modal ────────────────────────────────────────

function ReturnBgcModal({ task, onClose }: { task: BgcTask | null; onClose: () => void }) {
  const [phase, setPhase] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [focP, setFocP]   = React.useState(false);
  const [focN, setFocN]   = React.useState(false);
  React.useEffect(() => { if (!task) { setPhase(""); setNotes(""); } }, [task]);
  if (!task) return null;
  const ok = phase && notes.trim();
  return (
    <Modal opened title="Return for Re-verification" maxWidth={460} onClose={onClose}>
      <div style={{ padding: "12px 16px", borderRadius: 10, backgroundColor: EVCORE_COLORS.pageBg, border: `0.5px solid ${EVCORE_COLORS.border}`, marginBottom: 18 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: EVCORE_COLORS.textPrimary }}>{task.evoName}</div>
        <div style={{ fontSize: 12, fontFamily: "monospace", color: EVCORE_COLORS.green, marginTop: 3 }}>{task.evoCode} · {task.province}</div>
      </div>
      <div style={{ marginBottom: 16 }}>
        <label style={{ fontSize: 12, fontWeight: 600, color: EVCORE_COLORS.textSecondary, textTransform: "uppercase", letterSpacing: "0.04em", display: "block", marginBottom: 7 }}>Return to phase</label>
        <select value={phase} onChange={e => setPhase(e.target.value)} onFocus={() => setFocP(true)} onBlur={() => setFocP(false)}
          style={{ width: "100%", height: 40, border: `1px solid ${focP ? EVCORE_COLORS.green : EVCORE_COLORS.border}`, borderRadius: 8, padding: "0 13px", fontSize: 14, color: EVCORE_COLORS.textPrimary, backgroundColor: EVCORE_COLORS.white, outline: "none", cursor: "pointer", boxSizing: "border-box", transition: "border-color 0.15s" }}>
          <option value="">Select phase to re-verify…</option>
          <option value="1">Phase 1 — Operator Residence</option>
          <option value="2">Phase 2 — Sponsor Residence</option>
          <option value="3">Phase 3 — Neighbor Verification</option>
        </select>
      </div>
      <div style={{ marginBottom: 22 }}>
        <label style={{ fontSize: 12, fontWeight: 600, color: EVCORE_COLORS.textSecondary, textTransform: "uppercase", letterSpacing: "0.04em", display: "block", marginBottom: 7 }}>
          Notes for AAROVE <span style={{ color: EVCORE_COLORS.danger }}>*</span>
        </label>
        <textarea value={notes} onChange={e => setNotes(e.target.value)} onFocus={() => setFocN(true)} onBlur={() => setFocN(false)}
          placeholder="Explain what needs to be re-verified…" rows={4}
          style={{ width: "100%", border: `1px solid ${focN ? EVCORE_COLORS.green : EVCORE_COLORS.border}`, borderRadius: 8, padding: "10px 13px", fontSize: 14, color: EVCORE_COLORS.textPrimary, backgroundColor: EVCORE_COLORS.white, outline: "none", resize: "none", boxSizing: "border-box", fontFamily: "inherit", lineHeight: 1.6, transition: "border-color 0.15s" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button onClick={onClose} style={{ height: 40, padding: "0 20px", borderRadius: 8, border: `0.5px solid ${EVCORE_COLORS.border}`, backgroundColor: "transparent", fontSize: 13, fontWeight: 500, color: EVCORE_COLORS.textSecondary, cursor: "pointer" }}>Cancel</button>
        <button onClick={onClose} disabled={!ok}
          style={{ height: 40, padding: "0 22px", borderRadius: 8, border: "none", backgroundColor: ok ? EVCORE_COLORS.amber : EVCORE_COLORS.border, fontSize: 13, fontWeight: 700, color: ok ? "#fff" : EVCORE_COLORS.textSecondary, cursor: ok ? "pointer" : "not-allowed" }}>
          Return for re-verification
        </button>
      </div>
    </Modal>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BgcPage() {
  const [view,         setView]         = React.useState<"all" | "my">("all");
  const [filterValues, setFilterValues] = React.useState<Record<string, string[]>>({});
  const [columns,      setColumns]      = React.useState(BGC_DEFAULT_COLUMNS);
  const [filtersOpen,  setFiltersOpen]  = React.useState(false);
  const [prefsOpen,    setPrefsOpen]    = React.useState(false);
  const [page,         setPage]         = React.useState(1);

  const [viewTask,    setViewTask]    = React.useState<BgcTask | null>(null);
  const [assignTask,  setAssignTask]  = React.useState<BgcTask | null>(null);
  const [approveTask, setApproveTask] = React.useState<BgcTask | null>(null);
  const [rejectTask,  setRejectTask]  = React.useState<BgcTask | null>(null);
  const [returnTask,  setReturnTask]  = React.useState<BgcTask | null>(null);

  const totalCt      = BGC_TASKS.length;
  const unassignedCt = BGC_TASKS.filter(t => t.status === "UNASSIGNED").length;
  const assignedCt   = BGC_TASKS.filter(t => t.status === "ASSIGNED").length;
  const submittedCt  = BGC_TASKS.filter(t => t.status === "SUBMITTED").length;
  const approvedCt   = BGC_TASKS.filter(t => t.status === "APPROVED").length;
  const rejectedCt   = BGC_TASKS.filter(t => t.status === "REJECTED").length;
  const approvedMtd  = BGC_TASKS.filter(t => t.status === "APPROVED" && t.completedAt?.startsWith("2026-05")).length;

  const STATUS_SORT: Record<BgcTaskStatus, number> = {
    UNASSIGNED: 0, SUBMITTED: 1, REJECTED: 2, RETURNED: 3, ASSIGNED: 4, APPROVED: 5,
  };

  const filtered = React.useMemo(() => {
    const statuses   = filterValues.status   ?? [];
    const provinces  = filterValues.province ?? [];
    const agents     = filterValues.agent    ?? [];
    let list = BGC_TASKS;
    if (view === "my") list = list.filter(t => t.status === "UNASSIGNED" || t.status === "SUBMITTED");
    return list
      .filter(t =>
        (!statuses.length  || statuses.includes(t.status as string)) &&
        (!provinces.length || provinces.includes(t.province)) &&
        (!agents.length    || agents.includes(t.assignedTo ?? ""))
      )
      .sort((a, b) => STATUS_SORT[a.status] - STATUS_SORT[b.status]);
  }, [view, filterValues]);

  const activeFiltersCount = Object.values(filterValues).reduce((a, v) => a + v.length, 0);
  const handleFilterChange = (id: string, selected: string[]) => { setFilterValues(p => ({ ...p, [id]: selected })); setPage(1); };
  const handleFilterReset  = () => { setFilterValues({}); setPage(1); };
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
      t.status === "UNASSIGNED" ? (
        <IconBtn icon={<UserPlus size={15} />} title="Assign AAROVE agent" onClick={() => setAssignTask(t)} variant="blue" />
      ) : t.status === "SUBMITTED" ? (
        <IconBtn icon={<ClipboardCheck size={15} />} title="Review BGC" onClick={() => setViewTask(t)} variant="green" />
      ) : (
        <div style={{ width: 34, height: 34, flexShrink: 0 }} />
      );
    return (
      <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
        <IconBtn icon={<Eye size={15} />} title="View BGC details" onClick={() => setViewTask(t)} />
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
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
              {[
                { count: totalCt,      label: "Total",      bg: "#F3F3F1", text: "#6B7280" },
                { count: unassignedCt, label: "Unassigned", bg: "#FAEEDA", text: "#854F0B" },
                { count: assignedCt,   label: "Assigned",   bg: "#E6F1FB", text: "#185FA5" },
                { count: submittedCt,  label: "Submitted",  bg: "#F0EAFB", text: "#5B21B6" },
                { count: approvedCt,   label: "Approved",   bg: "#E1F5EE", text: "#0F6E56" },
                { count: rejectedCt,   label: "Rejected",   bg: "#FEE2E2", text: "#991B1B" },
              ].map(s => (
                <span key={s.label} style={{ display: "inline-flex", alignItems: "center", gap: 6, height: 28, padding: "0 12px", borderRadius: 99, backgroundColor: s.bg, color: s.text, fontSize: 12, fontWeight: 600, whiteSpace: "nowrap" }}>
                  <strong style={{ fontSize: 15, fontWeight: 800 }}>{s.count}</strong>{s.label}
                </span>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
            <KpiCard label="Unassigned"   value={String(unassignedCt)} delta="Needs AAROVE"      deltaType="negative" icon={Clock} />
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

      <BgcViewModal
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

      <EvoFiltersDrawer
        opened={filtersOpen} onClose={() => setFiltersOpen(false)}
        sections={BGC_FILTER_SECTIONS} values={filterValues}
        onChange={handleFilterChange} onReset={handleFilterReset}
      />
      <EvoPreferencesDrawer
        opened={prefsOpen} onClose={() => setPrefsOpen(false)}
        columns={columns} onChange={(k, v) => setColumns(p => p.map(c => c.key === k ? { ...c, visible: v } : c))}
        onReset={handleColumnReset}
      />
    </>
  );
}
