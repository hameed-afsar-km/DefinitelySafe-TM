"use client";

import React, { useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ─────────────────────────────────────────────────────────────────────────────
// Architectural Grid Components
// ─────────────────────────────────────────────────────────────────────────────
const Label = ({ text, isHovered }: { text: string, isHovered?: boolean }) => {
  return (
    <div style={{ width: "100%", height: "100%", backgroundColor: "#ffffff", display: "flex", padding: "10%", alignItems: "flex-end", boxSizing: "border-box", overflow: "hidden" }}>
      <div style={{ position: "relative", height: "5cqmin", overflow: "hidden" }}>
        {/* Primary Text */}
        <span style={{ 
           fontFamily: "'Courier New', Courier, monospace", fontSize: "5cqmin", fontWeight: "bold", color: "#000000", textTransform: "uppercase", 
           display: "block",
           lineHeight: 1,
           transition: "transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)",
           transform: isHovered ? "translateY(-100%)" : "translateY(0%)"
        }}>
          {text}
        </span>
        {/* Secondary Text (Hidden below) */}
        <span style={{ 
           fontFamily: "'Courier New', Courier, monospace", fontSize: "5cqmin", fontWeight: "bold", color: "#000000", textTransform: "uppercase", 
           display: "block", position: "absolute", top: 0, left: 0,
           lineHeight: 1,
           transition: "transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)",
           transform: isHovered ? "translateY(0%)" : "translateY(100%)"
        }}>
          {text}
        </span>
      </div>
    </div>
  );
};

const Cross = ({ isHovered }: { isHovered?: boolean }) => {
  return (
    <div style={{ width: "100%", height: "100%", backgroundColor: "#ffffff", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div style={{ 
        position: "relative", width: "25cqmin", height: "25cqmin",
        transition: "transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)",
        transform: isHovered ? "rotate(135deg)" : "rotate(0deg)" 
      }}>
         <div style={{ 
            position: "absolute", top: "50%", left: isHovered ? "25%" : 0, width: isHovered ? "50%" : "100%", height: isHovered ? "50%" : "4px", backgroundColor: "#000000", marginTop: isHovered ? "-12.5cqmin" : "-2px",
            borderRadius: isHovered ? "50%" : "0%", transition: "all 0.6s cubic-bezier(0.25, 1, 0.5, 1)" 
         }} />
         <div style={{ 
            position: "absolute", left: "50%", top: isHovered ? "25%" : 0, height: isHovered ? "50%" : "100%", width: isHovered ? "50%" : "4px", backgroundColor: "#000000", marginLeft: isHovered ? "-12.5cqmin" : "-2px",
            borderRadius: isHovered ? "50%" : "0%", transition: "all 0.6s cubic-bezier(0.25, 1, 0.5, 1)" 
         }} />
      </div>
    </div>
  );
};

const Stripes = ({ isHovered }: { isHovered?: boolean }) => {
  return (
    <div style={{ width: "100%", height: "100%", overflow: "hidden", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div style={{
        width: "200%", height: "200%",
        background: "repeating-linear-gradient(0deg, #000000 0, #000000 2px, #ffffff 2px, #ffffff 12px)",
        transition: "transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)",
        transform: isHovered ? "rotate(90deg) scale(1.2)" : "rotate(45deg) scale(1)",
      }} />
    </div>
  );
};

const CellText = ({ text, highlight, isHovered }: { text: string, highlight?: boolean, isHovered?: boolean }) => {
  return (
    <div style={{ 
      width: "100%", height: "100%", 
      display: "flex", justifyContent: "center", alignItems: "center",
      backgroundColor: highlight ? (isHovered ? "#ffffff" : "#000000") : (isHovered ? "#000000" : "#ffffff"),
      transition: "background-color 0.6s cubic-bezier(0.25, 1, 0.5, 1)",
    }}>
      <h2 style={{ 
         fontSize: "12cqmin", 
         fontWeight: 900, 
         margin: 0, 
         whiteSpace: "nowrap",
         fontFamily: "var(--font-geist-sans), sans-serif",
         letterSpacing: "-0.04em",
         transition: "all 0.6s cubic-bezier(0.25, 1, 0.5, 1)",
         WebkitTextStroke: isHovered ? (highlight ? "2px #000000" : "2px #ffffff") : "0px transparent",
         color: isHovered ? "transparent" : (highlight ? "#ffffff" : "#000000"),
         transform: isHovered ? "scale(1.1)" : "scale(1)"
      }}>
        {text}
      </h2>
    </div>
  );
};

const GsapAnimationCell = () => {
  const cellRef = useRef<HTMLDivElement>(null);
  const ring1Ref = useRef<HTMLDivElement>(null);
  const ring2Ref = useRef<HTMLDivElement>(null);
  const ring3Ref = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const crossRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Radar pulse — rings expand outward and fade, staggered
    [ring1Ref, ring2Ref, ring3Ref].forEach((ref, i) => {
      gsap.fromTo(ref.current,
        { scale: 0.3, opacity: 0.8 },
        {
          scale: 1.3,
          opacity: 0,
          duration: 2.5,
          repeat: -1,
          ease: "power1.out",
          delay: i * 0.7,
        }
      );
    });

    // Central dot breathing
    gsap.to(dotRef.current, {
      scale: 1.4,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    // Slow rotating crosshair
    gsap.to(crossRef.current, {
      rotation: 360,
      duration: 12,
      repeat: -1,
      ease: "none",
    });
  }, { scope: cellRef });

  return (
    <div ref={cellRef} style={{
      width: "100%", height: "100%",
      display: "flex", justifyContent: "center", alignItems: "center",
      backgroundColor: "#ffffff", padding: "10%",
      position: "relative", overflow: "hidden",
    }}>
      {/* Radar pulse rings */}
      <div ref={ring1Ref} style={{ position: "absolute", width: "45%", height: "45%", border: "2px solid #000000", borderRadius: "50%" }} />
      <div ref={ring2Ref} style={{ position: "absolute", width: "45%", height: "45%", border: "2px solid #000000", borderRadius: "50%" }} />
      <div ref={ring3Ref} style={{ position: "absolute", width: "45%", height: "45%", border: "2px solid #000000", borderRadius: "50%" }} />

      {/* Rotating crosshair */}
      <div ref={crossRef} style={{
        position: "absolute",
        width: "55%", height: "55%",
      }}>
        <div style={{ position: "absolute", top: "50%", left: 0, width: "100%", height: "1.5px", backgroundColor: "#000000", transform: "translateY(-50%)" }} />
        <div style={{ position: "absolute", left: "50%", top: 0, width: "1.5px", height: "100%", backgroundColor: "#000000", transform: "translateX(-50%)" }} />
      </div>

      {/* Central pulsing dot */}
      <div ref={dotRef} style={{
        width: "10%", height: "10%",
        backgroundColor: "#000000",
        borderRadius: "50%",
        zIndex: 1,
      }} />
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Floorplan Layout Matrix
// ─────────────────────────────────────────────────────────────────────────────
const gridLayout = [
  // ROW 1
  { id: "0-0", render: (isHovered: boolean) => <Cross isHovered={isHovered} /> },
  { id: "0-1", render: (isHovered: boolean) => <Label text="01. REACTION" isHovered={isHovered} /> },
  { id: "0-2", render: (isHovered: boolean) => <Stripes isHovered={isHovered} /> },
  { id: "0-3", render: (isHovered: boolean) => <CellText text="LOVE IT?" isHovered={isHovered} /> },
  
  // ROW 2
  { id: "1-0", render: (isHovered: boolean) => <Stripes isHovered={isHovered} /> },
  { id: "1-1", render: (isHovered: boolean) => <Label text="SEC: ALPHA" isHovered={isHovered} /> },
  { id: "1-2", render: (isHovered: boolean) => <Label text="02. FEELING" isHovered={isHovered} /> },
  { id: "1-3", render: (isHovered: boolean) => <CellText text="INSPIRING?" highlight isHovered={isHovered} /> },
  
  // ROW 3
  { id: "2-0", render: (isHovered: boolean) => <CellText text="LET'S GET" highlight isHovered={isHovered} /> },
  { id: "2-1", render: (isHovered: boolean) => <Stripes isHovered={isHovered} /> },
  { id: "2-2", render: (isHovered: boolean) => <Cross isHovered={isHovered} /> },
  { id: "2-3", render: (isHovered: boolean) => <CellText text="CONSTRUCTED!" isHovered={isHovered} /> },
  
  // ROW 4
  { id: "3-0", render: (isHovered: boolean) => <Label text="03. ACTION" isHovered={isHovered} /> },
  { id: "3-1", render: (isHovered: boolean) => <Label text="ELEV: 400M" isHovered={isHovered} /> },
  { id: "3-2", render: (isHovered: boolean) => <Stripes isHovered={isHovered} /> },
  { id: "3-3", render: () => <GsapAnimationCell /> },
];

export default function CallToActionSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Tracks which room the user is hovering to expand the floorplan
  const [activeCol, setActiveCol] = useState(-1);
  const [activeRow, setActiveRow] = useState(-1);

  // ─────────────────────────────────────────────────────────────────────────────
  // SCROLL BASED ANIMATION (The Construction Assembly & Zoom Exit)
  // ─────────────────────────────────────────────────────────────────────────────
  useGSAP(() => {
    // Start the rooms as small dots
    gsap.set(".grid-cell", { scale: 0, borderRadius: "50%", opacity: 0 });

    // 1. PIN THE ENTIRE SECTION FOR 160vh
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "+=160%", 
      pin: true,
    });

    // 2. ENTRANCE & ASSEMBLY (Plays automatically when pinned)
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        toggleActions: "play none none reverse",
      }
    });

    // The grid is revealed through an expanding circular mask
    tl.fromTo(".floorplan-grid", 
      { clipPath: "circle(0% at 50% 50%)" },
      { clipPath: "circle(150% at 50% 50%)", duration: 1, ease: "power2.inOut", force3D: true }
    );

    // Snap the rooms into a rigid structural grid
    tl.to(".grid-cell", {
      scale: 1,
      opacity: 1,
      borderRadius: "0%", 
      duration: 1.2,
      stagger: { amount: 1, grid: [4, 4], from: "center" }, 
      ease: "power4.out",
      force3D: true
    }, "-=0.5");

    // 3. CINEMATIC ZOOM-THROUGH EXIT (Plays while scrolling the last 100vh of the pin)
    gsap.to(".floorplan-grid", {
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top -60%", // Starts after 60vh of scroll
        end: "top -160%",  // Ends at 160vh of scroll (right as it unpins)
        scrub: true,
      },
      scale: 30, // Exponential zoom through the center gap
      opacity: 0, 
      transformOrigin: "50% 50%",
      ease: "power3.in",
      force3D: true
    });

    // Fade background to pitch black as you dive through the grid
    gsap.to(sectionRef.current, {
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top -110%", // Starts halfway through the zoom
        end: "top -160%",
        scrub: true,
      },
      backgroundColor: "#000000",
      ease: "none"
    });

  }, { scope: containerRef });

  // ─────────────────────────────────────────────────────────────────────────────
  // DYNAMIC GRID PHYSICS
  // ─────────────────────────────────────────────────────────────────────────────
  const gridStyle: React.CSSProperties = {
    display: "grid",
    // Elastic Grid Math: Expands the hovered column/row to 2.5x size, shrinks others
    gridTemplateColumns: [0, 1, 2, 3].map(i => i === activeCol ? "2.5fr" : "1fr").join(" "),
    gridTemplateRows: [0, 1, 2, 3].map(i => i === activeRow ? "2.5fr" : "1fr").join(" "),
    transition: "grid-template-columns 0.6s cubic-bezier(0.25, 1, 0.5, 1), grid-template-rows 0.6s cubic-bezier(0.25, 1, 0.5, 1)",
    width: "100%",
    height: "100%",
    border: "4px solid #000000",
    backgroundColor: "#000000", // Shows through the gaps as thick structural walls
    gap: "4px",
    boxSizing: "border-box",
    contain: "layout paint",
    willChange: "transform, opacity, clip-path"
  };

  return (
    <div ref={containerRef}>
      <section
        ref={sectionRef}
        style={{
          height: "100vh",
          width: "100vw",
          backgroundColor: "#ffffff",
          zIndex: 40,
          position: "relative",
        }}
      >
        <div style={{ padding: "5vh 5vw", width: "100%", height: "100%", boxSizing: "border-box" }}>
          
          {/* ── THE ELASTIC FLOORPLAN ── */}
          <div 
            className="floorplan-grid"
            style={gridStyle}
            // Reset grid physics when mouse leaves the entire floorplan
            onMouseLeave={() => { setActiveCol(-1); setActiveRow(-1); }}
          >
            {gridLayout.map((cell, i) => {
              const row = Math.floor(i / 4);
              const col = i % 4;
              const isHovered = activeCol === col && activeRow === row;
              return (
                <div 
                  key={cell.id}
                  className="grid-cell"
                  onMouseEnter={() => { setActiveCol(col); setActiveRow(row); }}
                  style={{
                    containerType: "inline-size", // CRITICAL: Enables CSS Container Queries for fluid typography!
                    width: "100%", height: "100%",
                    overflow: "hidden", 
                    backgroundColor: "#ffffff", // Default room color
                    contain: "layout paint",
                  }}
                >
                  {cell.render(isHovered)}
                </div>
              )
            })}
      </div>
      </div>
      </section>
    </div>
  );
}
