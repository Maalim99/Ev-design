"use client";

import * as React from "react";
import { CheckCircle2, Clock, XCircle, AlertCircle } from "lucide-react";
import { AppShell } from "@/components/evcore/layout/AppShell";
import { KpiCard } from "@/components/evcore/ui/KpiCard";
import { EvoFiltersDrawer } from "@/components/evcore/filters/EvoFiltersDrawer";
import { EvoPreferencesDrawer, type ColumnPref } from "@/components/evcore/filters/EvoPreferencesDrawer";
import { PageHeader } from "@/components/lamt/page-header";
import { FiltersBar } from "@/components/lamt/filters-bar";
import { Table, TableCellType, PaginationStrategy } from "@/components/lamt/table";
import { EVO_ACCOUNTS, type OspStatus } from "@/data/dummy";
import { EVCORE_COLORS } from "@/lib/evcore/constants";
import { OSP_FILTER_SECTIONS, OSP_DEFAULT_COLUMNS } from "@/lib/evcore/filterConfigs";

const OSP_STYLE: Record<OspStatus, { label: string; bg: string; text: string }> = {
  NOT_STARTED: { label: "Not Started", bg: "#F3F3F1", text: "#6B7280" },
  IN_PROGRESS: { label: "In Progress", bg: "#E6F1FB", text: "#185FA5" },
  PASSED:      { label: "Passed",      bg: "#E1F5EE", text: "#0F6E56" },
  FAILED:      { label: "Failed",      bg: "#FEE2E2", text: "#991B1B" },
};

function OspChip({ status }: { status: OspStatus }) {
  const s = OSP_STYLE[status];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, height: 22, padding: "0 9px", borderRadius: 99, backgroundColor: s.bg, color: s.text, fontSize: 11, fontWeight: 600 }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: s.text, flexShrink: 0 }} />
      {s.label}
    </span>
  );
}

