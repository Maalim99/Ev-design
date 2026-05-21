"use client";

import { AppShell } from "@/components/evcore/layout/AppShell";
import { PageHeader } from "@/components/lamt/page-header";
import { Table, TableCellType, PaginationStrategy } from "@/components/lamt/table";
import { Button, ButtonKind, ButtonSize } from "@/components/lamt/button";
import { EVCORE_COLORS } from "@/lib/evcore/constants";

// ─── Row styles (same as EMC detail page) ─────────────────────────────────────

const LABEL_STYLE: React.CSSProperties = {
  minWidth: 140,
  fontSize: 11,
  color: EVCORE_COLORS.textSecondary,
  fontWeight: 500,
  flexShrink: 0,
};

const VALUE_STYLE: React.CSSProperties = {
  fontSize: 12.5,
  fontWeight: 500,
  color: EVCORE_COLORS.textPrimary,
  flex: 1,
};

const FIELD_ROW: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  borderBottom: "0.5px solid #F0EFE9",
  paddingTop: 9,
  paddingBottom: 9,
};

const CARD: React.CSSProperties = {
  backgroundColor: EVCORE_COLORS.white,
  border: `0.5px solid ${EVCORE_COLORS.border}`,
  borderRadius: 12,
  padding: 18,
};

const CARD_TITLE: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  color: EVCORE_COLORS.textPrimary,
  marginBottom: 12,
};

const TABLE_WRAP: React.CSSProperties = {
  backgroundColor: EVCORE_COLORS.white,
  border: `0.5px solid ${EVCORE_COLORS.border}`,
  borderRadius: 12,
  overflow: "hidden",
};

// ─── Static data (EV Core specs) ──────────────────────────────────────────────

// BRD §9.1
const EVO_ROLES = [
  { id: "1", name: "AAROVE",      description: "Field agent — registers EVOs, conducts BGC phases" },
  { id: "2", name: "EVO_TRAINER", description: "Conducts OSP (on-site practical) training sessions" },
  { id: "3", name: "EMC_MANAGER", description: "Manages EMC centres, evaluates BGC, certifies OSP" },
  { id: "4", name: "ZCM",         description: "Zone commercial manager — oversees field performance" },
  { id: "5", name: "EVO_ADMIN",   description: "Full platform access — manages users, plans and config" },
];

// Tech Spec §5
const PERMISSIONS = [
  { id: "1",  permission: "Register EVO Account",        roles: "AAROVE" },
  { id: "2",  permission: "Submit BGC Phase",            roles: "AAROVE" },
  { id: "3",  permission: "Evaluate BGC Application",    roles: "EMC_MANAGER, EVO_ADMIN" },
  { id: "4",  permission: "Conduct OSP Training",        roles: "EVO_TRAINER" },
  { id: "5",  permission: "Certify OSP Completion",      roles: "EMC_MANAGER, EVO_ADMIN" },
  { id: "6",  permission: "Assign Fleet Assets (VCU)",   roles: "EMC_MANAGER, EVO_ADMIN" },
  { id: "7",  permission: "Manage EMC Centres",          roles: "EMC_MANAGER, EVO_ADMIN" },
  { id: "8",  permission: "View Payment Records",        roles: "EVO_ADMIN (System creates payments)" },
  { id: "9",  permission: "Manage Rental Plans",         roles: "EVO_ADMIN" },
  { id: "10", permission: "Manage Platform Users",       roles: "EVO_ADMIN" },
  { id: "11", permission: "Platform Configuration",      roles: "EVO_ADMIN" },
];

// ─── Settings Page ─────────────────────────────────────────────────────────────

import * as React from "react";

