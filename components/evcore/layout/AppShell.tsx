"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import {
  Zap,
  LayoutDashboard,
  BarChart2,
  Users,
  Building2,
  CreditCard,
  FileText,
  Package,
  Truck,
  ClipboardCheck,
  GraduationCap,
  ShieldCheck,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Bell,
} from "lucide-react";
import { EVCORE_COLORS } from "@/lib/evcore/constants";

// ─── Nav structure ────────────────────────────────────────────────────────────

interface NavItem {
  label: string;
  icon: React.ElementType;
  href: string;
  badge?: { value: string; color: "green" | "amber" };
}

interface NavSection {
  label: string;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    label: "Main",
    items: [
      { label: "Dashboard", icon: LayoutDashboard, href: "/" },
      { label: "Analytics",  icon: BarChart2,       href: "/analytics" },
    ],
  },
  {
    label: "Operations",
    items: [
      { label: "Accounts",    icon: Users,      href: "/accounts", badge: { value: "142", color: "green" } },
      { label: "EMC Centers", icon: Building2,  href: "/emcs" },
      { label: "Payments",    icon: CreditCard, href: "/payments" },
      { label: "Pay Plans",   icon: FileText,   href: "/plans" },
      { label: "Products",    icon: Package,    href: "/products" },
    ],
  },
  {
    label: "Fleet",
    items: [
      { label: "Assets",        icon: Truck,         href: "/assets" },
      { label: "Underwriting",  icon: ClipboardCheck, href: "/bgc", badge: { value: "8", color: "amber" } },
      { label: "OSP Training",  icon: GraduationCap,  href: "/osp" },
    ],
  },
  {
    label: "Admin",
    items: [
      { label: "Admin Panel", icon: ShieldCheck, href: "/admin" },
    ],
  },
];

const BADGE_STYLES = {
  green: { bg: "#E1F5EE", text: "#0F6E56" },
  amber: { bg: "#FAEEDA", text: "#854F0B" },
} as const;

const SIDEBAR_W           = 220;
const SIDEBAR_W_COLLAPSED = 56;

// ─── AppShell ─────────────────────────────────────────────────────────────────

interface AppShellProps {
  pageTitle: string;
  topbarAction?: React.ReactNode;
  children: React.ReactNode;
}

