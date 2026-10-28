import type { Metadata } from "next";

import LaunchCenterPage from "@/components/launch-center/launch-center-page";

export const metadata: Metadata = {
  title: "Launch Center — Foundry",
  description:
    "Prepare your product for release with a clear launch plan, organized launch assets, and a focused readiness checklist.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <LaunchCenterPage />;
}
