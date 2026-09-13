import type { Metadata } from "next";
import { ShowcaseScreen } from "@/components/showcase-screen";
import { DocumentLanguage } from "@/components/language-controls";
import { getLanguage } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Showcase | ATC China Brasil",
  description:
    "Fullscreen company presentation for ATC China Brasil on displays and in meetings.",
  robots: {
    index: false,
    follow: false,
  },
};

type ShowPageProps = {
  searchParams?: Promise<{
    lang?: string;
  }>;
};

export default async function ShowPage({ searchParams }: ShowPageProps) {
  const params = await searchParams;
  const lang = getLanguage(params?.lang);

  return (
    <>
      <ShowcaseScreen lang={lang} />
      <DocumentLanguage lang={lang} />
    </>
  );
}
