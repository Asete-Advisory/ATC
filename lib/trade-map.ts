import type { Language } from "@/lib/i18n";

type Coordinates = readonly [longitude: number, latitude: number];
type LocalizedLabel = Record<Language, string>;

export const tradeMapCopy = {
  pt: {
    title: "Conexões globais e passagens marítimas",
    description:
      "Seis pontos de referência, continentes coloridos e passagens marítimas em rotas ilustrativas. Brasil–China é o eixo principal. Não representa rastreamento de navios nem bases da ATC.",
  },
  en: {
    title: "Global connections and maritime passages",
    description:
      "Six reference points, colored continents and maritime passages along illustrative routes. Brazil–China is the main connection. This is not vessel tracking or a map of ATC facilities.",
  },
  zh: {
    title: "全球连接与海上通道",
    description:
      "六个参考点、彩色大陆和示意航线上的海上通道。巴西—中国为主要连接。这不是船舶追踪或ATC设施分布图。",
  },
} satisfies Record<Language, Record<string, string>>;

type TradeMapLabel = {
  id: string;
  coordinates: Coordinates;
  label: LocalizedLabel;
};
export const tradeMapLabels: TradeMapLabel[] = [
  {
    id: "north-america",
    coordinates: [-105, 48],
    label: { pt: "AMÉRICA DO\nNORTE", en: "NORTH\nAMERICA", zh: "北美洲" },
  },
  {
    id: "south-america",
    coordinates: [-61, -9],
    label: { pt: "AMÉRICA\nDO SUL", en: "SOUTH\nAMERICA", zh: "南美洲" },
  },
  {
    id: "europe",
    coordinates: [21, 54],
    label: { pt: "EUROPA", en: "EUROPE", zh: "欧洲" },
  },
  {
    id: "africa",
    coordinates: [18, 5],
    label: { pt: "ÁFRICA", en: "AFRICA", zh: "非洲" },
  },
  {
    id: "asia",
    coordinates: [90, 52],
    label: { pt: "ÁSIA", en: "ASIA", zh: "亚洲" },
  },
  {
    id: "oceania",
    coordinates: [137, -24],
    label: { pt: "OCEANIA", en: "OCEANIA", zh: "大洋洲" },
  },
];

// Regional reference pins from the user's original photograph, not ATC offices.
export const tradeHubs = [
  { id: "us-west", coordinates: [-123, 33] as Coordinates, featured: false },
  {
    id: "central-america",
    coordinates: [-88.5, 15.5] as Coordinates,
    featured: false,
  },
  {
    id: "brazil-south",
    coordinates: [-51, -29] as Coordinates,
    featured: true,
  },
  {
    id: "northern-europe",
    coordinates: [6.5, 60] as Coordinates,
    featured: false,
  },
  { id: "china", coordinates: [119.5, 29.5] as Coordinates, featured: true },
  { id: "japan", coordinates: [138, 37] as Coordinates, featured: false },
];

// Canal/strait coordinates are shared with the route geometry. The Cape marker
// sits offshore along the illustrative southern corridor, not on the land tip.
const passageCoordinates = {
  panama: [-79.7, 9.1],
  gibraltar: [-5.6, 35.95],
  suez: [32.4, 30.5],
  "bab-el-mandeb": [43.3, 12.6],
  hormuz: [56.5, 26.5],
  malacca: [100.2, 3.5],
  "cape-of-good-hope": [18.3, -35.2],
} satisfies Record<string, Coordinates>;

type TradePassage = {
  id: keyof typeof passageCoordinates;
  coordinates: Coordinates;
  labelCoordinates: Coordinates;
  label: LocalizedLabel;
};
export const tradePassages: TradePassage[] = [
  {
    id: "panama",
    coordinates: passageCoordinates.panama,
    labelCoordinates: [-103, 8],
    label: { pt: "Panamá", en: "Panama", zh: "巴拿马运河" },
  },
  {
    id: "gibraltar",
    coordinates: passageCoordinates.gibraltar,
    labelCoordinates: [-23, 36],
    label: { pt: "Gibraltar", en: "Gibraltar", zh: "直布罗陀海峡" },
  },
  {
    id: "suez",
    coordinates: passageCoordinates.suez,
    labelCoordinates: [33, 43],
    label: { pt: "Suez", en: "Suez", zh: "苏伊士运河" },
  },
  {
    id: "bab-el-mandeb",
    coordinates: passageCoordinates["bab-el-mandeb"],
    labelCoordinates: [62, 8],
    label: { pt: "Bab el-Mandeb", en: "Bab el-Mandeb", zh: "曼德海峡" },
  },
  {
    id: "hormuz",
    coordinates: passageCoordinates.hormuz,
    labelCoordinates: [71, 29],
    label: { pt: "Ormuz", en: "Hormuz", zh: "霍尔木兹海峡" },
  },
  {
    id: "malacca",
    coordinates: passageCoordinates.malacca,
    labelCoordinates: [124, -1],
    label: { pt: "Malaca", en: "Malacca", zh: "马六甲海峡" },
  },
  {
    id: "cape-of-good-hope",
    coordinates: passageCoordinates["cape-of-good-hope"],
    labelCoordinates: [17, -49],
    label: {
      pt: "Cabo da Boa Esperança",
      en: "Cape of Good Hope",
      zh: "好望角",
    },
  },
];

