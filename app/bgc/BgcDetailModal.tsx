"use client";

import * as React from "react";
import { ShieldCheck } from "lucide-react";
import { Modal } from "@/components/lamt/modal";
import { LabeledItem } from "@/components/lamt/labeled-item";
import { StatusChip, StatusChipType } from "@/components/lamt/status-chip";
import { Button, ButtonKind } from "@/components/lamt/button";
import { EVCORE_COLORS } from "@/lib/evcore/constants";
import type { BgcTask, BgcTaskStatus, BgcRecommendation } from "@/data/dummy";

// ─── Status chip mappings ─────────────────────────────────────────────────────

const STATUS_CHIP: Record<BgcTaskStatus, { type: StatusChipType; label: string }> = {
  NOT_YET_ASSIGNED: { type: StatusChipType.Normal,  label: "Not Yet Assigned" },
  ASSIGNED:   { type: StatusChipType.Accent,  label: "Assigned"   },
  SUBMITTED:  { type: StatusChipType.Info,    label: "Submitted"  },
  APPROVED:   { type: StatusChipType.Success, label: "Approved"   },
  REJECTED:   { type: StatusChipType.Danger,  label: "Rejected"   },
  RETURNED:   { type: StatusChipType.Warning, label: "Returned"   },
};

const REC_CHIP: Record<BgcRecommendation, { type: StatusChipType; label: string }> = {
  RECOMMENDED:   { type: StatusChipType.Success, label: "Recommended"   },
  REJECTED:      { type: StatusChipType.Danger,  label: "Rejected"      },
  MANUAL_REVIEW: { type: StatusChipType.Info,    label: "Manual Review" },
};

// ─── Helper Functions ──────────────────────────────────────────────────────────

function getDaysOpen(task: BgcTask): number {
  const start = new Date(task.createdAt).getTime();
  const end = task.completedAt ? new Date(task.completedAt).getTime() : Date.now();
  return Math.max(0, Math.floor((end - start) / 86_400_000));
}

function fmtDate(s: string) {
  return new Date(s).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

// ─── Layout helpers ───────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{
        fontSize: 11,
        fontWeight: 700,
        color: EVCORE_COLORS.textSecondary,
        letterSpacing: "0.07em",
        textTransform: "uppercase",
        paddingBottom: 10,
        marginBottom: 14,
        borderBottom: `0.5px solid ${EVCORE_COLORS.border}`
      }}>
        {title}
      </div>
      {children}
    </div>
  );
}

function Grid2({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      {children}
    </div>
  );
}

function Col({ children, full }: { children: React.ReactNode; full?: boolean }) {
  return (
    <div style={{ width: full ? "100%" : "50%", paddingRight: full ? 0 : 20, marginBottom: 16 }}>
      {children}
    </div>
  );
}

// ─── BGC Detail Modal ─────────────────────────────────────────────────────────

interface BgcDetailModalProps {
  task: BgcTask | null;
  onClose: () => void;
  onAssign: () => void;
  onApprove: () => void;
  onReject: () => void;
  onReturn: () => void;
}

