import { Suspense } from "react";
import type { Metadata } from "next";

import { IdeaLabRoute } from "@/components/idea-lab/idea-lab-page";
import { IdeaLabSkeleton } from "@/components/idea-lab/idea-lab-skeleton";
import { DEFAULT_IDEA_CATEGORIES } from "@/lib/idea-lab/categories";

export const metadata: Metadata = {
  title: "Idea Lab",
  description:
    "The first stage of the Foundry cycle: capture, organize and shape early product ideas into structured opportunities.",
  robots: { index: false, follow: false },
};

export default function Page() {
  // Single injection point for category options: swap this list for an API
  // call when the backend exposes them.
  return (
    <Suspense
      fallback={
        <div className="flex flex-col gap-4">
          <IdeaLabSkeleton />
        </div>
      }
    >
      <IdeaLabRoute categoryOptions={DEFAULT_IDEA_CATEGORIES} />
    </Suspense>
  );
}
