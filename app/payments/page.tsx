"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { CreditCard, TrendingUp, Users, Eye, Zap } from "lucide-react";
import { RowActionBtn } from "@/components/evcore/ui/RowActionBtn";

import { AppShell } from "@/components/evcore/layout/AppShell";
import { KpiCard } from "@/components/evcore/ui/KpiCard";
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

import { PAYMENT_RECORDS, type PaymentRecord, type PaymentChannel, type PaymentType, type PaymentStatus } from "@/data/dummy";
import { EVCORE_COLORS } from "@/lib/evcore/constants";
import { PAYMENTS_DEFAULT_COLUMNS } from "@/lib/evcore/filterConfigs";
import {
  EVO_PAYMENT_FILTER_SECTIONS,
  getPaymentFilterDefaults,
} from "@/lib/evcore/evoPaymentFilterSections";

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
    case Method.Contains:           return fv.includes(fval);
    case Method.DoesNotContain:     return !fv.includes(fval);
    case Method.Equals:             return fv === fval;
    case Method.GreaterThan:        return fv >= fval;
    case Method.LessThan:           return fv <= fval;
    case Method.GreaterOrEqualThan: return fv >= fval;
    case Method.LessOrEqualThan:    return fv <= fval;
    default:                        return true;
  }
}

// ─── Chip styles ───────────────────────────────────────────────────────────────

const CHANNEL_CHIP: Record<PaymentChannel, { type: StatusChipType; label: string }> = {
  MPESA:        { type: StatusChipType.Success, label: "M-Pesa"       },
  AIRTEL_MONEY: { type: StatusChipType.Danger,  label: "Airtel Money" },
  ORANGE_MONEY: { type: StatusChipType.Warning, label: "Orange Money" },
};

const TYPE_CHIP: Record<PaymentType, { type: StatusChipType; label: string }> = {
  SUBSCRIPTION: { type: StatusChipType.Info,  label: "Subscription" },
  RENTAL:       { type: StatusChipType.InfoM, label: "Rental"       },
};

const STATUS_CHIP: Record<PaymentStatus, { type: StatusChipType; label: string }> = {
  COMPLETED: { type: StatusChipType.Success, label: "Completed" },
  PENDING:   { type: StatusChipType.Warning, label: "Pending"   },
  FAILED:    { type: StatusChipType.Danger,  label: "Failed"    },
};

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

// ─── Payment Detail Modal ──────────────────────────────────────────────────────

function PaymentDetailModal({ payment, onClose }: { payment: PaymentRecord | null; onClose: () => void }) {
  if (!payment) return null;
  const ch = CHANNEL_CHIP[payment.paymentChannel];
  const ty = TYPE_CHIP[payment.paymentType];
  const st = STATUS_CHIP[payment.status];
  const dt = new Date(payment.paymentDatetime);

  const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `0.5px solid ${EVCORE_COLORS.border}` }}>
      <span style={{ fontSize: 12, color: EVCORE_COLORS.textSecondary, fontWeight: 500 }}>{label}</span>
      <span style={{ fontSize: 13, color: EVCORE_COLORS.textPrimary, fontWeight: 600, textAlign: "right" }}>{value}</span>
    </div>
  );

  return (
    <Modal opened title="Payment Details" maxWidth={520} onClose={onClose}>
      <div style={{ padding: "12px 16px", borderRadius: 10, backgroundColor: EVCORE_COLORS.pageBg, marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: EVCORE_COLORS.textPrimary }}>{payment.evoName}</div>
          <div style={{ fontSize: 12, fontFamily: "monospace", color: EVCORE_COLORS.green, marginTop: 3 }}>{payment.evoCode}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: EVCORE_COLORS.textPrimary }}>{payment.currency} {payment.amount}.00</div>
          <StatusChip type={st.type}>{st.label}</StatusChip>
        </div>
      </div>
      <div style={{ marginBottom: 20 }}>
        <Row label="Payment Reference"  value={<span style={{ fontFamily: "monospace", fontSize: 12 }}>{payment.paymentReference}</span>} />
        <Row label="Channel Reference"  value={<span style={{ fontFamily: "monospace", fontSize: 12 }}>{payment.channelReference}</span>} />
        <Row label="Payment Type"       value={<StatusChip type={ty.type}>{ty.label}</StatusChip>} />
        <Row label="Channel"            value={<StatusChip type={ch.type}>{ch.label}</StatusChip>} />
        <Row label="EMC"                value={payment.emcName} />
        <Row label="Date & Time"        value={dt.toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })} />
        <Row
          label="Activation Code"
          value={
            payment.activationCodeGenerated
              ? <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, color: "#0F6E56", fontWeight: 600 }}><Zap size={12} />Generated · 06:00–21:00 window</span>
              : <span style={{ fontSize: 12, color: EVCORE_COLORS.textSecondary }}>N/A (Subscription)</span>
          }
        />
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button onClick={onClose} style={{ height: 38, padding: "0 20px", border: `0.5px solid ${EVCORE_COLORS.border}`, borderRadius: 8, backgroundColor: "transparent", fontSize: 13, color: EVCORE_COLORS.textSecondary, cursor: "pointer" }}>
          Close
        </button>
      </div>
    </Modal>
  );
}