const northAtlantic: Coordinates[] = [
  [0, 60],
  [-4, 59.5],
  [-8, 56],
  [-12, 50],
  [-11, 44],
  [-11, 38],
];
const cape = passageCoordinates["cape-of-good-hope"];
const malaccaToChina: Coordinates[] = [
  passageCoordinates.malacca,
  [102, 2.5],
  [103.8, 1.2],
  [105.3, 1.3],
  [108, 6],
  [113, 14],
  [118, 22],
];
const capeToAsia: Coordinates[] = [
  cape,
  [24, -36],
  [38, -33],
  [49, -27],
  [65, -15],
  [79, -3],
  [88, 1],
  [96, 6],
  ...malaccaToChina,
];
const mediterranean: Coordinates[] = [
  passageCoordinates.gibraltar,
  [0, 37],
  [8, 37.7],
  [15, 35],
  [23, 34],
  [29, 32.6],
  [32.32, 31.27],
  passageCoordinates.suez,
];
const redSea: Coordinates[] = [
  [32.55, 29.9],
  [33.7, 27.7],
  [35.2, 25],
  [36.8, 22],
  [38.5, 19],
  [40.2, 16],
  [42, 13.5],
  passageCoordinates["bab-el-mandeb"],
];
const indianOcean: Coordinates[] = [
  [45, 12],
  [49, 12],
  [53, 11.5],
  [60, 10],
  [72, 5],
  [82, 3],
  [90, 4],
  [96, 6],
];
const pacificToPanama: Coordinates[] = [
  [-123, 27],
  [-118, 21],
  [-109, 17],
  [-102, 12],
  [-91, 8],
  [-83, 6],
  [-79.4, 8.5],
  passageCoordinates.panama,
];

type TradeConnection = {
  id: string;
  from: string;
  to: string;
  waypoints: Coordinates[];
  featured?: boolean;
  duration: number;
  color: string;
};

const connections: TradeConnection[] = [
  {
    id: "brazil-china",
    from: "brazil-south",
    to: "china",
    featured: true,
    duration: 32,
    color: "#8df0d3",
    waypoints: [
      [-47, -30],
      [-35, -36],
      [-15, -41],
      [5, -40],
      [14, -37],
      ...capeToAsia,
    ],
  },
  {
    id: "brazil-japan",
    from: "brazil-south",
    to: "japan",
    duration: 38,
    color: "#b9b1ed",
    waypoints: [
      [-44, -36],
      [-15, -46],
      [22, -44],
      [56, -32],
      [94, -13],
      [111, -6],
      [130, 7],
      [139, 24],
      [142, 32],
    ],
  },
  {
    id: "us-west-china",
    from: "us-west",
    to: "china",
    duration: 52,
    color: "#eaa2b2",
    waypoints: [
      ...pacificToPanama,
      [-80.2, 9.5],
      [-78, 16],
      [-65, 16],
      [-60, 20],
      [-39, 35],
      [-12, 36],
      ...mediterranean,
      ...redSea,
      ...indianOcean,
      ...malaccaToChina,
    ],
  },
  {
    id: "central-america-china",
    from: "central-america",
    to: "china",
    duration: 45,
    color: "#79b7cd",
    waypoints: [
      [-85, 17],
      [-78, 18],
      [-65, 16],
      [-48, 4],
      [-32, -10],
      [-16, -30],
      [8, -37],
      ...capeToAsia,
    ],
  },
  {
    id: "europe-china",
    from: "northern-europe",
    to: "china",
    duration: 44,
    color: "#98cde1",
    waypoints: [
      ...northAtlantic,
      [-16, 29],
      [-25, 10],
      [-22, -8],
      [-11, -29],
      [8, -37],
      ...capeToAsia,
    ],
  },
  {
    id: "us-west-central-america",
    from: "us-west",
    to: "central-america",
    duration: 28,
    color: "#f5c875",
    waypoints: [
      ...pacificToPanama,
      [-80.2, 9.5],
      [-80, 13],
      [-84, 17],
      [-86, 17],
    ],
  },
  {
    id: "central-america-europe",
    from: "central-america",
    to: "northern-europe",
    duration: 34,
    color: "#a3d8ff",
    waypoints: [
      [-86, 17],
      [-84.8, 19],
      [-85.1, 21],
      [-85.3, 23],
      [-81, 24.5],
      [-77, 26.5],
      [-68, 28],
      [-49, 43],
      [-21, 55],
      [-6, 59],
      [0, 60],
    ],
  },
  {
    id: "europe-brazil",
    from: "northern-europe",
    to: "brazil-south",
    duration: 30,
    color: "#98cde1",
    waypoints: [
      ...northAtlantic,
      [-19, 30],
      [-31, 16],
      [-36, -2],
      [-39, -15],
      [-46, -25],
    ],
  },
  {
    id: "china-japan",
    from: "china",
    to: "japan",
    duration: 20,
    color: "#f5c875",
    waypoints: [
      [124, 27],
      [132, 28],
      [141, 33],
    ],
  },
  {
    id: "europe-suez-china",
    from: "northern-europe",
    to: "china",
    duration: 46,
    color: "#a3d8ff",
    waypoints: [
      ...northAtlantic,
      [-8, 36],
      ...mediterranean,
      ...redSea,
      ...indianOcean,
      ...malaccaToChina,
    ],
  },
  {
    id: "brazil-suez-china",
    from: "brazil-south",
    to: "china",
    duration: 48,
    color: "#89d9cb",
    waypoints: [
      [-40, -20],
      [-29, 3],
      [-23, 25],
      [-12, 36],
      ...mediterranean,
      ...redSea,
      ...indianOcean,
      ...malaccaToChina,
    ],
  },
  // A separate Gulf branch; Hormuz is not a waypoint on the Suez–China route.
  {
    id: "china-hormuz",
    from: "china",
    to: "hormuz",
    duration: 36,
    color: "#f5c875",
    waypoints: [...malaccaToChina].reverse().concat([
      [96, 6],
      [90, 4],
      [82, 3],
      [72, 5],
      [65, 12],
      [61, 19],
      [59, 24],
    ]),
  },
];

