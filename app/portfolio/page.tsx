import type { Metadata } from "next";
import Image from "next/image";
import { PortfolioDownloadButton } from "@/components/portfolio-download-button";
import { copy, getLanguage, languages, localizedPath, type Language } from "@/lib/i18n";
import { productCatalog } from "@/lib/product-catalog";

export const metadata: Metadata = {
  title: "Portfolio PDF | ATC China Brasil",
  description:
    "Apresentação institucional da ATC China Brasil em PDF com serviços, diferenciais e catálogo de produtos.",
};

type PortfolioPageProps = {
  searchParams?: Promise<{
    lang?: string;
  }>;
};

const portfolioCopy: Record<
  Language,
  {
    eyebrow: string;
    deckLabel: string;
    downloadLabel: string;
    generatingLabel: string;
    backLabel: string;
    companyTitle: string;
    companyText: string;
    servicesLabel: string;
    modelLabel: string;
    proofLabel: string;
    catalogLabel: string;
    productsLabel: string;
    closingTitle: string;
    closingText: string;
    contactLabel: string;
  }
> = {
  pt: {
    eyebrow: "Apresentação institucional",
    deckLabel: "Portfolio ATC China Brasil",
    downloadLabel: "Baixar PDF em alta resolução",
    generatingLabel: "Gerando PDF...",
    backLabel: "Voltar ao site",
    companyTitle: "Estrutura internacional para importar, exportar e negociar com segurança",
    companyText:
      "A ATC China Brasil combina presença operacional, inteligência comercial e execução ponta a ponta para empresas que desejam operar no mercado global com mais previsibilidade.",
    servicesLabel: "Soluções",
    modelLabel: "Modelos de atuação",
    proofLabel: "Lastro operacional",
    catalogLabel: "Catálogo de produtos",
    productsLabel: "Produtos de referência",
    closingTitle: "Transforme comércio internacional em operação previsível",
    closingText:
      "Nossa equipe estrutura o caminho entre produto, fornecedor, negociação, logística e entrega final com governança em cada etapa.",
    contactLabel: "Contato",
  },
  en: {
    eyebrow: "Company presentation",
    deckLabel: "ATC China Brasil Portfolio",
    downloadLabel: "Download high-resolution PDF",
    generatingLabel: "Generating PDF...",
    backLabel: "Back to website",
    companyTitle: "International structure to import, export and negotiate safely",
    companyText:
      "ATC China Brasil combines operational presence, commercial intelligence and end-to-end execution for companies that want to operate globally with greater predictability.",
    servicesLabel: "Solutions",
    modelLabel: "Operating models",
    proofLabel: "Operational backing",
    catalogLabel: "Product catalog",
    productsLabel: "Reference products",
    closingTitle: "Turn international trade into a predictable operation",
    closingText:
      "Our team structures the path across product, supplier, negotiation, logistics and final delivery with governance at every stage.",
    contactLabel: "Contact",
  },
  zh: {
    eyebrow: "公司介绍",
    deckLabel: "ATC China Brasil 作品集",
    downloadLabel: "下载高清 PDF",
    generatingLabel: "正在生成 PDF...",
    backLabel: "返回网站",
    companyTitle: "以国际化架构安全开展进口、出口与商务谈判",
    companyText:
      "ATC China Brasil 结合本地执行、商业情报和端到端运营能力，帮助企业更可预期地进入全球市场。",
    servicesLabel: "解决方案",
    modelLabel: "合作模式",
    proofLabel: "运营实力",
    catalogLabel: "产品目录",
    productsLabel: "参考产品",
    closingTitle: "让国际贸易成为可预测的业务流程",
    closingText:
      "我们的团队贯穿产品、供应商、谈判、物流与最终交付全过程，并在每个阶段提供治理与控制。",
    contactLabel: "联系方式",
  },
};

function SlideNumber({ current, total }: { current: number; total: number }) {
  return (
    <div className="absolute bottom-7 right-9 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/45">
      {String(current).padStart(2, "0")} / {String(total).padStart(2, "0")}
    </div>
  );
}

function BrandMark({ dark = false }: { dark?: boolean }) {
  return (
    <Image
      src={dark ? "/global/atc-icon-black.svg" : "/global/atc-icon-white.svg"}
      alt="ATC China Brasil"
      width={1205}
      height={375}
      className="h-8 w-auto"
      priority
    />
  );
}

