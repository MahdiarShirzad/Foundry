import type { Metadata } from "next";

import FeedbackHubPage from "@/components/feedback-hub/feedback-hub-page";

export const metadata: Metadata = {
  title: "Feedback Hub — Foundry",
  description:
    "Understand what users are saying, organize product feedback, and turn real customer experiences into informed product improvements.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <FeedbackHubPage />;
}
