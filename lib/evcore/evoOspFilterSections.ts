import { FilterType, Method } from "@/lib/filter-utils";
import type { DropdownOption } from "@/components/lamt/dropdown";
import type { EvoFormFilterSection } from "@/components/lamt/evo-form-filters-drawer";

const OSP_STATUS_OPTIONS: DropdownOption[] = [
  { id: "NOT_YET_ASSIGNED", name: "Pending Assignment" },
  { id: "ASSIGNED",         name: "Assigned"           },
  { id: "IN_TRAINING",      name: "In Training"        },
  { id: "CERTIFIED",        name: "Certified"          },
  { id: "FAILED",           name: "Failed"             },
];

const TRAINER_OPTIONS: DropdownOption[] = [
  { id: "Félicité Mbuyi",   name: "Félicité Mbuyi"   },
  { id: "Grégoire Kabamba", name: "Grégoire Kabamba" },
  { id: "Ambroise Kabong",  name: "Ambroise Kabong"  },
];

const EMC_OPTIONS: DropdownOption[] = [
  { id: "Kinshasa Nord", name: "Kinshasa Nord" },
  { id: "Kinshasa Sud",  name: "Kinshasa Sud"  },
  { id: "Katanga EMC",   name: "Katanga EMC"   },
  { id: "Nord-Kivu",     name: "Nord-Kivu"     },
];

export const EVO_OSP_FILTER_SECTIONS: EvoFormFilterSection[] = [
  {
    id: "evo",
    title: "EVO",
    filters: [
      { name: "evoName", headerName: "EVO Name", type: FilterType.Str,    defaultMethod: Method.Contains, defaultValue: "" },
      { name: "evoCode", headerName: "EVO Code", type: FilterType.Str,    defaultMethod: Method.Contains, defaultValue: "" },
    ],
  },
  {
    id: "task",
    title: "Task",
    filters: [
      { name: "taskStatus", headerName: "Status",   type: FilterType.Select, defaultMethod: Method.Equals, defaultValue: "", options: OSP_STATUS_OPTIONS },
      { name: "emcName",    headerName: "EMC Zone", type: FilterType.Select, defaultMethod: Method.Equals, defaultValue: "", options: EMC_OPTIONS },
    ],
  },
  {
    id: "trainer",
    title: "Trainer",
    filters: [
      { name: "assignedTrainer", headerName: "Assigned Trainer", type: FilterType.Select, defaultMethod: Method.Equals, defaultValue: "", options: TRAINER_OPTIONS },
    ],
  },
];

export function getOspFilterDefaults(): Record<string, { method: string; value: string }> {
  const defaults: Record<string, { method: string; value: string }> = {};
  EVO_OSP_FILTER_SECTIONS.forEach(section => {
    section.filters.forEach(f => {
      defaults[f.name] = { method: f.defaultMethod, value: f.defaultValue };
    });
  });
  return defaults;
}
