/** Presentation types for the Product Roadmap workspace. */

export const ROADMAP_PRODUCTS = [
  {
    id: "helio-notes",
    name: "Helio Notes",
    ref: "RM-001",
    direction: "Help knowledge workers capture and recall decisions effortlessly.",
    horizon: "Q4 2026 — Q2 2027",
  },
  {
    id: "atlas-scout",
    name: "Atlas Scout",
    ref: "RM-002",
    direction: "Shortlist qualified B2B prospects faster with less manual effort.",
    horizon: "Q1 2027 — Q3 2027",
  },
] as const;

export type RoadmapProduct = (typeof ROADMAP_PRODUCTS)[number];

export const PLANNING_PERIODS = ["Now", "Next", "Later"] as const;
export type PlanningPeriod = (typeof PLANNING_PERIODS)[number];

export const ROADMAP_STATUSES = ["Proposed", "Planned", "In Progress", "Completed", "On Hold"] as const;
export type RoadmapStatus = (typeof ROADMAP_STATUSES)[number];

export const ROADMAP_PRIORITIES = ["Critical", "High", "Medium", "Low"] as const;
export type RoadmapPriority = (typeof ROADMAP_PRIORITIES)[number];

export const NOTE_CATEGORIES = [
  "Strategic Decision",
  "Trade-off",
  "Dependency",
  "Open Question",
  "Release Consideration",
] as const;
export type NoteCategory = (typeof NOTE_CATEGORIES)[number];

export type Initiative = {
  id: string;
  productId: (typeof ROADMAP_PRODUCTS)[number]["id"];
  name: string;
  description: string;
  objective: string;
  userProblem: string;
  priority: RoadmapPriority;
  status: RoadmapStatus;
  period: PlanningPeriod;
  relatedFeatures: string[];
  dependencies: string[];
  associatedMilestoneId?: string;
  rationale: string;
};

export type Release = {
  id: string;
  productId: (typeof ROADMAP_PRODUCTS)[number]["id"];
  name: string;
  version: string;
  purpose: string;
  plannedDate: string;
  initiativeIds: string[];
  status: RoadmapStatus;
  notesPreview: string;
};

export type Milestone = {
  id: string;
  productId: (typeof ROADMAP_PRODUCTS)[number]["id"];
  name: string;
  description: string;
  targetDate: string;
  initiativeIds: string[];
  status: RoadmapStatus;
};

export type PlanningNote = {
  id: string;
  productId: (typeof ROADMAP_PRODUCTS)[number]["id"];
  title: string;
  summary: string;
  relatedItemId: string | null;
  period: PlanningPeriod;
  date: string;
  category: NoteCategory;
};

export const ROADMAP_SECTIONS = ["Roadmap", "Initiatives", "Releases & Milestones", "Priorities", "Planning Notes"] as const;
export type RoadmapSection = (typeof ROADMAP_SECTIONS)[number];

export type RoadmapView = "timeline" | "list";
