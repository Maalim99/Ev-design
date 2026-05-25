"use client";

import * as React from "react";
import { EVCORE_COLORS } from "@/lib/evcore/constants";
import { EMC_ZONES } from "@/data/dummy";

interface EvoRegistrationWizardProps {
  onComplete?: () => void;
  onCancel?: () => void;
}

const STEPS = ["Personal", "Lifestyle", "Assignment", "Sponsor", "Review"];

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

const RENTAL_PLANS: { code: string; label: string }[] = [
  { code: "SF5.RF6.RP36",  label: "SF5.RF6.RP36 — $5 joining · $6/day · 36 months" },
  { code: "SF5.RF7.RP36",  label: "SF5.RF7.RP36 — $5 joining · $7/day · 36 months" },
  { code: "SF6.RF8.RP36",  label: "SF6.RF8.RP36 — $6 joining · $8/day · 36 months" },
  { code: "SF8.RF10.RP24", label: "SF8.RF10.RP24 — $8 joining · $10/day · 24 months" },
];

const EMC_AAROVES: Record<string, string[]> = {
  "Kinshasa Nord": ["Jean-Pierre Ndinga"],
  "Kinshasa Sud":  ["Jean-Pierre Ndinga"],
  "Katanga EMC":   ["Patience Wa Mwila"],
  "Nord-Kivu":     ["Ambroise Kabong"],
};

interface FormState {
  // Step 1 – Personal
  firstName: string;
  lastName: string;
  phone: string;
  dob: string;
  gender: string;
  idType: string;
  idNumber: string;
  // Step 2 – Lifestyle / Address
  city: string;
  commune: string;
  quartier: string;
  avenue: string;
  plotNumber: string;
  housingStatus: string;
  maritalStatus: string;
  currentWork: string;
  hasSmartphone: string;
  worksSaturday: string;
  worksSunday: string;
  // Step 3 – Assignment
  emc: string;
  assignedAarove: string;
  product: string;
  rentalPlan: string;
  // Step 4 – Sponsor
  sponsorName: string;
  sponsorPhone: string;
  sponsorDOB: string;
  sponsorGender: string;
  sponsorMaritalStatus: string;
  sponsorRelation: string;
  sponsorCurrentWork: string;
  sponsorHousingStatus: string;
  sponsorCity: string;
  sponsorCommune: string;
  sponsorQuartier: string;
  sponsorAvenue: string;
  sponsorPlotNumber: string;
}

const EMPTY: FormState = {
  firstName: "", lastName: "", phone: "", dob: "", gender: "", idType: "NI", idNumber: "",
  city: "", commune: "", quartier: "", avenue: "", plotNumber: "",
  housingStatus: "", maritalStatus: "", currentWork: "", hasSmartphone: "", worksSaturday: "", worksSunday: "",
  emc: "", assignedAarove: "", product: "", rentalPlan: "",
  sponsorName: "", sponsorPhone: "", sponsorDOB: "", sponsorGender: "", sponsorMaritalStatus: "",
  sponsorRelation: "", sponsorCurrentWork: "", sponsorHousingStatus: "",
  sponsorCity: "", sponsorCommune: "", sponsorQuartier: "", sponsorAvenue: "", sponsorPlotNumber: "",
};

