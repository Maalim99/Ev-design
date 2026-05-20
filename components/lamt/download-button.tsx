import * as React from "react";
import { stringify } from "qs";
import { Button, ButtonKind } from "./button";
import { Download } from "lucide-react";

/**
 * LAMT DownloadButton Component
 * Migrated from @lamt/components DownloadButton.tsx
 */

export interface DownloadButtonProps {
  text?: string;
  endpoint: string;
  resource?: string;
  disabled?: boolean;
  fields: string[];
  filters?: Record<string, unknown>;
  kind?: ButtonKind;
  className?: string;
}

export const DownloadButton = React.forwardRef<
  HTMLButtonElement,
  DownloadButtonProps
>(
  (
    {
      text = "Download",
      resource = "data",
      endpoint,
      fields,
      filters,
      disabled,
      kind = ButtonKind.Ghost,
      className,
    },
    ref
  ) => {
    const [loading, setLoading] = React.useState<boolean>(false);

    async function downloadRecords() {
      const token = await localStorage.getItem("token");

      const url = new URL(`${endpoint}`);

      const search: Record<string, unknown> = { fields };
      if (filters) {
        search.search = filters;
      }

      if (fields.length > 0) {
        url.search = stringify(search, { encode: false });
      }

      const resp = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const blob = await resp.blob();

      if (window && resp.ok) {
        const timestamp = Date.now();
        const blobUrl = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = `${resource}_${timestamp}.csv`;
        a.click();
        window.URL.revokeObjectURL(blobUrl);
      } else {
        throw new Error(resp.statusText);
      }
    }

    const handleDownloadButton = async () => {
      try {
        setLoading(true);
        await downloadRecords();
      } catch (error) {
        console.error("Error downloading records:", error);
        throw new Error("Error downloading records");
      } finally {
        setLoading(false);
      }
    };

    return (
      <Button
        ref={ref}
        kind={kind}
        disabled={loading || disabled}
        onClick={handleDownloadButton}
        icon={<Download size={16} />}
        className={className}
      >
        {loading ? "Downloading..." : text}
      </Button>
    );
  }
);

DownloadButton.displayName = "DownloadButton";

export default DownloadButton;
