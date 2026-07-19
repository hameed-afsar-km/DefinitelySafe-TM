"use client";

import { useRef, useEffect, useMemo } from "react";

const TEXT_1 =
  "At DefinitelySafe\u2122, we believe every great structure starts with precision and ends with trust. From planning to completion, we focus on quality craftsmanship, durable materials, and attention to every detail\u2014building spaces designed to last.";

const TEXT_2 =
  "Whether it\u2019s residential, commercial, or industrial construction, our goal is simple: deliver projects that are safe, reliable, and built with confidence. Because great construction isn\u2019t just about creating buildings\u2014it\u2019s about creating peace of mind.";

function stripPunct(w: string): string {
  return w.toLowerCase().replace(/[^a-z0-9]/g, "");
}

const BOLD_PHRASES: string[][] = [
  ["definitelysafe"],
  ["precision"],
  ["trust"],
  ["designed", "to", "last"],
  ["safe", "reliable"],
  ["built", "with", "confidence"],
  ["peace", "of", "mind"],
];

function computeBoldMap(words: string[]): boolean[] {
  return words.map((_, i) => {
    for (const phrase of BOLD_PHRASES) {
      const len = phrase.length;
      for (let start = Math.max(0, i - len + 1); start <= i; start++) {
        if (start + len > words.length) continue;
        let match = true;
        for (let j = 0; j < len; j++) {
          if (stripPunct(words[start + j]) !== phrase[j]) {
            match = false;
            break;
          }
        }
        if (match) return true;
      }
    }
    return false;
  });
}

function WordReveal({ text, wordsRef }: { text: string; wordsRef: React.RefObject<HTMLDivElement | null> }) {
  const words = useMemo(() => text.split(" "), [text]);
  const boldMap = useMemo(() => computeBoldMap(words), [words]);

  return (
    <p className="text-[2.5rem] md:text-5xl lg:text-[3.5rem] leading-snug text-black" ref={wordsRef}>
      {words.map((word, i) => (
        <span
          key={i}
          data-word
          style={{
            fontFamily: boldMap[i] ? "TheSkinnyBold, sans-serif" : "TheSkinny, sans-serif",
            opacity: 0.1,
            transition: "opacity 0.15s ease-out",
          }}
        >
          {word.includes("\u2122") ? (
            <>
              {word.split("\u2122")[0]}
              <sup style={{ fontSize: "0.5em", marginLeft: "-0.15em", verticalAlign: "0.41em", fontWeight: 700 }}>™</sup>
            </>
          ) : (
            word
          )}{" "}
        </span>
      ))}
    </p>
  );
}

function getClipPath(clip: number, shape: string): string {
  const c = Math.max(0, Math.min(100, clip));
  if (shape === "chevron") {
    const peak = 15;
    return `polygon(0 ${c}%, 50% ${Math.max(0, c - peak)}%, 100% ${c}%, 100% 100%, 0% 100%)`;
  }
  return `inset(${c}% 0 0 0)`;
}

function ParagraphPhase({ text, height, isFirst = false, revealShape = "rectangle" }: { text: string; height: string; isFirst?: boolean; revealShape?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const wordsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const totalWords = text.split(" ").length;

    function onScroll() {
      const rect = el!.getBoundingClientRect();
      const vh = window.innerHeight;
      const h = el!.offsetHeight - vh;
      const progress = Math.max(0, Math.min(1, -rect.top / h));
      const clip = 100 - Math.max(0, Math.min(1, 1 - rect.top / vh)) * 100;

      if (isFirst && stickyRef.current) {
        stickyRef.current.style.clipPath = getClipPath(clip, revealShape);
      }

      if (wordsRef.current) {
        const spans = wordsRef.current.querySelectorAll("[data-word]");
        for (let i = 0; i < spans.length; i++) {
          const start = i / totalWords;
          const end = (i + 1) / totalWords;
          const mid = (start + end) / 2;
          const range = 0.4 / totalWords;
          const opacity = Math.max(0.1, Math.min(1, (progress - mid + range) / range));
          (spans[i] as HTMLElement).style.opacity = String(opacity);
        }
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [text, isFirst, revealShape]);

  return (
    <div
      ref={ref}
      className="relative w-full"
      style={{ height }}
    >
      <div
        ref={stickyRef}
        className="sticky top-0 h-screen flex items-center justify-center overflow-hidden bg-white"
      >
        <div className="max-w-3xl mx-auto px-8">
          <WordReveal text={text} wordsRef={wordsRef} />
        </div>
      </div>
    </div>
  );
}

export default function AboutSection() {
  return (
    <section className="relative w-full">
      <ParagraphPhase text={TEXT_1} height="300vh" isFirst revealShape="chevron" />
      <ParagraphPhase text={TEXT_2} height="300vh" />
    </section>
  );
}
