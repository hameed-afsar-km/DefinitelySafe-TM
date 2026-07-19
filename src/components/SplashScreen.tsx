"use client";

import { useRef, useEffect, useState } from "react";

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [phase, setPhase] = useState<"constructing" | "title" | "video" | "fading" | "done">("constructing");

  useEffect(() => {
    const timer = setTimeout(() => setPhase("title"), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (phase !== "title") return;
    const timer = setTimeout(() => setPhase("video"), 3000);
    return () => clearTimeout(timer);
  }, [phase]);

  useEffect(() => {
    if (phase !== "video") return;
    const video = videoRef.current;
    if (!video) return;
    video.play().catch(() => {});

    const onTimeUpdate = () => {
      if (video.currentTime >= video.duration - 1) {
        setPhase("fading");
        video.removeEventListener("timeupdate", onTimeUpdate);
      }
    };
    video.addEventListener("timeupdate", onTimeUpdate);
    return () => video.removeEventListener("timeupdate", onTimeUpdate);
  }, [phase]);

  useEffect(() => {
    if (phase !== "fading") return;
    const timer = setTimeout(() => {
      setPhase("done");
      onComplete();
    }, 3000);
    return () => clearTimeout(timer);
  }, [phase, onComplete]);

  if (phase === "done") return null;

  return (
    <div
      className={`fixed inset-0 z-50 bg-black transition-opacity duration-[3000ms] ease-out ${
        phase === "fading" ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Persistent background image — never unmounts until done */}
      <div
        className="absolute inset-0 bg-cover bg-center splash-bg-reveal"
        style={{ backgroundImage: "url(/splash.webp)" }}
      />

      {/* CONSTRUCTING text + loading bar */}
      {phase === "constructing" && (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div className="constructing-group">
            <p
              className="constructing-text text-white text-7xl md:text-[6.5rem] tracking-[0.04em] uppercase"
              style={{ fontFamily: "MuroSp, sans-serif" }}
            >
              Constructing
            </p>
            <div className="constructing-bar-track">
              <div className="constructing-bar-fill" />
            </div>
          </div>
        </div>
      )}

      {/* DefinitelySafe text — stroke draw reveal */}
      {phase === "title" && (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div className="arch-group">
            <div className="arch-corner arch-corner-tl" />
            <div className="arch-corner arch-corner-tr" />
            <div className="arch-corner arch-corner-bl" />
            <div className="arch-corner arch-corner-br" />

            <div className="arch-dim arch-dim-top">
              <div className="arch-dim-line" />
              <div className="arch-dim-tick" />
              <div className="arch-dim-tick" />
            </div>

            <div className="stroke-draw-wrapper">
              {/* Stroke outline — clips left to right */}
              <div className="stroke-draw-clip">
                <p
                  className="stroke-draw-outline text-6xl md:text-8xl tracking-wider"
                  style={{ fontFamily: "Triac71, serif" }}
                >
                  DefinitelySafe
                </p>
              </div>
              {/* Solid fill — fades in on top */}
              <p
                className="stroke-draw-fill text-white text-6xl md:text-8xl tracking-wider absolute inset-0"
                style={{ fontFamily: "Triac71, serif" }}
              >
                DefinitelySafe
              </p>
            </div>

            <div className="arch-dim arch-dim-bottom">
              <div className="arch-dim-line" />
              <div className="arch-dim-tick" />
              <div className="arch-dim-tick" />
            </div>

            <div className="arch-vert arch-vert-left" />
            <div className="arch-vert arch-vert-right" />
          </div>
        </div>
      )}

      {/* Video — layered on top, stays mounted during fade so last frame is preserved */}
      {(phase === "video" || phase === "fading") && (
        <video
          ref={videoRef}
          className="absolute inset-0 z-20 h-full w-full object-cover animate-fade-in"
          muted
          playsInline
          preload="auto"
        >
          <source src="/splash.webm" type="video/webm" />
        </video>
      )}
    </div>
  );
}
