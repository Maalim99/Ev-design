"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Bell, Settings, LogOut, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

/**
 * LAMT App Shell Component
 * Refactored from EV Core to use Tailwind CSS with enhanced modularity
 *
 * Features:
 * - Responsive topbar navigation with Tailwind utilities
 * - Modular notification and user menu components
 * - Enhanced accessibility and keyboard navigation
 * - Flexible theming support
 * - Mobile-responsive design patterns
 */

// ─── Navigation Configuration ─────────────────────────────────────────────────

export interface NavItem {
  label: string;
  href: string;
  badge?: {
    count: number;
    variant?: "default" | "warning" | "danger";
  };
  disabled?: boolean;
}

const DEFAULT_NAV: NavItem[] = [
  { label: "Analytics", href: "/" },
  { label: "Accounts", href: "/accounts" },
  { label: "EMC Centers", href: "/emcs" },
  { label: "Payments", href: "/payments" },
  { label: "Pay Plans", href: "/plans" },
  { label: "Products", href: "/products" },
  { label: "Assets", href: "/assets" },
  { label: "Underwriting", href: "/bgc", badge: { count: 8, variant: "warning" } },
  { label: "OSP Training", href: "/osp" },
];

const TOPBAR_HEIGHT = "h-[58px]";

// ─── Component Variants ───────────────────────────────────────────────────────

const navLinkVariants = cva(
  cn(
    "inline-flex items-center gap-1.5 h-full px-3.5 text-[13px] whitespace-nowrap",
    "border-b-[3px] transition-all duration-200 ease-in-out",
    "hover:text-lamt-neutral-dark focus:outline-none focus:text-lamt-primary",
    "disabled:opacity-50 disabled:cursor-not-allowed"
  ),
  {
    variants: {
      active: {
        true: "border-b-lamt-primary text-lamt-primary font-semibold",
        false: "border-b-transparent text-lamt-neutral hover:text-lamt-neutral-dark",
      },
    },
    defaultVariants: {
      active: false,
    },
  }
);

const iconButtonVariants = cva(
  cn(
    "w-8 h-8 rounded-[7px] border border-lamt-neutral-medium bg-transparent",
    "flex items-center justify-center cursor-pointer transition-all duration-200",
    "hover:bg-lamt-neutral-light focus:outline-none focus:ring-2 focus:ring-lamt-primary/20"
  )
);

// ─── Modular Components ───────────────────────────────────────────────────────

interface NotificationButtonProps {
  count?: number;
  onClick?: () => void;
  className?: string;
}

function NotificationButton({ count = 1, onClick, className }: NotificationButtonProps) {
  return (
    <button
      className={cn(iconButtonVariants(), "relative", className)}
      onClick={onClick}
      aria-label={`Notifications${count ? ` (${count})` : ""}`}
    >
      <Bell size={14} className="text-lamt-neutral" strokeWidth={1.75} />
      {count > 0 && (
        <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-lamt-warning rounded-full border-[1.5px] border-white" />
      )}
    </button>
  );
}

interface UserMenuProps {
  user: {
    name: string;
    role: string;
    avatar?: string;
    initials: string;
  };
  onSettingsClick?: () => void;
  onLogoutClick?: () => void;
  className?: string;
}

function UserMenu({ user, onSettingsClick, onLogoutClick, className }: UserMenuProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div ref={menuRef} className={cn("relative", className)}>
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className={cn(
          "flex items-center gap-2 h-[34px] px-2.5 border border-lamt-neutral-medium rounded-[7px]",
          "bg-transparent hover:bg-lamt-neutral-light transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-lamt-primary/20"
        )}
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        {/* Avatar */}
        <div className="w-[26px] h-[26px] rounded-full bg-lamt-primary flex items-center justify-center flex-shrink-0">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span className="text-[9.5px] font-bold text-white tracking-wider">
              {user.initials}
            </span>
          )}
        </div>

        {/* User Info */}
        <div className="text-left hidden md:block">
          <div className="text-xs font-semibold text-lamt-neutral-dark leading-tight">
            {user.name}
          </div>
          <div className="text-[10px] text-lamt-neutral">
            {user.role}
          </div>
        </div>

        {/* Chevron */}
        <ChevronDown
          size={11}
          className={cn(
            "text-lamt-neutral transition-transform duration-150 hidden md:block",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className={cn(
          "absolute top-full right-0 mt-1.5 bg-white border border-lamt-neutral-medium",
          "rounded-lg shadow-lg min-w-48 overflow-hidden py-1 z-50"
        )}>
          {/* User Info Header */}
          <div className="px-4 py-2.5 border-b border-lamt-neutral-medium mb-1">
            <div className="text-[13px] font-semibold text-lamt-neutral-dark">
              {user.name}
            </div>
            <div className="text-[11px] text-lamt-neutral mt-0.5">
              {user.role}
            </div>
          </div>

          {/* Menu Items */}
          <DropdownItem
            icon={Settings}
            label="Settings"
            href="/settings"
            onClick={onSettingsClick}
          />

          <div className="h-px bg-lamt-neutral-medium my-1" />

          <DropdownItem
            icon={LogOut}
            label="Logout"
            onClick={onLogoutClick}
            variant="danger"
          />
        </div>
      )}
    </div>
  );
}

interface DropdownItemProps {
  icon: React.ElementType;
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: "default" | "danger";
}

