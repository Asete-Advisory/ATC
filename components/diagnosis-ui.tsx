import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

/** Peças visuais compartilhadas pelo diagnóstico e pelo formulário de dúvidas. */

export const diagnosisCardClassName =
  "flex flex-col scroll-mt-6 rounded-2xl border border-border bg-card px-5 py-6 shadow-[0_18px_48px_-28px_rgba(7,22,37,0.28)] sm:px-8 sm:py-8";

export const diagnosisEnterClassName =
  "motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-2 motion-safe:duration-500";

export const diagnosisOptionClassName =
  "group flex w-full items-start gap-3 rounded-xl border border-[#d5dde6] bg-white px-4 py-3.5 text-left text-[15px] leading-snug text-foreground transition-[border-color,background-color,opacity,transform] duration-150 hover:border-accent/60 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/15 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-45";

export const diagnosisOptionSelectedClassName = "border-accent bg-accent/8";

export const diagnosisInputClassName =
  "w-full rounded-xl border border-[#d5dde6] bg-white px-4 text-base text-foreground outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-muted-foreground/60 hover:border-accent/50 focus:border-accent focus:ring-4 focus:ring-accent/15 aria-invalid:border-red-500/80 aria-invalid:focus:ring-red-500/15 sm:text-[15px]";

/** Indicador de rádio (escolha única) ou de checkbox (múltipla escolha). */
export function OptionIndicator({
  selected,
  multiple = false,
}: {
  selected: boolean;
  multiple?: boolean;
}) {
  if (multiple) {
    return (
      <span
        aria-hidden
        className={cn(
          "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors",
          selected
            ? "border-accent bg-accent text-white"
            : "border-[#c9d3de] group-hover:border-accent/60",
        )}
      >
        <Check
          className={cn(
            "size-3.5 stroke-[3] transition-transform duration-150",
            selected ? "scale-100" : "scale-0",
          )}
        />
      </span>
    );
  }

  return (
    <span
      aria-hidden
      className={cn(
        "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
        selected ? "border-accent" : "border-[#c9d3de] group-hover:border-accent/60",
      )}
    >
      <span
        className={cn(
          "size-2.5 rounded-full bg-accent transition-transform duration-150",
          selected ? "scale-100" : "scale-0",
        )}
      />
    </span>
  );
}
