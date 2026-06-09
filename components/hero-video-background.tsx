"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const heroVideos = [
  "/hero-section/videos/hero-video-01.mp4",
  "/hero-section/videos/hero-video-02.mp4",
  "/hero-section/videos/hero-video-03.mp4",
  "/hero-section/videos/hero-video-04.mp4",
] as const;

export function HeroVideoBackground() {
  const [activeVideo, setActiveVideo] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const requestPlaybackRef = useRef<() => void>(() => undefined);
  const retryTimerRef = useRef<number | null>(null);

  const prepareVideo = useCallback((video: HTMLVideoElement) => {
    video.muted = true;
    video.defaultMuted = true;
    video.volume = 0;
    video.playsInline = true;
    video.controls = false;
    video.autoplay = true;
    video.removeAttribute("controls");
    video.setAttribute("autoplay", "");
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");
  }, []);

  const queuePlaybackRetry = useCallback(() => {
    if (retryTimerRef.current) {
      window.clearTimeout(retryTimerRef.current);
    }

    retryTimerRef.current = window.setTimeout(() => {
      retryTimerRef.current = null;
      requestPlaybackRef.current();
    }, 350);
  }, []);

  const requestPlayback = useCallback(() => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    prepareVideo(video);

    if (document.visibilityState !== "visible") {
      return;
    }

    const playPromise = video.play();

    if (playPromise === undefined) {
      return;
    }

    playPromise.catch((error: DOMException) => {
      if (error.name === "AbortError") {
        queuePlaybackRetry();
        return;
      }

      const resumeAfterUserGesture = () => {
        requestPlayback();
      };

      window.addEventListener("pointerdown", resumeAfterUserGesture, {
        once: true,
        passive: true,
      });
      window.addEventListener("keydown", resumeAfterUserGesture, {
        once: true,
      });
      document.addEventListener("visibilitychange", resumeAfterUserGesture, {
        once: true,
      });
    });
  }, [prepareVideo, queuePlaybackRetry]);

  requestPlaybackRef.current = requestPlayback;

  useEffect(() => {
    requestPlayback();

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        requestPlayback();
      }
    };

    window.addEventListener("focus", requestPlayback);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      if (retryTimerRef.current) {
        window.clearTimeout(retryTimerRef.current);
      }

      window.removeEventListener("focus", requestPlayback);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [activeVideo, requestPlayback]);

  function playNextVideo() {
    setActiveVideo((current) => (current + 1) % heroVideos.length);
  }

  return (
    <video
      ref={videoRef}
      className="hero-background-video pointer-events-none size-full object-cover"
      src={heroVideos[activeVideo]}
      autoPlay
      muted
      playsInline
      preload="auto"
      aria-hidden
      tabIndex={-1}
      disablePictureInPicture
      controls={false}
      onCanPlay={requestPlayback}
      onLoadedData={requestPlayback}
      onEnded={playNextVideo}
      onError={playNextVideo}
      onPause={() => {
        if (!videoRef.current?.ended) {
          queuePlaybackRetry();
        }
      }}
    />
  );
}
