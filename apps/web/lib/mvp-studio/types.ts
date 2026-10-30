/** Presentation types for the MVP Studio workspace. UI labels and mock data only. */

export type MVPProjectId = "helio-notes" | "atlas-scout";

export type MVPStructure = {
  areas: { id: string; name: string; blurb: string }[];
  journey: { step: string; note: string }[];
};

export type MVPProject = {
  id: MVPProjectId;
  name: string;
  ref: string;
  status: string;
  concept: string;
  problem: string;
  targetAudience: string;
  valueProp: string;
  mvpObjective: string;
  currentScope: string;
  essentialCapabilities: string[];
  explicitExclusions: string[];
  successCriteria: string[];
  structure: MVPStructure;
  openDecisions: string[];
};

export const MVP_PROJECTS: MVPProject[] = [
  {
    id: "helio-notes",
    name: "Helio Notes",
    ref: "MVP-001",
    status: "In build",
    concept: "A lightweight decision log for knowledge workers.",
    problem:
      "Decisions get lost across meetings and chat threads, so teams keep re-litigating choices they already made.",
    targetAudience: "Product and operations teams of 5–50 people",
    valueProp: "Capture a decision in seconds and recall it later without digging through chat history.",
    mvpObjective:
      "Ship a focused capture → timeline → recall loop that a new team can adopt in a single afternoon.",
    currentScope:
      "Capture, timeline, detail view and keyword recall. Team spaces, integrations and digests stay out of the first release.",
    essentialCapabilities: [
      "Capture a decision with meeting context",
      "Browse a chronological decision timeline",
      "Open a decision detail view with history",
    ],
    explicitExclusions: [
      "Shared team spaces",
      "Slack capture integration",
      "Weekly digest email",
    ],
    successCriteria: [
      "A new workspace captures 10 decisions in its first session",
      "Recalling a past decision takes under 15 seconds",
    ],
    structure: {
      areas: [
        { id: "capture", name: "Capture", blurb: "How decisions enter the product." },
        { id: "timeline", name: "Timeline", blurb: "How decisions are browsed." },
        { id: "recall", name: "Recall", blurb: "How decisions are found again." },
      ],
      journey: [
        { step: "Open workspace", note: "Entry point" },
        { step: "Capture a decision", note: "Primary action" },
        { step: "Scan the timeline", note: "Orientation" },
        { step: "Recall when needed", note: "Primary value" },
      ],
    },
    openDecisions: [
      "Should capture be global or scoped to a single project?",
      "Is keyword recall enough, or does the first version need full-text search?",
      "Do decision templates ship in v1 or wait for the second release?",
    ],
  },
  {
    id: "atlas-scout",
    name: "Atlas Scout",
    ref: "MVP-002",
    status: "Scoping",
    concept: "A focused shortlist builder for early B2B outreach.",
    problem:
      "Building a qualified shortlist is slow, manual spreadsheet work that founders abandon halfway through.",
    targetAudience: "Founders doing their own first sales outreach",
    valueProp: "Go from written criteria to a shareable shortlist without maintaining a spreadsheet.",
    mvpObjective:
      "Ship criteria-based shortlist building with a reviewable list view and a simple share link.",
    currentScope:
      "Criteria form, shortlist list and a shareable view. Exports, scoring and CRM sync are held back.",
    essentialCapabilities: [
      "Define and reuse a shortlist criteria set",
      "Review prospects in a single shortlist view",
      "Share a read-only shortlist with a teammate",
    ],
    explicitExclusions: ["CRM integration", "Automated lead scoring", "Bulk data enrichment"],
    successCriteria: [
      "A founder builds a 20-prospect shortlist in under 10 minutes",
      "The shortlist is shareable without an account",
    ],
    structure: {
      areas: [
        { id: "criteria", name: "Criteria", blurb: "How a qualified prospect is defined." },
        { id: "shortlist", name: "Shortlist", blurb: "Where prospects are reviewed." },
        { id: "share", name: "Share", blurb: "How the list leaves the product." },
      ],
      journey: [
        { step: "Write criteria", note: "Entry point" },
        { step: "Build the shortlist", note: "Primary action" },
        { step: "Review prospects", note: "Orientation" },
        { step: "Share the list", note: "Primary value" },
      ],
    },
    openDecisions: [
      "Does the first version enrich prospects automatically or stay manual?",
      "Is a share link enough, or do collaborators need edit access?",
      "Which export format matters first — CSV or copyable table?",
    ],
  },
];

