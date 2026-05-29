"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Truck, Radio, Wrench, CircleDot, Eye } from "lucide-react";
import { RowActionBtn } from "@/components/evcore/ui/RowActionBtn";
import { AppShell } from "@/components/evcore/layout/AppShell";
import { KpiCard } from "@/components/evcore/ui/KpiCard";
import { EvoFiltersDrawer } from "@/components/evcore/filters/EvoFiltersDrawer";
import { EvoPreferencesDrawer, type ColumnPref } from "@/components/evcore/filters/EvoPreferencesDrawer";
import { PageHeader } from "@/components/lamt/page-header";
import { FiltersBar } from "@/components/lamt/filters-bar";
import { Table, TableCellType, PaginationStrategy } from "@/components/lamt/table";
import { Tabs, type TabItem } from "@/components/lamt/tabs";
import { ButtonKind } from "@/components/lamt/button";
import { StatusChip, StatusChipType } from "@/components/lamt/status-chip";
import { FLEET_ASSETS, EMC_BATTERIES, type AssetFleetStatus, type AssetEvType } from "@/data/dummy";
import { RegisterAssetModal } from "@/components/evcore/modals/RegisterAssetModal";
import { EVCORE_COLORS } from "@/lib/evcore/constants";
import { ASSETS_FILTER_SECTIONS, ASSETS_DEFAULT_COLUMNS } from "@/lib/evcore/filterConfigs";

// ─── Shared maps ──────────────────────────────────────────────────────────────

const FLEET_STATUS_CHIP: Record<AssetFleetStatus, { type: StatusChipType; label: string }> = {
  ON_ROAD:            { type: StatusChipType.Success,  label: "On Road"            },
  OFF_ROAD_IDLE:      { type: StatusChipType.Accent,   label: "Available"          },
  OFF_ROAD_FAULTY:    { type: StatusChipType.Warning,  label: "Faulty"             },
  RETIRED_PAID_OFF:   { type: StatusChipType.Normal,   label: "Retired – Paid Off" },
  RETIRED_UNDER_PAID: { type: StatusChipType.DangerM,  label: "Retired – Underpaid"},
  RETIRED_OVER_PAID:  { type: StatusChipType.AccentM,  label: "Retired – Overpaid" },
  WRITTEN_OFF:        { type: StatusChipType.Danger,   label: "Written Off"        },
};

const EV_TYPE_LABEL: Record<AssetEvType, string> = {
  TWO_WHEELER:   "2-Wheeler",
  THREE_WHEELER: "3-Wheeler",
  CART:          "Cart",
};

function FleetStatusChip({ status }: { status: AssetFleetStatus }) {
  const { type, label } = FLEET_STATUS_CHIP[status];
  return <StatusChip type={type}>{label}</StatusChip>;
}

// ─── Fleet tab ────────────────────────────────────────────────────────────────

