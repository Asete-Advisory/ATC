import Image from "next/image";
import { copy, type Language } from "@/lib/i18n";

const authorityImages = [
  "/authority-media-section/images/img32.jpeg",
  "/authority-media-section/images/img7.jpeg",
  "/authority-media-section/images/img41.jpeg",
  "/authority-media-section/images/img18.jpeg",
  "/authority-media-section/images/img2.jpeg",
  "/authority-media-section/images/img27.jpeg",
  "/authority-media-section/images/img14.jpeg",
  "/authority-media-section/images/img39.jpeg",
  "/authority-media-section/images/img5.jpeg",
  "/authority-media-section/images/img22.jpeg",
  "/authority-media-section/images/img11.jpeg",
  "/authority-media-section/images/img44.jpeg",
  "/authority-media-section/images/img8.jpeg",
  "/authority-media-section/images/img30.jpeg",
  "/authority-media-section/images/img16.jpeg",
  "/authority-media-section/images/img25.jpeg",
  "/authority-media-section/images/img3.jpeg",
  "/authority-media-section/images/img36.jpeg",
  "/authority-media-section/images/img10.jpeg",
  "/authority-media-section/images/img21.jpeg",
  "/authority-media-section/images/img1.jpeg",
  "/authority-media-section/images/img45.jpeg",
  "/authority-media-section/images/img15.jpeg",
  "/authority-media-section/images/img28.jpeg",
  "/authority-media-section/images/img6.jpeg",
  "/authority-media-section/images/img34.jpeg",
  "/authority-media-section/images/img13.jpeg",
  "/authority-media-section/images/img24.jpeg",
  "/authority-media-section/images/img4.jpeg",
  "/authority-media-section/images/img40.jpeg",
  "/authority-media-section/images/img17.jpeg",
  "/authority-media-section/images/img29.jpeg",
  "/authority-media-section/images/img9.jpeg",
  "/authority-media-section/images/img37.jpeg",
  "/authority-media-section/images/img12.jpeg",
  "/authority-media-section/images/img20.jpeg",
  "/authority-media-section/images/img43.jpeg",
  "/authority-media-section/images/img26.jpeg",
  "/authority-media-section/images/img33.jpeg",
  "/authority-media-section/images/img19.jpeg",
  "/authority-media-section/images/img42.jpeg",
  "/authority-media-section/images/img31.jpeg",
  "/authority-media-section/images/img23.jpeg",
  "/authority-media-section/images/img38.jpeg",
  "/authority-media-section/images/img35.jpeg",
] as const;

type AuthorityMediaSectionProps = {
  content: (typeof copy)[Language]["authorityMedia"];
};

export function AuthorityMediaSection({ content }: AuthorityMediaSectionProps) {
  const marqueeImages = [...authorityImages, ...authorityImages];

  return (
    <section
      id="autoridade"
      className="relative overflow-hidden bg-primary py-16 text-primary-foreground md:py-32"
    >
      <Image
        src="/authority-media-section/featured/aut_6.jpeg"
        alt=""
        loading="eager"
        fill
        aria-hidden
        className="object-cover"
        sizes="100vw"
      />
      <div
        className="absolute inset-0 bg-[linear-gradient(90deg,hsl(from_var(--primary)_h_s_l/0.84),hsl(from_var(--primary)_h_s_l/0.44)_50%,hsl(from_var(--primary)_h_s_l/0.78)),linear-gradient(0deg,hsl(from_var(--primary)_h_s_l/0.72),transparent_45%),radial-gradient(circle_at_20%_10%,hsl(from_var(--accent)_h_s_l/0.18),transparent_32%)]"
        aria-hidden
      />
      <div
        className="absolute inset-x-6 top-0 h-px bg-linear-to-r from-transparent via-white/20 to-transparent"
        aria-hidden
      />
      <div
        className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-primary/80 to-transparent"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16">
          <div className="motion-card motion-reveal-soft relative overflow-hidden rounded-2xl border border-white/15 bg-white/5 shadow-2xl shadow-black/20">
            <video
              className="aspect-video w-full object-cover"
              src="/authority-media-section/video/video_media_optimized.mp4"
              autoPlay
              muted
              loop
              playsInline
              controls
            />
            <div
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,hsl(from_var(--primary)_h_s_l/0.46),hsl(from_var(--accent)_h_s_l/0.2)),linear-gradient(0deg,hsl(from_var(--primary)_h_s_l/0.34),transparent_55%)] mix-blend-color"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-0 bg-primary/14"
              aria-hidden
            />
          </div>

          <div className="motion-reveal">
            <span className="text-xs uppercase tracking-[0.2em] text-accent font-mono">
              {content.eyebrow}
            </span>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-balance md:text-4xl">
              {content.title}
            </h2>
            <p className="mt-4 max-w-xl leading-relaxed text-white/72">
              {content.description}
            </p>
          </div>
        </div>
      </div>

      <div className="relative mt-12 overflow-hidden sm:mt-16">
        <div className="media-marquee flex w-max gap-4 pr-4">
          {marqueeImages.map((src, index) => (
            <div
              key={`${src}-${index}`}
              className="motion-card relative h-44 w-72 shrink-0 overflow-hidden rounded-2xl border border-white/15 bg-white/8 sm:h-56 sm:w-88 hover:border-accent/45"
            >
              <Image
                src={src}
                alt={content.imageAlt}
                fill
                sizes="(min-width: 640px) 352px, 288px"
                className="object-cover saturate-105"
              />
              <div
                className="absolute inset-0 bg-[linear-gradient(90deg,hsl(from_var(--primary)_h_s_l/0.46),hsl(from_var(--accent)_h_s_l/0.2)),linear-gradient(0deg,hsl(from_var(--primary)_h_s_l/0.34),transparent_55%)] mix-blend-color"
                aria-hidden
              />
              <div className="absolute inset-0 bg-primary/14" aria-hidden />
              <div
                className="absolute inset-0 ring-1 ring-inset ring-white/10"
                aria-hidden
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
