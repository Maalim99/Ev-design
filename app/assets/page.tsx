"use client";

import * as React from "react";
import { Truck, Radio, Wrench, CircleDot } from "lucide-react";
import { AppShell } from "@/components/evcore/layout/AppShell";
import { KpiCard } from "@/components/evcore/ui/KpiCard";
import { EvoFiltersDrawer } from "@/components/evcore/filters/EvoFiltersDrawer";
import { EvoPreferencesDrawer, type ColumnPref } from "@/components/evcore/filters/EvoPreferencesDrawer";
import { PageHeader } from "@/components/lamt/page-header";
import { FiltersBar } from "@/components/lamt/filters-bar";
import { Table, TableCellType, PaginationStrategy } from "@/components/lamt/table";
import { ButtonKind } from "@/components/lamt/button";
import { FLEET_ASSETS, type AssetFleetStatus, type AssetEvType } from "@/data/dummy";
import { RegisterAssetModal } from "@/components/evcore/modals/RegisterAssetModal";
import { EVCORE_COLORS } from "@/lib/evcore/constants";
import { ASSETS_FILTER_SECTIONS, ASSETS_DEFAULT_COLUMNS } from "@/lib/evcore/filterConfigs";

const FLEET_STATUS_STYLE: Record<AssetFleetStatus, { label: string; bg: string; text: string }> = {
  ON_ROAD:             { label: "On Road",            bg: "#E1F5EE", text: "#0F6E56" },
  OFF_ROAD_IDLE:       { label: "Available",          bg: "#E6F1FB", text: "#185FA5" },
  OFF_ROAD_FAULTY:     { label: "Faulty",             bg: "#FAEEDA", text: "#854F0B" },
  RETIRED_PAID_OFF:    { label: "Retired – Paid Off", bg: "#F3F3F1", text: "#6B7280" },
  RETIRED_UNDER_PAID:  { label: "Retired – Underpaid",bg: "#FEF9EE", text: "#854F0B" },
  RETIRED_OVER_PAID:   { label: "Retired – Overpaid", bg: "#EFF6FF", text: "#185FA5" },
  WRITTEN_OFF:         { label: "Written Off",        bg: "#FEE2E2", text: "#991B1B" },
};

const EV_TYPE_LABEL: Record<AssetEvType, string> = {
  TWO_WHEELER:   "2-Wheeler",
  THREE_WHEELER: "3-Wheeler",
  CART:          "Cart",
};

function FleetStatusChip({ status }: { status: AssetFleetStatus }) {
  const s = FLEET_STATUS_STYLE[status];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, height: 22, padding: "0 9px", borderRadius: 99, backgroundColor: s.bg, color: s.text, fontSize: 11, fontWeight: 600 }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: s.text }} />
      {s.label}
    </span>
  );
}

function ActionBtn({ label, onClick, color }: { label: string; onClick: () => void; color?: string }) {
  return (
    <button onClick={onClick} style={{ height: 26, padding: "0 9px", borderRadius: 6, border: `0.5px solid ${EVCORE_COLORS.border}`, backgroundColor: "transparent", fontSize: 11, fontWeight: 500, color: color ?? EVCORE_COLORS.textSecondary, cursor: "pointer" }}>
      {label}
    </button>
  );
}

