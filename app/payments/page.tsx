"use client";

import * as React from "react";
import { CreditCard, TrendingUp, Users, Eye, CheckCircle2, Clock, XCircle, Zap } from "lucide-react";
import { AppShell } from "@/components/evcore/layout/AppShell";
import { KpiCard } from "@/components/evcore/ui/KpiCard";
import { EvoFiltersDrawer } from "@/components/evcore/filters/EvoFiltersDrawer";
import { EvoPreferencesDrawer, type ColumnPref } from "@/components/evcore/filters/EvoPreferencesDrawer";
import { PageHeader } from "@/components/lamt/page-header";
import { FiltersBar } from "@/components/lamt/filters-bar";
import { Table, TableCellType, PaginationStrategy } from "@/components/lamt/table";
import { Modal } from "@/components/lamt/modal";
import { ButtonKind } from "@/components/lamt/button";
import { PAYMENT_RECORDS, type PaymentRecord, type PaymentChannel, type PaymentType, type PaymentStatus } from "@/data/dummy";
import { EVCORE_COLORS } from "@/lib/evcore/constants";
import { PAYMENTS_FILTER_SECTIONS, PAYMENTS_DEFAULT_COLUMNS } from "@/lib/evcore/filterConfigs";

// ─── Chip styles ───────────────────────────────────────────────────────────────

const CHANNEL_STYLE: Record<PaymentChannel, { label: string; bg: string; text: string }> = {
  MPESA:        { label: "M-Pesa",       bg: "#E1F5EE", text: "#0F6E56" },
  AIRTEL_MONEY: { label: "Airtel Money", bg: "#FEE2E2", text: "#991B1B" },
  ORANGE_MONEY: { label: "Orange Money", bg: "#FAEEDA", text: "#854F0B" },
};

const TYPE_STYLE: Record<PaymentType, { label: string; bg: string; text: string }> = {
  SUBSCRIPTION: { label: "Subscription", bg: "#EEF2FF", text: "#3730A3" },
  RENTAL:       { label: "Rental",       bg: "#F0EAFB", text: "#5B21B6" },
};

const STATUS_STYLE: Record<PaymentStatus, { label: string; bg: string; text: string; icon: React.ReactNode }> = {
  COMPLETED: { label: "Completed", bg: "#E1F5EE", text: "#0F6E56", icon: <CheckCircle2 size={10} /> },
  PENDING:   { label: "Pending",   bg: "#FEF9EE", text: "#854F0B", icon: <Clock size={10} /> },
  FAILED:    { label: "Failed",    bg: "#FEE2E2", text: "#991B1B", icon: <XCircle size={10} /> },
};

// ─── Chips ─────────────────────────────────────────────────────────────────────

function Chip({ bg, text, label, icon }: { bg: string; text: string; label: string; icon?: React.ReactNode }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, height: 22, padding: "0 9px", borderRadius: 99, backgroundColor: bg, color: text, fontSize: 11, fontWeight: 600 }}>
      {icon}{label}
    </span>
  );
}

// ─── Payment Detail Modal ──────────────────────────────────────────────────────

