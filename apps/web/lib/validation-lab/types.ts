/** Presentation types for the Validation Lab workspace. */

export const VALIDATION_IDEAS = [
  {
    id: "helio-notes",
    name: "Helio Notes",
    ref: "VL-001",
    assumption:
      "Knowledge workers lose context when switching between documents and meetings and want a lightweight way to capture and recall decisions.",
    nextTasks: [
      "Finish the decision-recall interview round (e-001)",
      "Run the prototype capture test (e-002)",
      "Write down what would count as disconfirming evidence",
    ],
  },
  {
    id: "atlas-scout",
    name: "Atlas Scout",
    ref: "VL-002",
    assumption:
      "Early-stage B2B teams need a faster way to shortlist qualified prospects without running a full sales intelligence workflow.",
    nextTasks: [
      "Review the interviews that produced f-002 and f-003",
      "Design a manual demand test for the shortlist workflow",
      "Decide what would make the tedium finding actionable",
    ],
  },
  {
    id: "tidemarket",
    name: "TideMarket",
    ref: "VL-003",
    assumption:
      "Local service businesses want a simple way to publish offers and get enquiries without complex e-commerce tooling.",
    nextTasks: [
      "Write the first customer-problem hypothesis",
      "Choose one segment to interview before designing an experiment",
      "List the assumptions that would be expensive to get wrong",
    ],
  },
] as const;

export type ValidationIdea = (typeof VALIDATION_IDEAS)[number];

export const HYPOTHESIS_CATEGORIES = [
  "Customer Problem",
  "Target Audience",
  "Demand",
  "Willingness to Pay",
  "Solution",
  "Distribution",
  "Retention",
] as const;

export type HypothesisCategory = (typeof HYPOTHESIS_CATEGORIES)[number];

export const HYPOTHESIS_STATUSES = [
  "Unexamined",
  "Ready to Test",
  "Testing",
  "Supported",
  "Rejected",
  "Inconclusive",
] as const;

export type HypothesisStatus = (typeof HYPOTHESIS_STATUSES)[number];

export type Hypothesis = {
  id: string;
  ideaId: (typeof VALIDATION_IDEAS)[number]["id"];
  title: string;
  statement: string;
  customerSegment: string;
  category: HypothesisCategory;
  rationale: string;
  importance: "High" | "Medium" | "Low";
  status: HypothesisStatus;
  relatedExperimentIds: string[];
  linkedFindings: string[];
  unresolvedQuestions: string[];
};

export const EXPERIMENT_METHODS = [
  "Customer Interviews",
  "Surveys",
  "Landing Page Tests",
  "Prototype Tests",
  "Concierge Tests",
  "Pricing Interviews",
  "Manual Demand Tests",
] as const;

export type ExperimentMethod = (typeof EXPERIMENT_METHODS)[number];

export const EXPERIMENT_STATUSES = [
  "Draft",
  "Ready",
  "In Progress",
  "Completed",
  "Archived",
] as const;

export type ExperimentStatus = (typeof EXPERIMENT_STATUSES)[number];

export type Experiment = {
  id: string;
  ideaId: (typeof VALIDATION_IDEAS)[number]["id"];
  title: string;
  relatedHypothesisId: string;
  objective: string;
  method: ExperimentMethod;
  targetAudience: string;
  successCriteria: string;
  expectedEvidence: string;
  status: ExperimentStatus;
  startDate: string;
  endDate?: string;
  observations: string[];
  notes: string;
};

export const EVIDENCE_TYPES = [
  "Interview Observation",
  "Survey Result",
  "Behavioral Observation",
  "Prototype Feedback",
  "Quantitative Measurement",
  "Qualitative Finding",
] as const;

export type EvidenceType = (typeof EVIDENCE_TYPES)[number];

export type EvidenceItem = {
  id: string;
  ideaId: (typeof VALIDATION_IDEAS)[number]["id"];
  title: string;
  relatedExperimentId: string;
  relatedHypothesisId: string;
  type: EvidenceType;
  sourceLabel: string;
  date: string;
  observation: string;
  interpretation: string;
  limitations: string;
};

export const VALIDATION_SECTIONS = [
  "Overview",
  "Hypotheses",
  "Experiments",
  "Evidence & Findings",
  "Validation Summary",
] as const;

export type ValidationSection = (typeof VALIDATION_SECTIONS)[number];

export type NextStep = "design experiment" | "interview" | "collect feedback" | "review evidence";

/* ------------------------------------------------------------ form drafts ---
 * Presentational payloads only: nothing is persisted or sent anywhere.       
 */

export type HypothesisDraft = {
  title: string;
  statement: string;
  category: HypothesisCategory;
  customerSegment: string;
  rationale: string;
  importance: Hypothesis["importance"];
};

export type ExperimentDraft = {
  title: string;
  relatedHypothesisId: string;
  method: ExperimentMethod;
  objective: string;
  successCriteria: string;
  targetAudience: string;
  startDate: string;
};

export type EvidenceDraft = {
  title: string;
  relatedExperimentId: string;
  relatedHypothesisId: string;
  type: EvidenceType;
  sourceLabel: string;
  observation: string;
  interpretation: string;
  limitations: string;
};

/* ------------------------------------------------------------- list options --- */

export const IMPORTANCE_ORDER: Record<Hypothesis["importance"], number> = {
  High: 0,
  Medium: 1,
  Low: 2,
};

export const HYPOTHESIS_SORT_OPTIONS = [
  { value: "importance", label: "Importance" },
  { value: "category", label: "Category (A–Z)" },
  { value: "title", label: "Title (A–Z)" },
] as const;

export const EXPERIMENT_SORT_OPTIONS = [
  { value: "recent", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "title", label: "Title (A–Z)" },
] as const;

export const EVIDENCE_SORT_OPTIONS = [
  { value: "recent", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
] as const;

export type ValidationView = "populated" | "loading" | "error";