export type MVPProjectPatch = Partial<
  Pick<
    MVPProject,
    | "problem"
    | "targetAudience"
    | "valueProp"
    | "mvpObjective"
    | "essentialCapabilities"
    | "explicitExclusions"
    | "successCriteria"
  >
>;

export const FEATURE_PRIORITIES = ["Critical", "High", "Medium", "Low"] as const;
export type FeaturePriority = (typeof FEATURE_PRIORITIES)[number];

export const FEATURE_SCOPE = ["Must Have", "Should Have", "Could Have", "Out of Scope"] as const;
export type FeatureScope = (typeof FEATURE_SCOPE)[number];

export const FEATURE_STATUSES = [
  "Proposed",
  "Ready",
  "In Progress",
  "Completed",
  "Deferred",
] as const;
export type FeatureStatus = (typeof FEATURE_STATUSES)[number];

/** Board columns are UI labels derived from status — not a real workflow engine. */
export const BUILD_COLUMNS = [
  { key: "not-started", title: "Not yet started", status: "Proposed" },
  { key: "ready", title: "Ready for development", status: "Ready" },
  { key: "in-progress", title: "In progress", status: "In Progress" },
  { key: "completed", title: "Completed", status: "Completed" },
  { key: "blocked", title: "Blocked / deferred", status: "Deferred" },
] as const;

export type Feature = {
  id: string;
  projectId: MVPProjectId;
  name: string;
  description: string;
  userProblem: string;
  targetUser: string;
  area: string;
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

export type FeatureDraft = Pick<
  Feature,
  | "name"
  | "description"
  | "userProblem"
  | "targetUser"
  | "priority"
  | "scope"
  | "userStory"
  | "acceptanceCriteria"
>;

export const MVP_SECTIONS = [
  "Overview",
  "Feature Backlog",
  "MVP Scope",
  "Specifications",
  "Build Progress",
] as const;
export type MVPSection = (typeof MVP_SECTIONS)[number];

/** Workspace preview states — presentational examples for a future integration. */
export const MVP_VIEWS = [
  { value: "ready", label: "Ready" },
  { value: "loading", label: "Loading" },
  { value: "error", label: "Error" },
  { value: "empty", label: "Empty" },
] as const;
export type MVPView = (typeof MVP_VIEWS)[number]["value"];

export type ScopeCategory = "included" | "later" | "excluded";

export const SCOPE_CATEGORIES: readonly {
  value: ScopeCategory;
  label: string;
  shortLabel: string;
}[] = [
  { value: "included", label: "Included in MVP", shortLabel: "Included" },
  { value: "later", label: "Planned for later", shortLabel: "Later" },
  { value: "excluded", label: "Explicitly excluded", shortLabel: "Excluded" },
];

/**
 * A scope line item. Features carry their own scope classification, so most
 * items are derived from the backlog; `scope extras` cover capabilities that
 * never became backlog entries.
 */
export type ScopeItem = {
  id: string;
  projectId: MVPProjectId;
  name: string;
  explanation: string;
  category: ScopeCategory;
  status: string;
  /** Present when the item mirrors a backlog feature, so both stay in sync. */
  featureId?: string;
};

/** Scope classification → column. Local presentation mapping only. */
export function scopeCategoryOf(scope: FeatureScope): ScopeCategory {
  if (scope === "Must Have") return "included";
  if (scope === "Out of Scope") return "excluded";
  return "later";
}

export const SCOPE_TO_FEATURE_SCOPE: Record<ScopeCategory, FeatureScope> = {
  included: "Must Have",
  later: "Should Have",
  excluded: "Out of Scope",
};
