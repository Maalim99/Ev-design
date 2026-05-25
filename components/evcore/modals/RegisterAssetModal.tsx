"use client";

import * as React from "react";
import { X } from "lucide-react";
import { EVCORE_COLORS } from "@/lib/evcore/constants";
import { EMC_ZONES } from "@/data/dummy";

const PRODUCTS: { code: string; label: string; evType: string }[] = [
  { code: "ALTECH-EMMO-A1", label: "ALTECH-EMMO-A1 — 2W Electric Moto",    evType: "TWO_WHEELER"   },
  { code: "ALTECH-EPAT-A1", label: "ALTECH-EPAT-A1 — 2W Electric Patrol",  evType: "TWO_WHEELER"   },
  { code: "ALTECH-F3-2B",   label: "ALTECH-F3-2B — 2W F3 (2-Battery)",     evType: "TWO_WHEELER"   },
  { code: "ALTECH-E3-2B",   label: "ALTECH-E3-2B — 2W E3 (2-Battery)",     evType: "TWO_WHEELER"   },
  { code: "ALTECH-T1-2B",   label: "ALTECH-T1-2B — 3W Tricycle T1",        evType: "THREE_WHEELER" },
  { code: "ALTECH-T2-2B",   label: "ALTECH-T2-2B — 3W Tricycle T2",        evType: "THREE_WHEELER" },
  { code: "ALTECH-T3-2B",   label: "ALTECH-T3-2B — 3W Tricycle T3",        evType: "THREE_WHEELER" },
  { code: "ALTECH-ECAT-A1", label: "ALTECH-ECAT-A1 — Cart",                evType: "CART"          },
];

const EV_TYPE_LABEL: Record<string, string> = {
  TWO_WHEELER:   "Two-Wheeler (2W)",
  THREE_WHEELER: "Three-Wheeler (3W)",
  CART:          "Cart",
};

interface FormState {
  productCode: string;
  assetKey: string;
  omnivoltaicDeviceId: string;
  chipType: string;
  invoiceNumber: string;
  invoiceDate: string;
  emcZone: string;
}

const EMPTY: FormState = {
  productCode: "", assetKey: "", omnivoltaicDeviceId: "",
  chipType: "Omnivoltaic", invoiceNumber: "", invoiceDate: "", emcZone: "",
};

interface RegisterAssetModalProps {
  opened: boolean;
  onClose: () => void;
}

