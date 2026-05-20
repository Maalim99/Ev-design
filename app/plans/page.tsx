"use client";

import * as React from "react";
import { CreditCard, Users, TrendingUp, Eye, ToggleLeft, ToggleRight } from "lucide-react";
import { AppShell } from "@/components/evcore/layout/AppShell";
import { KpiCard } from "@/components/evcore/ui/KpiCard";
import { EvoFiltersDrawer } from "@/components/evcore/filters/EvoFiltersDrawer";
import { EvoPreferencesDrawer, type ColumnPref } from "@/components/evcore/filters/EvoPreferencesDrawer";
import { PageHeader } from "@/components/lamt/page-header";
import { FiltersBar } from "@/components/lamt/filters-bar";
import { Table, TableCellType, PaginationStrategy } from "@/components/lamt/table";
import { Modal } from "@/components/lamt/modal";
import { TextInput } from "@/components/lamt/text-input";
import { ButtonKind } from "@/components/lamt/button";
import { RENTAL_PLANS, EVO_ACCOUNTS, type RentalPlan } from "@/data/dummy";
import { EVCORE_COLORS } from "@/lib/evcore/constants";
import { PLANS_FILTER_SECTIONS, PLANS_DEFAULT_COLUMNS } from "@/lib/evcore/filterConfigs";

// ─── Helpers ───────────────────────────────────────────────────────────────────

const FORM_LABEL: React.CSSProperties = {
  display: "block", fontSize: 11, fontWeight: 600,
  color: EVCORE_COLORS.textSecondary, textTransform: "uppercase",
  letterSpacing: "0.04em", marginBottom: 5,
};

function ActiveChip({ active }: { active: boolean }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", height: 22, padding: "0 9px", borderRadius: 99, fontSize: 10, fontWeight: 600, backgroundColor: active ? "#E1F5EE" : "#F3F3F1", color: active ? "#0F6E56" : "#6B7280" }}>
      {active ? "Active" : "Inactive"}
    </span>
  );
}

// ─── Plan Detail Modal ─────────────────────────────────────────────────────────

