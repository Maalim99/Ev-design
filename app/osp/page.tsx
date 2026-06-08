"use client";

import * as React from "react";
import { Award, Clock, AlertCircle, Eye, UserPlus, ClipboardList, ShieldCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { AppShell }              from "@/components/evcore/layout/AppShell";
import { KpiCard }               from "@/components/evcore/ui/KpiCard";
import { EvoFormFiltersDrawer }  from "@/components/lamt/evo-form-filters-drawer";
import { EvoPreferencesDrawer, type ColumnPref } from "@/components/lamt/evo-preferences-drawer";
import { PageHeader }            from "@/components/lamt/page-header";
import { FiltersBar }            from "@/components/lamt/filters-bar";
import { Table, TableCellType, PaginationStrategy } from "@/components/lamt/table";
import { Modal }                 from "@/components/lamt/modal";
import { Button, ButtonKind }    from "@/components/lamt/button";
import { StatusChip, StatusChipType } from "@/components/lamt/status-chip";
import { RowActionBtn }          from "@/components/evcore/ui/RowActionBtn";
import { OSP_TASKS, type OspTask, type OspTaskStatus, type OspScoreCategory } from "@/data/dummy";
import { EVCORE_COLORS }         from "@/lib/evcore/constants";
import { OSP_DEFAULT_COLUMNS }   from "@/lib/evcore/filterConfigs";
import { EVO_OSP_FILTER_SECTIONS, getOspFilterDefaults } from "@/lib/evcore/evoOspFilterSections";
import { Method }                from "@/lib/filter-utils";

// ─── Constants ────────────────────────────────────────────────────────────────

const TRAINERS = ["Félicité Mbuyi", "Grégoire Kabamba", "Ambroise Kabong"];

const STATUS_CHIP: Record<OspTaskStatus, { type: StatusChipType; label: string }> = {
  NOT_YET_ASSIGNED: { type: StatusChipType.Normal,  label: "Pending Assignment" },
  ASSIGNED:         { type: StatusChipType.Accent,  label: "Assigned"           },
  IN_TRAINING:      { type: StatusChipType.Info,    label: "In Training"        },
  CERTIFIED:        { type: StatusChipType.Success, label: "Certified"          },
  FAILED:           { type: StatusChipType.Danger,  label: "Failed"             },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtDate(s: string | null) {
  if (!s) return "—";
  return new Date(s).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

// ─── ScoreBar ─────────────────────────────────────────────────────────────────

function ScoreBar({ score }: { score: number | null }) {
  if (score === null) return <span style={{ fontSize: 11, color: EVCORE_COLORS.textSecondary }}>—</span>;
  const passed = score >= 70;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 110 }}>
      <div style={{ flex: 1, height: 4, borderRadius: 99, backgroundColor: "#F0EFE9", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${score}%`, borderRadius: 99, backgroundColor: passed ? EVCORE_COLORS.green : EVCORE_COLORS.danger }} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 700, color: passed ? "#0F6E56" : "#991B1B", minWidth: 38, textAlign: "right" }}>
        {score}/100
      </span>
    </div>
  );
}

// ─── CategoryBreakdown ────────────────────────────────────────────────────────

function CategoryBreakdown({ title, total, max, categories, passed }: {
  title: string;
  total: number | null;
  max: number;
  categories: OspScoreCategory[] | null;
  passed: boolean | null;
}) {
  const badge =
    passed === true  ? { label: "PASSED",  bg: "#E1F5EE", text: "#0F6E56" } :
    passed === false ? { label: "FAILED",  bg: "#FEE2E2", text: "#991B1B" } :
                       { label: "PENDING", bg: "#F3F3F1", text: "#6B7280" };
  return (
    <div style={{ backgroundColor: EVCORE_COLORS.pageBg, borderRadius: 10, padding: "14px 16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: EVCORE_COLORS.textPrimary }}>{title}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {total !== null && (
            <span style={{ fontSize: 12, fontWeight: 700, color: passed ? "#0F6E56" : "#991B1B" }}>{total}/{max}</span>
          )}
          <span style={{ fontSize: 10, fontWeight: 700, color: badge.text, backgroundColor: badge.bg, borderRadius: 4, padding: "2px 7px" }}>{badge.label}</span>
        </div>
      </div>
      {categories ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {categories.map(cat => {
            const pct = cat.awarded !== null ? Math.round((cat.awarded / cat.max) * 100) : 0;
            return (
              <div key={cat.label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 12, color: EVCORE_COLORS.textSecondary, width: 140, flexShrink: 0 }}>{cat.label}</span>
                <div style={{ flex: 1, height: 5, borderRadius: 99, backgroundColor: "#E8E7E2", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${pct}%`, borderRadius: 99, backgroundColor: cat.awarded !== null && pct >= 70 ? EVCORE_COLORS.green : cat.awarded !== null ? EVCORE_COLORS.danger : "#C8C7C1" }} />
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: EVCORE_COLORS.textPrimary, width: 44, textAlign: "right", flexShrink: 0 }}>{cat.awarded ?? "—"}/{cat.max}</span>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ fontSize: 12, color: EVCORE_COLORS.textSecondary, fontStyle: "italic" }}>Not yet evaluated</div>
      )}
    </div>
  );
}

