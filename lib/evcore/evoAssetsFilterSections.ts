import { FilterType, Method } from "@/lib/filter-utils";
import type { DropdownOption } from "@/components/lamt/dropdown";
import type { EvoFormFilterSection } from "@/components/lamt/evo-form-filters-drawer";

// ─── Options (spec-aligned) ───────────────────────────────────────────────────

const FLEET_STATUS_OPTIONS: DropdownOption[] = [
  { id: "ON_ROAD",            name: "On Road"             },
  { id: "OFF_ROAD_IDLE",      name: "Off Road – Idle"     },
  { id: "OFF_ROAD_FAULTY",    name: "Off Road – Faulty"   },
  { id: "RETIRED_PAID_OFF",   name: "Retired – Paid Off"  },
  { id: "RETIRED_UNDER_PAID", name: "Retired – Underpaid" },
  { id: "RETIRED_OVER_PAID",  name: "Retired – Overpaid"  },
  { id: "WRITTEN_OFF",        name: "Written Off"         },
];

// BRD §6.2 — all 8 product codes
const PRODUCT_CODE_OPTIONS: DropdownOption[] = [
  { id: "ALTECH-EMMO-A1", name: "ALTECH-EMMO-A1 — 2W Electric Moto"   },
  { id: "ALTECH-EPAT-A1", name: "ALTECH-EPAT-A1 — 2W Electric Patrol" },
  { id: "ALTECH-F3-2B",   name: "ALTECH-F3-2B — 2W F3"                },
  { id: "ALTECH-E3-2B",   name: "ALTECH-E3-2B — 2W E3"                },
  { id: "ALTECH-T1-2B",   name: "ALTECH-T1-2B — 3W Tricycle T1"       },
  { id: "ALTECH-T2-2B",   name: "ALTECH-T2-2B — 3W Tricycle T2"       },
  { id: "ALTECH-T3-2B",   name: "ALTECH-T3-2B — 3W Tricycle T3"       },
  { id: "ALTECH-ECAT-A1", name: "ALTECH-ECAT-A1 — Cart"               },
];

// Tech spec §4.5 — evType enum
const EV_TYPE_OPTIONS: DropdownOption[] = [
  { id: "TWO_WHEELER",   name: "Two-Wheeler (2W)"  },
  { id: "THREE_WHEELER", name: "Three-Wheeler (3W)" },
  { id: "CART",          name: "Cart"               },
];

const EMC_ZONE_OPTIONS: DropdownOption[] = [
  { id: "Kinshasa Nord", name: "Kinshasa Nord" },
  { id: "Kinshasa Sud",  name: "Kinshasa Sud"  },
  { id: "Katanga EMC",   name: "Katanga EMC"   },
  { id: "Nord-Kivu",     name: "Nord-Kivu"     },
];

// ─── Filter sections ──────────────────────────────────────────────────────────

export const EVO_ASSETS_FILTER_SECTIONS: EvoFormFilterSection[] = [
  {
    id: "asset",
    title: "Asset",
    filters: [
      {
        name: "assetCode",
        headerName: "Asset Code",
        title: "Unique asset identifier assigned at registration (e.g. A-201)",
        type: FilterType.Str,
        defaultMethod: Method.Contains,
        defaultValue: "",
      },
      {
        name: "assetKey",
        headerName: "Serial Number",
        title: "Physical serial number of the EV frame (assetKey, e.g. SN-F3-20251001-01)",
        type: FilterType.Str,
        defaultMethod: Method.Contains,
        defaultValue: "",
      },
      {
        name: "invoiceNumber",
        headerName: "Invoice Number",
        title: "Invoice number at acquisition (e.g. INV-2025-0201)",
        type: FilterType.Str,
        defaultMethod: Method.Contains,
        defaultValue: "",
      },
    ],
  },
  {
    id: "classification",
    title: "Classification",
    filters: [
      {
        name: "productCode",
        headerName: "Product Code",
        title: "EV product model — all 8 BRD §6.2 product codes",
        type: FilterType.Select,
        defaultMethod: Method.Equals,
        defaultValue: "",
        options: PRODUCT_CODE_OPTIONS,
      },
      {
        name: "evType",
        headerName: "Vehicle Type",
        title: "EV class — Two-Wheeler (2W), Three-Wheeler (3W), or Cart (tech spec §4.5)",
        type: FilterType.Select,
        defaultMethod: Method.Equals,
        defaultValue: "",
        options: EV_TYPE_OPTIONS,
      },
    ],
  },
  {
    id: "status",
    title: "Fleet Status",
    filters: [
      {
        name: "status",
        headerName: "Fleet Status",
        title: "Current deployment status of the asset (BRD §6.3) — On Road, Off Road Idle/Faulty, Retired (Paid Off/Underpaid/Overpaid), or Written Off",
        type: FilterType.Select,
        defaultMethod: Method.Equals,
        defaultValue: "",
        options: FLEET_STATUS_OPTIONS,
      },
    ],
  },
  {
    id: "location",
    title: "Location & Assignment",
    filters: [
      {
        name: "emcName",
        headerName: "EMC Zone",
        title: "E-Mobility Center the asset is assigned to",
        type: FilterType.Select,
        defaultMethod: Method.Equals,
        defaultValue: "",
        options: EMC_ZONE_OPTIONS,
      },
      {
        name: "assignedEvoCode",
        headerName: "Assigned EVO",
        title: "EVO Code of the operator this asset is deployed to via VCU handover (e.g. EVO-1001)",
        type: FilterType.Str,
        defaultMethod: Method.Contains,
        defaultValue: "",
      },
    ],
  },
];

// ─── Defaults ─────────────────────────────────────────────────────────────────

export function getAssetsFilterDefaults(): Record<string, { method: string; value: string }> {
  const defaults: Record<string, { method: string; value: string }> = {};
  EVO_ASSETS_FILTER_SECTIONS.forEach(section => {
    section.filters.forEach(f => {
      defaults[f.name] = { method: f.defaultMethod, value: f.defaultValue };
    });
  });
  return defaults;
}
