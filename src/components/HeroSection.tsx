"use client";

import { useRef, useEffect, useState } from "react";

const TOTAL_FRAMES = 153;
const LERP_SPEED = 6;
const INDICATOR_EXIT = 0.18;

function framePath(i: number): string {
  return `/hero/scroll%201_${String(i).padStart(3, "0")}.webp`;
}

export default function HeroSection({ showIndicator = false }: { showIndicator?: boolean }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const [loadPct, setLoadPct] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false, desynchronized: true });
    if (!ctx) return;

    let destroyed = false;
    let bitmaps: ImageBitmap[] = new Array(TOTAL_FRAMES);
    let loadedCount = 0;
    let rafId = 0;
    let currentFrame = 0;
    let targetFrame = 0;
    let lastDrawn = -1;
    let lastTime = performance.now();

    function resizeCanvas() {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas!.width = Math.round(window.innerWidth * dpr);
      canvas!.height = Math.round(window.innerHeight * dpr);
      canvas!.style.width = "100%";
      canvas!.style.height = "100%";
      lastDrawn = -1;
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    function drawCover(idx: number) {
      const bm = bitmaps[idx];
      if (!bm) return;
      const cw = canvas!.width;
      const ch = canvas!.height;
      const scale = Math.max(cw / bm.width, ch / bm.height);
      const dw = bm.width * scale;
      const dh = bm.height * scale;
      ctx!.clearRect(0, 0, cw, ch);
      ctx!.drawImage(bm, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
    }

    function updateTarget() {
      const rect = section!.getBoundingClientRect();
      const scrollable = section!.offsetHeight - window.innerHeight;
      const p = Math.max(0, Math.min(1, -rect.top / scrollable));
      const scrubEndP = 142 / 152;
      if (p <= scrubEndP) {
        targetFrame = (p / scrubEndP) * (TOTAL_FRAMES - 1);
      } else {
        targetFrame = TOTAL_FRAMES - 1;
      }

      const indicator = indicatorRef.current;
      if (indicator) {
        const t = Math.min(1, p / INDICATOR_EXIT);
        const scale = 1 + t * 2;
        const translateY = t * 200;
        const opacity = 1 - t;
        indicator.style.transform = `translateX(-50%) translateY(${translateY}px) scale(${scale})`;
        indicator.style.opacity = String(opacity);
      }
    }

    function onScroll() {
      updateTarget();
    }

    function tick(now: number) {
      const dt = Math.min((now - lastTime) / 16.667, 3);
      lastTime = now;

      const diff = targetFrame - currentFrame;
      if (Math.abs(diff) < 0.001) {
        currentFrame = targetFrame;
      } else {
        currentFrame += diff * (1 - Math.exp(-LERP_SPEED * dt));
      }

      const idx = Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.round(currentFrame)));

      if (idx !== lastDrawn && bitmaps[idx]) {
        drawCover(idx);
        lastDrawn = idx;
      }

      rafId = requestAnimationFrame(tick);
    }

    async function loadAll() {
      const CONCURRENT = 12;
      let next = 0;

      async function worker() {
        while (next < TOTAL_FRAMES && !destroyed) {
          const i = next++;
          try {
            const resp = await fetch(framePath(i));
            const blob = await resp.blob();
            const bm = await createImageBitmap(blob);
            bitmaps[i] = bm;
          } catch {
            // retry once
            try {
              const resp = await fetch(framePath(i));
              const blob = await resp.blob();
              bitmaps[i] = await createImageBitmap(blob);
            } catch {
              // skip frame
            }
          }
          loadedCount++;
          setLoadPct(Math.round((loadedCount / TOTAL_FRAMES) * 100));
        }
      }

      await Promise.all(Array.from({ length: CONCURRENT }, worker));
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    updateTarget();

    loadAll().then(() => {
      if (destroyed) return;
      lastTime = performance.now();
      rafId = requestAnimationFrame(tick);
    });

    return () => {
      destroyed = true;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(rafId);
      for (const bm of bitmaps) {
        if (bm) bm.close();
      }
    };
  }, []);

  useEffect(() => {
    if (!showIndicator) return;
    const indicator = indicatorRef.current;
    if (!indicator) return;
    requestAnimationFrame(() => {
      indicator.style.opacity = "1";
      indicator.addEventListener("transitionend", () => {
        indicator.style.transition = "none";
      }, { once: true });
    });
  }, [showIndicator]);

  return (
    <div ref={sectionRef} className="relative h-[500vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
        <canvas ref={canvasRef} className="block h-full w-full" />
        {showIndicator && (
        <div
          ref={indicatorRef}
          className="absolute bottom-10 left-1/2 z-20 flex flex-col items-center gap-2 text-white/70"
          style={{ willChange: "transform, opacity", transform: "translateX(-50%)", opacity: 0, transition: "opacity 1s ease-in" }}
        >
          <span className="text-xs tracking-[0.3em] uppercase">Scroll</span>
          <svg
            width="20"
            height="28"
            viewBox="0 0 20 28"
            fill="none"
            className="animate-bounce"
          >
            <rect
              x="1"
              y="1"
              width="18"
              height="26"
              rx="9"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <circle cx="10" cy="8" r="2" fill="currentColor" />
          </svg>
        </div>
        )}
      </div>
    </div>
  );
}
