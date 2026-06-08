// ─── Dashboard ──────────────────────────────────────────────────────────────

export type ActivityType = "success" | "warning" | "info";
export type BadgeType = "BGC" | "OSP" | "Asset";

export interface ActivityRow { id: number; type: ActivityType; text: string; timestamp: string; }
export interface TaskRow { id: number; badgeType: BadgeType; task: string; meta: string; }
export interface WeeklyRegistration { day: string; value: number; }

export const DASHBOARD_ACTIVITY: ActivityRow[] = [
  { id: 1, type: "success", text: "EVO #1024 registered — Kinshasa Nord",    timestamp: "Today, 08:42" },
  { id: 2, type: "warning", text: "BGC overdue for EVO #0987 — Katanga EMC", timestamp: "Today, 07:15" },
  { id: 3, type: "info",    text: "Asset #A-221 assigned to driver Mwamba K.", timestamp: "Yesterday, 17:30" },
  { id: 4, type: "success", text: "Revenue MTD target 92% achieved",          timestamp: "Yesterday, 09:00" },
];

export const DASHBOARD_TASKS: TaskRow[] = [
  { id: 1, badgeType: "BGC",   task: "Complete background check for Lukusa B.",   meta: "Due today" },
  { id: 2, badgeType: "OSP",   task: "Onboarding session pending — EVO #1031",    meta: "Due tomorrow" },
  { id: 3, badgeType: "Asset", task: "Assign motorcycle to EVO #1028",            meta: "2 days left" },
  { id: 4, badgeType: "BGC",   task: "Review BGC results — Kabongo M.",           meta: "Overdue" },
];

export const WEEKLY_REGISTRATIONS: WeeklyRegistration[] = [
  { day: "Mon", value: 14 }, { day: "Tue", value: 22 }, { day: "Wed", value: 18 },
  { day: "Thu", value: 27 }, { day: "Fri", value: 21 }, { day: "Sat", value: 35 },
  { day: "Sun", value: 9 },
];

// ─── EVO Accounts ───────────────────────────────────────────────────────────

export type EvoStatus =
  | "PENDING_BGC" | "PENDING_OSP" | "PENDING_RP"
  | "PARTIAL_RP" | "PENDING_HO" | "ACTIVE" | "INACTIVE" | "DISENGAGED";

export type EmcZone = "Kinshasa Nord" | "Kinshasa Sud" | "Katanga EMC" | "Nord-Kivu";

export type BgcDecision  = "NOT_ASSESSED" | "RECOMMENDED" | "REJECTED" | "MANUAL_REVIEW";
export type OspStatus    = "NOT_STARTED" | "IN_PROGRESS" | "PASSED" | "FAILED";
export type EvoWorkType  = "MOTO_TAXI" | "SMALL_COMMERCE" | "EMPLOYEE" | "AGRICULTURE" | "UNEMPLOYED" | "OTHER";
export type MaritalStatus = "MARRIED" | "SINGLE" | "DIVORCED";

export interface EvoAddress {
  city: string;
  commune: string;
  quartier: string;
  avenue: string;
  plotNumber: string;
}

export interface EvoAccount {
  id: string;
  evoCode: string;
  fullName: string;
  phoneNumbers: string[];
  gender: "M" | "F";
  dateOfBirth: string;
  maritalStatus: MaritalStatus;
  currentWork: EvoWorkType;
  address: EvoAddress;
  hasSmartphone: boolean;
  worksSaturday: boolean;
  worksSunday: boolean;
  housingStatus: "OWNER" | "TENANT";
  emcName: EmcZone;
  emcCode: string;
  evProductCode: string;
  product: string;
  status: EvoStatus;
  balance: number;
  registeredAt: string;
  assignedAarove: string;
  bgcDecision: BgcDecision;
  ospStatus: OspStatus;
  ospWrittenScore: number | null;
  ospOnroadScore: number | null;
  lastPaymentDate: string | null;
  rentalPlan: string | null;
}

export const EMC_ZONES: EmcZone[] = ["Kinshasa Nord", "Kinshasa Sud", "Katanga EMC", "Nord-Kivu"];

export const EMC_CODE_MAP: Record<EmcZone, string> = {
  "Kinshasa Nord": "EMC-KIN-N01",
  "Kinshasa Sud":  "EMC-KIN-S01",
  "Katanga EMC":   "EMC-KAT-001",
  "Nord-Kivu":     "EMC-GOM-001",
};

