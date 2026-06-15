"use client";
import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Building2,
  MapPin,
  ChevronLeft,
  ExternalLink,
  Users,
  Zap,
  Battery,
  Search,
  X,
} from "lucide-react";
import { TextInput } from "@/components/lamt/text-input";
import { AppShell } from "@/components/evcore/layout/AppShell";
import { KpiCard } from "@/components/evcore/ui/KpiCard";
import { EvoStatusChip } from "@/components/lamt/evo-status-chip";
import { StatusChip, StatusChipType } from "@/components/lamt/status-chip";
import { Tabs, type TabItem } from "@/components/lamt/tabs";
import { Modal } from "@/components/lamt/modal";
import { Table, TableCellType, PaginationStrategy } from "@/components/lamt/table";
import {
  DUMMY_EMCS,
  EVO_ACCOUNTS as EVO_DATA,
  FLEET_ASSETS,
  EMC_BATTERIES,
  type DummyEmc,
  type EvoAccount,
  type FleetAsset,
  type EmcBattery,
} from "@/data/dummy";
import { EVCORE_COLORS, EVO_STATUS_LABELS } from "@/lib/evcore/constants";


// ─── Helpers ──────────────────────────────────────────────────────────────────

const LABEL_STYLE: React.CSSProperties = {
  minWidth: 130,
  fontSize: 11,
  color: EVCORE_COLORS.textSecondary,
  fontWeight: 500,
  flexShrink: 0,
};

const VALUE_STYLE: React.CSSProperties = {
  fontSize: 12.5,
  fontWeight: 500,
  color: EVCORE_COLORS.textPrimary,
};

const FIELD_ROW_STYLE: React.CSSProperties = {
  display: "flex",
  borderBottom: "0.5px solid #F0EFE9",
  paddingTop: 9,
  paddingBottom: 9,
  alignItems: "flex-start",
};

const FORM_LABEL_STYLE: React.CSSProperties = {
  display: "block",
  fontSize: 11,
  fontWeight: 600,
  color: EVCORE_COLORS.textSecondary,
  textTransform: "uppercase",
  letterSpacing: "0.04em",
  marginBottom: 5,
};

const FORM_INPUT_STYLE: React.CSSProperties = {
  height: 38,
  border: `0.5px solid ${EVCORE_COLORS.border}`,
  borderRadius: 8,
  padding: "0 12px",
  fontSize: 13,
  width: "100%",
  boxSizing: "border-box",
  outline: "none",
  color: EVCORE_COLORS.textPrimary,
  backgroundColor: EVCORE_COLORS.white,
};

