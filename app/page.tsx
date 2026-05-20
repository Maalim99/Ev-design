"use client";

import * as React from "react";
import { Users, Truck, DollarSign, ClipboardCheck } from "lucide-react";

import { AppShell } from "@/components/evcore/layout/AppShell";
import { KpiCard } from "@/components/evcore/ui/KpiCard";
import { RegisterEvoModal } from "@/components/evcore/modals/RegisterEvoModal";
import {
  DASHBOARD_ACTIVITY,
  DASHBOARD_TASKS,
  WEEKLY_REGISTRATIONS,
} from "@/data/dummy";
import {
  EVCORE_COLORS,
  BADGE_STYLES,
  ACTIVITY_DOT_COLORS,
} from "@/lib/evcore/constants";

// ─── Tiny reusable primitives ──────────────────────────────────────────────

function Card({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        backgroundColor: EVCORE_COLORS.white,
        border: `0.5px solid ${EVCORE_COLORS.border}`,
        borderRadius: 12,
        padding: 16,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function CardTitle({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: 12,
        fontWeight: 700,
        color: EVCORE_COLORS.textPrimary,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        marginBottom: 14,
      }}
    >
      {children}
    </div>
  );
}

function Divider() {
  return (
    <div
      style={{
        height: 0,
        borderTop: `0.5px solid ${EVCORE_COLORS.border}`,
        margin: "0",
      }}
    />
  );
}

// ─── Bar chart ─────────────────────────────────────────────────────────────

function BarChart() {
  const max = Math.max(...WEEKLY_REGISTRATIONS.map((d) => d.value));
  const BAR_H = 96;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        gap: 10,
        height: BAR_H + 36,
        paddingTop: 20,
      }}
    >
      {WEEKLY_REGISTRATIONS.map((item, i) => {
        const highlighted = i === 5; // Saturday
        const barH = Math.round((item.value / max) * BAR_H);

        return (
          <div
            key={item.day}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
            }}
          >
            {/* Value label above bar */}
            <span
              style={{
                fontSize: 10,
                fontWeight: 600,
                color: highlighted
                  ? EVCORE_COLORS.green
                  : EVCORE_COLORS.textSecondary,
                height: 14,
                display: "block",
              }}
            >
              {item.value}
            </span>

            {/* Bar */}
            <div
              style={{
                width: "100%",
                height: barH,
                borderRadius: "4px 4px 0 0",
                backgroundColor: highlighted
                  ? EVCORE_COLORS.green
                  : EVCORE_COLORS.greenLight,
                transition: "height 0.3s ease",
              }}
            />

            {/* Day label */}
            <span
              style={{
                fontSize: 10,
                fontWeight: highlighted ? 700 : 500,
                color: highlighted
                  ? EVCORE_COLORS.green
                  : EVCORE_COLORS.textSecondary,
                marginTop: 4,
              }}
            >
              {item.day}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Progress row ───────────────────────────────────────────────────────────

function ProgressRow({
  label,
  pct,
  color,
  right,
  labelWidth = 96,
}: {
  label: string;
  pct: number;
  color: string;
  right: string;
  labelWidth?: number;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <span
        style={{
          fontSize: 12,
          color: EVCORE_COLORS.textSecondary,
          width: labelWidth,
          flexShrink: 0,
          fontWeight: 500,
        }}
      >
        {label}
      </span>

      <div
        style={{
          flex: 1,
          height: 5,
          borderRadius: 99,
          backgroundColor: "#F0EFE9",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            borderRadius: 99,
            backgroundColor: color,
          }}
        />
      </div>

      <span
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: EVCORE_COLORS.textPrimary,
          width: 44,
          textAlign: "right",
          flexShrink: 0,
        }}
      >
        {right}
      </span>
    </div>
  );
}

