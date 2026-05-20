"use client";

import * as React from "react";
import { EVCORE_COLORS } from "@/lib/evcore/constants";
import { EMC_ZONES } from "@/data/dummy";

interface EvoRegistrationWizardProps {
  onComplete?: () => void;
  onCancel?: () => void;
}

const STEPS = ["Personal", "Assignment", "Sponsor", "Review"];

// BRD §6.2 — exact product codes
const PRODUCTS: { code: string; label: string }[] = [
  { code: "ALTECH-EMMO-A1", label: "ALTECH-EMMO-A1 — 2W Electric Moto" },
  { code: "ALTECH-EPAT-A1", label: "ALTECH-EPAT-A1 — 2W Electric Patrol" },
  { code: "ALTECH-F3-2B",   label: "ALTECH-F3-2B — 2W F3 (2-Battery)" },
  { code: "ALTECH-E3-2B",   label: "ALTECH-E3-2B — 2W E3 (2-Battery)" },
  { code: "ALTECH-T1-2B",   label: "ALTECH-T1-2B — 3W Tricycle T1" },
  { code: "ALTECH-T2-2B",   label: "ALTECH-T2-2B — 3W Tricycle T2" },
  { code: "ALTECH-T3-2B",   label: "ALTECH-T3-2B — 3W Tricycle T3" },
  { code: "ALTECH-ECAT-A1", label: "ALTECH-ECAT-A1 — Cart" },
];

// Rental plan format: SF{joining_fee}.RF{daily_rental}.RP{period_months}
const RENTAL_PLANS: { code: string; label: string }[] = [
  { code: "SF5.RF6.RP36",  label: "SF5.RF6.RP36 — $5 joining · $6/day · 36 months" },
  { code: "SF5.RF7.RP36",  label: "SF5.RF7.RP36 — $5 joining · $7/day · 36 months" },
  { code: "SF6.RF8.RP36",  label: "SF6.RF8.RP36 — $6 joining · $8/day · 36 months" },
  { code: "SF8.RF10.RP24", label: "SF8.RF10.RP24 — $8 joining · $10/day · 24 months" },
];

// AAROVE agents per EMC zone
const EMC_AAROVES: Record<string, string[]> = {
  "Kinshasa Nord": ["Jean-Pierre Ndinga"],
  "Kinshasa Sud":  ["Jean-Pierre Ndinga"],
  "Katanga EMC":   ["Patience Wa Mwila"],
  "Nord-Kivu":     ["Ambroise Kabong"],
};

interface FormState {
  // Personal
  firstName: string;
  lastName: string;
  phone: string;
  dob: string;
  gender: string;
  idType: string;
  idNumber: string;
  commune: string;
  address: string;
  // Assignment
  emc: string;
  assignedAarove: string;
  product: string;
  rentalPlan: string;
  // Sponsor (BGC Phase 2)
  sponsorName: string;
  sponsorPhone: string;
  sponsorRelation: string;
}

const EMPTY: FormState = {
  firstName: "", lastName: "", phone: "", dob: "", gender: "", idType: "NI", idNumber: "",
  commune: "", address: "",
  emc: "", assignedAarove: "", product: "", rentalPlan: "",
  sponsorName: "", sponsorPhone: "", sponsorRelation: "",
};

