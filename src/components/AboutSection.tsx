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

function useHeroTransition() {
  const [transitionState, setTransitionState] = useState({
    isTransitioning: false,
    translateY: "100vh",
    opacity: 0,
  });

  useEffect(() => {
    function handleScroll() {
      const scrollY = window.scrollY;
      const h = window.innerHeight;
      const heroScrollable = h * 4; // Hero section has h-[500vh], so scrollable range is 400vh
      const p = Math.max(0, Math.min(1, scrollY / heroScrollable));
      
      const startP = 147 / 152; // 5th last frame of the hero section (starts 5 frames before ending frame)
      
      if (scrollY < heroScrollable) {
        if (p >= startP) {
          const t = (p - startP) / (1.0 - startP);
          // Easing function for smooth slide up
          const easeT = 1 - Math.pow(1 - t, 2.5); // smooth ease-out
          setTransitionState({
            isTransitioning: true,
            translateY: `${(1 - easeT) * 100}vh`,
            opacity: easeT,
          });
        } else {
          setTransitionState({
            isTransitioning: true,
            translateY: "100vh",
            opacity: 0,
          });
        }
      } else {
        setTransitionState({
          isTransitioning: false,
          translateY: "0px",
          opacity: 1,
        });
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return transitionState;
}

function ParagraphPhase({
  text,
  height,
  isFirst = false,
}: {
  text: string;
  height: string;
  isFirst?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const progress = useScrollProgress(ref);
  const heroTrans = useHeroTransition();

  const isTransitioning = isFirst && heroTrans.isTransitioning;

  return (
    <div
      ref={ref}
      className="relative w-full bg-white"
      style={{ height }}
    >
      <div
        className={
          isTransitioning
            ? "fixed inset-0 flex items-center justify-center overflow-hidden bg-white z-30 pointer-events-none"
            : "sticky top-0 h-screen flex items-center justify-center overflow-hidden"
        }
        style={
          isTransitioning
            ? {
                transform: `translateY(${heroTrans.translateY})`,
                opacity: heroTrans.opacity,
                willChange: "transform, opacity",
              }
            : undefined
        }
      >
        <div className="max-w-3xl mx-auto px-8">
          <WordReveal text={text} progress={isTransitioning ? 0 : progress} />
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