export function BgcDetailModal({
  task,
  onClose,
  onAssign,
  onApprove,
  onReject,
  onReturn
}: BgcDetailModalProps) {
  if (!task) return null;

  const statusChip = STATUS_CHIP[task.status];
  const days = getDaysOpen(task);

  const modalTitle = (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      BGC Task — {task.evoName}
      <span style={{
        fontFamily: "monospace",
        fontSize: 11,
        fontWeight: 700,
        color: EVCORE_COLORS.green,
        backgroundColor: "#EBF8F3",
        border: `0.5px solid ${EVCORE_COLORS.greenLight}`,
        borderRadius: 5,
        padding: "2px 8px"
      }}>
        {task.evoCode}
      </span>
      {task.finalRecommendation && (
        <StatusChip type={REC_CHIP[task.finalRecommendation].type}>
          {REC_CHIP[task.finalRecommendation].label}
        </StatusChip>
      )}
    </span>
  );

  return (
    <Modal
      opened
      onClose={onClose}
      title={modalTitle}
      maxWidth={680}
      icon={<ShieldCheck size={18} color={EVCORE_COLORS.green} />}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

        {/* Summary */}
        <div style={{
          display: "flex",
          gap: 0,
          backgroundColor: EVCORE_COLORS.pageBg,
          borderRadius: 10,
          border: `0.5px solid ${EVCORE_COLORS.border}`,
          overflow: "hidden"
        }}>
          <div style={{
            flex: 1,
            padding: "16px 20px",
            borderRight: `0.5px solid ${EVCORE_COLORS.border}`
          }}>
            <LabeledItem isBig label="Province" value={task.province} />
          </div>
          <div style={{
            flex: "0 0 auto",
            padding: "16px 20px",
            borderRight: `0.5px solid ${EVCORE_COLORS.border}`,
            display: "flex",
            flexDirection: "column",
            gap: 6
          }}>
            <p className="text-[13.17px] leading-4 text-lamt-neutral">Status</p>
            <StatusChip type={statusChip.type}>{statusChip.label}</StatusChip>
          </div>
          <div style={{
            flex: "0 0 auto",
            padding: "16px 20px"
          }}>
            <LabeledItem isBig label="Days Open" value={`${days}d`} />
          </div>
        </div>

        {/* Assignment Details */}
        <Section title="Assignment & Timeline">
          <Grid2>
            <Col><LabeledItem label="Assigned To" value={task.assignedTo || "Not assigned"} /></Col>
            <Col><LabeledItem label="EMC Code" value={task.emcCode} /></Col>
            <Col><LabeledItem label="Created" value={fmtDate(task.createdAt)} /></Col>
            <Col><LabeledItem label="Submitted" value={task.submittedAt ? fmtDate(task.submittedAt) : "Pending"} /></Col>
            {task.evaluatedBy && (
              <>
                <Col><LabeledItem label="Evaluated By" value={task.evaluatedBy} /></Col>
                <Col><LabeledItem label="Evaluated" value={task.evaluatedAt ? fmtDate(task.evaluatedAt) : ""} /></Col>
              </>
            )}
          </Grid2>
        </Section>

        {/* Phase 1 - Operator Verification */}
        <Section title="Phase 1 — Operator Verification">
          {task.phase1Data ? (
            <Grid2>
              <Col>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <p className="text-[13.17px] leading-4 text-lamt-neutral">Operator Lives Here</p>
                  <StatusChip type={task.phase1Data.operatorLivesHere ? StatusChipType.Success : StatusChipType.Danger}>
                    {task.phase1Data.operatorLivesHere ? "Confirmed" : "Not Present"}
                  </StatusChip>
                </div>
              </Col>
              <Col>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <p className="text-[13.17px] leading-4 text-lamt-neutral">Address Match</p>
                  <StatusChip type={task.phase1Data.addressMatchesRegistration ? StatusChipType.Success : StatusChipType.Danger}>
                    {task.phase1Data.addressMatchesRegistration ? "Matches" : "Different"}
                  </StatusChip>
                </div>
              </Col>
              <Col>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <p className="text-[13.17px] leading-4 text-lamt-neutral">Work Verification</p>
                  <StatusChip type={task.phase1Data.workMatchesRegistration ? StatusChipType.Success : StatusChipType.Danger}>
                    {task.phase1Data.workMatchesRegistration ? "Verified" : "Not Verified"}
                  </StatusChip>
                </div>
              </Col>
              <Col>
                <LabeledItem
                  label="Housing Status"
                  value={`${task.phase1Data.verifiedHousingStatus} (${task.phase1Data.housingMatchesRegistration ? "Verified" : "Unverified"})`}
                />
              </Col>
              <Col>
                <LabeledItem label="Respondent" value={task.phase1Data.respondentRelationship} />
              </Col>
              <Col>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <p className="text-[13.17px] leading-4 text-lamt-neutral">Phase Result</p>
                  <StatusChip type={task.phase1Data.phase1Result === "OK" ? StatusChipType.Success : StatusChipType.Danger}>
                    {task.phase1Data.phase1Result}
                  </StatusChip>
                </div>
              </Col>
              {task.phase1Location && (
                <Col full>
                  <LabeledItem
                    label="Verification Location"
                    value={`${task.phase1Location.lat.toFixed(4)}, ${task.phase1Location.lng.toFixed(4)}`}
                  />
                </Col>
              )}
            </Grid2>
          ) : (
            <div style={{ fontSize: 13, color: EVCORE_COLORS.textSecondary, fontStyle: "italic" }}>
              Phase not completed
            </div>
          )}
        </Section>

        {/* Phase 2 - Sponsor Verification */}
        <Section title="Phase 2 — Sponsor Verification">
          {task.phase2Data ? (
            <Grid2>
              <Col>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <p className="text-[13.17px] leading-4 text-lamt-neutral">Name Verified</p>
                  <StatusChip type={task.phase2Data.nameMatchesRegistration ? StatusChipType.Success : StatusChipType.Danger}>
                    {task.phase2Data.nameMatchesRegistration ? "Matches" : "Different"}
                  </StatusChip>
                </div>
              </Col>
              <Col>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <p className="text-[13.17px] leading-4 text-lamt-neutral">Phone Verified</p>
                  <StatusChip type={task.phase2Data.phoneMatchesRegistration ? StatusChipType.Success : StatusChipType.Danger}>
                    {task.phase2Data.phoneMatchesRegistration ? "Matches" : "Different"}
                  </StatusChip>
                </div>
              </Col>
              <Col>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <p className="text-[13.17px] leading-4 text-lamt-neutral">Sponsor Endorsement</p>
                  <StatusChip type={task.phase2Data.recommendsEvo ? StatusChipType.Success : StatusChipType.Danger}>
                    {task.phase2Data.recommendsEvo ? "Endorses EVO" : "Does Not Endorse"}
                  </StatusChip>
                </div>
              </Col>
              <Col>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <p className="text-[13.17px] leading-4 text-lamt-neutral">Address Match</p>
                  <StatusChip type={task.phase2Data.addressMatchesRegistration ? StatusChipType.Success : StatusChipType.Danger}>
                    {task.phase2Data.addressMatchesRegistration ? "Matches" : "Different"}
                  </StatusChip>
                </div>
              </Col>
              <Col>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <p className="text-[13.17px] leading-4 text-lamt-neutral">Relationship Verified</p>
                  <StatusChip type={task.phase2Data.relationshipMatchesRegistration ? StatusChipType.Success : StatusChipType.Danger}>
                    {task.phase2Data.relationshipMatchesRegistration ? "Verified" : "Unverified"}
                  </StatusChip>
                </div>
              </Col>
              <Col>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <p className="text-[13.17px] leading-4 text-lamt-neutral">Phase Result</p>
                  <StatusChip type={task.phase2Data.phase2Result === "OK" ? StatusChipType.Success : StatusChipType.Danger}>
                    {task.phase2Data.phase2Result}
                  </StatusChip>
                </div>
              </Col>
              {task.phase2Location && (
                <Col full>
                  <LabeledItem
                    label="Verification Location"
                    value={`${task.phase2Location.lat.toFixed(4)}, ${task.phase2Location.lng.toFixed(4)}`}
                  />
                </Col>
              )}
            </Grid2>
          ) : (
            <div style={{ fontSize: 13, color: EVCORE_COLORS.textSecondary, fontStyle: "italic" }}>
              Phase not completed
            </div>
          )}
        </Section>

        {/* Phase 3 - Community Verification */}
        <Section title="Phase 3 — Community Verification">
          {task.phase3Data ? (
            <Grid2>
              <Col>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <p className="text-[13.17px] leading-4 text-lamt-neutral">Knows Operator</p>
                  <StatusChip type={task.phase3Data.knowsOperator ? StatusChipType.Success : StatusChipType.Danger}>
                    {task.phase3Data.knowsOperator ? "Yes" : "No"}
                  </StatusChip>
                </div>
              </Col>
              <Col>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <p className="text-[13.17px] leading-4 text-lamt-neutral">Reputation</p>
                  <StatusChip type={task.phase3Data.reputation === "GOOD" ? StatusChipType.Success : StatusChipType.Danger}>
                    {task.phase3Data.reputation}
                  </StatusChip>
                </div>
              </Col>
              <Col>
                <LabeledItem
                  label="Neighbors Interviewed"
                  value={`${task.phase3Data.neighborsConsulted} consulted`}
                />
              </Col>
              <Col>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <p className="text-[13.17px] leading-4 text-lamt-neutral">Phase Result</p>
                  <StatusChip type={task.phase3Data.phase3Result === "OK" ? StatusChipType.Success : StatusChipType.Danger}>
                    {task.phase3Data.phase3Result}
                  </StatusChip>
                </div>
              </Col>
              {task.phase3Location && (
                <Col full>
                  <LabeledItem
                    label="Verification Location"
                    value={`${task.phase3Location.lat.toFixed(4)}, ${task.phase3Location.lng.toFixed(4)}`}
                  />
                </Col>
              )}
            </Grid2>
          ) : (
            <div style={{ fontSize: 13, color: EVCORE_COLORS.textSecondary, fontStyle: "italic" }}>
              Phase not completed
            </div>
          )}
        </Section>

        {/* Manager Evaluation */}
        {task.evaluationNotes && task.evaluatedBy && (
          <Section title="Manager Evaluation">
            <Grid2>
              <Col>
                <LabeledItem label="Evaluated By" value={task.evaluatedBy} />
              </Col>
              <Col>
                <LabeledItem label="Decision" value={task.evaluationResult || "Pending"} />
              </Col>
              <Col full>
                <div style={{
                  padding: "12px 16px",
                  backgroundColor: EVCORE_COLORS.pageBg,
                  borderRadius: 8,
                  border: `0.5px solid ${EVCORE_COLORS.border}`,
                  fontSize: 13,
                  fontStyle: "italic",
                  color: EVCORE_COLORS.textPrimary
                }}>
                  "{task.evaluationNotes}"
                </div>
              </Col>
            </Grid2>
          </Section>
        )}

        {/* Actions */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
          <Button kind={ButtonKind.Ghost} onClick={onClose}>
            Close
          </Button>

          {task.status === "NOT_YET_ASSIGNED" && (
            <Button kind={ButtonKind.Normal} onClick={() => { onClose(); onAssign(); }}>
              Assign AAROVE Agent
            </Button>
          )}

          {task.status === "SUBMITTED" && (
            <>
              <Button kind={ButtonKind.Ghost} onClick={() => { onClose(); onReturn(); }}>
                ↩ Return
              </Button>
              <Button kind={ButtonKind.Ghost} onClick={() => { onClose(); onReject(); }}>
                ✗ Reject
              </Button>
              <Button kind={ButtonKind.Normal} onClick={() => { onClose(); onApprove(); }}>
                ✓ Approve
              </Button>
            </>
          )}
        </div>

      </div>
    </Modal>
  );
}