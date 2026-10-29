/**
 * Static mock records for the Feedback Hub.
 *
 * Everything here is fictional sample data used for presentational UI work.
 * Counts shown in the interface are derived from these records so they always
 * agree with each other — nothing is scored, clustered or analysed.
 */

import type {
  FeatureRequest,
  FeedbackItem,
  FeedbackProduct,
  ProductArea,
  ProductAreaDefinition,
  Theme,
} from "./types";
import { FEEDBACK_PRODUCTS } from "./types";

export const DEMO_FEEDBACK_PRODUCTS: FeedbackProduct[] = [...FEEDBACK_PRODUCTS];

/* ------------------------------------------------------------- feedback --- */

export const DEMO_FEEDBACK: FeedbackItem[] = [
  /* Helio Notes ---------------------------------------------------------- */
  {
    id: "fb-001",
    productId: "helio-notes",
    title: "Decisions get lost when switching tabs",
    excerpt: "I lose track of the decision I was writing whenever I switch tabs.",
    description:
      "When I jump between the meeting notes tab and the decision log, the capture context disappears and I have to retype what I was about to save. It happens several times a day.",
    category: "Usability Issue",
    source: "Interview",
    date: "2026-10-20",
    priority: "High",
    status: "Under Review",
    productArea: "Core Workflow",
    internalNotes:
      "Three of the five interviewees hit this. Reproduce with a long-running session before we commit to a fix.",
    followUpAction: "Schedule a follow-up interview",
  },
  {
    id: "fb-002",
    productId: "helio-notes",
    title: "Add keyboard shortcuts for capture",
    excerpt: "A shortcut to open the capture form would make this much faster.",
    description:
      "I record ten or twelve decisions in a sitting. Reaching for the mouse every time breaks my flow — a global shortcut to open the capture form would remove most of the friction.",
    category: "Feature Request",
    source: "Survey",
    date: "2026-10-18",
    priority: "Medium",
    status: "New",
    productArea: "Core Workflow",
  },
  {
    id: "fb-003",
    productId: "helio-notes",
    title: "Timeline scrolls slowly past 500 entries",
    excerpt: "The timeline becomes sluggish once a workspace has a long history.",
    description:
      "Our workspace crossed 500 decisions last month and scrolling the timeline now stutters badly. On older laptops it is noticeably worse and the page occasionally stops responding.",
    category: "Performance Issue",
    source: "In-app widget",
    date: "2026-10-15",
    priority: "High",
    status: "Planned",
    productArea: "Dashboard",
    internalNotes: "Reproduced internally at ~600 entries. Virtualised list is the leading option.",
    followUpAction: "Reproduce and file a bug",
  },
  {
    id: "fb-004",
    productId: "helio-notes",
    title: "Export decisions to CSV",
    excerpt: "I want to export the decision log to share it outside the tool.",
    description:
      "Our quarterly review happens in a spreadsheet. There is no way to get the decision history out, so someone retypes everything by hand.",
    category: "Feature Request",
    source: "Email",
    date: "2026-10-12",
    priority: "Low",
    status: "New",
    productArea: "Dashboard",
  },
  {
    id: "fb-005",
    productId: "helio-notes",
    title: "Setup checklist never reaches 100%",
    excerpt: "The onboarding checklist is stuck on the last step no matter what I do.",
    description:
      "After inviting a teammate the checklist still shows four of five steps complete. I repeated the invite twice and the last step never ticks, so the workspace always looks unfinished.",
    category: "Bug Report",
    source: "Support ticket",
    date: "2026-10-21",
    priority: "Critical",
    status: "Under Review",
    productArea: "Onboarding",
    internalNotes: "Support has four tickets with the same symptom. Likely a state refresh issue.",
    followUpAction: "Reproduce and file a bug",
  },
  {
    id: "fb-006",
    productId: "helio-notes",
    title: "Verification emails arrive minutes late",
    excerpt: "Login links show up long enough to expire on a slow connection.",
    description:
      "Verification emails take five to ten minutes to arrive. By then the link has expired and I have to request a new one, which repeats the wait.",
    category: "Bug Report",
    source: "Email",
    date: "2026-10-19",
    priority: "High",
    status: "New",
    productArea: "Notifications",
    internalNotes: "Delivery timestamps look fine; delay may be on the provider side. Check with infra.",
    followUpAction: "Review with the product team",
  },
  {
    id: "fb-007",
    productId: "helio-notes",
    title: "It is unclear what the Pro plan includes",
    excerpt: "I cannot tell which features are paid before I upgrade.",
    description:
      "The pricing page lists limits but not the actual feature differences. I only found out about exports after upgrading, which felt like a surprise rather than a decision.",
    category: "General Feedback",
    source: "Survey",
    date: "2026-10-17",
    priority: "Medium",
    status: "Under Review",
    productArea: "Billing",
    internalNotes: "Second pricing comment this month. Worth pairing with the Q1 billing refresh.",
    followUpAction: "Add to roadmap candidates",
  },
  {
    id: "fb-008",
    productId: "helio-notes",
    title: "Search should include archived decisions",
    excerpt: "Archived items vanish from search and I assume they were deleted.",
    description:
      "Once a decision is archived it disappears from search results. I archived a set of 2025 decisions and now cannot find them at all, which makes archiving feel destructive.",
    category: "Feature Request",
    source: "Interview",
    date: "2026-10-14",
    priority: "Medium",
    status: "Planned",
    productArea: "Core Workflow",
    followUpAction: "Add to roadmap candidates",
  },
  {
    id: "fb-009",
    productId: "helio-notes",
    title: "Workspace member roles are confusing",
    excerpt: "I cannot tell what a viewer is allowed to change.",
    description:
      "We invited three collaborators and nobody could say whether a viewer could edit decisions. The role descriptions are one line each and too vague to act on.",
    category: "Usability Issue",
    source: "Interview",
    date: "2026-10-11",
    priority: "Medium",
    status: "New",
    productArea: "Account Settings",
    internalNotes: "Check whether the wording matches what the backend actually enforces.",
    followUpAction: "Share with design for an audit",
  },
  {
    id: "fb-010",
    productId: "helio-notes",
    title: "Bulk edit applied the wrong dates",
    excerpt: "Selecting five decisions and editing shifted all their dates by a day.",
    description:
      "I bulk-edited the category of five decisions and every record moved back one day. Reverting by hand took longer than the edit itself.",
    category: "Bug Report",
    source: "In-app widget",
    date: "2026-10-08",
    priority: "High",
    status: "Resolved",
    productArea: "Core Workflow",
    internalNotes: "Timezone rounding in the bulk path. Shipped in 1.4.1 and confirmed with the reporter.",
    followUpAction: "Close after the next release",
  },
  {
    id: "fb-011",
    productId: "helio-notes",
    title: "Notification badge shows the wrong count",
    excerpt: "The bell says three items even when everything is read.",
    description:
      "The unread badge stays at three after opening every notification. Reloading clears it, so it looks like a stale counter rather than a sync problem.",
    category: "Bug Report",
    source: "Support ticket",
    date: "2026-10-05",
    priority: "Low",
    status: "Resolved",
    productArea: "Notifications",
    internalNotes: "Counter now derived from read state on load. Verified in staging.",
    followUpAction: "Close after the next release",
  },
  {
    id: "fb-012",
    productId: "helio-notes",
    title: "Dashboard loads slowly on mobile data",
    excerpt: "Opening the dashboard on a phone takes most of a minute on 4G.",
    description:
      "On a phone over 4G the dashboard takes roughly fifty seconds to become usable. It is fine on wifi, which suggests the initial payload is too large.",
    category: "Performance Issue",
    source: "Survey",
    date: "2026-10-02",
    priority: "Medium",
    status: "Archived",
    productArea: "Dashboard",
    internalNotes: "Archived for now: only two reports so far, both on older devices.",
    followUpAction: "No action yet",
  },
  {
    id: "fb-013",
    productId: "helio-notes",
    title: "No Slack alerts for new decisions",
    excerpt: "Our team lives in Slack and never sees decisions added here.",
    description:
      "Decisions are only visible to people who remember to open the app. A message in a channel whenever a decision is recorded would keep the rest of the team current.",
    category: "Feature Request",
    source: "Email",
    date: "2026-10-09",
    priority: "Medium",
    status: "New",
    productArea: "Notifications",
  },
  {
    id: "fb-014",
    productId: "helio-notes",
    title: "Please sync with Google Calendar",
    excerpt: "Decisions from a meeting should attach to the calendar event.",
    description:
      "We take notes against a calendar event and then re-enter them as decisions. Pulling the event details in automatically would remove a whole copying step.",
    category: "Feature Request",
    source: "Survey",
    date: "2026-10-06",
    priority: "Low",
    status: "New",
    productArea: "Core Workflow",
  },

  /* Atlas Scout ---------------------------------------------------------- */
  {
    id: "fb-101",
    productId: "atlas-scout",
    title: "The shortlist criteria builder is confusing",
    excerpt: "It is unclear how to set up qualification criteria the first time.",
    description:
      "New users open the criteria builder and stop. The field labels assume you already know our scoring model, so the first shortlist takes twenty minutes instead of two.",
    category: "Usability Issue",
    source: "Interview",
    date: "2026-10-22",
    priority: "Critical",
    status: "New",
    productArea: "Onboarding",
    internalNotes: "Watch two more onboarding sessions before changing the form.",
    followUpAction: "Schedule a follow-up interview",
  },
  {
    id: "fb-102",
    productId: "atlas-scout",
    title: "Export shortlists to email",
    excerpt: "Sending a shortlist to a colleague currently means copy and paste.",
    description:
      "I build a shortlist and then paste it into an email so my manager can review it. An export that keeps the columns intact would save that step every week.",
    category: "Feature Request",
    source: "Survey",
    date: "2026-10-10",
    priority: "Medium",
    status: "Under Review",
    productArea: "Core Workflow",
  },
  {
    id: "fb-103",
    productId: "atlas-scout",
    title: "Scoring is slow on lists over 10k rows",
    excerpt: "Scoring a large list takes minutes and the tab appears frozen.",
    description:
      "A 12,000 row import took over three minutes to score with no progress indicator. Two people assumed it had crashed and re-imported, creating duplicates.",
    category: "Performance Issue",
    source: "Support ticket",
    date: "2026-10-16",
    priority: "High",
    status: "Planned",
    productArea: "Dashboard",
    internalNotes: "Confirmed against a 12k export. Progress reporting matters as much as raw speed.",
    followUpAction: "Reproduce and file a bug",
  },
  {
    id: "fb-104",
    productId: "atlas-scout",
    title: "Duplicate prospects appear in saved lists",
    excerpt: "The same contact shows up twice after re-importing a CSV.",
    description:
      "Re-importing a corrected file adds a second copy of every prospect instead of updating the existing row, so lists grow every time we fix a spreadsheet.",
    category: "Bug Report",
    source: "In-app widget",
    date: "2026-10-13",
    priority: "High",
    status: "Under Review",
    productArea: "Core Workflow",
    internalNotes: "Likely missing a stable external id on import. Needs a decision on merge rules.",
    followUpAction: "Review with the product team",
  },
  {
    id: "fb-105",
    productId: "atlas-scout",
    title: "No warning before the trial ends",
    excerpt: "The trial expired overnight and our team lost access mid-campaign.",
    description:
      "Nobody received a notice that the trial was ending. We found out when a scheduled review failed on a Monday morning.",
    category: "Bug Report",
    source: "Email",
    date: "2026-10-07",
    priority: "High",
    status: "New",
    productArea: "Onboarding",
    internalNotes: "Billing confirmed no expiry emails are configured for trials.",
    followUpAction: "Reproduce and file a bug",
  },
  {
    id: "fb-106",
    productId: "atlas-scout",
    title: "This fits our outreach workflow well",
    excerpt: "Shortlisting is finally faster than our spreadsheet ever was.",
    description:
      "Positive note from a design partner: the shortlist view replaced a shared spreadsheet and the team now reviews candidates in one place each morning.",
    category: "General Feedback",
    source: "Interview",
    date: "2026-10-03",
    priority: "Low",
    status: "Resolved",
    productArea: "Core Workflow",
  },
];

