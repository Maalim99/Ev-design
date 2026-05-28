"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { Eye, RefreshCw, Trash2, Download } from "lucide-react";
import { Users, ClipboardCheck, CheckCircle2, CalendarPlus } from "lucide-react";

import { AppShell } from "@/components/evcore/layout/AppShell";
import { KpiCard } from "@/components/evcore/ui/KpiCard";
import { EvoStatusChip } from "@/components/evcore/ui/EvoStatusChip";
import { EvoDetailModal, DeleteConfirmModal } from "@/components/evcore/ui/EvoDetailModal";
import { RegisterEvoModal } from "@/components/evcore/modals/RegisterEvoModal";
import { EvoFormFiltersDrawer } from "@/components/evcore/filters/EvoFormFiltersDrawer";
import { EvoPreferencesDrawer, type ColumnPref } from "@/components/evcore/filters/EvoPreferencesDrawer";
import { PageHeader } from "@/components/lamt/page-header";
import { FiltersBar } from "@/components/lamt/filters-bar";
import { FilterMethod } from "@/components/lamt/filter-method";
import { Modal } from "@/components/lamt/modal";
import { Button, ButtonKind, ButtonSize } from "@/components/lamt/button";
import { Table, TableCellType, PaginationStrategy } from "@/components/lamt/table";
import { StatusChip, StatusChipType } from "@/components/lamt/status-chip";
import { FilterType, Method } from "@/lib/filter-utils";

import {
  EVO_ACCOUNTS, FLEET_ASSETS, PAYMENT_RECORDS,
  type EvoAccount, type EvoStatus,
} from "@/data/dummy";
import {
  EVCORE_COLORS, EVO_STATUS_LABELS, EVO_STATUS_TRANSITIONS,
} from "@/lib/evcore/constants";
import {
  EVO_ACCOUNT_FILTER_SECTIONS,
  getEvoFilterDefaults,
} from "@/lib/evcore/evoAccountFilterSections";
import { ACCOUNTS_DEFAULT_COLUMNS } from "@/lib/evcore/filterConfigs";

// ─── EVO status → lamt StatusChip mapping ────────────────────────────────────

const EVO_STATUS_CHIP: Record<string, { type: StatusChipType; label: string }> = {
  ACTIVE:            { type: StatusChipType.Success, label: "Active"            },
  AWAITING_BGC:      { type: StatusChipType.Warning, label: "Awaiting BGC"      },
  AWAITING_TRAINING: { type: StatusChipType.Accent,  label: "Awaiting Training" },
  AWAITING_PAYMENT:  { type: StatusChipType.Info,    label: "Awaiting Payment"  },
  PARTIAL_PAYMENT:   { type: StatusChipType.AccentM, label: "Partial Payment"   },
  AWAITING_HANDOVER: { type: StatusChipType.AccentM, label: "Awaiting Handover" },
  INACTIVE:          { type: StatusChipType.Normal,  label: "Inactive"          },
  DISENGAGED:        { type: StatusChipType.Danger,  label: "Disengaged"        },
};

// ─── Static lookup maps ───────────────────────────────────────────────────────

const ASSET_KEY_BY_EVO: Record<string, string> = {};
FLEET_ASSETS.forEach(a => { if (a.assignedEvoCode) ASSET_KEY_BY_EVO[a.assignedEvoCode] = a.assetKey; });

const PAYMENT_REF_BY_EVO: Record<string, string> = {};
PAYMENT_RECORDS.forEach(p => { PAYMENT_REF_BY_EVO[p.evoCode] = p.paymentReference; });

// ─── Filter logic ─────────────────────────────────────────────────────────────

function applyFilterMethod(
  fieldValue: string | number | null | undefined,
  method: string,
  filterValue: string,
): boolean {
  if (!filterValue) return true;
  const fv   = String(fieldValue ?? "").toLowerCase();
  const fval = filterValue.toLowerCase();
  switch (method) {
    case Method.Contains:         return fv.includes(fval);
    case Method.DoesNotContain:   return !fv.includes(fval);
    case Method.Equals:           return fv === fval;
    case Method.GreaterThan:      return fv >= fval;
    case Method.LessThan:         return fv <= fval;
    case Method.GreaterOrEqualThan: return fv >= fval;
    case Method.LessOrEqualThan:  return fv <= fval;
    default:                      return true;
  }
}

// ─── Row action button ────────────────────────────────────────────────────────

