"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Bell, Settings, LogOut, ChevronDown } from "lucide-react";
import { EVCORE_COLORS } from "@/lib/evcore/constants";

// ─── Nav structure ────────────────────────────────────────────────────────────

interface NavItem {
  label: string;
  href: string;
}

const NAV: NavItem[] = [
  { label: "Analytics",    href: "/" },
  { label: "Accounts",     href: "/accounts" },
  { label: "EMC Centers",  href: "/emcs" },
  { label: "Payments",     href: "/payments" },
  { label: "Pay Plans",    href: "/plans" },
  { label: "Products",     href: "/products" },
  { label: "Assets",       href: "/assets" },
  { label: "Underwriting", href: "/bgc" },
  { label: "OSP Training", href: "/osp" },
];

const TOPBAR_H = 58;

// ─── AppShell ─────────────────────────────────────────────────────────────────

interface AppShellProps {
  pageTitle?: string;
  topbarAction?: React.ReactNode;
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname       = usePathname();
  const [userOpen, setUserOpen] = React.useState(false);
  const userRef = React.useRef<HTMLDivElement>(null);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  React.useEffect(() => {
    if (!userOpen) return;
    const h = (e: MouseEvent) => {
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [userOpen]);

  return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      fontFamily: "var(--font-geist-sans, system-ui, sans-serif)",
      backgroundColor: EVCORE_COLORS.pageBg,
    }}>

      {/* ── Topbar ─────────────────────────────────────────────────────── */}
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0,
        height: TOPBAR_H,
        backgroundColor: EVCORE_COLORS.white,
        borderBottom: `0.5px solid ${EVCORE_COLORS.border}`,
        display: "flex", alignItems: "stretch",
        zIndex: 50,
      }}>

        {/* Logo */}
        <a
          href="/"
          style={{
            display: "flex", alignItems: "center",
            padding: "0 24px",
            borderRight: `0.5px solid ${EVCORE_COLORS.border}`,
            textDecoration: "none", flexShrink: 0,
          }}
        >
          <span style={{ fontSize: 14, fontWeight: 700, color: EVCORE_COLORS.textPrimary, letterSpacing: "-0.01em" }}>
            EV Core
          </span>
        </a>

        {/* Nav */}
        <nav style={{
          display: "flex", alignItems: "stretch", flex: 1,
          padding: "0 8px",
        }}>
          {NAV.map((entry) => {
            const active = isActive(entry.href);
            return (
              <a
                key={entry.href}
                href={entry.href}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  height: "100%", padding: "0 14px",
                  textDecoration: "none", whiteSpace: "nowrap",
                  borderBottom: active
                    ? `3px solid ${EVCORE_COLORS.green}`
                    : "3px solid transparent",
                  color: active ? EVCORE_COLORS.green : EVCORE_COLORS.textSecondary,
                  fontSize: 13, fontWeight: active ? 600 : 400,
                }}
                onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLElement).style.color = EVCORE_COLORS.textPrimary; }}
                onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLElement).style.color = EVCORE_COLORS.textSecondary; }}
              >
                {entry.label}
              </a>
            );
          })}
        </nav>

        {/* Right side */}
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "0 16px",
          borderLeft: `0.5px solid ${EVCORE_COLORS.border}`,
          flexShrink: 0,
        }}>

          {/* Bell */}
          <button style={{
            width: 32, height: 32, borderRadius: 7,
            border: `0.5px solid ${EVCORE_COLORS.border}`,
            backgroundColor: "transparent",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", position: "relative",
          }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = EVCORE_COLORS.pageBg)}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")}
          >
            <Bell size={14} color={EVCORE_COLORS.textSecondary} strokeWidth={1.75} />
            <span style={{
              position: "absolute", top: 6, right: 6,
              width: 6, height: 6, borderRadius: "50%",
              backgroundColor: EVCORE_COLORS.amber,
              border: `1.5px solid ${EVCORE_COLORS.white}`,
            }} />
          </button>

          {/* User avatar */}
          <div ref={userRef} style={{ position: "relative" }}>
            <button
              onClick={() => setUserOpen(p => !p)}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                height: 34, padding: "0 10px",
                border: `0.5px solid ${EVCORE_COLORS.border}`,
                borderRadius: 7, backgroundColor: "transparent", cursor: "pointer",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = EVCORE_COLORS.pageBg)}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")}
            >
              <div style={{
                width: 26, height: 26, borderRadius: "50%",
                backgroundColor: EVCORE_COLORS.green,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 9.5, fontWeight: 700, color: "#fff", letterSpacing: "0.03em",
                flexShrink: 0,
              }}>
                MM
              </div>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: EVCORE_COLORS.textPrimary, lineHeight: 1.2 }}>
                  Mohamed Maalim
                </div>
                <div style={{ fontSize: 10, color: EVCORE_COLORS.textSecondary }}>
                  EVO Admin
                </div>
              </div>
              <ChevronDown
                size={11} color={EVCORE_COLORS.textSecondary}
                style={{ transition: "transform 0.15s", transform: userOpen ? "rotate(180deg)" : "rotate(0deg)" }}
              />
            </button>

            {userOpen && (
              <div style={{
                position: "absolute", top: "calc(100% + 6px)", right: 0,
                backgroundColor: EVCORE_COLORS.white,
                border: `0.5px solid ${EVCORE_COLORS.border}`,
                borderRadius: 10, boxShadow: "0 8px 24px rgba(0,0,0,0.10)",
                minWidth: 190, overflow: "hidden", padding: "4px 0",
                zIndex: 200,
              }}>
                {/* User info header */}
                <div style={{
                  padding: "10px 16px 8px",
                  borderBottom: `0.5px solid ${EVCORE_COLORS.border}`,
                  marginBottom: 4,
                }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: EVCORE_COLORS.textPrimary }}>
                    Mohamed Maalim
                  </div>
                  <div style={{ fontSize: 11, color: EVCORE_COLORS.textSecondary, marginTop: 1 }}>
                    EVO Admin
                  </div>
                </div>

                <DropdownItem icon={Settings} label="Settings" href="/settings" />

                <div style={{ height: "0.5px", backgroundColor: EVCORE_COLORS.border, margin: "4px 0" }} />

                <DropdownItem icon={LogOut} label="Logout" danger />
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ── Page content ───────────────────────────────────────────────── */}
      <main style={{
        flex: 1,
        paddingTop: TOPBAR_H,
        padding: `${TOPBAR_H + 28}px 28px 48px`,
      }}>
        {children}
      </main>

    </div>
  );
}