/* ---------------------------------------------------------------- themes --- */
/* Manually documented sample insights — never clustered or scored. */

export const DEMO_FEEDBACK_THEMES: Theme[] = [
  {
    id: "th-001",
    productId: "helio-notes",
    name: "Onboarding Friction",
    explanation:
      "New workspaces stall before the first successful capture because the setup checklist and invite steps are hard to interpret.",
    relatedFeedbackIds: ["fb-005"],
    productArea: "Onboarding",
    importance: "High",
    reviewStatus: "Under Review",
    internalNotes:
      "Sample insight written by hand after the October interviews. Confirm with two more onboarding sessions before treating it as a pattern.",
  },
  {
    id: "th-002",
    productId: "helio-notes",
    name: "Missing Integrations",
    explanation:
      "Teams want decisions to surface in the tools they already use, mainly Slack channels and calendar events.",
    relatedFeedbackIds: ["fb-013", "fb-014"],
    productArea: "Notifications",
    importance: "Medium",
    reviewStatus: "New",
    internalNotes:
      "Both requests came from survey answers. Manual grouping only — no automatic matching was performed.",
  },
  {
    id: "th-003",
    productId: "helio-notes",
    name: "Confusing Navigation",
    explanation:
      "Finding a past decision is harder than expected: context is lost when switching tabs and archived records drop out of search.",
    relatedFeedbackIds: ["fb-001", "fb-008"],
    productArea: "Core Workflow",
    importance: "High",
    reviewStatus: "Planned",
    internalNotes:
      "Written from two interview notes. Paired with the search-parity roadmap item for review.",
  },
  {
    id: "th-004",
    productId: "helio-notes",
    name: "Performance Concerns",
    explanation:
      "Long histories make the timeline and dashboard feel slow, especially for workspaces past a few hundred records.",
    relatedFeedbackIds: ["fb-003", "fb-012"],
    productArea: "Dashboard",
    importance: "High",
    reviewStatus: "Under Review",
    internalNotes:
      "Manually grouped performance reports. One of the two is archived, so treat the theme as directional.",
  },
  {
    id: "th-005",
    productId: "helio-notes",
    name: "Pricing Questions",
    explanation:
      "People cannot tell what is included in each plan before they upgrade, which makes billing feel unpredictable.",
    relatedFeedbackIds: ["fb-007"],
    productArea: "Billing",
    importance: "Medium",
    reviewStatus: "New",
    internalNotes:
      "Single survey comment so far, backed by a sales call. Keep documented until a second source appears.",
  },
  {
    id: "th-101",
    productId: "atlas-scout",
    name: "Onboarding Friction",
    explanation:
      "First-run setup asks for criteria and trial details before explaining either, so new accounts stall at the start.",
    relatedFeedbackIds: ["fb-101", "fb-105"],
    productArea: "Onboarding",
    importance: "High",
    reviewStatus: "Under Review",
    internalNotes: "Sample insight recorded by hand from two onboarding interviews.",
  },
  {
    id: "th-102",
    productId: "atlas-scout",
    name: "Performance Concerns",
    explanation:
      "Large imports block the interface with no progress feedback, which reads as a crash.",
    relatedFeedbackIds: ["fb-103"],
    productArea: "Dashboard",
    importance: "Medium",
    reviewStatus: "New",
    internalNotes: "Linked to one support ticket. Needs more evidence before raising importance.",
  },
];

