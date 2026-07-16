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

function isWordBold(words: string[], index: number): boolean {
  for (const phrase of BOLD_PHRASES) {
    const len = phrase.length;
    for (let start = Math.max(0, index - len + 1); start <= index; start++) {
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
        const bold = isWordBold(words, i);
        return (
          <span
            key={i}
            style={{
                fontFamily: bold && opacity > 0.1 ? "TheSkinnyBold, sans-serif" : "TheSkinny, sans-serif",
              opacity,
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
        );
      })}
    </p>
  );
}

function getClipPath(clip: number, shape: string): string {
  const c = Math.max(0, Math.min(100, clip));
  switch (shape) {
    case "angled":
      return `polygon(0 ${c}%, 100% ${Math.max(0, c - 12)}%, 100% 100%, 0 100%)`;
    case "stepped": {
      const s = 5;
      const steps = 8;
      const points: string[] = [];
      for (let i = 0; i <= steps; i++) {
        const x = (i / steps) * 100;
        const y = c + (i % 2 === 0 ? 0 : s);
        points.push(`${x}% ${y}%`);
      }
      points.push("100% 100%", "0% 100%");
      return `polygon(${points.join(", ")})`;
    }
    case "arch": {
      const bulge = 15;
      const archY = Math.max(0, c - bulge);
      return `polygon(0 ${c}%, 25% ${c}%, 50% ${archY}%, 75% ${c}%, 100% ${c}%, 100% 100%, 0 100%)`;
    }
    case "diagonal-corner": {
      const corner = 30;
      return `polygon(${Math.max(0, c - corner)}% 0%, 100% ${Math.max(0, c - corner)}%, 100% 100%, 0 100%)`;
    }
    case "skyline": {
      const w = 100 / 8;
      const heights = [0.6, 0.3, 0.8, 0.2, 0.7, 0.4, 0.9, 0.5];
      const points: string[] = [];
      for (let i = 0; i < 8; i++) {
        const x1 = i * w;
        const x2 = (i + 1) * w;
        const topY = c + (1 - heights[i]) * 15;
        points.push(`${x1}% ${topY}%`, `${x2}% ${topY}%`);
      }
      points.push("100% 100%", "0% 100%");
      return `polygon(${points.join(", ")})`;
    }
    case "crane": {
      const arm = 35;
      return `polygon(0 ${c}%, ${arm}% ${c}%, ${arm}% ${Math.max(0, c - 20)}%, ${arm + 30}% ${Math.max(0, c - 20)}%, ${arm + 30}% ${Math.max(0, c - 16)}%, 100% ${Math.max(0, c - 16)}%, 100% 100%, 0 100%)`;
    }
    case "brick": {
      const rows = 6;
      const rowH = 100 / rows;
      const points: string[] = [];
      for (let i = 0; i < rows; i++) {
        const y = c + i * rowH * 0.4;
        const offset = i % 2 === 0 ? 0 : 12;
        points.push(`0% ${y}%`, `${50 - offset}% ${y}%`, `${50 - offset}% ${y + rowH * 0.4}%`, `0% ${y + rowH * 0.4}%`);
      }
      points.push("0% 100%", "100% 100%");
      for (let i = rows - 1; i >= 0; i--) {
        const y = c + i * rowH * 0.4;
        const offset = i % 2 === 0 ? 0 : 12;
        points.push(`${50 + offset}% ${y + rowH * 0.4}%`, `${50 + offset}% ${y}%`, `100% ${y}%`);
      }
      return `polygon(${points.join(", ")})`;
    }
    case "herringbone": {
      const segs = 10;
      const segW = 100 / segs;
      const points: string[] = [];
      for (let i = 0; i < segs; i++) {
        const x1 = i * segW;
        const x2 = (i + 1) * segW;
        const topY = i % 2 === 0 ? c : c - 6;
        points.push(`${x1}% ${topY}%`, `${x2}% ${topY}%`);
      }
      points.push("100% 100%", "0% 100%");
      return `polygon(${points.join(", ")})`;
    }
    case "foundation": {
      const blocks = [0.5, 0.3, 0.7, 0.2, 0.6];
      const bw = 100 / blocks.length;
      const points: string[] = [];
      for (let i = 0; i < blocks.length; i++) {
        const x1 = i * bw;
        const x2 = (i + 1) * bw;
        const topY = c + (1 - blocks[i]) * 20;
        points.push(`${x1}% ${c}%`, `${x1}% ${topY}%`, `${x2}% ${topY}%`, `${x2}% ${c}%`);
      }
      points.push("100% 100%", "0% 100%");
      return `polygon(${points.join(", ")})`;
    }
    case "trapezoid": {
      const inset = 20;
      return `polygon(${inset}% ${c}%, ${100 - inset}% ${c}%, 100% 100%, 0% 100%)`;
    }
    case "circle": {
      const r = ((100 - c) / 100) * 80;
      return `circle(${r}% at 50% 50%)`;
    }
    case "chevron": {
      const peak = 15;
      return `polygon(0 ${c}%, 50% ${Math.max(0, c - peak)}%, 100% ${c}%, 100% 100%, 0% 100%)`;
    }
    case "riveted": {
      const notches = 6;
      const nw = 100 / notches;
      const depth = 3;
      const points: string[] = [];
      for (let i = 0; i < notches; i++) {
        const x1 = i * nw;
        const xm = x1 + nw * 0.35;
        const xn = x1 + nw * 0.65;
        const x2 = (i + 1) * nw;
        points.push(`${x1}% ${c}%`, `${xm}% ${c}%`, `${xm}% ${c + depth}%`, `${xn}% ${c + depth}%`, `${xn}% ${c}%`, `${x2}% ${c}%`);
      }
      points.push("100% 100%", "0% 100%");
      return `polygon(${points.join(", ")})`;
    }
    case "wave": {
      const peaks = 6;
      const points: string[] = ["0% 100%"];
      for (let i = 0; i <= peaks * 10; i++) {
        const x = (i / (peaks * 10)) * 100;
        const y = c + Math.sin((i / 10) * Math.PI * 2) * 5;
        points.push(`${x}% ${y}%`);
      }
      points.push("100% 100%");
      return `polygon(${points.join(", ")})`;
    }
    case "mountains": {
      const pts = [0.15, 0.35, 0.25, 0.5, 0.1, 0.65, 0.3, 0.8, 0.2, 1.0];
      const points: string[] = [];
      for (let i = 0; i < pts.length; i++) {
        const x = (i / (pts.length - 1)) * 100;
        const y = c + pts[i] * 15;
        points.push(`${x}% ${y}%`);
      }
      points.push("100% 100%", "0% 100%");
      return `polygon(${points.join(", ")})`;
    }
    case "hills": {
      const points: string[] = ["0% 100%"];
      for (let i = 0; i <= 40; i++) {
        const x = (i / 40) * 100;
        const y = c + Math.sin((i / 40) * Math.PI * 3) * 8 + Math.sin((i / 40) * Math.PI * 7) * 3;
        points.push(`${x}% ${y}%`);
      }
      points.push("100% 100%");
      return `polygon(${points.join(", ")})`;
    }
    case "canopy": {
      const points: string[] = ["0% 100%"];
      for (let i = 0; i <= 30; i++) {
        const x = (i / 30) * 100;
        const y = c + Math.sin((i / 30) * Math.PI * 5) * 4 + Math.cos((i / 30) * Math.PI * 11) * 2;
        points.push(`${x}% ${y}%`);
      }
      points.push("100% 100%");
      return `polygon(${points.join(", ")})`;
    }
    case "leaves": {
      const points: string[] = ["0% 100%"];
      const leafCount = 7;
      const segW = 100 / leafCount;
      for (let i = 0; i < leafCount; i++) {
        const x1 = i * segW;
        const xMid = x1 + segW * 0.5;
        const x2 = x1 + segW;
        const tip = c - 8 - (i % 2) * 4;
        const base = c + 2;
        points.push(`${x1}% ${base}%`);
        points.push(`${xMid - segW * 0.15}% ${base - 1}%`);
        points.push(`${xMid}% ${tip}%`);
        points.push(`${xMid + segW * 0.15}% ${base - 1}%`);
        points.push(`${x2}% ${base}%`);
      }
      points.push("100% 100%", "0% 100%");
      return `polygon(${points.join(", ")})`;
    }
    default:
      return `inset(${c}% 0 0 0)`;
  }
}

function ParagraphPhase({ text, height, isFirst = false, revealShape = "rectangle" }: { text: string; height: string; isFirst?: boolean; revealShape?: string }) {
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
        style={isFirst ? { clipPath: getClipPath(clip, revealShape) } : undefined}
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
      <ParagraphPhase text={TEXT_1} height="300vh" isFirst revealShape="chevron" />
      <ParagraphPhase text={TEXT_2} height="300vh" />
    </section>
  );
}
