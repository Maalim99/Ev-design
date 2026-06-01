"use client";

import * as React from "react";
import { X, AlertTriangle } from "lucide-react";
import { EvoStatusChip } from "./EvoStatusChip";
import {
  EVCORE_COLORS,
  EVO_STATUS_LABELS,
  EVO_STATUS_STYLES,
  EVO_STATUS_TRANSITIONS,
} from "@/lib/evcore/constants";
import type { EvoAccount, EvoStatus, BgcDecision, OspStatus } from "@/data/dummy";

// ─── Contextual action config per status ────────────────────────────────────

const ACTION_CONFIG: Record<EvoStatus, { label: string; color: string; hoverColor: string } | null> = {
  PENDING_BGC:      { label: "Submit for BGC",        color: EVCORE_COLORS.green, hoverColor: "#179060" },
  PENDING_OSP: { label: "Schedule Training",     color: EVCORE_COLORS.amber, hoverColor: "#d4891f" },
  PENDING_RP:  { label: "Record Payment",        color: EVCORE_COLORS.green, hoverColor: "#179060" },
  PARTIAL_RP:   { label: "Complete Payment",      color: EVCORE_COLORS.green, hoverColor: "#179060" },
  PENDING_HO: { label: "Proceed to Handover",   color: EVCORE_COLORS.green, hoverColor: "#179060" },
  ACTIVE:            { label: "Suspend Account",       color: EVCORE_COLORS.amber, hoverColor: "#d4891f" },
  INACTIVE:          { label: "Reactivate",            color: EVCORE_COLORS.green, hoverColor: "#179060" },
  DISENGAGED:        { label: "Request Re-evaluation", color: EVCORE_COLORS.blue,  hoverColor: "#2c70b8" },
};

const BGC_DECISION_STYLE: Record<BgcDecision, { label: string; color: string; bg: string }> = {
  NOT_ASSESSED:  { label: "Not Assessed",  color: EVCORE_COLORS.textSecondary, bg: "#F3F3F1" },
  RECOMMENDED:   { label: "Recommended",   color: "#0F6E56",                   bg: "#E1F5EE" },
  REJECTED:      { label: "Rejected",      color: "#991B1B",                   bg: "#FEE2E2" },
  MANUAL_REVIEW: { label: "Manual Review", color: "#854F0B",                   bg: "#FAEEDA" },
};

const OSP_STATUS_LABEL: Record<OspStatus, string> = {
  NOT_STARTED: "Not Started",
  IN_PROGRESS: "In Progress",
  PASSED:      "Passed",
  FAILED:      "Failed",
};

// ─── Field row ───────────────────────────────────────────────────────────────

function DetailRow({ label, value, mono }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "10px 0", borderBottom: `0.5px solid ${EVCORE_COLORS.border}` }}>
      <span style={{ fontSize: 12, fontWeight: 600, color: EVCORE_COLORS.textSecondary, textTransform: "uppercase", letterSpacing: "0.05em", flexShrink: 0, marginRight: 16 }}>
        {label}
      </span>
      <span style={{ fontSize: 14, color: EVCORE_COLORS.textPrimary, textAlign: "right", fontFamily: mono ? "monospace" : "inherit", fontWeight: 500 }}>
        {value}
      </span>
    </div>
  );
}

// ─── Delete confirmation (exported so the table can trigger it directly) ─────

