"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { Pause, Play, RadioTower, Repeat2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { Language } from "@/lib/i18n";
import {
  showcaseText,
  type DisplayMode,
  type PresentationSlide,
} from "@/lib/showcase";

type ShowcaseHeaderProps = {
  lang: Language;
  mode: DisplayMode;
  slide: PresentationSlide;
  onModeChange: (value: string) => void;
  onLanguageChange: (value: string) => void;
  hasQuotes: boolean;
  time: { dateTime: string; label: string } | null;
  mapPaused: boolean;
  reducedMotion: boolean;
  onMapPauseChange: () => void;
};

export function ShowcaseHeader({
  lang,
  mode,
  slide,
  onModeChange,
  onLanguageChange,
  hasQuotes,
  time,
  mapPaused,
  reducedMotion,
  onMapPauseChange,
}: ShowcaseHeaderProps) {
  const text = showcaseText[lang];
  const controlsId = useId();
  const headerRef = useRef<HTMLElement>(null);
  const brandRef = useRef<HTMLButtonElement>(null);
  const [hovered, setHovered] = useState(false);
  const [keyboardFocus, setKeyboardFocus] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const open = !dismissed && (hovered || keyboardFocus || pinned);

  useEffect(() => {
    if (!open) return;
    function closeOnOutsidePress(event: PointerEvent) {
      if (headerRef.current?.contains(event.target as Node)) return;
      setPinned(false);
      setHovered(false);
      setKeyboardFocus(false);
    }
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      if (headerRef.current?.contains(document.activeElement))
        brandRef.current?.focus({ preventScroll: true });
      setPinned(false);
      setKeyboardFocus(false);
      setDismissed(true);
    }
    document.addEventListener("pointerdown", closeOnOutsidePress, {
      passive: true,
    });
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePress);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  return (
    <header
      ref={headerRef}
      className="showcase-header"
      data-controls-open={open}
      onPointerEnter={(event) => {
        if (event.pointerType === "touch") return;
        setHovered(true);
        setDismissed(false);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === "touch") return;
        setHovered(false);
        setPinned(false);
        if (!headerRef.current?.querySelector(":focus-visible"))
          setKeyboardFocus(false);
      }}
      onFocusCapture={(event) => {
        if (event.target.matches(":focus-visible")) {
          setKeyboardFocus(true);
          setDismissed(false);
        }
      }}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setKeyboardFocus(false);
          setPinned(false);
        }
      }}
    >
      <span className="showcase-live">
        <RadioTower aria-hidden="true" />
        {hasQuotes ? text.live : text.loading}
      </span>
      <Button
        ref={brandRef}
        variant="ghost"
        className="showcase-brand"
        aria-label={open ? text.hideControls : text.showControls}
        aria-expanded={open}
        aria-controls={controlsId}
        onClick={() => {
          setPinned(!open);
          setDismissed(open);
        }}
      >
        <Image
          src="/global/atc-icon-white.svg"
          alt="ATC China Brasil"
          width={1205}
          height={375}
          priority
          className="showcase-logo"
        />
      </Button>
      {time ? (
        <time className="showcase-clock" dateTime={time.dateTime}>
          {time.label}
        </time>
      ) : null}
      <div
        id={controlsId}
        className="showcase-controls"
        role="region"
        aria-label={text.controls}
        aria-hidden={!open}
        inert={!open}
      >
        <ToggleGroup
          type="single"
          value={mode}
          onValueChange={onModeChange}
          size="sm"
          spacing={1}
          aria-label={text.displayMode}
          className="showcase-navigation"
        >
          {(["auto", "original", "map", "market"] as const).map((value) => (
            <ToggleGroupItem
              key={value}
              value={value}
              data-mode={value}
              aria-controls={value === "auto" ? undefined : `show-${value}`}
            >
              {value === "auto" ? <Repeat2 aria-hidden="true" /> : null}
              {value === "auto" && mode === "auto"
                ? text.autoActive
                : text[value]}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <div className="showcase-control-actions">
          <ToggleGroup
            type="single"
            value={lang}
            onValueChange={onLanguageChange}
            size="sm"
            spacing={1}
            aria-label={text.language}
            className="showcase-segmented"
          >
            <ToggleGroupItem value="pt" aria-label="Português">
              PT
            </ToggleGroupItem>
            <ToggleGroupItem value="en" aria-label="English">
              EN
            </ToggleGroupItem>
          </ToggleGroup>
          {slide === "map" ? (
            <Button
              variant="ghost"
              size="sm"
              className="showcase-map-pause"
              onClick={onMapPauseChange}
              disabled={reducedMotion}
              aria-pressed={mapPaused || reducedMotion}
            >
              {mapPaused || reducedMotion ? (
                <Play data-icon="inline-start" />
              ) : (
                <Pause data-icon="inline-start" />
              )}
              {reducedMotion
                ? text.reducedMotion
                : mapPaused
                  ? text.resume
                  : text.pause}
            </Button>
          ) : null}
        </div>
      </div>
    </header>
  );
}
