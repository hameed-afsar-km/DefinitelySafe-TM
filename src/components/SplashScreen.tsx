"use client";

import { useRef, useEffect, useState } from "react";

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [phase, setPhase] = useState<"constructing" | "title" | "video" | "fading" | "done">("constructing");

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    timer = setTimeout(() => setPhase("title"), 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (phase !== "title") return;
    let timer: ReturnType<typeof setTimeout>;
    timer = setTimeout(() => setPhase("video"), 2200);
    return () => clearTimeout(timer);
  }, [phase]);

  useEffect(() => {
    if (phase !== "video") return;
    const video = videoRef.current;
    if (!video) return;
    video.play().catch(() => {});

    const onEnd = () => setPhase("fading");
    video.addEventListener("ended", onEnd);
    return () => video.removeEventListener("ended", onEnd);
  }, [phase]);

  useEffect(() => {
    if (phase !== "fading") return;
    let timer: ReturnType<typeof setTimeout>;
    timer = setTimeout(() => {
      setPhase("done");
      onComplete();
    }, 3000);
    return () => clearTimeout(timer);
  }, [phase, onComplete]);

  if (phase === "done") return null;

  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-[3000ms] ease-out ${
        phase === "fading" ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Persistent background image — never unmounts until done */}
      <div
        className="absolute inset-0 bg-cover bg-center animate-fade-in"
        style={{ backgroundImage: "url(/splash.webp)" }}
      />

      {/* CONSTRUCTING text */}
      {phase === "constructing" && (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div className="animate-fade-in-out-short">
            <p
              className="text-white text-5xl md:text-7xl tracking-[0.3em] uppercase"
              style={{ fontFamily: "MuroSp, sans-serif" }}
            >
              Constructing
            </p>
          </div>
        </div>
      )}

      {/* DefinitelySafe text */}
      {phase === "title" && (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div className="animate-fade-in-out-long">
            <p
              className="text-white text-6xl md:text-8xl tracking-wider"
              style={{ fontFamily: "Triac71, serif" }}
            >
              DefinitelySafe
            </p>
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
        >
          <source src="/splash.webm" type="video/webm" />
        </video>
      )}
    </div>
  );
}