/* ------------------------------------------------------- feature requests --- */

export const DEMO_FEATURE_REQUESTS: FeatureRequest[] = [
  {
    id: "fr-001",
    productId: "helio-notes",
    title: "Keyboard shortcuts for capture",
    description: "Add global shortcuts so a decision can be recorded without the mouse.",
    userProblem: "Frequent capture is interrupted by reaching for the pointer every time.",
    requestedCapability: "A global shortcut that opens the capture form from anywhere.",
    relatedFeedbackIds: ["fb-002"],
    productArea: "Core Workflow",
    priority: "Medium",
    status: "Under Review",
    roadmapReference: "Roadmap · Q4 Capture Polish",
  },
  {
    id: "fr-002",
    productId: "helio-notes",
    title: "CSV export for decisions",
    description: "Export the decision log as a spreadsheet-friendly file.",
    userProblem: "Quarterly reviews are assembled by retyping history into a spreadsheet.",
    requestedCapability: "One-click CSV export of the current workspace history.",
    relatedFeedbackIds: ["fb-004"],
    productArea: "Dashboard",
    priority: "Low",
    status: "New",
  },
  {
    id: "fr-003",
    productId: "helio-notes",
    title: "Search archived decisions",
    description: "Include archived records in search results, clearly labelled.",
    userProblem: "Archived decisions disappear from search, so people assume they were deleted.",
    requestedCapability: "A search filter that includes archived records with an archive badge.",
    relatedFeedbackIds: ["fb-008"],
    productArea: "Core Workflow",
    priority: "Medium",
    status: "Planned",
    roadmapReference: "Roadmap · Q4 Search Parity",
  },
  {
    id: "fr-004",
    productId: "helio-notes",
    title: "Slack alerts for new decisions",
    description: "Post a short message to a chosen channel when a decision is recorded.",
    userProblem: "Teammates who do not open the app never learn that a decision changed.",
    requestedCapability: "A per-workspace Slack notification with a link back to the decision.",
    relatedFeedbackIds: ["fb-013"],
    productArea: "Notifications",
    priority: "Medium",
    status: "New",
  },
  {
    id: "fr-005",
    productId: "helio-notes",
    title: "Google Calendar sync",
    description: "Attach new decisions to the calendar event they came from.",
    userProblem: "Meeting notes are copied from the calendar into the decision log by hand.",
    requestedCapability: "Link a decision to an event and prefill the meeting details.",
    relatedFeedbackIds: ["fb-014"],
    productArea: "Core Workflow",
    priority: "Low",
    status: "Declined",
    roadmapReference: "Declined for this quarter — revisit after calendar API review",
  },
  {
    id: "fr-006",
    productId: "helio-notes",
    title: "Duplicate detection while capturing",
    description: "Warn when a new decision is very similar to an existing one.",
    userProblem: "Two people record the same decision and the history fills with near-duplicates.",
    requestedCapability: "A suggestion banner showing close matches before saving.",
    relatedFeedbackIds: [],
    productArea: "Core Workflow",
    priority: "Low",
    status: "Delivered",
    roadmapReference: "Shipped in 1.4",
  },
  {
    id: "fr-007",
    productId: "helio-notes",
    title: "Annual billing with pooled seats",
    description: "Offer an annual plan where seats can be reassigned between members.",
    userProblem: "Monthly invoices for a rotating team make budgeting awkward.",
    requestedCapability: "Annual invoicing with seat pooling across the workspace.",
    relatedFeedbackIds: ["fb-007"],
    productArea: "Billing",
    priority: "Medium",
    status: "Under Review",
    roadmapReference: "Roadmap · Q1 Billing Refresh",
  },
  {
    id: "fr-008",
    productId: "helio-notes",
    title: "Role presets for workspaces",
    description: "Ship readable presets for viewer, editor and admin access.",
    userProblem: "Inviting teammates is a guess because the role descriptions are too vague.",
    requestedCapability: "Named presets with a plain-language permission summary.",
    relatedFeedbackIds: ["fb-009"],
    productArea: "Account Settings",
    priority: "High",
    status: "Planned",
    roadmapReference: "Roadmap · Q4 Team Accounts",
  },
  {
    id: "fr-101",
    productId: "atlas-scout",
    title: "Email shortlist export",
    description: "Send a shortlist to a colleague without leaving the app.",
    userProblem: "Shortlists are copied into email by hand every week.",
    requestedCapability: "Export the current shortlist as a formatted email or PDF.",
    relatedFeedbackIds: ["fb-102"],
    productArea: "Core Workflow",
    priority: "Medium",
    status: "Under Review",
  },
  {
    id: "fr-102",
    productId: "atlas-scout",
    title: "Column mapping for CSV import",
    description: "Let people map spreadsheet columns before an import runs.",
    userProblem: "Corrected files are re-imported as duplicates instead of updates.",
    requestedCapability: "A mapping step that matches external ids across imports.",
    relatedFeedbackIds: ["fb-104"],
    productArea: "Dashboard",
    priority: "Medium",
    status: "Planned",
    roadmapReference: "Roadmap · Import Reliability",
  },
  {
    id: "fr-103",
    productId: "atlas-scout",
    title: "Criteria templates for common segments",
    description: "Start from a template instead of an empty criteria form.",
    userProblem: "First-run setup stalls because nobody knows what to fill in.",
    requestedCapability: "Three starter templates with editable criteria.",
    relatedFeedbackIds: [],
    productArea: "Onboarding",
    priority: "High",
    status: "New",
  },
];