// ─── DropdownItem ─────────────────────────────────────────────────────────────

function DropdownItem({ icon: Icon, label, danger, href, onClick }: {
  icon: React.ElementType;
  label: string;
  danger?: boolean;
  href?: string;
  onClick?: () => void;
}) {
  const color = danger ? EVCORE_COLORS.danger : EVCORE_COLORS.textPrimary;
  const shared = {
    display: "flex", alignItems: "center", gap: 9,
    width: "100%", height: 36, padding: "0 16px",
    border: "none", backgroundColor: "transparent",
    fontSize: 13, color, cursor: "pointer", textAlign: "left" as const,
    textDecoration: "none",
  };
  const hoverBg = danger ? "#FEF2F2" : EVCORE_COLORS.pageBg;
  const content = <><Icon size={13} color={color} strokeWidth={1.5} />{label}</>;

  if (href) {
    return (
      <a href={href} style={shared}
        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = hoverBg)}
        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")}
      >{content}</a>
    );
  }
  return (
    <button style={shared} onClick={onClick}
      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = hoverBg)}
      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")}
    >{content}</button>
  );
}

/*
// ─── SIDEBAR (commented out — keeping for reference) ─────────────────────────

NAV_SECTIONS structure with section labels (Main / Operations / Fleet / Admin),
collapsible sidebar (220px expanded, 56px collapsed), user footer with
avatar + sign-out + collapse toggle.

Sidebar width variables:
  const SIDEBAR_W           = 220;
  const SIDEBAR_W_COLLAPSED = 56;

Nav items (flat list for sidebar, grouped by section):
  Dashboard, Analytics | Accounts, EMC Centers, Payments, Pay Plans, Products |
  Assets, Underwriting (badge: 8 amber), OSP Training | Admin Panel

Main content was:
  <main style={{ marginLeft: sidebarW, paddingTop: 52, padding: "80px 28px 48px" }}>
*/