export const EVO_ACCOUNTS: EvoAccount[] = [
  { id: "1",  evoCode: "EVO-1001", fullName: "Lukusa Bienvenu",    phoneNumbers: ["+243 812 345 001", "+243 898 100 001"], gender: "M", dateOfBirth: "1994-03-15", maritalStatus: "MARRIED",  currentWork: "MOTO_TAXI",     address: { city: "Kinshasa",    commune: "Lingwala",   quartier: "Kintambo",    avenue: "Av. Kasa-Vubu",       plotNumber: "12"  }, hasSmartphone: true,  worksSaturday: true,  worksSunday: false, housingStatus: "TENANT", emcName: "Kinshasa Nord", emcCode: "EMC-KIN-N01", evProductCode: "ALTECH-F3-2B",   product: "ALTECH-F3-2B",   status: "ACTIVE",            balance: 1240.00, registeredAt: "2026-01-04", assignedAarove: "Jean-Pierre Ndinga", bgcDecision: "RECOMMENDED",  ospStatus: "PASSED",      ospWrittenScore: 88, ospOnroadScore: 78, lastPaymentDate: "2026-05-09", rentalPlan: "SF5.RF7.RP36"  },
  { id: "2",  evoCode: "EVO-1002", fullName: "Kabongo Mwilambwe",  phoneNumbers: ["+243 812 345 002"],                    gender: "M", dateOfBirth: "1990-07-22", maritalStatus: "SINGLE",   currentWork: "SMALL_COMMERCE", address: { city: "Kinshasa",    commune: "Kalamu",     quartier: "Matonge",     avenue: "Av. Kabambare",       plotNumber: "34"  }, hasSmartphone: false, worksSaturday: true,  worksSunday: false, housingStatus: "TENANT", emcName: "Kinshasa Sud",  emcCode: "EMC-KIN-S01", evProductCode: "ALTECH-E3-2B",   product: "ALTECH-E3-2B",   status: "PENDING_BGC",      balance: 0,       registeredAt: "2026-01-10", assignedAarove: "Jean-Pierre Ndinga", bgcDecision: "NOT_ASSESSED", ospStatus: "NOT_STARTED", ospWrittenScore: null, ospOnroadScore: null, lastPaymentDate: null,         rentalPlan: "SF5.RF6.RP36"  },
  { id: "3",  evoCode: "EVO-1003", fullName: "Mwamba Katanga",     phoneNumbers: ["+243 812 345 003", "+243 970 300 003"], gender: "M", dateOfBirth: "1988-11-08", maritalStatus: "MARRIED",  currentWork: "MOTO_TAXI",     address: { city: "Lubumbashi", commune: "Kampemba",   quartier: "Kisanga",     avenue: "Av. Msiri",           plotNumber: "7"   }, hasSmartphone: true,  worksSaturday: true,  worksSunday: true,  housingStatus: "OWNER",  emcName: "Katanga EMC",   emcCode: "EMC-KAT-001", evProductCode: "ALTECH-ECAT-A1", product: "ALTECH-ECAT-A1", status: "PENDING_OSP", balance: 0,       registeredAt: "2026-01-12", assignedAarove: "Patience Wa Mwila",  bgcDecision: "RECOMMENDED",  ospStatus: "FAILED",      ospWrittenScore: 88, ospOnroadScore: 43, lastPaymentDate: null,         rentalPlan: "SF8.RF10.RP24" },
  { id: "5",  evoCode: "EVO-1005", fullName: "Kasongo Mulumba",    phoneNumbers: ["+243 812 345 005"],                    gender: "M", dateOfBirth: "1997-04-01", maritalStatus: "SINGLE",   currentWork: "MOTO_TAXI",     address: { city: "Kinshasa",    commune: "Barumbu",    quartier: "Kintambo",    avenue: "Av. du Fleuve",       plotNumber: "5"   }, hasSmartphone: true,  worksSaturday: true,  worksSunday: false, housingStatus: "TENANT", emcName: "Kinshasa Nord", emcCode: "EMC-KIN-N01", evProductCode: "ALTECH-E3-2B",   product: "ALTECH-E3-2B",   status: "PARTIAL_RP",   balance: 320.00,  registeredAt: "2026-02-01", assignedAarove: "Jean-Pierre Ndinga", bgcDecision: "RECOMMENDED",  ospStatus: "PASSED",      ospWrittenScore: 75, ospOnroadScore: 70, lastPaymentDate: "2026-04-20", rentalPlan: "SF5.RF6.RP36"  },
  { id: "6",  evoCode: "EVO-1006", fullName: "Ndaya Tshilombo",    phoneNumbers: ["+243 812 345 006", "+243 815 600 006"], gender: "F", dateOfBirth: "1995-09-18", maritalStatus: "SINGLE",   currentWork: "SMALL_COMMERCE", address: { city: "Kinshasa",    commune: "Lemba",      quartier: "Lemba",       avenue: "Av. Poids Lourds",    plotNumber: "18"  }, hasSmartphone: true,  worksSaturday: true,  worksSunday: false, housingStatus: "TENANT", emcName: "Kinshasa Sud",  emcCode: "EMC-KIN-S01", evProductCode: "ALTECH-T1-2B",   product: "ALTECH-T1-2B",   status: "PENDING_HO", balance: 0,       registeredAt: "2026-02-03", assignedAarove: "Jean-Pierre Ndinga", bgcDecision: "RECOMMENDED",  ospStatus: "PASSED",      ospWrittenScore: 83, ospOnroadScore: 79, lastPaymentDate: null,         rentalPlan: "SF6.RF8.RP36"  },
  { id: "7",  evoCode: "EVO-1007", fullName: "Kalombo Kayumba",    phoneNumbers: ["+243 812 345 007"],                    gender: "M", dateOfBirth: "1986-02-14", maritalStatus: "MARRIED",  currentWork: "MOTO_TAXI",     address: { city: "Lubumbashi", commune: "Kenya",      quartier: "Golf",        avenue: "Av. Lufira",          plotNumber: "9"   }, hasSmartphone: true,  worksSaturday: true,  worksSunday: false, housingStatus: "OWNER",  emcName: "Katanga EMC",   emcCode: "EMC-KAT-001", evProductCode: "ALTECH-F3-2B",   product: "ALTECH-F3-2B",   status: "ACTIVE",            balance: 2100.00, registeredAt: "2025-11-15", assignedAarove: "Patience Wa Mwila",  bgcDecision: "RECOMMENDED",  ospStatus: "PASSED",      ospWrittenScore: 91, ospOnroadScore: 85, lastPaymentDate: "2026-05-09", rentalPlan: "SF5.RF7.RP36"  },
  { id: "8",  evoCode: "EVO-1008", fullName: "Tshibanda Nkole",    phoneNumbers: ["+243 812 345 008"],                    gender: "M", dateOfBirth: "1992-06-30", maritalStatus: "MARRIED",  currentWork: "EMPLOYEE",      address: { city: "Goma",       commune: "Karisimbi",  quartier: "Virunga",     avenue: "Av. Keshero",         plotNumber: "22"  }, hasSmartphone: true,  worksSaturday: false, worksSunday: false, housingStatus: "TENANT", emcName: "Nord-Kivu",     emcCode: "EMC-GOM-001", evProductCode: "ALTECH-ECAT-A1", product: "ALTECH-ECAT-A1", status: "INACTIVE",          balance: 540.00,  registeredAt: "2025-10-08", assignedAarove: "Ambroise Kabong",    bgcDecision: "RECOMMENDED",  ospStatus: "PASSED",      ospWrittenScore: 76, ospOnroadScore: 70, lastPaymentDate: "2026-04-01", rentalPlan: "SF8.RF10.RP24" },
  { id: "9",  evoCode: "EVO-1009", fullName: "Balume Kalonji",     phoneNumbers: ["+243 812 345 009", "+243 899 900 009"], gender: "M", dateOfBirth: "1993-12-25", maritalStatus: "SINGLE",   currentWork: "MOTO_TAXI",     address: { city: "Kinshasa",    commune: "Gombe",      quartier: "Socimat",     avenue: "Av. Roi Baudouin",    plotNumber: "3"   }, hasSmartphone: true,  worksSaturday: true,  worksSunday: false, housingStatus: "TENANT", emcName: "Kinshasa Nord", emcCode: "EMC-KIN-N01", evProductCode: "ALTECH-E3-2B",   product: "ALTECH-E3-2B",   status: "PENDING_RP",  balance: 0,       registeredAt: "2026-02-08", assignedAarove: "Jean-Pierre Ndinga", bgcDecision: "RECOMMENDED",  ospStatus: "PASSED",      ospWrittenScore: 80, ospOnroadScore: 74, lastPaymentDate: null,         rentalPlan: "SF5.RF6.RP36"  },
  { id: "10", evoCode: "EVO-1010", fullName: "Mulamba Musasa",     phoneNumbers: ["+243 812 345 010"],                    gender: "M", dateOfBirth: "1984-08-11", maritalStatus: "MARRIED",  currentWork: "MOTO_TAXI",     address: { city: "Kinshasa",    commune: "Makala",     quartier: "Makala",      avenue: "Av. Sendwe",          plotNumber: "45"  }, hasSmartphone: true,  worksSaturday: true,  worksSunday: true,  housingStatus: "OWNER",  emcName: "Kinshasa Sud",  emcCode: "EMC-KIN-S01", evProductCode: "ALTECH-F3-2B",   product: "ALTECH-F3-2B",   status: "ACTIVE",            balance: 3400.00, registeredAt: "2025-09-01", assignedAarove: "Jean-Pierre Ndinga", bgcDecision: "RECOMMENDED",  ospStatus: "PASSED",      ospWrittenScore: 94, ospOnroadScore: 90, lastPaymentDate: "2026-05-09", rentalPlan: "SF5.RF7.RP36"  },
  { id: "11", evoCode: "EVO-1011", fullName: "Ntumba Tshisekedi",  phoneNumbers: ["+243 812 345 011"],                    gender: "M", dateOfBirth: "1998-01-07", maritalStatus: "SINGLE",   currentWork: "UNEMPLOYED",    address: { city: "Lubumbashi", commune: "Kamalondo",  quartier: "Industriel",  avenue: "Av. Kasumbalesa",     plotNumber: "2"   }, hasSmartphone: false, worksSaturday: false, worksSunday: false, housingStatus: "TENANT", emcName: "Katanga EMC",   emcCode: "EMC-KAT-001", evProductCode: "ALTECH-T1-2B",   product: "ALTECH-T1-2B",   status: "PENDING_BGC",      balance: 0,       registeredAt: "2026-02-11", assignedAarove: "Patience Wa Mwila",  bgcDecision: "MANUAL_REVIEW", ospStatus: "NOT_STARTED", ospWrittenScore: null, ospOnroadScore: null, lastPaymentDate: null,        rentalPlan: null             },
  { id: "12", evoCode: "EVO-1012", fullName: "Kanda Luvuya",       phoneNumbers: ["+243 812 345 012", "+243 813 120 012"], gender: "M", dateOfBirth: "1991-05-03", maritalStatus: "SINGLE",   currentWork: "SMALL_COMMERCE", address: { city: "Goma",       commune: "Himbi",      quartier: "Himbi",       avenue: "Av. Lac Kivu",        plotNumber: "11"  }, hasSmartphone: true,  worksSaturday: true,  worksSunday: false, housingStatus: "TENANT", emcName: "Nord-Kivu",     emcCode: "EMC-GOM-001", evProductCode: "ALTECH-E3-2B",   product: "ALTECH-E3-2B",   status: "ACTIVE",            balance: 760.00,  registeredAt: "2025-12-01", assignedAarove: "Ambroise Kabong",    bgcDecision: "RECOMMENDED",  ospStatus: "PASSED",      ospWrittenScore: 78, ospOnroadScore: 72, lastPaymentDate: "2026-05-07", rentalPlan: "SF5.RF6.RP36"  },
  { id: "13", evoCode: "EVO-1013", fullName: "Mbemba Nzuzi",       phoneNumbers: ["+243 812 345 013"],                    gender: "M", dateOfBirth: "1989-10-16", maritalStatus: "DIVORCED", currentWork: "MOTO_TAXI",     address: { city: "Kinshasa",    commune: "Lingwala",   quartier: "Lingwala",    avenue: "Av. Bongolo",         plotNumber: "8"   }, hasSmartphone: false, worksSaturday: true,  worksSunday: false, housingStatus: "TENANT", emcName: "Kinshasa Nord", emcCode: "EMC-KIN-N01", evProductCode: "ALTECH-F3-2B",   product: "ALTECH-F3-2B",   status: "DISENGAGED",        balance: 0,       registeredAt: "2025-08-14", assignedAarove: "Jean-Pierre Ndinga", bgcDecision: "REJECTED",     ospStatus: "NOT_STARTED", ospWrittenScore: null, ospOnroadScore: null, lastPaymentDate: null,         rentalPlan: null             },
  { id: "14", evoCode: "EVO-1014", fullName: "Mutu Kikwit",        phoneNumbers: ["+243 812 345 014"],                    gender: "M", dateOfBirth: "1996-03-28", maritalStatus: "SINGLE",   currentWork: "MOTO_TAXI",     address: { city: "Kinshasa",    commune: "Kalamu",     quartier: "Righini",     avenue: "Av. Colonel Ebeya",   plotNumber: "16"  }, hasSmartphone: true,  worksSaturday: true,  worksSunday: false, housingStatus: "TENANT", emcName: "Kinshasa Sud",  emcCode: "EMC-KIN-S01", evProductCode: "ALTECH-F3-2B",   product: "ALTECH-F3-2B",   status: "PENDING_OSP", balance: 0,       registeredAt: "2026-02-14", assignedAarove: "Jean-Pierre Ndinga", bgcDecision: "RECOMMENDED",  ospStatus: "NOT_STARTED", ospWrittenScore: null, ospOnroadScore: null, lastPaymentDate: null,         rentalPlan: "SF5.RF7.RP36"  },
  { id: "15", evoCode: "EVO-1015", fullName: "Jean-Pierre Kabila", phoneNumbers: ["+243 812 345 015"],                    gender: "M", dateOfBirth: "1987-11-22", maritalStatus: "MARRIED",  currentWork: "AGRICULTURE",   address: { city: "Lubumbashi", commune: "Kampemba",   quartier: "Gambela",     avenue: "Av. Kasai",           plotNumber: "4"   }, hasSmartphone: true,  worksSaturday: false, worksSunday: false, housingStatus: "OWNER",  emcName: "Katanga EMC",   emcCode: "EMC-KAT-001", evProductCode: "ALTECH-E3-2B",   product: "ALTECH-E3-2B",   status: "PARTIAL_RP",   balance: 150.00,  registeredAt: "2026-02-10", assignedAarove: "Patience Wa Mwila",  bgcDecision: "RECOMMENDED",  ospStatus: "PASSED",      ospWrittenScore: 72, ospOnroadScore: 71, lastPaymentDate: "2026-04-28", rentalPlan: "SF5.RF6.RP36"  },
  { id: "16", evoCode: "EVO-1016", fullName: "Grace Mbuyi",        phoneNumbers: ["+243 812 345 016", "+243 816 160 016"], gender: "F", dateOfBirth: "1993-07-14", maritalStatus: "SINGLE",   currentWork: "SMALL_COMMERCE", address: { city: "Goma",       commune: "Goma",       quartier: "Birere",      avenue: "Av. Rutshuru",        plotNumber: "21"  }, hasSmartphone: true,  worksSaturday: true,  worksSunday: false, housingStatus: "TENANT", emcName: "Nord-Kivu",     emcCode: "EMC-GOM-001", evProductCode: "ALTECH-F3-2B",   product: "ALTECH-F3-2B",   status: "ACTIVE",            balance: 1880.00, registeredAt: "2025-11-25", assignedAarove: "Ambroise Kabong",    bgcDecision: "RECOMMENDED",  ospStatus: "PASSED",      ospWrittenScore: 86, ospOnroadScore: 80, lastPaymentDate: "2026-05-08", rentalPlan: "SF5.RF7.RP36"  },
  { id: "17", evoCode: "EVO-1017", fullName: "Esther Kalonga",     phoneNumbers: ["+243 812 345 017"],                    gender: "F", dateOfBirth: "1999-02-09", maritalStatus: "SINGLE",   currentWork: "EMPLOYEE",      address: { city: "Kinshasa",    commune: "Barumbu",    quartier: "Kingabwa",    avenue: "Av. Wagenia",         plotNumber: "6"   }, hasSmartphone: true,  worksSaturday: false, worksSunday: false, housingStatus: "TENANT", emcName: "Kinshasa Nord", emcCode: "EMC-KIN-N01", evProductCode: "ALTECH-T1-2B",   product: "ALTECH-T1-2B",   status: "PENDING_HO", balance: 0,       registeredAt: "2026-02-12", assignedAarove: "Jean-Pierre Ndinga", bgcDecision: "RECOMMENDED",  ospStatus: "PASSED",      ospWrittenScore: 79, ospOnroadScore: 73, lastPaymentDate: null,         rentalPlan: "SF6.RF8.RP36"  },
  { id: "18", evoCode: "EVO-1018", fullName: "Samuel Ngoy",        phoneNumbers: ["+243 812 345 018"],                    gender: "M", dateOfBirth: "1983-09-04", maritalStatus: "MARRIED",  currentWork: "MOTO_TAXI",     address: { city: "Kinshasa",    commune: "Lemba",      quartier: "Matete",      avenue: "Av. Victoire",        plotNumber: "33"  }, hasSmartphone: false, worksSaturday: true,  worksSunday: false, housingStatus: "OWNER",  emcName: "Kinshasa Sud",  emcCode: "EMC-KIN-S01", evProductCode: "ALTECH-E3-2B",   product: "ALTECH-E3-2B",   status: "INACTIVE",          balance: 200.00,  registeredAt: "2025-07-30", assignedAarove: "Jean-Pierre Ndinga", bgcDecision: "RECOMMENDED",  ospStatus: "PASSED",      ospWrittenScore: 70, ospOnroadScore: 70, lastPaymentDate: "2026-03-14", rentalPlan: "SF5.RF6.RP36"  },
  { id: "19", evoCode: "EVO-1019", fullName: "Daniel Mukendi",     phoneNumbers: ["+243 812 345 019", "+243 897 190 019"], gender: "M", dateOfBirth: "1985-04-17", maritalStatus: "MARRIED",  currentWork: "MOTO_TAXI",     address: { city: "Lubumbashi", commune: "Kenya",      quartier: "Tshamilemba", avenue: "Av. Lufupa",          plotNumber: "14"  }, hasSmartphone: true,  worksSaturday: true,  worksSunday: true,  housingStatus: "OWNER",  emcName: "Katanga EMC",   emcCode: "EMC-KAT-001", evProductCode: "ALTECH-F3-2B",   product: "ALTECH-F3-2B",   status: "ACTIVE",            balance: 4200.00, registeredAt: "2025-06-15", assignedAarove: "Patience Wa Mwila",  bgcDecision: "RECOMMENDED",  ospStatus: "PASSED",      ospWrittenScore: 96, ospOnroadScore: 88, lastPaymentDate: "2026-05-09", rentalPlan: "SF5.RF7.RP36"  },
  { id: "4",  evoCode: "EVO-1004", fullName: "Ilunga Nsenga",      phoneNumbers: ["+243 812 345 004"],                    gender: "M", dateOfBirth: "1990-12-01", maritalStatus: "SINGLE",   currentWork: "MOTO_TAXI",     address: { city: "Goma",       commune: "Karisimbi",  quartier: "Ndosho",      avenue: "Av. Nyiragongo",      plotNumber: "18"  }, hasSmartphone: true,  worksSaturday: true,  worksSunday: false, housingStatus: "TENANT", emcName: "Nord-Kivu",     emcCode: "EMC-GOM-001", evProductCode: "ALTECH-F3-2B",   product: "ALTECH-F3-2B",   status: "DISENGAGED",        balance: 0,       registeredAt: "2025-12-20", assignedAarove: "Ambroise Kabong",    bgcDecision: "REJECTED",     ospStatus: "NOT_STARTED", ospWrittenScore: null, ospOnroadScore: null, lastPaymentDate: null,         rentalPlan: null             },
  { id: "20", evoCode: "EVO-1020", fullName: "Rebecca Tshomba",    phoneNumbers: ["+243 812 345 020"],                    gender: "F", dateOfBirth: "1994-06-22", maritalStatus: "MARRIED",  currentWork: "SMALL_COMMERCE", address: { city: "Goma",       commune: "Himbi",      quartier: "Murara",      avenue: "Av. Goma",            plotNumber: "7"   }, hasSmartphone: true,  worksSaturday: true,  worksSunday: false, housingStatus: "TENANT", emcName: "Nord-Kivu",     emcCode: "EMC-GOM-001", evProductCode: "ALTECH-ECAT-A1", product: "ALTECH-ECAT-A1", status: "PENDING_RP",  balance: 0,       registeredAt: "2026-02-09", assignedAarove: "Ambroise Kabong",    bgcDecision: "RECOMMENDED",  ospStatus: "PASSED",      ospWrittenScore: 77, ospOnroadScore: 70, lastPaymentDate: null,         rentalPlan: "SF8.RF10.RP24" },
];

// ─── Sponsors ────────────────────────────────────────────────────────────────

export type RelationshipType = "FATHER" | "MOTHER" | "UNCLE" | "BROTHER" | "SISTER" | "PASTOR" | "EMPLOYER" | "OTHER";
export type SponsorWorkType  = "EMPLOYEE" | "SMALL_COMMERCE" | "AGRICULTURE" | "PASTOR" | "RETIRED" | "OTHER";

export interface Sponsor {
  evoCode: string;
  fullName: string;
  phoneNumbers: string[];
  gender: "M" | "F";
  dateOfBirth: string;
  maritalStatus: MaritalStatus;
  currentWork: SponsorWorkType;
  housingStatus: "OWNER" | "TENANT";
  relationshipToEvo: RelationshipType;
  address: EvoAddress;
}