function FleetTab() {
  const router = useRouter();
  const [filterValues, setFilterValues] = React.useState<Record<string, string[]>>({});
  const [columns,      setColumns]      = React.useState<ColumnPref[]>(ASSETS_DEFAULT_COLUMNS);
  const [filtersOpen,  setFiltersOpen]  = React.useState(false);
  const [prefsOpen,    setPrefsOpen]    = React.useState(false);
  const [registerOpen, setRegisterOpen] = React.useState(false);
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

  const rowActions = (row: Record<string, number | string | React.ReactNode | object>) => {
    const a = row._raw as typeof FLEET_ASSETS[0];
    return (
      <RowActionBtn icon={<Eye size={14} />} title="View asset" onClick={() => router.push(`/assets/${a.assetCode}`)} variant="green" />
    );
  };

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div>
          <PageHeader title="EV Fleet" actions={[{ label: "+ Register Asset", kind: ButtonKind.Primary, onClick: () => setRegisterOpen(true) }]} />
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
        />

        <div style={{ backgroundColor: EVCORE_COLORS.white, border: `0.5px solid ${EVCORE_COLORS.border}`, borderRadius: 12, overflow: "hidden" }}>
          <Table hasActions rowActions={rowActions} data={tableData} colDefs={colDefs}
            currentPageNumber={page} limit={10} totalData={filtered.length}
            paginationStrategy={PaginationStrategy.LOCAL} onPageChange={setPage} showCheckbox={false} />
        </div>
      </div>

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

// ─── Batteries tab ────────────────────────────────────────────────────────────

function BatteriesTab() {
  const [page, setPage] = React.useState(1);

  const total   = EMC_BATTERIES.length;
  const onRoad  = EMC_BATTERIES.filter(b => b.status === "ON_ROAD").length;
  const idle    = EMC_BATTERIES.filter(b => b.status === "OFF_ROAD_IDLE").length;
  const faulty  = EMC_BATTERIES.filter(b => b.status === "OFF_ROAD_FAULTY").length;

  const tableData = EMC_BATTERIES.map(b => ({
    id: b.id,
    batteryCode: <span style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 600, color: EVCORE_COLORS.green }}>{b.batteryCode}</span>,
    emc:         <span style={{ fontFamily: "monospace", fontSize: 11, color: EVCORE_COLORS.textSecondary }}>{b.legacyEmcCode}</span>,
    evType:      <span style={{ fontSize: 12 }}>{EV_TYPE_LABEL[b.compatibleEvType]}</span>,
    capacity:    <span style={{ fontSize: 12, fontWeight: 500 }}>{b.capacityKwh} kWh</span>,
    cycles:      <span style={{ fontSize: 12, color: b.cycleCount > 300 ? EVCORE_COLORS.danger : b.cycleCount > 150 ? EVCORE_COLORS.amber : EVCORE_COLORS.textPrimary, fontWeight: 500 }}>{b.cycleCount}</span>,
    range:       <span style={{ fontSize: 12 }}>{b.rangeKm} km</span>,
    status:      <FleetStatusChip status={b.status} />,
    _raw: b,
  }));

  const colDefs = [
    { headerName: "Battery Code", type: TableCellType.component, key: "batteryCode" },
    { headerName: "EMC",          type: TableCellType.component, key: "emc"         },
    { headerName: "Type",         type: TableCellType.component, key: "evType"      },
    { headerName: "Capacity",     type: TableCellType.component, key: "capacity"    },
    { headerName: "Cycles",       type: TableCellType.component, key: "cycles"      },
    { headerName: "Range",        type: TableCellType.component, key: "range"       },
    { headerName: "Status",       type: TableCellType.component, key: "status"      },
  ];

  const rowActions = () => (
    <RowActionBtn icon={<Eye size={14} />} title="View battery" onClick={() => {}} variant="green" />
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <PageHeader title="Battery Inventory" actions={[{ label: "+ Register Battery", kind: ButtonKind.Primary, onClick: () => {} }]} />
        <div style={{ fontSize: 12, color: EVCORE_COLORS.textSecondary, marginTop: 4 }}>
          {total} batteries total
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
        <KpiCard label="Total"     value={String(total)}  delta="All batteries"   deltaType="neutral"  icon={Truck} />
        <KpiCard label="On Road"   value={String(onRoad)} delta="Deployed"        deltaType="positive" icon={Radio} />
        <KpiCard label="Available" value={String(idle)}   delta="At EMC"          deltaType="positive" icon={CircleDot} />
        <KpiCard label="Faulty"    value={String(faulty)} delta="Needs attention" deltaType="negative" icon={Wrench} />
      </div>

      <div style={{ backgroundColor: EVCORE_COLORS.white, border: `0.5px solid ${EVCORE_COLORS.border}`, borderRadius: 12, overflow: "hidden" }}>
        <Table hasActions rowActions={rowActions} data={tableData} colDefs={colDefs}
          currentPageNumber={page} limit={10} totalData={total}
          paginationStrategy={PaginationStrategy.LOCAL} onPageChange={setPage} showCheckbox={false} />
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AssetsPage() {
  const [activeTab, setActiveTab] = React.useState("fleet");

  const tabs: TabItem[] = [
    { id: "fleet",     label: "EV Fleet",           content: <FleetTab /> },
    { id: "batteries", label: "Batteries",          content: <BatteriesTab /> },
  ];

  return (
    <AppShell pageTitle="Assets">
      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
    </AppShell>
  );
}
