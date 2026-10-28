import type {
  EvidenceItem,
  Experiment,
  Hypothesis,
  NextStep,
  ValidationIdea,
} from "./types";

import { VALIDATION_IDEAS } from "./types";

export type { ValidationIdea };
export { VALIDATION_IDEAS };

export const DEMO_HYPOTHESES: Hypothesis[] = [
  {
    id: "h-001",
    ideaId: "helio-notes",
    title: "Decision recall is painful",
    statement:
      "Knowledge workers struggle to recall decisions made in meetings and need a lightweight way to surface key decisions later.",
    customerSegment: "Knowledge workers (product/ops)",
    category: "Customer Problem",
    rationale: "Frequent context switching makes decision history hard to reconstruct.",
    importance: "High",
    status: "Testing",
    relatedExperimentIds: ["e-001"],
    linkedFindings: ["f-001"],
    unresolvedQuestions: ["Do they rely on notes or search?", "Is the pain urgent enough to adopt a new tool?"],
  },
  {
    id: "h-002",
    ideaId: "helio-notes",
    title: "Willing to capture decisions",
    statement: "People will capture decisions at the moment if it takes less than 10 seconds.",
    customerSegment: "Knowledge workers",
    category: "Solution",
    rationale: "Adoption hinges on low-friction capture.",
    importance: "High",
    status: "Ready to Test",
    relatedExperimentIds: ["e-002"],
    linkedFindings: [],
    unresolvedQuestions: ["What capture surface (chat, notes, meeting) works best?"],
  },
  {
    id: "h-003",
    ideaId: "helio-notes",
    title: "People will pay",
    statement: "A subset of teams will pay for a shared decision log once it becomes part of their workflow.",
    customerSegment: "Small product teams",
    category: "Willingness to Pay",
    rationale: "Monetization needs to be validated separately from usage.",
    importance: "Medium",
    status: "Unexamined",
    relatedExperimentIds: [],
    linkedFindings: [],
    unresolvedQuestions: ["What price point is acceptable?", "Who holds the budget?"],
  },
  {
    id: "h-004",
    ideaId: "atlas-scout",
    title: "ICP pain is real",
    statement: "Early B2B teams struggle to build a qualified shortlist before reaching out.",
    customerSegment: "Founders & first sales hire",
    category: "Customer Problem",
    rationale: "Time spent on unqualified leads is a common bottleneck.",
    importance: "High",
    status: "Supported",
    relatedExperimentIds: ["e-003"],
    linkedFindings: ["f-002"],
    unresolvedQuestions: ["Does this extend beyond first-time founders?"],
  },
  {
    id: "h-005",
    ideaId: "atlas-scout",
    title: "Alternative workflow exists",
    statement: "Teams combine spreadsheets and directories with manual filtering — and find it tedious but tolerable.",
    customerSegment: "Early B2B teams",
    category: "Demand",
    rationale: "Need to understand switching cost.",
    importance: "Medium",
    status: "Inconclusive",
    relatedExperimentIds: ["e-003"],
    linkedFindings: ["f-003"],
    unresolvedQuestions: ["Is tedium enough to switch, or only crisis enough?"],
  },
];

