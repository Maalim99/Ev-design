"use client";

import { Modal } from "@/components/lamt/modal";
import { LabeledItem } from "@/components/lamt/labeled-item";
import { Button, ButtonKind, ButtonSize } from "@/components/lamt/button";

// ─── Row primitives ───────────────────────────────────────────────────────────

function SectionLabel({ label }: { label: string }) {
  return (
    <div style={{ paddingBottom: 10, paddingTop: 20 }}>
      <LabeledItem value={label} isBig={false} label=""
        className="font-bold text-[#11171E] text-[14px]"
      />
    </div>
  );
}

function SettingRow({
  label,
  value,
  onClickChange,
  changeDisabled,
}: {
  label: string;
  value?: string;
  onClickChange?: () => void;
  changeDisabled?: boolean;
}) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "1fr 3fr 80px",
      alignItems: "center",
      paddingBottom: 10,
      paddingTop: 10,
      borderBottom: "2px solid #f2f2f2",
    }}>
      <LabeledItem label={label} />
      <LabeledItem label="" value={value ?? ""} />
      {onClickChange ? (
        <Button
          kind={ButtonKind.Normal}
          size={ButtonSize.ExtraSmall}
          onClick={onClickChange}
          disabled={changeDisabled}
        >
          Change
        </Button>
      ) : (
        <span />
      )}
    </div>
  );
}

function InfoRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "1fr 3fr",
      alignItems: "center",
      paddingBottom: 10,
      paddingTop: 10,
      borderBottom: last ? "none" : "2px solid #f2f2f2",
    }}>
      <LabeledItem label={label} />
      <LabeledItem label="" value={value} />
    </div>
  );
}

// ─── Settings Modal ───────────────────────────────────────────────────────────

interface SettingsModalProps {
  opened: boolean;
  onClose: () => void;
}

export function SettingsModal({ opened, onClose }: SettingsModalProps) {
  return (
    <Modal title="Settings" opened={opened} onClose={onClose} maxWidth={620}>
      <div style={{ maxHeight: "70vh", overflowY: "auto", paddingRight: 4 }}>

        {/* Profile */}
        <SectionLabel label="Profile" />
        <SettingRow label="First Name"    value="Mohamed"                    onClickChange={() => {}} />
        <SettingRow label="Middle Name"   value=""                           />
        <SettingRow label="Last Name"     value="Maalim"                     onClickChange={() => {}} />
        <SettingRow label="Email"         value="ashrafzani585@gmail.com"    onClickChange={() => {}} />
        <SettingRow label="Phone Number"  value="Not set"                    onClickChange={() => {}} />
        <SettingRow label="Role"          value="EVO_ADMIN"                  changeDisabled />

        {/* Security */}
        <SectionLabel label="Security" />
        <SettingRow label="Password" value="*******************" onClickChange={() => {}} />

        {/* EVO System Roles — BRD §9.1 */}
        <SectionLabel label="EVO System Roles" />
        <InfoRow label="AAROVE"      value="Field agent — registers EVOs, conducts BGC phases" />
        <InfoRow label="EVO_TRAINER" value="Conducts OSP training sessions" />
        <InfoRow label="EMC_MANAGER" value="Manages EMC centres, evaluates BGC applications" />
        <InfoRow label="ZCM"         value="Zone commercial manager" />
        <InfoRow label="EVO_ADMIN"   value="Full platform access — your current role" last />

        {/* Payment Channels — BRD §8 */}
        <SectionLabel label="Payment Channels" />
        <InfoRow label="MPESA"        value="Mobile money — M-Pesa" />
        <InfoRow label="AIRTEL_MONEY" value="Mobile money — Airtel" />
        <InfoRow label="ORANGE_MONEY" value="Mobile money — Orange" last />

        {/* Activation Codes — BRD §8 */}
        <SectionLabel label="Activation Codes" />
        <InfoRow label="Issuance Window" value="06:00 – 21:00 (15-hour window)" />
        <InfoRow label="Code Validity"   value="48 hours from issuance" />
        <InfoRow label="IoT Provider"    value="Omnivoltaic" last />

      </div>
    </Modal>
  );
}