function ActionBtn({ icon, label, onClick, color }: { icon: React.ReactNode; label: string; onClick: () => void; color?: string }) {
  return (
    <button onClick={onClick} title={label}
      style={{ display: "inline-flex", alignItems: "center", gap: 4, height: 26, padding: "0 9px", borderRadius: 6, border: `0.5px solid ${EVCORE_COLORS.border}`, backgroundColor: "transparent", fontSize: 11, fontWeight: 500, color: color ?? EVCORE_COLORS.textSecondary, cursor: "pointer", whiteSpace: "nowrap" }}>
      {icon}{label}
    </button>
  );
}

// ─── Shortcut filter popover button ──────────────────────────────────────────

function ShortcutFilterButton({ label, isActive, children }: { label: string; isActive: boolean; children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      <Button
        kind={ButtonKind.Ghost}
        size={ButtonSize.Small}
        dashed={true}
        badgeColor="success"
        badgeSize="xs"
        badge={isActive ? " " : undefined}
        onClick={() => setOpen(p => !p)}
      >
        {label}
      </Button>
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 6px)", left: 0, zIndex: 200,
          backgroundColor: "#fff", border: `0.5px solid ${EVCORE_COLORS.border}`,
          borderRadius: 10, padding: "20px 0 12px", boxShadow: "0 5px 30px rgba(0,0,0,0.1)", minWidth: 280,
        }}>
          {children}
        </div>
      )}
    </div>
  );
}

// ─── Change Status Modal ──────────────────────────────────────────────────────

function ChangeStatusModal({ evo, onClose }: { evo: EvoAccount | null; onClose: () => void }) {
  const [nextStatus, setNextStatus] = React.useState<EvoStatus | "">("");
  const [reason, setReason] = React.useState("");
  const [focused, setFocused] = React.useState(false);
  if (!evo) return null;
  const allowed = EVO_STATUS_TRANSITIONS[evo.status];

  return (
    <Modal opened title="Change EVO Status" maxWidth={500} onClose={onClose}>
      <div style={{ padding: "12px 16px", borderRadius: 10, backgroundColor: EVCORE_COLORS.pageBg, marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: EVCORE_COLORS.textPrimary }}>{evo.fullName}</div>
          <div style={{ fontSize: 12, fontFamily: "monospace", color: EVCORE_COLORS.textSecondary, marginTop: 3 }}>{evo.evoCode}</div>
        </div>
        <EvoStatusChip status={evo.status} />
      </div>
      <div style={{ marginBottom: 18 }}>
        <label style={{ fontSize: 12, fontWeight: 600, color: EVCORE_COLORS.textSecondary, textTransform: "uppercase", letterSpacing: "0.04em", display: "block", marginBottom: 7 }}>New status</label>
        <select value={nextStatus} onChange={e => setNextStatus(e.target.value as EvoStatus)}
          style={{ width: "100%", height: 40, border: `0.5px solid ${EVCORE_COLORS.border}`, borderRadius: 8, padding: "0 13px", fontSize: 14, color: EVCORE_COLORS.textPrimary, backgroundColor: EVCORE_COLORS.white, outline: "none", cursor: "pointer", boxSizing: "border-box" }}>
          <option value="">Select new status…</option>
          {allowed.map(s => <option key={s} value={s}>{EVO_STATUS_LABELS[s]}</option>)}
        </select>
        {nextStatus && (
          <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 12, color: EVCORE_COLORS.textSecondary }}>Will become:</span>
            <EvoStatusChip status={nextStatus as EvoStatus} size="sm" />
          </div>
        )}
      </div>
      <div style={{ marginBottom: 24 }}>
        <label style={{ fontSize: 12, fontWeight: 600, color: EVCORE_COLORS.textSecondary, textTransform: "uppercase", letterSpacing: "0.04em", display: "block", marginBottom: 7 }}>
          Reason <span style={{ color: EVCORE_COLORS.danger }}>*</span>
        </label>
        <textarea value={reason} onChange={e => setReason(e.target.value)} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          placeholder="Provide a reason for this status change…" rows={4}
          style={{ width: "100%", border: `0.5px solid ${focused ? EVCORE_COLORS.green : EVCORE_COLORS.border}`, borderRadius: 8, padding: "10px 13px", fontSize: 14, color: EVCORE_COLORS.textPrimary, backgroundColor: EVCORE_COLORS.white, outline: "none", resize: "none", boxSizing: "border-box", fontFamily: "inherit", lineHeight: 1.6 }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button onClick={onClose} style={{ height: 40, padding: "0 20px", borderRadius: 8, border: `0.5px solid ${EVCORE_COLORS.border}`, backgroundColor: "transparent", fontSize: 13, fontWeight: 500, color: EVCORE_COLORS.textSecondary, cursor: "pointer" }}>Cancel</button>
        <button onClick={onClose} disabled={!nextStatus || !reason.trim()}
          style={{ height: 40, padding: "0 22px", borderRadius: 8, border: "none", backgroundColor: !nextStatus || !reason.trim() ? EVCORE_COLORS.greenLight : EVCORE_COLORS.green, fontSize: 13, fontWeight: 700, color: "#fff", cursor: !nextStatus || !reason.trim() ? "not-allowed" : "pointer" }}>
          Confirm change
        </button>
      </div>
    </Modal>
  );
}

