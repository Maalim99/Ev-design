"use client";

import * as React from "react";
import { User, Shield, Bell, Building2, ChevronRight, Check } from "lucide-react";
import { AppShell } from "@/components/evcore/layout/AppShell";
import { PageHeader } from "@/components/lamt/page-header";
import { EVCORE_COLORS } from "@/lib/evcore/constants";

// ─── Reusable primitives ─────────────────────────────────────────────────────

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ backgroundColor: EVCORE_COLORS.white, border: `0.5px solid ${EVCORE_COLORS.border}`, borderRadius: 12, overflow: "hidden" }}>
      <div style={{ padding: "14px 20px", borderBottom: `0.5px solid ${EVCORE_COLORS.border}` }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: EVCORE_COLORS.textPrimary, textTransform: "uppercase", letterSpacing: "0.06em" }}>{title}</span>
      </div>
      <div style={{ padding: "4px 0" }}>{children}</div>
    </div>
  );
}

function SettingRow({ label, description, value, action }: { label: string; description?: string; value?: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 20px", borderBottom: `0.5px solid ${EVCORE_COLORS.border}` }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: EVCORE_COLORS.textPrimary }}>{label}</div>
        {description && <div style={{ fontSize: 11, color: EVCORE_COLORS.textSecondary, marginTop: 2 }}>{description}</div>}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0, marginLeft: 16 }}>
        {value && <span style={{ fontSize: 12, color: EVCORE_COLORS.textSecondary }}>{value}</span>}
        {action ?? <ChevronRight size={14} color={EVCORE_COLORS.textSecondary} />}
      </div>
    </div>
  );
}

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      style={{
        width: 36, height: 20, borderRadius: 99, border: "none", cursor: "pointer", padding: 2,
        backgroundColor: enabled ? EVCORE_COLORS.green : EVCORE_COLORS.border,
        display: "flex", alignItems: "center", transition: "background-color 0.2s",
      }}
    >
      <span style={{
        width: 16, height: 16, borderRadius: "50%", backgroundColor: "#fff",
        display: "block", transition: "transform 0.2s",
        transform: enabled ? "translateX(16px)" : "translateX(0)",
      }} />
    </button>
  );
}

function RoleBadge({ role }: { role: string }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, height: 22, padding: "0 9px", borderRadius: 99, backgroundColor: "#EBF8F3", color: "#0F6E56", fontSize: 11, fontWeight: 700 }}>
      <Shield size={10} strokeWidth={2.5} />
      {role}
    </span>
  );
}

