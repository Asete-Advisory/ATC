import type { Language } from "@/lib/i18n";

type LocalizedLabel = Record<Language, string>;
type Coordinates = readonly [longitude: number, latitude: number];

type TradeHub = {
  id: string;
  coordinates: Coordinates;
  label: LocalizedLabel;
  labelOffset: readonly [number, number];
  anchor?: "start" | "end";
  featured?: boolean;
};

export const tradeMapCopy = {
  pt: {
    title: "Conexões Globais",
    subtitle: "Pessoas, mercados e oportunidades\nsem fronteiras.",
    description: "Mapa de conexões comerciais ilustrativas entre Brasil, China e polos internacionais. As animações não representam embarques em tempo real.",
    brazil: "BRASIL",
    china: "CHINA",
    atlantic: "OCEANO ATLÂNTICO",
    indian: "OCEANO ÍNDICO",
    pacific: "OCEANO PACÍFICO",
  },
  en: {
    title: "Global Connections",
    subtitle: "People, markets and opportunities\nwithout borders.",
    description: "Map of illustrative trade connections between Brazil, China and international hubs. Animations do not represent real-time shipments.",
    brazil: "BRAZIL",
    china: "CHINA",
    atlantic: "ATLANTIC OCEAN",
    indian: "INDIAN OCEAN",
    pacific: "PACIFIC OCEAN",
  },
  zh: {
    title: "全球连接",
    subtitle: "连接人、市场与机遇，\n跨越国界。",
    description: "巴西、中国与国际枢纽之间的贸易连接示意图。动画不代表实时货运。",
    brazil: "巴西",
    china: "中国",
    atlantic: "大西洋",
    indian: "印度洋",
    pacific: "太平洋",
  },
} satisfies Record<Language, Record<string, string>>;

// Approximate port/city locations. Connections are editorial illustrations,
// not navigational routes, shipment positions or claims about ATC facilities.
export const tradeHubs: TradeHub[] = [
  { id: "santos", coordinates: [-46.3, -24], label: { pt: "Santos", en: "Santos", zh: "桑托斯" }, labelOffset: [-16, 25], anchor: "end", featured: true },
  { id: "shanghai", coordinates: [121.5, 31.2], label: { pt: "Xangai", en: "Shanghai", zh: "上海" }, labelOffset: [16, -10], featured: true },
  { id: "shenzhen", coordinates: [114.1, 22.5], label: { pt: "Shenzhen", en: "Shenzhen", zh: "深圳" }, labelOffset: [18, 20] },
  { id: "singapore", coordinates: [103.8, 1.3], label: { pt: "Singapura", en: "Singapore", zh: "新加坡" }, labelOffset: [16, 22] },
  { id: "rotterdam", coordinates: [4.5, 51.9], label: { pt: "Roterdã", en: "Rotterdam", zh: "鹿特丹" }, labelOffset: [15, -15] },
  { id: "new-york", coordinates: [-74, 40.7], label: { pt: "Nova York", en: "New York", zh: "纽约" }, labelOffset: [-15, -15], anchor: "end" },
  { id: "dubai", coordinates: [55.1, 25], label: { pt: "Dubai", en: "Dubai", zh: "迪拜" }, labelOffset: [12, -15] },
  { id: "cape-town", coordinates: [18.4, -33.9], label: { pt: "Cidade do Cabo", en: "Cape Town", zh: "开普敦" }, labelOffset: [-14, -15], anchor: "end" },
];

type TradeConnection = {
  id: string;
  from: string;
  to: string;
  waypoints: Coordinates[];
  featured?: boolean;
  duration: number;
};

const connections: TradeConnection[] = [
  { id: "brazil-china", from: "santos", to: "shanghai", featured: true, duration: 16, waypoints: [[-32, -34], [-5, -39], [22, -39], [58, -28], [82, -10], [103.8, 1.3], [116, 12], [124, 22]] },
  { id: "brazil-europe", from: "santos", to: "rotterdam", duration: 13, waypoints: [[-31, -7], [-29, 23], [-12, 43], [-5, 49]] },
  { id: "brazil-america", from: "santos", to: "new-york", duration: 12, waypoints: [[-35, -9], [-47, 14], [-63, 32]] },
  { id: "america-europe", from: "new-york", to: "rotterdam", duration: 10, waypoints: [[-46, 49], [-20, 53], [-6, 50]] },
  { id: "africa-asia", from: "cape-town", to: "singapore", duration: 14, waypoints: [[29, -38], [62, -27], [83, -9]] },
  { id: "gulf-asia", from: "dubai", to: "singapore", duration: 11, waypoints: [[58, 24], [63, 13], [77, 4], [94, 6], [101, 3]] },
  { id: "china-asia", from: "shenzhen", to: "singapore", duration: 9, waypoints: [[115, 16], [111, 9], [106, 5]] },
];

// Same equirectangular projection as the prebuilt Natural Earth SVG.
export function projectTradeCoordinates([longitude, latitude]: Coordinates) {
  return { x: (longitude + 180) * 4, y: (85 - latitude) * 4 };
}

function connectionPath(connection: TradeConnection) {
  const from = tradeHubs.find((hub) => hub.id === connection.from)!;
  const to = tradeHubs.find((hub) => hub.id === connection.to)!;
  const points = [from.coordinates, ...connection.waypoints, to.coordinates].map(projectTradeCoordinates);
  const coordinate = (value: number) => value.toFixed(1);
  let path = `M${coordinate(points[0].x)},${coordinate(points[0].y)}`;

  // Catmull–Rom segments keep the curve anchored to each editorial waypoint.
  for (let index = 0; index < points.length - 1; index++) {
    const previous = points[Math.max(0, index - 1)];
    const start = points[index];
    const end = points[index + 1];
    const next = points[Math.min(points.length - 1, index + 2)];
    path += `C${coordinate(start.x + (end.x - previous.x) / 6)},${coordinate(start.y + (end.y - previous.y) / 6)} ${coordinate(end.x - (next.x - start.x) / 6)},${coordinate(end.y - (next.y - start.y) / 6)} ${coordinate(end.x)},${coordinate(end.y)}`;
  }

  return path;
}

// Calculated once, with no frame-by-frame JavaScript or network requests.
export const tradeConnections = connections.map((connection) => ({
  ...connection,
  path: connectionPath(connection),
}));