export function RegisterAssetModal({ opened, onClose }: RegisterAssetModalProps) {
  const [form, setForm]       = React.useState<FormState>(EMPTY);
  const [focused, setFocused] = React.useState<string | null>(null);

  if (!opened) return null;

  const selectedProduct = PRODUCTS.find(p => p.code === form.productCode);

  const set = (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [key]: e.target.value }));

  const setProduct = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setForm(f => ({ ...f, productCode: e.target.value }));

  const focus = (name: string) => () => setFocused(name);
  const blur  = () => setFocused(null);

  const iStyle = (name: string): React.CSSProperties => ({
    width: "100%", height: 40,
    border: `1px solid ${focused === name ? EVCORE_COLORS.green : EVCORE_COLORS.border}`,
    borderRadius: 8, padding: "0 13px",
    fontSize: 14, color: EVCORE_COLORS.textPrimary,
    backgroundColor: EVCORE_COLORS.white,
    outline: "none", boxSizing: "border-box",
    transition: "border-color 0.15s",
  });
  const sStyle = (name: string): React.CSSProperties => ({ ...iStyle(name), cursor: "pointer" });

  const labelStyle: React.CSSProperties = {
    fontSize: 12, fontWeight: 600, color: EVCORE_COLORS.textSecondary,
    display: "block", marginBottom: 6, letterSpacing: "0.04em", textTransform: "uppercase",
  };

  const field = (label: string, child: React.ReactNode) => (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <label style={labelStyle}>{label}</label>
      {child}
    </div>
  );

  const row2 = (a: React.ReactNode, b: React.ReactNode) => (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>{a}{b}</div>
  );

  const isValid = form.productCode && form.assetKey && form.omnivoltaicDeviceId &&
                  form.invoiceNumber && form.invoiceDate && form.emcZone;

  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, zIndex: 50, backgroundColor: "rgba(17,23,30,0.45)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ backgroundColor: EVCORE_COLORS.white, borderRadius: 14, width: "100%", maxWidth: 580, maxHeight: "90vh", overflowY: "auto", border: `0.5px solid ${EVCORE_COLORS.border}` }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 24px", borderBottom: `0.5px solid ${EVCORE_COLORS.border}` }}>
          <span style={{ fontSize: 17, fontWeight: 700, color: EVCORE_COLORS.textPrimary }}>Register New Asset</span>
          <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: 7, border: `0.5px solid ${EVCORE_COLORS.border}`, backgroundColor: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <X size={14} color={EVCORE_COLORS.textSecondary} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 14 }}>

          {/* Product */}
          {field("EV Product *", (
            <select style={sStyle("productCode")} value={form.productCode} onChange={setProduct} onFocus={focus("productCode")} onBlur={blur}>
              <option value="">Select product…</option>
              {PRODUCTS.map(p => <option key={p.code} value={p.code}>{p.label}</option>)}
            </select>
          ))}

          {/* EV type badge (auto) */}
          {selectedProduct && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 13px", backgroundColor: EVCORE_COLORS.pageBg, border: `0.5px solid ${EVCORE_COLORS.border}`, borderRadius: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: EVCORE_COLORS.textSecondary, textTransform: "uppercase", letterSpacing: "0.04em" }}>EV Type</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: EVCORE_COLORS.textPrimary }}>{EV_TYPE_LABEL[selectedProduct.evType]}</span>
            </div>
          )}

          {row2(
            field("Serial Number (Asset Key) *", (
              <input style={iStyle("assetKey")} value={form.assetKey} onChange={set("assetKey")} onFocus={focus("assetKey")} onBlur={blur} placeholder="e.g. SN-F3-20260101-01" />
            )),
            field("Omnivoltaic Device ID *", (
              <input style={iStyle("omnivoltaicDeviceId")} value={form.omnivoltaicDeviceId} onChange={set("omnivoltaicDeviceId")} onFocus={focus("omnivoltaicDeviceId")} onBlur={blur} placeholder="e.g. OV-DVC-00301" />
            ))
          )}

          {field("Chip Type", (
            <input style={iStyle("chipType")} value={form.chipType} onChange={set("chipType")} onFocus={focus("chipType")} onBlur={blur} placeholder="Omnivoltaic" />
          ))}

          {row2(
            field("Invoice Number *", (
              <input style={iStyle("invoiceNumber")} value={form.invoiceNumber} onChange={set("invoiceNumber")} onFocus={focus("invoiceNumber")} onBlur={blur} placeholder="e.g. INV-2026-0301" />
            )),
            field("Invoice Date *", (
              <input style={iStyle("invoiceDate")} type="date" value={form.invoiceDate} onChange={set("invoiceDate")} onFocus={focus("invoiceDate")} onBlur={blur} />
            ))
          )}

          {field("Assign to EMC *", (
            <select style={sStyle("emcZone")} value={form.emcZone} onChange={set("emcZone")} onFocus={focus("emcZone")} onBlur={blur}>
              <option value="">Select EMC zone…</option>
              {EMC_ZONES.map(z => <option key={z}>{z}</option>)}
            </select>
          ))}

          <div style={{ fontSize: 11, color: EVCORE_COLORS.textSecondary, backgroundColor: EVCORE_COLORS.pageBg, border: `0.5px solid ${EVCORE_COLORS.border}`, borderRadius: 7, padding: "9px 12px", lineHeight: 1.6 }}>
            Asset will be registered with status <strong>Off Road – Idle</strong> and assigned to the selected EMC. It can be deployed to an EVO via the Handover flow.
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, padding: "16px 24px", borderTop: `0.5px solid ${EVCORE_COLORS.border}` }}>
          <button onClick={onClose} style={{ height: 38, padding: "0 20px", borderRadius: 8, border: `0.5px solid ${EVCORE_COLORS.border}`, backgroundColor: "transparent", fontSize: 13, fontWeight: 500, color: EVCORE_COLORS.textSecondary, cursor: "pointer" }}>
            Cancel
          </button>
          <button
            onClick={isValid ? onClose : undefined}
            style={{ height: 38, padding: "0 22px", borderRadius: 8, border: "none", backgroundColor: isValid ? EVCORE_COLORS.green : EVCORE_COLORS.border, fontSize: 13, fontWeight: 700, color: isValid ? "#fff" : EVCORE_COLORS.textSecondary, cursor: isValid ? "pointer" : "not-allowed", transition: "background-color 0.15s" }}
          >
            Register Asset
          </button>
        </div>
      </div>
    </div>
  );
}
