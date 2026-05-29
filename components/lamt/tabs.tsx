import * as React from "react";
import { Tabs as ShadcnTabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

/**
 * LAMT Tabs Component
 * Migrated from @lamt/components Tabs.tsx
 * Uses shadcn/ui Tabs as base with LAMT styling
 */

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ tabs, activeTab, onTabChange, className }, ref) => {
    return (
      <ShadcnTabs
        ref={ref}
        value={activeTab}
        onValueChange={onTabChange}
        className={className}
      >
        <TabsList className="flex gap-0 mb-6 bg-transparent border-b border-[#E8EDF4] p-0 h-auto rounded-none">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="
                px-5 py-2.5
                bg-transparent rounded-none border-none shadow-none
                text-[13px] font-medium
                transition-all duration-150
                data-[state=active]:text-[#1D9E75] data-[state=active]:font-semibold
                data-[state=active]:border-b-2 data-[state=active]:border-[#1D9E75]
                data-[state=active]:shadow-none data-[state=active]:bg-transparent
                data-[state=inactive]:text-[#6B7280]
                hover:text-[#11171E]
                -mb-px
              "
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id}>
            {tab.content}
          </TabsContent>
        ))}
      </ShadcnTabs>
    );
  }
);

Tabs.displayName = "Tabs";

export default Tabs;
