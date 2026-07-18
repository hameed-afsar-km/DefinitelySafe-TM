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
const Label = ({ text }: { text: string }) => (
  <div style={{ width: "100%", height: "100%", backgroundColor: "#ffffff", display: "flex", padding: "10%", alignItems: "flex-end", boxSizing: "border-box" }}>
    <span style={{ fontFamily: "'Courier New', Courier, monospace", fontSize: "5cqmin", fontWeight: "bold", color: "#000000", textTransform: "uppercase" }}>
      {text}
    </span>
  </div>
);

const Cross = () => (
  <div style={{ width: "100%", height: "100%", backgroundColor: "#ffffff", display: "flex", justifyContent: "center", alignItems: "center" }}>
    <div style={{ position: "relative", width: "25cqmin", height: "25cqmin" }}>
       <div style={{ position: "absolute", top: "50%", left: 0, width: "100%", height: "4px", backgroundColor: "#000000", transform: "translateY(-50%)" }} />
       <div style={{ position: "absolute", left: "50%", top: 0, height: "100%", width: "4px", backgroundColor: "#000000", transform: "translateX(-50%)" }} />
    </div>
  </div>
);

const Stripes = () => (
  <div style={{
    width: "100%", height: "100%",
    background: "repeating-linear-gradient(45deg, #000000 0, #000000 2px, #ffffff 2px, #ffffff 12px)"
  }} />
);

const CellText = ({ text, highlight }: { text: string, highlight?: boolean }) => (
  <div style={{ 
    width: "100%", height: "100%", 
    display: "flex", justifyContent: "center", alignItems: "center",
    backgroundColor: highlight ? "#000000" : "#ffffff",
    color: highlight ? "#ffffff" : "#000000",
  }}>
    <h2 style={{ 
       fontSize: "12cqmin", // Uses Container Queries to perfectly scale typography based on room size!
       fontWeight: 900, 
       margin: 0, 
       whiteSpace: "nowrap",
       fontFamily: "var(--font-geist-sans), sans-serif",
       letterSpacing: "-0.04em",
    }}>
      {text}
    </h2>
  </div>
);

const CtaCell = () => (
  <div style={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#ffffff", padding: "10%" }}>
     <button style={{
        background: "#000000", color: "#ffffff", border: "4px solid #000000",
        width: "100%", height: "100%", 
        fontSize: "8cqmin", fontWeight: 900,
        fontFamily: "'Courier New', Courier, monospace",
        cursor: "pointer", textTransform: "uppercase",
        transition: "all 0.3s ease"
     }}
     onMouseEnter={(e) => {
        e.currentTarget.style.background = "#ffffff";
        e.currentTarget.style.color = "#000000";
     }}
     onMouseLeave={(e) => {
        e.currentTarget.style.background = "#000000";
        e.currentTarget.style.color = "#ffffff";
     }}>
        EXECUTE
     </button>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Floorplan Layout Matrix
// ─────────────────────────────────────────────────────────────────────────────
const gridLayout = [
  // ROW 1
  { id: "0-0", content: <Cross /> },
  { id: "0-1", content: <Label text="01. REACTION" /> },
  { id: "0-2", content: <Stripes /> },
  { id: "0-3", content: <CellText text="LOVE IT?" /> },
  
  // ROW 2
  { id: "1-0", content: <Stripes /> },
  { id: "1-1", content: <Label text="SEC: ALPHA" /> },
  { id: "1-2", content: <Label text="02. FEELING" /> },
  { id: "1-3", content: <CellText text="INSPIRING?" highlight /> },
  
  // ROW 3
  { id: "2-0", content: <CellText text="LET'S GET" highlight /> },
  { id: "2-1", content: <Stripes /> },
  { id: "2-2", content: <Cross /> },
  { id: "2-3", content: <CellText text="CONSTRUCTED!" /> },
  
  // ROW 4
  { id: "3-0", content: <Label text="03. ACTION" /> },
  { id: "3-1", content: <Label text="ELEV: 400M" /> },
  { id: "3-2", content: <Stripes /> },
  { id: "3-3", content: <CtaCell /> },
];

export default function CallToActionSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  // Tracks which room the user is hovering to expand the floorplan
  const [activeCol, setActiveCol] = useState(-1);
  const [activeRow, setActiveRow] = useState(-1);

  // ─────────────────────────────────────────────────────────────────────────────
  // SCROLL BASED ANIMATION (The Construction Assembly)
  // ─────────────────────────────────────────────────────────────────────────────
  useGSAP(() => {
    // Start the rooms as dots
    gsap.set(".grid-cell", { scale: 0, borderRadius: "50%", opacity: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "+=150%", // Pin for interaction
        scrub: false, 
        pin: true,
        toggleActions: "play none none reverse" // Assemble on scroll down, deconstruct on scroll up
      }
    });

    // Snap the rooms into a rigid structural grid from the center outwards
    tl.to(".grid-cell", {
      scale: 1,
      opacity: 1,
      borderRadius: "0%", // Morphs from a dot into a rigid architectural block
      duration: 1.2,
      stagger: { amount: 1, grid: [4, 4], from: "center" }, 
      ease: "power4.out"
    });

  }, { scope: sectionRef });

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
  };

  return (
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
                }}
              >
                {cell.content}
              </div>
            )
          })}
        </div>

      </div>
    </section>
  );
}
