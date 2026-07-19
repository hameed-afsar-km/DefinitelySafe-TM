"use client";

import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ─── Fonts & Styles (keyframes only — fonts loaded via layout.tsx) ────────── */
const FOOTER_KEYFRAMES = `
  @keyframes wave-flow {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  .wave-1 { animation: wave-flow 15s linear infinite; }
  .wave-2 { animation: wave-flow 22s linear infinite; }
  .wave-3 { animation: wave-flow 30s linear infinite; }

  @keyframes bounce-bar {
    0%, 100% { height: 2px; }
    50% { height: 10px; }
  }
  .bar-1 { animation: bounce-bar 0.8s ease-in-out infinite; }
  .bar-2 { animation: bounce-bar 0.8s ease-in-out infinite 0.2s; }
  .bar-3 { animation: bounce-bar 0.8s ease-in-out infinite 0.4s; }

  @keyframes blink {
    0%, 100% { opacity: 0; }
    50% { opacity: 1; }
  }
  .blink-cursor::after {
    content: '_';
    display: inline-block;
    animation: blink 1s step-end infinite;
  }

  @keyframes spin-fast {
    100% { transform: rotate(360deg); }
  }
  .spin-fast {
    animation: spin-fast 4s linear infinite;
  }

  @keyframes spin-slow {
    100% { transform: rotate(360deg); }
  }
  .spin-slow {
    animation: spin-slow 15s linear infinite;
  }

  @keyframes draw-path {
    0% { stroke-dashoffset: 200; }
    100% { stroke-dashoffset: 0; }
  }
  .monitor-path {
    stroke-dasharray: 100;
    animation: draw-path 3s linear infinite;
  }
`;

/* ─────────────────────────────────────────────────────────────────────────────
   FOOTER CONTENT (Rendered twice for the B&W Split)
───────────────────────────────────────────────────────────────────────────── */
interface ContentProps {
  inverted: boolean;
  hoveredLink: string | null;
  setHoveredLink: (l: string | null) => void;
}

