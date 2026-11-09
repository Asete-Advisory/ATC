import type { Language } from "@/lib/i18n";
import { productCatalog } from "@/lib/product-catalog";

type CatalogSectionProps = {
  lang: Language;
};

export function CatalogSection({ lang }: CatalogSectionProps) {
  const content = productCatalog[lang];

  return (
    <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(90,209,255,0.2),transparent_28%),linear-gradient(180deg,rgba(8,24,48,0.04),transparent_18%),linear-gradient(135deg,#f8fbff_0%,#eef4fa_100%)]">
      <div className="mx-auto max-w-6xl px-6 pt-28 pb-16 sm:pt-36 sm:pb-20 md:pt-40">
        <div className="motion-reveal max-w-3xl">
          <span className="inline-flex rounded-full border border-accent/30 bg-white/70 px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
            {content.eyebrow}
          </span>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-primary sm:text-5xl">
            {content.title}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {content.description}
          </p>
        </div>

        <div className="mt-12 space-y-12">
          {content.categories.map((category, index) => (
            <section
              key={category.id}
              className="motion-card motion-reveal-soft rounded-4xl border border-white/70 bg-white/80 p-6 shadow-[0_24px_80px_-48px_rgba(8,24,48,0.45)] backdrop-blur sm:p-8 hover:border-accent/45"
              style={{ animationDelay: `${index * 90}ms` }}
            >
              <div className="max-w-2xl">
                <h2 className="text-2xl font-semibold text-primary sm:text-3xl">
                  {category.title}
                </h2>
                <p className="mt-2 text-sm font-semibold uppercase tracking-[0.18em] text-accent">
                  {category.tagline}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {category.description}
                </p>
              </div>

              <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {category.products.map((product, productIndex) => (
                  <li
                    key={product}
                    className="motion-reveal-soft flex min-h-14 items-center rounded-xl border border-border/70 bg-background/70 px-4 py-3 text-sm font-medium leading-snug text-foreground shadow-sm transition-colors hover:border-accent/35 hover:bg-background"
                    style={{
                      animationDelay: `${index * 90 + productIndex * 35}ms`,
                    }}
                  >
                    {product}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
