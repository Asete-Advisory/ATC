"use client";

import { useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { cn } from "@/lib/utils";

type Day = { date: string; pageviews: number; visitors: number; leads: number };
type Bucket = Day & { label: string; short: string };

const fmt = new Intl.NumberFormat("pt-BR");
const dayFormat = (date: string, options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC", ...options }).format(
    new Date(`${date}T12:00:00Z`),
  );

/** Acima de ~4 meses, agrupa por semana para as barras continuarem legíveis. */
function toBuckets(days: Day[]): Bucket[] {
  if (days.length <= 120) {
    return days.map((day) => ({
      ...day,
      label: dayFormat(day.date, { weekday: "short", day: "2-digit", month: "short" }),
      short: dayFormat(day.date, { day: "2-digit", month: "2-digit" }),
    }));
  }
  const buckets: Bucket[] = [];
  for (let i = 0; i < days.length; i += 7) {
    const week = days.slice(i, i + 7);
    const first = week[0].date;
    const last = week[week.length - 1].date;
    buckets.push({
      date: first,
      pageviews: week.reduce((sum, day) => sum + day.pageviews, 0),
      // Soma dos visitantes diários (a mesma pessoa em dois dias conta duas vezes).
      visitors: week.reduce((sum, day) => sum + day.visitors, 0),
      leads: week.reduce((sum, day) => sum + day.leads, 0),
      label: `${dayFormat(first, { day: "2-digit", month: "short" })} a ${dayFormat(last, { day: "2-digit", month: "short" })}`,
      short: dayFormat(first, { day: "2-digit", month: "2-digit" }),
    });
  }
  return buckets;
}

function niceMax(value: number) {
  if (value <= 4) return 4;
  const magnitude = 10 ** Math.floor(Math.log10(value));
  const steps = [1, 2, 2.5, 5, 10];
  const step = steps.find((item) => item * magnitude >= value) ?? 10;
  return step * magnitude;
}

type PanelProps = {
  buckets: Bucket[];
  metric: "visitors" | "leads";
  title: string;
  height: string;
  barClassName: string;
  active: number | null;
};

function BarPanel({ buckets, metric, title, height, barClassName, active }: PanelProps) {
  const max = niceMax(Math.max(...buckets.map((bucket) => bucket[metric]), 0));

  return (
    <div>
      <p className="mb-2 text-xs font-medium text-muted-foreground">{title}</p>
      <div className="relative">
        {/* Grade discreta: 0, metade e topo. */}
        <div className={cn("pointer-events-none absolute inset-0 flex flex-col justify-between", height)}>
          {[max, max / 2, 0].map((tick) => (
            <div key={tick} className="flex items-center gap-2">
              <span className="w-8 shrink-0 text-right text-[10px] tabular-nums text-muted-foreground/80">
                {fmt.format(tick)}
              </span>
              <span className="h-px flex-1 bg-border/70" />
            </div>
          ))}
        </div>
        <div className={cn("ml-10 flex items-end gap-[2px]", height)}>
          {buckets.map((bucket, index) => {
            const value = bucket[metric];
            return (
              <div key={bucket.date} className="flex h-full min-w-0 flex-1 items-end">
                <div
                  className={cn(
                    "w-full rounded-t-[4px] transition-opacity",
                    barClassName,
                    active !== null && active !== index && "opacity-45",
                  )}
                  style={{
                    height: value ? `max(${(value / max) * 100}%, 3px)` : "0px",
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function DailyChart({ days }: { days: Day[] }) {
  const buckets = useMemo(() => toBuckets(days), [days]);
  const weekly = buckets.length !== days.length;
  const [active, setActive] = useState<number | null>(null);
  const plotRef = useRef<HTMLDivElement>(null);

  const pick = (event: PointerEvent<HTMLDivElement>) => {
    const rect = plotRef.current?.getBoundingClientRect();
    if (!rect) return;
    // As barras começam depois da coluna de valores (ml-10 = 40px).
    const axis = 40;
    const x = event.clientX - rect.left - axis;
    const index = Math.floor((x / (rect.width - axis)) * buckets.length);
    setActive(Math.min(buckets.length - 1, Math.max(0, index)));
  };

  const onKey = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    setActive((current) => {
      const start = current ?? buckets.length - 1;
      const next = start + (event.key === "ArrowRight" ? 1 : -1);
      return Math.min(buckets.length - 1, Math.max(0, next));
    });
  };

  const current = active !== null ? buckets[active] : null;
  const ticks = [0, Math.floor((buckets.length - 1) / 2), buckets.length - 1].filter(
    (value, index, list) => list.indexOf(value) === index,
  );

  return (
    <div>
      <div className="relative">
        <div
          ref={plotRef}
          role="img"
          tabIndex={0}
          aria-label={`Visitantes e leads por ${weekly ? "semana" : "dia"}. Use as setas para ver cada ${weekly ? "semana" : "dia"}.`}
          onPointerMove={pick}
          onPointerDown={pick}
          onPointerLeave={() => setActive(null)}
          onKeyDown={onKey}
          onBlur={() => setActive(null)}
          className="space-y-5 rounded-lg outline-none focus-visible:ring-4 focus-visible:ring-accent/20"
        >
          <BarPanel
            buckets={buckets}
            metric="visitors"
            title={weekly ? "Visitantes por semana" : "Visitantes por dia"}
            height="h-40 sm:h-48"
            barClassName="bg-chart-1"
            active={active}
          />
          <BarPanel
            buckets={buckets}
            metric="leads"
            title={weekly ? "Leads por semana" : "Leads por dia"}
            height="h-16 sm:h-20"
            barClassName="bg-chart-2"
            active={active}
          />
        </div>

        {current && active !== null ? (
          <div
            className="pointer-events-none absolute top-0 z-10 w-44 -translate-x-1/2 rounded-xl border border-border bg-background/95 p-3 text-xs shadow-lg backdrop-blur"
            style={{
              left: `clamp(5.5rem, calc(2.5rem + (100% - 2.5rem) * ${(active + 0.5) / buckets.length}), calc(100% - 5.5rem))`,
            }}
          >
            <p className="mb-1.5 font-medium text-foreground first-letter:uppercase">
              {current.label}
            </p>
            <dl className="space-y-1">
              {[
                ["Visitantes", current.visitors, "bg-chart-1"],
                ["Leads", current.leads, "bg-chart-2"],
                ["Páginas vistas", current.pageviews, ""],
              ].map(([label, value, swatch]) => (
                <div key={label as string} className="flex items-center justify-between gap-3">
                  <dt className="flex items-center gap-1.5 text-muted-foreground">
                    {swatch ? <span className={cn("size-2 rounded-sm", swatch as string)} /> : null}
                    {label}
                  </dt>
                  <dd className="font-medium tabular-nums text-foreground">
                    {fmt.format(value as number)}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        ) : null}
      </div>

      <div className="relative mt-2 ml-10 h-4 text-[10px] text-muted-foreground">
        {ticks.map((index) => (
          <span
            key={index}
            className="absolute -translate-x-1/2 tabular-nums first:translate-x-0 last:-translate-x-full"
            style={{ left: `${(index / Math.max(buckets.length - 1, 1)) * 100}%` }}
          >
            {buckets[index].short}
          </span>
        ))}
      </div>

      <details className="mt-4 text-sm">
        <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
          Ver em tabela
        </summary>
        <div className="mt-3 max-h-72 overflow-auto rounded-lg border border-border">
          <table className="w-full text-left text-xs">
            <thead className="sticky top-0 bg-secondary text-muted-foreground">
              <tr>
                <th className="px-3 py-2 font-medium">{weekly ? "Semana" : "Dia"}</th>
                <th className="px-3 py-2 text-right font-medium">Visitantes</th>
                <th className="px-3 py-2 text-right font-medium">Páginas vistas</th>
                <th className="px-3 py-2 text-right font-medium">Leads</th>
              </tr>
            </thead>
            <tbody>
              {[...buckets].reverse().map((bucket) => (
                <tr key={bucket.date} className="border-t border-border">
                  <td className="px-3 py-1.5 first-letter:uppercase">{bucket.label}</td>
                  <td className="px-3 py-1.5 text-right tabular-nums">{fmt.format(bucket.visitors)}</td>
                  <td className="px-3 py-1.5 text-right tabular-nums">{fmt.format(bucket.pageviews)}</td>
                  <td className="px-3 py-1.5 text-right tabular-nums">{fmt.format(bucket.leads)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}
