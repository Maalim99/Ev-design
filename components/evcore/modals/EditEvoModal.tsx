"use client";

import * as React from "react";
import { UserCog } from "lucide-react";
import { Modal } from "@/components/lamt/modal";
import { EVCORE_COLORS } from "@/lib/evcore/constants";
import { StatusChip, StatusChipType } from "@/components/lamt/status-chip";
import { EMC_ZONES, type EvoAccount, type EvoStatus } from "@/data/dummy";

const PRODUCTS = [
  "ALTECH-EMMO-A1", "ALTECH-EPAT-A1", "ALTECH-F3-2B",
  "ALTECH-E3-2B",   "ALTECH-T1-2B",   "ALTECH-T2-2B",
  "ALTECH-T3-2B",   "ALTECH-ECAT-A1",
];

const STATUS_CHIP: Record<EvoStatus, { type: StatusChipType; label: string }> = {
  ACTIVE:      { type: StatusChipType.Success, label: "Active"      },
  PENDING_BGC: { type: StatusChipType.Warning, label: "Pending BGC" },
  PENDING_OSP: { type: StatusChipType.Accent,  label: "Pending OSP" },
  PENDING_RP:  { type: StatusChipType.Info,    label: "Pending RP"  },
  PARTIAL_RP:  { type: StatusChipType.AccentM, label: "Partial RP"  },
  PENDING_HO:  { type: StatusChipType.AccentM, label: "Pending HO"  },
  INACTIVE:    { type: StatusChipType.Normal,  label: "Inactive"    },
  DISENGAGED:  { type: StatusChipType.Danger,  label: "Disengaged"  },
};

interface Form {
  fullName: string; phone: string; dob: string; gender: string;
  maritalStatus: string; currentWork: string; housingStatus: string;
  city: string; commune: string; quartier: string; avenue: string; plotNumber: string;
  hasSmartphone: boolean; worksSaturday: boolean; worksSunday: boolean;
  emcZone: string; evProductCode: string;
}

function fromEvo(evo: EvoAccount): Form {
  return {
    fullName: evo.fullName, phone: evo.phoneNumbers[0] ?? "", dob: evo.dateOfBirth,
    gender: evo.gender, maritalStatus: evo.maritalStatus, currentWork: evo.currentWork,
    housingStatus: evo.housingStatus, city: evo.address.city, commune: evo.address.commune,
    quartier: evo.address.quartier, avenue: evo.address.avenue, plotNumber: evo.address.plotNumber,
    hasSmartphone: evo.hasSmartphone, worksSaturday: evo.worksSaturday, worksSunday: evo.worksSunday,
    emcZone: evo.emcName, evProductCode: evo.evProductCode,
  };
}

// ─── Field primitives ─────────────────────────────────────────────────────────

const L: React.CSSProperties = {
  fontSize: 11, fontWeight: 600, color: EVCORE_COLORS.textSecondary,
  textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 4, display: "block",
};

function iStyle(focused: boolean): React.CSSProperties {
  return {
    width: "100%", height: 36, boxSizing: "border-box",
    border: `1px solid ${focused ? EVCORE_COLORS.green : EVCORE_COLORS.border}`,
    borderRadius: 7, padding: "0 10px", fontSize: 13,
    color: EVCORE_COLORS.textPrimary, backgroundColor: EVCORE_COLORS.white,
    outline: "none",
  };
}

