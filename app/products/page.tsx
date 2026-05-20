"use client";

import * as React from "react";
import { Search, X, Package, Bike, ShoppingCart, Layers, Eye, Pencil } from "lucide-react";
import { AppShell } from "@/components/evcore/layout/AppShell";
import { KpiCard } from "@/components/evcore/ui/KpiCard";
import { EvoFiltersDrawer } from "@/components/evcore/filters/EvoFiltersDrawer";
import { EvoPreferencesDrawer, type ColumnPref } from "@/components/evcore/filters/EvoPreferencesDrawer";
import { PageHeader } from "@/components/lamt/page-header";
import { FiltersBar } from "@/components/lamt/filters-bar";
import { Modal } from "@/components/lamt/modal";
import { Table, TableCellType, PaginationStrategy } from "@/components/lamt/table";
import { TextInput } from "@/components/lamt/text-input";
import { FLEET_ASSETS, EVO_ACCOUNTS } from "@/data/dummy";
import { EVCORE_COLORS } from "@/lib/evcore/constants";
import { PRODUCTS_FILTER_SECTIONS, PRODUCTS_DEFAULT_COLUMNS } from "@/lib/evcore/filterConfigs";
import { ButtonKind } from "@/components/lamt/button";

// ─── Reference data — BRD §6.2 ─────────────────────────────────────────────

type EvTypeKey = "TWO_WHEELER" | "THREE_WHEELER" | "CART";

interface EvProduct {
  code: string;
  type: "2W" | "3W" | "Cart";
  label: string;
  evType: EvTypeKey;
  description: string;
  isActive: boolean;
}

const EV_PRODUCTS: EvProduct[] = [
  { code: "ALTECH-EMMO-A1", type: "2W",   label: "Electric Moto",    evType: "TWO_WHEELER",   description: "Standard electric motorcycle, single-battery",       isActive: true  },
  { code: "ALTECH-EPAT-A1", type: "2W",   label: "Electric Patrol",  evType: "TWO_WHEELER",   description: "Patrol electric motorcycle, heavy-duty frame",       isActive: true  },
  { code: "ALTECH-F3-2B",   type: "2W",   label: "F3 Premium",       evType: "TWO_WHEELER",   description: "F3 series electric motorcycle, 2-battery pack",      isActive: true  },
  { code: "ALTECH-E3-2B",   type: "2W",   label: "E3 Standard",      evType: "TWO_WHEELER",   description: "E3 series electric motorcycle, 2-battery pack",      isActive: true  },
  { code: "ALTECH-T1-2B",   type: "3W",   label: "Tricycle T1",      evType: "THREE_WHEELER", description: "T1 electric tricycle, 2-battery pack",               isActive: true  },
  { code: "ALTECH-T2-2B",   type: "3W",   label: "Tricycle T2",      evType: "THREE_WHEELER", description: "T2 electric tricycle, reinforced chassis",            isActive: true  },
  { code: "ALTECH-T3-2B",   type: "3W",   label: "Tricycle T3",      evType: "THREE_WHEELER", description: "T3 electric tricycle, cargo-optimised",              isActive: false },
  { code: "ALTECH-ECAT-A1", type: "Cart", label: "Electric Cart",    evType: "CART",          description: "Electric cargo cart, flatbed, single-battery",       isActive: true  },
];

// ─── Style maps ────────────────────────────────────────────────────────────

const TYPE_STYLE: Record<string, { bg: string; text: string }> = {
  "2W":   { bg: "#E1F5EE", text: "#0F6E56" },
  "3W":   { bg: "#E6F1FB", text: "#185FA5" },
  "Cart": { bg: "#FAEEDA", text: "#854F0B" },
};

const EVTYPE_COLOR: Record<EvTypeKey, string> = {
  TWO_WHEELER:   EVCORE_COLORS.green,
  THREE_WHEELER: EVCORE_COLORS.blue,
  CART:          EVCORE_COLORS.amber,
};

// ─── Shared sub-components ─────────────────────────────────────────────────

const FORM_LABEL: React.CSSProperties = {
  display: "block", fontSize: 11, fontWeight: 600,
  color: EVCORE_COLORS.textSecondary, textTransform: "uppercase",
  letterSpacing: "0.04em", marginBottom: 5,
};

