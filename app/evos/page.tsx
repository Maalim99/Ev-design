"use client";

import * as React from "react";
import { Users, ClipboardCheck, CheckCircle2, CalendarPlus, Eye, RefreshCw, Trash2 } from "lucide-react";

import { AppShell } from "@/components/evcore/layout/AppShell";
import { KpiCard } from "@/components/evcore/ui/KpiCard";
import { EvoStatusChip } from "@/components/evcore/ui/EvoStatusChip";
import { EvoDetailModal, DeleteConfirmModal } from "@/components/evcore/ui/EvoDetailModal";
import { RegisterEvoModal } from "@/components/evcore/modals/RegisterEvoModal";
import { EvoFiltersDrawer, type FilterSection } from "@/components/evcore/filters/EvoFiltersDrawer";
import { EvoPreferencesDrawer, type ColumnPref } from "@/components/evcore/filters/EvoPreferencesDrawer";

import { PageHeader } from "@/components/lamt/page-header";
import { FiltersBar } from "@/components/lamt/filters-bar";
import { Modal } from "@/components/lamt/modal";
import { Table, TableCellType, PaginationStrategy } from "@/components/lamt/table";
import { Button, ButtonKind } from "@/components/lamt/button";

import {
  EVO_ACCOUNTS, EMC_ZONES,
  FLEET_ASSETS, type EvoAccount, type EvoStatus,
} from "@/data/dummy";
import {
  EVCORE_COLORS, EVO_STATUS_LABELS, EVO_STATUS_TRANSITIONS,
} from "@/lib/evcore/constants";

// ─── Filter & preference config ───────────────────────────────────────────────

const FILTER_SECTIONS: FilterSection[] = [
  {
    id: "status",
    label: "Status",
    options: [
      { id: "AWAITING_BGC",      name: "Awaiting BGC" },
      { id: "AWAITING_TRAINING", name: "Awaiting Training" },
      { id: "AWAITING_PAYMENT",  name: "Awaiting Payment" },
      { id: "PARTIAL_PAYMENT",   name: "Partial Payment" },
      { id: "AWAITING_HANDOVER", name: "Awaiting Handover" },
      { id: "ACTIVE",            name: "Active" },
      { id: "INACTIVE",          name: "Inactive" },
      { id: "DISENGAGED",        name: "Disengaged" },
    ],
  },
  {
    id: "emc",
    label: "EMC Zone",
    options: EMC_ZONES.map((z) => ({ id: z, name: z })),
  },
  {
    id: "bgc",
    label: "BGC Decision",
    options: [
      { id: "NOT_ASSESSED",  name: "Not Assessed" },
      { id: "RECOMMENDED",   name: "Recommended" },
      { id: "REJECTED",      name: "Rejected" },
      { id: "MANUAL_REVIEW", name: "Manual Review" },
    ],
  },
  {
    id: "osp",
    label: "OSP Status",
    options: [
      { id: "NOT_STARTED",  name: "Not Started" },
      { id: "IN_PROGRESS",  name: "In Progress" },
      { id: "PASSED",       name: "Passed" },
      { id: "FAILED",       name: "Failed" },
    ],
  },
  {
    id: "product",
    label: "Product",
    options: [
      { id: "ALTECH-F3-2B",   name: "ALTECH-F3-2B" },
      { id: "ALTECH-E3-2B",   name: "ALTECH-E3-2B" },
      { id: "ALTECH-T1-2B",   name: "ALTECH-T1-2B" },
      { id: "ALTECH-ECAT-A1", name: "ALTECH-ECAT-A1" },
    ],
  },
];

const DEFAULT_COLUMNS: ColumnPref[] = [
  { key: "evoCode",     label: "EVO Code",        visible: true,  required: true },
  { key: "fullName",    label: "Full Name",        visible: true,  required: true },
  { key: "phone",       label: "Phone",            visible: true },
  { key: "emc",         label: "EMC Zone",         visible: true },
  { key: "product",     label: "Product",          visible: true },
  { key: "status",      label: "Status",           visible: true },
  { key: "balance",     label: "Balance",          visible: true },
  { key: "bgc",         label: "BGC Decision",     visible: false },
  { key: "osp",         label: "OSP Status",       visible: false },
  { key: "rentalPlan",  label: "Rental Plan",      visible: false },
  { key: "registeredAt",label: "Registered At",    visible: false },
  { key: "aarove",      label: "Assigned Aarove",  visible: false },
];

