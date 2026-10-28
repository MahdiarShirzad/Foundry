import type { Feature, MVPProject, MVPScopeItem } from "./types";

import { MVP_PROJECTS } from "./types";

export const DEMO_MVP_PROJECTS = [...MVP_PROJECTS];

export const DEMO_FEATURES: Feature[] = [
  {
    id: "f-001",
    projectId: "helio-notes",
    name: "Decision capture",
    description: "Quickly capture a decision with context.",
    userProblem: "Decisions are lost across channels.",
    targetUser: "Knowledge workers",
    priority: "Critical",
    scope: "Must Have",
    status: "In Progress",
    userStory: "As a knowledge worker, I want to capture a decision in seconds so I can recall it later.",
    acceptanceCriteria: [
      "Capture form takes < 10 seconds to complete",
      "Decision is saved with timestamp and context",
      "Can be viewed in timeline",
    ],
    behavior: "Single action to add a decision with optional tags and meeting context.",
    edgeCases: ["Offline capture not required", "Very long decisions still readable"],
    dependencies: ["Timeline view"],
    openQuestions: ["Should capture be global or per project?"],
    designNotes: "Keep friction minimal; prefer inline actions.",
  },
  {
    id: "f-002",
    projectId: "helio-notes",
    name: "Decision timeline",
    description: "Chronological view of captured decisions.",
    userProblem: "Hard to scan past decisions.",
    targetUser: "Knowledge workers",
    priority: "Critical",
    scope: "Must Have",
    status: "Ready",
    userStory: "As a knowledge worker, I want a timeline of decisions so I can find context quickly.",
    acceptanceCriteria: [
      "Decisions grouped by date",
      "Can scan key details at a glance",
      "Links to related context",
    ],
    behavior: "Reverse chronological list with minimal metadata.",
    edgeCases: ["Empty state for new workspace"],
    dependencies: ["Decision capture"],
    openQuestions: [],
    designNotes: "Prioritize scanability over density.",
  },
  {
    id: "f-003",
    projectId: "helio-notes",
    name: "Quick recall/search",
    description: "Find decisions by keyword.",
    userProblem: "Scrolling timeline is slow for large history.",
    targetUser: "Knowledge workers",
    priority: "High",
    scope: "Should Have",
    status: "Proposed",
    userStory: "As a knowledge worker, I want to search decisions so I can recall specific ones quickly.",
    acceptanceCriteria: ["Search by title/notes", "Results update clearly", "Empty state shown when no matches"],
    behavior: "Simple keyword filter over captured decisions.",
    edgeCases: ["No matches"],
    dependencies: ["Decision timeline"],
    openQuestions: ["Need full-text or just titles?"],
    designNotes: "Keep simple for MVP.",
  },
  {
    id: "f-004",
    projectId: "atlas-scout",
    name: "Criteria builder",
    description: "Define shortlist criteria.",
    userProblem: "Unclear what makes a lead qualified.",
    targetUser: "Founders doing first sales",
    priority: "Critical",
    scope: "Must Have",
    status: "In Progress",
    userStory: "As a founder, I want to define criteria so I shortlist consistently.",
    acceptanceCriteria: ["Add/remove criteria", "Save criteria set", "Used to filter shortlist"],
    behavior: "Form to build a criteria set with simple fields.",
    edgeCases: ["Empty criteria"],
    dependencies: [],
    openQuestions: [],
    designNotes: "Keep to essential fields.",
  },
  {
    id: "f-005",
    projectId: "atlas-scout",
    name: "Shortlist list",
    description: "Review and manage shortlist.",
    userProblem: "Spreadsheet gets messy quickly.",
    targetUser: "Founders doing first sales",
    priority: "Critical",
    scope: "Must Have",
    status: "Ready",
    userStory: "As a founder, I want a shortlist view to track prospects.",
    acceptanceCriteria: ["List with key details", "Mark status", "Shareable view"],
    behavior: "Simple table/list of shortlisted prospects.",
    edgeCases: ["Empty list"],
    dependencies: ["Criteria builder"],
    openQuestions: [],
    designNotes: "Prioritize clarity over columns.",
  },
];

export const DEMO_MVP_SCOPE: MVPScopeItem[] = [
  { id: "s-001", projectId: "helio-notes", name: "Decision capture", category: "included", explanation: "Core to recall flow.", status: "confirmed" },
  { id: "s-002", projectId: "helio-notes", name: "Decision timeline", category: "included", explanation: "Primary way to browse decisions.", status: "confirmed" },
  { id: "s-003", projectId: "helio-notes", name: "Quick recall/search", category: "later", explanation: "Useful but not essential for first version.", status: "under review" },
  { id: "s-004", projectId: "helio-notes", name: "Shared team spaces", category: "excluded", explanation: "Out of scope for solo knowledge worker MVP.", status: "confirmed" },
  { id: "s-005", projectId: "atlas-scout", name: "Criteria builder", category: "included", explanation: "Defines what to shortlist.", status: "confirmed" },
  { id: "s-006", projectId: "atlas-scout", name: "Shortlist list", category: "included", explanation: "Core output of the workflow.", status: "confirmed" },
  { id: "s-007", projectId: "atlas-scout", name: "Integrations", category: "excluded", explanation: "Manual entry is fine for MVP.", status: "confirmed" },
];

export function getMVPProject(id: string): MVPProject {
  return DEMO_MVP_PROJECTS.find((p) => p.id === id) ?? DEMO_MVP_PROJECTS[0];
}

export function getFeaturesForProject(id: string): Feature[] {
  return DEMO_FEATURES.filter((f) => f.projectId === id);
}

export function getScopeForProject(id: string): MVPScopeItem[] {
  return DEMO_MVP_SCOPE.filter((s) => s.projectId === id);
}