// ─── Assign Asset Modal (row-level) ───────────────────────────────────────────

function AssignAssetModal({ evo, onClose }: { evo: EvoAccount | null; onClose: () => void }) {
  const [assetId, setAssetId] = React.useState("");
  if (!evo) return null;
  const eligible = evo.status === "AWAITING_HANDOVER" || evo.status === "ACTIVE";
  const available = FLEET_ASSETS.filter(a => a.emcName === evo.emcName && a.status === "OFF_ROAD_IDLE");

  return (
    <Modal opened title="Assign Asset to EVO" maxWidth={500} onClose={onClose}>
      <div style={{ padding: "12px 16px", borderRadius: 10, backgroundColor: EVCORE_COLORS.pageBg, marginBottom: 18, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: EVCORE_COLORS.textPrimary }}>{evo.fullName}</div>
          <div style={{ fontSize: 12, color: EVCORE_COLORS.textSecondary, marginTop: 3 }}>
            <span style={{ fontFamily: "monospace", color: EVCORE_COLORS.green }}>{evo.evoCode}</span>
            <span style={{ margin: "0 6px", color: EVCORE_COLORS.border }}>·</span>
            {evo.emcName}
          </div>
        </div>
        <EvoStatusChip status={evo.status} size="sm" />
      </div>
      <div style={{ borderRadius: 8, padding: "12px 14px", marginBottom: 18, backgroundColor: eligible ? "#EBF8F3" : "#FEF9EE", border: `0.5px solid ${eligible ? EVCORE_COLORS.greenLight : EVCORE_COLORS.amber}`, fontSize: 13, color: eligible ? "#0F6E56" : "#854F0B", display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 16, flexShrink: 0 }}>{eligible ? "✓" : "⚠"}</span>
        {eligible ? "EVO is eligible for asset assignment." : `EVO must be in Awaiting Handover or Active. Current: ${EVO_STATUS_LABELS[evo.status]}`}
      </div>
      {eligible && <>
        <div style={{ marginBottom: 18 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: EVCORE_COLORS.textSecondary, textTransform: "uppercase", letterSpacing: "0.04em", display: "block", marginBottom: 7 }}>Available assets — {evo.emcName}</label>
          {available.length === 0
            ? <div style={{ fontSize: 14, color: EVCORE_COLORS.textSecondary }}>No available assets in this EMC zone.</div>
            : <select value={assetId} onChange={e => setAssetId(e.target.value)}
                style={{ width: "100%", height: 40, border: `0.5px solid ${EVCORE_COLORS.border}`, borderRadius: 8, padding: "0 13px", fontSize: 14, color: EVCORE_COLORS.textPrimary, backgroundColor: EVCORE_COLORS.white, outline: "none", cursor: "pointer", boxSizing: "border-box", fontFamily: "monospace" }}>
                <option value="">Select asset…</option>
                {available.map(a => <option key={a.id} value={a.id}>{a.assetCode} — {a.assetKey}</option>)}
              </select>}
        </div>
        <div style={{ borderRadius: 8, padding: "12px 14px", marginBottom: 22, backgroundColor: EVCORE_COLORS.pageBg, border: `0.5px solid ${EVCORE_COLORS.border}`, fontSize: 13, color: EVCORE_COLORS.textSecondary, lineHeight: 1.65 }}>
          After assignment, complete the full <strong style={{ color: EVCORE_COLORS.textPrimary }}>VCU handover checklist</strong> (1 EV frame + 2 batteries) before the asset is considered live.
        </div>
      </>}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button onClick={onClose} style={{ height: 40, padding: "0 20px", borderRadius: 8, border: `0.5px solid ${EVCORE_COLORS.border}`, backgroundColor: "transparent", fontSize: 13, fontWeight: 500, color: EVCORE_COLORS.textSecondary, cursor: "pointer" }}>Cancel</button>
        {eligible && (
          <button onClick={onClose} disabled={!assetId || available.length === 0}
            style={{ height: 40, padding: "0 22px", borderRadius: 8, border: "none", backgroundColor: (!assetId || available.length === 0) ? EVCORE_COLORS.greenLight : EVCORE_COLORS.green, fontSize: 13, fontWeight: 700, color: "#fff", cursor: (!assetId || available.length === 0) ? "not-allowed" : "pointer" }}>
            Assign asset
          </button>
        )}
      </div>
    </Modal>
  );
}

