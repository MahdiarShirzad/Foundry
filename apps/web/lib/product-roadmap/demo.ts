import type {
  Initiative,
  Milestone,
  PlanningNote,
  Release,
  RoadmapProduct,
} from "./types";

import { ROADMAP_PRODUCTS } from "./types";

export const DEMO_ROADMAP_PRODUCTS = [...ROADMAP_PRODUCTS];

export const DEMO_INITIATIVES: Initiative[] = [
  {
    id: "i-001",
    productId: "helio-notes",
    name: "Unified decision capture",
    description: "One-tap capture with context across devices.",
    objective: "Reduce time to record a decision to under 10 seconds.",
    userProblem: "Decisions are scattered across chat and notes.",
    priority: "Critical",
    status: "In Progress",
    period: "Now",
    relatedFeatures: ["Decision capture form", "Quick-add button"],
    dependencies: ["Timeline view"],
    associatedMilestoneId: "m-001",
    rationale: "Capturing decisions is the core value of the product.",
  },
  {
    id: "i-002",
    productId: "helio-notes",
    name: "Decision timeline",
    description: "Chronological browsing of captured decisions.",
    objective: "Make past decisions scannable by date and tag.",
    userProblem: "Scrolling long history is slow.",
    priority: "High",
    status: "Planned",
    period: "Next",
    relatedFeatures: ["Timeline list", "Date grouping"],
    dependencies: ["Unified decision capture"],
    associatedMilestoneId: "m-002",
    rationale: "Recall only works if decisions are easy to find.",
  },
  {
    id: "i-003",
    productId: "helio-notes",
    name: "Keyword recall",
    description: "Search decisions by keyword.",
    objective: "Surface specific decisions without scrolling.",
    userProblem: "Timeline grows faster than it can be scanned.",
    priority: "Medium",
    status: "Proposed",
    period: "Later",
    relatedFeatures: ["Search bar", "Filtered results"],
    dependencies: ["Decision timeline"],
    associatedMilestoneId: undefined,
    rationale: "Important but secondary to the core capture flow.",
  },
  {
    id: "i-004",
    productId: "atlas-scout",
    name: "Criteria-based shortlisting",
    description: "Build shortlists from saved criteria.",
    objective: "Help first-time founders qualify prospects consistently.",
    userProblem: "Manual qualification is slow and inconsistent.",
    priority: "Critical",
    status: "Planned",
    period: "Now",
    relatedFeatures: ["Criteria form", "Shortlist list"],
    dependencies: [],
    associatedMilestoneId: "m-003",
    rationale: "The main selling point of Atlas Scout.",
  },
  {
    id: "i-005",
    productId: "atlas-scout",
    name: "Prospect export",
    description: "Export shortlists to CSV.",
    objective: "Let founders share lists with their tools.",
    userProblem: "Shortlists are trapped in the product.",
    priority: "Low",
    status: "On Hold",
    period: "Later",
    relatedFeatures: [],
    dependencies: ["Criteria-based shortlisting"],
    associatedMilestoneId: undefined,
    rationale: "Nice to have after core workflow is proven.",
  },
];

export const DEMO_RELEASES: Release[] = [
  {
    id: "r-001",
    productId: "helio-notes",
    name: "MVP release",
    version: "0.1.0",
    purpose: "Core capture and timeline flow.",
    plannedDate: "2027-01-15",
    initiativeIds: ["i-001", "i-002"],
    status: "Planned",
    notesPreview: "Ship capture first; timeline follows quickly.",
  },
  {
    id: "r-002",
    productId: "atlas-scout",
    name: "Beta shortlist",
    version: "0.2.0",
    purpose: "Criteria-based shortlisting for beta users.",
    plannedDate: "2027-03-01",
    initiativeIds: ["i-004"],
    status: "Proposed",
    notesPreview: "Limited to first 10 beta founders.",
  },
];

export const DEMO_MILESTONES: Milestone[] = [
  {
    id: "m-001",
    productId: "helio-notes",
    name: "First decision captured",
    description: "Prove the capture flow works end to end.",
    targetDate: "2026-12-01",
    initiativeIds: ["i-001"],
    status: "In Progress",
  },
  {
    id: "m-002",
    productId: "helio-notes",
    name: "Timeline available",
    description: "Users can browse decisions by date.",
    targetDate: "2027-01-10",
    initiativeIds: ["i-002"],
    status: "Planned",
  },
  {
    id: "m-003",
    productId: "atlas-scout",
    name: "First qualified shortlist",
    description: "A founder builds a shortlist using criteria.",
    targetDate: "2027-02-01",
    initiativeIds: ["i-004"],
    status: "Planned",
  },
];

export const DEMO_PLANNING_NOTES: PlanningNote[] = [
  {
    id: "n-001",
    productId: "helio-notes",
    title: "Capture before timeline",
    summary: "Ship the capture flow before adding timeline features.",
    relatedItemId: "i-001",
    period: "Now",
    date: "2026-10-20",
    category: "Trade-off",
  },
  {
    id: "n-002",
    productId: "helio-notes",
    title: "Recall is secondary",
    summary: "Focus on capture quality before search.",
    relatedItemId: "i-003",
    period: "Later",
    date: "2026-10-22",
    category: "Strategic Decision",
  },
  {
    id: "n-003",
    productId: "atlas-scout",
    title: "Export deferred",
    summary: "CSV export moved to later; beta doesn't need it.",
    relatedItemId: "i-005",
    period: "Later",
    date: "2026-10-25",
    category: "Dependency",
  },
];

export function getRoadmapProduct(id: string): RoadmapProduct {
  return DEMO_ROADMAP_PRODUCTS.find((p) => p.id === id) ?? DEMO_ROADMAP_PRODUCTS[0];
}

export function getInitiativesForProduct(id: string): Initiative[] {
  return DEMO_INITIATIVES.filter((i) => i.productId === id);
}

export function getReleasesForProduct(id: string): Release[] {
  return DEMO_RELEASES.filter((r) => r.productId === id);
}

export function getMilestonesForProduct(id: string): Milestone[] {
  return DEMO_MILESTONES.filter((m) => m.productId === id);
}

export function getNotesForProduct(id: string): PlanningNote[] {
  return DEMO_PLANNING_NOTES.filter((n) => n.productId === id);
}
