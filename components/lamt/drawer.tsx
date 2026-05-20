import * as React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

/**
 * LAMT Drawer Component
 * Migrated from @lamt/components Drawer.tsx
 * Uses shadcn/ui Sheet as base
 */

export interface DrawerProps {
  title?: string;
  opened: boolean;
  onClose: () => void;
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  className?: string;
}

export const Drawer = React.forwardRef<HTMLDivElement, DrawerProps>(
  ({ title, opened, onClose, children, side = "right", className }, ref) => {
    return (
      <Sheet open={opened} onOpenChange={(open) => !open && onClose()}>
        <SheetContent ref={ref} side={side} className={className}>
          {title && (
            <SheetHeader>
              <SheetTitle>{title}</SheetTitle>
            </SheetHeader>
          )}
          <div className={title ? "mt-4" : ""}>{children}</div>
        </SheetContent>
      </Sheet>
    );
  }
);

Drawer.displayName = "Drawer";

export default Drawer;
