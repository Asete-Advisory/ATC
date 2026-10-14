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