// ─── Dashboard page ────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [registerOpen, setRegisterOpen] = React.useState(false);

  const today = new Date();
  const dateStr = today.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <AppShell
        pageTitle="Dashboard"
        topbarAction={
          <button
            onClick={() => setRegisterOpen(true)}
            style={{
              height: 34,
              padding: "0 16px",
              borderRadius: 8,
              border: "none",
              backgroundColor: EVCORE_COLORS.green,
              color: "#fff",
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
              letterSpacing: "0.02em",
            }}
          >
            <span style={{ fontSize: 16, lineHeight: 1, marginTop: -1 }}>+</span>
            Register EVO
          </button>
        }
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* ── Section 1: Greeting ───────────────────────────────────── */}
          <div>
            <div
              style={{
                fontSize: 21,
                fontWeight: 700,
                color: EVCORE_COLORS.textPrimary,
                lineHeight: 1.25,
              }}
            >
              Good morning, Mohamed
            </div>
            <div
              style={{
                fontSize: 13,
                color: EVCORE_COLORS.textSecondary,
                marginTop: 4,
              }}
            >
              {dateStr} · Kinshasa, DRC
            </div>
          </div>

          {/* ── Section 2: KPI cards ──────────────────────────────────── */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 14,
            }}
          >
            <KpiCard
              label="Total EVOs"
              value="142"
              delta="+12 this month"
              deltaType="positive"
              icon={Users}
            />
            <KpiCard
              label="Active assets"
              value="89"
              delta="+5 this week"
              deltaType="positive"
              icon={Truck}
            />
            <KpiCard
              label="Revenue MTD"
              value="$28,400"
              delta="+18% vs last month"
              deltaType="positive"
              icon={DollarSign}
            />
            <KpiCard
              label="Pending BGC"
              value="8"
              delta="3 overdue"
              deltaType="negative"
              icon={ClipboardCheck}
            />
          </div>

          {/* ── Section 3: Activity + Tasks ───────────────────────────── */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
            }}
          >
            {/* Recent activity */}
            <Card>
              <CardTitle>Recent activity</CardTitle>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {DASHBOARD_ACTIVITY.map((row, i) => (
                  <React.Fragment key={row.id}>
                    {i > 0 && <Divider />}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "10px 0",
                      }}
                    >
                      {/* Colored dot */}
                      <div
                        style={{
                          width: 7,
                          height: 7,
                          borderRadius: "50%",
                          backgroundColor: ACTIVITY_DOT_COLORS[row.type],
                          flexShrink: 0,
                        }}
                      />

                      {/* Text */}
                      <span
                        style={{
                          flex: 1,
                          fontSize: 12,
                          color: EVCORE_COLORS.textPrimary,
                          lineHeight: 1.45,
                        }}
                      >
                        {row.text}
                      </span>

                      {/* Timestamp */}
                      <span
                        style={{
                          fontSize: 11,
                          color: EVCORE_COLORS.textSecondary,
                          flexShrink: 0,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {row.timestamp}
                      </span>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </Card>

            {/* Pending tasks */}
            <Card>
              <CardTitle>Pending tasks</CardTitle>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {DASHBOARD_TASKS.map((row, i) => {
                  const badge = BADGE_STYLES[row.badgeType];
                  return (
                    <React.Fragment key={row.id}>
                      {i > 0 && <Divider />}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          padding: "10px 0",
                        }}
                      >
                        {/* Badge pill */}
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            height: 20,
                            padding: "0 7px",
                            borderRadius: 99,
                            backgroundColor: badge.bg,
                            color: badge.text,
                            fontSize: 10,
                            fontWeight: 700,
                            flexShrink: 0,
                            letterSpacing: "0.04em",
                          }}
                        >
                          {row.badgeType}
                        </span>

                        {/* Task name */}
                        <span
                          style={{
                            flex: 1,
                            fontSize: 12,
                            color: EVCORE_COLORS.textPrimary,
                            lineHeight: 1.45,
                          }}
                        >
                          {row.task}
                        </span>

                        {/* Meta */}
                        <span
                          style={{
                            fontSize: 11,
                            color:
                              row.meta === "Overdue"
                                ? EVCORE_COLORS.danger
                                : EVCORE_COLORS.textSecondary,
                            flexShrink: 0,
                            whiteSpace: "nowrap",
                            fontWeight: row.meta === "Overdue" ? 600 : 400,
                          }}
                        >
                          {row.meta}
                        </span>
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* ── Section 4: Bar chart — EVO registrations ─────────────── */}
          <Card>
            <CardTitle>EVO registrations — last 7 days</CardTitle>
            <BarChart />
          </Card>

          {/* ── Section 5: Fleet snapshot + Top EMCs ─────────────────── */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
            }}
          >
            {/* Fleet snapshot */}
            <Card>
              <CardTitle>Fleet snapshot</CardTitle>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <ProgressRow
                  label="On road"
                  pct={57}
                  color={EVCORE_COLORS.green}
                  right="62"
                />
                <ProgressRow
                  label="Available"
                  pct={25}
                  color={EVCORE_COLORS.blue}
                  right="27"
                />
                <ProgressRow
                  label="Maintenance"
                  pct={11}
                  color={EVCORE_COLORS.amber}
                  right="12"
                />
                <ProgressRow
                  label="Retired"
                  pct={7}
                  color={EVCORE_COLORS.gray}
                  right="8"
                />
              </div>
            </Card>

            {/* Top EMCs by revenue */}
            <Card>
              <CardTitle>Top EMCs by revenue</CardTitle>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <ProgressRow
                  label="Kinshasa Nord"
                  pct={78}
                  color={EVCORE_COLORS.green}
                  right="$8,400"
                  labelWidth={100}
                />
                <ProgressRow
                  label="Kinshasa Sud"
                  pct={56}
                  color={EVCORE_COLORS.green}
                  right="$6,200"
                  labelWidth={100}
                />
                <ProgressRow
                  label="Katanga EMC"
                  pct={38}
                  color={EVCORE_COLORS.greenLight}
                  right="$4,100"
                  labelWidth={100}
                />
                <ProgressRow
                  label="Nord-Kivu"
                  pct={28}
                  color={EVCORE_COLORS.greenLight}
                  right="$3,100"
                  labelWidth={100}
                />
              </div>
            </Card>
          </div>
        </div>
      </AppShell>

      {/* Register EVO modal */}
      <RegisterEvoModal
        opened={registerOpen}
        onClose={() => setRegisterOpen(false)}
        title="Register New EVO"
        maxWidth={680}
      />
    </>
  );
}
