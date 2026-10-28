/** Presentation types for the MVP Studio workspace. */

export const MVP_PROJECTS = [
  {
    id: "helio-notes",
    name: "Helio Notes",
    ref: "MVP-001",
    concept: "A lightweight decision log for knowledge workers.",
    targetAudience: "Product and ops teams",
    problem: "Decisions get lost across meetings and chat.",
    valueProp: "Capture decisions in seconds and recall them without digging.",
    mvpObjective: "Ship a focused decision capture and recall flow.",
    currentScope: "Core capture, timeline, and recall.",
  },
  {
    id: "atlas-scout",
    name: "Atlas Scout",
    ref: "MVP-002",
    concept: "A focused shortlist builder for early B2B outreach.",
    targetAudience: "Founders doing first sales",
    problem: "Building a qualified shortlist is slow and manual.",
    valueProp: "Go from criteria to a shortlist faster with less spreadsheet work.",
    mvpObjective: "Ship criteria-based shortlist building with a simple list view.",
    currentScope: "Criteria form, shortlist list, export to share.",
  },
] as const;

export type MVPProject = (typeof MVP_PROJECTS)[number];

export const FEATURE_PRIORITIES = ["Critical", "High", "Medium", "Low"] as const;
export type FeaturePriority = (typeof FEATURE_PRIORITIES)[number];

export const FEATURE_SCOPE = ["Must Have", "Should Have", "Could Have", "Out of Scope"] as const;
export type FeatureScope = (typeof FEATURE_SCOPE)[number];

export const FEATURE_STATUSES = ["Proposed", "Ready", "In Progress", "Completed", "Deferred"] as const;
export type FeatureStatus = (typeof FEATURE_STATUSES)[number];

export type Feature = {
  id: string;
  projectId: (typeof MVP_PROJECTS)[number]["id"];
  name: string;
  description: string;
  userProblem: string;
  targetUser: string;
  priority: FeaturePriority;
  scope: FeatureScope;
  status: FeatureStatus;
  userStory: string;
  acceptanceCriteria: string[];
  behavior: string;
  edgeCases: string[];
  dependencies: string[];
  openQuestions: string[];
  designNotes: string;
};

export const MVP_SECTIONS = ["Overview", "Feature Backlog", "MVP Scope", "Specifications", "Build Progress"] as const;
export type MVPSection = (typeof MVP_SECTIONS)[number];

export type MVPScopeItem = {
  id: string;
  projectId: (typeof MVP_PROJECTS)[number]["id"];
  name: string;
  category: "included" | "later" | "excluded";
  explanation: string;
  status: "planned" | "confirmed" | "under review";
};
