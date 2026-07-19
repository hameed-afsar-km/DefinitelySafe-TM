"use client";

import { useRef, useEffect, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const TOTAL_FRAMES = 42;
const LERP_SPEED = 12;
const BEAM_COUNT = 8;
const TRANSITION_END = 0.3;

const springConfig = { damping: 25, stiffness: 150 };

function framePath(i: number): string {
  return `/scroll2/scroll%202_${String(i).padStart(3, "0")}.webp`;
}

export default function Scroll2Section() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const beamRefs = useRef<(HTMLDivElement | null)[]>([]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(springY, [-0.5, 0.5], [3, -3]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [3, -3]);
  const translateX = useTransform(springX, [-0.5, 0.5], [12, -12]);
  const translateY = useTransform(springY, [-0.5, 0.5], [12, -12]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  }, [mouseX, mouseY]);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false, desynchronized: true });
    if (!ctx) return;

    let destroyed = false;
    const bitmaps: ImageBitmap[] = new Array(TOTAL_FRAMES);
    let rafId = 0;
    let running = false;
    let currentFrame = 0;
    let targetFrame = 0;
    let lastDrawn = -1;
    let lastTime = performance.now();
    let pendingBeamP = 0;
    const controller = new AbortController();

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

    function applyBeams(progress: number) {
      for (let i = 0; i < BEAM_COUNT; i++) {
        const beam = beamRefs.current[i];
        if (!beam) continue;
        const stagger = (i / BEAM_COUNT) * 0.4;
        const localP = Math.max(0, Math.min(1, (progress - stagger) / 0.6));
        const eased = localP * localP * localP;
        const direction = i % 2 === 0 ? -1 : 1;
        beam.style.transform = `translateX(${direction * eased * 110}%)`;
        beam.style.opacity = String(1 - eased);
      }
    }

    function updateTarget() {
      const rect = section!.getBoundingClientRect();
      const scrollable = section!.offsetHeight - window.innerHeight;
      const p = Math.max(0, Math.min(1, -rect.top / scrollable));

      if (p <= TRANSITION_END) {
        targetFrame = 0;
      } else {
        const scrubP = (p - TRANSITION_END) / (1 - TRANSITION_END);
        targetFrame = scrubP * (TOTAL_FRAMES - 1);
      }

      pendingBeamP = Math.min(1, p / TRANSITION_END);
    }

    function onScroll() {
      updateTarget();
      applyBeams(pendingBeamP);
      if (!running && currentFrame !== targetFrame) startLoop();
    }

    function tick(now: number) {
      if (!running) return;
      const dt = Math.min((now - lastTime) / 16.667, 3);
      lastTime = now;

      const diff = targetFrame - currentFrame;
      if (Math.abs(diff) < 0.001) {
        currentFrame = targetFrame;
        running = false;
      } else {
        currentFrame += diff * (1 - Math.exp(-LERP_SPEED * dt));
      }

      const idx = Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.round(currentFrame)));

      if (idx !== lastDrawn && bitmaps[idx]) {
        drawCover(idx);
        lastDrawn = idx;
      }

      if (running) rafId = requestAnimationFrame(tick);
    }

    function startLoop() {
      if (running) return;
      running = true;
      lastTime = performance.now();
      rafId = requestAnimationFrame(tick);
    }

    function stopLoop() {
      running = false;
      cancelAnimationFrame(rafId);
    }

    const stickyEl = section.querySelector(".sticky") as HTMLElement | null;
    const visObs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startLoop();
        } else {
          stopLoop();
        }
      },
      { threshold: 0 }
    );
    if (stickyEl) visObs.observe(stickyEl);

    async function loadAll() {
      const CONCURRENT = 6;
      let next = 0;

      async function worker() {
        while (next < TOTAL_FRAMES && !destroyed) {
          const i = next++;
          try {
            const resp = await fetch(framePath(i), { signal: controller.signal });
            const blob = await resp.blob();
            bitmaps[i] = await createImageBitmap(blob);
          } catch {
            try {
              const resp = await fetch(framePath(i), { signal: controller.signal });
              const blob = await resp.blob();
              bitmaps[i] = await createImageBitmap(blob);
            } catch {
              // skip frame
            }
          }
        }
      }

      await Promise.all(Array.from({ length: CONCURRENT }, worker));
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    updateTarget();

    loadAll().then(() => {
      if (destroyed) return;
      lastTime = performance.now();
      startLoop();
    });

    return () => {
      destroyed = true;
      controller.abort();
      stopLoop();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", resizeCanvas);
      visObs.disconnect();
      for (const bm of bitmaps) {
        if (bm) bm.close();
      }
    };
  }, []);

  return (
    <div ref={sectionRef} className="relative h-[400vh]">
      <div
        className="sticky top-0 h-screen w-full overflow-hidden bg-black"
        onMouseMove={handleMouseMove}
      >
        <motion.div
          className="w-full h-full"
          style={{
            perspective: 1000,
            rotateX,
            rotateY,
            x: translateX,
            y: translateY,
            scale: 1.02,
          }}
        >
          <canvas ref={canvasRef} className="block h-full w-full" />
        </motion.div>

        <div className="absolute inset-0 z-10 pointer-events-none">
          {Array.from({ length: BEAM_COUNT }, (_, i) => (
            <div
              key={i}
              ref={(el) => { beamRefs.current[i] = el; }}
              className="absolute left-0 w-full"
              style={{
                top: `${(i / BEAM_COUNT) * 100}%`,
                height: `${100 / BEAM_COUNT + 0.5}%`,
                background: "linear-gradient(180deg, #d1d5db 0%, #e5e7eb 40%, #f3f4f6 60%, #e5e7eb 100%)",
                borderBottom: "1px solid #9ca3af",
                boxShadow: "0 1px 3px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.5)",
                willChange: "transform, opacity",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