// ─── Row action button ────────────────────────────────────────────────────────

function ActionBtn({ icon, label, onClick, color }: {
  icon: React.ReactNode; label: string; onClick: () => void; color?: string;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      style={{
        display: "inline-flex", alignItems: "center", gap: 4, height: 26,
        padding: "0 9px", borderRadius: 6, border: `0.5px solid ${EVCORE_COLORS.border}`,
        backgroundColor: "transparent", fontSize: 11, fontWeight: 500,
        color: color ?? EVCORE_COLORS.textSecondary, cursor: "pointer", whiteSpace: "nowrap",
      }}
    >
      {icon}{label}
    </button>
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

// ─── Assign Asset Modal ───────────────────────────────────────────────────────

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
        {eligible ? "EVO is eligible for asset assignment." : `EVO must be in Awaiting Handover or Active status. Current: ${EVO_STATUS_LABELS[evo.status]}`}
      </div>
      {eligible && <>
        <div style={{ marginBottom: 18 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: EVCORE_COLORS.textSecondary, textTransform: "uppercase", letterSpacing: "0.04em", display: "block", marginBottom: 7 }}>Available assets — {evo.emcName}</label>
          {available.length === 0
            ? <div style={{ fontSize: 14, color: EVCORE_COLORS.textSecondary }}>No available assets in this EMC zone.</div>
            : <select value={assetId} onChange={e => setAssetId(e.target.value)}
                style={{ width: "100%", height: 40, border: `0.5px solid ${EVCORE_COLORS.border}`, borderRadius: 8, padding: "0 13px", fontSize: 14, color: EVCORE_COLORS.textPrimary, backgroundColor: EVCORE_COLORS.white, outline: "none", cursor: "pointer", boxSizing: "border-box", fontFamily: "monospace" }}>
                <option value="">Select asset…</option>
                {available.map(a => <option key={a.id} value={a.id}>{a.assetCode} — {a.productCode}</option>)}
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

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EvoAccountsPage() {
  // — modals
  const [registerOpen,    setRegisterOpen]    = React.useState(false);
  const [detailEvo,       setDetailEvo]       = React.useState<EvoAccount | null>(null);
  const [changeStatusEvo, setChangeStatusEvo] = React.useState<EvoAccount | null>(null);
  const [assignEvo,       setAssignEvo]       = React.useState<EvoAccount | null>(null);
  const [deleteEvo,       setDeleteEvo]       = React.useState<EvoAccount | null>(null);

  // — drawers
  const [filtersOpen,     setFiltersOpen]     = React.useState(false);
  const [prefsOpen,       setPrefsOpen]       = React.useState(false);

  // — filter state (multi-select per section)
  const [filterValues, setFilterValues] = React.useState<Record<string, string[]>>({});

  // — column preferences
  const [columns, setColumns] = React.useState<ColumnPref[]>(DEFAULT_COLUMNS);

  const [page, setPage] = React.useState(1);
  const LIMIT = 10;

  const todayStr = new Date().toISOString().slice(0, 10);

  // KPI counts
  const totalAccounts = EVO_ACCOUNTS.length;
  const activeCount   = EVO_ACCOUNTS.filter(e => e.status === "ACTIVE").length;
  const bgcCount      = EVO_ACCOUNTS.filter(e => e.status === "AWAITING_BGC").length;
  const todayCount    = EVO_ACCOUNTS.filter(e => e.registeredAt === todayStr).length;

  // — active filter count
  const activeFiltersCount = Object.values(filterValues).reduce(
    (acc, arr) => acc + arr.length, 0
  );

  // — filtering
  const filtered = React.useMemo(() => {
    return EVO_ACCOUNTS.filter(e => {
      const statuses = filterValues.status ?? [];
      const emcs     = filterValues.emc    ?? [];
      const bgcs     = filterValues.bgc    ?? [];
      const osps     = filterValues.osp    ?? [];
      const products = filterValues.product ?? [];

      return (
        (!statuses.length  || statuses.includes(e.status))         &&
        (!emcs.length      || emcs.includes(e.emcName))            &&
        (!bgcs.length      || bgcs.includes(e.bgcDecision))        &&
        (!osps.length      || osps.includes(e.ospStatus))          &&
        (!products.length  || products.includes(e.evProductCode))
      );
    });
  }, [filterValues]);

  const handleFilterChange = (sectionId: string, selected: string[]) => {
    setFilterValues(prev => ({ ...prev, [sectionId]: selected }));
    setPage(1);
  };

  const handleFilterReset = () => {
    setFilterValues({});
    setPage(1);
  };

  const handleColumnChange = (key: string, visible: boolean) => {
    setColumns(prev => prev.map(c => c.key === key ? { ...c, visible } : c));
  };

  const handleColumnReset = () => setColumns(DEFAULT_COLUMNS);

  // — visible columns for the table
  const visibleColumns = columns.filter(c => c.visible);

  // — table data
  const tableData = filtered.map(evo => ({
    id: evo.id,
    evoCode:  <span style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 600, color: EVCORE_COLORS.green }}>{evo.evoCode}</span>,
    fullName: (
      <button onClick={() => setDetailEvo(evo)} style={{ background: "none", border: "none", padding: 0, cursor: "pointer", fontSize: 13, fontWeight: 600, color: EVCORE_COLORS.textPrimary, fontFamily: "inherit", textDecoration: "underline", textDecorationColor: "transparent", textUnderlineOffset: 2 }}
        onMouseEnter={e => (e.currentTarget.style.textDecorationColor = EVCORE_COLORS.green)}
        onMouseLeave={e => (e.currentTarget.style.textDecorationColor = "transparent")}>
        {evo.fullName}
      </button>
    ),
    phone:      <span style={{ fontSize: 12, fontFamily: "monospace" }}>{evo.phoneNumbers[0]}</span>,
    emc:        <span style={{ fontSize: 12 }}>{evo.emcName}</span>,
    product:    <span style={{ fontFamily: "monospace", fontSize: 11, color: EVCORE_COLORS.textSecondary }}>{evo.evProductCode}</span>,
    status:     <EvoStatusChip status={evo.status} />,
    balance:    <span style={{ fontSize: 12, fontWeight: 500, color: evo.balance > 0 ? EVCORE_COLORS.textPrimary : EVCORE_COLORS.textSecondary }}>{evo.balance > 0 ? `$${evo.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}` : "—"}</span>,
    bgc:        <span style={{ fontSize: 12, color: EVCORE_COLORS.textSecondary }}>{evo.bgcDecision.replace(/_/g, " ")}</span>,
    osp:        <span style={{ fontSize: 12, color: EVCORE_COLORS.textSecondary }}>{evo.ospStatus.replace(/_/g, " ")}</span>,
    rentalPlan: <span style={{ fontFamily: "monospace", fontSize: 11 }}>{evo.rentalPlan ?? "—"}</span>,
    registeredAt: <span style={{ fontSize: 12, color: EVCORE_COLORS.textSecondary }}>{evo.registeredAt}</span>,
    aarove:     <span style={{ fontSize: 12, color: EVCORE_COLORS.textSecondary }}>{evo.assignedAarove}</span>,
    _raw: evo,
  }));

  const colDefs = visibleColumns.map(col => ({
    headerName: col.label,
    type: TableCellType.component,
    key: col.key,
  }));

  const rowActions = (row: Record<string, number | string | React.ReactNode | object>) => {
    const evo = row._raw as EvoAccount;
    return (
      <div style={{ display: "flex", gap: 4 }}>
        <ActionBtn icon={<Eye size={10} />}       label="View"   onClick={() => setDetailEvo(evo)} />
        <ActionBtn icon={<RefreshCw size={10} />} label="Status" onClick={() => setChangeStatusEvo(evo)} color={EVCORE_COLORS.blue} />
        <ActionBtn icon={<Trash2 size={10} />}    label="Delete" onClick={() => setDeleteEvo(evo)}  color={EVCORE_COLORS.danger} />
      </div>
    );
  };

  return (
    <>
      <AppShell pageTitle="EVO Accounts">
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Page header */}
          <div>
            <PageHeader
              title="EVO Accounts"
              actions={[{ label: "+ Register EVO", kind: ButtonKind.Primary, onClick: () => setRegisterOpen(true) }]}
            />
            <div style={{ fontSize: 12, color: EVCORE_COLORS.textSecondary, marginTop: 4 }}>
              {filtered.length} {filtered.length === 1 ? "account" : "accounts"}
              {activeFiltersCount > 0 ? " matching current filters" : " total"}
            </div>
          </div>

          {/* KPI cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
            <KpiCard label="Total Accounts"   value={String(totalAccounts)} delta="All registered"     deltaType="neutral"  icon={Users} />
            <KpiCard label="Active Accounts"  value={String(activeCount)}   delta="Currently on road" deltaType="positive" icon={CheckCircle2} />
            <KpiCard label="Pending BGC"      value={String(bgcCount)}      delta="Awaiting check"    deltaType="negative" icon={ClipboardCheck} />
            <KpiCard label="Registered Today" value={String(todayCount)}    delta="New today"         deltaType="positive" icon={CalendarPlus} />
          </div>

          {/* Filters bar — LAMT pattern */}
          <FiltersBar
            activeFiltersCount={activeFiltersCount}
            onClickFilter={() => setFiltersOpen(true)}
            onClickPreferences={() => setPrefsOpen(true)}
            
          />

          {/* Table or empty state */}
          {filtered.length === 0 ? (
            <div style={{ backgroundColor: EVCORE_COLORS.white, border: `0.5px solid ${EVCORE_COLORS.border}`, borderRadius: 12, padding: "48px 24px", textAlign: "center" }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: EVCORE_COLORS.textPrimary, marginBottom: 8 }}>No accounts found</div>
              <div style={{ fontSize: 12, color: EVCORE_COLORS.textSecondary, marginBottom: 16 }}>No results match your current filters.</div>
              <Button kind={ButtonKind.Ghost} onClick={handleFilterReset}>Clear filters</Button>
            </div>
          ) : (
            <div style={{ backgroundColor: EVCORE_COLORS.white, border: `0.5px solid ${EVCORE_COLORS.border}`, borderRadius: 12, overflow: "hidden" }}>
              <Table
                hasActions
                rowActions={rowActions}
                data={tableData}
                colDefs={colDefs}
                currentPageNumber={page}
                limit={LIMIT}
                totalData={filtered.length}
                paginationStrategy={PaginationStrategy.LOCAL}
                onPageChange={setPage}
                showCheckbox={false}
              />
            </div>
          )}
        </div>
      </AppShell>

      {/* Filter drawer */}
      <EvoFiltersDrawer
        opened={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        sections={FILTER_SECTIONS}
        values={filterValues}
        onChange={handleFilterChange}
        onReset={handleFilterReset}
      />

      {/* Preferences drawer */}
      <EvoPreferencesDrawer
        opened={prefsOpen}
        onClose={() => setPrefsOpen(false)}
        columns={columns}
        onChange={handleColumnChange}
        onReset={handleColumnReset}
      />

      {/* Modals */}
      <RegisterEvoModal opened={registerOpen} onClose={() => setRegisterOpen(false)} title="Register New EVO" maxWidth={680} />
      <EvoDetailModal evo={detailEvo} onClose={() => setDetailEvo(null)} />
      <ChangeStatusModal evo={changeStatusEvo} onClose={() => setChangeStatusEvo(null)} />
      <AssignAssetModal  evo={assignEvo}       onClose={() => setAssignEvo(null)} />
      {deleteEvo && <DeleteConfirmModal evo={deleteEvo} onConfirm={() => setDeleteEvo(null)} onCancel={() => setDeleteEvo(null)} />}
    </>
  );
}
