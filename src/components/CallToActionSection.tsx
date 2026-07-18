"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function CallToActionSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    
    // Initial states
    gsap.set(".vault-interior-content", { opacity: 0, scale: 0.8 });
    gsap.set(".door-hinge", { rotateY: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "+=500%", // Long scroll to enjoy the mechanical sequence
        scrub: 1.2,
        pin: true,
        anticipatePin: 1,
      }
    });

    // Hold at start
    tl.to({}, { duration: 0.5 });

    /* ── PHASE 1: SPIN THE COMBINATION RINGS ── */
    tl.to(".outer-ring", { 
      rotation: 210, 
      transformOrigin: "50% 50%", 
      duration: 2, 
      ease: "power2.inOut" 
    }, "spin");
    
    tl.to(".inner-ring", { 
      rotation: -360, 
      transformOrigin: "50% 50%", 
      duration: 2, 
      ease: "power2.inOut" 
    }, "spin");

    // Hold
    tl.to({}, { duration: 0.2 });

    /* ── PHASE 2: UNLOCK (RETRACT BARS) ── */
    tl.to(".top-bar", { y: "8vmin", duration: 0.6, ease: "power3.in" }, "retract");
    tl.to(".bottom-bar", { y: "-8vmin", duration: 0.6, ease: "power3.in" }, "retract");
    tl.to(".left-bar", { x: "8vmin", duration: 0.6, ease: "power3.in" }, "retract");
    tl.to(".right-bar", { x: "-8vmin", duration: 0.6, ease: "power3.in" }, "retract");

    // The heavy mechanical 'Clunk' (micro screen shake)
    tl.to(sectionRef.current, { y: 6, duration: 0.05, yoyo: true, repeat: 3 }, "retract+=0.6");

    // Hold
    tl.to({}, { duration: 0.2 });

    /* ── PHASE 3: SWING OPEN THE VAULT DOOR ── */
    // Swings inward to the left
    tl.to(".door-hinge", { 
      rotateY: -115, 
      duration: 2.5, 
      ease: "power2.inOut" 
    }, "swing");

    // Reveal the bright glowing interior and CTA
    tl.to(".vault-interior", {
      boxShadow: "inset 0 0 50px rgba(0,0,0,0.1), 0 0 150px rgba(255, 255, 255, 0.4)",
      duration: 2
    }, "swing");

    tl.to(".vault-interior-content", { 
      opacity: 1, 
      scale: 1, 
      duration: 1.5, 
      ease: "power3.out" 
    }, "swing+=1");

    // Hold finale
    tl.to({}, { duration: 1.5 });

  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      style={{
        height: "100vh",
        position: "relative",
        zIndex: 40,
        backgroundColor: "#0d0d0d", // Deep industrial grey
        perspective: "1800px",      // Deep 3D perspective for the door swing
        overflow: "hidden",
      }}
    >
      
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* THE VAULT INTERIOR (The glowing chamber inside)         */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div 
        className="vault-interior"
        style={{
          position: "absolute",
          top: "10vh",
          left: "50%",
          transform: "translateX(-50%)",
          width: "80vh",
          height: "80vh",
          borderRadius: "50%",
          backgroundColor: "#faf9f6", // Matches catalogue background
          boxShadow: "inset 0 0 100px rgba(0,0,0,0.6)", // Starts dark, lights up in GSAP
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1,
        }}
      >
        <div className="vault-interior-content" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <p style={{
            fontFamily: "var(--font-geist-sans), sans-serif",
            fontSize: "0.7rem",
            fontWeight: 700,
            letterSpacing: "0.4em",
            textTransform: "uppercase",
            color: "rgba(10,10,10,0.4)",
            marginBottom: "1.5rem",
          }}>
            03 — Your Next Move
          </p>
          <h2 style={{
            fontFamily: "var(--font-geist-sans), sans-serif",
            fontWeight: 900,
            fontSize: "clamp(3rem, 6vh, 5rem)",
            letterSpacing: "-0.04em",
            lineHeight: 0.95,
            color: "#0a0a0a",
            textAlign: "center",
            marginBottom: "2.5rem",
          }}>
            Let's Get<br/>Constructed!
          </h2>
          
          <button
            style={{
              fontFamily: "var(--font-geist-sans), sans-serif",
              fontWeight: 700,
              fontSize: "0.85rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#faf9f6",
              backgroundColor: "#0a0a0a",
              border: "none",
              padding: "1.2rem 3.5rem",
              borderRadius: "100px",
              cursor: "pointer",
              transition: "transform 0.3s ease, background 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#333";
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#0a0a0a";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            Start Your Project →
          </button>
        </div>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* THE STEEL WALL (Covers everything EXCEPT the vault hole) */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div 
        style={{
          position: "absolute",
          inset: "-50%", // Oversize to ensure it covers the screen
          backgroundColor: "#161616",
          // Punches a perfect hole in the center to reveal the vault interior
          maskImage: "radial-gradient(circle at center, transparent 40vh, black 40.2vh)",
          WebkitMaskImage: "radial-gradient(circle at center, transparent 40vh, black 40.2vh)",
          zIndex: 2,
          pointerEvents: "none",
          backgroundImage: "radial-gradient(rgba(255,255,255,0.02) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />


      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* THE VAULT DOOR (Swings open in 3D)                      */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div 
        className="door-hinge"
        style={{
          position: "absolute",
          top: "10vh",
          left: "calc(50% - 40vh)", // Positions the left edge (hinge) exactly at the left edge of the hole
          width: "80vh",
          height: "80vh",
          transformOrigin: "left center",
          transformStyle: "preserve-3d",
          zIndex: 5,
        }}
      >
        
        {/* The Locking Bars (Slide out from the door) */}
        {/* Placed behind the door body (z-index -1) so they hide when retracting */}
        <div className="bar top-bar" style={{ position: "absolute", top: "-5%", left: "45%", width: "10%", height: "15%", backgroundColor: "#333", border: "2px solid #111", zIndex: -1 }} />
        <div className="bar bottom-bar" style={{ position: "absolute", bottom: "-5%", left: "45%", width: "10%", height: "15%", backgroundColor: "#333", border: "2px solid #111", zIndex: -1 }} />
        <div className="bar left-bar" style={{ position: "absolute", left: "-5%", top: "45%", width: "15%", height: "10%", backgroundColor: "#333", border: "2px solid #111", zIndex: -1 }} />
        <div className="bar right-bar" style={{ position: "absolute", right: "-5%", top: "45%", width: "15%", height: "10%", backgroundColor: "#333", border: "2px solid #111", zIndex: -1 }} />


        {/* The Main Door Body */}
        <div 
          className="door-body"
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background: "radial-gradient(circle at center, #2a2a2a 0%, #151515 100%)",
            border: "8px solid #333",
            boxShadow: "0 20px 50px rgba(0,0,0,0.8), inset 0 0 30px rgba(255,255,255,0.05)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Central Steel Hub */}
          <div style={{
            position: "absolute",
            width: "25%",
            height: "25%",
            borderRadius: "50%",
            backgroundColor: "#222",
            border: "6px solid #111",
            boxShadow: "0 10px 20px rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <div style={{ width: "30%", height: "30%", borderRadius: "50%", backgroundColor: "#444" }} />
          </div>

          {/* ── THE TYPOGRAPHY RINGS (SVG) ── */}
          <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}>
            <defs>
              {/* Outer Ring Path (Radius 40) */}
              <path id="outer-ring" d="M 50, 50 m -38, 0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" />
              {/* Inner Ring Path (Radius 25) */}
              <path id="inner-ring" d="M 50, 50 m -25, 0 a 25,25 0 1,1 50,0 a 25,25 0 1,1 -50,0" />
            </defs>
            
            {/* Outer Text: LOVE IT? */}
            <g className="outer-ring">
              <text fontSize="4.5" fill="rgba(255,255,255,0.8)" fontWeight="bold" letterSpacing="0.2em" style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}>
                <textPath href="#outer-ring" startOffset="0%">
                  LOVE IT? • LOVE IT? • LOVE IT? • LOVE IT? • LOVE IT? • LOVE IT? • 
                </textPath>
              </text>
            </g>
            
            {/* Inner Text: INSPIRING? */}
            <g className="inner-ring">
              <text fontSize="3.5" fill="rgba(255,255,255,0.4)" fontWeight="bold" letterSpacing="0.3em" style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}>
                <textPath href="#inner-ring" startOffset="0%">
                  INSPIRING? • INSPIRING? • INSPIRING? • INSPIRING? • 
                </textPath>
              </text>
            </g>
          </svg>

        </div>
      </div>

    </section>
  );
}