// BRD: Written ≥70 AND On-Road ≥70 to certify
function ScoreBar({ score }: { score: number | null }) {
  if (score === null) {
    return <span style={{ fontSize: 11, color: EVCORE_COLORS.textSecondary }}>—</span>;
  }
  const passed = score >= 70;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 120 }}>
      <div style={{ flex: 1, height: 4, borderRadius: 99, backgroundColor: "#F0EFE9", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${score}%`, borderRadius: 99, backgroundColor: passed ? EVCORE_COLORS.green : EVCORE_COLORS.danger }} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 700, color: passed ? "#0F6E56" : "#991B1B", minWidth: 36, textAlign: "right" }}>
        {score}/100
      </span>
    </div>
  );
}

export default function OspPage() {
  const [filterValues, setFilterValues] = React.useState<Record<string, string[]>>({});
  const [columns, setColumns]           = React.useState<ColumnPref[]>(OSP_DEFAULT_COLUMNS);
  const [filtersOpen, setFiltersOpen]   = React.useState(false);
  const [prefsOpen,   setPrefsOpen]     = React.useState(false);
  const [page, setPage]                 = React.useState(1);

  const certified  = EVO_ACCOUNTS.filter(e => e.ospStatus === "PASSED").length;
  const inProgress = EVO_ACCOUNTS.filter(e => e.ospStatus === "IN_PROGRESS").length;
  const failed     = EVO_ACCOUNTS.filter(e => e.ospStatus === "FAILED").length;
  const notStarted = EVO_ACCOUNTS.filter(e => e.ospStatus === "NOT_STARTED").length;

  const filtered = React.useMemo(() => {
    const statuses = filterValues.status ?? [];
    const emcs     = filterValues.emc    ?? [];
    return EVO_ACCOUNTS.filter(e =>
      (!statuses.length || statuses.includes(e.ospStatus)) &&
      (!emcs.length     || emcs.includes(e.emcName))
    );
  }, [filterValues]);

  const activeFiltersCount = Object.values(filterValues).reduce((a, v) => a + v.length, 0);
  const handleFilterChange = (id: string, selected: string[]) => { setFilterValues(p => ({ ...p, [id]: selected })); setPage(1); };
  const handleFilterReset  = () => { setFilterValues({}); setPage(1); };
  const handleColumnReset  = () => setColumns(OSP_DEFAULT_COLUMNS);

  const visibleKeys = new Set(columns.filter(c => c.visible).map(c => c.key));

  const allRows = {
    evoCode:  (e: typeof EVO_ACCOUNTS[0]) => <span style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 600, color: EVCORE_COLORS.green }}>{e.evoCode}</span>,
    fullName: (e: typeof EVO_ACCOUNTS[0]) => <span style={{ fontSize: 13, fontWeight: 600, color: EVCORE_COLORS.textPrimary }}>{e.fullName}</span>,
    emc:      (e: typeof EVO_ACCOUNTS[0]) => <span style={{ fontSize: 12 }}>{e.emcName}</span>,
    written:  (e: typeof EVO_ACCOUNTS[0]) => <ScoreBar score={e.ospWrittenScore} />,
    onroad:   (e: typeof EVO_ACCOUNTS[0]) => <ScoreBar score={e.ospOnroadScore} />,
    status:   (e: typeof EVO_ACCOUNTS[0]) => <OspChip status={e.ospStatus} />,
    result:   (e: typeof EVO_ACCOUNTS[0]) => <span style={{ fontSize: 11, color: EVCORE_COLORS.textSecondary }}>{e.assignedAarove}</span>,
  };

  const tableData = filtered.map(e => Object.fromEntries([
    ["id", e.id],
    ...Object.entries(allRows).filter(([k]) => visibleKeys.has(k)).map(([k, fn]) => [k, fn(e)]),
  ]));

  const colDefsMap: Record<string, string> = {
    evoCode: "EVO Code", fullName: "Full Name", emc: "EMC",
    written: "Written /100", onroad: "On-Road /100", status: "Status", result: "AAROVE",
  };
  const colDefs = columns.filter(c => c.visible).map(c => ({ headerName: colDefsMap[c.key] ?? c.label, type: TableCellType.component, key: c.key }));

  return (
    <>
      <AppShell pageTitle="OSP Training">
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          <div>
            <PageHeader title="OSP Training Evaluations" actions={[]} />
            <div style={{ fontSize: 12, color: EVCORE_COLORS.textSecondary, marginTop: 4 }}>
              {filtered.length} {filtered.length === 1 ? "record" : "records"}{activeFiltersCount > 0 ? " matching filters" : " total"} · Written ≥70 and On-Road ≥70 required for certification
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
            <KpiCard label="Certified"   value={String(certified)}  delta="Both tests ≥70"  deltaType="positive" icon={CheckCircle2} />
            <KpiCard label="In Progress" value={String(inProgress)} delta="Active sessions"  deltaType="neutral"  icon={Clock} />
            <KpiCard label="Failed"      value={String(failed)}     delta="Below threshold"  deltaType="negative" icon={XCircle} />
            <KpiCard label="Not Started" value={String(notStarted)} delta="Awaiting session" deltaType="neutral"  icon={AlertCircle} />
          </div>

          <div style={{ backgroundColor: "#EBF8F3", border: `0.5px solid ${EVCORE_COLORS.greenLight}`, borderRadius: 8, padding: "11px 16px", display: "flex", flexWrap: "wrap", gap: 16, fontSize: 12, color: "#0F6E56" }}>
            <span><strong>Written Evaluation</strong> — 10 questions · 100 pts · Pass: ≥70</span>
            <span style={{ color: EVCORE_COLORS.greenLight }}>·</span>
            <span><strong>On-Road Evaluation</strong> — 12 items · 100 pts · Pass: ≥70</span>
            <span style={{ color: EVCORE_COLORS.greenLight }}>·</span>
            <span><strong>Certification</strong> — both evaluations must score ≥70</span>
          </div>

          <FiltersBar
            activeFiltersCount={activeFiltersCount}
            onClickFilter={() => setFiltersOpen(true)}
            onClickPreferences={() => setPrefsOpen(true)}
            onClearFilter={activeFiltersCount > 0 ? handleFilterReset : undefined}
          />

          <div style={{ backgroundColor: EVCORE_COLORS.white, border: `0.5px solid ${EVCORE_COLORS.border}`, borderRadius: 12, overflow: "hidden" }}>
            <Table hasActions={false} data={tableData} colDefs={colDefs}
              currentPageNumber={page} limit={10} totalData={filtered.length}
              paginationStrategy={PaginationStrategy.LOCAL} onPageChange={setPage} showCheckbox={false} />
          </div>
        </div>
      </AppShell>

      <EvoFiltersDrawer
        opened={filtersOpen} onClose={() => setFiltersOpen(false)}
        sections={OSP_FILTER_SECTIONS} values={filterValues}
        onChange={handleFilterChange} onReset={handleFilterReset}
      />
      <EvoPreferencesDrawer
        opened={prefsOpen} onClose={() => setPrefsOpen(false)}
        columns={columns} onChange={(k, v) => setColumns(p => p.map(c => c.key === k ? { ...c, visible: v } : c))}
        onReset={handleColumnReset}
      />
    </>
  );
}
