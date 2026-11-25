import Link from "next/link";
import { PRESETS, type Range } from "@/lib/admin";
import { cn } from "@/lib/utils";

type RangePickerProps = {
  range: Range;
  /** Página atual, ex.: "/admin/leads". */
  basePath: string;
  /** Outros filtros da página que devem continuar ao trocar o período. */
  keep?: Record<string, string | undefined>;
};

const dateClassName =
  "min-h-10 rounded-full border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-accent focus:ring-4 focus:ring-accent/15";

export function RangePicker({ range, basePath, keep = {} }: RangePickerProps) {
  const kept = Object.entries(keep).filter(
    (entry): entry is [string, string] => entry[1] !== undefined && entry[1] !== "",
  );
  const href = (periodo: string) =>
    `${basePath}?${new URLSearchParams([...kept, ["periodo", periodo]])}`;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div
        role="group"
        aria-label="Período"
        className="flex rounded-full border border-border bg-background p-1"
      >
        {PRESETS.map((preset) => (
          <Link
            key={preset.id}
            href={href(preset.id)}
            aria-current={range.preset === preset.id ? "true" : undefined}
            className={cn(
              "inline-flex min-h-9 items-center rounded-full px-3 text-sm whitespace-nowrap transition-colors",
              range.preset === preset.id
                ? "bg-primary font-medium text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {preset.label}
          </Link>
        ))}
      </div>
      <form action={basePath} className="flex flex-wrap items-center gap-2">
        {kept.map(([key, value]) => (
          <input key={key} type="hidden" name={key} value={value} />
        ))}
        <label className="sr-only" htmlFor="range-from">
          De
        </label>
        <input
          id="range-from"
          type="date"
          name="de"
          defaultValue={range.from}
          className={dateClassName}
        />
        <span className="text-sm text-muted-foreground">até</span>
        <label className="sr-only" htmlFor="range-to">
          Até
        </label>
        <input id="range-to" type="date" name="ate" defaultValue={range.to} className={dateClassName} />
        <button
          type="submit"
          className={cn(
            "inline-flex min-h-10 items-center rounded-full border px-4 text-sm font-medium transition-colors",
            range.preset === "custom"
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-background hover:border-accent/40",
          )}
        >
          Aplicar
        </button>
      </form>
    </div>
  );
}