function PaymentDetailModal({ payment, onClose }: { payment: PaymentRecord | null; onClose: () => void }) {
  if (!payment) return null;

  const ch = CHANNEL_STYLE[payment.paymentChannel];
  const ty = TYPE_STYLE[payment.paymentType];
  const st = STATUS_STYLE[payment.status];
  const dt = new Date(payment.paymentDatetime);

  const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `0.5px solid ${EVCORE_COLORS.border}` }}>
      <span style={{ fontSize: 12, color: EVCORE_COLORS.textSecondary, fontWeight: 500 }}>{label}</span>
      <span style={{ fontSize: 13, color: EVCORE_COLORS.textPrimary, fontWeight: 600, textAlign: "right" }}>{value}</span>
    </div>
  );

  return (
    <Modal opened title="Payment Details" maxWidth={520} onClose={onClose}>
      {/* EVO banner */}
      <div style={{ padding: "12px 16px", borderRadius: 10, backgroundColor: EVCORE_COLORS.pageBg, marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: EVCORE_COLORS.textPrimary }}>{payment.evoName}</div>
          <div style={{ fontSize: 12, fontFamily: "monospace", color: EVCORE_COLORS.green, marginTop: 3 }}>{payment.evoCode}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: EVCORE_COLORS.textPrimary }}>{payment.currency} {payment.amount}.00</div>
          <Chip {...st} />
        </div>
      </div>

      {/* Detail rows */}
      <div style={{ marginBottom: 20 }}>
        <Row label="Payment Reference"  value={<span style={{ fontFamily: "monospace", fontSize: 12 }}>{payment.paymentReference}</span>} />
        <Row label="Channel Reference"  value={<span style={{ fontFamily: "monospace", fontSize: 12 }}>{payment.channelReference}</span>} />
        <Row label="Payment Type"       value={<Chip {...ty} />} />
        <Row label="Channel"            value={<Chip {...ch} />} />
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
        <button
          onClick={onClose}
          style={{ height: 38, padding: "0 20px", border: `0.5px solid ${EVCORE_COLORS.border}`, borderRadius: 8, backgroundColor: "transparent", fontSize: 13, color: EVCORE_COLORS.textSecondary, cursor: "pointer" }}
        >
          Close
        </button>
      </div>
    </Modal>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function PaymentsPage() {
  const [filterValues, setFilterValues] = React.useState<Record<string, string[]>>({});
  const [columns,      setColumns]      = React.useState<ColumnPref[]>(PAYMENTS_DEFAULT_COLUMNS);
  const [filtersOpen,  setFiltersOpen]  = React.useState(false);
  const [prefsOpen,    setPrefsOpen]    = React.useState(false);
  const [page,         setPage]         = React.useState(1);
  const [detailPayment, setDetailPayment] = React.useState<PaymentRecord | null>(null);
  const LIMIT = 10;

  const currentMonth = "2026-05";
  const mtdRecords      = PAYMENT_RECORDS.filter(p => p.paymentDatetime.startsWith(currentMonth));
  const totalMtd        = mtdRecords.reduce((s, p) => s + p.amount, 0);
  const rentalMtd       = mtdRecords.filter(p => p.paymentType === "RENTAL").reduce((s, p) => s + p.amount, 0);
  const subscriptionMtd = mtdRecords.filter(p => p.paymentType === "SUBSCRIPTION").reduce((s, p) => s + p.amount, 0);
  const uniquePayingEvos = new Set(PAYMENT_RECORDS.filter(p => p.paymentType === "RENTAL").map(p => p.evoCode)).size;

  const filtered = React.useMemo(() => {
    const channels = filterValues.paymentChannel ?? [];
    const types    = filterValues.paymentType    ?? [];
    const statuses = filterValues.status         ?? [];
    const emcs     = filterValues.emc            ?? [];
    return PAYMENT_RECORDS.filter(p =>
      (!channels.length || channels.includes(p.paymentChannel as string)) &&
      (!types.length    || types.includes(p.paymentType as string)) &&
      (!statuses.length || statuses.includes(p.status as string)) &&
      (!emcs.length     || emcs.includes(p.emcName))
    ).sort((a, b) => b.paymentDatetime.localeCompare(a.paymentDatetime));
  }, [filterValues]);

  const activeFiltersCount = Object.values(filterValues).reduce((a, v) => a + v.length, 0);
  const handleFilterChange = (id: string, selected: string[]) => { setFilterValues(p => ({ ...p, [id]: selected })); setPage(1); };
  const handleFilterReset  = () => { setFilterValues({}); setPage(1); };
  const handleColumnReset  = () => setColumns(PAYMENTS_DEFAULT_COLUMNS);

  const tableData = filtered.map(p => ({
    id: p.id,
    evoCode:   <span style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 600, color: EVCORE_COLORS.green }}>{p.evoCode}</span>,
    evoName:   <span style={{ fontSize: 13, fontWeight: 600, color: EVCORE_COLORS.textPrimary }}>{p.evoName}</span>,
    emc:       <span style={{ fontSize: 12 }}>{p.emcName}</span>,
    type:      <Chip {...TYPE_STYLE[p.paymentType]} />,
    amount:    <span style={{ fontSize: 13, fontWeight: 700, color: EVCORE_COLORS.textPrimary, fontFamily: "monospace" }}>{p.currency} {p.amount}.00</span>,
    channel:   <Chip {...CHANNEL_STYLE[p.paymentChannel]} />,
    status:    <Chip {...STATUS_STYLE[p.status]} />,
    activation: p.activationCodeGenerated
      ? <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 11, color: "#0F6E56", fontWeight: 600 }}><Zap size={11} />Yes</span>
      : <span style={{ fontSize: 11, color: EVCORE_COLORS.textSecondary }}>—</span>,
    date:      <span style={{ fontSize: 11, color: EVCORE_COLORS.textSecondary }}>{new Date(p.paymentDatetime).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</span>,
    _raw: p,
  }));

  const colDefsMap: Record<string, string> = {
    evoCode: "EVO Code", evoName: "EVO Name", emc: "EMC", type: "Type",
    amount: "Amount", channel: "Channel", status: "Status", activation: "Activation", date: "Date",
  };
  const colDefs = columns.filter(c => c.visible).map(c => ({ headerName: colDefsMap[c.key] ?? c.label, type: TableCellType.component, key: c.key }));

  const rowActions = (row: Record<string, number | string | React.ReactNode | object>) => (
    <button
      onClick={() => setDetailPayment(row._raw as PaymentRecord)}
      style={{ display: "inline-flex", alignItems: "center", gap: 4, height: 26, padding: "0 9px", borderRadius: 6, border: `0.5px solid ${EVCORE_COLORS.border}`, backgroundColor: "transparent", fontSize: 11, fontWeight: 500, color: EVCORE_COLORS.textSecondary, cursor: "pointer" }}
    >
      <Eye size={10} /> View
    </button>
  );

  return (
    <>
      <AppShell pageTitle="Payments">
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          <div>
            <PageHeader title="Payment Records" actions={[{ label: "+ Record Payment", kind: ButtonKind.Primary, onClick: () => {} }]} />
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
            activeFiltersCount={activeFiltersCount}
            onClickFilter={() => setFiltersOpen(true)}
            onClickPreferences={() => setPrefsOpen(true)}
            onClearFilter={activeFiltersCount > 0 ? handleFilterReset : undefined}
          />

          {filtered.length === 0 ? (
            <div style={{ backgroundColor: EVCORE_COLORS.white, border: `0.5px solid ${EVCORE_COLORS.border}`, borderRadius: 12, padding: "48px 24px", textAlign: "center" }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: EVCORE_COLORS.textPrimary, marginBottom: 8 }}>No payments found</div>
              <div style={{ fontSize: 12, color: EVCORE_COLORS.textSecondary, marginBottom: 16 }}>No records match your current filters.</div>
              <button onClick={handleFilterReset} style={{ height: 34, padding: "0 18px", borderRadius: 8, border: `0.5px solid ${EVCORE_COLORS.border}`, backgroundColor: "transparent", fontSize: 12, fontWeight: 500, color: EVCORE_COLORS.textSecondary, cursor: "pointer" }}>Clear filters</button>
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

      <PaymentDetailModal payment={detailPayment} onClose={() => setDetailPayment(null)} />

      <EvoFiltersDrawer
        opened={filtersOpen} onClose={() => setFiltersOpen(false)}
        sections={PAYMENTS_FILTER_SECTIONS} values={filterValues}
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