// ─── OSP Detail Modal ─────────────────────────────────────────────────────────

function OspViewModal({ task, onClose, onAssign }: {
  task: OspTask | null;
  onClose: () => void;
  onAssign: () => void;
}) {
  if (!task) return null;
  const st = STATUS_CHIP[task.taskStatus];

  const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `0.5px solid ${EVCORE_COLORS.border}` }}>
      <span style={{ fontSize: 12, color: EVCORE_COLORS.textSecondary, fontWeight: 500, flexShrink: 0, marginRight: 16 }}>{label}</span>
      <span style={{ fontSize: 13, color: EVCORE_COLORS.textPrimary, fontWeight: 600, textAlign: "right" }}>{value}</span>
    </div>
  );

  return (
    <Modal opened title="OSP Training Details" maxWidth={580} icon={<ShieldCheck size={18} color={EVCORE_COLORS.green} />} onClose={onClose}>

      {/* Banner */}
      <div style={{ padding: "12px 16px", borderRadius: 10, backgroundColor: EVCORE_COLORS.pageBg, marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: EVCORE_COLORS.textPrimary }}>{task.evoName}</div>
          <div style={{ fontSize: 12, fontFamily: "monospace", color: EVCORE_COLORS.green, marginTop: 3 }}>{task.evoCode} · {task.emcName}</div>
        </div>
        <div style={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
          <StatusChip type={st.type}>{st.label}</StatusChip>
          <span style={{ fontSize: 11, color: EVCORE_COLORS.textSecondary, fontFamily: "monospace" }}>{task.evProductCode}</span>
        </div>
      </div>

      {/* Task detail rows */}
      <div style={{ marginBottom: 20 }}>
        <Row label="Trainer"           value={task.assignedTrainer ?? <span style={{ color: EVCORE_COLORS.amber, fontWeight: 600 }}>Not assigned</span>} />
        <Row label="Training Date"     value={fmtDate(task.trainingDate)} />
        <Row label="Training Location" value={task.trainingLocation ?? "—"} />
        <Row label="Created"           value={fmtDate(task.createdAt)} />
        {task.certifiedAt && (
          <Row label="Certified On" value={<span style={{ color: "#0F6E56", fontWeight: 700 }}>{fmtDate(task.certifiedAt)}</span>} />
        )}
      </div>

      {/* Written Evaluation */}
      <div style={{ fontSize: 11, fontWeight: 700, color: EVCORE_COLORS.textSecondary, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>
        Written Evaluation — 10 Questions · 100 pts
      </div>
      <CategoryBreakdown
        title="Written Score"
        total={task.writtenScore}
        max={100}
        categories={task.writtenBreakdown}
        passed={task.writtenScore !== null ? task.writtenScore >= 70 : null}
      />

      {/* On-Road Evaluation */}
      <div style={{ fontSize: 11, fontWeight: 700, color: EVCORE_COLORS.textSecondary, letterSpacing: "0.06em", textTransform: "uppercase", margin: "16px 0 8px" }}>
        On-Road Evaluation — 12 Items · 100 pts
      </div>
      <CategoryBreakdown
        title="On-Road Score"
        total={task.onroadScore}
        max={100}
        categories={task.onroadBreakdown}
        passed={task.onroadScore !== null ? task.onroadScore >= 70 : null}
      />

      {/* Retake warning */}
      {task.taskStatus === "IN_TRAINING" && task.onroadScore !== null && task.onroadScore < 70 && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", backgroundColor: "#FEF9EE", borderRadius: 8, border: `0.5px solid #EF9F27`, marginTop: 14 }}>
          <AlertCircle size={15} color="#854F0B" />
          <span style={{ fontSize: 12, color: "#854F0B" }}>On-road score below 70 — retake required before certification.</span>
        </div>
      )}

      {/* Footer */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 }}>
        <button onClick={onClose} style={{ height: 38, padding: "0 20px", border: `0.5px solid ${EVCORE_COLORS.border}`, borderRadius: 8, backgroundColor: "transparent", fontSize: 13, color: EVCORE_COLORS.textSecondary, cursor: "pointer" }}>
          Close
        </button>
        {task.taskStatus === "NOT_YET_ASSIGNED" && (
          <button onClick={() => { onClose(); onAssign(); }} style={{ height: 38, padding: "0 20px", border: "none", borderRadius: 8, backgroundColor: EVCORE_COLORS.green, fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer" }}>
            Assign Trainer
          </button>
        )}
        {task.taskStatus === "IN_TRAINING" && (
          <button onClick={onClose} style={{ height: 38, padding: "0 20px", border: "none", borderRadius: 8, backgroundColor: EVCORE_COLORS.green, fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer" }}>
            Record Scores
          </button>
        )}
      </div>
    </Modal>
  );
}

// ─── Assign Trainer Modal ─────────────────────────────────────────────────────

function OspAssignModal({ task, onClose }: { task: OspTask | null; onClose: () => void }) {
  const [trainer,  setTrainer]  = React.useState("");
  const [date,     setDate]     = React.useState("");
  const [location, setLocation] = React.useState("");
  const [focused,  setFocused]  = React.useState<string | null>(null);
  React.useEffect(() => { if (!task) { setTrainer(""); setDate(""); setLocation(""); } }, [task]);
  if (!task) return null;

  const iStyle = (name: string): React.CSSProperties => ({
    width: "100%", height: 40,
    border: `1px solid ${focused === name ? EVCORE_COLORS.green : EVCORE_COLORS.border}`,
    borderRadius: 8, padding: "0 13px", fontSize: 14,
    color: EVCORE_COLORS.textPrimary, backgroundColor: EVCORE_COLORS.white,
    outline: "none", boxSizing: "border-box",
  });
  const labelStyle: React.CSSProperties = {
    fontSize: 12, fontWeight: 600, color: EVCORE_COLORS.textSecondary,
    display: "block", marginBottom: 6, letterSpacing: "0.04em", textTransform: "uppercase",
  };

  return (
    <Modal opened onClose={onClose} title={`Assign Trainer — ${task.evoName}`} maxWidth={440}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div>
          <label style={labelStyle}>Trainer *</label>
          <select style={{ ...iStyle("trainer"), cursor: "pointer" }} value={trainer}
            onChange={e => setTrainer(e.target.value)} onFocus={() => setFocused("trainer")} onBlur={() => setFocused(null)}>
            <option value="">Select trainer…</option>
            {TRAINERS.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Training Date *</label>
          <input type="date" style={iStyle("date")} value={date}
            onChange={e => setDate(e.target.value)} onFocus={() => setFocused("date")} onBlur={() => setFocused(null)} />
        </div>
        <div>
          <label style={labelStyle}>Training Location</label>
          <input style={iStyle("location")} value={location} onChange={e => setLocation(e.target.value)}
            onFocus={() => setFocused("location")} onBlur={() => setFocused(null)}
            placeholder="e.g. EMC Kinshasa Nord — Salle A" />
        </div>
        <div style={{ fontSize: 11, color: EVCORE_COLORS.textSecondary, backgroundColor: EVCORE_COLORS.pageBg, border: `0.5px solid ${EVCORE_COLORS.border}`, borderRadius: 7, padding: "9px 12px", lineHeight: 1.6 }}>
          EVO: <strong>{task.evoCode}</strong> · EMC: {task.emcName} · Product: {task.evProductCode}
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 4 }}>
          <Button kind={ButtonKind.Ghost} onClick={onClose}>Cancel</Button>
          <Button kind={ButtonKind.Normal} onClick={onClose} disabled={!trainer || !date}>Assign &amp; Schedule</Button>
        </div>
      </div>
    </Modal>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OspPage() {
  const formMethods = useForm({ defaultValues: getOspFilterDefaults() });

  const [filterData,   setFilterData]   = React.useState(getOspFilterDefaults());
  const [columns,      setColumns]      = React.useState<ColumnPref[]>(OSP_DEFAULT_COLUMNS);
  const [filtersOpen,  setFiltersOpen]  = React.useState(false);
  const [prefsOpen,    setPrefsOpen]    = React.useState(false);
  const [page,         setPage]         = React.useState(1);
  const [viewTask,     setViewTask]     = React.useState<OspTask | null>(null);
  const [assignTask,   setAssignTask]   = React.useState<OspTask | null>(null);

  // KPIs
  const certified  = OSP_TASKS.filter(t => t.taskStatus === "CERTIFIED").length;
  const inTraining = OSP_TASKS.filter(t => t.taskStatus === "IN_TRAINING").length;
  const pending    = OSP_TASKS.filter(t => t.taskStatus === "NOT_YET_ASSIGNED").length;
  const failed     = OSP_TASKS.filter(t => t.taskStatus === "FAILED").length;

  const applyFilter = React.useCallback((value: string | null | undefined, f: { method: string; value: string }) => {
    if (!f.value) return true;
    const v  = String(value ?? "").toLowerCase();
    const fv = f.value.toLowerCase();
    switch (f.method) {
      case Method.Contains:       return v.includes(fv);
      case Method.DoesNotContain: return !v.includes(fv);
      case Method.Equals:         return v === fv;
      default:                    return true;
    }
  }, []);

  const filtered = React.useMemo(() => {
    const fd = filterData;
    return OSP_TASKS.filter(t =>
      applyFilter(t.evoName,          fd.evoName          ?? { method: Method.Contains, value: "" }) &&
      applyFilter(t.evoCode,          fd.evoCode          ?? { method: Method.Contains, value: "" }) &&
      applyFilter(t.taskStatus,       fd.taskStatus       ?? { method: Method.Equals,   value: "" }) &&
      applyFilter(t.emcName,          fd.emcName          ?? { method: Method.Equals,   value: "" }) &&
      applyFilter(t.assignedTrainer ?? "", fd.assignedTrainer ?? { method: Method.Equals, value: "" })
    );
  }, [filterData, applyFilter]);

  const activeFiltersCount = Object.values(filterData).filter(f => f.value).length;
  const onChangeFilter     = React.useCallback((values: Record<string, unknown>) => {
    setFilterData(prev => ({ ...prev, ...(values as Record<string, { method: string; value: string }>) }));
    setPage(1);
  }, []);
  const onResetAllFilters  = () => {
    const d = getOspFilterDefaults();
    setFilterData(d);
    formMethods.reset(d);
    setPage(1);
  };
  const handleColumnReset = () => setColumns(OSP_DEFAULT_COLUMNS);

  const visibleKeys = new Set(columns.filter(c => c.visible).map(c => c.key));

  type Row = typeof OSP_TASKS[0];
  const allRows: Record<string, (t: Row) => React.ReactNode> = {
    evo: t => (
      <div>
        <button onClick={() => setViewTask(t)} style={{ background: "none", border: "none", padding: 0, cursor: "pointer", fontSize: 13, fontWeight: 600, color: EVCORE_COLORS.textPrimary, fontFamily: "inherit", textDecoration: "underline", textDecorationColor: "transparent", textUnderlineOffset: 2 }}
          onMouseEnter={e => (e.currentTarget.style.textDecorationColor = EVCORE_COLORS.green)}
          onMouseLeave={e => (e.currentTarget.style.textDecorationColor = "transparent")}>
          {t.evoName}
        </button>
        <div style={{ fontFamily: "monospace", fontSize: 11, color: EVCORE_COLORS.green, marginTop: 1 }}>{t.evoCode}</div>
      </div>
    ),
    emc:          t => <span style={{ fontSize: 12 }}>{t.emcName}</span>,
    trainer:      t => (
      <span style={{ fontSize: 12, color: t.assignedTrainer ? EVCORE_COLORS.textPrimary : EVCORE_COLORS.amber, fontWeight: t.assignedTrainer ? 400 : 600 }}>
        {t.assignedTrainer ?? "Unassigned"}
      </span>
    ),
    trainingDate: t => <span style={{ fontSize: 12, color: EVCORE_COLORS.textSecondary }}>{fmtDate(t.trainingDate)}</span>,
    written:      t => <ScoreBar score={t.writtenScore} />,
    onroad:       t => <ScoreBar score={t.onroadScore} />,
    status:       t => { const s = STATUS_CHIP[t.taskStatus]; return <StatusChip type={s.type}>{s.label}</StatusChip>; },
  };

  const tableData = filtered.map(t => ({
    id: t.id,
    ...Object.fromEntries(Object.entries(allRows).filter(([k]) => visibleKeys.has(k)).map(([k, fn]) => [k, fn(t)])),
    _raw: t,
  }));

  const colDefsMap: Record<string, string> = {
    evo: "EVO", emc: "EMC", trainer: "Trainer", trainingDate: "Training Date",
    written: "Written /100", onroad: "On-Road /100", status: "Status",
  };
  const colDefs = columns.filter(c => c.visible).map(c => ({ headerName: colDefsMap[c.key] ?? c.label, type: TableCellType.component, key: c.key }));

  const rowActions = (row: Record<string, unknown>) => {
    const task = (row as { _raw: OspTask })._raw;
    return (
      <div style={{ display: "flex", gap: 4 }}>
        <RowActionBtn icon={<Eye size={14} />}            title="View details"   variant="default" onClick={() => setViewTask(task)} />
        {task.taskStatus === "NOT_YET_ASSIGNED" && (
          <RowActionBtn icon={<UserPlus size={14} />}     title="Assign trainer" variant="green"   onClick={() => setAssignTask(task)} />
        )}
        {(task.taskStatus === "ASSIGNED" || task.taskStatus === "IN_TRAINING") && (
          <RowActionBtn icon={<ClipboardList size={14} />} title="Record scores"  variant="blue"   onClick={() => setViewTask(task)} />
        )}
      </div>
    );
  };

  return (
    <>
      <AppShell pageTitle="OSP Training">
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          <div>
            <PageHeader title="OSP Training" actions={[{ label: "+ Schedule Training", kind: ButtonKind.Primary, onClick: () => {} }]} />
            <div style={{ fontSize: 12, color: EVCORE_COLORS.textSecondary, marginTop: 4 }}>
              {filtered.length} {filtered.length === 1 ? "task" : "tasks"}{activeFiltersCount > 0 ? " matching filters" : " total"}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
            <KpiCard label="Certified"   value={String(certified)}  delta="Both tests ≥70"  deltaType="positive" icon={Award}      />
            <KpiCard label="In Training" value={String(inTraining)} delta="Active sessions"  deltaType="neutral"  icon={Clock}      />
            <KpiCard label="Unassigned"  value={String(pending)}    delta="Awaiting trainer" deltaType="neutral"  icon={AlertCircle}/>
            <KpiCard label="Failed"      value={String(failed)}     delta="Needs retake"     deltaType="negative" icon={ShieldCheck}/>
          </div>

          <FiltersBar
            activeFiltersCount={activeFiltersCount}
            onClickFilter={() => setFiltersOpen(true)}
            onClickPreferences={() => setPrefsOpen(true)}
            onClearFilter={activeFiltersCount > 0 ? onResetAllFilters : undefined}
          />

          <div style={{ backgroundColor: EVCORE_COLORS.white, border: `0.5px solid ${EVCORE_COLORS.border}`, borderRadius: 12, overflow: "hidden" }}>
            <Table hasActions rowActions={rowActions} data={tableData} colDefs={colDefs}
              currentPageNumber={page} limit={10} totalData={filtered.length}
              paginationStrategy={PaginationStrategy.LOCAL} onPageChange={setPage} showCheckbox={false} />
          </div>
        </div>
      </AppShell>

      <OspViewModal   task={viewTask}   onClose={() => setViewTask(null)}   onAssign={() => setAssignTask(viewTask)} />
      <OspAssignModal task={assignTask} onClose={() => setAssignTask(null)} />

      <EvoFormFiltersDrawer
        opened={filtersOpen} onClose={() => setFiltersOpen(false)}
        sections={EVO_OSP_FILTER_SECTIONS}
        formControl={formMethods}
        onChangeFilter={onChangeFilter}
        onResetAll={onResetAllFilters}
      />
      <EvoPreferencesDrawer
        opened={prefsOpen} onClose={() => setPrefsOpen(false)}
        columns={columns} onChange={(k, v) => setColumns(p => p.map(c => c.key === k ? { ...c, visible: v } : c))}
        onReset={handleColumnReset}
      />
    </>
  );
}
