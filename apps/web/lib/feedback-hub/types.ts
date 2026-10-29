/**
 * Presentation types for the Feedback Hub workspace (Stage 07 — Listen).
 * Static mock shapes only: no API, no persistence, no derived analytics.
 */

export const FEEDBACK_PRODUCTS = [
  {
    id: "helio-notes",
    name: "Helio Notes",
    ref: "FH-001",
    summary: "A lightweight decision log for knowledge workers.",
  },
  {
    id: "atlas-scout",
    name: "Atlas Scout",
    ref: "FH-002",
    summary: "A focused shortlist builder for early B2B outreach.",
  },
  {
    id: "beacon-crm",
    name: "Beacon CRM",
    ref: "FH-003",
    summary: "A shared relationship tracker for small founder-led teams.",
  },
] as const;

export type FeedbackProduct = (typeof FEEDBACK_PRODUCTS)[number];

export const FEEDBACK_CATEGORIES = [
  "Bug Report",
  "Feature Request",
  "Usability Issue",
  "Performance Issue",
  "General Feedback",
] as const;
export type FeedbackCategory = (typeof FEEDBACK_CATEGORIES)[number];

export const FEEDBACK_STATUSES = [
  "New",
  "Under Review",
  "Planned",
  "Resolved",
  "Archived",
] as const;
export type FeedbackStatus = (typeof FEEDBACK_STATUSES)[number];

/** Columns shown on the Feedback Board. */
export const BOARD_COLUMNS: FeedbackStatus[] = [
  "New",
  "Under Review",
  "Planned",
  "Resolved",
  "Archived",
];

export const FEEDBACK_PRIORITIES = ["Critical", "High", "Medium", "Low"] as const;
export type FeedbackPriority = (typeof FEEDBACK_PRIORITIES)[number];

export const FEEDBACK_SOURCES = [
  "In-app widget",
  "Interview",
  "Survey",
  "Email",
  "Support ticket",
  "Sales call",
  "Community forum",
] as const;
export type FeedbackSource = (typeof FEEDBACK_SOURCES)[number];

/** Request statuses — deliberately separate from review statuses. */
export const FEATURE_REQUEST_STATUSES = [
  "New",
  "Under Review",
  "Planned",
  "Declined",
  "Delivered",
] as const;
export type FeatureRequestStatus = (typeof FEATURE_REQUEST_STATUSES)[number];

export const THEME_IMPORTANCE = ["High", "Medium", "Low"] as const;
export type ThemeImportance = (typeof THEME_IMPORTANCE)[number];

/** Manually picked follow-up options shown in the feedback detail view. */
export const NEXT_ACTIONS = [
  "No action yet",
  "Reproduce and file a bug",
  "Schedule a follow-up interview",
  "Review with the product team",
  "Add to roadmap candidates",
  "Share with design for an audit",
  "Close after the next release",
] as const;
export type NextAction = (typeof NEXT_ACTIONS)[number];

export type FeedbackProductId = FeedbackProduct["id"];

export type FeedbackItem = {
  id: string;
  productId: FeedbackProductId;
  title: string;
  /** Short user-voice excerpt shown in lists. */
  excerpt: string;
  /** Full mock feedback content shown in the detail view. */
  description: string;
  category: FeedbackCategory;
  source: FeedbackSource | string;
  date: string;
  priority: FeedbackPriority;
  status: FeedbackStatus;
  productArea?: string;
  /** Internal team note — never user-submitted content. */
  internalNotes?: string;
  /** Manually selected next action. */
  followUpAction?: NextAction | string;
};

export type Theme = {
  id: string;
  productId: FeedbackProductId;
  name: string;
  explanation: string;
  relatedFeedbackIds: string[];
  productArea: string;
  /** Manually assigned importance — never scored. */
  importance: ThemeImportance;
  reviewStatus: FeedbackStatus;
  /** Internal research notes for the theme detail panel. */
  internalNotes?: string;
};

export type FeatureRequest = {
  id: string;
  productId: FeedbackProductId;
  title: string;
  description: string;
  userProblem: string;
  requestedCapability: string;
  relatedFeedbackIds: string[];
  productArea: string;
  priority: FeedbackPriority;
  status: FeatureRequestStatus;
  roadmapReference?: string;
};

/** Static, hand-written definition of a product area. */
export type ProductAreaDefinition = {
  id: string;
  productId: FeedbackProductId;
  name: string;
  description: string;
  summary: string;
};

/** A product area with counts derived from the mock records themselves. */
export type ProductArea = ProductAreaDefinition & {
  feedbackCount: number;
  openIssues: number;
  featureRequests: number;
};

/** Payload of the Add Feedback dialog — local state only. */
export type FeedbackDraft = {
  title: string;
  description: string;
  category: FeedbackCategory;
  source: FeedbackSource;
  priority: FeedbackPriority;
  productArea: string;
};

export const FEEDBACK_SECTIONS = [
  "Inbox",
  "Feedback Board",
  "Themes & Insights",
  "Feature Requests",
  "Product Areas",
] as const;
export type FeedbackSection = (typeof FEEDBACK_SECTIONS)[number];