// Same equirectangular projection as the prebuilt Natural Earth SVG.
export function projectTradeCoordinates([longitude, latitude]: Coordinates) {
  return { x: (longitude + 180) * 4, y: (85 - latitude) * 4 };
}

function connectionPoints(connection: TradeConnection) {
  const from = tradeHubs.find((hub) => hub.id === connection.from)!;
  const to = tradeHubs.find((hub) => hub.id === connection.to);
  const end =
    to?.coordinates ??
    tradePassages.find((passage) => passage.id === connection.to)!.coordinates;
  return [from.coordinates, ...connection.waypoints, end].map(
    projectTradeCoordinates,
  );
}

type MapPoint = ReturnType<typeof projectTradeCoordinates>;

function curvePath(points: MapPoint[]) {
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

// Only selected corridors get a return lane. Offsets are SVG units, not
// geographic claims; the base paths, six hubs and passage anchors stay intact.
const parallelOffsets: Record<string, number> = {
  "brazil-china": 4,
  "brazil-japan": -3.2,
  "us-west-central-america": 2.8,
  "central-america-europe": 4,
  "europe-brazil": -4,
  "china-japan": -2.6,
  "europe-suez-china": -3,
  "china-hormuz": 3,
};
const passagePoints = tradePassages.map((passage) =>
  projectTradeCoordinates(passage.coordinates),
);

function parallelPoints(points: MapPoint[], offset: number) {
  return points.map((point, index) => {
    if (index === 0 || index === points.length - 1) return point;
    const previous = points[index - 1];
    const next = points[index + 1];
    const dx = next.x - previous.x;
    const dy = next.y - previous.y;
    const length = Math.hypot(dx, dy) || 1;
    const passageDistance = Math.min(
      ...passagePoints.map((passage) =>
        Math.hypot(point.x - passage.x, point.y - passage.y),
      ),
    );
    // Converge at canals/straits and taper near endpoints instead of shifting
    // an entire curve across the coast or moving a reference point.
    const taper = Math.min(
      1,
      index / 2,
      (points.length - 1 - index) / 2,
      Math.max(0, (passageDistance - 12) / 28),
    );
    return {
      x: point.x - (dy / length) * offset * taper,
      y: point.y + (dx / length) * offset * taper,
    };
  });
}

function laneShips(
  connection: TradeConnection,
  routeIndex: number,
  returning: boolean,
) {
  const count = connection.featured ? (returning ? 3 : 4) : 2;
  return Array.from({ length: count }, (_, index) => {
    const duration = Number(
      (
        connection.duration *
        (0.9 + index * 0.13 + (returning ? 0.09 : 0))
      ).toFixed(2),
    );
    const phase =
      (0.12 + routeIndex * 0.137 + index / count + (returning ? 0.19 : 0)) % 1;
    return {
      id: `${connection.id}-${returning ? "return" : "outbound"}-${index}`,
      duration,
      delay: Number((-phase * duration).toFixed(2)),
      scale: Number((0.82 + ((routeIndex + index) % 3) * 0.1).toFixed(2)),
    };
  });
}

// Calculated once, with no frame-by-frame JavaScript or network requests.
export const tradeConnections = connections.map((connection, index) => {
  const points = connectionPoints(connection);
  const path = curvePath(points);
  const lanes = [
    {
      id: `${connection.id}-outbound`,
      path,
      returning: false,
      ships: laneShips(connection, index, false),
    },
  ];
  const offset = parallelOffsets[connection.id];
  if (offset !== undefined) {
    lanes.push({
      id: `${connection.id}-return`,
      path: curvePath(parallelPoints(points, offset).reverse()),
      returning: true,
      ships: laneShips(connection, index, true),
    });
  }
  return { ...connection, path, lanes };
});
