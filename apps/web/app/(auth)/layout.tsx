import type { ReactNode } from "react";

import AuthRail, { AuthTopBar } from "@/components/auth/auth-rail";

/**
 * Auth screens get their own chrome: no marketing header or footer, one dark
 * brand rail beside a paper form column. Everything else on the site keeps the
 * `(site)` layout.
 */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col lg:grid lg:min-h-screen lg:grid-cols-[minmax(19rem,25rem)_minmax(0,1fr)]">
      <AuthTopBar />
      <AuthRail />
      <main className="flex flex-1 items-start justify-center px-6 pb-16 pt-12 sm:px-10 lg:items-center lg:py-16">
        <div className="w-full max-w-[25.5rem]">{children}</div>
      </main>
    </div>
  );
}