export function EvoRegistrationWizard({ onComplete, onCancel }: EvoRegistrationWizardProps) {
  const [step,    setStep]    = React.useState(0);
  const [form,    setForm]    = React.useState<FormState>(EMPTY);
  const [focused, setFocused] = React.useState<string | null>(null);
  const isLast = step === STEPS.length - 1;

  const set = (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const setEmc = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setForm(f => ({ ...f, emc: e.target.value, assignedAarove: "" }));

  const aaroveOptions = form.emc ? (EMC_AAROVES[form.emc] ?? []) : [];

  // ── Styles ───────────────────────────────────────────────────────────────
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

  const focus = (name: string) => () => setFocused(name);
  const blur  = ()             => setFocused(null);

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

  const reviewRow = (label: string, value: string, mono?: boolean) => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: `0.5px solid ${EVCORE_COLORS.border}` }}>
      <span style={{ fontSize: 12, color: EVCORE_COLORS.textSecondary, textTransform: "uppercase", letterSpacing: "0.04em", fontWeight: 600 }}>{label}</span>
      <span style={{ fontSize: 13, color: EVCORE_COLORS.textPrimary, fontWeight: 500, fontFamily: mono ? "monospace" : "inherit", textAlign: "right", maxWidth: "60%" }}>{value || "—"}</span>
    </div>
  );

  const sectionDivider = (label: string) => (
    <div style={{ fontSize: 11, fontWeight: 700, color: EVCORE_COLORS.textSecondary, letterSpacing: "0.06em", textTransform: "uppercase", padding: "10px 0 6px", borderBottom: `0.5px solid ${EVCORE_COLORS.border}` }}>
      {label}
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>

      {/* ── Step indicator ─────────────────────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: 28 }}>
        {STEPS.map((label, i) => (
          <React.Fragment key={label}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
              <div style={{
                width: 30, height: 30, borderRadius: "50%",
                backgroundColor: i <= step ? EVCORE_COLORS.green : EVCORE_COLORS.border,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 700,
                color: i <= step ? "#fff" : EVCORE_COLORS.textSecondary,
              }}>
                {i < step
                  ? <svg width="13" height="13" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  : i + 1}
              </div>
              <span style={{ fontSize: 11, fontWeight: 600, color: i === step ? EVCORE_COLORS.green : EVCORE_COLORS.textSecondary, whiteSpace: "nowrap" }}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div style={{ flex: 1, height: 1, backgroundColor: i < step ? EVCORE_COLORS.green : EVCORE_COLORS.border, marginBottom: 16 }} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* ── Step content ───────────────────────────────────────────────────── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

        {/* Step 1 — Personal ──────────────────────────────────────────────── */}
        {step === 0 && <>
          {row2(
            field("First name", <input style={iStyle("firstName")} value={form.firstName} onChange={set("firstName")} onFocus={focus("firstName")} onBlur={blur} placeholder="e.g. Lukusa" />),
            field("Last name",  <input style={iStyle("lastName")}  value={form.lastName}  onChange={set("lastName")}  onFocus={focus("lastName")}  onBlur={blur} placeholder="e.g. Bienvenu" />)
          )}
          {row2(
            field("Date of birth", <input style={iStyle("dob")} type="date" value={form.dob} onChange={set("dob")} onFocus={focus("dob")} onBlur={blur} />),
            field("Gender", <select style={sStyle("gender")} value={form.gender} onChange={set("gender")} onFocus={focus("gender")} onBlur={blur}>
              <option value="">Select…</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
            </select>)
          )}
          {field("Phone number (+243 DRC)", <input style={iStyle("phone")} value={form.phone} onChange={set("phone")} onFocus={focus("phone")} onBlur={blur} placeholder="+243 8XX XXX XXX" />)}
          {row2(
            field("ID type", <select style={sStyle("idType")} value={form.idType} onChange={set("idType")} onFocus={focus("idType")} onBlur={blur}>
              <option value="NI">National ID (NI)</option>
              <option value="PP">Passport</option>
              <option value="DL">Driver License</option>
            </select>),
            field("ID / Document number", <input style={iStyle("idNumber")} value={form.idNumber} onChange={set("idNumber")} onFocus={focus("idNumber")} onBlur={blur} placeholder="Document number" />)
          )}
          {row2(
            field("Commune / District", <input style={iStyle("commune")} value={form.commune} onChange={set("commune")} onFocus={focus("commune")} onBlur={blur} placeholder="e.g. Lingwala" />),
            field("Home address", <input style={iStyle("address")} value={form.address} onChange={set("address")} onFocus={focus("address")} onBlur={blur} placeholder="Street / Avenue" />)
          )}
          <div style={{ fontSize: 11, color: EVCORE_COLORS.textSecondary, backgroundColor: EVCORE_COLORS.pageBg, border: `0.5px solid ${EVCORE_COLORS.border}`, borderRadius: 7, padding: "9px 12px", lineHeight: 1.6 }}>
            Address is required for BGC Phase 1 — the assigned AAROVE will verify the operator's residence in person.
          </div>
        </>}

        {/* Step 2 — Assignment ─────────────────────────────────────────────── */}
        {step === 1 && <>
          {row2(
            field("EMC zone", <select style={sStyle("emc")} value={form.emc} onChange={setEmc} onFocus={focus("emc")} onBlur={blur}>
              <option value="">Select EMC zone…</option>
              {EMC_ZONES.map(z => <option key={z}>{z}</option>)}
            </select>),
            field("Assigned AAROVE", <select style={sStyle("assignedAarove")} value={form.assignedAarove} onChange={set("assignedAarove")} onFocus={focus("assignedAarove")} onBlur={blur} disabled={!form.emc}>
              <option value="">{form.emc ? "Select AAROVE…" : "Select EMC first"}</option>
              {aaroveOptions.map(a => <option key={a}>{a}</option>)}
            </select>)
          )}
          {field("EV product", <select style={sStyle("product")} value={form.product} onChange={set("product")} onFocus={focus("product")} onBlur={blur}>
            <option value="">Select product…</option>
            {PRODUCTS.map(p => <option key={p.code} value={p.code}>{p.label}</option>)}
          </select>)}
          {field("Rental plan", <select style={sStyle("rentalPlan")} value={form.rentalPlan} onChange={set("rentalPlan")} onFocus={focus("rentalPlan")} onBlur={blur}>
            <option value="">Select rental plan…</option>
            {RENTAL_PLANS.map(p => <option key={p.code} value={p.code}>{p.label}</option>)}
          </select>)}

          {form.rentalPlan && (() => {
            const parts = form.rentalPlan.match(/SF(\d+)\.RF(\d+)\.RP(\d+)/);
            if (!parts) return null;
            return (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                {[
                  { label: "Joining Fee",  value: `$${parts[1]}.00`, sub: "one-time" },
                  { label: "Daily Rental", value: `$${parts[2]}.00`, sub: "per day" },
                  { label: "Duration",     value: `${parts[3]} months`, sub: "rental period" },
                ].map(s => (
                  <div key={s.label} style={{ backgroundColor: EVCORE_COLORS.pageBg, border: `0.5px solid ${EVCORE_COLORS.border}`, borderRadius: 8, padding: "10px 12px" }}>
                    <div style={{ fontSize: 11, color: EVCORE_COLORS.textSecondary, marginBottom: 3 }}>{s.label}</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: EVCORE_COLORS.textPrimary }}>{s.value}</div>
                    <div style={{ fontSize: 10, color: EVCORE_COLORS.textSecondary, marginTop: 1 }}>{s.sub}</div>
                  </div>
                ))}
              </div>
            );
          })()}
        </>}

        {/* Step 3 — Sponsor ────────────────────────────────────────────────── */}
        {step === 2 && <>
          {field("Sponsor full name", <input style={iStyle("sponsorName")} value={form.sponsorName} onChange={set("sponsorName")} onFocus={focus("sponsorName")} onBlur={blur} placeholder="e.g. Kabila Mwamba" />)}
          {row2(
            field("Sponsor phone (+243 DRC)", <input style={iStyle("sponsorPhone")} value={form.sponsorPhone} onChange={set("sponsorPhone")} onFocus={focus("sponsorPhone")} onBlur={blur} placeholder="+243 8XX XXX XXX" />),
            field("Relationship to EVO", <select style={sStyle("sponsorRelation")} value={form.sponsorRelation} onChange={set("sponsorRelation")} onFocus={focus("sponsorRelation")} onBlur={blur}>
              <option value="">Select…</option>
              <option>Parent</option>
              <option>Sibling</option>
              <option>Spouse</option>
              <option>Friend</option>
              <option>Employer</option>
              <option>Other</option>
            </select>)
          )}
          <div style={{ borderRadius: 8, padding: "11px 13px", backgroundColor: "#EBF8F3", border: `0.5px solid ${EVCORE_COLORS.greenLight}`, fontSize: 12, color: "#0F6E56", lineHeight: 1.6 }}>
            The sponsor will be contacted during <strong>BGC Phase 2</strong>. Their residence and identity will be verified in person, and they must confirm they recommend this EVO.
          </div>
        </>}

        {/* Step 4 — Review ─────────────────────────────────────────────────── */}
        {step === 3 && <>
          <div style={{ borderRadius: 10, border: `0.5px solid ${EVCORE_COLORS.border}`, padding: "6px 14px 0" }}>
            {sectionDivider("Personal")}
            {reviewRow("Full name",   `${form.firstName} ${form.lastName}`)}
            {reviewRow("Date of birth", form.dob)}
            {reviewRow("Gender",      form.gender === "M" ? "Male" : form.gender === "F" ? "Female" : "")}
            {reviewRow("Phone",       form.phone, true)}
            {reviewRow("ID",          `${form.idType} – ${form.idNumber}`, true)}
            {reviewRow("Commune",     form.commune)}
            {reviewRow("Address",     form.address)}
            {sectionDivider("Assignment")}
            {reviewRow("EMC zone",        form.emc)}
            {reviewRow("Assigned AAROVE", form.assignedAarove)}
            {reviewRow("EV product",      form.product, true)}
            {reviewRow("Plan code",       form.rentalPlan, true)}
            {(() => {
              const m = form.rentalPlan.match(/SF(\d+)\.RF(\d+)\.RP(\d+)/);
              if (!m) return null;
              return <>
                {reviewRow("Joining fee",   `$${m[1]}.00 — one-time`)}
                {reviewRow("Daily rental",  `$${m[2]}.00 — per day`)}
                {reviewRow("Duration",      `${m[3]} months`)}
              </>;
            })()}
            {sectionDivider("Sponsor")}
            {reviewRow("Name",         form.sponsorName)}
            {reviewRow("Phone",        form.sponsorPhone, true)}
            {reviewRow("Relationship", form.sponsorRelation)}
          </div>
          <div style={{ borderRadius: 8, padding: "11px 13px", backgroundColor: "#FEF9EE", border: `0.5px solid #EF9F27`, fontSize: 12, color: "#854F0B", lineHeight: 1.6, marginTop: 4 }}>
            Submitting will create the EVO account in <strong>Awaiting BGC</strong> status. The assigned AAROVE will be notified to begin Phase 1 residence verification.
          </div>
        </>}
      </div>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 28, paddingTop: 20, borderTop: `0.5px solid ${EVCORE_COLORS.border}` }}>
        <button
          onClick={step === 0 ? onCancel : () => setStep(s => s - 1)}
          style={{ height: 40, padding: "0 20px", borderRadius: 8, border: `0.5px solid ${EVCORE_COLORS.border}`, backgroundColor: "transparent", fontSize: 14, fontWeight: 500, color: EVCORE_COLORS.textSecondary, cursor: "pointer" }}
        >
          {step === 0 ? "Cancel" : "← Back"}
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 12, color: EVCORE_COLORS.textSecondary }}>Step {step + 1} of {STEPS.length}</span>
          <button
            onClick={isLast ? onComplete : () => setStep(s => s + 1)}
            style={{ height: 40, padding: "0 24px", borderRadius: 8, border: "none", backgroundColor: EVCORE_COLORS.green, fontSize: 14, fontWeight: 700, color: "#fff", cursor: "pointer" }}
          >
            {isLast ? "Submit registration" : "Continue →"}
          </button>
        </div>
      </div>
    </div>
  );
}