export function EvoRegistrationWizard({ onComplete, onCancel }: EvoRegistrationWizardProps) {
  const [step,    setStep]    = React.useState(0);
  const [form,    setForm]    = React.useState<FormState>(EMPTY);
  const [focused, setFocused] = React.useState<string | null>(null);
  const isLast = step === STEPS.length - 1;

  const set = (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [key]: e.target.value }));

  const setToggle = (key: keyof FormState) => (val: string) =>
    setForm(f => ({ ...f, [key]: val }));

  const setEmc = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setForm(f => ({ ...f, emc: e.target.value, assignedAarove: "" }));

  const aaroveOptions = form.emc ? (EMC_AAROVES[form.emc] ?? []) : [];

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
  const blur  = () => setFocused(null);

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

  const row3 = (a: React.ReactNode, b: React.ReactNode, c: React.ReactNode) => (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>{a}{b}{c}</div>
  );

  const YNToggle = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
    <div style={{ display: "flex", gap: 8, height: 40 }}>
      {(["Y", "N"] as const).map(opt => (
        <button key={opt} type="button" onClick={() => onChange(opt)} style={{
          flex: 1, height: 40, borderRadius: 8,
          border: `1px solid ${value === opt ? EVCORE_COLORS.green : EVCORE_COLORS.border}`,
          backgroundColor: value === opt ? "#D6F5E8" : EVCORE_COLORS.white,
          color: value === opt ? "#0F6E56" : EVCORE_COLORS.textSecondary,
          fontWeight: value === opt ? 700 : 400,
          cursor: "pointer", fontSize: 13,
        }}>
          {opt === "Y" ? "Yes" : "No"}
        </button>
      ))}
    </div>
  );

  const reviewRow = (label: string, value: string, mono?: boolean) => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: `0.5px solid ${EVCORE_COLORS.border}` }}>
      <span style={{ fontSize: 12, color: EVCORE_COLORS.textSecondary, textTransform: "uppercase", letterSpacing: "0.04em", fontWeight: 600, flexShrink: 0, marginRight: 12 }}>{label}</span>
      <span style={{ fontSize: 13, color: EVCORE_COLORS.textPrimary, fontWeight: 500, fontFamily: mono ? "monospace" : "inherit", textAlign: "right", maxWidth: "60%" }}>{value || "—"}</span>
    </div>
  );

  const sectionDivider = (label: string) => (
    <div style={{ fontSize: 11, fontWeight: 700, color: EVCORE_COLORS.textSecondary, letterSpacing: "0.06em", textTransform: "uppercase", padding: "10px 0 6px", borderBottom: `0.5px solid ${EVCORE_COLORS.border}` }}>
      {label}
    </div>
  );

  const infoBox = (text: React.ReactNode, color?: string) => (
    <div style={{ fontSize: 11, color: color ?? EVCORE_COLORS.textSecondary, backgroundColor: EVCORE_COLORS.pageBg, border: `0.5px solid ${EVCORE_COLORS.border}`, borderRadius: 7, padding: "9px 12px", lineHeight: 1.6 }}>
      {text}
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>

      {/* Step indicator */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: 28 }}>
        {STEPS.map((label, i) => (
          <React.Fragment key={label}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
              <div style={{
                width: 28, height: 28, borderRadius: "50%",
                backgroundColor: i <= step ? EVCORE_COLORS.green : EVCORE_COLORS.border,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 700,
                color: i <= step ? "#fff" : EVCORE_COLORS.textSecondary,
              }}>
                {i < step
                  ? <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  : i + 1}
              </div>
              <span style={{ fontSize: 10, fontWeight: 600, color: i === step ? EVCORE_COLORS.green : EVCORE_COLORS.textSecondary, whiteSpace: "nowrap" }}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div style={{ flex: 1, height: 1, backgroundColor: i < step ? EVCORE_COLORS.green : EVCORE_COLORS.border, marginBottom: 16 }} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step content */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

        {/* Step 1 — Personal */}
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
            field("Document number", <input style={iStyle("idNumber")} value={form.idNumber} onChange={set("idNumber")} onFocus={focus("idNumber")} onBlur={blur} placeholder="Document number" />)
          )}
        </>}

        {/* Step 2 — Lifestyle / Address */}
        {step === 1 && <>
          {row2(
            field("City", <input style={iStyle("city")} value={form.city} onChange={set("city")} onFocus={focus("city")} onBlur={blur} placeholder="e.g. Kinshasa" />),
            field("Commune", <input style={iStyle("commune")} value={form.commune} onChange={set("commune")} onFocus={focus("commune")} onBlur={blur} placeholder="e.g. Lingwala" />)
          )}
          {row2(
            field("Quartier", <input style={iStyle("quartier")} value={form.quartier} onChange={set("quartier")} onFocus={focus("quartier")} onBlur={blur} placeholder="e.g. Lingwala" />),
            field("Avenue", <input style={iStyle("avenue")} value={form.avenue} onChange={set("avenue")} onFocus={focus("avenue")} onBlur={blur} placeholder="e.g. Av. Victoire" />)
          )}
          {row2(
            field("Plot Number", <input style={iStyle("plotNumber")} value={form.plotNumber} onChange={set("plotNumber")} onFocus={focus("plotNumber")} onBlur={blur} placeholder="e.g. 12" />),
            field("Housing Status", <select style={sStyle("housingStatus")} value={form.housingStatus} onChange={set("housingStatus")} onFocus={focus("housingStatus")} onBlur={blur}>
              <option value="">Select…</option>
              <option value="OWNER">Owner</option>
              <option value="TENANT">Tenant</option>
            </select>)
          )}
          {row2(
            field("Marital Status", <select style={sStyle("maritalStatus")} value={form.maritalStatus} onChange={set("maritalStatus")} onFocus={focus("maritalStatus")} onBlur={blur}>
              <option value="">Select…</option>
              <option value="SINGLE">Single</option>
              <option value="MARRIED">Married</option>
              <option value="DIVORCED">Divorced</option>
            </select>),
            field("Current Work", <select style={sStyle("currentWork")} value={form.currentWork} onChange={set("currentWork")} onFocus={focus("currentWork")} onBlur={blur}>
              <option value="">Select…</option>
              <option value="MOTO_TAXI">Moto-Taxi</option>
              <option value="SMALL_COMMERCE">Small Commerce</option>
              <option value="EMPLOYEE">Employee</option>
              <option value="AGRICULTURE">Agriculture</option>
              <option value="UNEMPLOYED">Unemployed</option>
              <option value="OTHER">Other</option>
            </select>)
          )}
          {row3(
            field("Has Smartphone?", <YNToggle value={form.hasSmartphone} onChange={setToggle("hasSmartphone")} />),
            field("Works Saturday?", <YNToggle value={form.worksSaturday} onChange={setToggle("worksSaturday")} />),
            field("Works Sunday?",   <YNToggle value={form.worksSunday}   onChange={setToggle("worksSunday")} />)
          )}
          {infoBox("Address is required for BGC Phase 1 — the AAROVE will verify the operator's residence in person.")}
        </>}

        {/* Step 3 — Assignment */}
        {step === 2 && <>
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

        {/* Step 4 — Sponsor */}
        {step === 3 && <>
          {field("Sponsor full name", <input style={iStyle("sponsorName")} value={form.sponsorName} onChange={set("sponsorName")} onFocus={focus("sponsorName")} onBlur={blur} placeholder="e.g. Kabila Mwamba" />)}
          {row2(
            field("Sponsor phone (+243 DRC)", <input style={iStyle("sponsorPhone")} value={form.sponsorPhone} onChange={set("sponsorPhone")} onFocus={focus("sponsorPhone")} onBlur={blur} placeholder="+243 8XX XXX XXX" />),
            field("Relationship to EVO", <select style={sStyle("sponsorRelation")} value={form.sponsorRelation} onChange={set("sponsorRelation")} onFocus={focus("sponsorRelation")} onBlur={blur}>
              <option value="">Select…</option>
              <option value="FATHER">Father</option>
              <option value="MOTHER">Mother</option>
              <option value="UNCLE">Uncle</option>
              <option value="BROTHER">Brother</option>
              <option value="SISTER">Sister</option>
              <option value="PASTOR">Pastor</option>
              <option value="EMPLOYER">Employer</option>
              <option value="OTHER">Other</option>
            </select>)
          )}
          {row2(
            field("Date of birth", <input style={iStyle("sponsorDOB")} type="date" value={form.sponsorDOB} onChange={set("sponsorDOB")} onFocus={focus("sponsorDOB")} onBlur={blur} />),
            field("Gender", <select style={sStyle("sponsorGender")} value={form.sponsorGender} onChange={set("sponsorGender")} onFocus={focus("sponsorGender")} onBlur={blur}>
              <option value="">Select…</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
            </select>)
          )}
          {row2(
            field("Marital Status", <select style={sStyle("sponsorMaritalStatus")} value={form.sponsorMaritalStatus} onChange={set("sponsorMaritalStatus")} onFocus={focus("sponsorMaritalStatus")} onBlur={blur}>
              <option value="">Select…</option>
              <option value="SINGLE">Single</option>
              <option value="MARRIED">Married</option>
              <option value="DIVORCED">Divorced</option>
            </select>),
            field("Current Work", <select style={sStyle("sponsorCurrentWork")} value={form.sponsorCurrentWork} onChange={set("sponsorCurrentWork")} onFocus={focus("sponsorCurrentWork")} onBlur={blur}>
              <option value="">Select…</option>
              <option value="EMPLOYEE">Employee</option>
              <option value="SMALL_COMMERCE">Small Commerce</option>
              <option value="AGRICULTURE">Agriculture</option>
              <option value="PASTOR">Pastor</option>
              <option value="RETIRED">Retired</option>
              <option value="OTHER">Other</option>
            </select>)
          )}
          {field("Housing Status", <select style={sStyle("sponsorHousingStatus")} value={form.sponsorHousingStatus} onChange={set("sponsorHousingStatus")} onFocus={focus("sponsorHousingStatus")} onBlur={blur}>
            <option value="">Select…</option>
            <option value="OWNER">Owner</option>
            <option value="TENANT">Tenant</option>
          </select>)}
          <div style={{ fontSize: 11, fontWeight: 700, color: EVCORE_COLORS.textSecondary, letterSpacing: "0.05em", textTransform: "uppercase", paddingTop: 4 }}>Sponsor Address</div>
          {row2(
            field("City", <input style={iStyle("sponsorCity")} value={form.sponsorCity} onChange={set("sponsorCity")} onFocus={focus("sponsorCity")} onBlur={blur} placeholder="e.g. Kinshasa" />),
            field("Commune", <input style={iStyle("sponsorCommune")} value={form.sponsorCommune} onChange={set("sponsorCommune")} onFocus={focus("sponsorCommune")} onBlur={blur} placeholder="e.g. Kalamu" />)
          )}
          {row2(
            field("Quartier", <input style={iStyle("sponsorQuartier")} value={form.sponsorQuartier} onChange={set("sponsorQuartier")} onFocus={focus("sponsorQuartier")} onBlur={blur} placeholder="e.g. Kalamu" />),
            field("Avenue", <input style={iStyle("sponsorAvenue")} value={form.sponsorAvenue} onChange={set("sponsorAvenue")} onFocus={focus("sponsorAvenue")} onBlur={blur} placeholder="e.g. Av. Sendwe" />)
          )}
          {field("Plot Number", <input style={iStyle("sponsorPlotNumber")} value={form.sponsorPlotNumber} onChange={set("sponsorPlotNumber")} onFocus={focus("sponsorPlotNumber")} onBlur={blur} placeholder="e.g. 14" />)}
          <div style={{ borderRadius: 8, padding: "11px 13px", backgroundColor: "#EBF8F3", border: `0.5px solid ${EVCORE_COLORS.greenLight}`, fontSize: 12, color: "#0F6E56", lineHeight: 1.6 }}>
            The sponsor will be contacted during <strong>BGC Phase 2</strong>. Their residence and identity will be verified in person, and they must confirm they recommend this EVO.
          </div>
        </>}

        {/* Step 5 — Review */}
        {step === 4 && <>
          <div style={{ borderRadius: 10, border: `0.5px solid ${EVCORE_COLORS.border}`, padding: "6px 14px 0" }}>
            {sectionDivider("Personal")}
            {reviewRow("Full name",     `${form.firstName} ${form.lastName}`)}
            {reviewRow("Date of birth", form.dob)}
            {reviewRow("Gender",        form.gender === "M" ? "Male" : form.gender === "F" ? "Female" : "")}
            {reviewRow("Phone",         form.phone, true)}
            {reviewRow("ID",            `${form.idType} – ${form.idNumber}`, true)}

            {sectionDivider("Address & Lifestyle")}
            {reviewRow("Address", [form.avenue, form.quartier, form.commune, form.city].filter(Boolean).join(", "))}
            {reviewRow("Plot #",        form.plotNumber)}
            {reviewRow("Housing",       form.housingStatus)}
            {reviewRow("Marital",       form.maritalStatus)}
            {reviewRow("Work",          form.currentWork.replace(/_/g, " "))}
            {reviewRow("Smartphone",    form.hasSmartphone === "Y" ? "Yes" : form.hasSmartphone === "N" ? "No" : "")}
            {reviewRow("Works Sat",     form.worksSaturday === "Y" ? "Yes" : form.worksSaturday === "N" ? "No" : "")}
            {reviewRow("Works Sun",     form.worksSunday === "Y" ? "Yes" : form.worksSunday === "N" ? "No" : "")}

            {sectionDivider("Assignment")}
            {reviewRow("EMC zone",        form.emc)}
            {reviewRow("Assigned AAROVE", form.assignedAarove)}
            {reviewRow("EV product",      form.product, true)}
            {reviewRow("Plan code",       form.rentalPlan, true)}
            {(() => {
              const m = form.rentalPlan.match(/SF(\d+)\.RF(\d+)\.RP(\d+)/);
              if (!m) return null;
              return <>
                {reviewRow("Joining fee",  `$${m[1]}.00 — one-time`)}
                {reviewRow("Daily rental", `$${m[2]}.00 — per day`)}
                {reviewRow("Duration",     `${m[3]} months`)}
              </>;
            })()}

            {sectionDivider("Sponsor")}
            {reviewRow("Name",          form.sponsorName)}
            {reviewRow("Phone",         form.sponsorPhone, true)}
            {reviewRow("Relationship",  form.sponsorRelation)}
            {reviewRow("Gender",        form.sponsorGender === "M" ? "Male" : form.sponsorGender === "F" ? "Female" : "")}
            {reviewRow("Marital",       form.sponsorMaritalStatus)}
            {reviewRow("Work",          form.sponsorCurrentWork.replace(/_/g, " "))}
            {reviewRow("Housing",       form.sponsorHousingStatus)}
            {reviewRow("Address",       [form.sponsorAvenue, form.sponsorQuartier, form.sponsorCommune, form.sponsorCity].filter(Boolean).join(", "))}
          </div>
          <div style={{ borderRadius: 8, padding: "11px 13px", backgroundColor: "#FEF9EE", border: `0.5px solid #EF9F27`, fontSize: 12, color: "#854F0B", lineHeight: 1.6, marginTop: 4 }}>
            Submitting will create the EVO account in <strong>Awaiting BGC</strong> status. The assigned AAROVE will be notified to begin Phase 1 residence verification.
          </div>
        </>}
      </div>

      {/* Footer */}
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