export default function AssetsPage() {
  const [filterValues, setFilterValues] = React.useState<Record<string, string[]>>({});
  const [columns,      setColumns]      = React.useState<ColumnPref[]>(ASSETS_DEFAULT_COLUMNS);
  const [filtersOpen,   setFiltersOpen]   = React.useState(false);
  const [prefsOpen,     setPrefsOpen]     = React.useState(false);
  const [registerOpen,  setRegisterOpen]  = React.useState(false);
  const [page,         setPage]         = React.useState(1);

  const total     = FLEET_ASSETS.length;
  const onRoad    = FLEET_ASSETS.filter(a => a.status === "ON_ROAD").length;
  const available = FLEET_ASSETS.filter(a => a.status === "OFF_ROAD_IDLE").length;
  const faulty    = FLEET_ASSETS.filter(a => a.status === "OFF_ROAD_FAULTY").length;

  const filtered = React.useMemo(() => {
    const statuses = filterValues.status ?? [];
    const types    = filterValues.evType ?? [];
    const emcs     = filterValues.emc    ?? [];
    return FLEET_ASSETS.filter(a =>
      (!statuses.length || statuses.includes(a.status as string)) &&
      (!types.length    || types.includes(a.evType as string)) &&
      (!emcs.length     || emcs.includes(a.emcName))
    );
  }, [filterValues]);

  const activeFiltersCount = Object.values(filterValues).reduce((a, v) => a + v.length, 0);
  const handleFilterChange = (id: string, selected: string[]) => { setFilterValues(p => ({ ...p, [id]: selected })); setPage(1); };
  const handleFilterReset  = () => { setFilterValues({}); setPage(1); };
  const handleColumnReset  = () => setColumns(ASSETS_DEFAULT_COLUMNS);

  const visibleKeys = new Set(columns.filter(c => c.visible).map(c => c.key));

  type AssetRow = typeof FLEET_ASSETS[0];
  const allRows: Record<string, (a: AssetRow) => React.ReactNode> = {
    assetCode:   a => <span style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 600, color: EVCORE_COLORS.green }}>{a.assetCode}</span>,
    productCode: a => <span style={{ fontFamily: "monospace", fontSize: 11, color: EVCORE_COLORS.textSecondary }}>{a.productCode}</span>,
    evType:      a => <span style={{ fontSize: 12 }}>{EV_TYPE_LABEL[a.evType]}</span>,
    emc:         a => <span style={{ fontSize: 12 }}><span style={{ fontFamily: "monospace", fontSize: 11 }}>{a.emcCode}</span><br /><span style={{ color: EVCORE_COLORS.textSecondary }}>{a.emcName}</span></span>,
    status:      a => <FleetStatusChip status={a.status} />,
    assignedEvo: a => a.assignedEvoCode
      ? <span style={{ fontSize: 12 }}><span style={{ fontFamily: "monospace", fontSize: 11, color: EVCORE_COLORS.green }}>{a.assignedEvoCode}</span><br /><span style={{ color: EVCORE_COLORS.textSecondary }}>{a.assignedEvoName}</span></span>
      : <span style={{ fontSize: 11, color: EVCORE_COLORS.textSecondary }}>—</span>,
    invoiceDate: a => <span style={{ fontSize: 11, color: EVCORE_COLORS.textSecondary }}>{a.invoiceDate}</span>,
  };

  const tableData = filtered.map(a => ({
    id: a.id,
    ...Object.fromEntries(Object.entries(allRows).filter(([k]) => visibleKeys.has(k)).map(([k, fn]) => [k, fn(a)])),
    _raw: a,
  }));

  const colDefsMap: Record<string, string> = {
    assetCode: "Asset Code", productCode: "Product Code", evType: "Type",
    emc: "EMC", status: "Status", assignedEvo: "Assigned EVO", invoiceDate: "Invoice Date",
  };
  const colDefs = columns.filter(c => c.visible).map(c => ({ headerName: colDefsMap[c.key] ?? c.label, type: TableCellType.component, key: c.key }));

  const rowActions = () => (
    <div style={{ display: "flex", gap: 4 }}>
      <ActionBtn label="View"        onClick={() => {}} />
      <ActionBtn label="Assign"      onClick={() => {}} color={EVCORE_COLORS.green} />
      <ActionBtn label="Maintenance" onClick={() => {}} color={EVCORE_COLORS.amber} />
    </div>
  );

  return (
    <>
      <AppShell pageTitle="Fleet Assets">
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div>
            <PageHeader title="Fleet Assets" actions={[{ label: "+ Register Asset", kind: ButtonKind.Primary, onClick: () => setRegisterOpen(true) }]} />
            <div style={{ fontSize: 12, color: EVCORE_COLORS.textSecondary, marginTop: 4 }}>
              {filtered.length} assets{activeFiltersCount > 0 ? " matching filters" : " total"}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
            <KpiCard label="Total Fleet" value={String(total)}     delta="All assets"      deltaType="neutral"  icon={Truck} />
            <KpiCard label="On Road"     value={String(onRoad)}    delta="Deployed"        deltaType="positive" icon={Radio} />
            <KpiCard label="Available"   value={String(available)} delta="Ready to assign" deltaType="positive" icon={CircleDot} />
            <KpiCard label="Faulty"      value={String(faulty)}    delta="Needs attention" deltaType="negative" icon={Wrench} />
          </div>

          <FiltersBar
            activeFiltersCount={activeFiltersCount}
            onClickFilter={() => setFiltersOpen(true)}
            onClickPreferences={() => setPrefsOpen(true)}
            onClearFilter={activeFiltersCount > 0 ? handleFilterReset : undefined}
          />

          <div style={{ backgroundColor: EVCORE_COLORS.white, border: `0.5px solid ${EVCORE_COLORS.border}`, borderRadius: 12, overflow: "hidden" }}>
            <Table hasActions rowActions={rowActions} data={tableData} colDefs={colDefs}
              currentPageNumber={page} limit={10} totalData={filtered.length}
              paginationStrategy={PaginationStrategy.LOCAL} onPageChange={setPage} showCheckbox={false} />
          </div>
        </div>
      </AppShell>

      <RegisterAssetModal opened={registerOpen} onClose={() => setRegisterOpen(false)} />

      <EvoFiltersDrawer
        opened={filtersOpen} onClose={() => setFiltersOpen(false)}
        sections={ASSETS_FILTER_SECTIONS} values={filterValues}
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
