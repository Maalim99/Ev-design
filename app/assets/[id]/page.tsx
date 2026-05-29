"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/evcore/layout/AppShell";
import { StatusChip, StatusChipType } from "@/components/lamt/status-chip";
import { FLEET_ASSETS, EMC_BATTERIES, type AssetFleetStatus } from "@/data/dummy";
import { EVCORE_COLORS } from "@/lib/evcore/constants";

// ─── Style constants (same pattern as emcs/[id] and settings) ─────────────────

const LABEL_STYLE: React.CSSProperties = {
  minWidth: 160, fontSize: 11, color: EVCORE_COLORS.textSecondary,
  fontWeight: 500, flexShrink: 0,
};
const VALUE_STYLE: React.CSSProperties = {
  fontSize: 12.5, fontWeight: 500, color: EVCORE_COLORS.textPrimary, flex: 1,
};
const FIELD_ROW: React.CSSProperties = {
  display: "flex", alignItems: "center",
  borderBottom: "0.5px solid #F0EFE9", paddingTop: 9, paddingBottom: 9,
};
const CARD: React.CSSProperties = {
  backgroundColor: EVCORE_COLORS.white,
  border: `0.5px solid ${EVCORE_COLORS.border}`,
  borderRadius: 12, padding: 18,
};
const CARD_TITLE: React.CSSProperties = {
  fontSize: 13, fontWeight: 600, color: EVCORE_COLORS.textPrimary, marginBottom: 12,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_CHIP: Record<AssetFleetStatus, { type: StatusChipType; label: string }> = {
  ON_ROAD:            { type: StatusChipType.Success,  label: "On Road"            },
  OFF_ROAD_IDLE:      { type: StatusChipType.Accent,   label: "Available"          },
  OFF_ROAD_FAULTY:    { type: StatusChipType.Warning,  label: "Faulty"             },
  RETIRED_PAID_OFF:   { type: StatusChipType.Normal,   label: "Retired – Paid Off" },
  RETIRED_UNDER_PAID: { type: StatusChipType.DangerM,  label: "Retired – Underpaid"},
  RETIRED_OVER_PAID:  { type: StatusChipType.AccentM,  label: "Retired – Overpaid" },
  WRITTEN_OFF:        { type: StatusChipType.Danger,   label: "Written Off"        },
};

const EV_TYPE_LABEL: Record<string, string> = {
  TWO_WHEELER: "2-Wheeler", THREE_WHEELER: "3-Wheeler", CART: "Cart",
};

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div style={FIELD_ROW}>
      <span style={LABEL_STYLE}>{label}</span>
      <span style={VALUE_STYLE}>{value ?? "—"}</span>
    </div>
  );
}