export const SPONSORS: Sponsor[] = [
  { evoCode: "EVO-1001", fullName: "Lukusa Théodore",       phoneNumbers: ["+243 812 001 101"], gender: "M", dateOfBirth: "1965-04-10", maritalStatus: "MARRIED",  currentWork: "EMPLOYEE",       housingStatus: "OWNER",  relationshipToEvo: "FATHER",   address: { city: "Kinshasa",    commune: "Lingwala",  quartier: "Kintambo",   avenue: "Av. Kasa-Vubu",    plotNumber: "10" } },
  { evoCode: "EVO-1002", fullName: "Mwilambwe Pascal",      phoneNumbers: ["+243 812 001 102"], gender: "M", dateOfBirth: "1960-11-03", maritalStatus: "MARRIED",  currentWork: "SMALL_COMMERCE", housingStatus: "OWNER",  relationshipToEvo: "FATHER",   address: { city: "Kinshasa",    commune: "Kalamu",    quartier: "Matonge",    avenue: "Av. Kabambare",    plotNumber: "32" } },
  { evoCode: "EVO-1003", fullName: "Katanga Josée",         phoneNumbers: ["+243 812 001 103"], gender: "F", dateOfBirth: "1963-07-18", maritalStatus: "MARRIED",  currentWork: "SMALL_COMMERCE", housingStatus: "OWNER",  relationshipToEvo: "MOTHER",   address: { city: "Lubumbashi", commune: "Kampemba",  quartier: "Kisanga",    avenue: "Av. Msiri",        plotNumber: "5"  } },
  { evoCode: "EVO-1005", fullName: "Mulumba François",      phoneNumbers: ["+243 812 001 105"], gender: "M", dateOfBirth: "1968-09-25", maritalStatus: "MARRIED",  currentWork: "EMPLOYEE",       housingStatus: "TENANT", relationshipToEvo: "UNCLE",    address: { city: "Kinshasa",    commune: "Barumbu",   quartier: "Kintambo",   avenue: "Av. du Fleuve",    plotNumber: "3"  } },
  { evoCode: "EVO-1006", fullName: "Tshilombo Albert",      phoneNumbers: ["+243 812 001 106"], gender: "M", dateOfBirth: "1962-02-11", maritalStatus: "MARRIED",  currentWork: "RETIRED",        housingStatus: "OWNER",  relationshipToEvo: "FATHER",   address: { city: "Kinshasa",    commune: "Lemba",     quartier: "Lemba",      avenue: "Av. Poids Lourds", plotNumber: "16" } },
  { evoCode: "EVO-1007", fullName: "Kayumba Prosper",       phoneNumbers: ["+243 812 001 107"], gender: "M", dateOfBirth: "1958-06-30", maritalStatus: "MARRIED",  currentWork: "AGRICULTURE",    housingStatus: "OWNER",  relationshipToEvo: "FATHER",   address: { city: "Lubumbashi", commune: "Kenya",     quartier: "Golf",       avenue: "Av. Lufira",       plotNumber: "7"  } },
  { evoCode: "EVO-1008", fullName: "Nkole Celestin",        phoneNumbers: ["+243 812 001 108"], gender: "M", dateOfBirth: "1964-03-14", maritalStatus: "MARRIED",  currentWork: "EMPLOYEE",       housingStatus: "OWNER",  relationshipToEvo: "FATHER",   address: { city: "Goma",       commune: "Karisimbi", quartier: "Virunga",    avenue: "Av. Keshero",      plotNumber: "20" } },
  { evoCode: "EVO-1009", fullName: "Kalonji Marie",         phoneNumbers: ["+243 812 001 109"], gender: "F", dateOfBirth: "1970-08-22", maritalStatus: "MARRIED",  currentWork: "SMALL_COMMERCE", housingStatus: "TENANT", relationshipToEvo: "MOTHER",   address: { city: "Kinshasa",    commune: "Gombe",     quartier: "Socimat",    avenue: "Av. Roi Baudouin", plotNumber: "1"  } },
  { evoCode: "EVO-1010", fullName: "Musasa Emmanuel",       phoneNumbers: ["+243 812 001 110"], gender: "M", dateOfBirth: "1956-12-05", maritalStatus: "MARRIED",  currentWork: "RETIRED",        housingStatus: "OWNER",  relationshipToEvo: "FATHER",   address: { city: "Kinshasa",    commune: "Makala",    quartier: "Makala",     avenue: "Av. Sendwe",       plotNumber: "43" } },
  { evoCode: "EVO-1011", fullName: "Tshisekedi Paul",       phoneNumbers: ["+243 812 001 111"], gender: "M", dateOfBirth: "1970-04-17", maritalStatus: "MARRIED",  currentWork: "EMPLOYEE",       housingStatus: "OWNER",  relationshipToEvo: "UNCLE",    address: { city: "Lubumbashi", commune: "Kamalondo", quartier: "Industriel", avenue: "Av. Kasumbalesa",  plotNumber: "1"  } },
  { evoCode: "EVO-1012", fullName: "Luvuya Joseph",         phoneNumbers: ["+243 812 001 112"], gender: "M", dateOfBirth: "1963-01-28", maritalStatus: "MARRIED",  currentWork: "PASTOR",         housingStatus: "OWNER",  relationshipToEvo: "PASTOR",   address: { city: "Goma",       commune: "Himbi",     quartier: "Himbi",      avenue: "Av. Lac Kivu",     plotNumber: "9"  } },
  { evoCode: "EVO-1013", fullName: "Nzuzi Gaston",          phoneNumbers: ["+243 812 001 113"], gender: "M", dateOfBirth: "1960-07-04", maritalStatus: "MARRIED",  currentWork: "SMALL_COMMERCE", housingStatus: "TENANT", relationshipToEvo: "FATHER",   address: { city: "Kinshasa",    commune: "Lingwala",  quartier: "Lingwala",   avenue: "Av. Bongolo",      plotNumber: "6"  } },
  { evoCode: "EVO-1014", fullName: "Kikwit Claudine",       phoneNumbers: ["+243 812 001 114"], gender: "F", dateOfBirth: "1973-05-19", maritalStatus: "MARRIED",  currentWork: "SMALL_COMMERCE", housingStatus: "OWNER",  relationshipToEvo: "MOTHER",   address: { city: "Kinshasa",    commune: "Kalamu",    quartier: "Righini",    avenue: "Av. Colonel Ebeya",plotNumber: "14" } },
  { evoCode: "EVO-1015", fullName: "Kabila Bernard",        phoneNumbers: ["+243 812 001 115"], gender: "M", dateOfBirth: "1959-03-08", maritalStatus: "MARRIED",  currentWork: "AGRICULTURE",    housingStatus: "OWNER",  relationshipToEvo: "FATHER",   address: { city: "Lubumbashi", commune: "Kampemba",  quartier: "Gambela",    avenue: "Av. Kasai",        plotNumber: "2"  } },
  { evoCode: "EVO-1016", fullName: "Mbuyi Christine",       phoneNumbers: ["+243 812 001 116"], gender: "F", dateOfBirth: "1966-11-30", maritalStatus: "MARRIED",  currentWork: "EMPLOYEE",       housingStatus: "OWNER",  relationshipToEvo: "MOTHER",   address: { city: "Goma",       commune: "Goma",      quartier: "Birere",     avenue: "Av. Rutshuru",     plotNumber: "19" } },
  { evoCode: "EVO-1017", fullName: "Kalonga David",         phoneNumbers: ["+243 812 001 117"], gender: "M", dateOfBirth: "1968-08-12", maritalStatus: "MARRIED",  currentWork: "EMPLOYEE",       housingStatus: "OWNER",  relationshipToEvo: "FATHER",   address: { city: "Kinshasa",    commune: "Barumbu",   quartier: "Kingabwa",   avenue: "Av. Wagenia",      plotNumber: "4"  } },
  { evoCode: "EVO-1018", fullName: "Ngoy Félicien",         phoneNumbers: ["+243 812 001 118"], gender: "M", dateOfBirth: "1955-06-20", maritalStatus: "MARRIED",  currentWork: "RETIRED",        housingStatus: "OWNER",  relationshipToEvo: "FATHER",   address: { city: "Kinshasa",    commune: "Lemba",     quartier: "Matete",     avenue: "Av. Victoire",     plotNumber: "31" } },
  { evoCode: "EVO-1019", fullName: "Mukendi Sylvie",        phoneNumbers: ["+243 812 001 119"], gender: "F", dateOfBirth: "1962-09-14", maritalStatus: "MARRIED",  currentWork: "SMALL_COMMERCE", housingStatus: "OWNER",  relationshipToEvo: "MOTHER",   address: { city: "Lubumbashi", commune: "Kenya",     quartier: "Tshamilemba",avenue: "Av. Lufupa",       plotNumber: "12" } },
  { evoCode: "EVO-1004", fullName: "Nsenga Héritier",       phoneNumbers: ["+243 812 001 104"], gender: "M", dateOfBirth: "1972-03-07", maritalStatus: "MARRIED",  currentWork: "EMPLOYEE",       housingStatus: "TENANT", relationshipToEvo: "BROTHER",  address: { city: "Goma",       commune: "Karisimbi", quartier: "Ndosho",     avenue: "Av. Nyiragongo",   plotNumber: "16" } },
  { evoCode: "EVO-1020", fullName: "Tshomba Hervé",         phoneNumbers: ["+243 812 001 120"], gender: "M", dateOfBirth: "1967-10-25", maritalStatus: "MARRIED",  currentWork: "EMPLOYEE",       housingStatus: "OWNER",  relationshipToEvo: "EMPLOYER", address: { city: "Goma",       commune: "Himbi",     quartier: "Murara",     avenue: "Av. Goma",         plotNumber: "5"  } },
];

// ─── Fleet Assets ────────────────────────────────────────────────────────────

export type AssetFleetStatus = "ON_ROAD" | "OFF_ROAD_IDLE" | "OFF_ROAD_FAULTY" | "RETIRED_PAID_OFF" | "RETIRED_UNDER_PAID" | "RETIRED_OVER_PAID" | "WRITTEN_OFF";
export type AssetEvType = "TWO_WHEELER" | "THREE_WHEELER" | "CART";

export interface FleetAsset {
  id: string;
  assetCode: string;
  assetKey: string;
  productCode: string;
  evType: AssetEvType;
  chipType: string;
  omnivoltaicDeviceId: string;
  invoiceNumber: string;
  invoiceDate: string;
  deploymentDate: string | null;
  emcName: EmcZone;
  emcCode: string;
  status: AssetFleetStatus;
  assignedEvoCode: string | null;
  assignedEvoName: string | null;
}

export const FLEET_ASSETS: FleetAsset[] = [
  { id: "a1",  assetCode: "A-201", assetKey: "SN-F3-20251001-01", productCode: "ALTECH-F3-2B",   evType: "TWO_WHEELER",   chipType: "Omnivoltaic", omnivoltaicDeviceId: "OV-DVC-00201", invoiceNumber: "INV-2025-0201", invoiceDate: "2025-10-01", deploymentDate: null,         emcName: "Kinshasa Nord", emcCode: "EMC-KIN-N01", status: "OFF_ROAD_IDLE",   assignedEvoCode: null,       assignedEvoName: null             },
  { id: "a2",  assetCode: "A-202", assetKey: "SN-F3-20251001-02", productCode: "ALTECH-F3-2B",   evType: "TWO_WHEELER",   chipType: "Omnivoltaic", omnivoltaicDeviceId: "OV-DVC-00202", invoiceNumber: "INV-2025-0202", invoiceDate: "2025-10-01", deploymentDate: "2026-01-05", emcName: "Kinshasa Nord", emcCode: "EMC-KIN-N01", status: "ON_ROAD",         assignedEvoCode: "EVO-1001", assignedEvoName: "Lukusa Bienvenu"  },
  { id: "a3",  assetCode: "A-203", assetKey: "SN-T1-20251015-01", productCode: "ALTECH-T1-2B",   evType: "THREE_WHEELER", chipType: "Omnivoltaic", omnivoltaicDeviceId: "OV-DVC-00203", invoiceNumber: "INV-2025-0203", invoiceDate: "2025-10-15", deploymentDate: null,         emcName: "Kinshasa Nord", emcCode: "EMC-KIN-N01", status: "OFF_ROAD_IDLE",   assignedEvoCode: null,       assignedEvoName: null             },
  { id: "a4",  assetCode: "A-211", assetKey: "SN-F3-20250820-01", productCode: "ALTECH-F3-2B",   evType: "TWO_WHEELER",   chipType: "Omnivoltaic", omnivoltaicDeviceId: "OV-DVC-00211", invoiceNumber: "INV-2025-0211", invoiceDate: "2025-08-20", deploymentDate: "2025-09-01", emcName: "Kinshasa Sud",  emcCode: "EMC-KIN-S01", status: "ON_ROAD",         assignedEvoCode: "EVO-1010", assignedEvoName: "Mulamba Musasa"   },
  { id: "a5",  assetCode: "A-212", assetKey: "SN-EC-20250910-01", productCode: "ALTECH-ECAT-A1", evType: "CART",          chipType: "Omnivoltaic", omnivoltaicDeviceId: "OV-DVC-00212", invoiceNumber: "INV-2025-0212", invoiceDate: "2025-09-10", deploymentDate: null,         emcName: "Kinshasa Sud",  emcCode: "EMC-KIN-S01", status: "OFF_ROAD_FAULTY", assignedEvoCode: null,       assignedEvoName: null             },
  { id: "a6",  assetCode: "A-221", assetKey: "SN-F3-20251005-01", productCode: "ALTECH-F3-2B",   evType: "TWO_WHEELER",   chipType: "Omnivoltaic", omnivoltaicDeviceId: "OV-DVC-00221", invoiceNumber: "INV-2025-0221", invoiceDate: "2025-10-05", deploymentDate: "2025-11-16", emcName: "Katanga EMC",   emcCode: "EMC-KAT-001", status: "ON_ROAD",         assignedEvoCode: "EVO-1007", assignedEvoName: "Kalombo Kayumba"  },
  { id: "a7",  assetCode: "A-222", assetKey: "SN-T1-20251005-02", productCode: "ALTECH-T1-2B",   evType: "THREE_WHEELER", chipType: "Omnivoltaic", omnivoltaicDeviceId: "OV-DVC-00222", invoiceNumber: "INV-2025-0222", invoiceDate: "2025-10-05", deploymentDate: null,         emcName: "Katanga EMC",   emcCode: "EMC-KAT-001", status: "OFF_ROAD_IDLE",   assignedEvoCode: null,       assignedEvoName: null             },
  { id: "a8",  assetCode: "A-231", assetKey: "SN-F3-20251101-01", productCode: "ALTECH-F3-2B",   evType: "TWO_WHEELER",   chipType: "Omnivoltaic", omnivoltaicDeviceId: "OV-DVC-00231", invoiceNumber: "INV-2025-0231", invoiceDate: "2025-11-01", deploymentDate: "2025-12-21", emcName: "Nord-Kivu",     emcCode: "EMC-GOM-001", status: "ON_ROAD",         assignedEvoCode: "EVO-1004", assignedEvoName: "Ilunga Nsenga"    },
  { id: "a9",  assetCode: "A-232", assetKey: "SN-EC-20251101-01", productCode: "ALTECH-ECAT-A1", evType: "CART",          chipType: "Omnivoltaic", omnivoltaicDeviceId: "OV-DVC-00232", invoiceNumber: "INV-2025-0232", invoiceDate: "2025-11-01", deploymentDate: null,         emcName: "Nord-Kivu",     emcCode: "EMC-GOM-001", status: "OFF_ROAD_IDLE",   assignedEvoCode: null,       assignedEvoName: null             },
  { id: "a10", assetCode: "A-233", assetKey: "SN-E3-20251115-01", productCode: "ALTECH-E3-2B",   evType: "TWO_WHEELER",   chipType: "Omnivoltaic", omnivoltaicDeviceId: "OV-DVC-00233", invoiceNumber: "INV-2025-0233", invoiceDate: "2025-11-15", deploymentDate: "2025-11-26", emcName: "Nord-Kivu",     emcCode: "EMC-GOM-001", status: "ON_ROAD",            assignedEvoCode: "EVO-1016", assignedEvoName: "Grace Mbuyi"    },
  { id: "a11", assetCode: "A-241", assetKey: "SN-F3-20240601-01", productCode: "ALTECH-F3-2B",   evType: "TWO_WHEELER",   chipType: "Omnivoltaic", omnivoltaicDeviceId: "OV-DVC-00241", invoiceNumber: "INV-2024-0241", invoiceDate: "2024-06-01", deploymentDate: "2024-06-15", emcName: "Kinshasa Nord", emcCode: "EMC-KIN-N01", status: "RETIRED_PAID_OFF",    assignedEvoCode: null,       assignedEvoName: null             },
  { id: "a12", assetCode: "A-242", assetKey: "SN-T1-20240715-01", productCode: "ALTECH-T1-2B",   evType: "THREE_WHEELER", chipType: "Omnivoltaic", omnivoltaicDeviceId: "OV-DVC-00242", invoiceNumber: "INV-2024-0242", invoiceDate: "2024-07-15", deploymentDate: "2024-08-01", emcName: "Katanga EMC",   emcCode: "EMC-KAT-001", status: "RETIRED_UNDER_PAID",  assignedEvoCode: null,       assignedEvoName: null             },
  { id: "a13", assetCode: "A-243", assetKey: "SN-EC-20231201-01", productCode: "ALTECH-ECAT-A1", evType: "CART",          chipType: "Omnivoltaic", omnivoltaicDeviceId: "OV-DVC-00243", invoiceNumber: "INV-2023-0243", invoiceDate: "2023-12-01", deploymentDate: "2024-01-10", emcName: "Kinshasa Sud",  emcCode: "EMC-KIN-S01", status: "WRITTEN_OFF",         assignedEvoCode: null,       assignedEvoName: null             },
  { id: "a14", assetCode: "A-244", assetKey: "SN-E3-20240301-01", productCode: "ALTECH-E3-2B",   evType: "TWO_WHEELER",   chipType: "Omnivoltaic", omnivoltaicDeviceId: "OV-DVC-00244", invoiceNumber: "INV-2024-0244", invoiceDate: "2024-03-01", deploymentDate: "2024-03-15", emcName: "Kinshasa Nord", emcCode: "EMC-KIN-N01", status: "RETIRED_OVER_PAID",   assignedEvoCode: null,       assignedEvoName: null             },
];