function PlanDetailModal({ plan, evoCount, onClose }: { plan: RentalPlan | null; evoCount: number; onClose: () => void }) {
  if (!plan) return null;

  const weeklyRevenue = plan.dailyRentalFee * 6 + plan.sundayRentalFee * 1;
  const monthlyRevenue = plan.dailyRentalFee * 26 + plan.sundayRentalFee * 4;

  const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `0.5px solid ${EVCORE_COLORS.border}` }}>
      <span style={{ fontSize: 12, color: EVCORE_COLORS.textSecondary, fontWeight: 500 }}>{label}</span>
      <span style={{ fontSize: 13, color: EVCORE_COLORS.textPrimary, fontWeight: 600 }}>{value}</span>
    </div>
  );

  return (
    <Modal opened title="Plan Details" maxWidth={520} onClose={onClose}>
      {/* Plan code banner */}
      <div style={{ padding: "12px 16px", borderRadius: 10, backgroundColor: EVCORE_COLORS.pageBg, marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <span style={{ fontFamily: "monospace", fontSize: 15, fontWeight: 800, color: EVCORE_COLORS.green }}>{plan.code}</span>
          <div style={{ fontSize: 12, color: EVCORE_COLORS.textSecondary, marginTop: 3 }}>{plan.name}</div>
        </div>
        <ActiveChip active={plan.isActive} />
      </div>

      {/* Fields */}
      <div style={{ marginBottom: 20 }}>
        <Row label="Product Code"          value={<span style={{ fontFamily: "monospace", fontSize: 12 }}>{plan.productCode}</span>} />
        <Row label="Subscription Fee"      value={`$${plan.subscriptionFee}.00 (one-time)`} />
        <Row label="Daily Rental (Mon–Sat)" value={`$${plan.dailyRentalFee}.00 / day`} />
        <Row label="Sunday Rental"         value={`$${plan.sundayRentalFee}.00 / day`} />
        <Row label="Rental Period"         value={`${plan.rentalPeriodMonths} months`} />
        <Row label="Total Contract Value"  value={<span style={{ fontWeight: 800, color: EVCORE_COLORS.green }}>${plan.totalContractValue.toLocaleString()}.00</span>} />
        <Row label="Est. Weekly / EVO"     value={`$${weeklyRevenue}.00`} />
        <Row label="Est. Monthly / EVO"    value={`$${monthlyRevenue}.00`} />
        <Row label="EVOs Enrolled"         value={<strong style={{ color: EVCORE_COLORS.textPrimary }}>{evoCount}</strong>} />
      </div>

      {/* Revenue at current enrolment */}
      {evoCount > 0 && (
        <div style={{ backgroundColor: "#EBF8F3", border: `0.5px solid ${EVCORE_COLORS.greenLight}`, borderRadius: 8, padding: "11px 14px", marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: "#0F6E56", marginBottom: 4, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>Revenue at current enrolment ({evoCount} EVOs)</div>
          <div style={{ display: "flex", gap: 24 }}>
            <div>
              <div style={{ fontSize: 11, color: "#0F6E56" }}>Weekly</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#0F6E56" }}>${(weeklyRevenue * evoCount).toLocaleString()}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "#0F6E56" }}>Monthly</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#0F6E56" }}>${(monthlyRevenue * evoCount).toLocaleString()}</div>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button onClick={onClose} style={{ height: 38, padding: "0 20px", border: `0.5px solid ${EVCORE_COLORS.border}`, borderRadius: 8, backgroundColor: "transparent", fontSize: 13, color: EVCORE_COLORS.textSecondary, cursor: "pointer" }}>
          Close
        </button>
      </div>
    </Modal>
  );
}

// ─── Deactivate / Activate Confirm Modal ──────────────────────────────────────

function ToggleActiveModal({ plan, evoCount, onClose }: { plan: RentalPlan | null; evoCount: number; onClose: () => void }) {
  if (!plan) return null;
  const isDeactivating = plan.isActive;

  return (
    <Modal
      opened
      title={isDeactivating ? "Deactivate Plan" : "Activate Plan"}
      maxWidth={480}
      onClose={onClose}
    >
      {/* Plan banner */}
      <div style={{ padding: "12px 16px", borderRadius: 10, backgroundColor: EVCORE_COLORS.pageBg, marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <span style={{ fontFamily: "monospace", fontSize: 15, fontWeight: 800, color: EVCORE_COLORS.green }}>{plan.code}</span>
          <div style={{ fontSize: 12, color: EVCORE_COLORS.textSecondary, marginTop: 3 }}>{plan.name} · {plan.productCode}</div>
        </div>
        <ActiveChip active={plan.isActive} />
      </div>

      {/* Warning if EVOs enrolled and deactivating */}
      {isDeactivating && evoCount > 0 && (
        <div style={{ backgroundColor: "#FEF9EE", border: `0.5px solid ${EVCORE_COLORS.amber}`, borderRadius: 8, padding: "11px 14px", marginBottom: 16, display: "flex", gap: 10, alignItems: "flex-start" }}>
          <span style={{ fontSize: 16, flexShrink: 0 }}>⚠</span>
          <div style={{ fontSize: 13, color: "#854F0B", lineHeight: 1.6 }}>
            <strong>{evoCount} EVO{evoCount !== 1 ? "s" : ""}</strong> {evoCount === 1 ? "is" : "are"} currently enrolled on this plan. Deactivating will prevent new enrolments but will <strong>not</strong> affect existing contracts.
          </div>
        </div>
      )}

      {/* Confirmation message */}
      <p style={{ fontSize: 13, color: EVCORE_COLORS.textPrimary, lineHeight: 1.7, marginBottom: 24 }}>
        {isDeactivating
          ? "Are you sure you want to deactivate this plan? It will no longer be available for new EVO enrolments."
          : "Are you sure you want to activate this plan? It will become available for new EVO enrolments."}
      </p>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button
          onClick={onClose}
          style={{ height: 40, padding: "0 20px", border: `0.5px solid ${EVCORE_COLORS.border}`, borderRadius: 8, backgroundColor: "transparent", fontSize: 13, color: EVCORE_COLORS.textSecondary, cursor: "pointer" }}
        >
          Cancel
        </button>
        <button
          onClick={onClose}
          style={{ height: 40, padding: "0 22px", border: "none", borderRadius: 8, backgroundColor: isDeactivating ? EVCORE_COLORS.danger : EVCORE_COLORS.green, fontSize: 13, fontWeight: 700, color: EVCORE_COLORS.white, cursor: "pointer" }}
        >
          {isDeactivating ? "Yes, Deactivate" : "Yes, Activate"}
        </button>
      </div>
    </Modal>
  );
}

// ─── Create Plan Modal ─────────────────────────────────────────────────────────

function CreatePlanModal({ opened, onClose }: { opened: boolean; onClose: () => void }) {
  const [isActive, setIsActive] = React.useState(true);
  return (
    <Modal opened={opened} title="Create Rental Plan" maxWidth={560} onClose={onClose}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div><label style={FORM_LABEL}>Plan Code</label><TextInput name="code" placeholder="SF5.RF7.RP36" /></div>
          <div><label style={FORM_LABEL}>Plan Name</label><TextInput name="name" placeholder="e.g. F3 Premium 36M" /></div>
        </div>
        <div>
          <label style={FORM_LABEL}>Product Code</label>
          <TextInput name="productCode" placeholder="e.g. ALTECH-F3-2B" />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div><label style={FORM_LABEL}>Subscription Fee ($)</label><TextInput name="subscriptionFee" type="number" placeholder="5" /></div>
          <div><label style={FORM_LABEL}>Daily Rental Mon–Sat ($)</label><TextInput name="dailyRentalFee" type="number" placeholder="7" /></div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div><label style={FORM_LABEL}>Sunday Rental ($)</label><TextInput name="sundayRentalFee" type="number" placeholder="5" /></div>
          <div><label style={FORM_LABEL}>Rental Period (months)</label><TextInput name="rentalPeriodMonths" type="number" placeholder="36" /></div>
        </div>
        <div><label style={FORM_LABEL}>Total Contract Value ($)</label><TextInput name="totalContractValue" type="number" placeholder="7277" /></div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 4 }}>
          <span style={{ fontSize: 13, color: EVCORE_COLORS.textPrimary }}>Active Plan</span>
          <div onClick={() => setIsActive(v => !v)} style={{ width: 40, height: 22, borderRadius: 99, cursor: "pointer", position: "relative", backgroundColor: isActive ? EVCORE_COLORS.green : EVCORE_COLORS.gray, transition: "background-color 0.2s" }}>
            <div style={{ position: "absolute", top: 3, width: 16, height: 16, left: isActive ? 21 : 3, borderRadius: "50%", backgroundColor: EVCORE_COLORS.white, transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 16, borderTop: `0.5px solid ${EVCORE_COLORS.border}`, marginTop: 8 }}>
          <button onClick={onClose} style={{ height: 40, padding: "0 20px", border: `0.5px solid ${EVCORE_COLORS.border}`, borderRadius: 8, backgroundColor: "transparent", fontSize: 13, color: EVCORE_COLORS.textSecondary, cursor: "pointer" }}>Cancel</button>
          <button style={{ height: 40, padding: "0 22px", border: "none", borderRadius: 8, backgroundColor: EVCORE_COLORS.green, fontSize: 13, fontWeight: 700, color: EVCORE_COLORS.white, cursor: "pointer" }}>Create Plan</button>
        </div>
      </div>
    </Modal>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function PlansPage() {
  const [filterValues, setFilterValues] = React.useState<Record<string, string[]>>({});
  const [columns,      setColumns]      = React.useState<ColumnPref[]>(PLANS_DEFAULT_COLUMNS);
  const [filtersOpen,  setFiltersOpen]  = React.useState(false);
  const [prefsOpen,    setPrefsOpen]    = React.useState(false);
  const [page,         setPage]         = React.useState(1);
  const [detailPlan,   setDetailPlan]   = React.useState<RentalPlan | null>(null);
  const [togglePlan,   setTogglePlan]   = React.useState<RentalPlan | null>(null);
  const [createOpen,   setCreateOpen]   = React.useState(false);

  const enriched = React.useMemo(() =>
    RENTAL_PLANS.map(p => ({
      ...p,
      evoCount: EVO_ACCOUNTS.filter(e => e.rentalPlan === p.code).length,
    })),
    []
  );

  const filtered = React.useMemo(() => {
    const statuses = filterValues.status  ?? [];
    const products = filterValues.product ?? [];
    return enriched.filter(p =>
      (!statuses.length || statuses.some(s => s === "ACTIVE" ? p.isActive : !p.isActive)) &&
      (!products.length || products.includes(p.productCode))
    );
  }, [enriched, filterValues]);

  const activeFiltersCount = Object.values(filterValues).reduce((a, v) => a + v.length, 0);
  const handleFilterChange = (id: string, selected: string[]) => { setFilterValues(prev => ({ ...prev, [id]: selected })); setPage(1); };
  const handleFilterReset  = () => { setFilterValues({}); setPage(1); };
  const handleColumnReset  = () => setColumns(PLANS_DEFAULT_COLUMNS);

  const totalEnrolled   = enriched.reduce((s, p) => s + p.evoCount, 0);
  const activePlans     = enriched.filter(p => p.isActive).length;
  const topPlan         = [...enriched].sort((a, b) => b.evoCount - a.evoCount)[0];
  const totalMonthlyRev = enriched.reduce((s, p) => s + (p.dailyRentalFee * 26 + p.sundayRentalFee * 4) * p.evoCount, 0);

  type EnrichedPlan = typeof enriched[0];

  const visibleKeys = new Set(columns.filter(c => c.visible).map(c => c.key));

  const allRows: Record<string, (p: EnrichedPlan) => React.ReactNode> = {
    code:    p => <span style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 700, color: EVCORE_COLORS.green }}>{p.code}</span>,
    name:    p => <span style={{ fontSize: 13, fontWeight: 600, color: EVCORE_COLORS.textPrimary }}>{p.name}</span>,
    product: p => <span style={{ fontFamily: "monospace", fontSize: 11, color: EVCORE_COLORS.textSecondary }}>{p.productCode}</span>,
    sf:      p => <span style={{ fontSize: 12, fontFamily: "monospace" }}>${p.subscriptionFee}.00</span>,
    rf:      p => <span style={{ fontSize: 12, fontFamily: "monospace" }}>${p.dailyRentalFee}.00 / ${p.sundayRentalFee}.00</span>,
    rp:      p => <span style={{ fontSize: 12 }}>{p.rentalPeriodMonths} months</span>,
    tcv:     p => <span style={{ fontSize: 13, fontWeight: 700, fontFamily: "monospace", color: EVCORE_COLORS.green }}>${p.totalContractValue.toLocaleString()}</span>,
    evos:    p => <span style={{ fontSize: 13, fontWeight: 700, color: p.evoCount > 0 ? EVCORE_COLORS.textPrimary : EVCORE_COLORS.textSecondary }}>{p.evoCount}</span>,
    status:  p => <ActiveChip active={p.isActive} />,
  };

  const tableData = filtered.map(p => ({
    id: p.code,
    ...Object.fromEntries(Object.entries(allRows).filter(([k]) => visibleKeys.has(k)).map(([k, fn]) => [k, fn(p)])),
    _raw: p,
  }));

  const colDefsMap: Record<string, string> = {
    code: "Code", name: "Name", product: "Product", sf: "Subscription Fee",
    rf: "Daily / Sunday Rate", rp: "Rental Period", tcv: "Contract Value",
    evos: "EVOs Enrolled", status: "Status",
  };
  const colDefs = columns.filter(c => c.visible).map(c => ({ headerName: colDefsMap[c.key] ?? c.label, type: TableCellType.component, key: c.key }));

  const rowActions = (row: Record<string, number | string | React.ReactNode | object>) => (
    <div style={{ display: "flex", gap: 4 }}>
      <button
        onClick={() => setDetailPlan(row._raw as RentalPlan)}
        style={{ display: "inline-flex", alignItems: "center", gap: 4, height: 26, padding: "0 9px", borderRadius: 6, border: `0.5px solid ${EVCORE_COLORS.border}`, backgroundColor: "transparent", fontSize: 11, fontWeight: 500, color: EVCORE_COLORS.textSecondary, cursor: "pointer" }}
      >
        <Eye size={10} /> View
      </button>
      <button
        onClick={() => setTogglePlan(row._raw as RentalPlan)}
        title={(row._raw as RentalPlan).isActive ? "Deactivate plan" : "Activate plan"}
        style={{ display: "inline-flex", alignItems: "center", gap: 4, height: 26, padding: "0 9px", borderRadius: 6, border: `0.5px solid ${EVCORE_COLORS.border}`, backgroundColor: "transparent", fontSize: 11, fontWeight: 500, cursor: "pointer", color: (row._raw as RentalPlan).isActive ? EVCORE_COLORS.danger : EVCORE_COLORS.green }}
      >
        {(row._raw as RentalPlan).isActive ? <><ToggleLeft size={12} /> Deactivate</> : <><ToggleRight size={12} /> Activate</>}
      </button>
    </div>
  );

  const detailEvoCount = detailPlan ? enriched.find(p => p.code === detailPlan.code)?.evoCount ?? 0 : 0;
  const toggleEvoCount = togglePlan ? enriched.find(p => p.code === togglePlan.code)?.evoCount ?? 0 : 0;

  return (
    <>
      <AppShell pageTitle="Pay Plans">
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          <div>
            <PageHeader
              title="Rental Pay Plans"
              actions={[{ label: "+ Create Plan", kind: ButtonKind.Primary, onClick: () => setCreateOpen(true) }]}
            />
            <div style={{ fontSize: 12, color: EVCORE_COLORS.textSecondary, marginTop: 4 }}>
              {filtered.length} of {RENTAL_PLANS.length} plans{activeFiltersCount > 0 ? " matching filters" : ""} · SF = Subscription Fee · RF = Daily Rental (Mon–Sat) · RP = Rental Period in months
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
            <KpiCard label="Active Plans"    value={String(activePlans)}                   delta="Available to assign"   deltaType="positive" icon={ToggleLeft} />
            <KpiCard label="Total Enrolled"  value={String(totalEnrolled)}                 delta="EVOs on a plan"        deltaType="positive" icon={Users} />
            <KpiCard label="Most Popular"    value={topPlan?.code ?? "—"}                  delta={`${topPlan?.evoCount ?? 0} EVOs`} deltaType="neutral" icon={CreditCard} />
            <KpiCard label="Monthly Revenue" value={`$${totalMonthlyRev.toLocaleString()}`} delta="Est. across all plans" deltaType="positive" icon={TrendingUp} />
          </div>

          <FiltersBar
            activeFiltersCount={activeFiltersCount}
            onClickFilter={() => setFiltersOpen(true)}
            onClickPreferences={() => setPrefsOpen(true)}
            onClearFilter={activeFiltersCount > 0 ? handleFilterReset : undefined}
          />

          {filtered.length === 0 ? (
            <div style={{ backgroundColor: EVCORE_COLORS.white, border: `0.5px solid ${EVCORE_COLORS.border}`, borderRadius: 12, padding: "48px 24px", textAlign: "center" }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: EVCORE_COLORS.textPrimary, marginBottom: 8 }}>No plans found</div>
              <button onClick={handleFilterReset} style={{ height: 34, padding: "0 18px", borderRadius: 8, border: `0.5px solid ${EVCORE_COLORS.border}`, backgroundColor: "transparent", fontSize: 12, color: EVCORE_COLORS.textSecondary, cursor: "pointer" }}>Clear filters</button>
            </div>
          ) : (
            <div style={{ backgroundColor: EVCORE_COLORS.white, border: `0.5px solid ${EVCORE_COLORS.border}`, borderRadius: 12, overflow: "hidden" }}>
              <Table hasActions rowActions={rowActions} data={tableData} colDefs={colDefs}
                currentPageNumber={page} limit={10} totalData={filtered.length}
                paginationStrategy={PaginationStrategy.LOCAL} onPageChange={setPage} showCheckbox={false} />
            </div>
          )}

          <div style={{ backgroundColor: "#EBF8F3", border: `0.5px solid ${EVCORE_COLORS.greenLight}`, borderRadius: 8, padding: "11px 14px", fontSize: 12, color: "#0F6E56", lineHeight: 1.6 }}>
            <strong>Billing:</strong> Daily rental applies Mon–Sat. Sunday rate is reduced. Activation code valid 06:00–21:00 (15h window), expires after 48h. Generated via Omnivoltaic IoT on confirmed payment.
          </div>
        </div>
      </AppShell>

      <PlanDetailModal plan={detailPlan} evoCount={detailEvoCount} onClose={() => setDetailPlan(null)} />
      <ToggleActiveModal plan={togglePlan} evoCount={toggleEvoCount} onClose={() => setTogglePlan(null)} />
      <CreatePlanModal opened={createOpen} onClose={() => setCreateOpen(false)} />

      <EvoFiltersDrawer
        opened={filtersOpen} onClose={() => setFiltersOpen(false)}
        sections={PLANS_FILTER_SECTIONS} values={filterValues}
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
