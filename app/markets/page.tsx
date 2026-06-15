"use client";

import * as React from "react";
import { Pencil, Trash2, Download } from "lucide-react";
import { useForm } from "react-hook-form";
import { AppShell }              from "@/components/evcore/layout/AppShell";
import { EvoFormFiltersDrawer }  from "@/components/lamt/evo-form-filters-drawer";
import { EvoPreferencesDrawer, type ColumnPref } from "@/components/lamt/evo-preferences-drawer";
import { PageHeader }            from "@/components/lamt/page-header";
import { FiltersBar }            from "@/components/lamt/filters-bar";
import { Table, TableCellType, PaginationStrategy } from "@/components/lamt/table";
import { Modal }                 from "@/components/lamt/modal";
import { Button, ButtonKind, ButtonSize } from "@/components/lamt/button";
import { StatusChip, StatusChipType } from "@/components/lamt/status-chip";
import { RowActionBtn }          from "@/components/evcore/ui/RowActionBtn";
import {
  MARKET_COUNTRIES, MARKET_ZONES, MARKET_CITIES, EMC_LIST,
  type MarketCountry, type MarketZone, type MarketCity,
} from "@/data/dummy";
import { EVCORE_COLORS } from "@/lib/evcore/constants";
import { Method } from "@/lib/filter-utils";
import {
  COUNTRY_FILTER_SECTIONS, getCountryFilterDefaults, COUNTRY_DEFAULT_COLUMNS,
  ZONE_FILTER_SECTIONS, getZoneFilterDefaults, ZONE_DEFAULT_COLUMNS,
  CITY_FILTER_SECTIONS, getCityFilterDefaults, CITY_DEFAULT_COLUMNS,
  EMC_MARKETS_FILTER_SECTIONS, getEmcMarketsFilterDefaults, EMC_MARKETS_DEFAULT_COLUMNS,
} from "@/lib/evcore/evoMarketsFilterSections";

// ─── Types ────────────────────────────────────────────────────────────────────

type MarketTab = "country" | "zone" | "city" | "emc";

