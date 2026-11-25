import Image from "next/image";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { logout } from "@/app/admin/actions";
import { AdminNav } from "@/components/admin/admin-nav";
import { requireAdmin } from "@/lib/admin";

export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const { admin } = await requireAdmin();

  return (
    <>
      <header className="sticky top-0 z-30 bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 sm:gap-6 sm:px-6">
          <Link href="/admin" className="flex shrink-0 items-center gap-2.5 py-3">
            <Image
              src="/global/atc-icon-white.svg"
              alt="ATC China Brasil"
              width={1205}
              height={375}
              priority
              className="h-5 w-auto sm:h-6"
            />
            <span className="hidden border-l border-white/25 pl-2.5 text-sm text-primary-foreground/80 sm:inline">
              Painel
            </span>
          </Link>
          <AdminNav />
          <div className="ml-auto flex items-center gap-3">
            <span className="hidden max-w-48 truncate text-xs text-primary-foreground/70 md:inline">
              {admin.name || admin.email}
            </span>
            <form action={logout}>
              <button
                type="submit"
                className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/20 px-3 text-sm text-primary-foreground/80 transition-colors hover:border-white/40 hover:text-primary-foreground"
              >
                <LogOut className="size-4" aria-hidden />
                <span className="hidden sm:inline">Sair</span>
                <span className="sr-only sm:hidden">Sair</span>
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 pt-6 pb-16 sm:px-6 sm:pt-8">{children}</main>
    </>
  );
}