function TypeChip({ type }: { type: string }) {
  const s = TYPE_STYLE[type] ?? { bg: "#F3F3F1", text: "#6B7280" };
  return (
    <span style={{ height: 20, padding: "0 8px", borderRadius: 99, backgroundColor: s.bg, color: s.text, fontSize: 10, fontWeight: 700, display: "inline-flex", alignItems: "center" }}>
      {type}
    </span>
  );
}

function ActiveChip({ active }: { active: boolean }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", height: 20, padding: "0 8px", borderRadius: 99, fontSize: 10, fontWeight: 600, backgroundColor: active ? "#E1F5EE" : "#F3F3F1", color: active ? "#0F6E56" : "#6B7280" }}>
      {active ? "Active" : "Inactive"}
    </span>
  );
}

function ProductBanner({ product }: { product: EvProduct }) {
  return (
    <div style={{ padding: "12px 16px", borderRadius: 10, backgroundColor: EVCORE_COLORS.pageBg, marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div>
        <span style={{ fontFamily: "monospace", fontSize: 15, fontWeight: 800, color: EVCORE_COLORS.green }}>{product.code}</span>
        <div style={{ fontSize: 12, color: EVCORE_COLORS.textSecondary, marginTop: 3 }}>{product.label}</div>
      </div>
      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        <TypeChip type={product.type} />
        <ActiveChip active={product.isActive} />
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `0.5px solid ${EVCORE_COLORS.border}` }}>
      <span style={{ fontSize: 12, color: EVCORE_COLORS.textSecondary, fontWeight: 500 }}>{label}</span>
      <span style={{ fontSize: 13, color: EVCORE_COLORS.textPrimary, fontWeight: 600, textAlign: "right", maxWidth: "60%" }}>{value}</span>
    </div>
  );
}

function ProgressRow({ label, count, max, color }: { label: string; count: number; max: number; color: string }) {
  const pct = max === 0 ? 0 : Math.round((count / max) * 100);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <span style={{ fontSize: 12, color: EVCORE_COLORS.textSecondary, width: 130, flexShrink: 0, fontWeight: 500, fontFamily: "monospace" }}>{label}</span>
      <div style={{ flex: 1, height: 5, borderRadius: 99, backgroundColor: "#F0EFE9", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, borderRadius: 99, backgroundColor: color }} />
      </div>
      <span style={{ fontSize: 11, fontWeight: 600, color: EVCORE_COLORS.textPrimary, width: 24, textAlign: "right", flexShrink: 0 }}>{count}</span>
    </div>
  );
}

// ─── Product Detail Modal ──────────────────────────────────────────────────

function ProductDetailModal({ product, activeAssets, totalAssets, evoCount, onClose }: {
  product: EvProduct | null; activeAssets: number; totalAssets: number; evoCount: number; onClose: () => void;
}) {
  if (!product) return null;
  return (
    <Modal opened title="Product Details" maxWidth={520} onClose={onClose}>
      <ProductBanner product={product} />
      <div style={{ marginBottom: 20 }}>
        <DetailRow label="EV Type"          value={<span style={{ fontFamily: "monospace", fontSize: 12 }}>{product.evType}</span>} />
        <DetailRow label="Vehicle Class"    value={product.type === "2W" ? "Two-Wheeler" : product.type === "3W" ? "Three-Wheeler" : "Cart"} />
        <DetailRow label="Active Assets"    value={<span style={{ fontWeight: 800, color: EVCORE_COLORS.green }}>{activeAssets} on road</span>} />
        <DetailRow label="Total Assets"     value={`${totalAssets} in fleet`} />
        <DetailRow label="EVOs Enrolled"    value={<strong style={{ color: EVCORE_COLORS.textPrimary }}>{evoCount}</strong>} />
        <DetailRow label="Description"      value={<span style={{ fontWeight: 400, fontSize: 12, fontStyle: "italic" }}>{product.description}</span>} />
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button onClick={onClose} style={{ height: 38, padding: "0 20px", border: `0.5px solid ${EVCORE_COLORS.border}`, borderRadius: 8, backgroundColor: "transparent", fontSize: 13, color: EVCORE_COLORS.textSecondary, cursor: "pointer" }}>
          Close
        </button>
      </div>
    </Modal>
  );
}

// ─── Edit Product Modal ────────────────────────────────────────────────────

