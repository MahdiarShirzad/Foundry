"use client";

import { Dialog as SharedDialog } from "@/components/ui/primitives";

export function PresentationalDialog(props: React.ComponentProps<typeof SharedDialog>) {
  return <SharedDialog {...props} />;
}