// ─── BGC Tasks ────────────────────────────────────────────────────────────────

export type BgcTaskStatus = "NOT_YET_ASSIGNED" | "ASSIGNED" | "SUBMITTED" | "APPROVED" | "REJECTED" | "RETURNED";
export type BgcRecommendation = "RECOMMENDED" | "REJECTED" | "MANUAL_REVIEW";
export type BgcPhaseResult = "OK" | "NOT_OK";

export interface BgcLocation {
  lat: number;
  lng: number;
  capturedAt: string;
}

export interface BgcPhase1Data {
  verifiedAddress: {
    city: string;
    commune: string;
    quartier: string;
    avenue: string;
    plotNumber: string;
  };
  addressMatchesRegistration: boolean;
  operatorLivesHere: boolean;          // KEY FIELD
  respondentRelationship: string;
  verifiedWork: string;
  workMatchesRegistration: boolean;
  verifiedHousingStatus: "OWNER" | "TENANT";
  housingMatchesRegistration: boolean;
  phase1Result: BgcPhaseResult;
}

export interface BgcPhase2Data {
  verifiedName: string;
  nameMatchesRegistration: boolean;
  verifiedPhone: string;
  phoneMatchesRegistration: boolean;
  verifiedAddress: {
    city: string;
    commune: string;
    quartier: string;
    avenue: string;
    plotNumber: string;
  };
  addressMatchesRegistration: boolean;
  verifiedWork: string;
  workMatchesRegistration: boolean;
  verifiedRelationship: string;
  relationshipMatchesRegistration: boolean;
  verifiedHousingStatus: "OWNER" | "TENANT";
  housingMatchesRegistration: boolean;
  recommendsEvo: boolean;              // CRITICAL FIELD
  phase2Result: BgcPhaseResult;
}

export interface BgcPhase3Data {
  knowsOperator: boolean;
  reputation: "GOOD" | "BAD";
  neighborsConsulted: number;
  phase3Result: BgcPhaseResult;
}

export interface BgcTask {
  id: string;
  evoId: string;
  evoCode: string;
  evoName: string;
  emcName: EmcZone;
  emcCode: string;
  province: string;
  status: BgcTaskStatus;
  finalRecommendation: BgcRecommendation | null;
  assignedTo: string | null;
  assignedAt: string | null;
  submittedAt: string | null;
  evaluatedBy: string | null;
  evaluatedAt: string | null;
  evaluationResult: "APPROVED" | "REJECTED" | "RETURNED" | null;
  evaluationNotes: string | null;

  // Phase completion flags
  phase1Complete: boolean;
  phase2Complete: boolean;
  phase3Complete: boolean;

  // Detailed phase data (matching tech spec)
  phase1Data: BgcPhase1Data | null;
  phase2Data: BgcPhase2Data | null;
  phase3Data: BgcPhase3Data | null;

  // Location tracking for each phase
  phase1Location: BgcLocation | null;
  phase2Location: BgcLocation | null;
  phase3Location: BgcLocation | null;

  createdAt: string;
  completedAt: string | null;
}

// Sample location data
const KIN_LOCATION: BgcLocation = { lat: -4.3317, lng: 15.3139, capturedAt: "2026-05-01T08:30:00Z" };
const LUB_LOCATION: BgcLocation = { lat: -11.6702, lng: 27.4797, capturedAt: "2026-05-01T14:20:00Z" };
const GOM_LOCATION: BgcLocation = { lat: -1.6826, lng: 29.2387, capturedAt: "2026-05-01T10:45:00Z" };

// Comprehensive phase data templates
const P1_OK: BgcPhase1Data = {
  verifiedAddress: { city: "Kinshasa", commune: "Lingwala", quartier: "Kintambo", avenue: "Av. Kasa-Vubu", plotNumber: "12" },
  addressMatchesRegistration: true,
  operatorLivesHere: true,
  respondentRelationship: "Self",
  verifiedWork: "Moto-Taxi",
  workMatchesRegistration: true,
  verifiedHousingStatus: "OWNER",
  housingMatchesRegistration: true,
  phase1Result: "OK"
};

const P1_OK_T: BgcPhase1Data = {
  verifiedAddress: { city: "Kinshasa", commune: "Kalamu", quartier: "Matonge", avenue: "Av. Kabambare", plotNumber: "34" },
  addressMatchesRegistration: true,
  operatorLivesHere: true,
  respondentRelationship: "Self",
  verifiedWork: "Small Commerce",
  workMatchesRegistration: true,
  verifiedHousingStatus: "TENANT",
  housingMatchesRegistration: true,
  phase1Result: "OK"
};

const P1_PARTIAL: BgcPhase1Data = {
  verifiedAddress: { city: "Kinshasa", commune: "Lemba", quartier: "Lemba", avenue: "Av. Poids Lourds", plotNumber: "18" },
  addressMatchesRegistration: true,
  operatorLivesHere: true,
  respondentRelationship: "Self",
  verifiedWork: "Small Commerce",
  workMatchesRegistration: false,  // Issue here
  verifiedHousingStatus: "TENANT",
  housingMatchesRegistration: true,
  phase1Result: "NOT_OK"
};

const P2_OK: BgcPhase2Data = {
  verifiedName: "Lukusa Bienvenu",
  nameMatchesRegistration: true,
  verifiedPhone: "+243 812 345 001",
  phoneMatchesRegistration: true,
  verifiedAddress: { city: "Kinshasa", commune: "Lingwala", quartier: "Kintambo", avenue: "Av. Kasa-Vubu", plotNumber: "12" },
  addressMatchesRegistration: true,
  verifiedWork: "Moto-Taxi",
  workMatchesRegistration: true,
  verifiedRelationship: "Father",
  relationshipMatchesRegistration: true,
  verifiedHousingStatus: "OWNER",
  housingMatchesRegistration: true,
  recommendsEvo: true,
  phase2Result: "OK"
};

const P2_PARTIAL: BgcPhase2Data = {
  verifiedName: "Ndaya Tshilombo",
  nameMatchesRegistration: true,
  verifiedPhone: "+243 812 345 006",
  phoneMatchesRegistration: true,
  verifiedAddress: { city: "Kinshasa", commune: "Lemba", quartier: "Lemba", avenue: "Av. Poids Lourds", plotNumber: "15" },  // Wrong plot number
  addressMatchesRegistration: false,
  verifiedWork: "Small Commerce",
  workMatchesRegistration: true,
  verifiedRelationship: "Uncle",
  relationshipMatchesRegistration: true,
  verifiedHousingStatus: "TENANT",
  housingMatchesRegistration: true,
  recommendsEvo: true,
  phase2Result: "NOT_OK"
};

const P3_OK: BgcPhase3Data = {
  knowsOperator: true,
  reputation: "GOOD",
  neighborsConsulted: 3,
  phase3Result: "OK"
};

const P3_GOOD: BgcPhase3Data = {
  knowsOperator: true,
  reputation: "GOOD",
  neighborsConsulted: 4,
  phase3Result: "OK"
};

