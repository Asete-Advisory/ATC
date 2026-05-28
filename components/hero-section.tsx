import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroVideoBackground } from "@/components/hero-video-background";
import { copy, localizedPath, type Language } from "@/lib/i18n";

type HeroSectionProps = {
  lang: Language;
  content: (typeof copy)[Language]["hero"];
};

const statImages = [
  {
    src: "/global/porto.webp",
    position: "center",
  },
  {
    src: "/global/industry.jpg",
    position: "center 62%",
  },
  {
    src: "/audience-section/distributors.webp",
    position: "center",
  },
] as const;

export function HeroSection({ lang, content }: HeroSectionProps) {
  return (
    <section
      id="inicio"
      className="relative isolate min-h-svh overflow-hidden pt-[5.25rem] md:pt-[6.75rem]"
    >
      <div className="absolute inset-0 -z-10">
        <HeroVideoBackground />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(7,22,37,0.92) 0%, rgba(8,24,48,0.64) 18%, rgba(8,24,48,0.65) 55%, rgba(8,24,48,0.85) 100%)",
          }}
        />
      </div>

      <div className="mx-auto flex min-h-[calc(100svh-5.25rem)] w-full max-w-6xl flex-col px-5 pt-8 pb-6 sm:px-6 sm:pt-16 sm:pb-7 md:min-h-[calc(100svh-6.75rem)] md:pt-20 md:pb-8">
        <div className="max-w-4xl">
          <h1 className="motion-reveal mt-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-white text-balance">
            {content.title}
          </h1>

          <p className="motion-reveal mt-5 text-base md:text-xl text-white/82 max-w-3xl leading-relaxed text-pretty [animation-delay:120ms]">
            {content.description}
          </p>

          <div className="motion-reveal mt-8 sm:mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-3 [animation-delay:260ms]">
            <Button
              asChild
              size="lg"
              className="rounded-full px-6 h-12 bg-white text-foreground hover:bg-white/90"
            >
              <a
                href={localizedPath(lang, "/catalogo")}
                className="inline-flex items-center gap-2"
              >
                {content.primaryCtaLabel}
                <ArrowRight className="size-4" />
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="ghost"
              className="rounded-full px-6 h-12 text-white hover:bg-white/10 hover:text-white"
            >
              <a href={localizedPath(lang, "/news")}>
                {content.secondaryCtaLabel}
              </a>
            </Button>
          </div>

          <div className="mt-8 grid max-w-4xl gap-3 sm:mt-12 sm:grid-cols-3 sm:gap-4 lg:mt-14">
            {content.stats.map((stat, index) => (
              <article
                key={stat.label}
                className="motion-reveal-soft group relative min-h-32 overflow-hidden rounded-xl border border-white/14 bg-white/8 shadow-[0_18px_50px_-34px_rgba(0,0,0,0.9)] backdrop-blur-sm sm:min-h-44"
                style={{ animationDelay: `${360 + index * 90}ms` }}
              >
                <Image
                  src={statImages[index]?.src ?? statImages[0].src}
                  alt=""
                  fill
                  aria-hidden
                  loading="eager"
                  className="object-cover opacity-72 saturate-110 transition duration-700 group-hover:scale-[1.04]"
                  sizes="(min-width: 640px) 33vw, 100vw"
                  style={{
                    objectPosition:
                      statImages[index]?.position ?? statImages[0].position,
                  }}
                />
                <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.16),transparent_38%),linear-gradient(180deg,rgba(7,22,37,0.28),rgba(7,22,37,0.9)_72%,rgba(7,22,37,0.96)),linear-gradient(90deg,rgba(7,22,37,0.58),rgba(7,22,37,0.14))]" />
                <div className="absolute inset-x-4 bottom-4 sm:bottom-5">
                  <p className="font-mono text-xl font-semibold text-white sm:text-2xl lg:text-3xl">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs leading-snug text-white/62 sm:text-sm">
                    {stat.label}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-auto pt-8 sm:pt-10" />
      </div>
    </section>
  );
}
