import { FilterType, Method } from "@/lib/filter-utils";
import type { DropdownOption } from "@/components/lamt/dropdown";
import type { EvoFormFilterSection } from "@/components/evcore/filters/EvoFormFiltersDrawer";

// ─── Options ──────────────────────────────────────────────────────────────────

const BGC_STATUS_OPTIONS: DropdownOption[] = [
  { id: "UNASSIGNED", name: "Unassigned" },
  { id: "ASSIGNED",   name: "Assigned"   },
  { id: "SUBMITTED",  name: "Submitted"  },
  { id: "APPROVED",   name: "Approved"   },
  { id: "REJECTED",   name: "Rejected"   },
  { id: "RETURNED",   name: "Returned"   },
];

const REC_OPTIONS: DropdownOption[] = [
  { id: "RECOMMENDED",   name: "Recommended"   },
  { id: "REJECTED",      name: "Rejected"      },
  { id: "MANUAL_REVIEW", name: "Manual Review" },
];

const PROVINCE_OPTIONS: DropdownOption[] = [
  { id: "Kinshasa",     name: "Kinshasa"     },
  { id: "Haut-Katanga", name: "Haut-Katanga" },
  { id: "Nord-Kivu",    name: "Nord-Kivu"    },
  { id: "Kasaï-Oriental", name: "Kasaï-Oriental" },
  { id: "Kongo-Central", name: "Kongo-Central" },
  { id: "Maniema",      name: "Maniema"      },
];

// ─── Sections ─────────────────────────────────────────────────────────────────

export const EVO_BGC_FILTER_SECTIONS: EvoFormFilterSection[] = [
  {
    id: "evo",
    title: "EVO",
    filters: [
      {
        name: "evoName",
        headerName: "EVO Name",
        type: FilterType.Str,
        defaultMethod: Method.Contains,
        defaultValue: "",
      },
      {
        name: "evoCode",
        headerName: "EVO Code",
        type: FilterType.Str,
        defaultMethod: Method.Contains,
        defaultValue: "",
      },
    ],
  },
  {
    id: "task",
    title: "Task",
    filters: [
      {
        name: "status",
        headerName: "Status",
        type: FilterType.Select,
        defaultMethod: Method.Equals,
        defaultValue: "",
        options: BGC_STATUS_OPTIONS,
      },
      {
        name: "finalRecommendation",
        headerName: "Recommendation",
        type: FilterType.Select,
        defaultMethod: Method.Equals,
        defaultValue: "",
        options: REC_OPTIONS,
      },
      {
        name: "province",
        headerName: "Province",
        type: FilterType.Select,
        defaultMethod: Method.Equals,
        defaultValue: "",
        options: PROVINCE_OPTIONS,
      },
    ],
  },
  {
    id: "agent",
    title: "Assignment",
    filters: [
      {
        name: "assignedTo",
        headerName: "Assigned Agent",
        type: FilterType.Str,
        defaultMethod: Method.Contains,
        defaultValue: "",
      },
    ],
  },
];

// ─── Defaults ─────────────────────────────────────────────────────────────────

export function getBgcFilterDefaults(): Record<string, { method: string; value: string }> {
  const defaults: Record<string, { method: string; value: string }> = {};
  EVO_BGC_FILTER_SECTIONS.forEach(section => {
    section.filters.forEach(f => {
      defaults[f.name] = { method: f.defaultMethod, value: f.defaultValue };
    });
  });
  return defaults;
}
