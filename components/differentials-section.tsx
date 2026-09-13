import { Check } from "lucide-react";
import Image from "next/image";
import { BrandLogo } from "@/components/brand-logo";
import { copy, type Language } from "@/lib/i18n";

type DifferentialsSectionProps = {
  content: (typeof copy)[Language]["differentials"];
};

export function DifferentialsSection({ content }: DifferentialsSectionProps) {
  return (
    <section id="diferenciais" className="py-16 md:py-32 bg-background">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-10 sm:gap-16 lg:grid-cols-2 lg:gap-20 items-center">
          <div className="motion-reveal-soft relative aspect-video sm:aspect-4/5 lg:aspect-auto lg:h-130 rounded-2xl overflow-hidden bg-primary">
            <Image
              src="/global/porto.webp"
              alt={content.imageAlt}
              fill
              loading="eager"
              className="object-cover"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
            <div className="absolute inset-0 flex items-center justify-center p-12">
              <BrandLogo
                alt=""
                loading="eager"
                sizes="280px"
                className="w-3/5 max-w-70 h-auto"
              />
            </div>
          </div>

          <div className="motion-reveal">
            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-mono">
              {content.eyebrow}
            </span>
            <h2 className="mt-4 text-3xl md:text-4xl font-semibold tracking-tight text-foreground text-balance">
              {content.title}
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed max-w-lg">
              {content.description}
            </p>

            <ul className="mt-8 space-y-5 sm:space-y-6">
              {content.items.map((item, index) => (
                <li
                  key={item.title}
                  className="motion-reveal-soft flex gap-4"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <span className="motion-icon mt-1 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                    <Check className="size-3.5" aria-hidden />
                  </span>
                  <div>
                    <h3 className="font-medium text-foreground">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