export const BGC_TASKS: BgcTask[] = [
  // UNASSIGNED — task created, no agent yet
  {
    id: "bgc1", evoId: "2", evoCode: "EVO-1002", evoName: "Kabongo Mwilambwe",
    emcName: "Kinshasa Sud", emcCode: "EMC-KIN-S01", province: "Kinshasa",
    status: "NOT_YET_ASSIGNED", finalRecommendation: null,
    assignedTo: null, assignedAt: null, submittedAt: null, evaluatedBy: null, evaluatedAt: null, evaluationResult: null, evaluationNotes: null,
    phase1Complete: false, phase2Complete: false, phase3Complete: false,
    phase1Data: null, phase2Data: null, phase3Data: null,
    phase1Location: null, phase2Location: null, phase3Location: null,
    createdAt: "2026-01-10", completedAt: null
  },
  {
    id: "bgc2", evoId: "11", evoCode: "EVO-1011", evoName: "Ntumba Tshisekedi",
    emcName: "Katanga EMC", emcCode: "EMC-KAT-001", province: "Haut-Katanga",
    status: "NOT_YET_ASSIGNED", finalRecommendation: null,
    assignedTo: null, assignedAt: null, submittedAt: null, evaluatedBy: null, evaluatedAt: null, evaluationResult: null, evaluationNotes: null,
    phase1Complete: false, phase2Complete: false, phase3Complete: false,
    phase1Data: null, phase2Data: null, phase3Data: null,
    phase1Location: null, phase2Location: null, phase3Location: null,
    createdAt: "2026-02-11", completedAt: null
  },
  // ASSIGNED — AAROVE is actively working the phases
  {
    id: "bgc8", evoId: "5", evoCode: "EVO-1005", evoName: "Kasongo Mulumba",
    emcName: "Kinshasa Nord", emcCode: "EMC-KIN-N01", province: "Kinshasa",
    status: "ASSIGNED", finalRecommendation: null,
    assignedTo: "Jean-Pierre Ndinga", assignedAt: "2026-02-01T09:00:00Z", submittedAt: null, evaluatedBy: null, evaluatedAt: null, evaluationResult: null, evaluationNotes: null,
    phase1Complete: true, phase2Complete: true, phase3Complete: false,
    phase1Data: P1_OK_T, phase2Data: P2_OK, phase3Data: null,
    phase1Location: KIN_LOCATION, phase2Location: KIN_LOCATION, phase3Location: null,
    createdAt: "2026-02-01", completedAt: null
  },
  {
    id: "bgc11", evoId: "15", evoCode: "EVO-1015", evoName: "Jean-Pierre Kabila",
    emcName: "Katanga EMC", emcCode: "EMC-KAT-001", province: "Haut-Katanga",
    status: "ASSIGNED", finalRecommendation: null,
    assignedTo: "Patience Wa Mwila", assignedAt: "2026-02-10T11:30:00Z", submittedAt: null, evaluatedBy: null, evaluatedAt: null, evaluationResult: null, evaluationNotes: null,
    phase1Complete: true, phase2Complete: false, phase3Complete: false,
    phase1Data: P1_OK, phase2Data: null, phase3Data: null,
    phase1Location: LUB_LOCATION, phase2Location: null, phase3Location: null,
    createdAt: "2026-02-10", completedAt: null
  },
  // SUBMITTED — all 3 phases complete, awaiting manager decision
  {
    id: "bgc9", evoId: "6", evoCode: "EVO-1006", evoName: "Ndaya Tshilombo",
    emcName: "Kinshasa Sud", emcCode: "EMC-KIN-S01", province: "Kinshasa",
    status: "SUBMITTED", finalRecommendation: "MANUAL_REVIEW",
    assignedTo: "Jean-Pierre Ndinga", assignedAt: "2026-02-03T08:00:00Z", submittedAt: "2026-05-08T16:45:00Z", evaluatedBy: null, evaluatedAt: null, evaluationResult: null, evaluationNotes: null,
    phase1Complete: true, phase2Complete: true, phase3Complete: true,
    phase1Data: P1_PARTIAL, phase2Data: P2_PARTIAL, phase3Data: P3_OK,
    phase1Location: KIN_LOCATION, phase2Location: KIN_LOCATION, phase3Location: KIN_LOCATION,
    createdAt: "2026-02-03", completedAt: null
  },
  {
    id: "bgc12", evoId: "9", evoCode: "EVO-1009", evoName: "Balume Kalonji",
    emcName: "Kinshasa Nord", emcCode: "EMC-KIN-N01", province: "Kinshasa",
    status: "SUBMITTED", finalRecommendation: "RECOMMENDED",
    assignedTo: "Jean-Pierre Ndinga", assignedAt: "2026-05-01T07:30:00Z", submittedAt: "2026-05-08T14:20:00Z", evaluatedBy: null, evaluatedAt: null, evaluationResult: null, evaluationNotes: null,
    phase1Complete: true, phase2Complete: true, phase3Complete: true,
    phase1Data: P1_OK, phase2Data: P2_OK, phase3Data: P3_OK,
    phase1Location: KIN_LOCATION, phase2Location: KIN_LOCATION, phase3Location: KIN_LOCATION,
    createdAt: "2026-05-01", completedAt: null
  },
  {
    id: "bgc13", evoId: "20", evoCode: "EVO-1020", evoName: "Rebecca Tshomba",
    emcName: "Nord-Kivu", emcCode: "EMC-GOM-001", province: "Nord-Kivu",
    status: "SUBMITTED", finalRecommendation: "RECOMMENDED",
    assignedTo: "Ambroise Kabong", assignedAt: "2026-05-05T10:15:00Z", submittedAt: "2026-05-09T13:30:00Z", evaluatedBy: null, evaluatedAt: null, evaluationResult: null, evaluationNotes: null,
    phase1Complete: true, phase2Complete: true, phase3Complete: true,
    phase1Data: P1_OK_T, phase2Data: P2_OK, phase3Data: P3_GOOD,
    phase1Location: GOM_LOCATION, phase2Location: GOM_LOCATION, phase3Location: GOM_LOCATION,
    createdAt: "2026-05-05", completedAt: null
  },
  // APPROVED — manager signed off
  {
    id: "bgc3", evoId: "3", evoCode: "EVO-1003", evoName: "Mwamba Katanga",
    emcName: "Katanga EMC", emcCode: "EMC-KAT-001", province: "Haut-Katanga",
    status: "APPROVED", finalRecommendation: "RECOMMENDED",
    assignedTo: "Patience Wa Mwila", assignedAt: "2026-01-12T08:00:00Z", submittedAt: "2026-05-07T17:15:00Z", evaluatedBy: "Manager Mukendi", evaluatedAt: "2026-05-08T09:30:00Z", evaluationResult: "APPROVED", evaluationNotes: "All phases completed successfully. Strong community support and clean verification.",
    phase1Complete: true, phase2Complete: true, phase3Complete: true,
    phase1Data: P1_OK, phase2Data: P2_OK, phase3Data: P3_OK,
    phase1Location: LUB_LOCATION, phase2Location: LUB_LOCATION, phase3Location: LUB_LOCATION,
    createdAt: "2026-01-12", completedAt: "2026-05-08"
  },
  {
    id: "bgc4", evoId: "14", evoCode: "EVO-1014", evoName: "Mutu Kikwit",
    emcName: "Kinshasa Sud", emcCode: "EMC-KIN-S01", province: "Kinshasa",
    status: "APPROVED", finalRecommendation: "RECOMMENDED",
    assignedTo: "Jean-Pierre Ndinga", assignedAt: "2026-02-14T09:15:00Z", submittedAt: "2026-05-01T11:45:00Z", evaluatedBy: "Manager Kasongo", evaluatedAt: "2026-05-02T10:30:00Z", evaluationResult: "APPROVED", evaluationNotes: "Excellent verification across all phases. Community endorsement is strong.",
    phase1Complete: true, phase2Complete: true, phase3Complete: true,
    phase1Data: P1_OK_T, phase2Data: P2_OK, phase3Data: { knowsOperator: true, reputation: "GOOD", neighborsConsulted: 2, phase3Result: "OK" },
    phase1Location: KIN_LOCATION, phase2Location: KIN_LOCATION, phase3Location: KIN_LOCATION,
    createdAt: "2026-02-14", completedAt: "2026-05-02"
  },
  { id: "bgc10", evoId: "17", evoCode: "EVO-1017", evoName: "Esther Kalonga",     emcName: "Kinshasa Nord", emcCode: "EMC-KIN-N01", province: "Kinshasa",     status: "APPROVED",   finalRecommendation: "RECOMMENDED",   assignedTo: "Jean-Pierre Ndinga",  phase1Complete: true,  phase2Complete: true,  phase3Complete: true,  phase1Details: P1_OK,   phase2Details: P2_OK, phase3Details: { reputation: "GOOD", neighborsConsulted: 3 }, createdAt: "2026-02-12", completedAt: "2026-05-10" },
  { id: "bgc14", evoId: "1",  evoCode: "EVO-1001", evoName: "Lukusa Bienvenu",    emcName: "Kinshasa Nord", emcCode: "EMC-KIN-N01", province: "Kinshasa",     status: "APPROVED",   finalRecommendation: "RECOMMENDED",   assignedTo: "Jean-Pierre Ndinga",  phase1Complete: true,  phase2Complete: true,  phase3Complete: true,  phase1Details: P1_OK,   phase2Details: P2_OK, phase3Details: { reputation: "GOOD", neighborsConsulted: 4 }, createdAt: "2026-01-04", completedAt: "2026-01-10" },
  { id: "bgc15", evoId: "7",  evoCode: "EVO-1007", evoName: "Kalombo Kayumba",    emcName: "Katanga EMC",   emcCode: "EMC-KAT-001", province: "Haut-Katanga", status: "APPROVED",   finalRecommendation: "RECOMMENDED",   assignedTo: "Patience Wa Mwila",   phase1Complete: true,  phase2Complete: true,  phase3Complete: true,  phase1Details: P1_OK_T, phase2Details: P2_OK, phase3Details: { reputation: "GOOD", neighborsConsulted: 3 }, createdAt: "2025-11-15", completedAt: "2025-11-22" },
  { id: "bgc16", evoId: "8",  evoCode: "EVO-1008", evoName: "Tshibanda Nkole",    emcName: "Nord-Kivu",     emcCode: "EMC-GOM-001", province: "Nord-Kivu",    status: "APPROVED",   finalRecommendation: "RECOMMENDED",   assignedTo: "Ambroise Kabong",     phase1Complete: true,  phase2Complete: true,  phase3Complete: true,  phase1Details: P1_OK,   phase2Details: P2_OK, phase3Details: { reputation: "GOOD", neighborsConsulted: 2 }, createdAt: "2025-10-08", completedAt: "2025-10-15" },
  { id: "bgc17", evoId: "12", evoCode: "EVO-1012", evoName: "Kanda Luvuya",       emcName: "Nord-Kivu",     emcCode: "EMC-GOM-001", province: "Nord-Kivu",    status: "APPROVED",   finalRecommendation: "RECOMMENDED",   assignedTo: "Ambroise Kabong",     phase1Complete: true,  phase2Complete: true,  phase3Complete: true,  phase1Details: P1_OK_T, phase2Details: P2_OK, phase3Details: { reputation: "GOOD", neighborsConsulted: 3 }, createdAt: "2025-12-01", completedAt: "2025-12-08" },
  { id: "bgc18", evoId: "16", evoCode: "EVO-1016", evoName: "Grace Mbuyi",        emcName: "Nord-Kivu",     emcCode: "EMC-GOM-001", province: "Nord-Kivu",    status: "APPROVED",   finalRecommendation: "RECOMMENDED",   assignedTo: "Ambroise Kabong",     phase1Complete: true,  phase2Complete: true,  phase3Complete: true,  phase1Details: P1_OK,   phase2Details: P2_OK, phase3Details: { reputation: "GOOD", neighborsConsulted: 4 }, createdAt: "2025-11-25", completedAt: "2025-12-02" },
  // REJECTED — auto-rejected on BGC grounds
  {
    id: "bgc5", evoId: "13", evoCode: "EVO-1013", evoName: "Mbemba Nzuzi",
    emcName: "Kinshasa Nord", emcCode: "EMC-KIN-N01", province: "Kinshasa",
    status: "REJECTED", finalRecommendation: "REJECTED",
    assignedTo: "Jean-Pierre Ndinga", assignedAt: "2025-08-14T08:00:00Z", submittedAt: "2025-08-20T16:30:00Z", evaluatedBy: "Manager Nkulu", evaluatedAt: "2025-08-21T09:15:00Z", evaluationResult: "REJECTED", evaluationNotes: "Phase 2 sponsor verification failed - sponsor does not recommend EVO due to behavioral concerns.",
    phase1Complete: true, phase2Complete: true, phase3Complete: true,
    phase1Data: P1_OK, phase2Data: { ...P2_OK, recommendsEvo: false, phase2Result: "NOT_OK" }, phase3Data: { knowsOperator: true, reputation: "BAD", neighborsConsulted: 3, phase3Result: "NOT_OK" },
    phase1Location: KIN_LOCATION, phase2Location: KIN_LOCATION, phase3Location: KIN_LOCATION,
    createdAt: "2025-08-14", completedAt: "2025-08-21"
  },
  { id: "bgc5",  evoId: "13", evoCode: "EVO-1013", evoName: "Mbemba Nzuzi",       emcName: "Kinshasa Nord", emcCode: "EMC-KIN-N01", province: "Kinshasa",     status: "REJECTED",   finalRecommendation: "REJECTED",      assignedTo: "Jean-Pierre Ndinga",  phase1Complete: true,  phase2Complete: true,  phase3Complete: true,  phase1Details: { livesAtAddress: false, workVerified: false, housingStatus: "TENANT" }, phase2Details: { nameVerified: true, recommendsEvo: false, addressMatch: true }, phase3Details: { reputation: "BAD", neighborsConsulted: 3 }, createdAt: "2025-08-14", completedAt: "2025-08-20" },
  { id: "bgc19", evoId: "4",  evoCode: "EVO-1004", evoName: "Ilunga Nsenga",      emcName: "Nord-Kivu",     emcCode: "EMC-GOM-001", province: "Nord-Kivu",    status: "REJECTED",   finalRecommendation: "REJECTED",      assignedTo: "Ambroise Kabong",     phase1Complete: true,  phase2Complete: true,  phase3Complete: true,  phase1Details: { livesAtAddress: true, workVerified: false, housingStatus: "TENANT" }, phase2Details: { nameVerified: true, recommendsEvo: false, addressMatch: true }, phase3Details: { reputation: "BAD", neighborsConsulted: 2 }, createdAt: "2025-12-20", completedAt: "2025-12-28" },
  // RETURNED — sent back to AAROVE for re-verification of a specific phase
  { id: "bgc6",  evoId: "10", evoCode: "EVO-1010", evoName: "Mulamba Musasa",     emcName: "Kinshasa Sud",  emcCode: "EMC-KIN-S01", province: "Kinshasa",     status: "RETURNED",   finalRecommendation: null,            assignedTo: "Jean-Pierre Ndinga",  phase1Complete: true,  phase2Complete: false, phase3Complete: false, phase1Details: P1_OK,   phase2Details: null, phase3Details: null,                                      createdAt: "2025-09-01", completedAt: null },
];

// ─── EMC List ─────────────────────────────────────────────────────────────────

export interface EmcData {
  id: string;
  code: string;
  name: EmcZone;
  zone: string;
  capacity: number;
  activeEvos: number;
  totalAssets: number;
  manager: string;
  status: "ACTIVE" | "INACTIVE";
  operatingHours: string;
  address: string;
}

export const EMC_LIST: EmcData[] = [
  { id: "e1", code: "EMC-KIN-N01", name: "Kinshasa Nord", zone: "Zone Nord",    capacity: 40, activeEvos: 24, totalAssets: 31, manager: "Jean-Pierre Ndinga",  status: "ACTIVE", operatingHours: "06:00–21:00", address: "Av. Kasa-Vubu, Commune de Lingwala, Kinshasa" },
  { id: "e2", code: "EMC-KIN-S01", name: "Kinshasa Sud",  zone: "Zone Sud",     capacity: 35, activeEvos: 18, totalAssets: 22, manager: "Marie-Claire Tshutu", status: "ACTIVE", operatingHours: "06:00–21:00", address: "Av. Kabambare, Commune de Kalamu, Kinshasa" },
  { id: "e3", code: "EMC-KAT-001", name: "Katanga EMC",   zone: "Zone Katanga", capacity: 30, activeEvos: 15, totalAssets: 19, manager: "Patience Wa Mwila",   status: "ACTIVE", operatingHours: "06:00–20:00", address: "Av. Msiri, Commune Kampemba, Lubumbashi" },
  { id: "e4", code: "EMC-GOM-001", name: "Nord-Kivu",     zone: "Zone Est",     capacity: 25, activeEvos: 12, totalAssets: 15, manager: "Ambroise Kabong",     status: "ACTIVE", operatingHours: "06:00–20:00", address: "Av. Rond-Point, Commune de Goma, Nord-Kivu" },
];

