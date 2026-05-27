import Image from "next/image";
import { copy, type Language } from "@/lib/i18n";

const stepImages = [
  "/how-it-works/estrategico-1.webp",
  "/how-it-works/validacao-1.webp",
  "/how-it-works/entrega-1.webp",
];

type HowItWorksProps = {
  content: (typeof copy)[Language]["howItWorks"];
};

export function HowItWorks({ content }: HowItWorksProps) {
  return (
    <section
      id="como-funciona"
      className="relative overflow-hidden pb-16 pt-10 md:pb-32 md:pt-20 bg-[linear-gradient(180deg,hsl(from_var(--primary)_h_s_l/0.045),hsl(from_var(--accent)_h_s_l/0.035)_48%,var(--background))]"
    >
      <div
        className="absolute right-0 top-10 h-56 w-56 rounded-full border border-primary/10 bg-primary/5 blur-3xl"
        aria-hidden
      />
      <div className="relative mx-auto max-w-6xl px-6">
        <div className="motion-reveal max-w-2xl">
          <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-mono">
            {content.eyebrow}
          </span>
          <h2 className="mt-4 text-3xl md:text-4xl font-semibold tracking-tight text-foreground text-balance">
            {content.title}
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            {content.description}
          </p>
        </div>

        <ol className="mt-10 sm:mt-14 grid gap-5 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
          {content.steps.map((step, i) => {
            return (
              <li
                key={step.title}
                className="motion-card motion-reveal-soft group relative overflow-hidden rounded-xl border border-primary/10 bg-background shadow-sm shadow-primary/5 hover:border-accent/40"
                style={{ animationDelay: `${120 + i * 90}ms` }}
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-primary/8">
                  <Image
                    src={stepImages[i]}
                    alt=""
                    loading="eager"
                    fill
                    aria-hidden
                    className="object-cover transition duration-500 group-hover:scale-[1.03]"
                    sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-primary/55 via-primary/5 to-transparent"
                    aria-hidden
                  />
                </div>
                <div className="p-6 sm:p-7">
                  <h3 className="text-lg font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
