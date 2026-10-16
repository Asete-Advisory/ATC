import type { Language } from "@/lib/i18n";

export const showcaseText = {
  pt: {
    auto: "Auto",
    autoActive: "Auto ativo",
    original: "Início",
    map: "Mapa",
    market: "Mercado",
    displayMode: "Modo de exibição",
    language: "Idioma",
    controls: "Controles da apresentação",
    showControls: "Exibir controles da apresentação",
    hideControls: "Ocultar controles da apresentação",
    live: "Ao vivo",
    loading: "Cotações em atualização",
    updated: "Atualizado",
    eyebrow: "Conexões que atravessam fronteiras",
    worldwide: "Brasil · China · Mundo",
    pause: "Pausar animação",
    resume: "Retomar animação",
    reducedMotion: "Movimento reduzido",
  },
  en: {
    auto: "Auto",
    autoActive: "Auto on",
    original: "Home",
    map: "Map",
    market: "Markets",
    displayMode: "Display mode",
    language: "Language",
    controls: "Presentation controls",
    showControls: "Show presentation controls",
    hideControls: "Hide presentation controls",
    live: "Live market",
    loading: "Updating quotes",
    updated: "Updated",
    eyebrow: "Connections beyond borders",
    worldwide: "Brazil · China · Worldwide",
    pause: "Pause animation",
    resume: "Resume animation",
    reducedMotion: "Reduced motion",
  },
  zh: {
    auto: "自动",
    autoActive: "自动播放中",
    original: "首页",
    map: "地图",
    market: "市场",
    displayMode: "显示模式",
    language: "语言",
    controls: "演示控制",
    showControls: "显示演示控制",
    hideControls: "隐藏演示控制",
    live: "实时市场",
    loading: "行情更新中",
    updated: "已更新",
    eyebrow: "跨越国界的连接",
    worldwide: "巴西 · 中国 · 全球",
    pause: "暂停动画",
    resume: "继续动画",
    reducedMotion: "减少动态效果",
  },
} satisfies Record<Language, Record<string, string>>;

export const showcaseLocales: Record<Language, string> = {
  pt: "pt-BR",
  en: "en-US",
  zh: "zh-CN",
};

export type PresentationSlide = "original" | "map" | "market";
export type DisplayMode = "auto" | PresentationSlide;
export const showcaseSlideOrder: PresentationSlide[] = [
  "original",
  "map",
  "market",
];
export const showcaseSlideDurations: Record<PresentationSlide, number> = {
  original: 30_000,
  map: 300_000,
  market: 300_000,
};
