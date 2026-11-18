import { Suspense } from "react";
import type { Metadata } from "next";

import { ValidationLabRoute } from "@/components/validation-lab/validation-lab-page";
import { ValidationSkeleton } from "@/components/validation-lab/badges";

export const metadata: Metadata = {
  title: "Validation Lab — Foundry",
  description:
    "Challenge your assumptions, design meaningful experiments, and gather evidence before committing to a product direction.",
  robots: { index: false, follow: false },
};

// The page reads `?product=`/`?ideaId=` via `useSearchParams` and loads its data
// on the client, so the segment drops to its Suspense fallback during
// prerendering. Opt out, like the other client-fetch driven pages.
export const instant = false;

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col gap-4">
          <ValidationSkeleton />
        </div>
      }
    >
      <ValidationLabRoute />
    </Suspense>
  );
}