function EditProductModal({ product, onClose }: { product: EvProduct | null; onClose: () => void }) {
  const [label,       setLabel]       = React.useState(product?.label ?? "");
  const [description, setDescription] = React.useState(product?.description ?? "");
  const [isActive,    setIsActive]    = React.useState(product?.isActive ?? true);

  React.useEffect(() => {
    if (product) { setLabel(product.label); setDescription(product.description); setIsActive(product.isActive); }
  }, [product]);

  if (!product) return null;

  return (
    <Modal opened title="Edit Product" maxWidth={520} onClose={onClose}>
      <ProductBanner product={product} />
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div>
          <label style={FORM_LABEL}>Label</label>
          <TextInput name="label" placeholder="e.g. F3 Premium" value={label} onChange={e => setLabel(e.target.value)} />
        </div>
        <div>
          <label style={FORM_LABEL}>Description</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Brief product description…"
            rows={3}
            style={{ width: "100%", border: `0.5px solid ${EVCORE_COLORS.border}`, borderRadius: 8, padding: "9px 12px", fontSize: 13, color: EVCORE_COLORS.textPrimary, backgroundColor: EVCORE_COLORS.white, outline: "none", resize: "vertical", fontFamily: "inherit", boxSizing: "border-box" }}
          />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 13, color: EVCORE_COLORS.textPrimary }}>Active Product</span>
          <div onClick={() => setIsActive(v => !v)} style={{ width: 40, height: 22, borderRadius: 99, cursor: "pointer", position: "relative", backgroundColor: isActive ? EVCORE_COLORS.green : EVCORE_COLORS.gray, transition: "background-color 0.2s", flexShrink: 0 }}>
            <div style={{ position: "absolute", top: 3, width: 16, height: 16, left: isActive ? 21 : 3, borderRadius: "50%", backgroundColor: EVCORE_COLORS.white, transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 16, borderTop: `0.5px solid ${EVCORE_COLORS.border}`, marginTop: 4 }}>
          <button onClick={onClose} style={{ height: 40, padding: "0 20px", border: `0.5px solid ${EVCORE_COLORS.border}`, borderRadius: 8, backgroundColor: "transparent", fontSize: 13, color: EVCORE_COLORS.textSecondary, cursor: "pointer" }}>Cancel</button>
          <button style={{ height: 40, padding: "0 24px", border: "none", borderRadius: 8, backgroundColor: EVCORE_COLORS.green, fontSize: 13, fontWeight: 700, color: EVCORE_COLORS.white, cursor: "pointer" }}>Save Changes</button>
        </div>
      </div>
    </Modal>
  );
}

// ─── Add Product Modal ─────────────────────────────────────────────────────

const TYPE_OPTS = [
  { value: "2W",   label: "2W — Two-Wheeler" },
  { value: "3W",   label: "3W — Three-Wheeler" },
  { value: "Cart", label: "Cart — Electric Cart" },
];
const EV_TYPE_OPTS = [
  { value: "TWO_WHEELER",   label: "TWO_WHEELER" },
  { value: "THREE_WHEELER", label: "THREE_WHEELER" },
  { value: "CART",          label: "CART" },
];

