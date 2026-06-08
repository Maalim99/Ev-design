"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { Package, Bike, ShoppingCart, Layers, Eye, Pencil, Trash2 } from "lucide-react";
import { RowActionBtn } from "@/components/evcore/ui/RowActionBtn";
import { AppShell } from "@/components/evcore/layout/AppShell";
import { KpiCard } from "@/components/evcore/ui/KpiCard";
import { EvoFormFiltersDrawer } from "@/components/lamt/evo-form-filters-drawer";
import { EvoPreferencesDrawer, type ColumnPref } from "@/components/lamt/evo-preferences-drawer";
import { PageHeader } from "@/components/lamt/page-header";
import { FiltersBar } from "@/components/lamt/filters-bar";
import { FilterMethod } from "@/components/lamt/filter-method";
import { Modal } from "@/components/lamt/modal";
import { Table, TableCellType, PaginationStrategy } from "@/components/lamt/table";
import { TextInput } from "@/components/lamt/text-input";
import { Button, ButtonKind, ButtonSize } from "@/components/lamt/button";
import { FilterType, Method } from "@/lib/filter-utils";
import { FLEET_ASSETS, EVO_ACCOUNTS } from "@/data/dummy";
import { EVCORE_COLORS } from "@/lib/evcore/constants";
import { StatusChip, StatusChipType } from "@/components/lamt/status-chip";
import { PRODUCTS_DEFAULT_COLUMNS } from "@/lib/evcore/filterConfigs";
import {
  EVO_PRODUCTS_FILTER_SECTIONS,
  getProductsFilterDefaults,
} from "@/lib/evcore/evoProductsFilterSections";

// ─── Reference data ───────────────────────────────────────────────────────────

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
  { code: "ALTECH-EMMO-A1", type: "2W",   label: "Electric Moto",   evType: "TWO_WHEELER",   description: "Standard electric motorcycle, single-battery",       isActive: true  },
  { code: "ALTECH-EPAT-A1", type: "2W",   label: "Electric Patrol", evType: "TWO_WHEELER",   description: "Patrol electric motorcycle, heavy-duty frame",       isActive: true  },
  { code: "ALTECH-F3-2B",   type: "2W",   label: "F3 Premium",      evType: "TWO_WHEELER",   description: "F3 series electric motorcycle, 2-battery pack",      isActive: true  },
  { code: "ALTECH-E3-2B",   type: "2W",   label: "E3 Standard",     evType: "TWO_WHEELER",   description: "E3 series electric motorcycle, 2-battery pack",      isActive: true  },
  { code: "ALTECH-T1-2B",   type: "3W",   label: "Tricycle T1",     evType: "THREE_WHEELER", description: "T1 electric tricycle, 2-battery pack",               isActive: true  },
  { code: "ALTECH-T2-2B",   type: "3W",   label: "Tricycle T2",     evType: "THREE_WHEELER", description: "T2 electric tricycle, reinforced chassis",            isActive: true  },
  { code: "ALTECH-T3-2B",   type: "3W",   label: "Tricycle T3",     evType: "THREE_WHEELER", description: "T3 electric tricycle, cargo-optimised",              isActive: false },
  { code: "ALTECH-ECAT-A1", type: "Cart", label: "Electric Cart",   evType: "CART",          description: "Electric cargo cart, flatbed, single-battery",       isActive: true  },
];

// ─── Filter logic ─────────────────────────────────────────────────────────────

function applyFilterMethod(
  fieldValue: string | number | boolean | null | undefined,
  method: string,
  filterValue: string,
): boolean {
  if (!filterValue) return true;
  const fv   = String(fieldValue ?? "").toLowerCase();
  const fval = filterValue.toLowerCase();
  switch (method) {
    case Method.Contains:       return fv.includes(fval);
    case Method.DoesNotContain: return !fv.includes(fval);
    case Method.Equals:         return fv === fval;
    default:                    return true;
  }
}

// ─── Style maps ───────────────────────────────────────────────────────────────


const EVTYPE_COLOR: Record<EvTypeKey, string> = {
  TWO_WHEELER:   EVCORE_COLORS.green,
  THREE_WHEELER: EVCORE_COLORS.blue,
  CART:          EVCORE_COLORS.amber,
};

// ─── Shared sub-components ────────────────────────────────────────────────────

const FORM_LABEL: React.CSSProperties = {
  display: "block", fontSize: 11, fontWeight: 600,
  color: EVCORE_COLORS.textSecondary, textTransform: "uppercase",
  letterSpacing: "0.04em", marginBottom: 5,
};

const TYPE_CHIP_TYPE: Record<string, StatusChipType> = {
  "2W":   StatusChipType.Success,
  "3W":   StatusChipType.Accent,
  "Cart": StatusChipType.Warning,
};

