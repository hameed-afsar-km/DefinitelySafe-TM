"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";

export default function GlobalCursor() {
  const outerRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const outer = outerRef.current;
    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!outer || !ring || !dot) return;

    const anchor = document.querySelector(".mag-anchor");

    // Coordinate quickTo tracking
    // Inner dot follows fast (duration 0.04)
    const dotX = gsap.quickTo(dot, "x", { duration: 0.04, ease: "power3.out" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.04, ease: "power3.out" });

    // Outer ring lags gracefully (duration 0.25)
    const ringX = gsap.quickTo(ring, "x", { duration: 0.25, ease: "power3.out" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.25, ease: "power3.out" });

    const move = (e: MouseEvent) => {
      // Track coordinates
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);

      const targetEl = e.target as HTMLElement;
      const overCatalogue = targetEl?.closest?.("[data-no-cursor]");
      const isHovered = targetEl?.closest?.("a, button, [role='button'], .mag-anchor, [style*='cursor: pointer']");

      // Set visibility
      gsap.to([dot, ring], {
        opacity: overCatalogue ? 0 : 1,
        duration: 0.15
      });

      // Scale states on hover
      if (isHovered) {
        gsap.to(ring, {
          width: 56,
          height: 56,
          marginLeft: -28,
          marginTop: -28,
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          borderColor: "rgba(255, 255, 255, 1)",
          duration: 0.3,
          ease: "power2.out",
          overwrite: "auto"
        });
        gsap.to(dot, {
          scale: 0,
          duration: 0.2,
          overwrite: "auto"
        });
      } else {
        gsap.to(ring, {
          width: 24,
          height: 24,
          marginLeft: -12,
          marginTop: -12,
          backgroundColor: "rgba(255, 255, 255, 0)",
          borderColor: "rgba(255, 255, 255, 0.5)",
          duration: 0.3,
          ease: "power2.out",
          overwrite: "auto"
        });
        gsap.to(dot, {
          scale: 1,
          duration: 0.2,
          overwrite: "auto"
        });
      }

      if (anchor) {
        const r = anchor.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const inside = Math.sqrt(dx * dx + dy * dy) < 150;
        gsap.to([dot, ring], {
          scale: inside ? 0 : 1,
          duration: 0.2,
          overwrite: "auto",
        });
      }
    };

    const enter = () => gsap.to([dot, ring], { scale: 1, opacity: 1, duration: 0.2 });
    const leave = () => gsap.to([dot, ring], { scale: 0, opacity: 0, duration: 0.2 });

    window.addEventListener("mousemove", move);
    document.addEventListener("mouseenter", enter);
    document.addEventListener("mouseleave", leave);

    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseenter", enter);
      document.removeEventListener("mouseleave", leave);
    };
  }, []);

  return (
    <div
      ref={outerRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        pointerEvents: "none",
        zIndex: 9999,
        mixBlendMode: "difference",
      }}
    >
      <div style={{ position: "relative", width: 0, height: 0 }}>
        {/* Trailing Graceful Ring */}
        <div
          ref={ringRef}
          style={{
            position: "absolute",
            width: 24,
            height: 24,
            marginLeft: -12,
            marginTop: -12,
            border: "1.5px solid rgba(255, 255, 255, 0.5)",
            borderRadius: "50%",
            willChange: "width, height, margin, transform, background-color, border-color",
          }}
        />
        {/* Precision Center Dot */}
        <div
          ref={dotRef}
          style={{
            position: "absolute",
            width: 6,
            height: 6,
            marginLeft: -3,
            marginTop: -3,
            backgroundColor: "#fff",
            borderRadius: "50%",
            willChange: "transform",
          }}
        />
      </div>
    </div>
  );
}
