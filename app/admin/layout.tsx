import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Painel | ATC China Brasil", template: "%s | Painel ATC" },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-dvh bg-muted/60 text-foreground">{children}</div>;
}