function IsActiveChip({ active }: { active: boolean }) {
  return (
    <StatusChip type={active ? StatusChipType.Success : StatusChipType.Normal}>
      {active ? "Active" : "Inactive"}
    </StatusChip>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EmcDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const emc = DUMMY_EMCS.find((e) => e.code === id) ?? null;

  React.useEffect(() => {
    if (!emc) router.push("/emcs");
  }, [emc]);

  const [activeTab, setActiveTab] = React.useState("info");
  const [editOpen, setEditOpen] = React.useState(false);
  const [evoSearch, setEvoSearch] = React.useState("");
  const [evoStatusFilter, setEvoStatusFilter] = React.useState("ALL");
  const [assetSearch, setAssetSearch] = React.useState("");
  const [assetSubTab, setAssetSubTab] = React.useState<"vehicles" | "batteries">("vehicles");
  const [evoPage, setEvoPage] = React.useState(1);
  const [assetPage, setAssetPage] = React.useState(1);

  // All hooks must come before any conditional return
  const emcEvos = React.useMemo(() => {
    if (!emc) return [];
    return EVO_DATA.filter((e) => e.emcCode === emc.legacyCode);
  }, [emc]);

  const filteredEvos = React.useMemo(() => {
    const q = evoSearch.toLowerCase();
    return emcEvos.filter((e) => {
      const matchStatus = evoStatusFilter === "ALL" || e.status === evoStatusFilter;
      const matchSearch =
        !q ||
        e.fullName.toLowerCase().includes(q) ||
        e.evoCode.toLowerCase().includes(q);
      return matchStatus && matchSearch;
    });
  }, [emcEvos, evoSearch, evoStatusFilter]);

  const emcAssets = React.useMemo(() => {
    if (!emc) return [];
    return FLEET_ASSETS.filter((a) => a.emcCode === emc.legacyCode);
  }, [emc]);

  const filteredVehicles = React.useMemo(() => {
    const q = assetSearch.toLowerCase();
    return emcAssets.filter(
      (a) =>
        !q ||
        a.assetCode.toLowerCase().includes(q) ||
        a.productCode.toLowerCase().includes(q)
    );
  }, [emcAssets, assetSearch]);

  const emcBatteries = React.useMemo(() => {
    if (!emc) return [];
    return EMC_BATTERIES.filter((b) => b.legacyEmcCode === emc.legacyCode);
  }, [emc]);

  const filteredBatteries = React.useMemo(() => {
    const q = assetSearch.toLowerCase();
    return emcBatteries.filter(
      (b) => !q || b.batteryCode.toLowerCase().includes(q)
    );
  }, [emcBatteries, assetSearch]);

  if (!emc) return null;

  // ── INFO TAB ───────────────────────────────────────────────────────────────

  const infoTabContent = (
    <div>
      {/* Two-column grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
          marginBottom: 16,
        }}
      >
        {/* LEFT: Center details */}
        <div
          style={{
            backgroundColor: EVCORE_COLORS.white,
            border: `0.5px solid ${EVCORE_COLORS.border}`,
            borderRadius: 12,
            padding: 18,
          }}
        >
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: EVCORE_COLORS.textPrimary,
              marginBottom: 12,
            }}
          >
            Center details
          </div>

          <div style={FIELD_ROW_STYLE}>
            <span style={LABEL_STYLE}>Code</span>
            <span style={VALUE_STYLE}>
              <span style={{ fontFamily: "monospace" }}>{emc.code}</span>
            </span>
          </div>
          <div style={FIELD_ROW_STYLE}>
            <span style={LABEL_STYLE}>Name</span>
            <span style={VALUE_STYLE}>{emc.name}</span>
          </div>
          <div style={FIELD_ROW_STYLE}>
            <span style={LABEL_STYLE}>Province</span>
            <span style={VALUE_STYLE}>{emc.province}</span>
          </div>
          <div style={FIELD_ROW_STYLE}>
            <span style={LABEL_STYLE}>Zone Code</span>
            <span style={VALUE_STYLE}>
              <span style={{ fontFamily: "monospace" }}>{emc.zoneCode}</span>
            </span>
          </div>
          <div style={FIELD_ROW_STYLE}>
            <span style={LABEL_STYLE}>Area Code</span>
            <span style={VALUE_STYLE}>
              <span style={{ fontFamily: "monospace" }}>{emc.areaCode}</span>
            </span>
          </div>
          <div style={FIELD_ROW_STYLE}>
            <span style={LABEL_STYLE}>Address</span>
            <span style={{ ...VALUE_STYLE, maxWidth: 200 }}>{emc.address}</span>
          </div>
          <div style={FIELD_ROW_STYLE}>
            <span style={LABEL_STYLE}>Manager</span>
            <span style={VALUE_STYLE}>{emc.managerName}</span>
          </div>
          <div style={FIELD_ROW_STYLE}>
            <span style={LABEL_STYLE}>Manager Phone</span>
            <span style={VALUE_STYLE}>{emc.managerPhone}</span>
          </div>
          <div style={FIELD_ROW_STYLE}>
            <span style={LABEL_STYLE}>Operating Hours</span>
            <span style={VALUE_STYLE}>
              <span style={{ fontFamily: "monospace" }}>{emc.operatingHours}</span>
            </span>
          </div>
          <div style={FIELD_ROW_STYLE}>
            <span style={LABEL_STYLE}>Charging Capacity</span>
            <span style={VALUE_STYLE}>{emc.chargingCapacity} slots</span>
          </div>
          <div style={FIELD_ROW_STYLE}>
            <span style={LABEL_STYLE}>Battery Inventory</span>
            <span style={VALUE_STYLE}>{emc.batteryInventory} units</span>
          </div>
          <div style={FIELD_ROW_STYLE}>
            <span style={LABEL_STYLE}>Coordinates</span>
            <span style={VALUE_STYLE}>
              <span style={{ fontFamily: "monospace" }}>
                {emc.latitude}° S, {emc.longitude}° E
              </span>
            </span>
          </div>
          <div style={FIELD_ROW_STYLE}>
            <span style={LABEL_STYLE}>Status</span>
            <span style={VALUE_STYLE}>
              <IsActiveChip active={emc.isActive} />
            </span>
          </div>
          <div style={{ ...FIELD_ROW_STYLE, borderBottom: "none" }}>
            <span style={LABEL_STYLE}>Established</span>
            <span style={VALUE_STYLE}>
              {new Date(emc.establishedAt).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* RIGHT: Location */}
        <div
          style={{
            backgroundColor: EVCORE_COLORS.white,
            border: `0.5px solid ${EVCORE_COLORS.border}`,
            borderRadius: 12,
            padding: 18,
          }}
        >
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: EVCORE_COLORS.textPrimary,
              marginBottom: 12,
            }}
          >
            Location
          </div>

          {/* Mini map */}
          <div
            style={{
              height: 200,
              backgroundColor: "#EEF7F4",
              borderRadius: 10,
              position: "relative",
              overflow: "hidden",
              marginBottom: 12,
            }}
          >
            <svg width="100%" height="100%" viewBox="0 0 300 200">
              {/* Grid lines */}
              <line x1="0" y1="50"  x2="300" y2="50"  stroke="#C8E6D8" strokeWidth="0.5" />
              <line x1="0" y1="100" x2="300" y2="100" stroke="#C8E6D8" strokeWidth="0.5" />
              <line x1="0" y1="150" x2="300" y2="150" stroke="#C8E6D8" strokeWidth="0.5" />
              <line x1="75"  y1="0" x2="75"  y2="200" stroke="#C8E6D8" strokeWidth="0.5" />
              <line x1="150" y1="0" x2="150" y2="200" stroke="#C8E6D8" strokeWidth="0.5" />
              <line x1="225" y1="0" x2="225" y2="200" stroke="#C8E6D8" strokeWidth="0.5" />
              {/* Pin */}
              <circle cx="150" cy="100" r="14" fill="#1D9E75" opacity="0.2" />
              <circle cx="150" cy="100" r="7"  fill="#1D9E75" />
              <circle cx="150" cy="100" r="2.5" fill="white" />
              {/* Label */}
              <text
                x="150"
                y="128"
                textAnchor="middle"
                fontSize="10"
                fill="#11171E"
                fontWeight="600"
              >
                {emc.name}
              </text>
            </svg>
          </div>

          {/* Address row */}
          <div
            style={{
              display: "flex",
              gap: 6,
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <MapPin size={13} color={EVCORE_COLORS.green} />
            <span style={{ fontSize: 11, color: EVCORE_COLORS.textSecondary }}>
              {emc.address}
            </span>
          </div>

          {/* Get directions */}
          <button
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              fontSize: 11,
              color: EVCORE_COLORS.green,
              border: `0.5px solid ${EVCORE_COLORS.border}`,
              borderRadius: 6,
              padding: "5px 10px",
              backgroundColor: "transparent",
              cursor: "pointer",
            }}
          >
            <ExternalLink size={11} />
            Get directions ↗
          </button>
        </div>
      </div>

      {/* Full-width Recent activity card */}
      <div
        style={{
          backgroundColor: EVCORE_COLORS.white,
          border: `0.5px solid ${EVCORE_COLORS.border}`,
          borderRadius: 12,
          padding: 18,
        }}
      >
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: EVCORE_COLORS.textPrimary,
            marginBottom: 12,
          }}
        >
          Recent activity at this EMC
        </div>

        {/* Row 1 */}
        <div
          style={{
            display: "flex",
            gap: 12,
            alignItems: "flex-start",
            borderBottom: "0.5px solid #F0EFE9",
            paddingTop: 10,
            paddingBottom: 10,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: EVCORE_COLORS.green,
              marginTop: 3,
              flexShrink: 0,
            }}
          />
          <span style={{ fontSize: 12, color: EVCORE_COLORS.textPrimary, flex: 1 }}>
            Asset EV-0089 assigned to Ambroise Kalonji
          </span>
          <span
            style={{
              fontSize: 11,
              color: EVCORE_COLORS.textSecondary,
              whiteSpace: "nowrap",
              marginLeft: "auto",
            }}
          >
            Today 11:32
          </span>
        </div>

        {/* Row 2 */}
        <div
          style={{
            display: "flex",
            gap: 12,
            alignItems: "flex-start",
            borderBottom: "0.5px solid #F0EFE9",
            paddingTop: 10,
            paddingBottom: 10,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: EVCORE_COLORS.blue,
              marginTop: 3,
              flexShrink: 0,
            }}
          />
          <span style={{ fontSize: 12, color: EVCORE_COLORS.textPrimary, flex: 1 }}>
            New EVO registered — Béatrice Lukusa (EVO-0047)
          </span>
          <span
            style={{
              fontSize: 11,
              color: EVCORE_COLORS.textSecondary,
              whiteSpace: "nowrap",
              marginLeft: "auto",
            }}
          >
            Today 09:15
          </span>
        </div>

        {/* Row 3 */}
        <div
          style={{
            display: "flex",
            gap: 12,
            alignItems: "flex-start",
            paddingTop: 10,
            paddingBottom: 10,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: EVCORE_COLORS.green,
              marginTop: 3,
              flexShrink: 0,
            }}
          />
          <span style={{ fontSize: 12, color: EVCORE_COLORS.textPrimary, flex: 1 }}>
            Payment $42.00 received via M-Pesa — Grâce Mwamba
          </span>
          <span
            style={{
              fontSize: 11,
              color: EVCORE_COLORS.textSecondary,
              whiteSpace: "nowrap",
              marginLeft: "auto",
            }}
          >
            Yesterday 14:20
          </span>
        </div>
      </div>
    </div>
  );

  // ── EVOS TAB ───────────────────────────────────────────────────────────────

  const evoStatusOptions: { value: string; label: string }[] = [
    { value: "ALL", label: "All" },
    { value: "PENDING_BGC", label: "Awaiting BGC" },
    { value: "PENDING_OSP", label: "Awaiting Training" },
    { value: "PENDING_RP", label: "Awaiting Payment" },
    { value: "ACTIVE", label: "Active" },
    { value: "INACTIVE", label: "Inactive" },
  ];

  const evoTableData = filteredEvos.map((e) => ({
    id: e.id,
    evoCode: (
      <span
        style={{
          fontFamily: "monospace",
          fontSize: 12,
          fontWeight: 600,
          color: EVCORE_COLORS.green,
        }}
      >
        {e.evoCode}
      </span>
    ),
    fullName: (
      <span
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: EVCORE_COLORS.textPrimary,
        }}
      >
        {e.fullName}
      </span>
    ),
    phone: (
      <span style={{ fontSize: 12, color: EVCORE_COLORS.textSecondary }}>
        {e.phoneNumbers[0]}
      </span>
    ),
    product: (
      <span
        style={{
          fontFamily: "monospace",
          fontSize: 11,
          color: EVCORE_COLORS.textSecondary,
        }}
      >
        {e.evProductCode}
      </span>
    ),
    status: <EvoStatusChip status={e.status} />,
    balance: (
      <span
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: EVCORE_COLORS.textPrimary,
        }}
      >
        ${e.balance.toLocaleString()}
      </span>
    ),
    _raw: e,
  }));

  const evoColDefs = [
    { headerName: "EVO Code",  type: TableCellType.component, key: "evoCode"  },
    { headerName: "Full Name", type: TableCellType.component, key: "fullName" },
    { headerName: "Phone",     type: TableCellType.component, key: "phone"    },
    { headerName: "Product",   type: TableCellType.component, key: "product"  },
    { headerName: "Status",    type: TableCellType.component, key: "status"   },
    { headerName: "Balance",   type: TableCellType.component, key: "balance"  },
  ];

  const evosTabContent = (
    <div>
      {/* Search */}
      <div style={{ position: "relative", marginBottom: 12 }}>
        <Search
          size={14}
          color={EVCORE_COLORS.textSecondary}
          style={{
            position: "absolute",
            left: 12,
            top: "50%",
            transform: "translateY(-50%)",
            pointerEvents: "none",
          }}
        />
        <input
          type="text"
          placeholder="Search EVO name or code..."
          value={evoSearch}
          onChange={(e) => setEvoSearch(e.target.value)}
          style={{
            width: "100%",
            height: 36,
            paddingLeft: 36,
            paddingRight: evoSearch ? 34 : 12,
            border: `0.5px solid ${EVCORE_COLORS.border}`,
            borderRadius: 8,
            fontSize: 13,
            outline: "none",
            boxSizing: "border-box",
            color: EVCORE_COLORS.textPrimary,
            backgroundColor: EVCORE_COLORS.white,
          }}
        />
        {evoSearch && (
          <button
            onClick={() => setEvoSearch("")}
            style={{
              position: "absolute",
              right: 10,
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              display: "flex",
              alignItems: "center",
            }}
          >
            <X size={13} color={EVCORE_COLORS.textSecondary} />
          </button>
        )}
      </div>

      {/* Status filter pills */}
      <div
        style={{
          display: "flex",
          gap: 6,
          flexWrap: "wrap",
          marginBottom: 14,
        }}
      >
        {evoStatusOptions.map((opt) => {
          const active = evoStatusFilter === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => { setEvoStatusFilter(opt.value); setEvoPage(1); }}
              style={{
                height: 26,
                padding: "0 10px",
                borderRadius: 99,
                fontSize: 11,
                fontWeight: 600,
                cursor: "pointer",
                border: active ? "0.5px solid #5DCAA5" : `0.5px solid ${EVCORE_COLORS.border}`,
                backgroundColor: active ? "#E1F5EE" : EVCORE_COLORS.white,
                color: active ? "#0F6E56" : EVCORE_COLORS.textSecondary,
              }}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {emcEvos.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            fontSize: 13,
            color: EVCORE_COLORS.textSecondary,
            padding: 40,
          }}
        >
          No EVOs registered at this EMC yet
        </div>
      ) : (
        <div
          style={{
            backgroundColor: EVCORE_COLORS.white,
            border: `0.5px solid ${EVCORE_COLORS.border}`,
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          <Table
            data={evoTableData}
            colDefs={evoColDefs}
            hasActions={true}
            rowActions={(rowData) => (
              <button
                style={{
                  height: 26,
                  padding: "0 10px",
                  border: `0.5px solid ${EVCORE_COLORS.border}`,
                  borderRadius: 6,
                  fontSize: 11,
                  color: EVCORE_COLORS.textSecondary,
                  cursor: "pointer",
                  backgroundColor: "transparent",
                }}
              >
                View
              </button>
            )}
            currentPageNumber={evoPage}
            limit={5}
            totalData={filteredEvos.length}
            paginationStrategy={PaginationStrategy.LOCAL}
            onPageChange={setEvoPage}
            showCheckbox={false}
          />
        </div>
      )}
    </div>
  );

  // ── ASSETS TAB ─────────────────────────────────────────────────────────────

  const vehicleStatusMap: Record<string, { label: string; bg: string; text: string }> = {
    ON_ROAD:         { label: "On Road",     bg: "#E1F5EE", text: "#0F6E56" },
    OFF_ROAD_IDLE:   { label: "Available",   bg: "#E6F1FB", text: "#185FA5" },
    OFF_ROAD_FAULTY: { label: "Faulty",      bg: "#FAEEDA", text: "#854F0B" },
    RETIRED:         { label: "Retired",     bg: "#F3F3F1", text: "#6B7280" },
    WRITTEN_OFF:     { label: "Written Off", bg: "#FEE2E2", text: "#991B1B" },
  };

  const vehicleTableData = filteredVehicles.map((a) => {
    const s = vehicleStatusMap[a.status] ?? { label: a.status, bg: "#F3F3F1", text: "#6B7280" };
    return {
      id: a.id,
      assetCode: (
        <span
          style={{
            fontFamily: "monospace",
            fontSize: 12,
            fontWeight: 600,
            color: EVCORE_COLORS.green,
          }}
        >
          {a.assetCode}
        </span>
      ),
      productCode: (
        <span
          style={{
            fontFamily: "monospace",
            fontSize: 11,
            color: EVCORE_COLORS.textSecondary,
          }}
        >
          {a.productCode}
        </span>
      ),
      assignedEvo: a.assignedEvoCode ? (
        <span style={{ fontSize: 12 }}>
          <span style={{ fontFamily: "monospace", fontSize: 11, color: EVCORE_COLORS.green }}>
            {a.assignedEvoCode}
          </span>
          <br />
          <span style={{ color: EVCORE_COLORS.textSecondary }}>{a.assignedEvoName}</span>
        </span>
      ) : (
        <span style={{ fontSize: 11, color: EVCORE_COLORS.textSecondary }}>—</span>
      ),
      status: (
        <span
          style={{
            height: 20,
            padding: "0 7px",
            borderRadius: 99,
            color: s.text,
            fontSize: 10,
            fontWeight: 600,
            display: "inline-flex",
            alignItems: "center",
            backgroundColor: s.bg,
          }}
        >
          {s.label}
        </span>
      ),
      _raw: a,
    };
  });

  const vehicleColDefs = [
    { headerName: "Asset Code",   type: TableCellType.component, key: "assetCode"   },
    { headerName: "Product",      type: TableCellType.component, key: "productCode" },
    { headerName: "Assigned EVO", type: TableCellType.component, key: "assignedEvo" },
    { headerName: "Status",       type: TableCellType.component, key: "status"      },
  ];

  const batteryStatusMap: Record<string, { label: string; bg: string; text: string }> = {
    OFF_ROAD_IDLE:   { label: "Available", bg: "#E1F5EE", text: "#0F6E56" },
    ON_ROAD:         { label: "In Use",    bg: "#E6F1FB", text: "#185FA5" },
    OFF_ROAD_FAULTY: { label: "Faulty",    bg: "#FAEEDA", text: "#854F0B" },
    RETIRED:         { label: "Retired",   bg: "#F3F3F1", text: "#6B7280" },
    WRITTEN_OFF:     { label: "Written Off", bg: "#FEE2E2", text: "#991B1B" },
  };

  const COMPATIBLE_TYPE_LABELS: Record<string, string> = {
    TWO_WHEELER:   "2-Wheeler",
    THREE_WHEELER: "3-Wheeler",
    CART:          "Cart",
  };

  const batteryTableData = filteredBatteries.map((b) => {
    const cycleColor =
      b.cycleCount <= 200 ? "#0F6E56" : b.cycleCount <= 350 ? "#854F0B" : "#991B1B";
    const rangeColor =
      b.rangeKm >= 90 ? "#0F6E56" : b.rangeKm >= 60 ? "#854F0B" : "#991B1B";
    const bs = batteryStatusMap[b.status] ?? { label: b.status, bg: "#F3F3F1", text: "#6B7280" };
    return {
      id: b.id,
      batteryCode: (
        <span style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 600, color: EVCORE_COLORS.green }}>
          {b.batteryCode}
        </span>
      ),
      compatibleEvType: (
        <span style={{ fontSize: 12 }}>{COMPATIBLE_TYPE_LABELS[b.compatibleEvType] ?? b.compatibleEvType}</span>
      ),
      capacityKwh: (
        <span style={{ fontSize: 12, fontFamily: "monospace" }}>{b.capacityKwh} kWh</span>
      ),
      cycleCount: (
        <span style={{ fontSize: 12, fontWeight: 600, color: cycleColor }}>{b.cycleCount}</span>
      ),
      rangeKm: (
        <span style={{ fontSize: 12, fontWeight: 600, color: rangeColor }}>{b.rangeKm} km</span>
      ),
      batteryStatus: (
        <span
          style={{
            height: 20, padding: "0 7px", borderRadius: 99,
            backgroundColor: bs.bg, color: bs.text,
            fontSize: 10, fontWeight: 600,
            display: "inline-flex", alignItems: "center",
          }}
        >
          {bs.label}
        </span>
      ),
      _raw: b,
    };
  });

  const batteryColDefs = [
    { headerName: "Battery Code", type: TableCellType.component, key: "batteryCode"    },
    { headerName: "EV Type",      type: TableCellType.component, key: "compatibleEvType" },
    { headerName: "Capacity",     type: TableCellType.component, key: "capacityKwh"    },
    { headerName: "Cycles",       type: TableCellType.component, key: "cycleCount"     },
    { headerName: "Range",        type: TableCellType.component, key: "rangeKm"        },
    { headerName: "Status",       type: TableCellType.component, key: "batteryStatus"  },
  ];

  const assetsTabContent = (
    <div>
      {/* Sub-tab pills */}
      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        {(["vehicles", "batteries"] as const).map((sub) => {
          const active = assetSubTab === sub;
          return (
            <button
              key={sub}
              onClick={() => { setAssetSubTab(sub); setAssetPage(1); }}
              style={{
                height: 26,
                padding: "0 10px",
                borderRadius: 99,
                fontSize: 11,
                fontWeight: 600,
                cursor: "pointer",
                border: active ? "0.5px solid #5DCAA5" : `0.5px solid ${EVCORE_COLORS.border}`,
                backgroundColor: active ? "#E1F5EE" : EVCORE_COLORS.white,
                color: active ? "#0F6E56" : EVCORE_COLORS.textSecondary,
              }}
            >
              {sub === "vehicles" ? "EV Vehicles" : "Batteries"}
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div style={{ position: "relative", marginBottom: 14 }}>
        <Search
          size={14}
          color={EVCORE_COLORS.textSecondary}
          style={{
            position: "absolute",
            left: 12,
            top: "50%",
            transform: "translateY(-50%)",
            pointerEvents: "none",
          }}
        />
        <input
          type="text"
          placeholder={
            assetSubTab === "vehicles"
              ? "Search asset code or product..."
              : "Search battery code..."
          }
          value={assetSearch}
          onChange={(e) => setAssetSearch(e.target.value)}
          style={{
            width: "100%",
            height: 36,
            paddingLeft: 36,
            paddingRight: assetSearch ? 34 : 12,
            border: `0.5px solid ${EVCORE_COLORS.border}`,
            borderRadius: 8,
            fontSize: 13,
            outline: "none",
            boxSizing: "border-box",
            color: EVCORE_COLORS.textPrimary,
            backgroundColor: EVCORE_COLORS.white,
          }}
        />
        {assetSearch && (
          <button
            onClick={() => setAssetSearch("")}
            style={{
              position: "absolute",
              right: 10,
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              display: "flex",
              alignItems: "center",
            }}
          >
            <X size={13} color={EVCORE_COLORS.textSecondary} />
          </button>
        )}
      </div>

      {/* EV Vehicles */}
      {assetSubTab === "vehicles" && (
        emcAssets.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              fontSize: 13,
              color: EVCORE_COLORS.textSecondary,
              padding: 40,
            }}
          >
            No vehicles at this EMC
          </div>
        ) : (
          <div
            style={{
              backgroundColor: EVCORE_COLORS.white,
              border: `0.5px solid ${EVCORE_COLORS.border}`,
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            <Table
              data={vehicleTableData}
              colDefs={vehicleColDefs}
              hasActions={false}
              showCheckbox={false}
              paginationStrategy={PaginationStrategy.LOCAL}
              limit={5}
              currentPageNumber={assetPage}
              totalData={filteredVehicles.length}
              onPageChange={setAssetPage}
            />
          </div>
        )
      )}

      {/* Batteries */}
      {assetSubTab === "batteries" && (
        emcBatteries.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              fontSize: 13,
              color: EVCORE_COLORS.textSecondary,
              padding: 40,
            }}
          >
            No batteries at this EMC
          </div>
        ) : (
          <div
            style={{
              backgroundColor: EVCORE_COLORS.white,
              border: `0.5px solid ${EVCORE_COLORS.border}`,
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            <Table
              data={batteryTableData}
              colDefs={batteryColDefs}
              hasActions={false}
              showCheckbox={false}
              paginationStrategy={PaginationStrategy.LOCAL}
              limit={5}
              currentPageNumber={assetPage}
              totalData={filteredBatteries.length}
              onPageChange={setAssetPage}
            />
          </div>
        )
      )}
    </div>
  );

  // ── Tabs assembly ──────────────────────────────────────────────────────────

  const tabs: TabItem[] = [
    { id: "info",   label: "Info",   content: infoTabContent   },
    { id: "evos",   label: "EVOs",   content: evosTabContent   },
    { id: "assets", label: "Assets", content: assetsTabContent },
  ];

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <AppShell pageTitle="EMC Centers">
      <div style={{ backgroundColor: EVCORE_COLORS.pageBg, minHeight: "100%" }}>

        {/* Breadcrumb */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            marginBottom: 16,
          }}
        >
          <button
            onClick={() => router.push("/emcs")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 2,
              fontSize: 13,
              color: EVCORE_COLORS.green,
              cursor: "pointer",
              background: "none",
              border: "none",
              padding: 0,
            }}
          >
            <ChevronLeft size={14} />
            EMC Centers
          </button>
          <span style={{ color: EVCORE_COLORS.textSecondary, fontSize: 13 }}>›</span>
          <span style={{ fontSize: 13, color: EVCORE_COLORS.textSecondary }}>{emc.name}</span>
        </div>

        {/* Header card */}
        <div
          style={{
            backgroundColor: EVCORE_COLORS.white,
            border: `0.5px solid ${EVCORE_COLORS.border}`,
            borderLeft: `4px solid ${EVCORE_COLORS.green}`,
            borderRadius: 12,
            padding: "18px 20px",
            marginBottom: 16,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 16,
          }}
        >
          {/* Left group */}
          <div
            style={{
              display: "flex",
              gap: 12,
              alignItems: "center",
              flex: 1,
            }}
          >
            {/* Icon circle */}
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                backgroundColor: "#E1F5EE",
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Building2 size={20} color={EVCORE_COLORS.green} />
            </div>

            {/* Text group */}
            <div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <span
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: EVCORE_COLORS.textPrimary,
                    display: "inline",
                  }}
                >
                  {emc.name}
                </span>
                <span style={{ display: "inline", marginLeft: 10 }}>
                  <IsActiveChip active={emc.isActive} />
                </span>
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: EVCORE_COLORS.textSecondary,
                  marginTop: 2,
                }}
              >
                {emc.province}, DRC
              </div>
              <span
                style={{
                  fontFamily: "monospace",
                  backgroundColor: "#F1EFE8",
                  color: "#5F5E5A",
                  fontSize: 11,
                  padding: "2px 8px",
                  borderRadius: 99,
                  display: "inline-block",
                  marginTop: 4,
                }}
              >
                {emc.code}
              </span>
            </div>
          </div>

          {/* Right group */}
          <div style={{ marginLeft: "auto" }}>
            <button
              onClick={() => setEditOpen(true)}
              style={{
                height: 36,
                padding: "0 16px",
                border: `0.5px solid ${EVCORE_COLORS.border}`,
                borderRadius: 8,
                backgroundColor: "transparent",
                fontSize: 13,
                fontWeight: 500,
                color: EVCORE_COLORS.textSecondary,
                cursor: "pointer",
              }}
            >
              Edit EMC
            </button>
          </div>
        </div>

        {/* KPI row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 12,
            marginBottom: 16,
          }}
        >
          <KpiCard
            label="Total EVOs"
            value={String(emcEvos.length)}
            delta="+4 this month"
            deltaType="positive"
            icon={Users}
          />
          <KpiCard
            label="Active Assets"
            value={String(
              emcAssets.filter((a) => a.status === "ON_ROAD").length +
                emcAssets.filter((a) => a.status === "OFF_ROAD_IDLE").length
            )}
            delta="Vehicles & carts"
            deltaType="positive"
            icon={Building2}
          />
          <KpiCard
            label="Charging Capacity"
            value={emc.chargingCapacity + " slots"}
            delta="Available"
            deltaType="neutral"
            icon={Zap}
          />
          <KpiCard
            label="Battery Inventory"
            value={emc.batteryInventory + " units"}
            delta="In stock"
            deltaType="neutral"
            icon={Battery}
          />
        </div>

        {/* Tabs */}
        <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* Edit EMC Modal */}
      <Modal
        opened={editOpen}
        title="Edit EMC Center"
        maxWidth={620}
        onClose={() => setEditOpen(false)}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={FORM_LABEL_STYLE}>EMC Code</label>
              <TextInput name="code" defaultValue={emc.code} />
            </div>
            <div>
              <label style={FORM_LABEL_STYLE}>EMC Name</label>
              <TextInput name="name" defaultValue={emc.name} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={FORM_LABEL_STYLE}>Province</label>
              <TextInput name="province" defaultValue={emc.province} />
            </div>
            <div>
              <label style={FORM_LABEL_STYLE}>Zone Code</label>
              <TextInput name="zoneCode" defaultValue={emc.zoneCode} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={FORM_LABEL_STYLE}>Area Code</label>
              <TextInput name="areaCode" defaultValue={emc.areaCode} />
            </div>
            <div>
              <label style={FORM_LABEL_STYLE}>Address</label>
              <TextInput name="address" defaultValue={emc.address} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={FORM_LABEL_STYLE}>Manager Name</label>
              <TextInput name="managerName" defaultValue={emc.managerName} />
            </div>
            <div>
              <label style={FORM_LABEL_STYLE}>Manager Phone</label>
              <TextInput name="managerPhone" type="phone" defaultValue={emc.managerPhone} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={FORM_LABEL_STYLE}>Operating Hours</label>
              <TextInput name="operatingHours" defaultValue={emc.operatingHours} />
            </div>
            <div>
              <label style={FORM_LABEL_STYLE}>Charging Capacity</label>
              <TextInput name="chargingCapacity" type="number" defaultValue={String(emc.chargingCapacity)} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={FORM_LABEL_STYLE}>Battery Inventory</label>
              <TextInput name="batteryInventory" type="number" defaultValue={String(emc.batteryInventory)} />
            </div>
            <div>
              <label style={FORM_LABEL_STYLE}>Coordinates</label>
              <TextInput name="latitude" placeholder={`${emc.latitude}, ${emc.longitude}`} disabled />
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 4 }}>
            <span style={{ fontSize: 13, color: EVCORE_COLORS.textPrimary, fontWeight: 500 }}>Active EMC</span>
            <IsActiveChip active={emc.isActive} />
          </div>

          {/* Footer */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              paddingTop: 16,
              borderTop: `0.5px solid ${EVCORE_COLORS.border}`,
              marginTop: 8,
            }}
          >
            <button
              onClick={() => setEditOpen(false)}
              style={{
                height: 40, padding: "0 20px",
                border: `0.5px solid ${EVCORE_COLORS.border}`, borderRadius: 8,
                backgroundColor: "transparent", fontSize: 13,
                color: EVCORE_COLORS.textSecondary, cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              style={{
                height: 40, padding: "0 22px", border: "none", borderRadius: 8,
                backgroundColor: EVCORE_COLORS.green, fontSize: 13,
                fontWeight: 700, color: EVCORE_COLORS.white, cursor: "pointer",
              }}
            >
              Save changes
            </button>
          </div>
        </div>
      </Modal>
    </AppShell>
  );
}
