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
        <TabsList className="flex gap-4 mb-6 bg-transparent border-b-0">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="
                px-8 py-2.5 min-w-40
                border-2 rounded-[50px]
                font-semibold text-base
                transition-all duration-200
                data-[state=active]:bg-[#2D3A4A] data-[state=active]:text-white data-[state=active]:border-[#2D3A4A]
                data-[state=inactive]:bg-white data-[state=inactive]:text-[#2D3A4A] data-[state=inactive]:border-[#D1D5DB]
                hover:bg-[#F3F4F6] hover:text-[#2D3A4A] hover:border-[#2D3A4A]
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