const TAB_CONFIG: Record<MarketTab, {
  label: string;
  createLabel: string | null;
  filterSections: any[];
  defaultFilter: () => Record<string, { method: string; value: string }>;
  defaultCols: ColumnPref[];
}> = {
  country: { label: "Countries",    createLabel: "Create Country", filterSections: COUNTRY_FILTER_SECTIONS,      defaultFilter: getCountryFilterDefaults,      defaultCols: COUNTRY_DEFAULT_COLUMNS },
  zone:    { label: "Zones",         createLabel: "Create Zone",    filterSections: ZONE_FILTER_SECTIONS,         defaultFilter: getZoneFilterDefaults,         defaultCols: ZONE_DEFAULT_COLUMNS },
  city:    { label: "Cities",        createLabel: "Create City",    filterSections: CITY_FILTER_SECTIONS,         defaultFilter: getCityFilterDefaults,         defaultCols: CITY_DEFAULT_COLUMNS },
  emc:     { label: "EMC Centers",   createLabel: "Create EMC",     filterSections: EMC_MARKETS_FILTER_SECTIONS,  defaultFilter: getEmcMarketsFilterDefaults,  defaultCols: EMC_MARKETS_DEFAULT_COLUMNS },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtDate(s: string) {
  return new Date(s).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function applyFilter(value: string | null | undefined, f: { method: string; value: string }) {
  if (!f.value) return true;
  const v = String(value ?? "").toLowerCase();
  const fv = f.value.toLowerCase();
  switch (f.method) {
    case Method.Contains:       return v.includes(fv);
    case Method.DoesNotContain: return !v.includes(fv);
    case Method.Equals:         return v === fv;
    default:                    return true;
  }
}

function AcronymChip({ children }: { children: string }) {
  return (
    <span style={{
      fontFamily: "monospace", fontSize: 11, fontWeight: 700,
      color: EVCORE_COLORS.green, backgroundColor: "#E1F5EE",
      borderRadius: 4, padding: "2px 8px",
    }}>{children}</span>
  );
}

// ─── CRUD Modals ──────────────────────────────────────────────────────────────

function DeleteModal({ name, onConfirm, onClose }: { name: string; onConfirm: () => void; onClose: () => void }) {
  return (
    <Modal title="Confirm Delete" opened onClose={onClose}>
      <p style={{ fontSize: 13, color: EVCORE_COLORS.textSecondary, marginBottom: 20, lineHeight: 1.6 }}>
        Are you sure you want to delete <strong style={{ color: EVCORE_COLORS.textPrimary }}>{name}</strong>? This action cannot be undone.
      </p>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
        <Button kind={ButtonKind.Ghost} size={ButtonSize.Small} onClick={onClose}>Cancel</Button>
        <Button kind={ButtonKind.Primary} size={ButtonSize.Small} onClick={() => { onConfirm(); onClose(); }} style={{ backgroundColor: "#DC2626" }}>Delete</Button>
      </div>
    </Modal>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%", height: 40, border: `0.5px solid ${EVCORE_COLORS.border}`, borderRadius: 8,
  padding: "0 13px", fontSize: 13, color: EVCORE_COLORS.textPrimary,
  backgroundColor: EVCORE_COLORS.white, outline: "none", boxSizing: "border-box",
};
const labelStyle: React.CSSProperties = {
  fontSize: 11, fontWeight: 600, color: EVCORE_COLORS.textSecondary,
  textTransform: "uppercase", letterSpacing: "0.04em", display: "block", marginBottom: 6,
};

function CountryModal({ initial, onSave, onClose }: {
  initial?: Partial<MarketCountry>;
  onSave: (d: Pick<MarketCountry, "name" | "frenchName" | "acronym">) => void;
  onClose: () => void;
}) {
  const [name, setName]             = React.useState(initial?.name ?? "");
  const [frenchName, setFrenchName] = React.useState(initial?.frenchName ?? "");
  const [acronym, setAcronym]       = React.useState(initial?.acronym ?? "");
  const isEdit = !!initial?.id;
  return (
    <Modal title={isEdit ? "Edit Country" : "Add Country"} opened onClose={onClose}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div><label style={labelStyle}>Name (English)</label><input style={inputStyle} value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Democratic Republic of Congo" /></div>
        <div><label style={labelStyle}>Name (French)</label><input style={inputStyle} value={frenchName} onChange={e => setFrenchName(e.target.value)} placeholder="e.g. République Démocratique du Congo" /></div>
        <div><label style={labelStyle}>Acronym</label><input style={inputStyle} value={acronym} onChange={e => setAcronym(e.target.value)} placeholder="e.g. DRC" maxLength={5} /></div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 4 }}>
          <Button kind={ButtonKind.Ghost} size={ButtonSize.Small} onClick={onClose}>Cancel</Button>
          <Button kind={ButtonKind.Primary} size={ButtonSize.Small} disabled={!name || !acronym} onClick={() => { if (name && acronym) { onSave({ name, frenchName, acronym }); onClose(); } }}>
            {isEdit ? "Save Changes" : "Add Country"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

function ZoneModal({ initial, onSave, onClose }: {
  initial?: Partial<MarketZone>;
  onSave: (d: Pick<MarketZone, "name" | "country">) => void;
  onClose: () => void;
}) {
  const [name, setName]       = React.useState(initial?.name ?? "");
  const [country, setCountry] = React.useState(initial?.country ?? "");
  const isEdit = !!initial?.id;
  return (
    <Modal title={isEdit ? "Edit Zone" : "Add Zone"} opened onClose={onClose}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div><label style={labelStyle}>Zone Name</label><input style={inputStyle} value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Nord-Kivu" /></div>
        <div>
          <label style={labelStyle}>Country</label>
          <select style={inputStyle} value={country} onChange={e => setCountry(e.target.value)}>
            <option value="">-- Select country --</option>
            {MARKET_COUNTRIES.map(c => <option key={c.id} value={c.acronym}>{c.name} ({c.acronym})</option>)}
          </select>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 4 }}>
          <Button kind={ButtonKind.Ghost} size={ButtonSize.Small} onClick={onClose}>Cancel</Button>
          <Button kind={ButtonKind.Primary} size={ButtonSize.Small} disabled={!name || !country} onClick={() => { if (name && country) { onSave({ name, country }); onClose(); } }}>
            {isEdit ? "Save Changes" : "Add Zone"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

function CityModal({ initial, zones, onSave, onClose }: {
  initial?: Partial<MarketCity>;
  zones: MarketZone[];
  onSave: (d: Pick<MarketCity, "name" | "zone" | "country">) => void;
  onClose: () => void;
}) {
  const [name, setName]       = React.useState(initial?.name ?? "");
  const [zone, setZone]       = React.useState(initial?.zone ?? "");
  const [country, setCountry] = React.useState(initial?.country ?? "");
  const isEdit = !!initial?.id;

  React.useEffect(() => {
    const z = zones.find(z => z.name === zone);
    if (z) setCountry(z.country);
  }, [zone]);

  return (
    <Modal title={isEdit ? "Edit City" : "Add City"} opened onClose={onClose}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div><label style={labelStyle}>City Name</label><input style={inputStyle} value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Goma" /></div>
        <div>
          <label style={labelStyle}>Zone</label>
          <select style={inputStyle} value={zone} onChange={e => setZone(e.target.value)}>
            <option value="">-- Select zone --</option>
            {zones.map(z => <option key={z.id} value={z.name}>{z.name} ({z.country})</option>)}
          </select>
        </div>
        {country && (
          <div><label style={labelStyle}>Country (auto)</label><input style={{ ...inputStyle, backgroundColor: EVCORE_COLORS.pageBg, color: EVCORE_COLORS.textSecondary }} value={country} readOnly /></div>
        )}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 4 }}>
          <Button kind={ButtonKind.Ghost} size={ButtonSize.Small} onClick={onClose}>Cancel</Button>
          <Button kind={ButtonKind.Primary} size={ButtonSize.Small} disabled={!name || !zone} onClick={() => { if (name && zone) { onSave({ name, zone, country }); onClose(); } }}>
            {isEdit ? "Save Changes" : "Add City"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MarketsPage() {
  const [activeTab, setActiveTab] = React.useState<MarketTab>("country");
  const config = TAB_CONFIG[activeTab];

  const [filtersOpen, setFiltersOpen] = React.useState(false);
  const [prefsOpen, setPrefsOpen]     = React.useState(false);
  const [page, setPage]               = React.useState(1);

  // Per-tab filter data
  const [allFilterData, setAllFilterData] = React.useState<Record<MarketTab, Record<string, { method: string; value: string }>>>({
    country: getCountryFilterDefaults(),
    zone:    getZoneFilterDefaults(),
    city:    getCityFilterDefaults(),
    emc:     getEmcMarketsFilterDefaults(),
  });
  const filterData = allFilterData[activeTab];
  const setFilterData = React.useCallback((vals: Record<string, { method: string; value: string }>) => {
    setAllFilterData(prev => ({ ...prev, [activeTab]: { ...prev[activeTab], ...vals } }));
  }, [activeTab]);

  // Per-tab column prefs
  const [allColumns, setAllColumns] = React.useState<Record<MarketTab, ColumnPref[]>>({
    country: COUNTRY_DEFAULT_COLUMNS,
    zone:    ZONE_DEFAULT_COLUMNS,
    city:    CITY_DEFAULT_COLUMNS,
    emc:     EMC_MARKETS_DEFAULT_COLUMNS,
  });
  const columns = allColumns[activeTab];

  // Form (reset on tab change)
  const formMethods = useForm({ defaultValues: config.defaultFilter() });
  React.useEffect(() => {
    formMethods.reset(config.defaultFilter());
    setFiltersOpen(false);
    setPrefsOpen(false);
    setPage(1);
    setCreateOpen(false);
    setEditTarget(null);
    setDeleteTarget(null);
  }, [activeTab]);

  // Data
  const [countries, setCountries] = React.useState<MarketCountry[]>(MARKET_COUNTRIES);
  const [zones, setZones]         = React.useState<MarketZone[]>(MARKET_ZONES);
  const [cities, setCities]       = React.useState<MarketCity[]>(MARKET_CITIES);

  // CRUD state
  const [createOpen, setCreateOpen]     = React.useState(false);
  const [editTarget, setEditTarget]     = React.useState<any>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<any>(null);

  const now = () => new Date().toISOString().split("T")[0];

  const activeFiltersCount = Object.values(filterData).filter(f => f.value).length;

  const handleFilterReset = () => {
    const d = config.defaultFilter();
    setAllFilterData(prev => ({ ...prev, [activeTab]: d }));
    formMethods.reset(d);
  };

  const handleColChange = (key: string, visible: boolean) => {
    setAllColumns(prev => ({
      ...prev,
      [activeTab]: prev[activeTab].map(c => c.key === key ? { ...c, visible } : c),
    }));
  };

  const handleColReset = () => {
    setAllColumns(prev => ({ ...prev, [activeTab]: config.defaultCols }));
  };

  // Build table data + colDefs based on active tab
  const { tableData, colDefs, total } = React.useMemo(() => {
    const visibleCols = columns.filter(c => c.visible);
    const baseColDefs = visibleCols.map(c => ({ headerName: c.label, type: TableCellType.component, key: c.key }));
    const actionsCol  = { headerName: "", type: TableCellType.component, key: "actions" };

    switch (activeTab) {
      case "country": {
        const filtered = countries.filter(c =>
          applyFilter(c.name,       filterData.name)       &&
          applyFilter(c.frenchName, filterData.frenchName) &&
          applyFilter(c.acronym,    filterData.acronym)
        );
        return {
          total: filtered.length,
          colDefs: [actionsCol, ...baseColDefs],
          tableData: filtered.map(c => ({
            name:          <span style={{ fontSize: 13, fontWeight: 600, color: EVCORE_COLORS.textPrimary }}>{c.name}</span>,
            frenchName:    <span style={{ fontSize: 13, color: EVCORE_COLORS.textSecondary }}>{c.frenchName}</span>,
            acronym:       <AcronymChip>{c.acronym}</AcronymChip>,
            numberOfZones: <span style={{ fontSize: 13 }}>{c.numberOfZones}</span>,
            createdAt:     <span style={{ fontSize: 12, color: EVCORE_COLORS.textSecondary }}>{fmtDate(c.createdAt)}</span>,
            actions: (
              <div style={{ display: "flex", gap: 4 }}>
                <RowActionBtn icon={<Pencil size={13} />} title="Edit"   onClick={() => setEditTarget(c)}   variant="green" />
                <RowActionBtn icon={<Trash2 size={13} />} title="Delete" onClick={() => setDeleteTarget(c)} variant="danger" />
              </div>
            ),
          })),
        };
      }

      case "zone": {
        const filtered = zones.filter(z =>
          applyFilter(z.name,    filterData.name)    &&
          applyFilter(z.country, filterData.country)
        );
        return {
          total: filtered.length,
          colDefs: [actionsCol, ...baseColDefs],
          tableData: filtered.map(z => ({
            name:           <span style={{ fontSize: 13, fontWeight: 600, color: EVCORE_COLORS.textPrimary }}>{z.name}</span>,
            country:        <AcronymChip>{z.country}</AcronymChip>,
            numberOfCities: <span style={{ fontSize: 13 }}>{z.numberOfCities}</span>,
            createdAt:      <span style={{ fontSize: 12, color: EVCORE_COLORS.textSecondary }}>{fmtDate(z.createdAt)}</span>,
            actions: (
              <div style={{ display: "flex", gap: 4 }}>
                <RowActionBtn icon={<Pencil size={13} />} title="Edit"   onClick={() => setEditTarget(z)}   variant="green" />
                <RowActionBtn icon={<Trash2 size={13} />} title="Delete" onClick={() => setDeleteTarget(z)} variant="danger" />
              </div>
            ),
          })),
        };
      }

      case "city": {
        const filtered = cities.filter(c =>
          applyFilter(c.name,    filterData.name)    &&
          applyFilter(c.zone,    filterData.zone)    &&
          applyFilter(c.country, filterData.country)
        );
        return {
          total: filtered.length,
          colDefs: [actionsCol, ...baseColDefs],
          tableData: filtered.map(c => ({
            name:         <span style={{ fontSize: 13, fontWeight: 600, color: EVCORE_COLORS.textPrimary }}>{c.name}</span>,
            zone:         <span style={{ fontSize: 13, color: EVCORE_COLORS.textSecondary }}>{c.zone}</span>,
            country:      <AcronymChip>{c.country}</AcronymChip>,
            numberOfEmcs: <span style={{ fontSize: 13 }}>{c.numberOfEmcs}</span>,
            createdAt:    <span style={{ fontSize: 12, color: EVCORE_COLORS.textSecondary }}>{fmtDate(c.createdAt)}</span>,
            actions: (
              <div style={{ display: "flex", gap: 4 }}>
                <RowActionBtn icon={<Pencil size={13} />} title="Edit"   onClick={() => setEditTarget(c)}   variant="green" />
                <RowActionBtn icon={<Trash2 size={13} />} title="Delete" onClick={() => setDeleteTarget(c)} variant="danger" />
              </div>
            ),
          })),
        };
      }

      case "emc":
      default: {
        const filtered = EMC_LIST.filter(e =>
          applyFilter(e.code, filterData.code) &&
          applyFilter(e.name, filterData.name) &&
          applyFilter(e.zone, filterData.zone)
        );
        return {
          total: filtered.length,
          colDefs: baseColDefs,
          tableData: filtered.map(e => ({
            code:           <span style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 700, color: EVCORE_COLORS.textPrimary }}>{e.code}</span>,
            name:           <span style={{ fontSize: 13, fontWeight: 600, color: EVCORE_COLORS.textPrimary }}>{e.name}</span>,
            zone:           <span style={{ fontSize: 13, color: EVCORE_COLORS.textSecondary }}>{e.zone}</span>,
            manager:        <span style={{ fontSize: 13, color: EVCORE_COLORS.textSecondary }}>{e.manager}</span>,
            operatingHours: <span style={{ fontSize: 12, color: EVCORE_COLORS.textSecondary }}>{e.operatingHours}</span>,
            status:         <StatusChip type={e.status === "ACTIVE" ? StatusChipType.Success : StatusChipType.Normal}>{e.status}</StatusChip>,
          })),
        };
      }
    }
  }, [activeTab, filterData, columns, countries, zones, cities]);

  return (
    <AppShell pageTitle="Markets">

      {/* Page header */}
      <PageHeader
        title={`Markets — ${config.label}`}
        actions={[
          { label: `+ ${config.createLabel}`, kind: ButtonKind.Primary, onClick: () => setCreateOpen(true) },
        ]}
      />

      {/* Pill tabs */}
      <div style={{ display: "flex", gap: 8, margin: "20px 0 4px" }}>
        {(Object.keys(TAB_CONFIG) as MarketTab[]).map(tab => {
          const active = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "6px 18px",
                borderRadius: 20,
                fontSize: 13,
                fontWeight: active ? 600 : 400,
                backgroundColor: active ? EVCORE_COLORS.green : "transparent",
                color: active ? "#fff" : EVCORE_COLORS.textSecondary,
                border: `1.5px solid ${active ? EVCORE_COLORS.green : EVCORE_COLORS.border}`,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
              onMouseEnter={e => { if (!active) { (e.currentTarget as HTMLElement).style.borderColor = EVCORE_COLORS.green; (e.currentTarget as HTMLElement).style.color = EVCORE_COLORS.textPrimary; } }}
              onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLElement).style.borderColor = EVCORE_COLORS.border; (e.currentTarget as HTMLElement).style.color = EVCORE_COLORS.textSecondary; } }}
            >
              {TAB_CONFIG[tab].label}
            </button>
          );
        })}
      </div>

      {/* Filters bar */}
      <FiltersBar
        activeFiltersCount={activeFiltersCount}
        onClickFilter={() => setFiltersOpen(true)}
        onClickPreferences={() => setPrefsOpen(true)}
        onClearFilter={activeFiltersCount > 0 ? handleFilterReset : undefined}
      />

      {/* Table */}
      <div style={{ backgroundColor: EVCORE_COLORS.white, border: `0.5px solid ${EVCORE_COLORS.border}`, borderRadius: 12, overflow: "hidden" }}>
        <Table
          hasActions={activeTab !== "emc"}
          data={tableData}
          colDefs={colDefs}
          currentPageNumber={page}
          limit={10}
          totalData={total}
          paginationStrategy={PaginationStrategy.LOCAL}
          onPageChange={setPage}
          showCheckbox={false}
        />
      </div>

      {/* Drawers */}
      <EvoFormFiltersDrawer
        opened={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        sections={config.filterSections}
        formControl={formMethods}
        onChangeFilter={vals => setFilterData(vals as Record<string, { method: string; value: string }>)}
        onResetAll={handleFilterReset}
      />
      <EvoPreferencesDrawer
        opened={prefsOpen}
        onClose={() => setPrefsOpen(false)}
        columns={columns}
        onChange={handleColChange}
        onReset={handleColReset}
      />

      {/* CRUD modals */}
      {createOpen && activeTab === "country" && (
        <CountryModal
          onSave={d => setCountries(p => [...p, { id: `c${Date.now()}`, numberOfZones: 0, createdAt: now(), updatedAt: now(), ...d }])}
          onClose={() => setCreateOpen(false)}
        />
      )}
      {createOpen && activeTab === "zone" && (
        <ZoneModal
          onSave={d => setZones(p => [...p, { id: `z${Date.now()}`, numberOfCities: 0, createdAt: now(), updatedAt: now(), ...d }])}
          onClose={() => setCreateOpen(false)}
        />
      )}
      {createOpen && activeTab === "city" && (
        <CityModal
          zones={zones}
          onSave={d => setCities(p => [...p, { id: `ci${Date.now()}`, numberOfEmcs: 0, createdAt: now(), updatedAt: now(), ...d }])}
          onClose={() => setCreateOpen(false)}
        />
      )}

      {editTarget && activeTab === "country" && (
        <CountryModal
          initial={editTarget}
          onSave={d => setCountries(p => p.map(c => c.id === editTarget.id ? { ...c, ...d, updatedAt: now() } : c))}
          onClose={() => setEditTarget(null)}
        />
      )}
      {editTarget && activeTab === "zone" && (
        <ZoneModal
          initial={editTarget}
          onSave={d => setZones(p => p.map(z => z.id === editTarget.id ? { ...z, ...d, updatedAt: now() } : z))}
          onClose={() => setEditTarget(null)}
        />
      )}
      {editTarget && activeTab === "city" && (
        <CityModal
          initial={editTarget}
          zones={zones}
          onSave={d => setCities(p => p.map(c => c.id === editTarget.id ? { ...c, ...d, updatedAt: now() } : c))}
          onClose={() => setEditTarget(null)}
        />
      )}

      {deleteTarget && (
        <DeleteModal
          name={deleteTarget.name}
          onConfirm={() => {
            if (activeTab === "country") setCountries(p => p.filter(c => c.id !== deleteTarget.id));
            if (activeTab === "zone")    setZones(p => p.filter(z => z.id !== deleteTarget.id));
            if (activeTab === "city")    setCities(p => p.filter(c => c.id !== deleteTarget.id));
          }}
          onClose={() => setDeleteTarget(null)}
        />
      )}

    </AppShell>
  );
}
