"use client";

import * as React from "react";
import { EVCORE_COLORS } from "@/lib/evcore/constants";
import { EvoRegistrationWizard } from "@/components/evcore/forms/EvoRegistrationWizard";

interface RegisterEvoModalProps {
  opened: boolean;
  onClose: () => void;
  title?: string;
  maxWidth?: number;
}

export function RegisterEvoModal({
  opened,
  onClose,
  title = "Register New EVO",
  maxWidth = 680,
}: RegisterEvoModalProps) {
  if (!opened) return null;

  return (
    /* Backdrop */
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        backgroundColor: "rgba(17, 23, 30, 0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      {/* Panel */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: EVCORE_COLORS.white,
          borderRadius: 14,
          width: "100%",
          maxWidth,
          maxHeight: "90vh",
          overflowY: "auto",
          border: `0.5px solid ${EVCORE_COLORS.border}`,
        }}
      >
        {/* Modal header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "18px 24px",
            borderBottom: `0.5px solid ${EVCORE_COLORS.border}`,
          }}
        >
          <span
            style={{
              fontSize: 17,
              fontWeight: 700,
              color: EVCORE_COLORS.textPrimary,
            }}
          >
            {title}
          </span>
          <button
            onClick={onClose}
            style={{
              width: 30,
              height: 30,
              borderRadius: 7,
              border: `0.5px solid ${EVCORE_COLORS.border}`,
              backgroundColor: "transparent",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: EVCORE_COLORS.textSecondary,
              fontSize: 18,
              lineHeight: 1,
            }}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Modal body */}
        <div style={{ padding: "24px" }}>
          <EvoRegistrationWizard onComplete={onClose} onCancel={onClose} />
        </div>
      </div>
    </div>
  );
}