// ─── Upload Payments Modal ────────────────────────────────────────────────────

function UploadPaymentsModal({ opened, onClose }: { opened: boolean; onClose: () => void }) {
  const [dragging, setDragging] = React.useState(false);
  if (!opened) return null;
  return (
    <Modal opened title="Upload Payments" maxWidth={500} onClose={onClose}>
      <p style={{ fontSize: 13, color: EVCORE_COLORS.textSecondary, marginBottom: 20 }}>
        Upload a CSV file containing payment records. Each row must include EVO Code, Payment Channel, Amount (USD), and Payment Date.
      </p>
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); }}
        style={{
          border: `2px dashed ${dragging ? EVCORE_COLORS.green : EVCORE_COLORS.border}`,
          borderRadius: 10, padding: "36px 24px", textAlign: "center",
          backgroundColor: dragging ? EVCORE_COLORS.greenLight : EVCORE_COLORS.pageBg,
          transition: "all 0.2s", marginBottom: 20, cursor: "pointer",
        }}
      >
        <div style={{ fontSize: 13, fontWeight: 600, color: EVCORE_COLORS.textPrimary, marginBottom: 6 }}>Drag & drop CSV here</div>
        <div style={{ fontSize: 12, color: EVCORE_COLORS.textSecondary, marginBottom: 14 }}>or click to browse</div>
        <input type="file" accept=".csv" style={{ display: "none" }} id="payment-csv-upload" />
        <label htmlFor="payment-csv-upload">
          <Button kind={ButtonKind.Ghost} size={ButtonSize.Small} onClick={() => {}}>Browse file</Button>
        </label>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Button kind={ButtonKind.Ghost} size={ButtonSize.Small} onClick={onClose}>Cancel</Button>
        <Button kind={ButtonKind.Primary} size={ButtonSize.Small} onClick={onClose}>Upload</Button>
      </div>
    </Modal>
  );
}

// ─── Download Modal ───────────────────────────────────────────────────────────

