import type { ReactNode } from "react";

import DashboardShell from "@/components/dashboard/shell";

import { Providers } from "./providers";

export const instant = false;

/** Dashboard chrome: ink sidebar, sticky top bar, content canvas. */
export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <Providers>
      <DashboardShell>{children}</DashboardShell>
    </Providers>
  );
}
