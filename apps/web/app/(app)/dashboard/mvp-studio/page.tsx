import type { Metadata } from "next";

import MVPStudioPage from "@/components/mvp-studio/mvp-studio-page";

export const metadata: Metadata = {
  title: "MVP Studio — Foundry",
  description:
    "Turn your validated idea into a focused, buildable first version by defining essential features, setting boundaries, and organizing product specifications.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <MVPStudioPage />;
}
