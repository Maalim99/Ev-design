"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Building2, Zap, MapPin, Users, Maximize2, Minimize2, Eye } from "lucide-react";
import { RowActionBtn } from "@/components/evcore/ui/RowActionBtn";
import { Map, MapMarker, MarkerContent, MarkerPopup, MapControls } from "@/components/ui/map";
import { AppShell } from "@/components/evcore/layout/AppShell";
import { KpiCard } from "@/components/evcore/ui/KpiCard";
import { EvoFiltersDrawer } from "@/components/lamt/evo-filters-drawer";
import { EvoPreferencesDrawer } from "@/components/lamt/evo-preferences-drawer";
import { PageHeader } from "@/components/lamt/page-header";
import { ButtonKind } from "@/components/lamt/button";
import { FiltersBar } from "@/components/lamt/filters-bar";
import { Modal } from "@/components/lamt/modal";
import { Table, TableCellType, PaginationStrategy } from "@/components/lamt/table";
import { TextInput } from "@/components/lamt/text-input";
import { DUMMY_EMCS, EVO_ACCOUNTS } from "@/data/dummy";
import { EVCORE_COLORS } from "@/lib/evcore/constants";
import { EMCS_FILTER_SECTIONS, EMCS_DEFAULT_COLUMNS } from "@/lib/evcore/filterConfigs";
import { StatusChip, StatusChipType } from "@/components/lamt/status-chip";

// ─── Helpers ───────────────────────────────────────────────────────────────────

const FORM_LABEL: React.CSSProperties = {
  display: "block",
  fontSize: 11,
  fontWeight: 600,
  color: EVCORE_COLORS.textSecondary,
  textTransform: "uppercase",
  letterSpacing: "0.04em",
  marginBottom: 5,
};

