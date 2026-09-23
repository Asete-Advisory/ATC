"use client";

import Image from "next/image";
import { useId, type CSSProperties } from "react";
import type { Language } from "@/lib/i18n";
import {
  projectTradeCoordinates,
  tradeConnections,
  tradeHubs,
  tradeMapCopy,
} from "@/lib/trade-map";

export function TradeRoutesMap({ lang, active }: { lang: Language; active: boolean }) {
  const content = tradeMapCopy[lang];
  const id = useId().replace(/:/g, "");

  return (
    <div className="trade-map" data-active={active}>
      <header className="trade-map-heading">
        <h2>{content.title}</h2>
        <p className="trade-map-subtitle">{content.subtitle}</p>
      </header>

      <div className="trade-map-stage">
        <svg
          className="trade-map-vector"
          viewBox="0 0 1440 600"
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

          <g className="trade-map-oceans">
            <text x="625" y="340">{content.atlantic}</text>
            <text x="940" y="415">{content.indian}</text>
            <text x="270" y="350">{content.pacific}</text>
          </g>

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

          <g className="trade-map-country-labels">
            <text x="495" y="370">{content.brazil}</text>
            <text x="1120" y="190">{content.china}</text>
          </g>

          {tradeHubs.map((hub) => {
            const { x, y } = projectTradeCoordinates(hub.coordinates);
            return (
              <g key={hub.id} data-hub={hub.id} className={hub.featured ? "trade-map-hub is-featured" : "trade-map-hub"} transform={`translate(${x} ${y})`}>
                {hub.featured ? <circle r="17" className="trade-map-pulse" /> : null}
                <circle r={hub.featured ? 9 : 6} className="trade-map-hub-ring" />
                <circle r={hub.featured ? 4 : 2.5} className="trade-map-hub-core" />
                <text x={hub.labelOffset[0]} y={hub.labelOffset[1]} textAnchor={hub.anchor ?? "start"}>
                  {hub.label[lang]}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <footer className="trade-map-footer">
        <Image src="/global/atc-icon-white.svg" alt="ATC China Brasil" width={1205} height={375} className="trade-map-logo" />
      </footer>
    </div>
  );
}
