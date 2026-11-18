import { Suspense } from "react";
import type { Metadata } from "next";

import { LaunchCenterRoute } from "@/components/launch-center/launch-center-page";
import { LaunchCenterSkeleton } from "@/components/launch-center/badges";

export const metadata: Metadata = {
  title: "Launch Center — Foundry",
  description:
    "Prepare your product for release with a clear launch plan, organized launch assets, and a focused readiness checklist.",
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
          <LaunchCenterSkeleton />
        </div>
      }
    >
      <LaunchCenterRoute />
    </Suspense>
  );
}
