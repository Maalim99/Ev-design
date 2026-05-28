import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

/**
 * LAMT Modal Component
 * Migrated from @lamt/components Modal.tsx
 * Uses shadcn/ui Dialog as base
 */

export interface ModalProps {
  title: React.ReactNode;
  maxWidth?: number;
  icon?: React.ReactNode;
  opened: boolean;
  children: React.ReactNode;
  onClose: () => void;
  className?: string;
}

export const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  ({ title, maxWidth = 600, icon, opened, children, onClose, className }, ref) => {
    return (
      <Dialog open={opened} onOpenChange={(open) => !open && onClose()}>
        <DialogContent
          ref={ref}
          className={cn("rounded-lg p-[15px]", className)}
          style={{ maxWidth: `${maxWidth}px` }}
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
              {icon && <span>{icon}</span>}
              {title}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">{children}</div>
        </DialogContent>
      </Dialog>
    );
  }
);

Modal.displayName = "Modal";

export default Modal;
