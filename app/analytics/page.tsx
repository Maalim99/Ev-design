"use client";
import { AppShell } from "@/components/evcore/layout/AppShell";
import { EVCORE_COLORS } from "@/lib/evcore/constants";
import { BarChart2 } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <AppShell pageTitle="Analytics">
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 400, gap: 12 }}>
        <div style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: "#EBF8F3", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <BarChart2 size={22} color={EVCORE_COLORS.green} strokeWidth={1.75} />
        </div>
        <div style={{ fontSize: 16, fontWeight: 700, color: EVCORE_COLORS.textPrimary }}>Analytics</div>
        <div style={{ fontSize: 13, color: EVCORE_COLORS.textSecondary }}>Coming soon</div>
      </div>
    </AppShell>
  );
}