function FieldLast({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div style={{ ...FIELD_ROW, borderBottom: "none" }}>
      <span style={LABEL_STYLE}>{label}</span>
      <span style={VALUE_STYLE}>{value ?? "—"}</span>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AssetDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const asset = FLEET_ASSETS.find(a => a.assetCode === id);
  const batteries = EMC_BATTERIES.filter(b => b.legacyEmcCode === asset?.emcCode);

  if (!asset) {
    return (
      <AppShell pageTitle="Asset Not Found">
        <div style={{ padding: 40, textAlign: "center", color: EVCORE_COLORS.textSecondary }}>
          Asset <code>{id}</code> not found.
        </div>
      </AppShell>
    );
  }

  const { type: chipType, label: chipLabel } = STATUS_CHIP[asset.status];

  return (
    <AppShell pageTitle={`Asset ${asset.assetCode}`}>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

        {/* ── Back + header ──────────────────────────────────────────────── */}
        <div>
          <button
            onClick={() => router.back()}
            style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: EVCORE_COLORS.textSecondary, background: "none", border: "none", cursor: "pointer", padding: 0, marginBottom: 12 }}
          >
            <ArrowLeft size={14} /> Back to Assets
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 20, fontWeight: 700, color: EVCORE_COLORS.textPrimary, fontFamily: "monospace" }}>{asset.assetCode}</span>
                <StatusChip type={chipType}>{chipLabel}</StatusChip>
              </div>
              <div style={{ fontSize: 12, color: EVCORE_COLORS.textSecondary, marginTop: 2 }}>
                {EV_TYPE_LABEL[asset.evType]} · {asset.productCode} · {asset.emcName}
              </div>
            </div>
          </div>
        </div>

        {/* ── Info cards ─────────────────────────────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

          {/* Asset details */}
          <div style={CARD}>
            <div style={CARD_TITLE}>Asset Details</div>
            <Field     label="Asset Code"        value={<span style={{ fontFamily: "monospace", color: EVCORE_COLORS.green, fontWeight: 700 }}>{asset.assetCode}</span>} />
            <Field     label="Serial Number"     value={<span style={{ fontFamily: "monospace", fontSize: 12 }}>{asset.assetKey}</span>} />
            <Field     label="Product Code"      value={<span style={{ fontFamily: "monospace", fontSize: 11 }}>{asset.productCode}</span>} />
            <Field     label="EV Type"           value={EV_TYPE_LABEL[asset.evType]} />
            <Field     label="IoT Device ID"     value={<span style={{ fontFamily: "monospace", fontSize: 11 }}>{asset.omnivoltaicDeviceId}</span>} />
            <FieldLast label="Chip Type"         value={asset.chipType} />
          </div>

          {/* Deployment & assignment */}
          <div style={CARD}>
            <div style={CARD_TITLE}>Deployment & Assignment</div>
            <Field     label="EMC"               value={<><span style={{ fontFamily: "monospace", fontSize: 11 }}>{asset.emcCode}</span> · {asset.emcName}</>} />
            <Field     label="Invoice Number"    value={<span style={{ fontFamily: "monospace", fontSize: 11 }}>{asset.invoiceNumber}</span>} />
            <Field     label="Invoice Date"      value={asset.invoiceDate} />
            <Field     label="Deployment Date"   value={asset.deploymentDate ?? <span style={{ color: EVCORE_COLORS.textSecondary }}>Not deployed</span>} />
            <Field     label="Assigned EVO"      value={
              asset.assignedEvoCode
                ? <><span style={{ fontFamily: "monospace", fontSize: 11, color: EVCORE_COLORS.green }}>{asset.assignedEvoCode}</span> · {asset.assignedEvoName}</>
                : <span style={{ color: EVCORE_COLORS.textSecondary }}>Unassigned</span>
            } />
            <FieldLast label="Status"            value={<StatusChip type={chipType}>{chipLabel}</StatusChip>} />
          </div>
        </div>

        {/* ── Batteries at same EMC ──────────────────────────────────────── */}
        {batteries.length > 0 && (
          <div style={CARD}>
            <div style={CARD_TITLE}>Batteries at {asset.emcName}</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 10 }}>
              {batteries.map(b => {
                const bChip = STATUS_CHIP[b.status];
                return (
                  <div key={b.id} style={{ backgroundColor: EVCORE_COLORS.pageBg, borderRadius: 8, padding: "12px 14px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <span style={{ fontFamily: "monospace", fontSize: 11, fontWeight: 700, color: EVCORE_COLORS.green }}>{b.batteryCode}</span>
                      <StatusChip type={bChip.type}>{bChip.label}</StatusChip>
                    </div>
                    <div style={{ fontSize: 11, color: EVCORE_COLORS.textSecondary, lineHeight: 1.8 }}>
                      <div>{EV_TYPE_LABEL[b.compatibleEvType]} · {b.capacityKwh} kWh</div>
                      <div>Cycles: <span style={{ color: b.cycleCount > 300 ? EVCORE_COLORS.danger : EVCORE_COLORS.textPrimary, fontWeight: 500 }}>{b.cycleCount}</span></div>
                      <div>Range: {b.rangeKm} km</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </AppShell>
  );
}
