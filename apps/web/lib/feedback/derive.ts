import type { FeedbackItem } from "../feedback-hub/types";

/**
 * Compact counts used by the page header and the overview strip. Every figure
 * is read from the loaded records; nothing is sampled or scored.
 */
export function feedbackStats(feedback: FeedbackItem[]) {
  return {
    total: feedback.length,
    awaiting: feedback.filter((item) => item.status === "New").length,
    highPriority: feedback.filter(
      (item) => item.priority === "Critical" || item.priority === "High",
    ).length,
    featureRequests: feedback.filter(
      (item) => item.category === "Feature Request",
    ).length,
    reviewed: feedback.filter(
      (item) => item.status !== "New" && item.status !== "Archived",
    ).length,
    lastActivity: feedback
      .map((item) => item.date)
      .sort()
      .at(-1),
  };
}