function DownloadModal({ opened, onClose, columns }: { opened: boolean; onClose: () => void; columns: ColumnPref[] }) {
  const [fmt, setFmt] = React.useState<"csv" | "xlsx">("csv");
  if (!opened) return null;
  return (
    <Modal opened title="Download Payments" maxWidth={420} onClose={onClose}>
      <p style={{ fontSize: 13, color: EVCORE_COLORS.textSecondary, marginBottom: 16 }}>
        Export visible payment records with currently active filters applied.
      </p>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: EVCORE_COLORS.textSecondary, marginBottom: 8 }}>FORMAT</div>
        <div style={{ display: "flex", gap: 8 }}>
          {(["csv", "xlsx"] as const).map(f => (
            <button key={f} onClick={() => setFmt(f)} style={{ height: 34, padding: "0 18px", borderRadius: 8, border: `0.5px solid ${fmt === f ? EVCORE_COLORS.green : EVCORE_COLORS.border}`, backgroundColor: fmt === f ? EVCORE_COLORS.greenLight : "transparent", fontSize: 12, fontWeight: 600, color: fmt === f ? EVCORE_COLORS.green : EVCORE_COLORS.textSecondary, cursor: "pointer" }}>
              .{f.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: EVCORE_COLORS.textSecondary, marginBottom: 8 }}>COLUMNS</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {columns.filter(c => c.visible).map(c => (
            <span key={c.key} style={{ display: "inline-flex", alignItems: "center", height: 24, padding: "0 10px", borderRadius: 99, backgroundColor: EVCORE_COLORS.greenLight, color: EVCORE_COLORS.green, fontSize: 11, fontWeight: 600 }}>{c.label}</span>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Button kind={ButtonKind.Ghost} size={ButtonSize.Small} onClick={onClose}>Cancel</Button>
        <Button kind={ButtonKind.Primary} size={ButtonSize.Small} onClick={onClose}>Download</Button>
      </div>
    </Modal>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

const LIMIT = 10;

export default function PaymentsPage() {
  const formMethods = useForm({ defaultValues: getPaymentFilterDefaults() });
  const [filterData, setFilterData] = React.useState<Record<string, { method: string; value: string }>>(getPaymentFilterDefaults());

  const [columns,       setColumns]       = React.useState<ColumnPref[]>(PAYMENTS_DEFAULT_COLUMNS);
  const [filtersOpen,   setFiltersOpen]   = React.useState(false);
  const [prefsOpen,     setPrefsOpen]     = React.useState(false);
  const [uploadOpen,    setUploadOpen]    = React.useState(false);
  const [downloadOpen,  setDownloadOpen]  = React.useState(false);
  const [page,          setPage]          = React.useState(1);
  const [detailPayment, setDetailPayment] = React.useState<PaymentRecord | null>(null);

  const onChangeFilter = React.useCallback((values: Record<string, unknown>) => {
    setFilterData(prev => ({ ...prev, ...(values as Record<string, { method: string; value: string }>) }));
    setPage(1);
  }, []);

  const onResetAllFilters = React.useCallback(() => {
    const defaults = getPaymentFilterDefaults();
    formMethods.reset(defaults);
    setFilterData(defaults);
    setPage(1);
  }, [formMethods]);

  // ── KPI calculations ─────────────────────────────────────────────────────────
  const currentMonth    = "2026-05";
  const mtdRecords      = PAYMENT_RECORDS.filter(p => p.paymentDatetime.startsWith(currentMonth));
  const totalMtd        = mtdRecords.reduce((s, p) => s + p.amount, 0);
  const rentalMtd       = mtdRecords.filter(p => p.paymentType === "RENTAL").reduce((s, p) => s + p.amount, 0);
  const subscriptionMtd = mtdRecords.filter(p => p.paymentType === "SUBSCRIPTION").reduce((s, p) => s + p.amount, 0);
  const uniquePayingEvos = new Set(PAYMENT_RECORDS.filter(p => p.paymentType === "RENTAL").map(p => p.evoCode)).size;

  // ── Filtered data ────────────────────────────────────────────────────────────
  const filtered = React.useMemo(() => {
    return PAYMENT_RECORDS.filter(p => {
      const fields: Record<string, string | number> = {
        paymentReference: p.paymentReference,
        evoCode:          p.evoCode,
        evoName:          p.evoName,
        paymentDatetime:  p.paymentDatetime,
        amount:           p.amount,
        paymentChannel:   p.paymentChannel,
        paymentType:      p.paymentType,
        status:           p.status,
        emcName:          p.emcName,
      };
      return Object.entries(filterData).every(([key, { method, value }]) =>
        applyFilterMethod(fields[key], method, value)
      );
    }).sort((a, b) => b.paymentDatetime.localeCompare(a.paymentDatetime));
  }, [filterData]);

  const activeFiltersCount = Object.values(filterData).filter(f => f.value !== "").length;
  const handleColumnReset  = () => setColumns(PAYMENTS_DEFAULT_COLUMNS);

  // ── Shortcut active check ────────────────────────────────────────────────────
  const isPaymentRefActive = !!filterData.paymentReference?.value;

  // ── Left actions ─────────────────────────────────────────────────────────────
  const leftActions = [
    <ShortcutFilterButton key="payref" label="Payment Reference" isActive={isPaymentRefActive}>
      <FilterMethod
        name="paymentReference"
        type={FilterType.Str}
        method={Method.Contains}
        formControl={formMethods}
        onChangeFilter={onChangeFilter}
      />
    </ShortcutFilterButton>,
  ];

  // ── Table ────────────────────────────────────────────────────────────────────
  const visibleKeys = new Set(columns.filter(c => c.visible).map(c => c.key));

  const allRows: Record<string, (p: PaymentRecord) => React.ReactNode> = {
    evoCode:    p => <span style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 600, color: EVCORE_COLORS.green }}>{p.evoCode}</span>,
    evoName:    p => <span style={{ fontSize: 13, fontWeight: 600, color: EVCORE_COLORS.textPrimary }}>{p.evoName}</span>,
    emc:        p => <span style={{ fontSize: 12 }}>{p.emcName}</span>,
    type:       p => { const t = TYPE_CHIP[p.paymentType];    return <StatusChip type={t.type}>{t.label}</StatusChip>; },
    amount:     p => <span style={{ fontSize: 13, fontWeight: 700, color: EVCORE_COLORS.textPrimary, fontFamily: "monospace" }}>{p.currency} {p.amount}.00</span>,
    channel:    p => { const c = CHANNEL_CHIP[p.paymentChannel]; return <StatusChip type={c.type}>{c.label}</StatusChip>; },
    status:     p => { const s = STATUS_CHIP[p.status];          return <StatusChip type={s.type}>{s.label}</StatusChip>; },
    activation: p => p.activationCodeGenerated
      ? <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 11, color: "#0F6E56", fontWeight: 600 }}><Zap size={11} />Yes</span>
      : <span style={{ fontSize: 11, color: EVCORE_COLORS.textSecondary }}>—</span>,
    date:       p => <span style={{ fontSize: 11, color: EVCORE_COLORS.textSecondary }}>{new Date(p.paymentDatetime).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</span>,
  };

  const tableData = filtered.map(p => ({
    id: p.id,
    ...Object.fromEntries(Object.entries(allRows).filter(([k]) => visibleKeys.has(k)).map(([k, fn]) => [k, fn(p)])),
    _raw: p,
  }));

  const colDefsMap: Record<string, string> = {
    evoCode: "EVO Code", evoName: "EVO Name", emc: "EMC", type: "Type",
    amount: "Amount", channel: "Channel", status: "Status", activation: "Activation", date: "Date",
  };
  const colDefs = columns.filter(c => c.visible).map(c => ({ headerName: colDefsMap[c.key] ?? c.label, type: TableCellType.component, key: c.key }));

  const rowActions = (row: Record<string, number | string | React.ReactNode | object>) => (
    <RowActionBtn icon={<Eye size={14} />} title="View payment" onClick={() => setDetailPayment(row._raw as PaymentRecord)} variant="green" />
  );

  return (
    <>
      <AppShell pageTitle="Payments">
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          <div>
            <PageHeader
              title="Payment Records"
              actions={[
                { label: "Upload Payments", kind: ButtonKind.Ghost, onClick: () => setUploadOpen(true) },
              ]}
              onClickDownload={() => setDownloadOpen(true)}
            />
            <div style={{ fontSize: 12, color: EVCORE_COLORS.textSecondary, marginTop: 4 }}>
              {filtered.length} {filtered.length === 1 ? "record" : "records"}{activeFiltersCount > 0 ? " matching filters" : " total"} · M-Pesa · Airtel Money · Orange Money
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
            <KpiCard label="Collected MTD" value={`$${totalMtd}`}           delta="May 2026"       deltaType="positive" icon={TrendingUp} />
            <KpiCard label="Rental Fees"   value={`$${rentalMtd}`}          delta="Rental MTD"     deltaType="positive" icon={CreditCard} />
            <KpiCard label="Subscriptions" value={`$${subscriptionMtd}`}    delta="Onboarding MTD" deltaType="neutral"  icon={CreditCard} />
            <KpiCard label="Paying EVOs"   value={String(uniquePayingEvos)} delta="On rental plan" deltaType="positive" icon={Users} />
          </div>

          <FiltersBar
            leftActions={leftActions}
            activeFiltersCount={activeFiltersCount}
            onClickFilter={() => setFiltersOpen(true)}
            onClickPreferences={() => setPrefsOpen(true)}
            
          />

          {filtered.length === 0 ? (
            <div style={{ backgroundColor: EVCORE_COLORS.white, border: `0.5px solid ${EVCORE_COLORS.border}`, borderRadius: 12, padding: "48px 24px", textAlign: "center" }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: EVCORE_COLORS.textPrimary, marginBottom: 8 }}>No payments found</div>
              <div style={{ fontSize: 12, color: EVCORE_COLORS.textSecondary, marginBottom: 16 }}>No records match your current filters.</div>
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
      <PaymentDetailModal payment={detailPayment} onClose={() => setDetailPayment(null)} />
      <UploadPaymentsModal opened={uploadOpen}   onClose={() => setUploadOpen(false)} />
      <DownloadModal       opened={downloadOpen} onClose={() => setDownloadOpen(false)} columns={columns} />

      {/* Filter drawer */}
      <EvoFormFiltersDrawer
        sections={EVO_PAYMENT_FILTER_SECTIONS}
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
