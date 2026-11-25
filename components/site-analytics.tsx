"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { sendPageview } from "@/lib/site-analytics";

// O painel e a tela de exibição (/show, ligada o dia todo) não contam visitas.
const IGNORED = [/^\/admin(\/|$)/, /^\/show(\/|$)/];

export function SiteAnalytics() {
  const pathname = usePathname();
  const last = useRef<{ path: string; at: number } | null>(null);

  useEffect(() => {
    if (!pathname || IGNORED.some((pattern) => pattern.test(pathname))) return;

    // Evita contar duas vezes a mesma página (Strict Mode, re-render).
    const now = Date.now();
    if (last.current?.path === pathname && now - last.current.at < 2000) return;
    last.current = { path: pathname, at: now };

    sendPageview(pathname);
  }, [pathname]);

  return null;
}