export const DEMO_EXPERIMENTS: Experiment[] = [
  {
    id: "e-001",
    ideaId: "helio-notes",
    title: "Interview knowledge workers about decision recall",
    relatedHypothesisId: "h-001",
    objective: "Understand frequency and impact of losing decision context.",
    method: "Customer Interviews",
    targetAudience: "5–8 product/ops knowledge workers",
    successCriteria: "At least 4/5 report losing track of decisions at least weekly with concrete examples.",
    expectedEvidence: "Specific anecdotes and frequency of context loss.",
    status: "In Progress",
    startDate: "2026-10-20",
    observations: ["Participants describe digging through Slack/email after meetings."],
    notes: "Focus on concrete recent examples, not hypothetical opinions.",
  },
  {
    id: "e-002",
    ideaId: "helio-notes",
    title: "Test 10-second capture on a clickable prototype",
    relatedHypothesisId: "h-002",
    objective: "Measure friction of capturing a decision.",
    method: "Prototype Tests",
    targetAudience: "3–5 knowledge workers",
    successCriteria: "Majority complete capture in <15s and say they’d use it next time.",
    expectedEvidence: "Timing and qualitative feedback on friction.",
    status: "Ready",
    startDate: "2026-10-25",
    observations: [],
    notes: "Use a low-fidelity clickable prototype, not a full app.",
  },
  {
    id: "e-003",
    ideaId: "atlas-scout",
    title: "Interview founders about shortlist building",
    relatedHypothesisId: "h-004",
    objective: "Validate ICP pain and current approach.",
    method: "Customer Interviews",
    targetAudience: "4–6 early-stage B2B founders",
    successCriteria: "Majority describe concrete pain with specific examples and time spent.",
    expectedEvidence: "Pain anecdotes, workflow description, and severity.",
    status: "Completed",
    startDate: "2026-10-10",
    endDate: "2026-10-18",
    observations: ["Most build lists in spreadsheets.", "Time pressure is highest right before outreach."],
    notes: "Pay attention to switching cost and existing habits.",
  },
];

export const DEMO_EVIDENCE: EvidenceItem[] = [
  {
    id: "f-001",
    ideaId: "helio-notes",
    title: "Decision context lost weekly",
    relatedExperimentId: "e-001",
    relatedHypothesisId: "h-001",
    type: "Interview Observation",
    sourceLabel: "Interview set (in progress)",
    date: "2026-10-22",
    observation: "4 of 5 interviewed knowledge workers report reconstructing decisions from Slack/email at least weekly.",
    interpretation: "The problem appears frequent, but urgency varies by role and team norms.",
    limitations: "Small sample size; may be biased toward people who already complain about this.",
  },
  {
    id: "f-002",
    ideaId: "atlas-scout",
    title: "Spreadsheet-based shortlists are common",
    relatedExperimentId: "e-003",
    relatedHypothesisId: "h-004",
    type: "Interview Observation",
    sourceLabel: "Founder interviews (completed)",
    date: "2026-10-16",
    observation: "All interviewed founders described building and filtering prospect lists in spreadsheets before outreach.",
    interpretation: "There is an established workflow to replace or improve, suggesting real demand.",
    limitations: "All interviewed were first-time founders; may not generalize to teams with dedicated BD.",
  },
  {
    id: "f-003",
    ideaId: "atlas-scout",
    title: "Tedium is present but tolerable",
    relatedExperimentId: "e-003",
    relatedHypothesisId: "h-005",
    type: "Qualitative Finding",
    sourceLabel: "Founder interviews (completed)",
    date: "2026-10-17",
    observation: "Several founders called the process tedious, but also said it was 'good enough' for their current volume.",
    interpretation: "Switching cost is real; value must be clear relative to spreadsheets.",
    limitations: "Tolerance may drop as volume increases, but not observed at current stage.",
  },
];

export const DEMO_NEXT_STEPS: NextStep[] = ["design experiment", "interview", "collect feedback", "review evidence"];

export const DEMO_VALIDATION_IDEAS = [...VALIDATION_IDEAS];

export function getValidationIdea(id: string) {
  return DEMO_VALIDATION_IDEAS.find((idea) => idea.id === id) ?? DEMO_VALIDATION_IDEAS[0];
}

export function getHypothesesForIdea(id: string): Hypothesis[] {
  return DEMO_HYPOTHESES.filter((h) => h.ideaId === id);
}

export function getExperimentsForIdea(id: string): Experiment[] {
  return DEMO_EXPERIMENTS.filter((e) => e.ideaId === id);
}

export function getEvidenceForIdea(id: string): EvidenceItem[] {
  return DEMO_EVIDENCE.filter((f) => f.ideaId === id);
}