// ─── Settings Page ────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const [emailNotifs, setEmailNotifs] = React.useState(true);
  const [bgcAlerts,   setBgcAlerts]   = React.useState(true);
  const [assetAlerts, setAssetAlerts] = React.useState(false);
  const [activityFeed, setActivityFeed] = React.useState(true);

  return (
    <AppShell pageTitle="Settings">
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div>
          <PageHeader title="Settings" actions={[]} />
          <div style={{ fontSize: 12, color: EVCORE_COLORS.textSecondary, marginTop: 4 }}>Manage your account, notifications and platform preferences</div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {/* Left column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Profile */}
            <SectionCard title="Profile">
              {/* Avatar + name block */}
              <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 20px 14px", borderBottom: `0.5px solid ${EVCORE_COLORS.border}` }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: "#EBF8F3", border: `0.5px solid ${EVCORE_COLORS.greenLight}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <User size={22} color={EVCORE_COLORS.green} strokeWidth={1.75} />
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: EVCORE_COLORS.textPrimary }}>Mohamed Maalim</div>
                  <div style={{ fontSize: 11, color: EVCORE_COLORS.textSecondary, marginTop: 2 }}>ashrafzani585@gmail.com</div>
                  <div style={{ marginTop: 5 }}>
                    <RoleBadge role="EVO_ADMIN" />
                  </div>
                </div>
              </div>
              <SettingRow label="Full Name"     value="Mohamed Maalim" />
              <SettingRow label="Email Address" value="ashrafzani585@gmail.com" />
              <SettingRow label="Phone Number"  value="+243 — not set" />
              <div style={{ padding: "12px 20px" }}>
                <button style={{ height: 32, padding: "0 16px", borderRadius: 7, border: `0.5px solid ${EVCORE_COLORS.border}`, backgroundColor: "transparent", fontSize: 12, fontWeight: 600, color: EVCORE_COLORS.textPrimary, cursor: "pointer" }}>
                  Edit Profile
                </button>
              </div>
            </SectionCard>

            {/* Security */}
            <SectionCard title="Security">
              <SettingRow label="Password"          description="Last changed — never"      />
              <SettingRow label="Two-Factor Auth"   description="Add an extra layer of security" action={
                <span style={{ fontSize: 11, fontWeight: 600, color: EVCORE_COLORS.amber }}>Not enabled</span>
              } />
              <SettingRow label="Active Sessions"   description="1 active session"         />
            </SectionCard>

          </div>

          {/* Right column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Notifications */}
            <SectionCard title="Notifications">
              <SettingRow
                label="Email Notifications"
                description="Receive summaries and alerts by email"
                action={<Toggle enabled={emailNotifs} onChange={setEmailNotifs} />}
              />
              <SettingRow
                label="BGC Task Alerts"
                description="Notify when a BGC task needs review"
                action={<Toggle enabled={bgcAlerts} onChange={setBgcAlerts} />}
              />
              <SettingRow
                label="Asset Status Alerts"
                description="Notify on fleet asset status changes"
                action={<Toggle enabled={assetAlerts} onChange={setAssetAlerts} />}
              />
              <SettingRow
                label="Activity Feed"
                description="Show live EVO account activity"
                action={<Toggle enabled={activityFeed} onChange={setActivityFeed} />}
              />
            </SectionCard>

            {/* Organization */}
            <SectionCard title="Organization">
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 20px", borderBottom: `0.5px solid ${EVCORE_COLORS.border}` }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: "#EBF8F3", border: `0.5px solid ${EVCORE_COLORS.greenLight}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Building2 size={18} color={EVCORE_COLORS.green} strokeWidth={1.75} />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: EVCORE_COLORS.textPrimary }}>ALTECH GROUP</div>
                  <div style={{ fontSize: 11, color: EVCORE_COLORS.textSecondary }}>Kinshasa, DRC · EV Core — Jungle Hub</div>
                </div>
              </div>
              <SettingRow label="Region"        value="DRC Congo"     action={null} />
              <SettingRow label="Currency"      value="USD ($)"       action={null} />
              <SettingRow label="Phone Format"  value="+243 (DRC)"    action={null} />
              <SettingRow label="Platform"      value="EV Core v1.0"  action={null} />
            </SectionCard>

            {/* Permissions */}
            <SectionCard title="Role & Permissions">
              {[
                { label: "Manage EVO Accounts",    granted: true  },
                { label: "Approve BGC Tasks",       granted: true  },
                { label: "Assign Fleet Assets",     granted: true  },
                { label: "Manage EMC Centres",      granted: true  },
                { label: "View Financial Reports",  granted: true  },
                { label: "Manage Admin Users",      granted: false },
                { label: "Platform Configuration",  granted: false },
              ].map(p => (
                <div key={p.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 20px", borderBottom: `0.5px solid ${EVCORE_COLORS.border}` }}>
                  <span style={{ fontSize: 12, color: p.granted ? EVCORE_COLORS.textPrimary : EVCORE_COLORS.textSecondary }}>{p.label}</span>
                  {p.granted
                    ? <Check size={13} color={EVCORE_COLORS.green} strokeWidth={2.5} />
                    : <span style={{ fontSize: 10, fontWeight: 600, color: EVCORE_COLORS.textSecondary, textTransform: "uppercase", letterSpacing: "0.04em" }}>No access</span>
                  }
                </div>
              ))}
            </SectionCard>

          </div>
        </div>

        {/* Danger zone */}
        <div style={{ backgroundColor: EVCORE_COLORS.white, border: `0.5px solid #FCA5A5`, borderRadius: 12, overflow: "hidden" }}>
          <div style={{ padding: "14px 20px", borderBottom: `0.5px solid #FCA5A5` }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#DC2626", textTransform: "uppercase", letterSpacing: "0.06em" }}>Danger Zone</span>
          </div>
          <div style={{ padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: EVCORE_COLORS.textPrimary }}>Sign Out of All Devices</div>
              <div style={{ fontSize: 11, color: EVCORE_COLORS.textSecondary, marginTop: 2 }}>Revoke all active sessions immediately</div>
            </div>
            <button style={{ height: 32, padding: "0 14px", borderRadius: 7, border: `0.5px solid #FCA5A5`, backgroundColor: "#FEF2F2", fontSize: 11, fontWeight: 600, color: "#DC2626", cursor: "pointer" }}>
              Sign Out All
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
