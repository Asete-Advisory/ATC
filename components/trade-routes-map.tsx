"use client";

import { useId, type CSSProperties } from "react";
import type { Language } from "@/lib/i18n";
import {
  projectTradeCoordinates,
  tradeConnections,
  tradeHubs,
  tradeMapCopy,
  tradeMapLabels,
} from "@/lib/trade-map";

// Keep essential SVG typography with the labels so a stale stylesheet cannot
// turn a newly rendered label into black, default-sized SVG text.
const labelStyles: Record<"region" | "ocean" | "passage", CSSProperties> = {
  region: {
    fill: "#cbdce8",
    fontSize: "var(--trade-map-label-size, 14px)",
    fontWeight: 600,
    letterSpacing: "0.4px",
  },
  ocean: {
    fill: "#779fbd",
    fontSize: "var(--trade-map-label-size, 13px)",
    fontStyle: "italic",
    fontWeight: 500,
    letterSpacing: "0.4px",
  },
  passage: {
    fill: "#bfcedc",
    fontSize: 11,
    fontWeight: 500,
    letterSpacing: 0,
  },
};

export function TradeRoutesMap({ lang, active }: { lang: Language; active: boolean }) {
  const content = tradeMapCopy[lang];
  const id = useId().replace(/:/g, "");

  return (
    <div className="trade-map" data-active={active}>
      <div className="trade-map-stage">
        <svg
          className="trade-map-vector"
          viewBox="160 20 1200 560"
          role="img"
          aria-labelledby={`${id}-title ${id}-description`}
        >
          <title id={`${id}-title`}>{content.title}</title>
          <desc id={`${id}-description`}>{content.description}</desc>
          <defs>
            <pattern id={`${id}-grid`} width="120" height="120" patternUnits="userSpaceOnUse" y="100">
              <path d="M120 0H0V120" fill="none" stroke="#396176" strokeOpacity="0.16" strokeWidth="0.7" />
            </pattern>
          </defs>

          <rect width="1440" height="600" fill={`url(#${id}-grid)`} />
          <image href="/maps/world-countries.svg" width="1440" height="600" />

          <g fill="none" strokeLinecap="round" strokeLinejoin="round">
            {tradeConnections.map((connection, index) => (
              <g
                key={connection.id}
                data-connection={connection.id}
                className={connection.featured ? "trade-map-connection is-featured" : "trade-map-connection"}
                style={{
                  "--route-duration": `${connection.duration}s`,
                  "--route-delay": `${-index * 2.3}s`,
                } as CSSProperties}
              >
                {connection.featured ? <path d={connection.path} className="trade-map-route-glow" /> : null}
                <path d={connection.path} className="trade-map-route" />
                <path d={connection.path} pathLength="100" className="trade-map-flow" />
              </g>
            ))}
          </g>

          {tradeHubs.map((hub) => {
            const { x, y } = projectTradeCoordinates(hub.coordinates);
            return (
              <g key={hub.id} data-hub={hub.id} className={hub.featured ? "trade-map-hub is-featured" : "trade-map-hub"} transform={`translate(${x} ${y})`}>
                {hub.featured ? <circle r="17" className="trade-map-pulse" /> : null}
                <circle r={hub.featured ? 9 : 6} className="trade-map-hub-ring" />
                <circle r={hub.featured ? 4 : 2.5} className="trade-map-hub-core" />
              </g>
            );
          })}

          {tradeMapLabels.map((label) => {
            const position = projectTradeCoordinates(label.coordinates);
            const x = position.x + (label.offset?.[0] ?? 0);
            const y = position.y + (label.offset?.[1] ?? 0);
            const lines = label.label[lang].split("\n");

            return (
              <text
                key={label.id}
                data-map-label={label.id}
                className="trade-map-label"
                data-label-kind={label.kind}
                style={{
                  fontFamily: "Arial, Helvetica, sans-serif",
                  stroke: "#071625",
                  strokeWidth: label.kind === "passage" ? 5 : 3,
                  strokeLinejoin: "round",
                  paintOrder: "stroke",
                  ...labelStyles[label.kind],
                }}
                x={x}
                y={y}
                textAnchor={label.anchor ?? "middle"}
                dominantBaseline="central"
              >
                {lines.map((line, index) => (
                  <tspan key={index} x={x} dy={index === 0 ? `${-(lines.length - 1) * 0.6}em` : "1.2em"}>
                    {line}
                  </tspan>
                ))}
              </text>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
