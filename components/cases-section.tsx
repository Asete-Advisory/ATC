import Image from "next/image";
import { copy, type Language } from "@/lib/i18n";

const caseImages = [
  "/cases-section/automotive-industry.webp",
  "/cases-section/commodity-export.webp",
  "/cases-section/complex-industrial-operations.webp",
];

type CasesSectionProps = {
  content: (typeof copy)[Language]["cases"];
};

export function CasesSection({ content }: CasesSectionProps) {
  return (
    <section
      id="casos"
      className="relative overflow-hidden bg-[linear-gradient(180deg,hsl(from_var(--primary)_h_s_l_/_0.08),hsl(from_var(--background)_h_s_l)_44%,hsl(from_var(--accent)_h_s_l_/_0.08))] py-16 md:py-32"
    >
      <div
        className="absolute inset-0 bg-[linear-gradient(90deg,hsl(from_var(--primary)_h_s_l_/_0.08),transparent_46%,hsl(from_var(--primary)_h_s_l_/_0.06))]"
        aria-hidden
      />
      <div
        className="absolute right-0 top-1/4 h-36 w-1 bg-primary/55"
        aria-hidden
      />
      <div
        className="absolute -right-20 bottom-12 h-72 w-72 rounded-full border border-accent/15 bg-accent/8 blur-3xl"
        aria-hidden
      />
      <div className="relative mx-auto max-w-6xl px-6">
        <div className="motion-reveal flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-primary/70">
              {content.eyebrow}
            </span>
            <h2 className="mt-4 text-3xl md:text-4xl font-semibold tracking-tight text-foreground text-balance">
              {content.title}
            </h2>
          </div>
          <p className="max-w-sm font-medium leading-relaxed text-foreground/72">
            {content.description}
          </p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-12 lg:grid-rows-2">
          {content.items.map((item, index) => {
            return (
              <article
                key={item.title}
                className={[
                  "motion-card motion-reveal-soft group relative min-h-[340px] overflow-hidden rounded-lg border border-white/18 bg-primary shadow-sm shadow-primary/10",
                  "hover:border-accent/45",
                  index === 0
                    ? "lg:col-span-7 lg:row-span-2 lg:min-h-[560px]"
                    : "lg:col-span-5 lg:min-h-[268px]",
                ].join(" ")}
                style={{ animationDelay: `${index * 90}ms` }}
              >
                <Image
                  src={caseImages[index]}
                  alt={item.title}
                  fill
                  loading={index === 0 ? "eager" : "lazy"}
                  className="object-cover transition duration-700 group-hover:scale-[1.035]"
                  sizes={
                    index === 0
                      ? "(min-width: 1024px) 58vw, 100vw"
                      : "(min-width: 1024px) 42vw, 100vw"
                  }
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-primary/92 via-primary/36 to-primary/4"
                  aria-hidden
                />
                <div
                  className="absolute inset-0 bg-[linear-gradient(90deg,hsl(from_var(--primary)_h_s_l_/_0.42),transparent_62%)]"
                  aria-hidden
                />
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                  <h3 className="max-w-xl text-xl font-semibold tracking-tight text-white sm:text-2xl">
                    {item.title}
                  </h3>
                  <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/78 sm:text-base">
                    {item.desc}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