// ─── Payment Records ──────────────────────────────────────────────────────────

export type PaymentChannel = "MPESA" | "AIRTEL_MONEY" | "ORANGE_MONEY";
export type PaymentType    = "SUBSCRIPTION" | "RENTAL";
export type PaymentStatus  = "PENDING" | "COMPLETED" | "FAILED";

export interface PaymentRecord {
  id: string;
  evoCode: string;
  evoName: string;
  emcName: EmcZone;
  paymentReference: string;
  paymentType: PaymentType;
  amount: number;
  currency: string;
  paymentChannel: PaymentChannel;
  channelReference: string;
  paymentDatetime: string;
  status: PaymentStatus;
  activationCodeGenerated: boolean;
}

export const PAYMENT_RECORDS: PaymentRecord[] = [
  // Subscription fees — one-time at onboarding
  { id: "p1",  evoCode: "EVO-1001", evoName: "Lukusa Bienvenu",    emcName: "Kinshasa Nord", paymentReference: "PAY-20260104-0041", paymentType: "SUBSCRIPTION", amount: 5,  currency: "USD", paymentChannel: "MPESA",        channelReference: "MP241040041",  paymentDatetime: "2026-01-04T08:32:00Z", status: "COMPLETED", activationCodeGenerated: false },
  { id: "p2",  evoCode: "EVO-1007", evoName: "Kalombo Kayumba",    emcName: "Katanga EMC",   paymentReference: "PAY-20251115-0019", paymentType: "SUBSCRIPTION", amount: 5,  currency: "USD", paymentChannel: "AIRTEL_MONEY",  channelReference: "AM251150019",  paymentDatetime: "2025-11-15T09:10:00Z", status: "COMPLETED", activationCodeGenerated: false },
  { id: "p3",  evoCode: "EVO-1010", evoName: "Mulamba Musasa",     emcName: "Kinshasa Sud",  paymentReference: "PAY-20250901-0007", paymentType: "SUBSCRIPTION", amount: 5,  currency: "USD", paymentChannel: "MPESA",        channelReference: "MP250910007",  paymentDatetime: "2025-09-01T07:55:00Z", status: "COMPLETED", activationCodeGenerated: false },
  { id: "p4",  evoCode: "EVO-1012", evoName: "Kanda Luvuya",       emcName: "Nord-Kivu",     paymentReference: "PAY-20251201-0023", paymentType: "SUBSCRIPTION", amount: 5,  currency: "USD", paymentChannel: "ORANGE_MONEY",  channelReference: "OM251200023",  paymentDatetime: "2025-12-01T10:20:00Z", status: "COMPLETED", activationCodeGenerated: false },
  { id: "p5",  evoCode: "EVO-1016", evoName: "Grace Mbuyi",        emcName: "Nord-Kivu",     paymentReference: "PAY-20251125-0021", paymentType: "SUBSCRIPTION", amount: 5,  currency: "USD", paymentChannel: "MPESA",        channelReference: "MP251250021",  paymentDatetime: "2025-11-25T08:45:00Z", status: "COMPLETED", activationCodeGenerated: false },
  { id: "p6",  evoCode: "EVO-1019", evoName: "Daniel Mukendi",     emcName: "Katanga EMC",   paymentReference: "PAY-20250615-0003", paymentType: "SUBSCRIPTION", amount: 5,  currency: "USD", paymentChannel: "AIRTEL_MONEY",  channelReference: "AM250650003",  paymentDatetime: "2025-06-15T07:30:00Z", status: "COMPLETED", activationCodeGenerated: false },
  { id: "p7",  evoCode: "EVO-1004", evoName: "Ilunga Nsenga",      emcName: "Nord-Kivu",     paymentReference: "PAY-20251220-0028", paymentType: "SUBSCRIPTION", amount: 5,  currency: "USD", paymentChannel: "MPESA",        channelReference: "MP251220028",  paymentDatetime: "2025-12-20T09:05:00Z", status: "COMPLETED", activationCodeGenerated: false },
  { id: "p8",  evoCode: "EVO-1005", evoName: "Kasongo Mulumba",    emcName: "Kinshasa Nord", paymentReference: "PAY-20260201-0054", paymentType: "SUBSCRIPTION", amount: 5,  currency: "USD", paymentChannel: "ORANGE_MONEY",  channelReference: "OM260200054",  paymentDatetime: "2026-02-01T08:15:00Z", status: "COMPLETED", activationCodeGenerated: false },
  { id: "p9",  evoCode: "EVO-1015", evoName: "Jean-Pierre Kabila", emcName: "Katanga EMC",   paymentReference: "PAY-20260210-0061", paymentType: "SUBSCRIPTION", amount: 5,  currency: "USD", paymentChannel: "MPESA",        channelReference: "MP260210061",  paymentDatetime: "2026-02-10T10:00:00Z", status: "COMPLETED", activationCodeGenerated: false },
  { id: "p10", evoCode: "EVO-1008", evoName: "Tshibanda Nkole",    emcName: "Nord-Kivu",     paymentReference: "PAY-20251008-0012", paymentType: "SUBSCRIPTION", amount: 8,  currency: "USD", paymentChannel: "AIRTEL_MONEY",  channelReference: "AM251080012",  paymentDatetime: "2025-10-08T09:40:00Z", status: "COMPLETED", activationCodeGenerated: false },
  // Rental payments — May 2026
  { id: "p11", evoCode: "EVO-1001", evoName: "Lukusa Bienvenu",    emcName: "Kinshasa Nord", paymentReference: "PAY-20260509-0201", paymentType: "RENTAL",       amount: 7,  currency: "USD", paymentChannel: "MPESA",        channelReference: "MP260590201",  paymentDatetime: "2026-05-09T06:05:00Z", status: "COMPLETED", activationCodeGenerated: true  },
  { id: "p12", evoCode: "EVO-1007", evoName: "Kalombo Kayumba",    emcName: "Katanga EMC",   paymentReference: "PAY-20260509-0202", paymentType: "RENTAL",       amount: 7,  currency: "USD", paymentChannel: "AIRTEL_MONEY",  channelReference: "AM260590202",  paymentDatetime: "2026-05-09T06:12:00Z", status: "COMPLETED", activationCodeGenerated: true  },
  { id: "p13", evoCode: "EVO-1010", evoName: "Mulamba Musasa",     emcName: "Kinshasa Sud",  paymentReference: "PAY-20260509-0203", paymentType: "RENTAL",       amount: 7,  currency: "USD", paymentChannel: "MPESA",        channelReference: "MP260590203",  paymentDatetime: "2026-05-09T06:18:00Z", status: "COMPLETED", activationCodeGenerated: true  },
  { id: "p14", evoCode: "EVO-1019", evoName: "Daniel Mukendi",     emcName: "Katanga EMC",   paymentReference: "PAY-20260509-0204", paymentType: "RENTAL",       amount: 7,  currency: "USD", paymentChannel: "ORANGE_MONEY",  channelReference: "OM260590204",  paymentDatetime: "2026-05-09T06:30:00Z", status: "COMPLETED", activationCodeGenerated: true  },
  { id: "p15", evoCode: "EVO-1016", evoName: "Grace Mbuyi",        emcName: "Nord-Kivu",     paymentReference: "PAY-20260508-0198", paymentType: "RENTAL",       amount: 7,  currency: "USD", paymentChannel: "MPESA",        channelReference: "MP260580198",  paymentDatetime: "2026-05-08T06:08:00Z", status: "COMPLETED", activationCodeGenerated: true  },
  { id: "p16", evoCode: "EVO-1004", evoName: "Ilunga Nsenga",      emcName: "Nord-Kivu",     paymentReference: "PAY-20260508-0199", paymentType: "RENTAL",       amount: 7,  currency: "USD", paymentChannel: "AIRTEL_MONEY",  channelReference: "AM260580199",  paymentDatetime: "2026-05-08T06:22:00Z", status: "COMPLETED", activationCodeGenerated: true  },
  { id: "p17", evoCode: "EVO-1012", evoName: "Kanda Luvuya",       emcName: "Nord-Kivu",     paymentReference: "PAY-20260507-0195", paymentType: "RENTAL",       amount: 6,  currency: "USD", paymentChannel: "MPESA",        channelReference: "MP260570195",  paymentDatetime: "2026-05-07T06:15:00Z", status: "COMPLETED", activationCodeGenerated: true  },
  { id: "p18", evoCode: "EVO-1008", evoName: "Tshibanda Nkole",    emcName: "Nord-Kivu",     paymentReference: "PAY-20260401-0141", paymentType: "RENTAL",       amount: 10, currency: "USD", paymentChannel: "ORANGE_MONEY",  channelReference: "OM260400141",  paymentDatetime: "2026-04-01T06:10:00Z", status: "COMPLETED", activationCodeGenerated: true  },
  { id: "p19", evoCode: "EVO-1005", evoName: "Kasongo Mulumba",    emcName: "Kinshasa Nord", paymentReference: "PAY-20260420-0167", paymentType: "RENTAL",       amount: 6,  currency: "USD", paymentChannel: "MPESA",        channelReference: "MP260420167",  paymentDatetime: "2026-04-20T06:05:00Z", status: "COMPLETED", activationCodeGenerated: true  },
  { id: "p20", evoCode: "EVO-1015", evoName: "Jean-Pierre Kabila", emcName: "Katanga EMC",   paymentReference: "PAY-20260428-0178", paymentType: "RENTAL",       amount: 6,  currency: "USD", paymentChannel: "AIRTEL_MONEY",  channelReference: "AM260280178",  paymentDatetime: "2026-04-28T06:20:00Z", status: "COMPLETED", activationCodeGenerated: true  },
  { id: "p21", evoCode: "EVO-1018", evoName: "Samuel Ngoy",        emcName: "Kinshasa Sud",  paymentReference: "PAY-20260314-0112", paymentType: "RENTAL",       amount: 6,  currency: "USD", paymentChannel: "MPESA",        channelReference: "MP260140112",  paymentDatetime: "2026-03-14T06:12:00Z", status: "COMPLETED", activationCodeGenerated: true  },
  { id: "p22", evoCode: "EVO-1001", evoName: "Lukusa Bienvenu",    emcName: "Kinshasa Nord", paymentReference: "PAY-20260501-0183", paymentType: "RENTAL",       amount: 7,  currency: "USD", paymentChannel: "MPESA",        channelReference: "MP260500183",  paymentDatetime: "2026-05-01T06:07:00Z", status: "COMPLETED", activationCodeGenerated: true  },
  { id: "p23", evoCode: "EVO-1010", evoName: "Mulamba Musasa",     emcName: "Kinshasa Sud",  paymentReference: "PAY-20260501-0184", paymentType: "RENTAL",       amount: 7,  currency: "USD", paymentChannel: "ORANGE_MONEY",  channelReference: "OM260500184",  paymentDatetime: "2026-05-01T06:25:00Z", status: "COMPLETED", activationCodeGenerated: true  },
  { id: "p24", evoCode: "EVO-1019", evoName: "Daniel Mukendi",     emcName: "Katanga EMC",   paymentReference: "PAY-20260501-0185", paymentType: "RENTAL",       amount: 7,  currency: "USD", paymentChannel: "AIRTEL_MONEY",  channelReference: "AM260500185",  paymentDatetime: "2026-05-01T06:35:00Z", status: "COMPLETED", activationCodeGenerated: true  },
];

// ─── EMC Centers (full spec) ──────────────────────────────────────────────────

export interface DummyEmc {
  code: string;            // e.g. "EMC-KIN-001"
  name: string;
  province: string;
  zoneCode: string;
  areaCode: string;
  address: string;
  managerName: string;
  managerPhone: string;
  operatingHours: string;  // "07:00-18:00"
  chargingCapacity: number;
  batteryInventory: number;
  isActive: boolean;
  latitude: number;
  longitude: number;
  establishedAt: string;
  legacyCode: string | null; // cross-ref to emcCode in EVO_DATA / FLEET_ASSETS
}

