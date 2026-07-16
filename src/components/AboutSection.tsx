"use client";

import { useRef, useEffect, useState, useMemo } from "react";

const TEXT_1 =
  "At DefinitelySafe\u2122, we believe every great structure starts with precision and ends with trust. From planning to completion, we focus on quality craftsmanship, durable materials, and attention to every detail\u2014building spaces designed to last.";

const TEXT_2 =
  "Whether it\u2019s residential, commercial, or industrial construction, our goal is simple: deliver projects that are safe, reliable, and built with confidence. Because great construction isn\u2019t just about creating buildings\u2014it\u2019s about creating peace of mind.";

function useScrollProgress(ref: React.RefObject<HTMLDivElement | null>) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    function onScroll() {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const h = el.offsetHeight - window.innerHeight;
      const p = Math.max(0, Math.min(1, -rect.top / h));
      setProgress(p);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [ref]);
  return progress;
}

function useParallaxClip(ref: React.RefObject<HTMLDivElement | null>) {
  const [clip, setClip] = useState(100);
  useEffect(() => {
    function onScroll() {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.max(0, Math.min(1, 1 - rect.top / vh));
      setClip(100 - p * 100);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [ref]);
  return clip;
}

function WordReveal({ text, progress }: { text: string; progress: number }) {
  const words = useMemo(() => text.split(" "), [text]);
  const total = words.length;

  return (
    <p className="text-3xl md:text-5xl lg:text-[3.5rem] leading-snug text-black">
      {words.map((word, i) => {
        const start = i / total;
        const end = (i + 1) / total;
        const mid = (start + end) / 2;
        const range = 0.4 / total;
        const opacity = Math.max(0.1, Math.min(1, (progress - mid + range) / range));
        return (
          <span
            key={i}
            style={{
              fontFamily: "TheSkinny, sans-serif",
              opacity,
              transition: "opacity 0.15s ease-out",
            }}
          >
            {word}{" "}
          </span>
        );
      })}
    </p>
  );
}

function ParagraphPhase({ text, height, isFirst = false }: { text: string; height: string; isFirst?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const progress = useScrollProgress(ref);
  const clip = useParallaxClip(ref);

  return (
    <div
      ref={ref}
      className="relative w-full"
      style={{ height }}
    >
      <div
        className="sticky top-0 h-screen flex items-center justify-center overflow-hidden bg-white"
        style={isFirst ? { clipPath: `inset(${clip}% 0 0 0)` } : undefined}
      >
        <div className="max-w-3xl mx-auto px-8">
          <WordReveal text={text} progress={progress} />
        </div>
      </div>
    </div>
  );
}

export default function AboutSection() {
  return (
    <section className="relative w-full">
      <ParagraphPhase text={TEXT_1} height="300vh" isFirst />
      <ParagraphPhase text={TEXT_2} height="300vh" />
    </section>
  );
}
