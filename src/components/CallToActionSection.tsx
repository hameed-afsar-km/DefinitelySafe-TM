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
  const boxRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    
    // Initial 3D angle of the box
    gsap.set(boxRef.current, { rotationX: -10, rotationY: -25 });

    // Ensure the CTA button is hidden initially
    gsap.set(".cta-button", { opacity: 0, scale: 0.5 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "+=500%", // Long scroll to fully enjoy the rotations
        scrub: 1,
        pin: true,
        anticipatePin: 1,
      }
    });

    // Hold at start so user can read "Love It?"
    tl.to({}, { duration: 0.5 });

    // --- ROTATION 1: Spin to "Inspiring?" (Right Face) ---
    tl.to(boxRef.current, {
      rotationX: 0,
      rotationY: -90,
      duration: 2,
      ease: "power2.inOut"
    });

    // Hold on "Inspiring?"
    tl.to({}, { duration: 0.6 });

    // --- ROTATION 2: Spin to "Let's Get Constructed!" (Back Face) ---
    tl.to(boxRef.current, {
      rotationX: 8, // slight upward tilt for dramatic effect
      rotationY: -180,
      duration: 2,
      ease: "power2.inOut"
    });

    // Hold on "Let's Get Constructed!" before explosion
    tl.to({}, { duration: 0.6 });

    // --- EXPLOSION: The Monolith shatters open! ---
    
    // Front and Back fly out along Z
    tl.to(".face-front", { transform: "translate(-50%, -50%) rotateY(0deg) translateZ(120vw)", opacity: 0, duration: 1.5, ease: "power3.in" }, "explode");
    tl.to(".face-back", { transform: "translate(-50%, -50%) rotateY(180deg) translateZ(120vw)", opacity: 0, duration: 1.5, ease: "power3.in" }, "explode");
    
    // Left and Right fly out along X
    tl.to(".face-right", { transform: "translate(-50%, -50%) rotateY(90deg) translateZ(120vw)", opacity: 0, duration: 1.5, ease: "power3.in" }, "explode");
    tl.to(".face-left", { transform: "translate(-50%, -50%) rotateY(-90deg) translateZ(120vw)", opacity: 0, duration: 1.5, ease: "power3.in" }, "explode");
    
    // Top and Bottom fly out along Y
    tl.to(".face-top", { transform: "translate(-50%, -50%) rotateX(90deg) translateZ(120vh)", opacity: 0, duration: 1.5, ease: "power3.in" }, "explode");
    tl.to(".face-bottom", { transform: "translate(-50%, -50%) rotateX(-90deg) translateZ(120vh)", opacity: 0, duration: 1.5, ease: "power3.in" }, "explode");

    // The CTA button (trapped inside) blooms into view!
    tl.to(".cta-button", {
      opacity: 1,
      scale: 1,
      duration: 1.5,
      ease: "back.out(1.5)"
    }, "explode+=0.4");

    // Hold finale
    tl.to({}, { duration: 1 });

  }, { scope: sectionRef });

  // Geometry variables
  const W = "60vw";
  const H = "70vh";
  const halfW = "30vw";
  const halfH = "35vh";

  // Common styles for all 6 faces of the 3D box
  const faceStyle: React.CSSProperties = {
    position: "absolute",
    top: "50%",
    left: "50%",
    backgroundColor: "rgba(10, 10, 12, 0.6)", // Dark translucent glass
    backdropFilter: "blur(16px)",             // Frosted glass effect
    WebkitBackdropFilter: "blur(16px)",
    border: "1px solid rgba(255,255,255,0.1)",
    boxShadow: "inset 0 0 100px rgba(0,0,0,0.9)", // Deep inner shadow
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backfaceVisibility: "visible", // Allows you to see the back of the glass through the box!
  };

  const headingStyle: React.CSSProperties = {
    fontFamily: "var(--font-geist-sans), sans-serif",
    fontWeight: 800,
    letterSpacing: "-0.04em",
    lineHeight: 0.9,
    margin: 0,
    color: "#ffffff",
    textAlign: "center",
  };

  const eyebrowStyle: React.CSSProperties = {
    fontFamily: "var(--font-geist-sans), sans-serif",
    fontSize: "0.7rem",
    fontWeight: 700,
    letterSpacing: "0.4em",
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.4)",
    marginBottom: "1.5rem",
  };

  return (
    <section
      ref={sectionRef}
      style={{
        height: "100vh",
        position: "relative",
        zIndex: 40,
        backgroundColor: "#030303",
        overflow: "hidden",
      }}
    >
      
      {/* ── 3D VIEWPORT ── */}
      <div 
        style={{
          position: "absolute",
          inset: 0,
          perspective: "2000px", // Deep perspective to make the box look massive
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        
        {/* ── THE MONOLITH (3D BOX CONTAINER) ── */}
        <div 
          ref={boxRef}
          style={{
            position: "relative",
            width: 0, 
            height: 0, 
            transformStyle: "preserve-3d",
          }}
        >
          
          {/* ── THE PRIZE: CTA Button hidden inside the box ── */}
          {/* It rotates 180deg so it perfectly faces the camera when the box shows the Back Face */}
          <div className="cta-button" style={{ 
            position: "absolute", 
            top: "50%", left: "50%", 
            transform: "translate(-50%, -50%) rotateY(180deg)", 
            zIndex: 100 
          }}>
            <button
              style={{
                fontFamily: "var(--font-geist-sans), sans-serif",
                fontWeight: 700,
                fontSize: "1rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#000000",
                backgroundColor: "#ffffff",
                border: "none",
                padding: "1.5rem 4.5rem",
                borderRadius: "100px",
                cursor: "pointer",
                boxShadow: "0 0 60px rgba(255,255,255,0.4)", // Glowing aura
                transition: "transform 0.3s ease, background 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#e0e0e0";
                e.currentTarget.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#ffffff";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              Start Your Project
            </button>
          </div>


          {/* ── FACE 1: FRONT (Love It?) ── */}
          <div className="face-front" style={{ ...faceStyle, width: W, height: H, transform: `translate(-50%, -50%) rotateY(0deg) translateZ(${halfW})` }}>
            <p style={eyebrowStyle}>01 — The Reaction</p>
            <h2 style={{ ...headingStyle, fontSize: "clamp(6rem, 12vw, 10rem)" }}>Love It?</h2>
          </div>

          {/* ── FACE 2: RIGHT (Inspiring?) ── */}
          <div className="face-right" style={{ ...faceStyle, width: W, height: H, transform: `translate(-50%, -50%) rotateY(90deg) translateZ(${halfW})` }}>
            <p style={eyebrowStyle}>02 — The Feeling</p>
            <h2 style={{ ...headingStyle, fontSize: "clamp(5rem, 10vw, 8rem)" }}>Inspiring?</h2>
          </div>

          {/* ── FACE 3: BACK (Let's Get Constructed!) ── */}
          <div className="face-back" style={{ ...faceStyle, width: W, height: H, transform: `translate(-50%, -50%) rotateY(180deg) translateZ(${halfW})` }}>
            <p style={eyebrowStyle}>03 — Your Next Move</p>
            <h2 style={{ ...headingStyle, fontSize: "clamp(4rem, 8vw, 7rem)" }}>Let's Get<br/>Constructed!</h2>
          </div>

          {/* ── FACE 4: LEFT (Blank glass) ── */}
          <div className="face-left" style={{ ...faceStyle, width: W, height: H, transform: `translate(-50%, -50%) rotateY(-90deg) translateZ(${halfW})` }} />

          {/* ── FACE 5: TOP (Blank glass) ── */}
          <div className="face-top" style={{ ...faceStyle, width: W, height: W, transform: `translate(-50%, -50%) rotateX(90deg) translateZ(${halfH})` }} />

          {/* ── FACE 6: BOTTOM (Blank glass) ── */}
          <div className="face-bottom" style={{ ...faceStyle, width: W, height: W, transform: `translate(-50%, -50%) rotateX(-90deg) translateZ(${halfH})` }} />

        </div>
      </div>

    </section>
  );
}
