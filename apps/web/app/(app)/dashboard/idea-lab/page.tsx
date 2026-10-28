import type { Metadata } from "next";

import IdeaLabPage from "@/components/idea-lab/idea-lab-page";

export const metadata: Metadata = {
  title: "Idea Lab",
  description:
    "The first stage of the Foundry cycle: capture, organize and shape early product ideas into structured opportunities.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <IdeaLabPage />;
}
