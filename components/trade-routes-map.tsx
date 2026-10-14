"use client";

import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePageVisible } from "@/hooks/use-page-visible";
import type { Language } from "@/lib/i18n";
import { showcaseText } from "@/lib/showcase";
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
}: {
  lang: Language;
  active: boolean;
}) {
  const content = tradeMapCopy[lang];
  const text = showcaseText[lang];
  const id = useId().replace(/:/g, "");
  const svgRef = useRef<SVGSVGElement>(null);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const pageVisible = usePageVisible();
  const playing = active && pageVisible && !paused && !reducedMotion;

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

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
                {connection.featured ? (
                  <path d={connection.path} className="trade-map-route-glow" />
                ) : null}
                <path
                  id={`${id}-${connection.id}`}
                  d={connection.path}
                  className="trade-map-route"
                />
                <path
                  d={connection.path}
                  pathLength="100"
                  className="trade-map-flow"
                />
                <g
                  className="trade-map-ship"
                  fill={connection.color}
                  stroke="#0c263c"
                  strokeWidth="0.8"
                >
                  <path d="M-6 -3L4 -3L8 0L4 3L-6 3Z" />
                  <path d="M-3 -1.5H2M-3 1.5H2" fill="none" />
                  <animateMotion
                    dur={`${connection.duration}s`}
                    begin={`${-index * 3.7}s`}
                    repeatCount="indefinite"
                    rotate="auto"
                  >
                    <mpath href={`#${id}-${connection.id}`} />
                  </animateMotion>
                </g>
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
      <div className="trade-map-footer">
        <p>
          <span className="trade-map-axis" aria-hidden="true" />
          {text.axis}
          <span>{text.routes}</span>
        </p>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setPaused((current) => !current)}
          disabled={reducedMotion}
          aria-pressed={paused || reducedMotion}
        >
          {paused || reducedMotion ? (
            <Play data-icon="inline-start" />
          ) : (
            <Pause data-icon="inline-start" />
          )}
          {reducedMotion
            ? text.reducedMotion
            : paused
              ? text.resume
              : text.pause}
        </Button>
      </div>
    </div>
  );
}
