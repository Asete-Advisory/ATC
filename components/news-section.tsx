import { ArrowUpRight, Newspaper } from "lucide-react";
import { copy, type Language } from "@/lib/i18n";
import {
  infoMoneyFeedKeys,
  type InfoMoneyFeedKey,
  type NewsItem,
} from "@/lib/infomoney-news";

type NewsSectionProps = {
  activeFeed: InfoMoneyFeedKey;
  lang: Language;
  content: (typeof copy)[Language]["news"];
  news: NewsItem[];
};

export function NewsSection({
  activeFeed,
  lang,
  content,
  news,
}: NewsSectionProps) {
  const dateTimeFormatter = new Intl.DateTimeFormat(
    lang === "pt" ? "pt-BR" : lang === "zh" ? "zh-CN" : "en-US",
    {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    },
  );

  function formatNewsDate(date: Date): string {
    const parts = dateTimeFormatter.formatToParts(date);
    // Rebuild without trailing dots on abbreviated month names
    const cleaned = parts.map((p) => {
      if (p.type === "month") return p.value.replace(/\.$/, "");
      // Replace the literal separator between date and time with double space
      if (p.type === "literal" && p.value.trim() === ",") return "  ";
      return p.value;
    });
    return cleaned.join("").trim();
  }
  const getFeedHref = (feed: InfoMoneyFeedKey) =>
    feed === "latest"
      ? `/news?lang=${lang}`
      : `/news?lang=${lang}&feed=${feed}`;

  return (
    <section
      id="noticias"
      className="relative overflow-hidden border-b border-primary/8 bg-[linear-gradient(180deg,var(--background),hsl(from_var(--primary)_h_s_l/0.045))]"
    >
      <div className="mx-auto max-w-6xl px-6 pt-28 pb-16 sm:pt-36 sm:pb-20 md:pt-40">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="motion-reveal max-w-2xl">
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground">
              {content.eyebrow}
            </span>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground text-balance md:text-4xl">
              {content.title}
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              {content.description}
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          {infoMoneyFeedKeys.map((feed) => {
            const isActive = feed === activeFeed;

            return (
              <a
                key={feed}
                href={getFeedHref(feed)}
                className={`inline-flex h-10 items-center rounded-full border px-4 text-sm font-medium transition-colors ${
                  isActive
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-primary/12 text-primary hover:border-primary/24 hover:bg-primary/5"
                }`}
              >
                {content.feedTabs[feed]}
              </a>
            );
          })}
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {news.map((item, index) => (
            <NewsCard
              key={item.url}
              item={item}
              animationDelay={index * 80}
              formatDate={formatNewsDate}
              readMoreLabel={content.readMoreLabel}
            />
          ))}
        </div>

        {news.length === 0 ? (
          <div className="mt-10 rounded-xl border border-primary/10 bg-background p-6 text-sm text-muted-foreground">
            {content.emptyLabel}
          </div>
        ) : null}
      </div>
    </section>
  );
}

function NewsCard({
  item,
  animationDelay,
  formatDate,
  readMoreLabel,
}: {
  item: NewsItem;
  animationDelay: number;
  formatDate: (date: Date) => string;
  readMoreLabel: string;
}) {
  const publishedAt = item.publishedAt ? new Date(item.publishedAt) : null;

  return (
    <article
      className="motion-card motion-reveal-soft group overflow-hidden rounded-xl border border-primary/10 bg-background shadow-sm shadow-primary/5 transition hover:border-accent/45"
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <a href={item.url} target="_blank" rel="noreferrer" className="block h-full">
        <div className="relative aspect-[16/9] overflow-hidden bg-primary/8">
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt=""
              loading="lazy"
              className="size-full object-cover transition duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex size-full items-center justify-center bg-[linear-gradient(135deg,hsl(from_var(--primary)_h_s_l/0.14),hsl(from_var(--accent)_h_s_l/0.12))] text-primary">
              <Newspaper className="size-8" aria-hidden />
            </div>
          )}
        </div>

        <div className="flex min-h-52 flex-col p-5 sm:p-6">
          <div className="flex flex-col gap-0.5 text-[11px] font-mono uppercase tracking-[0.14em] text-muted-foreground">
            {item.category ? <span>{item.category}</span> : null}
            {publishedAt ? (
              <span>{formatDate(publishedAt)}</span>
            ) : null}
          </div>

          <h3 className="mt-3 text-lg font-semibold leading-tight text-foreground text-balance group-hover:text-primary">
            {item.title}
          </h3>
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
            {item.excerpt}
          </p>
          <span className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-medium text-primary">
            {readMoreLabel}
            <ArrowUpRight className="size-4" aria-hidden />
          </span>
        </div>
      </a>
    </article>
  );
}
