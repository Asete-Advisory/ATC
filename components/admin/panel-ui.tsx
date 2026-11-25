import type { ReactNode } from "react";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { formatNumber } from "@/lib/admin";
import { cn } from "@/lib/utils";

export function Card({
  title,
  description,
  action,
  children,
  className,
}: {
  title?: string;
  description?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn("min-w-0 rounded-2xl border border-border bg-background p-4 sm:p-6", className)}
    >
      {title || action ? (
        <div className="mb-4 flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
          <div>
            {title ? <h2 className="text-base font-semibold text-primary">{title}</h2> : null}
            {description ? (
              <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            ) : null}
          </div>
          {action}
        </div>
      ) : null}
      {children}
    </section>
  );
}

/** Variação em relação ao período anterior. */
function Delta({ current, previous }: { current: number; previous: number }) {
  if (!previous && !current) return null;
  if (!previous) {
    return <span className="text-xs text-muted-foreground">sem dados no período anterior</span>;
  }
  const change = (current - previous) / previous;
  const rounded = Math.round(change * 100);
  const Icon = rounded > 0 ? ArrowUpRight : rounded < 0 ? ArrowDownRight : Minus;
  return (
    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
      <Icon
        className={cn(
          "size-3.5",
          rounded > 0 && "text-emerald-600",
          rounded < 0 && "text-destructive",
        )}
        aria-hidden
      />
      <span className="tabular-nums">
        {rounded > 0 ? "+" : ""}
        {rounded}%
      </span>
      <span className="sm:hidden">vs. anterior</span>
      <span className="hidden sm:inline">vs. período anterior</span>
    </span>
  );
}

export function StatTile({
  label,
  value,
  current,
  previous,
  detail,
}: {
  label: string;
  value: string;
  current: number;
  previous: number;
  detail?: ReactNode;
}) {
  return (
    <div className="min-w-0 rounded-2xl border border-border bg-background p-4 sm:p-5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1.5 font-mono text-[1.75rem] leading-none font-semibold tabular-nums text-primary sm:text-3xl">
        {value}
      </p>
      <div className="mt-2.5 space-y-1">
        <Delta current={current} previous={previous} />
        {detail ? <p className="text-xs text-muted-foreground">{detail}</p> : null}
      </div>
    </div>
  );
}

/** Lista com barra de magnitude (uma só cor) atrás de cada linha. */
export function BarList({
  rows,
  empty,
}: {
  rows: { key: string; label: ReactNode; value: number; extra?: ReactNode }[];
  empty: string;
}) {
  if (!rows.length) {
    return <p className="py-6 text-center text-sm text-muted-foreground">{empty}</p>;
  }
  const max = Math.max(...rows.map((row) => row.value), 1);
  return (
    <ul className="space-y-1.5">
      {rows.map((row) => (
        <li key={row.key} className="relative flex min-h-9 items-center gap-3 px-3 text-sm">
          <span
            className="absolute inset-y-0 left-0 rounded-md bg-chart-4/35"
            style={{ width: `${(row.value / max) * 100}%` }}
            aria-hidden
          />
          <span className="relative min-w-0 flex-1 truncate">{row.label}</span>
          {row.extra ? (
            <span className="relative shrink-0 text-xs text-muted-foreground">{row.extra}</span>
          ) : null}
          <span className="relative w-12 shrink-0 text-right font-medium tabular-nums">
            {formatNumber(row.value)}
          </span>
        </li>
      ))}
    </ul>
  );
}
