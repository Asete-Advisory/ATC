import type { Metadata } from "next";
import { ShowcaseScreen } from "@/components/showcase-screen";
import { getLanguage } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Showcase | ATC China Brasil",
  description:
    "Tela fullscreen para exibicao institucional da ATC China Brasil em monitores e reunioes.",
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

  return <ShowcaseScreen lang={lang} />;
}