export const DUMMY_EMCS: DummyEmc[] = [
  { code: "EMC-KIN-001", name: "Kinshasa Nord",   province: "Kinshasa",       zoneCode: "ZONE-KIN-N01", areaCode: "AREA-00001", address: "Av. Kasa-Vubu 18, Commune de Lingwala, Kinshasa",           managerName: "Jean-Pierre Ndinga",  managerPhone: "+243 812 001 001", operatingHours: "06:00-21:00", chargingCapacity: 40, batteryInventory: 80,  isActive: true,  latitude: -4.3217,  longitude: 15.3224, establishedAt: "2023-03-15", legacyCode: "EMC-KIN-N01" },
  { code: "EMC-KIN-002", name: "Kinshasa Sud",    province: "Kinshasa",       zoneCode: "ZONE-KIN-S01", areaCode: "AREA-00002", address: "Av. Kabambare 34, Commune de Kalamu, Kinshasa",             managerName: "Marie-Claire Tshutu", managerPhone: "+243 812 001 002", operatingHours: "06:00-21:00", chargingCapacity: 35, batteryInventory: 65,  isActive: true,  latitude: -4.4419,  longitude: 15.2663, establishedAt: "2023-06-01", legacyCode: "EMC-KIN-S01" },
  { code: "EMC-LUB-001", name: "Lubumbashi",      province: "Haut-Katanga",   zoneCode: "ZONE-KAT-001", areaCode: "AREA-00003", address: "Av. Msiri 22, Commune Kampemba, Lubumbashi",               managerName: "Patience Wa Mwila",   managerPhone: "+243 812 001 003", operatingHours: "06:00-20:00", chargingCapacity: 30, batteryInventory: 55,  isActive: true,  latitude: -11.6609, longitude: 27.4794, establishedAt: "2023-09-20", legacyCode: "EMC-KAT-001" },
  { code: "EMC-GON-001", name: "Goma",            province: "Nord-Kivu",      zoneCode: "ZONE-NKV-001", areaCode: "AREA-00004", address: "Av. Keshero, Commune de Goma, Nord-Kivu",                   managerName: "Ambroise Kabong",     managerPhone: "+243 812 001 004", operatingHours: "06:00-20:00", chargingCapacity: 25, batteryInventory: 48,  isActive: true,  latitude: -1.6596,  longitude: 29.2233, establishedAt: "2024-01-10", legacyCode: "EMC-GOM-001" },
  { code: "EMC-KAS-001", name: "Mbuji-Mayi",      province: "Kasaï-Oriental", zoneCode: "ZONE-KAS-001", areaCode: "AREA-00005", address: "Av. Kasaï 11, Commune de Muya, Mbuji-Mayi",               managerName: "Alphonse Mutombo",    managerPhone: "+243 812 001 005", operatingHours: "07:00-19:00", chargingCapacity: 20, batteryInventory: 38,  isActive: true,  latitude: -6.1368,  longitude: 23.5900, establishedAt: "2024-04-05", legacyCode: null       },
  { code: "EMC-MAT-001", name: "Matadi",          province: "Kongo-Central",  zoneCode: "ZONE-MAT-001", areaCode: "AREA-00006", address: "Av. Indépendance 7, Commune de Matadi, Kongo-Central",     managerName: "Cécile Nsimba",       managerPhone: "+243 812 001 006", operatingHours: "07:00-19:00", chargingCapacity: 15, batteryInventory: 30,  isActive: false, latitude: -5.8167,  longitude: 13.4500, establishedAt: "2024-06-20", legacyCode: null       },
  { code: "EMC-MAN-001", name: "Kindu",           province: "Maniema",        zoneCode: "ZONE-MAN-001", areaCode: "AREA-00007", address: "Av. du Fleuve 3, Commune de Kindu, Maniema",               managerName: "François Kahindo",    managerPhone: "+243 812 001 007", operatingHours: "07:00-18:00", chargingCapacity: 12, batteryInventory: 24,  isActive: false, latitude: -2.9500,  longitude: 25.9167, establishedAt: "2024-09-01", legacyCode: null       },
];

// ─── EMC Batteries ────────────────────────────────────────────────────────────
// Aligned with tech spec battery_assets schema (EvFleetStatus)

export interface EmcBattery {
  id: string;
  batteryCode: string;
  legacyEmcCode: string;         // matches emcCode in FLEET_ASSETS/EVO_DATA
  compatibleEvType: "TWO_WHEELER" | "THREE_WHEELER" | "CART";
  capacityKwh: number;
  cycleCount: number;            // spec field: cycleCount
  rangeKm: number;
  status: AssetFleetStatus;      // same EvFleetStatus enum as vehicles
}

// ─── Rental Plans ─────────────────────────────────────────────────────────────
// Spec: rental_plans collection — code format SF{x}.RF{y}.RP{z}
// TCV = SF + (dailyRentalFee × 26 Mon-Sat days × months) + (sundayRentalFee × 4 Sundays × months)

export interface RentalPlan {
  code: string;                 // unique, e.g. "SF5.RF7.RP36"
  name: string;
  productCode: string;          // linked EV product
  subscriptionFee: number;      // SF — one-time joining fee
  dailyRentalFee: number;       // RF — Mon–Sat rate
  sundayRentalFee: number;      // reduced Sunday rate
  rentalPeriodMonths: number;   // RP
  totalContractValue: number;
  isActive: boolean;
}

export const RENTAL_PLANS: RentalPlan[] = [
  // 2-Wheeler plans
  { code: "SF5.RF6.RP36",  name: "E3 Standard 36M",    productCode: "ALTECH-E3-2B",   subscriptionFee: 5,  dailyRentalFee: 6,  sundayRentalFee: 4,  rentalPeriodMonths: 36, totalContractValue: 6197,  isActive: true  },
  { code: "SF5.RF7.RP36",  name: "F3 Premium 36M",     productCode: "ALTECH-F3-2B",   subscriptionFee: 5,  dailyRentalFee: 7,  sundayRentalFee: 5,  rentalPeriodMonths: 36, totalContractValue: 7277,  isActive: true  },
  { code: "SF5.RF6.RP24",  name: "E3 Short 24M",       productCode: "ALTECH-E3-2B",   subscriptionFee: 5,  dailyRentalFee: 6,  sundayRentalFee: 4,  rentalPeriodMonths: 24, totalContractValue: 4157,  isActive: true  },
  { code: "SF4.RF5.RP36",  name: "EMMO Standard 36M",  productCode: "ALTECH-EMMO-A1", subscriptionFee: 4,  dailyRentalFee: 5,  sundayRentalFee: 3,  rentalPeriodMonths: 36, totalContractValue: 5144,  isActive: true  },
  { code: "SF4.RF5.RP24",  name: "EMMO Short 24M",     productCode: "ALTECH-EMMO-A1", subscriptionFee: 4,  dailyRentalFee: 5,  sundayRentalFee: 3,  rentalPeriodMonths: 24, totalContractValue: 3464,  isActive: false },
  { code: "SF5.RF6.RP48",  name: "EPAT Extended 48M",  productCode: "ALTECH-EPAT-A1", subscriptionFee: 5,  dailyRentalFee: 6,  sundayRentalFee: 4,  rentalPeriodMonths: 48, totalContractValue: 8237,  isActive: true  },
  { code: "SF6.RF7.RP36",  name: "EPAT Premium 36M",   productCode: "ALTECH-EPAT-A1", subscriptionFee: 6,  dailyRentalFee: 7,  sundayRentalFee: 5,  rentalPeriodMonths: 36, totalContractValue: 7278,  isActive: false },
  // 3-Wheeler plans
  { code: "SF6.RF8.RP36",  name: "Tricycle T1 36M",    productCode: "ALTECH-T1-2B",   subscriptionFee: 6,  dailyRentalFee: 8,  sundayRentalFee: 6,  rentalPeriodMonths: 36, totalContractValue: 8358,  isActive: true  },
  { code: "SF6.RF9.RP36",  name: "Tricycle T2 36M",    productCode: "ALTECH-T2-2B",   subscriptionFee: 6,  dailyRentalFee: 9,  sundayRentalFee: 7,  rentalPeriodMonths: 36, totalContractValue: 9438,  isActive: true  },
  { code: "SF7.RF10.RP36", name: "Tricycle T3 36M",    productCode: "ALTECH-T3-2B",   subscriptionFee: 7,  dailyRentalFee: 10, sundayRentalFee: 8,  rentalPeriodMonths: 36, totalContractValue: 10519, isActive: true  },
  { code: "SF6.RF8.RP24",  name: "Tricycle T1 Short",  productCode: "ALTECH-T1-2B",   subscriptionFee: 6,  dailyRentalFee: 8,  sundayRentalFee: 6,  rentalPeriodMonths: 24, totalContractValue: 5638,  isActive: false },
  // Cart plans
  { code: "SF8.RF10.RP24", name: "Cart Standard 24M",  productCode: "ALTECH-ECAT-A1", subscriptionFee: 8,  dailyRentalFee: 10, sundayRentalFee: 8,  rentalPeriodMonths: 24, totalContractValue: 7016,  isActive: true  },
  { code: "SF8.RF12.RP36", name: "Cart Premium 36M",   productCode: "ALTECH-ECAT-A1", subscriptionFee: 8,  dailyRentalFee: 12, sundayRentalFee: 10, rentalPeriodMonths: 36, totalContractValue: 12536, isActive: true  },
];

// ─── Battery Assets ────────────────────────────────────────────────────────────

export const EMC_BATTERIES: EmcBattery[] = [
  { id: "b1",  batteryCode: "BAT-KIN-N01-001", legacyEmcCode: "EMC-KIN-N01", compatibleEvType: "TWO_WHEELER",   capacityKwh: 1.8, cycleCount: 120, rangeKm: 110, status: "OFF_ROAD_IDLE"   },
  { id: "b2",  batteryCode: "BAT-KIN-N01-002", legacyEmcCode: "EMC-KIN-N01", compatibleEvType: "TWO_WHEELER",   capacityKwh: 1.8, cycleCount: 244, rangeKm: 88,  status: "ON_ROAD"         },
  { id: "b3",  batteryCode: "BAT-KIN-N01-003", legacyEmcCode: "EMC-KIN-N01", compatibleEvType: "THREE_WHEELER", capacityKwh: 2.4, cycleCount: 88,  rangeKm: 120, status: "OFF_ROAD_IDLE"   },
  { id: "b4",  batteryCode: "BAT-KIN-S01-001", legacyEmcCode: "EMC-KIN-S01", compatibleEvType: "TWO_WHEELER",   capacityKwh: 1.8, cycleCount: 310, rangeKm: 72,  status: "ON_ROAD"         },
  { id: "b5",  batteryCode: "BAT-KIN-S01-002", legacyEmcCode: "EMC-KIN-S01", compatibleEvType: "CART",          capacityKwh: 3.2, cycleCount: 420, rangeKm: 55,  status: "OFF_ROAD_FAULTY" },
  { id: "b6",  batteryCode: "BAT-KAT-001-001", legacyEmcCode: "EMC-KAT-001", compatibleEvType: "TWO_WHEELER",   capacityKwh: 1.8, cycleCount: 195, rangeKm: 95,  status: "ON_ROAD"         },
  { id: "b7",  batteryCode: "BAT-KAT-001-002", legacyEmcCode: "EMC-KAT-001", compatibleEvType: "THREE_WHEELER", capacityKwh: 2.4, cycleCount: 67,  rangeKm: 125, status: "OFF_ROAD_IDLE"   },
  { id: "b8",  batteryCode: "BAT-GOM-001-001", legacyEmcCode: "EMC-GOM-001", compatibleEvType: "TWO_WHEELER",   capacityKwh: 1.8, cycleCount: 280, rangeKm: 80,  status: "ON_ROAD"         },
  { id: "b9",  batteryCode: "BAT-GOM-001-002", legacyEmcCode: "EMC-GOM-001", compatibleEvType: "CART",          capacityKwh: 3.2, cycleCount: 155, rangeKm: 100, status: "OFF_ROAD_IDLE"   },
  { id: "b10", batteryCode: "BAT-GOM-001-003", legacyEmcCode: "EMC-GOM-001", compatibleEvType: "TWO_WHEELER",   capacityKwh: 1.8, cycleCount: 380, rangeKm: 48,  status: "RETIRED_PAID_OFF" },
];

// ─── OSP Tasks ────────────────────────────────────────────────────────────────

export type OspTaskStatus = "NOT_YET_ASSIGNED" | "ASSIGNED" | "IN_TRAINING" | "CERTIFIED" | "FAILED";

export interface OspScoreCategory { label: string; awarded: number | null; max: number; }

export interface OspTask {
  id: string;
  evoCode: string;
  evoName: string;
  emcName: EmcZone;
  emcCode: string;
  evProductCode: string;
  taskStatus: OspTaskStatus;
  assignedTrainer: string | null;
  trainingDate: string | null;
  trainingLocation: string | null;
  writtenScore: number | null;
  onroadScore: number | null;
  passed: boolean | null;
  certifiedAt: string | null;
  createdAt: string;
  writtenBreakdown: OspScoreCategory[] | null;
  onroadBreakdown: OspScoreCategory[] | null;
}

// Written breakdown categories: Road Safety /30 · Customer Service /20 · Environmental /20 · Payment /30
// On-Road breakdown categories:  Technical /20 · Driving /10 · Safety /70