export function DeleteConfirmModal({ evo, onConfirm, onCancel }: { evo: EvoAccount; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div
      onClick={onCancel}
      style={{ position: "fixed", inset: 0, zIndex: 60, backgroundColor: "rgba(17,23,30,0.55)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ backgroundColor: EVCORE_COLORS.white, borderRadius: 14, width: "100%", maxWidth: 460, border: `0.5px solid ${EVCORE_COLORS.border}` }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 22px", borderBottom: `0.5px solid ${EVCORE_COLORS.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 9, backgroundColor: "#FEE2E2", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <AlertTriangle size={18} color="#991B1B" strokeWidth={1.75} />
            </div>
            <span style={{ fontSize: 16, fontWeight: 700, color: EVCORE_COLORS.textPrimary }}>Delete EVO Account</span>
          </div>
          <button onClick={onCancel} style={{ width: 30, height: 30, borderRadius: 7, border: `0.5px solid ${EVCORE_COLORS.border}`, backgroundColor: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <X size={14} color={EVCORE_COLORS.textSecondary} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "22px" }}>
          <p style={{ fontSize: 14, color: EVCORE_COLORS.textPrimary, marginBottom: 10, lineHeight: 1.65 }}>
            Are you sure you want to delete the EVO account for{" "}
            <strong>{evo.fullName}</strong>{" "}
            (<span style={{ fontFamily: "monospace" }}>{evo.evoCode}</span>)?
          </p>
          <p style={{ fontSize: 13, color: EVCORE_COLORS.textSecondary, lineHeight: 1.65 }}>
            This action is permanent and cannot be undone. All associated BGC records, OSP records, asset history and payment history will be removed.
          </p>
        </div>

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, padding: "16px 22px", borderTop: `0.5px solid ${EVCORE_COLORS.border}` }}>
          <button onClick={onCancel} style={{ height: 38, padding: "0 20px", borderRadius: 8, border: `0.5px solid ${EVCORE_COLORS.border}`, backgroundColor: "transparent", fontSize: 13, fontWeight: 500, color: EVCORE_COLORS.textSecondary, cursor: "pointer" }}>
            Cancel
          </button>
          <button onClick={onConfirm} style={{ height: 38, padding: "0 20px", borderRadius: 8, border: "none", backgroundColor: "#DC2626", fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer" }}>
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main EvoDetailModal ──────────────────────────────────────────────────────

interface EvoDetailModalProps {
  evo: EvoAccount | null;
  onClose: () => void;
}

export function EvoDetailModal({ evo, onClose }: EvoDetailModalProps) {
  const [actionHover, setActionHover] = React.useState(false);

  if (!evo) return null;

  const action = ACTION_CONFIG[evo.status];
  const bgcStyle = BGC_DECISION_STYLE[evo.bgcDecision];

  const ospLine = () => {
    if (evo.ospStatus === "NOT_STARTED") return "—";
    if (evo.ospStatus === "IN_PROGRESS") {
      const parts = [];
      if (evo.ospWrittenScore !== null) parts.push(`Written: ${evo.ospWrittenScore}/100`);
      if (evo.ospOnroadScore !== null)  parts.push(`On-road: ${evo.ospOnroadScore}/100`);
      return parts.length ? parts.join("  ·  ") + "  (in progress)" : "In Progress";
    }
    if (evo.ospStatus === "PASSED") {
      return `Written: ${evo.ospWrittenScore}/100  ·  On-road: ${evo.ospOnroadScore}/100  ·  Passed ✓`;
    }
    return `Written: ${evo.ospWrittenScore}/100  ·  On-road: ${evo.ospOnroadScore}/100  ·  Failed ✗`;
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{ position: "fixed", inset: 0, zIndex: 50, backgroundColor: "rgba(17,23,30,0.5)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
      >
        <div
          onClick={e => e.stopPropagation()}
          style={{
            backgroundColor: EVCORE_COLORS.white,
            borderRadius: 16,
            width: "100%",
            maxWidth: 580,
            border: `0.5px solid ${EVCORE_COLORS.border}`,
            display: "flex",
            flexDirection: "column",
            maxHeight: "92vh",
            overflowY: "auto",
          }}
        >
          {/* Modal header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px", borderBottom: `0.5px solid ${EVCORE_COLORS.border}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontFamily: "monospace", fontSize: 13, fontWeight: 700, color: EVCORE_COLORS.green, backgroundColor: "#D6F5E8", border: `1px solid ${EVCORE_COLORS.greenLight}`, borderRadius: 6, padding: "3px 10px", letterSpacing: "0.02em" }}>
                {evo.evoCode}
              </span>
              <span style={{ fontSize: 15, fontWeight: 700, color: EVCORE_COLORS.textPrimary }}>Account Details</span>
            </div>
            <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: 7, border: `0.5px solid ${EVCORE_COLORS.border}`, backgroundColor: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <X size={14} color={EVCORE_COLORS.textSecondary} />
            </button>
          </div>

          {/* Name + status */}
          <div style={{ padding: "20px 24px 16px", borderBottom: `0.5px solid ${EVCORE_COLORS.border}`, display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
            <div>
              <div style={{ fontSize: 22, fontWeight: 700, color: EVCORE_COLORS.textPrimary, lineHeight: 1.2 }}>{evo.fullName}</div>
              <div style={{ fontSize: 12, color: EVCORE_COLORS.textSecondary, marginTop: 5 }}>{evo.emcName} · Assigned to {evo.assignedAarove}</div>
            </div>
            <EvoStatusChip status={evo.status} />
          </div>

          {/* Detail fields */}
          <div style={{ padding: "6px 24px 10px" }}>
            <DetailRow label="EVO Code"         value={evo.evoCode} mono />
            <DetailRow label="Phone"            value={evo.phoneNumbers.join(" · ")} mono />
            <DetailRow label="EMC"              value={`${evo.emcCode} — ${evo.emcName}`} mono />
            <DetailRow label="EV Product"       value={evo.evProductCode} mono />
            {evo.rentalPlan && (() => {
              const m = evo.rentalPlan.match(/SF(\d+)\.RF(\d+)\.RP(\d+)/);
              if (!m) return null;
              return (
                <div style={{ padding: "10px 0", borderBottom: `0.5px solid ${EVCORE_COLORS.border}` }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: EVCORE_COLORS.textSecondary, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Rental Plan</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                    {[
                      { label: "Joining Fee",  value: `$${m[1]}.00`,    sub: "one-time" },
                      { label: "Daily Rental", value: `$${m[2]}.00`,    sub: "per day" },
                      { label: "Duration",     value: `${m[3]} months`, sub: "rental period" },
                    ].map(s => (
                      <div key={s.label} style={{ backgroundColor: EVCORE_COLORS.pageBg, border: `0.5px solid ${EVCORE_COLORS.border}`, borderRadius: 8, padding: "10px 12px" }}>
                        <div style={{ fontSize: 11, color: EVCORE_COLORS.textSecondary, marginBottom: 3 }}>{s.label}</div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: EVCORE_COLORS.textPrimary }}>{s.value}</div>
                        <div style={{ fontSize: 10, color: EVCORE_COLORS.textSecondary, marginTop: 1 }}>{s.sub}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
            <DetailRow
              label="Rental Balance"
              value={
                <span style={{ fontWeight: 700, color: evo.balance > 0 ? EVCORE_COLORS.green : EVCORE_COLORS.textSecondary, fontFamily: "monospace" }}>
                  {evo.balance > 0 ? `$${evo.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}` : "$0.00"}
                </span>
              }
            />
            <DetailRow
              label="BGC Decision"
              value={
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6, height: 24, padding: "0 10px", borderRadius: 99, backgroundColor: bgcStyle.bg, color: bgcStyle.color, fontSize: 12, fontWeight: 700 }}>
                  {bgcStyle.label}
                </span>
              }
            />
            <DetailRow
              label="OSP Training"
              value={
                <span style={{ fontSize: 13, color: evo.ospStatus === "PASSED" ? "#0F6E56" : evo.ospStatus === "FAILED" ? "#991B1B" : EVCORE_COLORS.textSecondary }}>
                  {ospLine()}
                </span>
              }
            />
            <DetailRow
              label="Last Payment"
              value={
                evo.lastPaymentDate
                  ? new Date(evo.lastPaymentDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
                  : <span style={{ color: EVCORE_COLORS.textSecondary, fontStyle: "italic", fontSize: 13 }}>Not yet active</span>
              }
            />
          </div>

          {/* Footer */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 10, padding: "16px 24px", borderTop: `0.5px solid ${EVCORE_COLORS.border}` }}>
            <button onClick={onClose} style={{ height: 36, padding: "0 18px", borderRadius: 8, border: `0.5px solid ${EVCORE_COLORS.border}`, backgroundColor: "transparent", fontSize: 13, fontWeight: 500, color: EVCORE_COLORS.textSecondary, cursor: "pointer" }}>
              Close
            </button>
            {action && (
              <button
                onMouseEnter={() => setActionHover(true)}
                onMouseLeave={() => setActionHover(false)}
                style={{ height: 36, padding: "0 20px", borderRadius: 8, border: "none", backgroundColor: actionHover ? action.hoverColor : action.color, fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer", transition: "background-color 0.15s" }}
              >
                {action.label}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