// ─── Global Asset Assign Modal (header button) ────────────────────────────────

function GlobalAssignModal({ opened, onClose }: { opened: boolean; onClose: () => void }) {
  const [selectedEvoId, setSelectedEvoId] = React.useState("");
  const [assetId,       setAssetId]       = React.useState("");
  if (!opened) return null;

  const selectedEvo = EVO_ACCOUNTS.find(e => e.id === selectedEvoId) ?? null;
  const eligible    = selectedEvo && (selectedEvo.status === "AWAITING_HANDOVER" || selectedEvo.status === "ACTIVE");
  const available   = selectedEvo ? FLEET_ASSETS.filter(a => a.emcName === selectedEvo.emcName && a.status === "OFF_ROAD_IDLE") : [];

  return (
    <Modal opened title="Asset Assign" maxWidth={520} onClose={onClose}>
      <div style={{ marginBottom: 18 }}>
        <label style={{ fontSize: 12, fontWeight: 600, color: EVCORE_COLORS.textSecondary, textTransform: "uppercase", letterSpacing: "0.04em", display: "block", marginBottom: 7 }}>Select EVO</label>
        <select value={selectedEvoId} onChange={e => { setSelectedEvoId(e.target.value); setAssetId(""); }}
          style={{ width: "100%", height: 40, border: `0.5px solid ${EVCORE_COLORS.border}`, borderRadius: 8, padding: "0 13px", fontSize: 13, color: EVCORE_COLORS.textPrimary, backgroundColor: EVCORE_COLORS.white, outline: "none", cursor: "pointer", boxSizing: "border-box" }}>
          <option value="">Select an EVO…</option>
          {EVO_ACCOUNTS.map(e => (
            <option key={e.id} value={e.id}>{e.evoCode} — {e.fullName} ({EVO_STATUS_LABELS[e.status]})</option>
          ))}
        </select>
      </div>
      {selectedEvo && (
        <>
          <div style={{ borderRadius: 8, padding: "12px 14px", marginBottom: 18, backgroundColor: eligible ? "#EBF8F3" : "#FEF9EE", border: `0.5px solid ${eligible ? EVCORE_COLORS.greenLight : EVCORE_COLORS.amber}`, fontSize: 13, color: eligible ? "#0F6E56" : "#854F0B", display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 16 }}>{eligible ? "✓" : "⚠"}</span>
            {eligible ? `${selectedEvo.fullName} is eligible for asset assignment.` : `EVO must be in Awaiting Handover or Active. Current: ${EVO_STATUS_LABELS[selectedEvo.status]}`}
          </div>
          {eligible && (
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: EVCORE_COLORS.textSecondary, textTransform: "uppercase", letterSpacing: "0.04em", display: "block", marginBottom: 7 }}>Available assets — {selectedEvo.emcName}</label>
              {available.length === 0
                ? <div style={{ fontSize: 14, color: EVCORE_COLORS.textSecondary }}>No available assets in this EMC zone.</div>
                : <select value={assetId} onChange={e => setAssetId(e.target.value)}
                    style={{ width: "100%", height: 40, border: `0.5px solid ${EVCORE_COLORS.border}`, borderRadius: 8, padding: "0 13px", fontSize: 13, color: EVCORE_COLORS.textPrimary, backgroundColor: EVCORE_COLORS.white, outline: "none", cursor: "pointer", boxSizing: "border-box", fontFamily: "monospace" }}>
                    <option value="">Select asset…</option>
                    {available.map(a => <option key={a.id} value={a.id}>{a.assetCode} — {a.assetKey}</option>)}
                  </select>}
              <div style={{ marginTop: 12, borderRadius: 8, padding: "10px 12px", backgroundColor: EVCORE_COLORS.pageBg, border: `0.5px solid ${EVCORE_COLORS.border}`, fontSize: 12, color: EVCORE_COLORS.textSecondary, lineHeight: 1.6 }}>
                Complete the full <strong style={{ color: EVCORE_COLORS.textPrimary }}>VCU handover checklist</strong> (1 EV frame + 2 batteries) after assignment.
              </div>
            </div>
          )}
        </>
      )}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
        <button onClick={onClose} style={{ height: 40, padding: "0 20px", borderRadius: 8, border: `0.5px solid ${EVCORE_COLORS.border}`, backgroundColor: "transparent", fontSize: 13, fontWeight: 500, color: EVCORE_COLORS.textSecondary, cursor: "pointer" }}>Cancel</button>
        <button onClick={onClose} disabled={!assetId || !eligible}
          style={{ height: 40, padding: "0 22px", borderRadius: 8, border: "none", backgroundColor: (!assetId || !eligible) ? EVCORE_COLORS.greenLight : EVCORE_COLORS.green, fontSize: 13, fontWeight: 700, color: "#fff", cursor: (!assetId || !eligible) ? "not-allowed" : "pointer" }}>
          Assign Asset
        </button>
      </div>
    </Modal>
  );
}

