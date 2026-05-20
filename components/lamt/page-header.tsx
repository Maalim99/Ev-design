import * as React from "react";
import { Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, ButtonKind } from "./button";

/**
 * LAMT PageHeader Component
 * Migrated from @lamt/components PageHeader.tsx
 */

interface PageAction {
  label: string;
  kind?: ButtonKind;
  onClick: () => void;
  disabled?: boolean;
}

export interface PageHeaderProps {
  title: string;
  actions: PageAction[];
  onClickDownload?: () => void;
  downloadDisabled?: boolean;
  className?: string;
}

export const PageHeader = React.forwardRef<HTMLDivElement, PageHeaderProps>(
  (
    { title, actions, onClickDownload, downloadDisabled, className },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-baseline justify-between",
          "mb-2",
          className
        )}
      >
        <h3 className="text-[23.61px] font-bold leading-tight text-[#11171E]">
          {title}
        </h3>
        <div className="flex gap-4">
          {actions.map((action, i) => (
            <Button
              key={i}
              kind={action.kind}
              onClick={action.onClick}
              disabled={action.disabled}
            >
              {action.label}
            </Button>
          ))}
          {onClickDownload && (
            <Button
              onClick={onClickDownload}
              kind={ButtonKind.Ghost}
              icon={<Download size={16} />}
              disabled={downloadDisabled}
            >
              Download
            </Button>
          )}
        </div>
      </div>
    );
  }
);

PageHeader.displayName = "PageHeader";

export default PageHeader;