function TypeChip({ type }: { type: string }) {
  return <StatusChip type={TYPE_CHIP_TYPE[type] ?? StatusChipType.Normal}>{type}</StatusChip>;
}

function ActiveChip({ active }: { active: boolean }) {
  return (
    <StatusChip type={active ? StatusChipType.Success : StatusChipType.Normal}>
      {active ? "Active" : "Inactive"}
    </StatusChip>
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

// ─── Shortcut filter popover button ───────────────────────────────────────────

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

// ─── Product Detail Modal ──────────────────────────────────────────────────────

function ProductDetailModal({ product, activeAssets, totalAssets, evoCount, onClose }: {
  product: EvProduct | null; activeAssets: number; totalAssets: number; evoCount: number; onClose: () => void;
}) {
  if (!product) return null;
  return (
    <Modal opened title="Product Details" maxWidth={520} onClose={onClose}>
      <ProductBanner product={product} />
      <div style={{ marginBottom: 20 }}>
        <DetailRow label="EV Type"       value={<span style={{ fontFamily: "monospace", fontSize: 12 }}>{product.evType}</span>} />
        <DetailRow label="Vehicle Class" value={product.type === "2W" ? "Two-Wheeler" : product.type === "3W" ? "Three-Wheeler" : "Cart"} />
        <DetailRow label="Active Assets" value={<span style={{ fontWeight: 800, color: EVCORE_COLORS.green }}>{activeAssets} on road</span>} />
        <DetailRow label="Total Assets"  value={`${totalAssets} in fleet`} />
        <DetailRow label="EVOs Enrolled" value={<strong style={{ color: EVCORE_COLORS.textPrimary }}>{evoCount}</strong>} />
        <DetailRow label="Description"   value={<span style={{ fontWeight: 400, fontSize: 12, fontStyle: "italic" }}>{product.description}</span>} />
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button onClick={onClose} style={{ height: 38, padding: "0 20px", border: `0.5px solid ${EVCORE_COLORS.border}`, borderRadius: 8, backgroundColor: "transparent", fontSize: 13, color: EVCORE_COLORS.textSecondary, cursor: "pointer" }}>
          Close
        </button>
      </div>
    </Modal>
  );
}

// ─── Update Product Modal ──────────────────────────────────────────────────────

function UpdateProductModal({ product, onClose }: { product: EvProduct | null; onClose: () => void }) {
  const [label,       setLabel]       = React.useState(product?.label ?? "");
  const [description, setDescription] = React.useState(product?.description ?? "");
  const [isActive,    setIsActive]    = React.useState(product?.isActive ?? true);

  React.useEffect(() => {
    if (product) { setLabel(product.label); setDescription(product.description); setIsActive(product.isActive); }
  }, [product]);

  if (!product) return null;

  return (
    <Modal opened title="Update Product" maxWidth={520} onClose={onClose}>
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

// ─── Delete Product Modal ──────────────────────────────────────────────────────

function DeleteProductModal({ product, onClose }: { product: EvProduct | null; onClose: () => void }) {
  if (!product) return null;
  return (
    <Modal opened title="Delete Product" maxWidth={460} onClose={onClose}>
      <ProductBanner product={product} />
      <div style={{ backgroundColor: "#FEF2F2", border: `0.5px solid #FECACA`, borderRadius: 8, padding: "11px 14px", marginBottom: 20, display: "flex", gap: 10, alignItems: "flex-start" }}>
        <span style={{ fontSize: 16, flexShrink: 0 }}>⚠</span>
        <div style={{ fontSize: 13, color: "#991B1B", lineHeight: 1.6 }}>
          Deleting a product code will affect all linked <strong>EVO accounts</strong>, <strong>fleet assets</strong> and <strong>rental plans</strong> that reference <strong>{product.code}</strong>. This action cannot be undone.
        </div>
      </div>
      <p style={{ fontSize: 13, color: EVCORE_COLORS.textPrimary, lineHeight: 1.7, marginBottom: 24 }}>
        Are you sure you want to delete this product?
      </p>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button onClick={onClose} style={{ height: 40, padding: "0 20px", border: `0.5px solid ${EVCORE_COLORS.border}`, borderRadius: 8, backgroundColor: "transparent", fontSize: 13, color: EVCORE_COLORS.textSecondary, cursor: "pointer" }}>
          Cancel
        </button>
        <button onClick={onClose} style={{ height: 40, padding: "0 22px", border: "none", borderRadius: 8, backgroundColor: EVCORE_COLORS.danger, fontSize: 13, fontWeight: 700, color: EVCORE_COLORS.white, cursor: "pointer" }}>
          Yes, Delete
        </button>
      </div>
    </Modal>
  );
}

// ─── Create Product Modal ──────────────────────────────────────────────────────

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

function CreateProductModal({ opened, onClose }: { opened: boolean; onClose: () => void }) {
  const [isActive, setIsActive] = React.useState(true);
  if (!opened) return null;
  return (
    <Modal opened title="Create Product" maxWidth={560} onClose={onClose}>
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
          <button style={{ height: 40, padding: "0 22px", border: "none", borderRadius: 8, backgroundColor: EVCORE_COLORS.green, fontSize: 13, fontWeight: 700, color: EVCORE_COLORS.white, cursor: "pointer" }}>Create Product</button>
        </div>
      </div>
    </Modal>
  );
}

// ─── Download Modal ───────────────────────────────────────────────────────────

function DownloadModal({ opened, onClose, columns }: { opened: boolean; onClose: () => void; columns: ColumnPref[] }) {
  const [fmt, setFmt] = React.useState<"csv" | "xlsx">("csv");
  if (!opened) return null;
  return (
    <Modal opened title="Download Products" maxWidth={420} onClose={onClose}>
      <p style={{ fontSize: 13, color: EVCORE_COLORS.textSecondary, marginBottom: 16 }}>
        Export visible product records with currently active filters applied.
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

export default function ProductsPage() {
  const formMethods = useForm({ defaultValues: getProductsFilterDefaults() });
  const [filterData, setFilterData] = React.useState<Record<string, { method: string; value: string }>>(getProductsFilterDefaults());

  const [columns,       setColumns]       = React.useState<ColumnPref[]>(PRODUCTS_DEFAULT_COLUMNS);
  const [filtersOpen,   setFiltersOpen]   = React.useState(false);
  const [prefsOpen,     setPrefsOpen]     = React.useState(false);
  const [downloadOpen,  setDownloadOpen]  = React.useState(false);
  const [createOpen,    setCreateOpen]    = React.useState(false);
  const [page,          setPage]          = React.useState(1);
  const [detailProduct, setDetailProduct] = React.useState<EvProduct | null>(null);
  const [updateProduct, setUpdateProduct] = React.useState<EvProduct | null>(null);
  const [deleteProduct, setDeleteProduct] = React.useState<EvProduct | null>(null);

  const onChangeFilter = React.useCallback((values: Record<string, unknown>) => {
    setFilterData(prev => ({ ...prev, ...(values as Record<string, { method: string; value: string }>) }));
    setPage(1);
  }, []);

  const onResetAllFilters = React.useCallback(() => {
    const defaults = getProductsFilterDefaults();
    formMethods.reset(defaults);
    setFilterData(defaults);
    setPage(1);
  }, [formMethods]);

  // ── Enrich with live asset/EVO counts ───────────────────────────────────────
  const enriched = React.useMemo(() =>
    EV_PRODUCTS.map(p => ({
      ...p,
      totalAssets:  FLEET_ASSETS.filter(a => a.productCode === p.code).length,
      activeAssets: FLEET_ASSETS.filter(a => a.productCode === p.code && a.status === "ON_ROAD").length,
      evoCount:     EVO_ACCOUNTS.filter(e => e.evProductCode === p.code).length,
    })),
    []
  );

  // ── Filtered data ────────────────────────────────────────────────────────────
  const filtered = React.useMemo(() => {
    return enriched.filter(p => {
      const statusValue = p.isActive ? "ACTIVE" : "INACTIVE";
      const fields: Record<string, string> = {
        code:   p.code,
        label:  p.label,
        evType: p.evType,
        status: statusValue,
      };
      return Object.entries(filterData).every(([key, { method, value }]) =>
        applyFilterMethod(fields[key], method, value)
      );
    });
  }, [enriched, filterData]);

  const activeFiltersCount = Object.values(filterData).filter(f => f.value !== "").length;
  const handleColumnReset  = () => setColumns(PRODUCTS_DEFAULT_COLUMNS);

  // ── Shortcut active check ────────────────────────────────────────────────────
  const isProductCodeActive = !!filterData.code?.value;

  // ── KPI calculations ─────────────────────────────────────────────────────────
  const totalActiveAssets = enriched.reduce((s, p) => s + p.activeAssets, 0);
  const byType = {
    TWO_WHEELER:   enriched.filter(p => p.evType === "TWO_WHEELER").reduce((s, p)   => s + p.activeAssets, 0),
    THREE_WHEELER: enriched.filter(p => p.evType === "THREE_WHEELER").reduce((s, p) => s + p.activeAssets, 0),
    CART:          enriched.filter(p => p.evType === "CART").reduce((s, p)           => s + p.activeAssets, 0),
  };

  // ── Left actions (shortcut filter buttons) ──────────────────────────────────
  const leftActions = [
    <ShortcutFilterButton key="code" label="Product Code" isActive={isProductCodeActive}>
      <FilterMethod
        name="code"
        type={FilterType.Str}
        method={Method.Contains}
        formControl={formMethods}
        onChangeFilter={onChangeFilter}
      />
    </ShortcutFilterButton>,
  ];

  // ── Table ────────────────────────────────────────────────────────────────────
  type Enriched = typeof enriched[0];

  const visibleKeys = new Set(columns.filter(c => c.visible).map(c => c.key));

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
      <div style={{ display: "flex", gap: 4 }}>
        <RowActionBtn icon={<Eye size={14} />}    title="View product"   onClick={() => setDetailProduct(p)}  variant="green" />
        <RowActionBtn icon={<Pencil size={14} />} title="Edit product"   onClick={() => setUpdateProduct(p)}  variant="blue" />
        <RowActionBtn icon={<Trash2 size={14} />} title="Delete product" onClick={() => setDeleteProduct(p)}  variant="danger" />
      </div>
    );
  };

  const detailEnriched = detailProduct ? enriched.find(p => p.code === detailProduct.code) : null;

  return (
    <>
      <AppShell pageTitle="Products">
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          <div>
            <PageHeader
              title="Products"
              actions={[{ label: "+ Create Product", kind: ButtonKind.Primary, onClick: () => setCreateOpen(true) }]}
              onClickDownload={() => setDownloadOpen(true)}
            />
            <div style={{ fontSize: 12, color: EVCORE_COLORS.textSecondary, marginTop: 2 }}>
              EV product code reference data
              {activeFiltersCount > 0 ? ` · ${filtered.length} of ${EV_PRODUCTS.length} shown` : ` · ${EV_PRODUCTS.length} products`}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
            <KpiCard label="Total Products" value={String(EV_PRODUCTS.length)}                                       delta="All product codes"       deltaType="neutral"  icon={Package} />
            <KpiCard label="Two-Wheelers"   value={String(enriched.filter(p => p.evType === "TWO_WHEELER").length)}   delta="Moto & scooter variants" deltaType="neutral"  icon={Bike} />
            <KpiCard label="Three-Wheelers" value={String(enriched.filter(p => p.evType === "THREE_WHEELER").length)} delta="Tricycle variants"        deltaType="neutral"  icon={Layers} />
            <KpiCard label="Active Assets"  value={String(totalActiveAssets)}                                        delta="Currently on road"        deltaType="positive" icon={ShoppingCart} />
          </div>

          <FiltersBar
            leftActions={leftActions}
            activeFiltersCount={activeFiltersCount}
            onClickFilter={() => setFiltersOpen(true)}
            onClickPreferences={() => setPrefsOpen(true)}
            
          />

          {filtered.length === 0 ? (
            <div style={{ backgroundColor: EVCORE_COLORS.white, border: `0.5px solid ${EVCORE_COLORS.border}`, borderRadius: 12, padding: "48px 24px", textAlign: "center" }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: EVCORE_COLORS.textPrimary, marginBottom: 8 }}>No products found</div>
              <div style={{ fontSize: 12, color: EVCORE_COLORS.textSecondary, marginBottom: 16 }}>No products match your current filters.</div>
              <button onClick={onResetAllFilters} style={{ height: 34, padding: "0 18px", borderRadius: 8, border: `0.5px solid ${EVCORE_COLORS.border}`, backgroundColor: "transparent", fontSize: 12, fontWeight: 500, color: EVCORE_COLORS.textSecondary, cursor: "pointer" }}>Clear filters</button>
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

      <ProductDetailModal
        product={detailProduct}
        activeAssets={detailEnriched?.activeAssets ?? 0}
        totalAssets={detailEnriched?.totalAssets ?? 0}
        evoCount={detailEnriched?.evoCount ?? 0}
        onClose={() => setDetailProduct(null)}
      />
      <UpdateProductModal product={updateProduct} onClose={() => setUpdateProduct(null)} />
      <DeleteProductModal product={deleteProduct} onClose={() => setDeleteProduct(null)} />
      <CreateProductModal opened={createOpen}   onClose={() => setCreateOpen(false)} />
      <DownloadModal      opened={downloadOpen} onClose={() => setDownloadOpen(false)} columns={columns} />

      <EvoFormFiltersDrawer
        sections={EVO_PRODUCTS_FILTER_SECTIONS}
        opened={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        formControl={formMethods}
        onChangeFilter={onChangeFilter}
        onResetAll={onResetAllFilters}
      />
      <EvoPreferencesDrawer
        opened={prefsOpen} onClose={() => setPrefsOpen(false)}
        columns={columns} onChange={(k, v) => setColumns(p => p.map(c => c.key === k ? { ...c, visible: v } : c))}
        onReset={handleColumnReset}
      />
    </>
  );
}