export const OSP_TASKS: OspTask[] = [
  { id: "osp-01", evoCode: "EVO-1001", evoName: "Lukusa Bienvenu",    emcName: "Kinshasa Nord", emcCode: "EMC-KIN-N01", evProductCode: "ALTECH-F3-2B",   taskStatus: "CERTIFIED",        assignedTrainer: "Félicité Mbuyi",    trainingDate: "2026-01-20", trainingLocation: "EMC Kinshasa Nord — Salle A", writtenScore: 88, onroadScore: 78, passed: true,  certifiedAt: "2026-01-20", createdAt: "2026-01-15", writtenBreakdown: [{ label: "Road Safety",       awarded: 26, max: 30 }, { label: "Customer Service", awarded: 18, max: 20 }, { label: "Environmental", awarded: 18, max: 20 }, { label: "Payment", awarded: 26, max: 30 }], onroadBreakdown: [{ label: "Technical", awarded: 15, max: 20 }, { label: "Driving", awarded: 8, max: 10 }, { label: "Safety", awarded: 55, max: 70 }] },
  { id: "osp-02", evoCode: "EVO-1003", evoName: "Mwamba Katanga",     emcName: "Katanga EMC",   emcCode: "EMC-KAT-001", evProductCode: "ALTECH-ECAT-A1", taskStatus: "IN_TRAINING",      assignedTrainer: "Grégoire Kabamba", trainingDate: "2026-02-05", trainingLocation: "EMC Katanga — Salle B",       writtenScore: 88, onroadScore: 43, passed: false, certifiedAt: null,         createdAt: "2026-01-28", writtenBreakdown: [{ label: "Road Safety",       awarded: 26, max: 30 }, { label: "Customer Service", awarded: 18, max: 20 }, { label: "Environmental", awarded: 18, max: 20 }, { label: "Payment", awarded: 26, max: 30 }], onroadBreakdown: [{ label: "Technical", awarded: 14, max: 20 }, { label: "Driving", awarded: 7,  max: 10 }, { label: "Safety", awarded: 22, max: 70 }] },
  { id: "osp-03", evoCode: "EVO-1005", evoName: "Kasongo Mulumba",    emcName: "Kinshasa Nord", emcCode: "EMC-KIN-N01", evProductCode: "ALTECH-E3-2B",   taskStatus: "CERTIFIED",        assignedTrainer: "Félicité Mbuyi",    trainingDate: "2026-02-15", trainingLocation: "EMC Kinshasa Nord — Salle A", writtenScore: 75, onroadScore: 70, passed: true,  certifiedAt: "2026-02-15", createdAt: "2026-02-08", writtenBreakdown: [{ label: "Road Safety",       awarded: 22, max: 30 }, { label: "Customer Service", awarded: 15, max: 20 }, { label: "Environmental", awarded: 15, max: 20 }, { label: "Payment", awarded: 23, max: 30 }], onroadBreakdown: [{ label: "Technical", awarded: 13, max: 20 }, { label: "Driving", awarded: 7,  max: 10 }, { label: "Safety", awarded: 50, max: 70 }] },
  { id: "osp-04", evoCode: "EVO-1006", evoName: "Ndaya Tshilombo",    emcName: "Kinshasa Sud",  emcCode: "EMC-KIN-S01", evProductCode: "ALTECH-T1-2B",   taskStatus: "CERTIFIED",        assignedTrainer: "Félicité Mbuyi",    trainingDate: "2026-02-18", trainingLocation: "EMC Kinshasa Sud — Salle C",  writtenScore: 83, onroadScore: 79, passed: true,  certifiedAt: "2026-02-18", createdAt: "2026-02-10", writtenBreakdown: [{ label: "Road Safety",       awarded: 24, max: 30 }, { label: "Customer Service", awarded: 17, max: 20 }, { label: "Environmental", awarded: 17, max: 20 }, { label: "Payment", awarded: 25, max: 30 }], onroadBreakdown: [{ label: "Technical", awarded: 15, max: 20 }, { label: "Driving", awarded: 8,  max: 10 }, { label: "Safety", awarded: 56, max: 70 }] },
  { id: "osp-05", evoCode: "EVO-1007", evoName: "Kalombo Kayumba",    emcName: "Katanga EMC",   emcCode: "EMC-KAT-001", evProductCode: "ALTECH-F3-2B",   taskStatus: "CERTIFIED",        assignedTrainer: "Grégoire Kabamba", trainingDate: "2025-12-01", trainingLocation: "EMC Katanga — Salle A",       writtenScore: 91, onroadScore: 85, passed: true,  certifiedAt: "2025-12-01", createdAt: "2025-11-24", writtenBreakdown: [{ label: "Road Safety",       awarded: 28, max: 30 }, { label: "Customer Service", awarded: 19, max: 20 }, { label: "Environmental", awarded: 19, max: 20 }, { label: "Payment", awarded: 25, max: 30 }], onroadBreakdown: [{ label: "Technical", awarded: 17, max: 20 }, { label: "Driving", awarded: 9,  max: 10 }, { label: "Safety", awarded: 59, max: 70 }] },
  { id: "osp-06", evoCode: "EVO-1008", evoName: "Tshibanda Nkole",    emcName: "Nord-Kivu",     emcCode: "EMC-GOM-001", evProductCode: "ALTECH-ECAT-A1", taskStatus: "CERTIFIED",        assignedTrainer: "Ambroise Kabong",  trainingDate: "2025-11-01", trainingLocation: "EMC Goma — Salle B",          writtenScore: 76, onroadScore: 70, passed: true,  certifiedAt: "2025-11-01", createdAt: "2025-10-24", writtenBreakdown: [{ label: "Road Safety",       awarded: 22, max: 30 }, { label: "Customer Service", awarded: 16, max: 20 }, { label: "Environmental", awarded: 15, max: 20 }, { label: "Payment", awarded: 23, max: 30 }], onroadBreakdown: [{ label: "Technical", awarded: 14, max: 20 }, { label: "Driving", awarded: 7,  max: 10 }, { label: "Safety", awarded: 49, max: 70 }] },
  { id: "osp-07", evoCode: "EVO-1009", evoName: "Balume Kalonji",     emcName: "Kinshasa Nord", emcCode: "EMC-KIN-N01", evProductCode: "ALTECH-E3-2B",   taskStatus: "CERTIFIED",        assignedTrainer: "Félicité Mbuyi",    trainingDate: "2026-02-25", trainingLocation: "EMC Kinshasa Nord — Salle A", writtenScore: 80, onroadScore: 74, passed: true,  certifiedAt: "2026-02-25", createdAt: "2026-02-18", writtenBreakdown: [{ label: "Road Safety",       awarded: 24, max: 30 }, { label: "Customer Service", awarded: 16, max: 20 }, { label: "Environmental", awarded: 16, max: 20 }, { label: "Payment", awarded: 24, max: 30 }], onroadBreakdown: [{ label: "Technical", awarded: 14, max: 20 }, { label: "Driving", awarded: 8,  max: 10 }, { label: "Safety", awarded: 52, max: 70 }] },
  { id: "osp-08", evoCode: "EVO-1010", evoName: "Mulamba Musasa",     emcName: "Kinshasa Sud",  emcCode: "EMC-KIN-S01", evProductCode: "ALTECH-F3-2B",   taskStatus: "CERTIFIED",        assignedTrainer: "Félicité Mbuyi",    trainingDate: "2025-09-15", trainingLocation: "EMC Kinshasa Sud — Salle A",  writtenScore: 94, onroadScore: 90, passed: true,  certifiedAt: "2025-09-15", createdAt: "2025-09-08", writtenBreakdown: [{ label: "Road Safety",       awarded: 29, max: 30 }, { label: "Customer Service", awarded: 19, max: 20 }, { label: "Environmental", awarded: 19, max: 20 }, { label: "Payment", awarded: 27, max: 30 }], onroadBreakdown: [{ label: "Technical", awarded: 19, max: 20 }, { label: "Driving", awarded: 9,  max: 10 }, { label: "Safety", awarded: 62, max: 70 }] },
  { id: "osp-09", evoCode: "EVO-1012", evoName: "Kanda Luvuya",       emcName: "Nord-Kivu",     emcCode: "EMC-GOM-001", evProductCode: "ALTECH-E3-2B",   taskStatus: "CERTIFIED",        assignedTrainer: "Ambroise Kabong",  trainingDate: "2025-12-20", trainingLocation: "EMC Goma — Salle A",          writtenScore: 78, onroadScore: 72, passed: true,  certifiedAt: "2025-12-20", createdAt: "2025-12-13", writtenBreakdown: [{ label: "Road Safety",       awarded: 23, max: 30 }, { label: "Customer Service", awarded: 16, max: 20 }, { label: "Environmental", awarded: 16, max: 20 }, { label: "Payment", awarded: 23, max: 30 }], onroadBreakdown: [{ label: "Technical", awarded: 14, max: 20 }, { label: "Driving", awarded: 7,  max: 10 }, { label: "Safety", awarded: 51, max: 70 }] },
  { id: "osp-10", evoCode: "EVO-1014", evoName: "Mutu Kikwit",        emcName: "Kinshasa Sud",  emcCode: "EMC-KIN-S01", evProductCode: "ALTECH-F3-2B",   taskStatus: "NOT_YET_ASSIGNED", assignedTrainer: null,               trainingDate: null,         trainingLocation: null,                          writtenScore: null, onroadScore: null, passed: null, certifiedAt: null, createdAt: "2026-02-20", writtenBreakdown: null, onroadBreakdown: null },
  { id: "osp-11", evoCode: "EVO-1015", evoName: "Jean-Pierre Kabila", emcName: "Katanga EMC",   emcCode: "EMC-KAT-001", evProductCode: "ALTECH-E3-2B",   taskStatus: "CERTIFIED",        assignedTrainer: "Grégoire Kabamba", trainingDate: "2026-02-28", trainingLocation: "EMC Katanga — Salle A",       writtenScore: 72, onroadScore: 71, passed: true,  certifiedAt: "2026-02-28", createdAt: "2026-02-20", writtenBreakdown: [{ label: "Road Safety",       awarded: 21, max: 30 }, { label: "Customer Service", awarded: 15, max: 20 }, { label: "Environmental", awarded: 14, max: 20 }, { label: "Payment", awarded: 22, max: 30 }], onroadBreakdown: [{ label: "Technical", awarded: 13, max: 20 }, { label: "Driving", awarded: 8,  max: 10 }, { label: "Safety", awarded: 50, max: 70 }] },
  { id: "osp-12", evoCode: "EVO-1016", evoName: "Grace Mbuyi",        emcName: "Nord-Kivu",     emcCode: "EMC-GOM-001", evProductCode: "ALTECH-F3-2B",   taskStatus: "CERTIFIED",        assignedTrainer: "Ambroise Kabong",  trainingDate: "2025-12-15", trainingLocation: "EMC Goma — Salle B",          writtenScore: 86, onroadScore: 80, passed: true,  certifiedAt: "2025-12-15", createdAt: "2025-12-08", writtenBreakdown: [{ label: "Road Safety",       awarded: 25, max: 30 }, { label: "Customer Service", awarded: 18, max: 20 }, { label: "Environmental", awarded: 17, max: 20 }, { label: "Payment", awarded: 26, max: 30 }], onroadBreakdown: [{ label: "Technical", awarded: 16, max: 20 }, { label: "Driving", awarded: 8,  max: 10 }, { label: "Safety", awarded: 56, max: 70 }] },
  { id: "osp-13", evoCode: "EVO-1017", evoName: "Esther Kalonga",     emcName: "Kinshasa Nord", emcCode: "EMC-KIN-N01", evProductCode: "ALTECH-T1-2B",   taskStatus: "CERTIFIED",        assignedTrainer: "Félicité Mbuyi",    trainingDate: "2026-02-25", trainingLocation: "EMC Kinshasa Nord — Salle B", writtenScore: 79, onroadScore: 73, passed: true,  certifiedAt: "2026-02-25", createdAt: "2026-02-18", writtenBreakdown: [{ label: "Road Safety",       awarded: 24, max: 30 }, { label: "Customer Service", awarded: 16, max: 20 }, { label: "Environmental", awarded: 15, max: 20 }, { label: "Payment", awarded: 24, max: 30 }], onroadBreakdown: [{ label: "Technical", awarded: 14, max: 20 }, { label: "Driving", awarded: 7,  max: 10 }, { label: "Safety", awarded: 52, max: 70 }] },
  { id: "osp-14", evoCode: "EVO-1018", evoName: "Samuel Ngoy",        emcName: "Kinshasa Sud",  emcCode: "EMC-KIN-S01", evProductCode: "ALTECH-E3-2B",   taskStatus: "CERTIFIED",        assignedTrainer: "Félicité Mbuyi",    trainingDate: "2025-08-20", trainingLocation: "EMC Kinshasa Sud — Salle B",  writtenScore: 70, onroadScore: 70, passed: true,  certifiedAt: "2025-08-20", createdAt: "2025-08-14", writtenBreakdown: [{ label: "Road Safety",       awarded: 21, max: 30 }, { label: "Customer Service", awarded: 14, max: 20 }, { label: "Environmental", awarded: 14, max: 20 }, { label: "Payment", awarded: 21, max: 30 }], onroadBreakdown: [{ label: "Technical", awarded: 13, max: 20 }, { label: "Driving", awarded: 8,  max: 10 }, { label: "Safety", awarded: 49, max: 70 }] },
  { id: "osp-15", evoCode: "EVO-1019", evoName: "Daniel Mukendi",     emcName: "Katanga EMC",   emcCode: "EMC-KAT-001", evProductCode: "ALTECH-F3-2B",   taskStatus: "CERTIFIED",        assignedTrainer: "Grégoire Kabamba", trainingDate: "2025-07-01", trainingLocation: "EMC Katanga — Salle A",       writtenScore: 96, onroadScore: 88, passed: true,  certifiedAt: "2025-07-01", createdAt: "2025-06-24", writtenBreakdown: [{ label: "Road Safety",       awarded: 29, max: 30 }, { label: "Customer Service", awarded: 20, max: 20 }, { label: "Environmental", awarded: 19, max: 20 }, { label: "Payment", awarded: 28, max: 30 }], onroadBreakdown: [{ label: "Technical", awarded: 18, max: 20 }, { label: "Driving", awarded: 9,  max: 10 }, { label: "Safety", awarded: 61, max: 70 }] },
  { id: "osp-16", evoCode: "EVO-1020", evoName: "Rebecca Tshomba",    emcName: "Nord-Kivu",     emcCode: "EMC-GOM-001", evProductCode: "ALTECH-ECAT-A1", taskStatus: "CERTIFIED",        assignedTrainer: "Ambroise Kabong",  trainingDate: "2026-02-28", trainingLocation: "EMC Goma — Salle A",          writtenScore: 77, onroadScore: 70, passed: true,  certifiedAt: "2026-02-28", createdAt: "2026-02-21", writtenBreakdown: [{ label: "Road Safety",       awarded: 23, max: 30 }, { label: "Customer Service", awarded: 16, max: 20 }, { label: "Environmental", awarded: 15, max: 20 }, { label: "Payment", awarded: 23, max: 30 }], onroadBreakdown: [{ label: "Technical", awarded: 14, max: 20 }, { label: "Driving", awarded: 7,  max: 10 }, { label: "Safety", awarded: 49, max: 70 }] },
];
