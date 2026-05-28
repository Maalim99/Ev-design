import * as React from "react";
import { cn } from "@/lib/utils";
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
        <SheetContent
          ref={ref}
          side={side}
          className={cn(
            "bg-white border-[#E8EDF4] shadow-[0_0_30px_rgba(55,74,97,0.2)] p-[30px]",
            className
          )}
        >
          {title && (
            <SheetHeader className="p-0 mb-4">
              <SheetTitle>{title}</SheetTitle>
            </SheetHeader>
          )}
          <div className={cn("flex-1 min-h-0 overflow-y-auto")}>{children}</div>
        </SheetContent>
      </Sheet>
    );
  }
);

Drawer.displayName = "Drawer";

export default Drawer;