function DropdownItem({ icon: Icon, label, href, onClick, variant = "default" }: DropdownItemProps) {
  const baseClasses = cn(
    "flex items-center gap-2.5 w-full h-9 px-4 text-[13px] cursor-pointer",
    "transition-colors duration-150 border-none bg-transparent text-left",
    "focus:outline-none focus:bg-lamt-neutral-light",
    {
      "text-lamt-neutral-dark hover:bg-lamt-neutral-light": variant === "default",
      "text-lamt-danger hover:bg-lamt-danger-light": variant === "danger",
    }
  );

  const content = (
    <>
      <Icon
        size={13}
        className={variant === "danger" ? "text-lamt-danger" : "text-lamt-neutral-dark"}
        strokeWidth={1.5}
      />
      {label}
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className={baseClasses}
        onClick={onClick}
      >
        {content}
      </a>
    );
  }

  return (
    <button className={baseClasses} onClick={onClick}>
      {content}
    </button>
  );
}

// ─── Main AppShell Component ──────────────────────────────────────────────────

export interface AppShellProps {
  children: React.ReactNode;
  /** Custom navigation items */
  navigation?: NavItem[];
  /** User information for the user menu */
  user?: {
    name: string;
    role: string;
    avatar?: string;
    initials: string;
  };
  /** Notification count */
  notificationCount?: number;
  /** Logo text or component */
  logo?: React.ReactNode;
  /** Logo href */
  logoHref?: string;
  /** App title displayed in page title */
  pageTitle?: string;
  /** Additional topbar actions */
  topbarAction?: React.ReactNode;
  /** Event handlers */
  onNotificationClick?: () => void;
  onSettingsClick?: () => void;
  onLogoutClick?: () => void;
  /** Custom className */
  className?: string;
}

export function AppShell({
  children,
  navigation = DEFAULT_NAV,
  user = {
    name: "Mohamed Maalim",
    role: "EVO Admin",
    initials: "MM"
  },
  notificationCount = 1,
  logo = "EV Core",
  logoHref = "/",
  pageTitle,
  topbarAction,
  onNotificationClick,
  onSettingsClick,
  onLogoutClick,
  className,
}: AppShellProps) {
  const pathname = usePathname();

  const isActive = React.useCallback((href: string) => {
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  }, [pathname]);

  // Set page title
  React.useEffect(() => {
    if (pageTitle) {
      document.title = `${pageTitle} - EV Core`;
    }
  }, [pageTitle]);

  return (
    <div className={cn(
      "min-h-screen flex flex-col font-sans bg-lamt-neutral-light",
      className
    )}>
      {/* Topbar */}
      <header className={cn(
        "fixed top-0 left-0 right-0 bg-white border-b border-lamt-neutral-medium",
        "flex items-stretch z-50",
        TOPBAR_HEIGHT
      )}>
        {/* Logo */}
        <a
          href={logoHref}
          className={cn(
            "flex items-center px-6 border-r border-lamt-neutral-medium",
            "no-underline flex-shrink-0 hover:bg-lamt-neutral-light/50 transition-colors"
          )}
        >
          <span className="text-sm font-bold text-lamt-neutral-dark tracking-tight">
            {logo}
          </span>
        </a>

        {/* Navigation */}
        <nav className="flex items-stretch flex-1 px-2 overflow-x-auto">
          {navigation.map((item) => {
            const active = isActive(item.href);
            return (
              <a
                key={item.href}
                href={item.href}
                className={navLinkVariants({ active })}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
                {item.badge && (
                  <span className={cn(
                    "ml-1.5 px-1.5 py-0.5 text-[10px] font-bold rounded-full",
                    {
                      "bg-lamt-neutral-medium text-lamt-neutral-dark": item.badge.variant === "default",
                      "bg-lamt-warning text-lamt-neutral-dark": item.badge.variant === "warning",
                      "bg-lamt-danger text-white": item.badge.variant === "danger",
                    }
                  )}>
                    {item.badge.count}
                  </span>
                )}
              </a>
            );
          })}
        </nav>

        {/* Right Side */}
        <div className={cn(
          "flex items-center gap-2 px-4 border-l border-lamt-neutral-medium flex-shrink-0"
        )}>
          {/* Custom topbar actions */}
          {topbarAction && (
            <div className="flex items-center gap-2">
              {topbarAction}
            </div>
          )}

          {/* Notifications */}
          <NotificationButton
            count={notificationCount}
            onClick={onNotificationClick}
          />

          {/* User Menu */}
          <UserMenu
            user={user}
            onSettingsClick={onSettingsClick}
            onLogoutClick={onLogoutClick}
          />
        </div>
      </header>

      {/* Main Content */}
      <main className={cn(
        "flex-1 pt-[86px] px-7 pb-12",
        TOPBAR_HEIGHT.replace("h-", "pt-")
      )}>
        {children}
      </main>
    </div>
  );
}

// ─── Additional Layout Components ─────────────────────────────────────────────

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode[];
  breadcrumbs?: { label: string; href?: string }[];
  className?: string;
}

export function PageHeader({ title, subtitle, actions, breadcrumbs, className }: PageHeaderProps) {
  return (
    <div className={cn("mb-6", className)}>
      {breadcrumbs && (
        <nav className="mb-2">
          <ol className="flex items-center space-x-2 text-sm text-lamt-neutral">
            {breadcrumbs.map((crumb, index) => (
              <li key={index} className="flex items-center">
                {index > 0 && <span className="mx-2 text-lamt-neutral-medium">/</span>}
                {crumb.href ? (
                  <a
                    href={crumb.href}
                    className="hover:text-lamt-primary transition-colors"
                  >
                    {crumb.label}
                  </a>
                ) : (
                  <span className="text-lamt-neutral-dark font-medium">
                    {crumb.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-lamt-neutral-dark tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1 text-lamt-neutral">
              {subtitle}
            </p>
          )}
        </div>

        {actions && actions.length > 0 && (
          <div className="flex items-center gap-3">
            {actions.map((action, index) => (
              <div key={index}>{action}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AppShell;