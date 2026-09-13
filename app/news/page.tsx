import { NewsSection } from "@/components/news-section";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { WhatsAppFab } from "@/components/whatsapp-fab";
import { PortugueseLanguageButton } from "@/components/language-controls";
import {
  getInfoMoneyFeedKey,
  getInfoMoneyNews,
  type NewsItem,
} from "@/lib/infomoney-news";
import { copy, getLanguage } from "@/lib/i18n";

export const dynamic = "force-dynamic";

type NewsPageProps = {
  searchParams?: Promise<{
    feed?: string;
    lang?: string;
  }>;
};

export default async function NewsPage({ searchParams }: NewsPageProps) {
  const params = await searchParams;
  const lang = getLanguage(params?.lang);
  const feed = getInfoMoneyFeedKey(params?.feed);
  const content = copy[lang];

  let news: NewsItem[] = [];

  try {
    news = await getInfoMoneyNews(feed);
  } catch {
    news = [];
  }

  return (
    <>
      <SiteHeader lang={lang} content={content.header} />
      <main>
        <NewsSection
          lang={lang}
          content={content.news}
          news={news}
          activeFeed={feed}
        />
      </main>
      <SiteFooter content={content.footer} />
      <PortugueseLanguageButton lang={lang} />
      <WhatsAppFab
        ariaLabel={content.whatsappAriaLabel}
        content={content.cta}
      />
    </>
  );
}