function AddProductModal({ opened, onClose }: { opened: boolean; onClose: () => void }) {
  const [isActive, setIsActive] = React.useState(true);

  return (
    <Modal opened={opened} title="Add Product" maxWidth={560} onClose={onClose}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div><label style={FORM_LABEL}>Product Code</label><TextInput name="code" placeholder="ALTECH-XXX-XX" /></div>
          <div><label style={FORM_LABEL}>Label</label><TextInput name="label" placeholder="e.g. F3 Premium" /></div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <label style={FORM_LABEL}>Type</label>
            <select style={{ width: "100%", height: 38, border: `0.5px solid ${EVCORE_COLORS.border}`, borderRadius: 8, padding: "0 12px", fontSize: 13, color: EVCORE_COLORS.textPrimary, backgroundColor: EVCORE_COLORS.white, outline: "none", cursor: "pointer" }}>
              {TYPE_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div>
            <label style={FORM_LABEL}>EV Type</label>
            <select style={{ width: "100%", height: 38, border: `0.5px solid ${EVCORE_COLORS.border}`, borderRadius: 8, padding: "0 12px", fontSize: 13, color: EVCORE_COLORS.textPrimary, backgroundColor: EVCORE_COLORS.white, outline: "none", cursor: "pointer" }}>
              {EV_TYPE_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label style={FORM_LABEL}>Description</label>
          <textarea
            placeholder="Brief product description…"
            rows={3}
            style={{ width: "100%", border: `0.5px solid ${EVCORE_COLORS.border}`, borderRadius: 8, padding: "9px 12px", fontSize: 13, color: EVCORE_COLORS.textPrimary, backgroundColor: EVCORE_COLORS.white, outline: "none", resize: "vertical", fontFamily: "inherit", boxSizing: "border-box" }}
          />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 4 }}>
          <span style={{ fontSize: 13, color: EVCORE_COLORS.textPrimary }}>Active Product</span>
          <div onClick={() => setIsActive(v => !v)} style={{ width: 40, height: 22, borderRadius: 99, cursor: "pointer", position: "relative", backgroundColor: isActive ? EVCORE_COLORS.green : EVCORE_COLORS.gray, transition: "background-color 0.2s" }}>
            <div style={{ position: "absolute", top: 3, width: 16, height: 16, left: isActive ? 21 : 3, borderRadius: "50%", backgroundColor: EVCORE_COLORS.white, transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 16, borderTop: `0.5px solid ${EVCORE_COLORS.border}`, marginTop: 8 }}>
          <button onClick={onClose} style={{ height: 40, padding: "0 20px", border: `0.5px solid ${EVCORE_COLORS.border}`, borderRadius: 8, backgroundColor: "transparent", fontSize: 13, color: EVCORE_COLORS.textSecondary, cursor: "pointer" }}>Cancel</button>
          <button style={{ height: 40, padding: "0 22px", border: "none", borderRadius: 8, backgroundColor: EVCORE_COLORS.green, fontSize: 13, fontWeight: 700, color: EVCORE_COLORS.white, cursor: "pointer" }}>Add Product</button>
        </div>
      </div>
    </Modal>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────

export default function ProductsPage() {
  const [filterValues, setFilterValues] = React.useState<Record<string, string[]>>({});
  const [columns,      setColumns]      = React.useState<ColumnPref[]>(PRODUCTS_DEFAULT_COLUMNS);
  const [filtersOpen,  setFiltersOpen]  = React.useState(false);
  const [prefsOpen,    setPrefsOpen]    = React.useState(false);
  const [searchQuery,  setSearchQuery]  = React.useState("");
  const [page,         setPage]         = React.useState(1);
  const [detailProduct, setDetailProduct] = React.useState<EvProduct | null>(null);
  const [editProduct,   setEditProduct]   = React.useState<EvProduct | null>(null);
  const [addOpen,       setAddOpen]       = React.useState(false);

  const LIMIT = 10;

  // Enrich with live asset counts
  const enriched = React.useMemo(() =>
    EV_PRODUCTS.map(p => ({
      ...p,
      totalAssets:  FLEET_ASSETS.filter(a => a.productCode === p.code).length,
      activeAssets: FLEET_ASSETS.filter(a => a.productCode === p.code && a.status === "ON_ROAD").length,
      evoCount:     EVO_ACCOUNTS.filter(e => e.evProductCode === p.code).length,
    })),
    []
  );

  const filtered = React.useMemo(() => {
    const q        = searchQuery.toLowerCase();
    const types    = filterValues.evType  ?? [];
    const statuses = filterValues.status  ?? [];
    return enriched.filter(p => {
      const matchSearch = !q || p.code.toLowerCase().includes(q) || p.label.toLowerCase().includes(q) || p.evType.toLowerCase().includes(q);
      const matchType   = !types.length    || types.includes(p.evType);
      const matchStatus = !statuses.length || statuses.some(s => s === "ACTIVE" ? p.isActive : !p.isActive);
      return matchSearch && matchType && matchStatus;
    });
  }, [enriched, searchQuery, filterValues]);

  const activeFiltersCount = Object.values(filterValues).reduce((a, v) => a + v.length, 0);
  const hasFilters = !!(searchQuery || activeFiltersCount);

  const handleFilterChange = (id: string, selected: string[]) => { setFilterValues(prev => ({ ...prev, [id]: selected })); setPage(1); };
  const handleFilterReset  = () => { setFilterValues({}); setSearchQuery(""); setPage(1); };
  const handleColumnReset  = () => setColumns(PRODUCTS_DEFAULT_COLUMNS);

  // Stats
  const totalActiveAssets = enriched.reduce((s, p) => s + p.activeAssets, 0);
  const byType = {
    TWO_WHEELER:   enriched.filter(p => p.evType === "TWO_WHEELER").reduce((s, p)   => s + p.activeAssets, 0),
    THREE_WHEELER: enriched.filter(p => p.evType === "THREE_WHEELER").reduce((s, p) => s + p.activeAssets, 0),
    CART:          enriched.filter(p => p.evType === "CART").reduce((s, p)           => s + p.activeAssets, 0),
  };

  // Column visibility
  const visibleKeys = new Set(columns.filter(c => c.visible).map(c => c.key));

  type Enriched = typeof enriched[0];
  const allCols: Record<string, (p: Enriched) => React.ReactNode> = {
    code:         p => <span style={{ fontFamily: "monospace", fontSize: 11, fontWeight: 700, color: EVCORE_COLORS.green, backgroundColor: "#EBF8F3", border: `0.5px solid ${EVCORE_COLORS.greenLight}`, borderRadius: 5, padding: "3px 8px", display: "inline-block" }}>{p.code}</span>,
    type:         p => <TypeChip type={p.type} />,
    label:        p => <span style={{ fontSize: 13, fontWeight: 600, color: EVCORE_COLORS.textPrimary }}>{p.label}</span>,
    evType:       p => <span style={{ fontSize: 12, color: EVCORE_COLORS.textSecondary, fontFamily: "monospace" }}>{p.evType}</span>,
    activeAssets: p => <span style={{ fontSize: 13, fontWeight: 600, color: p.activeAssets > 0 ? EVCORE_COLORS.green : EVCORE_COLORS.textSecondary }}>{p.activeAssets}</span>,
    status:       p => <ActiveChip active={p.isActive} />,
  };

  const tableData = filtered.map(p => ({
    id: p.code,
    ...Object.fromEntries(Object.entries(allCols).filter(([k]) => visibleKeys.has(k)).map(([k, fn]) => [k, fn(p)])),
    _raw: p,
  }));

  const colDefs = columns
    .filter(c => c.visible)
    .map(c => ({ headerName: c.label, type: TableCellType.component, key: c.key }));

  const rowActions = (row: Record<string, number | string | React.ReactNode | object>) => {
    const p = row._raw as Enriched;
    return (
      <div style={{ display: "flex", gap: 6 }}>
        <button
          onClick={() => setDetailProduct(p)}
          style={{ display: "inline-flex", alignItems: "center", gap: 4, height: 26, padding: "0 9px", borderRadius: 6, border: `0.5px solid ${EVCORE_COLORS.border}`, backgroundColor: "transparent", fontSize: 11, fontWeight: 500, color: EVCORE_COLORS.textSecondary, cursor: "pointer" }}
        >
          <Eye size={10} /> View
        </button>
        <button
          onClick={() => setEditProduct(p)}
          style={{ display: "inline-flex", alignItems: "center", gap: 4, height: 26, padding: "0 9px", borderRadius: 6, border: `0.5px solid ${EVCORE_COLORS.border}`, backgroundColor: "transparent", fontSize: 11, fontWeight: 500, color: EVCORE_COLORS.textSecondary, cursor: "pointer" }}
        >
          <Pencil size={10} /> Edit
        </button>
      </div>
    );
  };

  const detailEnriched = detailProduct ? enriched.find(p => p.code === detailProduct.code) : null;

  return (
    <>
      <AppShell pageTitle="Products">
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          {/* ── Info bar ─────────────────────────────────────────────────── */}
          <div style={{ backgroundColor: "#EFF6FF", borderLeft: "3px solid #3B82F6", borderRadius: "0 8px 8px 0", padding: "12px 16px", fontSize: 13, color: "#1E40AF", lineHeight: 1.6 }}>
            Product codes are reference data used by EVO accounts, EV assets and rental plans.{" "}
            <strong>Changes affect all linked records.</strong>
          </div>

          {/* ── Header ───────────────────────────────────────────────────── */}
          <div>
            <PageHeader
              title="Products"
              actions={[{ label: "+ Add Product", kind: ButtonKind.Primary, onClick: () => setAddOpen(true) }]}
            />
            <div style={{ fontSize: 12, color: EVCORE_COLORS.textSecondary, marginTop: 2 }}>
              EV product code reference data · BRD §6.2
              {hasFilters ? ` · ${filtered.length} of ${EV_PRODUCTS.length} shown` : ` · ${EV_PRODUCTS.length} products`}
            </div>
          </div>

          {/* ── KPI row ──────────────────────────────────────────────────── */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
            <KpiCard label="Total Products"  value={String(EV_PRODUCTS.length)}                                       delta="All product codes"        deltaType="neutral"  icon={Package} />
            <KpiCard label="Two-Wheelers"    value={String(enriched.filter(p => p.evType === "TWO_WHEELER").length)}   delta="Moto & scooter variants"  deltaType="neutral"  icon={Bike} />
            <KpiCard label="Three-Wheelers"  value={String(enriched.filter(p => p.evType === "THREE_WHEELER").length)} delta="Tricycle variants"         deltaType="neutral"  icon={Layers} />
            <KpiCard label="Active Assets"   value={String(totalActiveAssets)}                                        delta="Currently on road"         deltaType="positive" icon={ShoppingCart} />
          </div>

          {/* ── Search ───────────────────────────────────────────────────── */}
          <div style={{ position: "relative" }}>
            <Search size={14} color={EVCORE_COLORS.textSecondary} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
            <input
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setPage(1); }}
              placeholder="Search product code or label…"
              style={{ width: "100%", height: 38, border: `0.5px solid ${EVCORE_COLORS.border}`, borderRadius: 8, paddingLeft: 36, paddingRight: searchQuery ? 36 : 12, fontSize: 13, color: EVCORE_COLORS.textPrimary, backgroundColor: EVCORE_COLORS.white, outline: "none", boxSizing: "border-box" }}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", padding: 2 }}>
                <X size={13} color={EVCORE_COLORS.textSecondary} />
              </button>
            )}
          </div>

          {/* ── Filters bar ──────────────────────────────────────────────── */}
          <FiltersBar
            activeFiltersCount={activeFiltersCount}
            onClickFilter={() => setFiltersOpen(true)}
            onClickPreferences={() => setPrefsOpen(true)}
            onClearFilter={hasFilters ? handleFilterReset : undefined}
          />

          {/* ── Table ────────────────────────────────────────────────────── */}
          {filtered.length === 0 ? (
            <div style={{ backgroundColor: EVCORE_COLORS.white, border: `0.5px solid ${EVCORE_COLORS.border}`, borderRadius: 12, padding: "48px 24px", textAlign: "center" }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: EVCORE_COLORS.textPrimary, marginBottom: 8 }}>No products found</div>
              <div style={{ fontSize: 12, color: EVCORE_COLORS.textSecondary, marginBottom: 16 }}>No products match your current filters.</div>
              <button onClick={handleFilterReset} style={{ height: 34, padding: "0 18px", borderRadius: 8, border: `0.5px solid ${EVCORE_COLORS.border}`, backgroundColor: "transparent", fontSize: 12, fontWeight: 500, color: EVCORE_COLORS.textSecondary, cursor: "pointer" }}>Clear filters</button>
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

          {/* ── Summary cards ────────────────────────────────────────────── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div style={{ backgroundColor: EVCORE_COLORS.white, border: `0.5px solid ${EVCORE_COLORS.border}`, borderRadius: 12, padding: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: EVCORE_COLORS.textPrimary, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 16 }}>Active assets by EV type</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <ProgressRow label="TWO_WHEELER"   count={byType.TWO_WHEELER}   max={totalActiveAssets} color={EVCORE_COLORS.green} />
                <ProgressRow label="THREE_WHEELER" count={byType.THREE_WHEELER} max={totalActiveAssets} color={EVCORE_COLORS.blue} />
                <ProgressRow label="CART"          count={byType.CART}          max={totalActiveAssets} color={EVCORE_COLORS.amber} />
              </div>
            </div>
            <div style={{ backgroundColor: EVCORE_COLORS.white, border: `0.5px solid ${EVCORE_COLORS.border}`, borderRadius: 12, padding: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: EVCORE_COLORS.textPrimary, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 16 }}>Active assets by product</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {enriched.map(p => (
                  <ProgressRow key={p.code} label={p.code} count={p.activeAssets} max={Math.max(totalActiveAssets, 1)} color={EVTYPE_COLOR[p.evType]} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </AppShell>

      {/* ── Modals ──────────────────────────────────────────────────────────── */}
      <ProductDetailModal
        product={detailProduct}
        activeAssets={detailEnriched?.activeAssets ?? 0}
        totalAssets={detailEnriched?.totalAssets ?? 0}
        evoCount={detailEnriched?.evoCount ?? 0}
        onClose={() => setDetailProduct(null)}
      />
      <EditProductModal product={editProduct} onClose={() => setEditProduct(null)} />
      <AddProductModal opened={addOpen} onClose={() => setAddOpen(false)} />

      {/* ── Drawers ─────────────────────────────────────────────────────────── */}
      <EvoFiltersDrawer
        opened={filtersOpen} onClose={() => setFiltersOpen(false)}
        sections={PRODUCTS_FILTER_SECTIONS} values={filterValues}
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