function FooterContent({ inverted, hoveredLink, setHoveredLink }: ContentProps) {
  const bg = inverted ? "#000" : "#fff";
  const fg = inverted ? "#fff" : "#000";

  return (
    <div style={{ 
      height: "100vh", backgroundColor: bg, color: fg, 
      display: "flex", flexDirection: "column", justifyContent: "space-between", 
      padding: "clamp(2rem, 5vw, 4rem)", boxSizing: "border-box", overflow: "hidden",
      position: "relative"
    }}>
      
      {/* ── LOOPING BACKGROUND VISUAL (Fluid Wave Lines) ── */}
      <div style={{ 
        position: "absolute", top: 0, left: 0, right: 0, bottom: 0, 
        pointerEvents: "none", zIndex: 0, overflow: "hidden", 
        color: fg, opacity: 0.15
      }}>
         {/* Wave 1 */}
         <svg className="wave-1" viewBox="0 0 2000 200" preserveAspectRatio="none" style={{ position: "absolute", width: "200%", height: "30%", top: "25%", willChange: "transform" }}>
            <path d="M 0 100 C 250 30, 250 170, 500 100 C 750 30, 750 170, 1000 100 C 1250 30, 1250 170, 1500 100 C 1750 30, 1750 170, 2000 100" fill="none" stroke="currentColor" strokeWidth="2" />
         </svg>

         {/* Wave 2 */}
         <svg className="wave-2" viewBox="0 0 2000 200" preserveAspectRatio="none" style={{ position: "absolute", width: "200%", height: "30%", top: "40%", willChange: "transform" }}>
            <path d="M 0 120 C 250 80, 250 160, 500 120 C 750 80, 750 160, 1000 120 C 1250 80, 1250 160, 1500 120 C 1750 80, 1750 160, 2000 120" fill="none" stroke="currentColor" strokeWidth="1.5" />
         </svg>

         {/* Wave 3 */}
         <svg className="wave-3" viewBox="0 0 2000 200" preserveAspectRatio="none" style={{ position: "absolute", width: "200%", height: "30%", top: "55%", willChange: "transform" }}>
            <path d="M 0 80 C 250 60, 250 100, 500 80 C 750 60, 750 100, 1000 80 C 1250 60, 1250 100, 1500 80 C 1750 60, 1750 100, 2000 80" fill="none" stroke="currentColor" strokeWidth="1" />
         </svg>
      </div>

      {/* ── TOP HEADER ── */}
      <div style={{ position: "relative", zIndex: 1, display: "flex", justifyContent: "space-between", borderBottom: `2px solid ${inverted ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`, paddingBottom: "2rem", alignItems: "center" }}>
         {/* Left Side: Animated HUD Compass + Live GPS Coordinates */}
         <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ position: "relative", width: "40px", height: "40px", flexShrink: 0 }}>
               <svg className="spin-slow" viewBox="0 0 100 100" style={{ width: "100%", height: "100%", fill: "none", stroke: fg, strokeWidth: 1, willChange: "transform" }}>
                  <circle cx="50" cy="50" r="45" strokeDasharray="3 3" />
                  <circle cx="50" cy="50" r="30" />
                  <line x1="50" y1="5" x2="50" y2="95" />
                  <line x1="5" y1="50" x2="95" y2="50" />
               </svg>
               <div className="spin-fast" style={{ position: "absolute", top: "25%", left: "25%", width: "50%", height: "50%", border: `1px solid ${fg}`, borderRadius: "50%", willChange: "transform" }}>
                  <div style={{ position: "absolute", top: 0, left: "50%", width: "1px", height: "50%", backgroundColor: fg }} />
               </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
               <span data-telemetry="lat" style={{ fontFamily: "var(--f-mono)", fontSize: "0.75rem", letterSpacing: "0.15em", fontWeight: 700 }}>LAT // 40.7128</span>
               <span data-telemetry="lng" style={{ fontFamily: "var(--f-mono)", fontSize: "0.65rem", letterSpacing: "0.15em", color: inverted ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}>LNG // -74.0060</span>
            </div>
         </div>

         {/* Right Side: Animated Telemetry Monitor + Live Hash */}
         <div style={{ display: "flex", alignItems: "center", gap: "1rem", textAlign: "right" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
               <span data-telemetry="hash" style={{ fontFamily: "var(--f-mono)", fontSize: "0.75rem", letterSpacing: "0.15em", fontWeight: 700 }}>SEC_HASH // A7F3</span>
               <span style={{ fontFamily: "var(--f-mono)", fontSize: "0.65rem", letterSpacing: "0.15em", color: inverted ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}>SYS_STATUS // ACTIVE</span>
            </div>
            <div style={{ width: "60px", height: "30px", border: `1px solid ${inverted ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'}`, position: "relative", overflow: "hidden", display: "flex", alignItems: "center", flexShrink: 0 }}>
               <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(to right, ${inverted ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} 1px, transparent 1px)`, backgroundSize: "10px 100%" }} />
               <svg viewBox="0 0 100 40" preserveAspectRatio="none" style={{ width: "100%", height: "100%", stroke: fg, fill: "none", strokeWidth: 1.5 }}>
                  <path className="monitor-path" d="M0 20 L20 20 L25 5 L30 35 L35 20 L50 20 L55 10 L60 30 L65 20 L100 20" />
               </svg>
            </div>
         </div>
      </div>

      {/* ── MASSIVE SCROLL TEXT ── */}
      {/* 
        This is where the optical contrast illusion happens. 
        The Base layer alternates between outlined and solid text.
        The Top (Inverted) layer is completely solid white text.
        When the slice cuts through them, it creates a wildly complex geometric inversion.
      */}
      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", margin: "2rem 0", pointerEvents: "none" }}>
         <div className="marquee-1" style={{ 
            width: "max-content", fontFamily: "var(--f-title)", fontSize: "clamp(7rem, 16vw, 18rem)", lineHeight: 0.9, whiteSpace: "nowrap", letterSpacing: "-0.01em",
            ...(inverted ? { color: fg, WebkitTextStroke: "none" } : { color: "transparent", WebkitTextStroke: `3px ${fg}` })
         }}>
            DEFINITELY SAFE — DEFINITELY SAFE — DEFINITELY SAFE
         </div>
         
         <div className="marquee-2" style={{ 
            width: "max-content", fontFamily: "var(--f-title)", fontSize: "clamp(7rem, 16vw, 18rem)", lineHeight: 0.9, whiteSpace: "nowrap", letterSpacing: "-0.01em", marginLeft: "-15vw",
            color: fg, WebkitTextStroke: "none"
         }}>
            DEFINITELY SAFE — DEFINITELY SAFE — DEFINITELY SAFE
         </div>
         
         <div className="marquee-3" style={{ 
            width: "max-content", fontFamily: "var(--f-title)", fontSize: "clamp(7rem, 16vw, 18rem)", lineHeight: 0.9, whiteSpace: "nowrap", letterSpacing: "-0.01em", marginLeft: "-5vw",
            ...(inverted ? { color: fg, WebkitTextStroke: "none" } : { color: "transparent", WebkitTextStroke: `3px ${fg}` })
         }}>
            DEFINITELY SAFE — DEFINITELY SAFE — DEFINITELY SAFE
         </div>
      </div>

      {/* ── BOTTOM NAV & CTA ── */}
      <div style={{ position: "relative", zIndex: 1, display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "2rem" }}>
         
         {/* Navigation Links */}
         <div style={{ display: "flex", gap: "clamp(2rem, 5vw, 5rem)", flexWrap: "wrap" }}>
            {["WORK", "STUDIO", "JOURNAL", "CONTACT"].map(l => {
               const isHov = hoveredLink === l;
               return (
                  <a key={l} href="#"
                     onMouseEnter={() => !inverted && setHoveredLink(l)}
                     onMouseLeave={() => !inverted && setHoveredLink(null)}
                     style={{
                        fontFamily: "var(--f-mono)", fontSize: "clamp(1rem, 1.2vw, 1.2rem)", fontWeight: 700,
                        textTransform: "uppercase", textDecoration: "none", color: fg,
                        position: "relative", pointerEvents: inverted ? "none" : "auto"
                     }}>
                     {l}
                     {/* The animated underline */}
                     <div style={{
                        position: "absolute", bottom: -6, left: 0, width: "100%", height: 3,
                        backgroundColor: fg, transform: `scaleX(${isHov ? 1 : 0})`,
                        transformOrigin: "left", transition: "transform 0.4s cubic-bezier(0.76, 0, 0.24, 1)"
                     }} />
                  </a>
               )
            })}
         </div>

         {/* Magnetic Anchor only on base layer to prevent double events */}
         <div className={inverted ? "" : "mag-anchor"} style={{ position: "relative", width: "clamp(120px, 14vw, 160px)", height: "clamp(120px, 14vw, 160px)", pointerEvents: inverted ? "none" : "auto", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {/* Looping ring animation */}
            <div className="loop-ring" style={{ position: "absolute", top: "-15%", left: "-15%", width: "130%", height: "130%", borderRadius: "50%", border: `2px dashed ${inverted ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)'}`, pointerEvents: "none", willChange: "transform" }} />
            
            {/* The mag-target class allows GSAP to pull BOTH buttons synchronously */}
            <button className="mag-target" style={{
               width: "100%", height: "100%", borderRadius: "50%",
               backgroundColor: fg, color: bg,
               fontFamily: "var(--f-title)", fontSize: "clamp(1.5rem, 2vw, 2.5rem)", letterSpacing: "0.05em",
               border: "none", cursor: "none", willChange: "transform"
            }}>
               START
            </button>
         </div>

      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN FOOTER
───────────────────────────────────────────────────────────────────────────── */
export default function FooterSection() {
  const footerRef = useRef<HTMLElement>(null);
  const topLayerRef = useRef<HTMLDivElement>(null);
  
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const splitPos = useRef({ x: typeof window !== "undefined" ? window.innerWidth / 2 : 500 });
  const anchorRef = useRef<Element | null>(null);

  useEffect(() => {
    anchorRef.current = document.querySelector(".mag-anchor");

    const updateTelemetry = () => {
      const lat = (40.7120 + Math.random() * 0.002).toFixed(4);
      const lng = (-74.0070 + Math.random() * 0.002).toFixed(4);
      const hash = Math.random().toString(16).substring(2, 6).toUpperCase();
      const els = footerRef.current?.querySelectorAll("[data-telemetry]");
      if (!els) return;
      els.forEach((el) => {
        const key = el.getAttribute("data-telemetry");
        if (key === "lat") el.textContent = `LAT // ${lat}`;
        else if (key === "lng") el.textContent = `LNG // ${lng}`;
        else if (key === "hash") el.textContent = `SEC_HASH // ${hash}`;
      });
    };

    const interval = setInterval(updateTelemetry, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const setClip = () => {
       const topX = splitPos.current.x + 300;
       const botX = splitPos.current.x - 300;
       if (topLayerRef.current) {
          topLayerRef.current.style.clipPath = `polygon(${topX}px 0, 100% 0, 100% 100%, ${botX}px 100%)`;
       }
    };
    setClip();

    const move = (e: MouseEvent) => {
       gsap.to(splitPos.current, {
          x: e.clientX, duration: 0.6, ease: "power2.out", onUpdate: setClip, overwrite: true
       });

       const anchor = anchorRef.current;
       if (anchor) {
          const aRect = anchor.getBoundingClientRect();
          const cx = aRect.left + aRect.width/2;
          const cy = aRect.top + aRect.height/2;
          const dx = e.clientX - cx;
          const dy = e.clientY - cy;
          
          if (Math.sqrt(dx*dx + dy*dy) < 150) {
             gsap.to(".mag-target", { x: dx*0.35, y: dy*0.35, duration: 0.4, ease: "power2.out", overwrite: "auto" });
          } else {
             gsap.to(".mag-target", { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.4)", overwrite: "auto" });
          }
       }
    };

    const leave = () => {
       gsap.to(splitPos.current, {
          x: window.innerWidth / 2, duration: 1.2, ease: "elastic.out(1, 0.4)", onUpdate: setClip
       });
    };

    const ft = footerRef.current;
    if (ft) {
       ft.addEventListener("mousemove", move);
       ft.addEventListener("mouseleave", leave);
       return () => {
          ft.removeEventListener("mousemove", move);
          ft.removeEventListener("mouseleave", leave);
       }
    }
  }, []);

  useGSAP(() => {
    // Both layers' marquees are driven perfectly in sync by these selectors
    gsap.to(".marquee-1", { xPercent: -12, ease: "none", scrollTrigger: { trigger: ".ft-root", start: "top bottom", end: "bottom top", scrub: 1 } });
    gsap.to(".marquee-2", { xPercent: 12, ease: "none", scrollTrigger: { trigger: ".ft-root", start: "top bottom", end: "bottom top", scrub: 1 } });
    gsap.to(".marquee-3", { xPercent: -12, ease: "none", scrollTrigger: { trigger: ".ft-root", start: "top bottom", end: "bottom top", scrub: 1 } });

  }, { scope: footerRef });

  return (
    <footer ref={footerRef} className="ft-root" style={{ position: "relative", height: "100vh", backgroundColor: "#fff", overflow: "hidden" }}>
       <style dangerouslySetInnerHTML={{ __html: FOOTER_KEYFRAMES }} />

       {/* ═══ LAYER 1: THE WHITE BASE ════════════════════════════════════════════ */}
       <div style={{ position: "absolute", inset: 0, zIndex: 1 }}>
          <FooterContent inverted={false} hoveredLink={hoveredLink} setHoveredLink={setHoveredLink} />
       </div>

       {/* ═══ LAYER 2: THE BLACK INVERSION (ANGLED CLIP PATH) ════════════════════ */}
       <div ref={topLayerRef} style={{ 
         position: "absolute", inset: 0, zIndex: 2, 
         pointerEvents: "none", willChange: "clip-path" 
       }}>
          <FooterContent inverted={true} hoveredLink={hoveredLink} setHoveredLink={setHoveredLink} />
       </div>

    </footer>
  );
}
