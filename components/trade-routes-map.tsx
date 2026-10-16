"use client";

import { useEffect, useId, useRef, type CSSProperties } from "react";
import { usePageVisible } from "@/hooks/use-page-visible";
import type { Language } from "@/lib/i18n";
import {
  projectTradeCoordinates,
  tradeConnections,
  tradeHubs,
  tradeMapCopy,
  tradeMapLabels,
  tradePassages,
} from "@/lib/trade-map";
import { cn } from "@/lib/utils";

const labelStyle: CSSProperties = {
  fontFamily: "Aptos, Segoe UI, Arial, sans-serif",
  fill: "#092640",
  fontSize: 14,
  fontWeight: 700,
  letterSpacing: "0.4px",
};
const passageLabelStyle: CSSProperties = {
  fontFamily: "Aptos, Segoe UI, Arial, sans-serif",
  fill: "#f9e7be",
  fontSize: 11,
  fontWeight: 600,
};

export function TradeRoutesMap({
  lang,
  active,
  paused,
}: {
  lang: Language;
  active: boolean;
  paused: boolean;
}) {
  const content = tradeMapCopy[lang];
  const id = useId().replace(/:/g, "");
  const svgRef = useRef<SVGSVGElement>(null);
  const pageVisible = usePageVisible();
  const playing = active && pageVisible && !paused;

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    if (playing) svg.unpauseAnimations();
    else svg.pauseAnimations();
  }, [playing]);

  return (
    <div className="trade-map" data-active={playing}>
      <div
        className="trade-map-stage"
        tabIndex={0}
        role="region"
        aria-label={content.title}
      >
        <svg
          ref={svgRef}
          className="trade-map-vector"
          viewBox="160 20 1200 560"
          role="img"
          aria-labelledby={`${id}-title ${id}-description`}
        >
          <title id={`${id}-title`}>{content.title}</title>
          <desc id={`${id}-description`}>{content.description}</desc>
          <defs>
            <g id={`${id}-ship`}>
              <path
                d="M-9 0H-15"
                stroke="currentColor"
                strokeOpacity="0.35"
                strokeWidth="1"
              />
              <path
                d="M-7 -3.4H4.5L9 0L4.5 3.4H-7Z"
                fill="#e6f2f7"
                stroke="#0b263d"
                strokeWidth="0.7"
              />
              <rect
                x="-5.5"
                y="-2.4"
                width="2.3"
                height="4.8"
                rx="0.4"
                fill="#fff"
                stroke="#24495d"
                strokeWidth="0.5"
              />
              <path
                d="M-1.5 -2.2H4V2.2H-1.5Z"
                fill="currentColor"
                stroke="#0b263d"
                strokeWidth="0.5"
              />
              <path
                d="M0.3 -2.2V2.2M2.1 -2.2V2.2M-1.5 0H4"
                fill="none"
                stroke="#0b263d"
                strokeWidth="0.45"
              />
            </g>
            <pattern
              id={`${id}-grid`}
              width="80"
              height="80"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M80 0H0V80"
                fill="none"
                stroke="#ffffff"
                strokeOpacity="0.035"
                strokeWidth="0.7"
              />
            </pattern>
          </defs>
          <rect width="1440" height="600" fill={`url(#${id}-grid)`} />
          <image href="/maps/world-countries.svg" width="1440" height="600" />
          <g fill="none" strokeLinecap="round" strokeLinejoin="round">
            {tradeConnections.map((connection, index) => (
              <g
                key={connection.id}
                data-connection={connection.id}
                className={cn(
                  "trade-map-connection",
                  connection.featured && "is-featured",
                )}
                style={
                  {
                    color: connection.color,
                    "--route-duration": `${connection.duration}s`,
                    "--route-delay": `${-index * 2.3}s`,
                  } as CSSProperties
                }
              >
                {connection.lanes.map((lane) => (
                  <g
                    key={lane.id}
                    data-lane={lane.id}
                    className={cn(
                      "trade-map-lane",
                      lane.returning && "is-parallel",
                    )}
                  >
                    {connection.featured && !lane.returning ? (
                      <path d={lane.path} className="trade-map-route-glow" />
                    ) : null}
                    <path
                      id={`${id}-${lane.id}`}
                      d={lane.path}
                      className="trade-map-route"
                    />
                    <path
                      d={lane.path}
                      pathLength="100"
                      className="trade-map-flow"
                    />
                    {lane.ships.map((ship) => (
                      <g
                        key={ship.id}
                        data-ship={ship.id}
                        className="trade-map-ship"
                      >
                        <use
                          href={`#${id}-ship`}
                          transform={`scale(${ship.scale})`}
                        />
                        <animateMotion
                          dur={`${ship.duration}s`}
                          begin={`${ship.delay}s`}
                          repeatCount="indefinite"
                          rotate="auto"
                        >
                          <mpath href={`#${id}-${lane.id}`} />
                        </animateMotion>
                      </g>
                    ))}
                  </g>
                ))}
              </g>
            ))}
          </g>
          {tradeHubs.map((hub) => {
            const { x, y } = projectTradeCoordinates(hub.coordinates);
            return (
              <g
                key={hub.id}
                data-hub={hub.id}
                className={cn("trade-map-hub", hub.featured && "is-featured")}
                transform={`translate(${x} ${y})`}
              >
                {hub.featured ? (
                  <circle r="17" className="trade-map-pulse" />
                ) : null}
                <circle
                  r={hub.featured ? 9 : 6}
                  className="trade-map-hub-ring"
                />
                <circle
                  r={hub.featured ? 4 : 2.5}
                  className="trade-map-hub-core"
                />
              </g>
            );
          })}
          {tradeMapLabels.map((label) => {
            const { x, y } = projectTradeCoordinates(label.coordinates);
            const lines = label.label[lang].split("\n");
            return (
              <text
                key={label.id}
                data-map-label={label.id}
                data-label-kind="region"
                style={labelStyle}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="central"
              >
                {lines.map((line, index) => (
                  <tspan
                    key={index}
                    x={x}
                    dy={
                      index === 0 ? `${-(lines.length - 1) * 0.6}em` : "1.2em"
                    }
                  >
                    {line}
                  </tspan>
                ))}
              </text>
            );
          })}
          {tradePassages.map((passage) => {
            const point = projectTradeCoordinates(passage.coordinates);
            const label = projectTradeCoordinates(passage.labelCoordinates);
            const width = Math.max(
              46,
              passage.label[lang].length * (lang === "zh" ? 11 : 6) + 18,
            );
            return (
              <g key={passage.id} data-passage={passage.id}>
                <path
                  d={`M${point.x},${point.y}L${label.x},${label.y}`}
                  fill="none"
                  stroke="#f4dfaf"
                  strokeWidth="0.8"
                  strokeOpacity="0.8"
                />
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="5.5"
                  fill="#13364c"
                  stroke="#ffe2a0"
                  strokeWidth="1.5"
                />
                <circle cx={point.x} cy={point.y} r="2" fill="#ffe2a0" />
                <rect
                  x={label.x - width / 2}
                  y={label.y - 11}
                  width={width}
                  height="22"
                  rx="4"
                  fill="#0b243c"
                  stroke="#7996ac"
                  strokeWidth="0.7"
                />
                <text
                  data-map-label={passage.id}
                  data-label-kind="passage"
                  x={label.x}
                  y={label.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  style={passageLabelStyle}
                >
                  {passage.label[lang]}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
