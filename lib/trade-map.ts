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
    description: "Mapa de conexões comerciais ilustrativas entre Brasil, China e polos internacionais. As animações não representam embarques em tempo real.",
    brazil: "BRASIL",
    china: "CHINA",
    atlantic: "OCEANO ATLÂNTICO",
    indian: "OCEANO ÍNDICO",
    pacific: "OCEANO PACÍFICO",
  },
  en: {
    title: "Global Connections",
    description: "Map of illustrative trade connections between Brazil, China and international hubs. Animations do not represent real-time shipments.",
    brazil: "BRAZIL",
    china: "CHINA",
    atlantic: "ATLANTIC OCEAN",
    indian: "INDIAN OCEAN",
    pacific: "PACIFIC OCEAN",
  },
  zh: {
    title: "全球连接",
    description: "巴西、中国与国际枢纽之间的贸易连接示意图。动画不代表实时货运。",
    brazil: "巴西",
    china: "中国",
    atlantic: "大西洋",
    indian: "印度洋",
    pacific: "太平洋",
  },
} satisfies Record<Language, Record<string, string>>;

// Approximate regions marked in the user's reference photograph. The photo
// does not identify exact cities; do not present these pins as ATC facilities.
export const tradeHubs: TradeHub[] = [
  { id: "us-west", coordinates: [-123, 33], label: { pt: "Costa oeste dos EUA", en: "US West Coast", zh: "美国西海岸" }, labelOffset: [16, -16] },
  { id: "central-america", coordinates: [-88.5, 15.5], label: { pt: "América Central", en: "Central America", zh: "中美洲" }, labelOffset: [-16, -16], anchor: "end" },
  { id: "brazil-south", coordinates: [-51, -29], label: { pt: "Sul do Brasil", en: "Southern Brazil", zh: "巴西南部" }, labelOffset: [-16, 26], anchor: "end", featured: true },
  { id: "northern-europe", coordinates: [6.5, 60], label: { pt: "Norte da Europa", en: "Northern Europe", zh: "北欧" }, labelOffset: [16, -16] },
  { id: "china", coordinates: [119.5, 29.5], label: { pt: "China", en: "China", zh: "中国" }, labelOffset: [-16, 28], anchor: "end", featured: true },
  { id: "japan", coordinates: [138, 37], label: { pt: "Japão", en: "Japan", zh: "日本" }, labelOffset: [16, -16] },
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
  // Follow the reference's bundles around southern Africa and across the
  // Indian Ocean. Nearby paths stay distinct instead of sharing one stroke.
  {
    id: "brazil-china", from: "brazil-south", to: "china", featured: true, duration: 16,
    waypoints: [[-43, -34], [-24, -42], [10, -41], [37, -37], [70, -21], [99, -3], [108, 3], [116, 18]],
  },
  {
    id: "brazil-japan", from: "brazil-south", to: "japan", duration: 18,
    waypoints: [[-43, -35], [-25, -47], [12, -46], [46, -40], [79, -25], [103, -9], [122, 3], [133, 20], [145, 31]],
  },
  {
    id: "us-west-china", from: "us-west", to: "china", duration: 24,
    waypoints: [[-128, 27], [-121, 15], [-109, 7], [-95, 4], [-82.5, 7.5], [-79.7, 9], [-77, 13], [-63, 17], [-48, 0], [-33, -10], [-20, -33], [10, -39], [35, -38], [59, -26], [78, -12], [96, 3], [103, 1], [111, 11], [119, 23]],
  },
  {
    id: "central-america-china", from: "central-america", to: "china", duration: 22,
    waypoints: [[-78, 19], [-64, 17], [-48, 2], [-30, -7], [-18, -31], [15, -40], [43, -36], [72, -21], [95, -4], [106, 3], [115, 16]],
  },
  {
    id: "europe-china", from: "northern-europe", to: "china", duration: 21,
    waypoints: [[-6, 54], [-18, 34], [-30, 12], [-29, -6], [-15, -30], [17, -38], [43, -33], [71, -16], [97, 2], [111, 9], [121, 23]],
  },
  // The photograph also links the Pacific coast, Central America and the
  // northern European pin through the Caribbean and western Atlantic.
  {
    id: "us-west-central-america", from: "us-west", to: "central-america", duration: 11,
    waypoints: [[-124, 27], [-116, 18], [-100, 8], [-88, 9]],
  },
  {
    id: "central-america-europe", from: "central-america", to: "northern-europe", duration: 15,
    waypoints: [[-80, 19], [-63, 16], [-49, 4], [-36, 0], [-25, 18], [-14, 43], [-4, 56]],
  },
  {
    id: "europe-brazil", from: "northern-europe", to: "brazil-south", duration: 14,
    waypoints: [[-8, 55], [-19, 38], [-31, 16], [-36, -2], [-39, -15], [-46, -25]],
  },
  {
    id: "china-japan", from: "china", to: "japan", duration: 9,
    waypoints: [[124, 23], [130, 24], [139, 30]],
  },
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