export default function SettingsPage() {
  return (
    <AppShell pageTitle="Settings">

      {/* ── Profile + Security ─────────────────────────────────────────────── */}
      <div style={{ marginBottom: 7.5, marginTop: 20 }}>
        <PageHeader title="Settings" actions={[]} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 32 }}>

        {/* Profile card */}
        <div style={CARD}>
          <div style={CARD_TITLE}>Profile</div>

          <div style={FIELD_ROW}>
            <span style={LABEL_STYLE}>First Name</span>
            <span style={VALUE_STYLE}>Mohamed</span>
            <Button kind={ButtonKind.Normal} size={ButtonSize.ExtraSmall} onClick={() => {}}>Change</Button>
          </div>
          <div style={FIELD_ROW}>
            <span style={LABEL_STYLE}>Middle Name</span>
            <span style={VALUE_STYLE}>—</span>
          </div>
          <div style={FIELD_ROW}>
            <span style={LABEL_STYLE}>Last Name</span>
            <span style={VALUE_STYLE}>Maalim</span>
            <Button kind={ButtonKind.Normal} size={ButtonSize.ExtraSmall} onClick={() => {}}>Change</Button>
          </div>
          <div style={FIELD_ROW}>
            <span style={LABEL_STYLE}>Email</span>
            <span style={VALUE_STYLE}>ashrafzani585@gmail.com</span>
            <Button kind={ButtonKind.Normal} size={ButtonSize.ExtraSmall} onClick={() => {}}>Change</Button>
          </div>
          <div style={FIELD_ROW}>
            <span style={LABEL_STYLE}>Phone Number</span>
            <span style={VALUE_STYLE}>Not set</span>
            <Button kind={ButtonKind.Normal} size={ButtonSize.ExtraSmall} onClick={() => {}}>Change</Button>
          </div>
          <div style={{ ...FIELD_ROW, borderBottom: "none" }}>
            <span style={LABEL_STYLE}>Role</span>
            <span style={{
              ...VALUE_STYLE,
              fontFamily: "monospace", fontSize: 11, fontWeight: 700,
              color: EVCORE_COLORS.green,
            }}>
              EVO_ADMIN
            </span>
          </div>
        </div>

        {/* Security card */}
        <div style={CARD}>
          <div style={CARD_TITLE}>Security</div>

          <div style={FIELD_ROW}>
            <span style={LABEL_STYLE}>Password</span>
            <span style={VALUE_STYLE}>***************</span>
            <Button kind={ButtonKind.Normal} size={ButtonSize.ExtraSmall} onClick={() => {}}>Change</Button>
          </div>
          <div style={FIELD_ROW}>
            <span style={LABEL_STYLE}>Two-Factor Auth</span>
            <span style={{ ...VALUE_STYLE, color: EVCORE_COLORS.amber, fontWeight: 600 }}>Not enabled</span>
          </div>
          <div style={{ ...FIELD_ROW, borderBottom: "none" }}>
            <span style={LABEL_STYLE}>Active Sessions</span>
            <span style={VALUE_STYLE}>1 session</span>
          </div>
        </div>

      </div>

      {/* ── User Roles ─────────────────────────────────────────────────────── */}
      <div style={{ marginBottom: 7.5 }}>
        <PageHeader
          title="User Roles"
          actions={[{ label: "Create Role", kind: ButtonKind.Primary, onClick: () => {} }]}
        />
      </div>

      <div style={{ ...TABLE_WRAP, marginBottom: 32 }}>
        <Table
          isLoading={false}
          data={EVO_ROLES.map(r => ({
            id: r.id,
            name: <span style={{ fontSize: 13, fontWeight: 600, color: EVCORE_COLORS.textPrimary }}>{r.name}</span>,
            description: <span style={{ fontSize: 13, color: EVCORE_COLORS.textSecondary }}>{r.description}</span>,
          }))}
          colDefs={[
            { headerName: "Role",        type: TableCellType.component, key: "name"        },
            { headerName: "Description", type: TableCellType.component, key: "description" },
          ]}
          hasActions
          rowActions={() => (
            <Button kind={ButtonKind.Normal} size={ButtonSize.ExtraSmall} onClick={() => {}}>Manage</Button>
          )}
          currentPageNumber={1}
          limit={10}
          totalData={EVO_ROLES.length}
          onPageChange={() => {}}
          onLimitChange={() => {}}
          onTogglePagination={() => {}}
          paginationStrategy={PaginationStrategy.LOCAL}
          showPagination={false}
        />
      </div>

      {/* ── User Permissions ───────────────────────────────────────────────── */}
      <div style={{ marginBottom: 7.5 }}>
        <PageHeader title="User Permissions" actions={[]} />
      </div>

      <div style={TABLE_WRAP}>
        <Table
          isLoading={false}
          data={PERMISSIONS.map(p => ({
            id: p.id,
            permission: <span style={{ fontSize: 13, fontWeight: 600, color: EVCORE_COLORS.textPrimary }}>{p.permission}</span>,
            roles: <span style={{ fontSize: 13, color: EVCORE_COLORS.textSecondary }}>{p.roles}</span>,
          }))}
          colDefs={[
            { headerName: "Permission",     type: TableCellType.component, key: "permission" },
            { headerName: "Assigned Roles", type: TableCellType.component, key: "roles"      },
          ]}
          hasActions={false}
          currentPageNumber={1}
          limit={20}
          totalData={PERMISSIONS.length}
          onPageChange={() => {}}
          onLimitChange={() => {}}
          onTogglePagination={() => {}}
          paginationStrategy={PaginationStrategy.LOCAL}
          showPagination={false}
        />
      </div>

    </AppShell>
  );
}