export default async function PortfolioPage({ searchParams }: PortfolioPageProps) {
  const params = await searchParams;
  const lang = getLanguage(params?.lang);
  const content = copy[lang];
  const catalog = productCatalog[lang];
  const portfolio = portfolioCopy[lang];
  const totalSlides = 8;

  return (
    <main className="min-h-screen bg-[#071625] text-white">
      <div className="sticky top-0 z-40 border-b border-white/10 bg-[#071625]/94 px-4 py-3 backdrop-blur print:hidden">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
          <a href={localizedPath(lang, "/")} aria-label="ATC China Brasil">
            <BrandMark />
          </a>
          <div className="flex flex-wrap items-center gap-2">
            <a
              href={localizedPath(lang, "/")}
              className="rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-white/76 transition-colors hover:text-white"
            >
              {portfolio.backLabel}
            </a>
            <div className="flex rounded-full border border-white/15 bg-white/8 p-0.5">
              {languages.map((option) => (
                <a
                  key={option}
                  href={localizedPath(option, "/portfolio")}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                    option === lang ? "bg-white text-primary" : "text-white/60"
                  }`}
                  hrefLang={option}
                >
                  {option === "pt" ? "PT" : option === "en" ? "EN" : "中文"}
                </a>
              ))}
            </div>
            <PortfolioDownloadButton
              label={portfolio.downloadLabel}
              loadingLabel={portfolio.generatingLabel}
              fileName={`portfolio-atc-china-brasil-${lang}.pdf`}
            />
          </div>
        </div>
      </div>

      <div className="portfolio-deck mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 print:block print:max-w-none print:p-0">
        <section
          data-portfolio-slide
          className="portfolio-slide portfolio-slide-dark relative overflow-hidden bg-[#071625]"
        >
          <Image
            src="/hero-section/stats/containers-port.jpg"
            alt=""
            fill
            sizes="1120px"
            className="object-cover opacity-32"
            priority
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,22,37,0.96)_0%,rgba(7,22,37,0.74)_52%,rgba(7,22,37,0.2)_100%)]" />
          <div className="relative flex h-full flex-col justify-between p-12">
            <div className="flex items-center justify-between">
              <BrandMark />
              <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/55">
                {portfolio.eyebrow}
              </span>
            </div>
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#69c9ff]">
                {portfolio.deckLabel}
              </p>
              <h1 className="mt-5 text-6xl font-semibold leading-[0.94] tracking-tight">
                {content.hero.title}
              </h1>
              <p className="mt-6 max-w-2xl text-xl leading-relaxed text-white/72">
                {content.hero.description}
              </p>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {content.hero.stats.map((stat) => (
                <div key={stat.label} className="border-l border-[#69c9ff]/45 pl-4">
                  <div className="text-2xl font-semibold">{stat.value}</div>
                  <div className="mt-1 text-xs font-medium uppercase leading-snug tracking-[0.16em] text-white/52">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <SlideNumber current={1} total={totalSlides} />
        </section>

        <section
          data-portfolio-slide
          className="portfolio-slide relative overflow-hidden bg-[#f7fbff] p-12 text-primary"
        >
          <div className="flex items-start justify-between gap-8">
            <div className="max-w-3xl">
              <BrandMark dark />
              <p className="mt-12 text-sm font-semibold uppercase tracking-[0.28em] text-[#2f6fd6]">
                ATC China Brasil
              </p>
              <h2 className="mt-4 text-5xl font-semibold leading-tight">{portfolio.companyTitle}</h2>
              <p className="mt-6 text-xl leading-relaxed text-slate-600">{portfolio.companyText}</p>
            </div>
            <div className="grid w-72 gap-4">
              {content.stats.items.map((item) => (
                <div key={item.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="text-3xl font-semibold text-primary">{item.value}</div>
                  <div className="mt-2 text-sm font-medium text-slate-500">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-12 grid grid-cols-3 gap-5">
            {content.audience.items.map((item) => (
              <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-6">
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
          <SlideNumber current={2} total={totalSlides} />
        </section>

        <section
          data-portfolio-slide
          className="portfolio-slide relative overflow-hidden bg-white p-12 text-primary"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#2f6fd6]">
            {portfolio.servicesLabel}
          </p>
          <h2 className="mt-4 max-w-4xl text-5xl font-semibold leading-tight">{content.services.title}</h2>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-600">{content.services.description}</p>
          <div className="mt-10 grid grid-cols-2 gap-5">
            {content.services.items.map((item, index) => (
              <div key={item.title} className="min-h-40 rounded-2xl border border-slate-200 bg-[#f7fbff] p-6">
                <div className="text-xs font-semibold uppercase tracking-[0.24em] text-[#69a9d7]">
                  0{index + 1}
                </div>
                <h3 className="mt-4 text-2xl font-semibold">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
          <SlideNumber current={3} total={totalSlides} />
        </section>

        <section
          data-portfolio-slide
          className="portfolio-slide portfolio-slide-dark relative overflow-hidden bg-[#071625] p-12"
        >
          <Image
            src="/how-it-works/estrategico-1.webp"
            alt=""
            fill
            sizes="1120px"
            className="object-cover opacity-18"
          />
          <div className="absolute inset-0 bg-[#071625]/86" />
          <div className="relative">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#69c9ff]">
              {content.howItWorks.eyebrow}
            </p>
            <h2 className="mt-4 max-w-4xl text-5xl font-semibold leading-tight">{content.howItWorks.title}</h2>
            <div className="mt-10 grid grid-cols-3 gap-5">
              {content.howItWorks.steps.map((step, index) => (
                <div key={step.title} className="rounded-2xl border border-white/14 bg-white/8 p-6">
                  <div className="text-5xl font-semibold text-white/18">0{index + 1}</div>
                  <h3 className="mt-8 text-xl font-semibold">{step.title}</h3>
                  <p className="mt-4 text-sm leading-relaxed text-white/62">{step.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 rounded-2xl border border-[#69c9ff]/22 bg-[#69c9ff]/10 p-6">
              <h3 className="text-2xl font-semibold">{content.howItWorks.highlightTitle}</h3>
              <p className="mt-3 max-w-4xl text-base leading-relaxed text-white/68">{content.howItWorks.highlight}</p>
            </div>
          </div>
          <SlideNumber current={4} total={totalSlides} />
        </section>

        <section
          data-portfolio-slide
          className="portfolio-slide relative overflow-hidden bg-[#f7fbff] p-10 text-primary"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#2f6fd6]">
            {portfolio.modelLabel}
          </p>
          <h2 className="mt-3 max-w-4xl text-4xl font-semibold leading-tight">{content.operationModels.title}</h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-600">{content.operationModels.description}</p>
          <div className="mt-7 grid grid-cols-2 gap-5">
            {content.operationModels.items.map((item) => (
              <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-2xl font-semibold">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.desc}</p>
                <p className="mt-4 rounded-xl bg-[#eaf5ff] p-3 text-xs font-semibold leading-relaxed text-primary">
                  {item.highlight}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-6 grid grid-cols-4 gap-3">
            {content.differentials.items.map((item) => (
              <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-4">
                <h3 className="text-sm font-semibold leading-snug">{item.title}</h3>
                <p className="mt-2 text-[11px] leading-relaxed text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
          <SlideNumber current={5} total={totalSlides} />
        </section>

        <section
          data-portfolio-slide
          className="portfolio-slide relative overflow-hidden bg-white p-10 text-primary"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#2f6fd6]">
            {portfolio.catalogLabel}
          </p>
          <h2 className="mt-3 max-w-4xl text-4xl font-semibold leading-tight">{catalog.title}</h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-600">{catalog.description}</p>
          <div className="mt-6 grid grid-cols-2 gap-5">
            {catalog.categories.slice(0, 2).map((category) => (
              <div key={category.id} className="rounded-2xl border border-slate-200 bg-[#f7fbff] p-5">
                <h3 className="text-xl font-semibold">{category.title}</h3>
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#2f6fd6]">
                  {category.tagline}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">{category.description}</p>
                <h4 className="mt-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                  {portfolio.productsLabel}
                </h4>
                <ul className="mt-2 grid gap-1.5">
                  {category.products.map((product) => (
                    <li key={product} className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700">
                      {product}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <SlideNumber current={6} total={totalSlides} />
        </section>

        <section
          data-portfolio-slide
          className="portfolio-slide relative overflow-hidden bg-white p-12 text-primary"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#2f6fd6]">
            {portfolio.catalogLabel}
          </p>
          <h2 className="mt-4 max-w-4xl text-5xl font-semibold leading-tight">{catalog.title}</h2>
          <div className="mt-9 grid grid-cols-2 gap-5">
            {catalog.categories.slice(2).map((category) => (
              <div key={category.id} className="rounded-2xl border border-slate-200 bg-[#f7fbff] p-6">
                <h3 className="text-2xl font-semibold">{category.title}</h3>
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#2f6fd6]">
                  {category.tagline}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{category.description}</p>
                <h4 className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  {portfolio.productsLabel}
                </h4>
                <ul className="mt-3 grid gap-2">
                  {category.products.map((product) => (
                    <li key={product} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700">
                      {product}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <SlideNumber current={7} total={totalSlides} />
        </section>

        <section
          data-portfolio-slide
          className="portfolio-slide portfolio-slide-dark relative overflow-hidden bg-[#071625]"
        >
          <Image
            src="/cta-section/banner-atc.webp"
            alt=""
            fill
            sizes="1120px"
            className="object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,22,37,0.98),rgba(7,22,37,0.72),rgba(7,22,37,0.38))]" />
          <div className="relative flex h-full flex-col justify-between p-12">
            <BrandMark />
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#69c9ff]">
                {portfolio.contactLabel}
              </p>
              <h2 className="mt-4 text-6xl font-semibold leading-[0.98]">{portfolio.closingTitle}</h2>
              <p className="mt-6 max-w-2xl text-xl leading-relaxed text-white/72">{portfolio.closingText}</p>
            </div>
            <div className="grid max-w-3xl grid-cols-2 gap-5 text-sm">
              <div className="rounded-2xl border border-white/14 bg-white/8 p-5">
                <div className="font-semibold text-white">ATC China Brasil</div>
                <div className="mt-2 text-white/58">contato@atcchinabrasil.com</div>
              </div>
              <div className="rounded-2xl border border-white/14 bg-white/8 p-5">
                <div className="font-semibold text-white">{content.cta.specialistLabel}</div>
                <div className="mt-2 text-white/58">Importação, exportação, sourcing e commodities</div>
              </div>
            </div>
          </div>
          <SlideNumber current={8} total={totalSlides} />
        </section>
      </div>
    </main>
  );
}