/* ---------------------------------------------------------- product areas --- */

export const PRODUCT_AREA_DEFINITIONS: ProductAreaDefinition[] = [
  /* Helio Notes */
  {
    id: "pa-001",
    productId: "helio-notes",
    name: "Onboarding",
    description: "First-run setup, the setup checklist and the initial invite flow.",
    summary: "A single checklist bug is blocking first success for new workspaces.",
  },
  {
    id: "pa-002",
    productId: "helio-notes",
    name: "Dashboard",
    description: "The decision timeline, history view and workspace overview.",
    summary: "Long histories expose slow rendering; export is still missing.",
  },
  {
    id: "pa-003",
    productId: "helio-notes",
    name: "Core Workflow",
    description: "Capturing, finding and editing decisions day to day.",
    summary: "Capture works well; search parity and context loss are the open threads.",
  },
  {
    id: "pa-004",
    productId: "helio-notes",
    name: "Billing",
    description: "Plans, invoices and the upgrade path.",
    summary: "One pricing comment so far, tied to the planned billing refresh.",
  },
  {
    id: "pa-005",
    productId: "helio-notes",
    name: "Notifications",
    description: "Emails, badges and outbound alerts about workspace activity.",
    summary: "Delivery delays are open; two resolved bugs closed this month.",
  },
  {
    id: "pa-006",
    productId: "helio-notes",
    name: "Account Settings",
    description: "Members, roles and workspace preferences.",
    summary: "Role wording is the only open item, with a planned permissions preset.",
  },
  /* Atlas Scout */
  {
    id: "pa-101",
    productId: "atlas-scout",
    name: "Onboarding",
    description: "Trial start, criteria setup and the first shortlist.",
    summary: "Two open issues, both around first-run expectations.",
  },
  {
    id: "pa-102",
    productId: "atlas-scout",
    name: "Dashboard",
    description: "Import progress, scoring status and list overview.",
    summary: "Large imports work but give no feedback while they run.",
  },
  {
    id: "pa-103",
    productId: "atlas-scout",
    name: "Core Workflow",
    description: "Building, saving and sharing shortlists.",
    summary: "The daily path is solid; duplicates on re-import are the main defect.",
  },
  /* Beacon CRM — a freshly created workspace with no records yet. */
  {
    id: "pa-201",
    productId: "beacon-crm",
    name: "Onboarding",
    description: "Workspace creation, imports and the first team invite.",
    summary: "No feedback recorded yet.",
  },
  {
    id: "pa-202",
    productId: "beacon-crm",
    name: "Dashboard",
    description: "Pipeline overview and relationship activity.",
    summary: "No feedback recorded yet.",
  },
  {
    id: "pa-203",
    productId: "beacon-crm",
    name: "Core Workflow",
    description: "Contacts, notes and follow-ups.",
    summary: "No feedback recorded yet.",
  },
  {
    id: "pa-204",
    productId: "beacon-crm",
    name: "Billing",
    description: "Plans, invoices and seat changes.",
    summary: "No feedback recorded yet.",
  },
  {
    id: "pa-205",
    productId: "beacon-crm",
    name: "Notifications",
    description: "Reminders and follow-up alerts.",
    summary: "No feedback recorded yet.",
  },
  {
    id: "pa-206",
    productId: "beacon-crm",
    name: "Account Settings",
    description: "Members, roles and workspace preferences.",
    summary: "No feedback recorded yet.",
  },
];