function F({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label style={L}>{label}</label>{children}</div>;
}

function Divider({ title }: { title: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <span style={{ fontSize: 11, fontWeight: 700, color: EVCORE_COLORS.textSecondary, letterSpacing: "0.06em", textTransform: "uppercase", whiteSpace: "nowrap" }}>{title}</span>
      <div style={{ flex: 1, height: "0.5px", backgroundColor: EVCORE_COLORS.border }} />
    </div>
  );
}

function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label style={{ display: "inline-flex", alignItems: "center", gap: 7, cursor: "pointer", userSelect: "none" }}>
      <input
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        style={{ width: 15, height: 15, accentColor: EVCORE_COLORS.green, cursor: "pointer" }}
      />
      <span style={{ fontSize: 13, color: EVCORE_COLORS.textPrimary }}>{label}</span>
    </label>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function EditEvoModal({ evo, onClose }: { evo: EvoAccount | null; onClose: () => void }) {
  const [form,    setForm]    = React.useState<Form | null>(null);
  const [focused, setFocused] = React.useState<string | null>(null);

  React.useEffect(() => { setForm(evo ? fromEvo(evo) : null); }, [evo]);

  if (!evo || !form) return null;

  const set = (k: keyof Form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm(f => f ? { ...f, [k]: e.target.value } : f);

  const setB = (k: keyof Form) => (v: boolean) =>
    setForm(f => f ? { ...f, [k]: v } : f);

  const fo = (n: string) => () => setFocused(n);
  const bl = () => setFocused(null);
  const is = (n: string) => iStyle(focused === n);
  const ss = (n: string): React.CSSProperties => ({ ...is(n), cursor: "pointer" });

  const statusChip = STATUS_CHIP[evo.status];
  const g2 = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 } as const;
  const g3 = { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 } as const;

  const modalTitle = (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      Edit EVO
      <span style={{ fontFamily: "monospace", fontSize: 11, fontWeight: 700, color: EVCORE_COLORS.green, backgroundColor: "#EBF8F3", border: `0.5px solid ${EVCORE_COLORS.greenLight}`, borderRadius: 5, padding: "2px 8px" }}>
        {evo.evoCode}
      </span>
      <StatusChip type={statusChip.type}>{statusChip.label}</StatusChip>
    </span>
  );

  return (
    <Modal opened onClose={onClose} title={modalTitle} maxWidth={600} icon={<UserCog size={18} color={EVCORE_COLORS.green} />}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

        {/* Personal */}
        <Divider title="Personal" />
        <F label="Full Name *">
          <input style={is("fn")} value={form.fullName} onChange={set("fullName")} onFocus={fo("fn")} onBlur={bl} />
        </F>
        <div style={g2}>
          <F label="Phone *">
            <input style={is("ph")} value={form.phone} onChange={set("phone")} onFocus={fo("ph")} onBlur={bl} placeholder="+243 8XX XXX XXX" />
          </F>
          <F label="Date of Birth">
            <input type="date" style={is("dob")} value={form.dob} onChange={set("dob")} onFocus={fo("dob")} onBlur={bl} />
          </F>
        </div>
        <div style={g2}>
          <F label="Gender">
            <select style={ss("g")} value={form.gender} onChange={set("gender")} onFocus={fo("g")} onBlur={bl}>
              <option value="M">Male</option><option value="F">Female</option>
            </select>
          </F>
          <F label="Marital Status">
            <select style={ss("ms")} value={form.maritalStatus} onChange={set("maritalStatus")} onFocus={fo("ms")} onBlur={bl}>
              <option value="SINGLE">Single</option><option value="MARRIED">Married</option><option value="DIVORCED">Divorced</option>
            </select>
          </F>
        </div>
        <div style={g2}>
          <F label="Current Work">
            <select style={ss("cw")} value={form.currentWork} onChange={set("currentWork")} onFocus={fo("cw")} onBlur={bl}>
              <option value="MOTO_TAXI">Moto-Taxi</option>
              <option value="SMALL_COMMERCE">Small Commerce</option>
              <option value="EMPLOYEE">Employee</option>
              <option value="AGRICULTURE">Agriculture</option>
              <option value="UNEMPLOYED">Unemployed</option>
              <option value="OTHER">Other</option>
            </select>
          </F>
          <F label="Housing Status">
            <select style={ss("hs")} value={form.housingStatus} onChange={set("housingStatus")} onFocus={fo("hs")} onBlur={bl}>
              <option value="OWNER">Owner</option><option value="TENANT">Tenant</option>
            </select>
          </F>
        </div>

        {/* Address */}
        <Divider title="Address" />
        <div style={g3}>
          <F label="City"><input style={is("ci")} value={form.city}     onChange={set("city")}     onFocus={fo("ci")} onBlur={bl} /></F>
          <F label="Commune"><input style={is("co")} value={form.commune}  onChange={set("commune")}  onFocus={fo("co")} onBlur={bl} /></F>
          <F label="Quartier"><input style={is("qu")} value={form.quartier} onChange={set("quartier")} onFocus={fo("qu")} onBlur={bl} /></F>
        </div>
        <div style={g2}>
          <F label="Avenue"><input style={is("av")} value={form.avenue}     onChange={set("avenue")}     onFocus={fo("av")} onBlur={bl} /></F>
          <F label="Plot Number"><input style={is("pl")} value={form.plotNumber} onChange={set("plotNumber")} onFocus={fo("pl")} onBlur={bl} /></F>
        </div>

        {/* Assignment */}
        <Divider title="Assignment" />
        <div style={g2}>
          <F label="EMC Zone">
            <select style={ss("ez")} value={form.emcZone} onChange={set("emcZone")} onFocus={fo("ez")} onBlur={bl}>
              {EMC_ZONES.map(z => <option key={z}>{z}</option>)}
            </select>
          </F>
          <F label="EV Product">
            <select style={ss("ep")} value={form.evProductCode} onChange={set("evProductCode")} onFocus={fo("ep")} onBlur={bl}>
              {PRODUCTS.map(p => <option key={p}>{p}</option>)}
            </select>
          </F>
        </div>

        {/* Lifestyle booleans — checkboxes in one row */}
        <div style={{ display: "flex", gap: 28, padding: "10px 14px", backgroundColor: EVCORE_COLORS.pageBg, borderRadius: 8, border: `0.5px solid ${EVCORE_COLORS.border}` }}>
          <Check label="Has Smartphone"  checked={form.hasSmartphone} onChange={setB("hasSmartphone")} />
          <Check label="Works Saturday"  checked={form.worksSaturday} onChange={setB("worksSaturday")} />
          <Check label="Works Sunday"    checked={form.worksSunday}   onChange={setB("worksSunday")}   />
        </div>

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, paddingTop: 6 }}>
          <button onClick={onClose} style={{ height: 36, padding: "0 18px", border: `0.5px solid ${EVCORE_COLORS.border}`, borderRadius: 8, backgroundColor: "transparent", fontSize: 13, color: EVCORE_COLORS.textSecondary, cursor: "pointer" }}>
            Cancel
          </button>
          <button onClick={onClose} style={{ height: 36, padding: "0 20px", border: "none", borderRadius: 8, backgroundColor: EVCORE_COLORS.green, fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer" }}>
            Save Changes
          </button>
        </div>
      </div>
    </Modal>
  );
}
