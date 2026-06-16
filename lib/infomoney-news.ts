const INFOMONEY_FEEDS = {
  latest: "https://www.infomoney.com.br/feed/",
  imports: "https://www.infomoney.com.br/tudo-sobre/importacoes/feed/",
  exports: "https://www.infomoney.com.br/tudo-sobre/exportacoes/feed/",
  commodities: "https://www.infomoney.com.br/tudo-sobre/commodities/feed/",
} as const;

export type InfoMoneyFeedKey = keyof typeof INFOMONEY_FEEDS;

export const infoMoneyFeedKeys = Object.keys(
  INFOMONEY_FEEDS,
) as InfoMoneyFeedKey[];

export function getInfoMoneyFeedKey(value?: string | null): InfoMoneyFeedKey {
  return infoMoneyFeedKeys.includes(value as InfoMoneyFeedKey)
    ? (value as InfoMoneyFeedKey)
    : "latest";
}

export type NewsItem = {
  title: string;
  url: string;
  excerpt: string;
  imageUrl: string | null;
  category: string | null;
  publishedAt: string | null;
  source: "InfoMoney";
};

function decodeHtml(value: string) {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCharCode(Number(code)))
    .replace(/&#x([a-f\d]+);/gi, (_, code: string) =>
      String.fromCharCode(Number.parseInt(code, 16)),
    )
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function stripHtml(value: string) {
  const textOnly = value
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<img\b[\s\S]*?\/>/gi, " ")
    .replace(/<img\b[^>]*>/gi, " ")
    .replace(/<[^>]+>/g, " ");

  return decodeHtml(textOnly)
    .replace(/\s+/g, " ")
    .replace(/\s*The post .*? appeared first on InfoMoney\s*\.?\s*$/i, "")
    .trim();
}

function getTagValue(xml: string, tag: string) {
  const match = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));

  return match ? decodeHtml(match[1].trim()) : "";
}

function getCategories(xml: string) {
  return [...xml.matchAll(/<category[^>]*>([\s\S]*?)<\/category>/gi)]
    .map((match) => decodeHtml(match[1].trim()))
    .filter(Boolean);
}

function getImageUrl(xml: string) {
  const imageMatch = xml.match(/<img[^>]+src=["']([^"']+)["']/i);

  return imageMatch ? decodeHtml(imageMatch[1]) : null;
}

function scrapeInfoMoneyFeed(xml: string): NewsItem[] {
  return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)]
    .map((match) => {
      const itemXml = match[1];
      const title = stripHtml(getTagValue(itemXml, "title"));
      const url = getTagValue(itemXml, "link");
      const description = getTagValue(itemXml, "description");
      const publishedAt = getTagValue(itemXml, "pubDate");
      const categories = getCategories(itemXml);

      return {
        title,
        url,
        excerpt: stripHtml(description),
        imageUrl: getImageUrl(description),
        category: categories.find((category) => category !== "Mercados") ?? categories[0] ?? null,
        publishedAt: publishedAt ? new Date(publishedAt).toISOString() : null,
        source: "InfoMoney" as const,
      };
    })
    .filter((item) => item.title && item.url)
    .slice(0, 9);
}

export async function getInfoMoneyNews(feedKey: InfoMoneyFeedKey = "latest") {
  const response = await fetch(INFOMONEY_FEEDS[feedKey], {
    headers: {
      Accept: "application/rss+xml, application/xml;q=0.9, text/xml;q=0.8",
      "User-Agent": "ATC-China-Brasil-News-Scraper/1.0",
    },
    next: {
      revalidate: 900,
    },
  });

  if (!response.ok) {
    throw new Error(`InfoMoney responded with ${response.status}`);
  }

  return scrapeInfoMoneyFeed(await response.text());
}