/* ------------------------------------------------------------- selectors --- */

export function getFeedbackProduct(id: string): FeedbackProduct {
  return DEMO_FEEDBACK_PRODUCTS.find((p) => p.id === id) ?? DEMO_FEEDBACK_PRODUCTS[0];
}

export function getFeedbackForProduct(items: FeedbackItem[], productId: string): FeedbackItem[] {
  return items.filter((f) => f.productId === productId);
}

export function getThemesForProduct(items: Theme[], productId: string): Theme[] {
  return items.filter((t) => t.productId === productId);
}

export function getFeatureRequestsForProduct(
  items: FeatureRequest[],
  productId: string,
): FeatureRequest[] {
  return items.filter((r) => r.productId === productId);
}

const ISSUE_CATEGORIES = new Set(["Bug Report", "Usability Issue", "Performance Issue"]);

/**
 * Product areas with counts derived from the mock records themselves, so a
 * displayed count can never drift from the records behind it.
 */
export function getProductAreasForProduct(
  productId: string,
  feedback: FeedbackItem[],
  requests: FeatureRequest[],
): ProductArea[] {
  return PRODUCT_AREA_DEFINITIONS.filter((a) => a.productId === productId).map((area) => {
    const areaFeedback = feedback.filter(
      (f) => f.productId === productId && f.productArea === area.name,
    );
    return {
      ...area,
      feedbackCount: areaFeedback.length,
      openIssues: areaFeedback.filter(
        (f) => ISSUE_CATEGORIES.has(f.category) && !isClosedStatus(f.status),
      ).length,
      featureRequests: requests.filter(
        (r) => r.productId === productId && r.productArea === area.name,
      ).length,
    };
  });
}

function isClosedStatus(status: string): boolean {
  return status === "Resolved" || status === "Archived" || status === "Declined";
}

/** Feedback records linked to a feature request. */
export function feedbackForRequest(request: FeatureRequest, feedback: FeedbackItem[]) {
  return feedback.filter((f) => request.relatedFeedbackIds.includes(f.id));
}

/** Feature request that references a feedback record, if any. */
export function requestForFeedback(item: FeedbackItem, requests: FeatureRequest[]) {
  return requests.find((r) => r.relatedFeedbackIds.includes(item.id)) ?? null;
}

/** Compact counts used by the page header and the overview strip. */
export function feedbackStats(feedback: FeedbackItem[]) {
  return {
    total: feedback.length,
    awaiting: feedback.filter((f) => f.status === "New").length,
    highPriority: feedback.filter((f) => f.priority === "Critical" || f.priority === "High")
      .length,
    featureRequests: feedback.filter((f) => f.category === "Feature Request").length,
    reviewed: feedback.filter((f) => f.status !== "New" && f.status !== "Archived").length,
    lastActivity: feedback
      .map((f) => f.date)
      .sort()
      .at(-1),
  };
}
