"use client";

import { useEffect, useRef, useState } from "react";

const heroVideos = [
  "/hero-section/videos/hero-video-01.mp4",
  "/hero-section/videos/hero-video-02.mp4",
  "/hero-section/videos/hero-video-03.mp4",
  "/hero-section/videos/hero-video-04.mp4",
] as const;

export function HeroVideoBackground({
  active = true,
  poster,
}: {
  active?: boolean;
  poster?: string;
}) {
  const [activeVideo, setActiveVideo] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const failedVideosRef = useRef(new Set<number>());

  useEffect(() => {
    const element = videoRef.current;
    if (!element) return;
    const video = element;

    let disposed = false;
    let playPending = false;
    let retryTimer: number | undefined;
    let retries = 0;

    // Set the DOM properties as well as the JSX attributes before play().
    video.muted = true;
    video.defaultMuted = true;
    video.volume = 0;
    video.playsInline = true;
    video.setAttribute("muted", "");
    video.setAttribute("webkit-playsinline", "");

    function shouldPlay() {
      return !disposed && active && !document.hidden && !video.error;
    }

    function queueRetry() {
      if (
        !shouldPlay() ||
        video.ended ||
        retryTimer !== undefined ||
        retries >= 3
      )
        return;
      retries += 1;
      retryTimer = window.setTimeout(() => {
        retryTimer = undefined;
        requestPlayback();
      }, 350);
    }

    function requestPlayback() {
      if (!shouldPlay() || !video.paused || playPending) return;
      playPending = true;
      void video
        .play()
        .then(() => {
          if (!disposed && !shouldPlay()) video.pause();
        })
        .catch((error: DOMException) => {
          // A source/visibility change can interrupt play(). Policy blocks are
          // retried on the next gesture, focus or media-ready event instead.
          if (error.name === "AbortError") queueRetry();
        })
        .finally(() => {
          playPending = false;
        });
    }

    function handleVisibilityChange() {
      if (shouldPlay()) requestPlayback();
      else video.pause();
    }

    function handlePlaying() {
      if (!shouldPlay()) {
        video.pause();
        return;
      }
      retries = 0;
    }

    video.addEventListener("canplay", requestPlayback);
    video.addEventListener("loadeddata", requestPlayback);
    video.addEventListener("pause", queueRetry);
    video.addEventListener("playing", handlePlaying);
    window.addEventListener("focus", requestPlayback);
    window.addEventListener("pageshow", requestPlayback);
    window.addEventListener("pointerdown", requestPlayback, { passive: true });
    window.addEventListener("keydown", requestPlayback);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    handleVisibilityChange();

    return () => {
      disposed = true;
      window.clearTimeout(retryTimer);
      video.removeEventListener("canplay", requestPlayback);
      video.removeEventListener("loadeddata", requestPlayback);
      video.removeEventListener("pause", queueRetry);
      video.removeEventListener("playing", handlePlaying);
      window.removeEventListener("focus", requestPlayback);
      window.removeEventListener("pageshow", requestPlayback);
      window.removeEventListener("pointerdown", requestPlayback);
      window.removeEventListener("keydown", requestPlayback);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      video.pause();
    };
  }, [active, activeVideo]);

  function playNextVideo() {
    for (let offset = 1; offset <= heroVideos.length; offset += 1) {
      const next = (activeVideo + offset) % heroVideos.length;
      if (!failedVideosRef.current.has(next)) {
        setActiveVideo(next);
        return;
      }
    }
  }

  return (
    <video
      ref={videoRef}
      className="hero-background-video pointer-events-none size-full object-cover"
      src={heroVideos[activeVideo]}
      poster={poster}
      autoPlay={active}
      loop={failedVideosRef.current.size === heroVideos.length - 1}
      muted
      playsInline
      preload="auto"
      aria-hidden
      tabIndex={-1}
      disablePictureInPicture
      controls={false}
      onEnded={playNextVideo}
      onError={() => {
        failedVideosRef.current.add(activeVideo);
        playNextVideo();
      }}
    />
  );
}