export function AppShell({ pageTitle, topbarAction, children }: AppShellProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = React.useState(false);
  const sidebarW = collapsed ? SIDEBAR_W_COLLAPSED : SIDEBAR_W;

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        fontFamily: "var(--font-geist-sans, system-ui, sans-serif)",
        backgroundColor: EVCORE_COLORS.pageBg,
      }}
    >
      {/* ── Sidebar ────────────────────────────────────────────────────── */}
      <aside
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          width: sidebarW,
          backgroundColor: EVCORE_COLORS.white,
          borderRight: `0.5px solid ${EVCORE_COLORS.border}`,
          display: "flex",
          flexDirection: "column",
          transition: "width 0.2s ease",
          zIndex: 30,
          overflow: "hidden",
        }}
      >
        {/* Logo area */}
        <div
          style={{
            padding: collapsed ? "16px 12px" : "16px 18px",
            borderBottom: `0.5px solid ${EVCORE_COLORS.border}`,
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              backgroundColor: EVCORE_COLORS.green,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Zap size={16} color="#fff" strokeWidth={2} />
          </div>
          {!collapsed && (
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: EVCORE_COLORS.textPrimary, lineHeight: 1.2 }}>
                EV Core
              </div>
              <div style={{ fontSize: 11, color: EVCORE_COLORS.textSecondary, marginTop: 1 }}>
                Operator System
              </div>
            </div>
          )}
        </div>

        {/* Nav sections */}
        <nav
          style={{
            flex: 1,
            overflowY: "auto",
            overflowX: "hidden",
            padding: "8px 0",
          }}
        >
          {NAV_SECTIONS.map((section) => (
            <div key={section.label} style={{ marginBottom: 4 }}>
              {/* Section label */}
              {!collapsed && (
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    color: EVCORE_COLORS.textSecondary,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    padding: "10px 18px 4px",
                  }}
                >
                  {section.label}
                </div>
              )}

              {/* Items */}
              {section.items.map((item) => {
                const active = isActive(item.href);
                const Icon   = item.icon;
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 9,
                      height: 36,
                      margin: "1px 8px",
                      padding: collapsed ? "0 10px" : "0 10px",
                      borderRadius: 7,
                      textDecoration: "none",
                      transition: "background-color 0.12s",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      position: "relative",
                      backgroundColor: active ? "#E1F5EE" : "transparent",
                      borderLeft: active ? `3px solid ${EVCORE_COLORS.green}` : "3px solid transparent",
                    }}
                    onMouseEnter={(e) => {
                      if (!active) (e.currentTarget as HTMLElement).style.backgroundColor = "#F1EFE8";
                    }}
                    onMouseLeave={(e) => {
                      if (!active) (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                    }}
                  >
                    <Icon
                      size={15}
                      color={active ? "#0F6E56" : EVCORE_COLORS.textSecondary}
                      strokeWidth={active ? 2 : 1.5}
                      style={{ flexShrink: 0 }}
                    />

                    {!collapsed && (
                      <>
                        <span
                          style={{
                            fontSize: 12.5,
                            fontWeight: active ? 500 : 400,
                            color: active ? "#0F6E56" : EVCORE_COLORS.textSecondary,
                            flex: 1,
                          }}
                        >
                          {item.label}
                        </span>

                        {item.badge && (
                          <span
                            style={{
                              height: 18,
                              padding: "0 6px",
                              borderRadius: 99,
                              backgroundColor: BADGE_STYLES[item.badge.color].bg,
                              color: BADGE_STYLES[item.badge.color].text,
                              fontSize: 10,
                              fontWeight: 600,
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            {item.badge.value}
                          </span>
                        )}
                      </>
                    )}

                    {/* Collapsed badge dot */}
                    {item.badge && collapsed && (
                      <span
                        style={{
                          position: "absolute",
                          top: 6,
                          right: 6,
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          backgroundColor: item.badge.color === "amber" ? EVCORE_COLORS.amber : EVCORE_COLORS.green,
                        }}
                      />
                    )}
                  </a>
                );
              })}
            </div>
          ))}
        </nav>

        {/* User footer */}
        <div
          style={{
            borderTop: `0.5px solid ${EVCORE_COLORS.border}`,
            padding: collapsed ? "10px 8px" : "10px 12px",
            flexShrink: 0,
          }}
        >
          {/* User row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 9,
              padding: "6px 4px",
              borderRadius: 7,
            }}
          >
            {/* Avatar */}
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: "50%",
                backgroundColor: EVCORE_COLORS.green,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 11,
                fontWeight: 700,
                color: "#fff",
                flexShrink: 0,
                letterSpacing: "0.02em",
              }}
            >
              MM
            </div>

            {!collapsed && (
              <>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: EVCORE_COLORS.textPrimary, lineHeight: 1.2 }}>
                    Mohamed Maalim
                  </div>
                  <div style={{ fontSize: 11, color: EVCORE_COLORS.textSecondary, marginTop: 1 }}>
                    Super Admin
                  </div>
                </div>
                <button
                  title="Sign out"
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 6,
                    border: "none",
                    backgroundColor: "transparent",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#F1EFE8")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")}
                >
                  <LogOut size={14} color={EVCORE_COLORS.textSecondary} strokeWidth={1.5} />
                </button>
              </>
            )}
          </div>

          {/* Collapse toggle */}
          <button
            onClick={() => setCollapsed((c) => !c)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              height: 32,
              width: "100%",
              padding: "0 4px",
              borderRadius: 7,
              border: "none",
              backgroundColor: "transparent",
              cursor: "pointer",
              marginTop: 2,
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "#F1EFE8")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")}
          >
            {collapsed ? (
              <ChevronRight size={14} color={EVCORE_COLORS.textSecondary} strokeWidth={1.5} />
            ) : (
              <>
                <ChevronLeft size={14} color={EVCORE_COLORS.textSecondary} strokeWidth={1.5} />
                <span style={{ fontSize: 11, color: EVCORE_COLORS.textSecondary }}>Collapse</span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* ── Topbar ─────────────────────────────────────────────────────── */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: sidebarW,
          right: 0,
          zIndex: 20,
          height: 52,
          backgroundColor: EVCORE_COLORS.white,
          borderBottom: `0.5px solid ${EVCORE_COLORS.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 20px",
          transition: "left 0.2s ease",
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 600, color: EVCORE_COLORS.textPrimary }}>
          {pageTitle}
        </span>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              border: `0.5px solid ${EVCORE_COLORS.border}`,
              backgroundColor: "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              position: "relative",
            }}
          >
            <Bell size={14} color={EVCORE_COLORS.textSecondary} strokeWidth={1.75} />
            <span
              style={{
                position: "absolute",
                top: 6,
                right: 6,
                width: 6,
                height: 6,
                borderRadius: "50%",
                backgroundColor: EVCORE_COLORS.amber,
                border: `1.5px solid ${EVCORE_COLORS.white}`,
              }}
            />
          </button>

          {topbarAction && <div>{topbarAction}</div>}
        </div>
      </header>

      {/* ── Page content ───────────────────────────────────────────────── */}
      <main
        style={{
          flex: 1,
          marginLeft: sidebarW,
          paddingTop: 52,
          padding: "80px 28px 48px",
          transition: "margin-left 0.2s ease",
          minWidth: 0,
        }}
      >
        {children}
      </main>
    </div>
  );
}
