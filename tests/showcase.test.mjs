import assert from "node:assert/strict";
import test from "node:test";
import { groupMarketQuotes, marketQuoteUnit } from "../lib/market-sectors.ts";
import {
  tradeConnections,
  tradeHubs,
  tradePassages,
  projectTradeCoordinates,
} from "../lib/trade-map.ts";
import { showcaseSlideDurations, showcaseSlideOrder } from "../lib/showcase.ts";

test("market groups preserve every quote, including future assets and missing values", () => {
  const quotes = [
    { symbol: "PETR4.SA", category: "stock", price: 0, dayChangePercent: null },
    { symbol: "VALE3.SA", category: "stock", price: 60, dayChangePercent: -1 },
    { symbol: "NEW.SA", category: "stock", price: null, dayChangePercent: 0 },
    { symbol: "ZS=F", category: "commodity", price: 1200, dayChangePercent: 1 },
    { symbol: "^BVSP", category: "index", price: 120000, dayChangePercent: 0 },
    { symbol: "BRL=X", category: "currency", price: 5, dayChangePercent: null },
  ];
  const { groups, benchmarks } = groupMarketQuotes(quotes);
  const displayed = [...groups.flatMap((group) => group.quotes), ...benchmarks];
  assert.equal(displayed.length, quotes.length);
  assert.equal(
    new Set(displayed.map((quote) => quote.symbol)).size,
    quotes.length,
  );
  assert.ok(quotes.every((quote) => displayed.includes(quote)));
  assert.equal(
    groups.find((group) => group.sector.id === "other").quotes[0],
    quotes[2],
  );
  assert.deepEqual(benchmarks, quotes.slice(4));
  assert.deepEqual(groupMarketQuotes([]), { groups: [], benchmarks: [] });
});

test("sector quotes retain their original units without converting prices", () => {
  assert.equal(
    marketQuoteUnit({ symbol: "PETR4.SA", category: "stock" }, "pt"),
    "BRL",
  );
  assert.equal(
    marketQuoteUnit({ symbol: "GC=F", category: "commodity" }, "en"),
    "USD",
  );
  assert.equal(
    marketQuoteUnit({ symbol: "ZS=F", category: "commodity" }, "en"),
    "US¢/bu",
  );
  assert.equal(
    marketQuoteUnit({ symbol: "^BVSP", category: "index" }, "zh"),
    "点",
  );
  assert.equal(marketQuoteUnit({ symbol: "NEW", category: "stock" }, "pt"), "");
});

test("every highlighted passage is anchored to a route, separately from the six hubs", () => {
  assert.equal(tradeHubs.length, 6);
  assert.equal(tradePassages.length, 7);
  assert.equal(
    new Set(tradeConnections.map((route) => route.id)).size,
    tradeConnections.length,
  );
  for (const passage of tradePassages) {
    const point = projectTradeCoordinates(passage.coordinates);
    const anchor = `${point.x.toFixed(1)},${point.y.toFixed(1)}`;
    assert.ok(
      tradeConnections.some((route) => route.path.includes(anchor)),
      `${passage.id} is not on a route`,
    );
    assert.ok(!tradeHubs.some((hub) => hub.id === passage.id));
    for (const lang of ["pt", "en", "zh"]) assert.ok(passage.label[lang]);
  }
  const [primary] = tradeConnections.filter((route) => route.featured);
  assert.equal(primary.id, "brazil-china");
  assert.equal(primary.from, "brazil-south");
  assert.equal(primary.to, "china");
  assert.ok(
    tradeConnections.every((route) => !/NaN|undefined/.test(route.path)),
  );
  assert.equal(
    tradeConnections.find((route) => route.id === "china-hormuz").to,
    "hormuz",
  );
});

test("the automatic presentation retains the original order and durations", () => {
  assert.deepEqual(showcaseSlideOrder, ["original", "map", "market"]);
  assert.deepEqual(showcaseSlideDurations, {
    original: 30_000,
    map: 300_000,
    market: 300_000,
  });
});

test("parallel maritime traffic preserves anchors and varies ship phases and speeds", () => {
  function anchors(path) {
    const numbers = path.match(/-?\d+\.\d+/g).map(Number);
    const points = [numbers.slice(0, 2)];
    for (let index = 6; index < numbers.length; index += 6)
      points.push(numbers.slice(index, index + 2));
    return points;
  }
  const lanes = tradeConnections.flatMap((route) => route.lanes);
  const ships = lanes.flatMap((lane) => lane.ships);
  assert.equal(new Set(lanes.map((lane) => lane.id)).size, lanes.length);
  assert.equal(new Set(ships.map((ship) => ship.id)).size, ships.length);
  assert.ok(lanes.length > tradeConnections.length && lanes.length <= 24);
  assert.ok(ships.length > 24 && ships.length <= 60);

  for (const route of tradeConnections) {
    assert.equal(route.lanes[0].path, route.path);
    const basePoints = anchors(route.path);
    for (const lane of route.lanes) {
      assert.ok(!/NaN|undefined/.test(lane.path));
      assert.equal(
        new Set(lane.ships.map((ship) => ship.duration)).size,
        lane.ships.length,
      );
      for (const ship of lane.ships) {
        assert.ok(
          ship.duration > 0 && ship.delay <= 0 && ship.delay > -ship.duration,
        );
      }
      if (!lane.returning) continue;
      const points = anchors(lane.path).reverse();
      assert.deepEqual(points[0], basePoints[0]);
      assert.deepEqual(points.at(-1), basePoints.at(-1));
      assert.equal(points.length, basePoints.length);
      points.forEach((point, index) => {
        assert.ok(
          Math.hypot(
            point[0] - basePoints[index][0],
            point[1] - basePoints[index][1],
          ) <= 4.15,
        );
      });
      for (const passage of tradePassages) {
        const { x, y } = projectTradeCoordinates(passage.coordinates);
        const index = basePoints.findIndex(
          (point) => Math.hypot(point[0] - x, point[1] - y) < 0.1,
        );
        if (index >= 0) assert.deepEqual(points[index], basePoints[index]);
      }
    }
  }
});