// ─── Download Modal ───────────────────────────────────────────────────────────

function DownloadModal({ opened, onClose, columns }: { opened: boolean; onClose: () => void; columns: ColumnPref[] }) {
  if (!opened) return null;
  const visibleCols = columns.filter(c => c.visible);
  return (
    <Modal opened title="Download Accounts" maxWidth={480} onClose={onClose}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 13, color: EVCORE_COLORS.textSecondary, marginBottom: 14, lineHeight: 1.6 }}>
          Downloads all matching EVO accounts as a CSV file. The following columns will be included based on your current preferences:
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {visibleCols.map(c => (
            <span key={c.key} style={{ display: "inline-flex", alignItems: "center", height: 24, padding: "0 10px", borderRadius: 99, backgroundColor: EVCORE_COLORS.pageBg, border: `0.5px solid ${EVCORE_COLORS.border}`, fontSize: 11, fontWeight: 500, color: EVCORE_COLORS.textSecondary }}>
              {c.label}
            </span>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button onClick={onClose} style={{ height: 40, padding: "0 20px", borderRadius: 8, border: `0.5px solid ${EVCORE_COLORS.border}`, backgroundColor: "transparent", fontSize: 13, fontWeight: 500, color: EVCORE_COLORS.textSecondary, cursor: "pointer" }}>Cancel</button>
        <button onClick={onClose} style={{ height: 40, padding: "0 22px", borderRadius: 8, border: "none", backgroundColor: EVCORE_COLORS.green, fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 7 }}>
          <Download size={14} /> Download CSV
        </button>
      </div>
    </Modal>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EvoAccountsPage() {
  // ── Modal state ─────────────────────────────────────────────────────────────
  const [registerOpen,     setRegisterOpen]     = React.useState(false);
  const [detailEvo,        setDetailEvo]        = React.useState<EvoAccount | null>(null);
  const [changeStatusEvo,  setChangeStatusEvo]  = React.useState<EvoAccount | null>(null);
  const [assignEvo,        setAssignEvo]        = React.useState<EvoAccount | null>(null);
  const [deleteEvo,        setDeleteEvo]        = React.useState<EvoAccount | null>(null);
  const [assignGlobalOpen, setAssignGlobalOpen] = React.useState(false);
  const [downloadOpen,     setDownloadOpen]     = React.useState(false);

  // ── Drawer state ────────────────────────────────────────────────────────────
  const [filtersOpen, setFiltersOpen] = React.useState(false);
  const [prefsOpen,   setPrefsOpen]   = React.useState(false);

  // ── Column preferences ──────────────────────────────────────────────────────
  const [columns, setColumns] = React.useState<ColumnPref[]>(ACCOUNTS_DEFAULT_COLUMNS);

  // ── Filter form (react-hook-form — mirrors LAMT TableFilters pattern) ───────
  const formMethods = useForm({ defaultValues: getEvoFilterDefaults() });

  // Active filter data — updated by onChangeFilter callback
  const [filterData, setFilterData] = React.useState<Record<string, { method: string; value: string }>>({});

  const onChangeFilter = React.useCallback((values: Record<string, unknown>) => {
    setFilterData(prev => ({ ...prev, ...values as Record<string, { method: string; value: string }> }));
    setPage(1);
  }, []);

  const onResetAllFilters = React.useCallback(() => {
    formMethods.reset(getEvoFilterDefaults());
    setFilterData({});
    setPage(1);
  }, [formMethods]);

  // ── Pagination ──────────────────────────────────────────────────────────────
  const [page, setPage] = React.useState(1);
  const LIMIT = 10;

  // ── KPI counts ──────────────────────────────────────────────────────────────
  const todayStr      = new Date().toISOString().slice(0, 10);
  const totalAccounts = EVO_ACCOUNTS.length;
  const activeCount   = EVO_ACCOUNTS.filter(e => e.status === "ACTIVE").length;
  const bgcCount      = EVO_ACCOUNTS.filter(e => e.status === "AWAITING_BGC").length;
  const todayCount    = EVO_ACCOUNTS.filter(e => e.registeredAt === todayStr).length;

  // ── Filtered data ───────────────────────────────────────────────────────────
  const filtered = React.useMemo(() => {
    return EVO_ACCOUNTS.filter(e => {
      for (const [name, filter] of Object.entries(filterData)) {
        if (!filter.value) continue;
        let fieldValue: string | number | null | undefined;
        switch (name) {
          case "evoCode":           fieldValue = e.evoCode;                        break;
          case "fullName":          fieldValue = e.fullName;                       break;
          case "phone":             fieldValue = e.phoneNumbers[0] ?? "";          break;
          case "registeredAt":      fieldValue = e.registeredAt;                   break;
          case "lastPaymentDate":   fieldValue = e.lastPaymentDate ?? "";          break;
          case "rentalPlan":        fieldValue = e.rentalPlan ?? "";               break;
          case "status":            fieldValue = e.status;                         break;
          case "balance":           fieldValue = e.balance;                        break;
          case "bgcDecision":       fieldValue = e.bgcDecision;                    break;
          case "ospStatus":         fieldValue = e.ospStatus;                      break;
          case "ospWrittenScore":   fieldValue = e.ospWrittenScore ?? 0;           break;
          case "ospOnroadScore":    fieldValue = e.ospOnroadScore ?? 0;            break;
          case "emcZone":           fieldValue = e.emcName;                        break;
          case "assetSerialNumber": fieldValue = ASSET_KEY_BY_EVO[e.evoCode] ?? ""; break;
          case "paymentReference":  fieldValue = PAYMENT_REF_BY_EVO[e.evoCode] ?? ""; break;
          default: continue;
        }
        if (!applyFilterMethod(fieldValue, filter.method, filter.value)) return false;
      }
      return true;
    });
  }, [filterData]);

  const activeFiltersCount = Object.values(filterData).filter(f => f.value !== "").length;
  const handleColumnReset  = () => setColumns(ACCOUNTS_DEFAULT_COLUMNS);

  // ── Shortcut button active checks ───────────────────────────────────────────
  const isAssetSerialActive   = !!filterData.assetSerialNumber?.value;
  const isPaymentRefActive    = !!filterData.paymentReference?.value;
  const isAccountStatusActive = !!filterData.status?.value;

  // ── Left actions (shortcut filter buttons — same as LAMT accounts) ──────────
  const leftActions = [
    <ShortcutFilterButton key="serial" label="Asset Serial Number" isActive={isAssetSerialActive}>
      <FilterMethod
        name="assetSerialNumber"
        type={FilterType.Str}
        method={Method.Contains}
        formControl={formMethods}
        onChangeFilter={onChangeFilter}
      />
    </ShortcutFilterButton>,

    <ShortcutFilterButton key="payref" label="Payment Reference" isActive={isPaymentRefActive}>
      <FilterMethod
        name="paymentReference"
        type={FilterType.Str}
        method={Method.Contains}
        formControl={formMethods}
        onChangeFilter={onChangeFilter}
      />
    </ShortcutFilterButton>,

    <ShortcutFilterButton key="status" label="Account Status" isActive={isAccountStatusActive}>
      <FilterMethod
        name="status"
        type={FilterType.Select}
        method={Method.Equals}
        formControl={formMethods}
        onChangeFilter={onChangeFilter}
        options={
          EVO_ACCOUNT_FILTER_SECTIONS
            .find(s => s.id === "accountStatus")!
            .filters.find(f => f.name === "status")!
            .options!
        }
      />
    </ShortcutFilterButton>,
  ];

  // ── Table ────────────────────────────────────────────────────────────────────
  const visibleKeys = new Set(columns.filter(c => c.visible).map(c => c.key));

  const allRows: Record<string, (e: EvoAccount) => React.ReactNode> = {
    evoCode:     e => <span style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 600, color: EVCORE_COLORS.green }}>{e.evoCode}</span>,
    fullName:    e => (
      <button onClick={() => setDetailEvo(e)}
        style={{ background: "none", border: "none", padding: 0, cursor: "pointer", fontSize: 13, fontWeight: 600, color: EVCORE_COLORS.textPrimary, fontFamily: "inherit", textDecoration: "underline", textDecorationColor: "transparent", textUnderlineOffset: 2 }}
        onMouseEnter={ev => (ev.currentTarget.style.textDecorationColor = EVCORE_COLORS.green)}
        onMouseLeave={ev => (ev.currentTarget.style.textDecorationColor = "transparent")}>
        {e.fullName}
      </button>
    ),
    phone:        e => <span style={{ fontSize: 12, fontFamily: "monospace" }}>{e.phoneNumbers[0]}</span>,
    emc:          e => <span style={{ fontSize: 12 }}>{e.emcName}</span>,
    product:      e => <span style={{ fontFamily: "monospace", fontSize: 11, color: EVCORE_COLORS.textSecondary }}>{e.evProductCode}</span>,
    status:       e => { const s = EVO_STATUS_CHIP[e.status]; return s ? <StatusChip type={s.type}>{s.label}</StatusChip> : null; },
    balance:      e => <span style={{ fontSize: 12, fontWeight: 500, color: e.balance > 0 ? EVCORE_COLORS.textPrimary : EVCORE_COLORS.textSecondary }}>{e.balance > 0 ? `$${e.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}` : "—"}</span>,
    bgc:          e => <span style={{ fontSize: 11, color: EVCORE_COLORS.textSecondary }}>{e.bgcDecision ?? "—"}</span>,
    osp:          e => <span style={{ fontSize: 11, color: EVCORE_COLORS.textSecondary }}>{e.ospStatus ?? "—"}</span>,
    rentalPlan:   e => <span style={{ fontSize: 11, fontFamily: "monospace", color: EVCORE_COLORS.textSecondary }}>{e.rentalPlan ?? "—"}</span>,
    registeredAt: e => <span style={{ fontSize: 11, color: EVCORE_COLORS.textSecondary }}>{e.registeredAt ?? "—"}</span>,
  };

  const tableData = filtered.map(evo => ({
    id: evo.id,
    ...Object.fromEntries(Object.entries(allRows).filter(([k]) => visibleKeys.has(k)).map(([k, fn]) => [k, fn(evo)])),
    _raw: evo,
  }));

  const colDefsMap: Record<string, string> = {
    evoCode: "EVO Code", fullName: "Full Name", phone: "Phone", emc: "EMC Zone",
    product: "Product", status: "Status", balance: "Balance",
    bgc: "BGC Decision", osp: "OSP Status", rentalPlan: "Rental Plan", registeredAt: "Registered At",
  };
  const colDefs = columns.filter(c => c.visible).map(c => ({ headerName: colDefsMap[c.key] ?? c.label, type: TableCellType.component, key: c.key }));

  const rowActions = (row: Record<string, number | string | React.ReactNode | object>) => {
    const evo = row._raw as EvoAccount;
    return (
      <div style={{ display: "flex", gap: 4 }}>
        <ActionBtn icon={<Eye size={10} />}       label="View"   onClick={() => setDetailEvo(evo)} />
        <ActionBtn icon={<RefreshCw size={10} />} label="Status" onClick={() => setChangeStatusEvo(evo)} color={EVCORE_COLORS.blue} />
        <ActionBtn icon={<Trash2 size={10} />}    label="Delete" onClick={() => setDeleteEvo(evo)} color={EVCORE_COLORS.danger} />
      </div>
    );
  };

  return (
    <>
      <AppShell pageTitle="EVO Accounts">
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          <div>
            <PageHeader
              title="EVO Accounts"
              actions={[
                { label: "+ Register EVO", kind: ButtonKind.Primary, onClick: () => setRegisterOpen(true) },
                { label: "Asset Assign",   kind: ButtonKind.Ghost,   onClick: () => setAssignGlobalOpen(true) },
              ]}
              onClickDownload={() => setDownloadOpen(true)}
            />
            <div style={{ fontSize: 12, color: EVCORE_COLORS.textSecondary, marginTop: 4 }}>
              {filtered.length} {filtered.length === 1 ? "account" : "accounts"}{activeFiltersCount > 0 ? " matching filters" : " total"}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
            <KpiCard label="Total Accounts"   value={String(totalAccounts)} delta="All registered"     deltaType="neutral"  icon={Users} />
            <KpiCard label="Active Accounts"  value={String(activeCount)}   delta="Currently on road"  deltaType="positive" icon={CheckCircle2} />
            <KpiCard label="Pending BGC"      value={String(bgcCount)}      delta="Awaiting check"     deltaType="negative" icon={ClipboardCheck} />
            <KpiCard label="Registered Today" value={String(todayCount)}    delta="New today"          deltaType="positive" icon={CalendarPlus} />
          </div>

          <FiltersBar
            leftActions={leftActions}
            activeFiltersCount={activeFiltersCount}
            onClickFilter={() => setFiltersOpen(true)}
            onClickPreferences={() => setPrefsOpen(true)}
            
          />

          {filtered.length === 0 ? (
            <div style={{ backgroundColor: EVCORE_COLORS.white, border: `0.5px solid ${EVCORE_COLORS.border}`, borderRadius: 12, padding: "48px 24px", textAlign: "center" }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: EVCORE_COLORS.textPrimary, marginBottom: 8 }}>No accounts found</div>
              <div style={{ fontSize: 12, color: EVCORE_COLORS.textSecondary, marginBottom: 16 }}>No results match your current filters.</div>
              <button onClick={onResetAllFilters} style={{ height: 34, padding: "0 18px", borderRadius: 8, border: `0.5px solid ${EVCORE_COLORS.border}`, backgroundColor: "transparent", fontSize: 12, fontWeight: 500, color: EVCORE_COLORS.textSecondary, cursor: "pointer" }}>Clear filters</button>
            </div>
          ) : (
            <div style={{ backgroundColor: EVCORE_COLORS.white, border: `0.5px solid ${EVCORE_COLORS.border}`, borderRadius: 12, overflow: "hidden" }}>
              <Table hasActions rowActions={rowActions} data={tableData} colDefs={colDefs}
                currentPageNumber={page} limit={LIMIT} totalData={filtered.length}
                paginationStrategy={PaginationStrategy.LOCAL} onPageChange={setPage} showCheckbox={false} />
            </div>
          )}
        </div>
      </AppShell>

      {/* Modals */}
      <RegisterEvoModal opened={registerOpen} onClose={() => setRegisterOpen(false)} title="Register New EVO" maxWidth={680} />
      <EvoDetailModal evo={detailEvo} onClose={() => setDetailEvo(null)} />
      <ChangeStatusModal evo={changeStatusEvo} onClose={() => setChangeStatusEvo(null)} />
      <AssignAssetModal  evo={assignEvo}       onClose={() => setAssignEvo(null)} />
      {deleteEvo && <DeleteConfirmModal evo={deleteEvo} onConfirm={() => setDeleteEvo(null)} onCancel={() => setDeleteEvo(null)} />}
      <GlobalAssignModal opened={assignGlobalOpen} onClose={() => setAssignGlobalOpen(false)} />
      <DownloadModal     opened={downloadOpen}    onClose={() => setDownloadOpen(false)} columns={columns} />

      {/* Filter drawer — FilterExpandable sections, mirrors LAMT TableFilters */}
      <EvoFormFiltersDrawer
        sections={EVO_ACCOUNT_FILTER_SECTIONS}
        opened={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        formControl={formMethods}
        onChangeFilter={onChangeFilter}
        onResetAll={onResetAllFilters}
      />

      {/* Preferences drawer */}
      <EvoPreferencesDrawer
        opened={prefsOpen} onClose={() => setPrefsOpen(false)}
        columns={columns} onChange={(k, v) => setColumns(p => p.map(c => c.key === k ? { ...c, visible: v } : c))}
        onReset={handleColumnReset}
      />
    </>
  );
}
