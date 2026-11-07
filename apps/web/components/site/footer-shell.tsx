"use client";

import { usePathname } from "next/navigation";
import Footer from "./footer";

export default function FooterShell() {
  const pathname = usePathname();
  return <Footer pathname={pathname} />;
}