const EmcStatusChip = ({ active }: { active: boolean }) => (
  <StatusChip type={active ? StatusChipType.Success : StatusChipType.Normal}>
    {active ? "Active" : "Inactive"}
  </StatusChip>
);

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function EmcsPage() {
  const router = useRouter();

  const [selectedEmcId, setSelectedEmcId] = React.useState(DUMMY_EMCS[0].code);
  const [filterValues,  setFilterValues]  = React.useState<Record<string, string[]>>({});
  const [columns,       setColumns]       = React.useState(EMCS_DEFAULT_COLUMNS);
  const [filtersOpen,   setFiltersOpen]   = React.useState(false);
  const [prefsOpen,     setPrefsOpen]     = React.useState(false);
  const [page,          setPage]          = React.useState(1);
  const [mapExpanded,   setMapExpanded]   = React.useState(false);
  const [addEmcOpen,    setAddEmcOpen]    = React.useState(false);
  const [isActiveForm,  setIsActiveForm]  = React.useState(true);
  const LIMIT = 10;

  const filteredEmcs = React.useMemo(() => {
    const statuses   = filterValues.status   ?? [];
    const provinces  = filterValues.province ?? [];
    return DUMMY_EMCS.filter(emc =>
      (!statuses.length  || statuses.some(s => s === "ACTIVE" ? emc.isActive : !emc.isActive)) &&
      (!provinces.length || provinces.includes(emc.province))
    );
  }, [filterValues]);

  const totalCapacity  = DUMMY_EMCS.reduce((s, e) => s + e.chargingCapacity, 0);
  const activeCount    = DUMMY_EMCS.filter(e => e.isActive).length;
  const activeFiltersCount = Object.values(filterValues).reduce((a, v) => a + v.length, 0);

  const handleFilterChange = (id: string, selected: string[]) => { setFilterValues(p => ({ ...p, [id]: selected })); setPage(1); };
  const handleFilterReset  = () => { setFilterValues({}); setPage(1); };
  const handleColumnReset  = () => setColumns(EMCS_DEFAULT_COLUMNS);

  // ── Table data ─────────────────────────────────────────────────────────────
  const tableData = filteredEmcs.map(emc => ({
    id: emc.code,
    code: (
      <span style={{ fontFamily: "monospace", fontSize: 11, fontWeight: 600, color: EVCORE_COLORS.green }}>
        {emc.code}
      </span>
    ),
    name: (
      <button
        onClick={() => router.push(`/emcs/${emc.code}`)}
        style={{ background: "none", border: "none", padding: 0, cursor: "pointer", fontSize: 13, fontWeight: 600, color: EVCORE_COLORS.textPrimary, fontFamily: "inherit" }}
      >
        {emc.name}
      </button>
    ),
    province: <span style={{ fontSize: 12 }}>{emc.province}</span>,
    manager:  <span style={{ fontSize: 12, color: EVCORE_COLORS.textSecondary }}>{emc.managerName}</span>,
    capacity: <span style={{ fontSize: 12, color: EVCORE_COLORS.textSecondary }}>{emc.chargingCapacity} slots</span>,
    status:   <EmcStatusChip active={emc.isActive} />,
    _raw: emc,
  }));

  const colDefsMap: Record<string, string> = {
    code: "Code", name: "Name", province: "Province",
    manager: "Manager", capacity: "Capacity", status: "Status",
  };
  const colDefs = columns.filter(c => c.visible).map(c => ({ headerName: colDefsMap[c.key] ?? c.label, type: TableCellType.component, key: c.key }));

  const rowActions = (row: Record<string, number | string | React.ReactNode | object>) => {
    const emc = (row._raw as typeof DUMMY_EMCS[0]);
    return (
      <RowActionBtn icon={<Eye size={14} />} title="View EMC" onClick={() => router.push(`/emcs/${emc.code}`)} variant="green" />
    );
  };

  return (
    <>
    <AppShell pageTitle="EMC Centers">
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

        <div>
          <PageHeader
            title="EMC Centers"
            actions={[{ label: "+ Add EMC", kind: ButtonKind.Primary, onClick: () => setAddEmcOpen(true) }]}
          />
          <div style={{ fontSize: 12, color: EVCORE_COLORS.textSecondary, marginTop: 2 }}>
            {filteredEmcs.length} {filteredEmcs.length === 1 ? "center" : "centers"}{activeFiltersCount > 0 ? " matching filters" : " total"}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
          <KpiCard label="Total EMCs"     value={String(DUMMY_EMCS.length)}  delta="Operational centers" deltaType="neutral"  icon={Building2} />
          <KpiCard label="Active EMCs"    value={String(activeCount)}         delta="Operational"         deltaType="positive" icon={MapPin} />
          <KpiCard label="Total Capacity" value={String(totalCapacity)}       delta="Charging slots"      deltaType="neutral"  icon={Zap} />
          <KpiCard label="Total EVOs"     value={String(EVO_ACCOUNTS.length)} delta="Across all EMCs"     deltaType="positive" icon={Users} />
        </div>

        <FiltersBar
          activeFiltersCount={activeFiltersCount}
          onClickFilter={() => setFiltersOpen(true)}
          onClickPreferences={() => setPrefsOpen(true)}
          
        />

        {filteredEmcs.length === 0 ? (
          <div style={{ backgroundColor: EVCORE_COLORS.white, border: `0.5px solid ${EVCORE_COLORS.border}`, borderRadius: 12, padding: "48px 24px", textAlign: "center" }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: EVCORE_COLORS.textPrimary, marginBottom: 8 }}>No EMCs found</div>
            <div style={{ fontSize: 12, color: EVCORE_COLORS.textSecondary, marginBottom: 16 }}>No centers match your current filters.</div>
            <button onClick={handleFilterReset} style={{ height: 34, padding: "0 18px", borderRadius: 8, border: `0.5px solid ${EVCORE_COLORS.border}`, backgroundColor: "transparent", fontSize: 12, fontWeight: 500, color: EVCORE_COLORS.textSecondary, cursor: "pointer" }}>Clear filters</button>
          </div>
        ) : (
          <div style={{ backgroundColor: EVCORE_COLORS.white, border: `0.5px solid ${EVCORE_COLORS.border}`, borderRadius: 12, overflow: "hidden" }}>
            <Table hasActions rowActions={rowActions} data={tableData} colDefs={colDefs}
              currentPageNumber={page} limit={LIMIT} totalData={filteredEmcs.length}
              paginationStrategy={PaginationStrategy.LOCAL} onPageChange={setPage} showCheckbox={false} />
          </div>
        )}

        {/* ── Map panel ──────────────────────────────────────────────────────── */}
        <div
          style={{
            backgroundColor: EVCORE_COLORS.white,
            border: `0.5px solid ${EVCORE_COLORS.border}`,
            borderRadius: 12,
            padding: 16,
          }}
        >
            {/* Map header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: EVCORE_COLORS.textPrimary }}>
                EMC map view
              </span>
              <button
                onClick={() => setMapExpanded(v => !v)}
                title={mapExpanded ? "Collapse map" : "Expand map"}
                style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, borderRadius: 6, border: `0.5px solid ${EVCORE_COLORS.border}`, backgroundColor: "transparent", cursor: "pointer", color: EVCORE_COLORS.textSecondary }}
              >
                {mapExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
              </button>
            </div>

            {/* Map */}
            <div style={{ width: "100%", height: mapExpanded ? 520 : 360, borderRadius: 8, overflow: "hidden", position: "relative" }}>
              <Map center={[24.0, -4.5]} zoom={4.5} theme="light" className="w-full h-full" dragPan={true}>
                <MapControls position="bottom-right" showZoom />
                {DUMMY_EMCS.map(emc => {
                  const isSelected = emc.code === selectedEmcId;
                  const color = emc.isActive ? "#1D9E75" : "#B4B2A9";
                  return (
                    <MapMarker
                      key={emc.code}
                      longitude={emc.longitude}
                      latitude={emc.latitude}
                      onClick={() => setSelectedEmcId(emc.code)}
                    >
                      <MarkerContent>
                        <div
                          style={{
                            width: isSelected ? 22 : 14,
                            height: isSelected ? 22 : 14,
                            borderRadius: "50%",
                            backgroundColor: color,
                            border: isSelected ? "3px solid white" : "2px solid white",
                            boxShadow: isSelected
                              ? `0 0 0 3px ${color}55, 0 2px 6px rgba(0,0,0,0.25)`
                              : "0 1px 4px rgba(0,0,0,0.2)",
                            transition: "all 0.15s ease",
                            cursor: "pointer",
                          }}
                        />
                      </MarkerContent>
                      <MarkerPopup closeButton={false}>
                        <div style={{ padding: "10px 12px", minWidth: 160 }}>
                          <div style={{ fontSize: 12, fontWeight: 700, color: EVCORE_COLORS.textPrimary, marginBottom: 2 }}>
                            {emc.name}
                          </div>
                          <div style={{ fontFamily: "monospace", fontSize: 10, color: EVCORE_COLORS.textSecondary, marginBottom: 6 }}>
                            {emc.code}
                          </div>
                          <div style={{ fontSize: 11, color: EVCORE_COLORS.textSecondary, marginBottom: 8 }}>
                            {emc.chargingCapacity} slots · {emc.batteryInventory} units
                          </div>
                          <div style={{ display: "flex", gap: 6, alignItems: "center", justifyContent: "space-between" }}>
                            <EmcStatusChip active={emc.isActive} />
                            <button
                              onClick={() => router.push(`/emcs/${emc.code}`)}
                              style={{ height: 24, padding: "0 8px", borderRadius: 5, border: "none", backgroundColor: "#EBF8F3", color: "#0F6E56", fontSize: 11, fontWeight: 600, cursor: "pointer" }}
                            >
                              View →
                            </button>
                          </div>
                        </div>
                      </MarkerPopup>
                    </MapMarker>
                  );
                })}
              </Map>
            </div>

            {/* Legend */}
            <div style={{ display: "flex", gap: 16, paddingTop: 10 }}>
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: EVCORE_COLORS.green, border: "2px solid white", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
                <span style={{ fontSize: 11, color: EVCORE_COLORS.textSecondary }}>Active</span>
              </div>
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#B4B2A9", border: "2px solid white", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
                <span style={{ fontSize: 11, color: EVCORE_COLORS.textSecondary }}>Inactive</span>
              </div>
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <div style={{ width: 14, height: 14, borderRadius: "50%", backgroundColor: EVCORE_COLORS.green, border: "3px solid white", boxShadow: `0 0 0 3px ${EVCORE_COLORS.green}55, 0 1px 3px rgba(0,0,0,0.2)` }} />
                <span style={{ fontSize: 11, color: EVCORE_COLORS.textSecondary }}>Selected</span>
              </div>
            </div>
        </div>

      </div>

      {/* ── Add EMC Modal ──────────────────────────────────────────────────── */}
      <Modal opened={addEmcOpen} title="Add EMC Center" maxWidth={620} onClose={() => setAddEmcOpen(false)}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={FORM_LABEL}>EMC Code</label>
              <TextInput name="code" placeholder="EMC-XXX-000" />
            </div>
            <div>
              <label style={FORM_LABEL}>EMC Name</label>
              <TextInput name="name" placeholder="e.g. Kinshasa Nord" />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={FORM_LABEL}>Province</label>
              <TextInput name="province" placeholder="e.g. Kinshasa" />
            </div>
            <div>
              <label style={FORM_LABEL}>Zone Code</label>
              <TextInput name="zoneCode" placeholder="ZONE-XXX-001" />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={FORM_LABEL}>Area Code</label>
              <TextInput name="areaCode" placeholder="AREA-XXXXX" />
            </div>
            <div>
              <label style={FORM_LABEL}>Address</label>
              <TextInput name="address" placeholder="Av. name, Commune, City" />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={FORM_LABEL}>Manager Name</label>
              <TextInput name="managerName" placeholder="Full name" />
            </div>
            <div>
              <label style={FORM_LABEL}>Manager Phone</label>
              <TextInput name="managerPhone" type="phone" placeholder="+243 8XX XXX XXX" />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={FORM_LABEL}>Operating Hours</label>
              <TextInput name="operatingHours" placeholder="06:00-21:00" />
            </div>
            <div>
              <label style={FORM_LABEL}>Charging Capacity</label>
              <TextInput name="chargingCapacity" type="number" placeholder="20" />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={FORM_LABEL}>Battery Inventory</label>
              <TextInput name="batteryInventory" type="number" placeholder="40" />
            </div>
            <div>
              <label style={FORM_LABEL}>Latitude</label>
              <TextInput name="latitude" type="number" placeholder="-4.3217" />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={FORM_LABEL}>Longitude</label>
              <TextInput name="longitude" type="number" placeholder="15.3224" />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 22 }}>
              <span style={{ fontSize: 13, color: EVCORE_COLORS.textPrimary }}>Active EMC</span>
              <div
                onClick={() => setIsActiveForm(v => !v)}
                style={{ width: 40, height: 22, borderRadius: 99, cursor: "pointer", position: "relative", transition: "background-color 0.2s", flexShrink: 0, backgroundColor: isActiveForm ? EVCORE_COLORS.green : EVCORE_COLORS.gray }}
              >
                <div
                  style={{ position: "absolute", top: 3, width: 16, height: 16, left: isActiveForm ? 21 : 3, borderRadius: "50%", backgroundColor: EVCORE_COLORS.white, transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }}
                />
              </div>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 16, borderTop: `0.5px solid ${EVCORE_COLORS.border}`, marginTop: 8 }}>
            <button
              onClick={() => setAddEmcOpen(false)}
              style={{ height: 40, padding: "0 20px", border: `0.5px solid ${EVCORE_COLORS.border}`, borderRadius: 8, backgroundColor: "transparent", fontSize: 13, color: EVCORE_COLORS.textSecondary, cursor: "pointer" }}
            >
              Cancel
            </button>
            <button
              style={{ height: 40, padding: "0 22px", border: "none", borderRadius: 8, backgroundColor: EVCORE_COLORS.green, fontSize: 13, fontWeight: 700, color: EVCORE_COLORS.white, cursor: "pointer" }}
            >
              Add EMC
            </button>
          </div>
        </div>
      </Modal>
    </AppShell>

      <EvoFiltersDrawer
        opened={filtersOpen} onClose={() => setFiltersOpen(false)}
        sections={EMCS_FILTER_SECTIONS} values={filterValues}
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
