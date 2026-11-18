import { Suspense } from "react";
import type { Metadata } from "next";

import { MVPStudioRoute } from "@/components/mvp-studio/mvp-studio-page";
import { MVPStudioSkeleton } from "@/components/mvp-studio/badges";

export const metadata: Metadata = {
  title: "MVP Studio — Foundry",
  description:
    "Turn your validated idea into a focused, buildable first version by defining essential features, setting boundaries, and organizing product specifications.",
  robots: { index: false, follow: false },
};

// The page reads `?product=` via `useSearchParams` and loads its data on the
// client, so the segment drops to its Suspense fallback during prerendering.
export const instant = false;

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col gap-4">
          <MVPStudioSkeleton />
        </div>
      }
    >
      <MVPStudioRoute />
    </Suspense>
  );
}
