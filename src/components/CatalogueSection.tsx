"use client";

import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const CATALOGUE = [
  {
    id: "01",
    image: "/assets/images/1.jpeg",
    category: "Contemporary Architecture",
    headline: "Built to Impress.",
    subline: "Engineered to Last.",
    year: "2024",
  },
  {
    id: "02",
    image: "/assets/images/2.jpeg",
    category: "Interior Craftsmanship",
    headline: "Where Comfort",
    subline: "Meets Precision.",
    year: "2024",
  },
  {
    id: "03",
    image: "/assets/images/3.jpeg",
    category: "Panoramic Living",
    headline: "Spaces That",
    subline: "Connect With Nature.",
    year: "2023",
  },
  {
    id: "04",
    image: "/assets/images/4.jpeg",
    category: "Premium Finishes",
    headline: "Every Detail",
    subline: "Has a Purpose.",
    year: "2023",
  },
];

export default function CatalogueSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const followerInnerRef = useRef<HTMLDivElement>(null);
  const clipRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const rowsRef = useRef<(HTMLDivElement | null)[]>([]);
  const imagesRef = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const prevIndexRef = useRef<number | null>(null); // tracks last hovered tile
  const listRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const posRef = useRef({ x: 0, y: 0 });
  const curRef = useRef({ x: 0, y: 0 });

  /* ── Smooth cursor follower using RAF ── */
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMove);

    const loop = () => {
      const speed = 0.1;
      curRef.current.x += (posRef.current.x - curRef.current.x) * speed;
      curRef.current.y += (posRef.current.y - curRef.current.y) * speed;

      if (followerRef.current) {
        const rect = sectionRef.current?.getBoundingClientRect();
        if (rect) {
          gsap.set(followerRef.current, {
            x: curRef.current.x - rect.left - 170,
            y: curRef.current.y - rect.top - 220,
          });
        }
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  /* ── Entrance animations ── */
  useGSAP(() => {
    const title = titleRef.current;
    if (title) {
      const lines = title.querySelectorAll(".title-line");
      gsap.from(lines, {
        y: "110%",
        duration: 1.2,
        stagger: 0.1,
        ease: "power4.out",
        scrollTrigger: { trigger: title, start: "top 80%" },
      });
    }

    rowsRef.current.forEach((row, i) => {
      if (!row) return;
      gsap.from(row, {
        opacity: 0,
        y: 24,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: row,
          start: "top 88%",
          delay: i * 0.04,
        },
      });
    });

    const divs = sectionRef.current?.querySelectorAll(".hr-line");
    if (divs) {
      gsap.from(divs, {
        scaleX: 0,
        transformOrigin: "left",
        duration: 1,
        stagger: 0.07,
        ease: "expo.out",
        scrollTrigger: { trigger: listRef.current, start: "top 80%" },
      });
    }
  }, { scope: sectionRef });

  /* ── Hover handlers ── */

  // Called when entering any row
  const handleRowEnter = (i: number) => {
    const prev = prevIndexRef.current;
    setActiveIndex(i);
    prevIndexRef.current = i;

    if (prev === null) {
      // ── First entry into the list: circle burst ──
      if (followerRef.current) gsap.set(followerRef.current, { opacity: 1 });

      // Reveal this image from bottom simultaneously
      const img = imagesRef.current[i];
      if (img) {
        gsap.killTweensOf(img);
        gsap.fromTo(img,
          { clipPath: "inset(100% 0% 0% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 0.65, ease: "power3.out" }
        );
      }

      // Circle burst
      if (clipRef.current) {
        gsap.killTweensOf(clipRef.current);
        gsap.fromTo(clipRef.current,
          { clipPath: "circle(0% at 50% 50%)" },
          { clipPath: "circle(75% at 50% 50%)", duration: 0.65, ease: "power3.out" }
        );
      }

      // Shadow fades in slowly after 1 second
      if (shadowRef.current) {
        gsap.killTweensOf(shadowRef.current);
        gsap.to(shadowRef.current, { opacity: 1, duration: 1, delay: 1, ease: "power2.out" });
      }
    } else if (prev !== i) {
      // ── Switching between tiles: inset wipe ──
      const oldImg = imagesRef.current[prev];
      const newImg = imagesRef.current[i];

      // Old image wipes out upward
      if (oldImg) {
        gsap.killTweensOf(oldImg);
        gsap.to(oldImg, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.45, ease: "power3.inOut" });
      }
      // New image wipes in from bottom
      if (newImg) {
        gsap.killTweensOf(newImg);
        gsap.fromTo(newImg,
          { clipPath: "inset(100% 0% 0% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 0.45, ease: "power3.out" }
        );
      }
    }
  };

  // Called when cursor leaves the entire list container
  const handleListLeave = () => {
    setActiveIndex(null);

    // Kill shadow immediately
    if (shadowRef.current) {
      gsap.killTweensOf(shadowRef.current);
      gsap.set(shadowRef.current, { opacity: 0 });
    }

    // Circle collapse
    if (clipRef.current) {
      gsap.killTweensOf(clipRef.current);
      gsap.to(clipRef.current, {
        clipPath: "circle(0% at 50% 50%)",
        duration: 0.5,
        ease: "power3.in",
        onComplete: () => {
          // Reset all per-image clips so next entry is clean
          imagesRef.current.forEach(img => {
            if (img) gsap.set(img, { clipPath: "inset(100% 0% 0% 0%)" });
          });
          if (followerRef.current) gsap.set(followerRef.current, { opacity: 0 });
          prevIndexRef.current = null;
        },
      });
    }
  };

  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        background: "#f8f7f4",
        color: "#111",
        overflow: "hidden",
        paddingBottom: "10vh",
      }}
    >
      {/* ── Floating cursor follower ── */}
      {/* outer: unclipped, carries the rectangular box-shadow */}
      <div
        ref={followerRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "340px",
          height: "440px",
          pointerEvents: "none",
          zIndex: 50,
          opacity: 0, // starts invisible
          borderRadius: "16px",
        }}
      >
        {/* Shadow layer — delayed fade-in on hover */}
        <div
          ref={shadowRef}
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "16px",
            boxShadow: "0 40px 80px rgba(0,0,0,0.18)",
            opacity: 0,
            pointerEvents: "none",
          }}
        />
        {/* inner: clip-path lives here so shadow is unaffected */}
        <div
          ref={clipRef}
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "16px",
            overflow: "hidden",
            clipPath: "circle(0% at 50% 50%)",
          }}
        >
        <div ref={followerInnerRef} style={{ position: "relative", width: "100%", height: "100%", background: "#e0ddd7" }}>
          {CATALOGUE.map((item, i) => (
            <div
              key={item.id}
              ref={(el) => { imagesRef.current[i] = el; }}
              style={{
                position: "absolute",
                inset: 0,
                clipPath: "inset(100% 0% 0% 0%)", // hidden by default; GSAP reveals
                // Keep active or last-active on top so wipe transitions look correct
                zIndex: activeIndex === i ? 3 : prevIndexRef.current === i ? 2 : 1,
              }}
            >
              <Image
                src={item.image}
                alt={item.category}
                fill
                sizes="340px"
                style={{ objectFit: "cover" }}
                priority={i === 0}
              />
              {/* Index badge */}
              <div
                style={{
                  position: "absolute",
                  bottom: "1.25rem",
                  left: "1.25rem",
                  background: "rgba(255,255,255,0.85)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "100px",
                  padding: "0.35rem 0.9rem",
                  fontFamily: "var(--font-geist-sans), sans-serif",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "#111",
                }}
              >
                {item.category}
              </div>
            </div>
          ))}
        </div>
        </div>
      </div>

      {/* ── Header ── */}
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "14vh 5vw 3vh",
          display: "flex",
          alignItems: "flex-start",
          gap: "3rem",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        {/* Big title */}
        <div ref={titleRef} style={{ overflow: "hidden" }}>
          <div style={{ overflow: "hidden" }}>
            <p
              className="title-line"
              style={{
                fontFamily: "var(--font-geist-sans), sans-serif",
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.4em",
                textTransform: "uppercase",
                color: "rgba(0,0,0,0.4)",
                marginBottom: "1.25rem",
                display: "block",
              }}
            >
              Our Expertise
            </p>
          </div>
          <div style={{ overflow: "hidden" }}>
            <h2
              className="title-line"
              style={{
                fontFamily: "var(--font-geist-sans), sans-serif",
                fontWeight: 800,
                fontSize: "clamp(3.5rem, 7vw, 6rem)",
                lineHeight: 1.0,
                color: "#111",
                letterSpacing: "-0.04em",
                margin: 0,
              }}
            >
              Spaces that
            </h2>
          </div>
          <div style={{ overflow: "hidden" }}>
            <h2
              className="title-line"
              style={{
                fontFamily: "var(--font-geist-sans), sans-serif",
                fontWeight: 800,
                fontSize: "clamp(3.5rem, 7vw, 6rem)",
                lineHeight: 1.0,
                color: "#111",
                letterSpacing: "-0.04em",
                margin: 0,
              }}
            >
              <span style={{ color: "rgba(0,0,0,0.22)" }}>Speak.</span>
            </h2>
          </div>
        </div>

        {/* Count + note */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", alignSelf: "flex-end", paddingBottom: "0.5rem" }}>
          <span
            style={{
              fontFamily: "var(--font-geist-sans), sans-serif",
              fontSize: "4rem",
              fontWeight: 800,
              color: "rgba(0,0,0,0.07)",
              lineHeight: 1,
              letterSpacing: "-0.04em",
            }}
          >
            04
          </span>
          <span
            style={{
              fontFamily: "var(--font-geist-sans), sans-serif",
              fontSize: "0.7rem",
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(0,0,0,0.35)",
            }}
          >
            Key Offerings
          </span>
        </div>
      </div>

      {/* ── Catalogue Rows ── */}
      <div
        ref={listRef}
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 5vw",
          position: "relative",
        }}
        onMouseLeave={handleListLeave}
      >
        <div className="hr-line" style={{ height: "1px", background: "rgba(0,0,0,0.1)" }} />

        {CATALOGUE.map((item, i) => (
          <div
            key={item.id}
            ref={(el) => { rowsRef.current[i] = el; }}
            onMouseEnter={() => handleRowEnter(i)}
            style={{
              position: "relative",
              paddingTop: "clamp(2rem, 4vh, 3.5rem)",
              paddingBottom: "clamp(2rem, 4vh, 3.5rem)",
              cursor: "none",
              userSelect: "none",
            }}
          >
            {/* Hover tint bg */}
            <div
              style={{
                position: "absolute",
                inset: "0 -5vw",
                background: activeIndex === i ? "rgba(0,0,0,0.025)" : "transparent",
                transition: "background 0.5s ease",
                pointerEvents: "none",
              }}
            />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "56px 1fr max-content",
                gap: "clamp(1rem, 3vw, 3rem)",
                alignItems: "center",
                position: "relative",
              }}
            >
              {/* ID */}
              <span
                style={{
                  fontFamily: "var(--font-geist-sans), sans-serif",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  color: activeIndex === i ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0.25)",
                  transition: "color 0.4s ease",
                  alignSelf: "flex-start",
                  paddingTop: "0.6rem",
                }}
              >
                {item.id}
              </span>

              {/* Headline */}
              <div>
                <div
                  style={{
                    overflow: "hidden",
                    display: "block",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-geist-sans), sans-serif",
                      fontWeight: 800,
                      fontSize: "clamp(2rem, 5.5vw, 5rem)",
                      lineHeight: 1.05,
                      letterSpacing: "-0.035em",
                      color: "#111",
                      display: "block",
                      transform: activeIndex === i ? "translateX(1.2rem)" : "translateX(0)",
                      transition: "transform 0.5s cubic-bezier(0.16,1,0.3,1)",
                    }}
                  >
                    {item.headline}
                  </span>
                </div>
                <div style={{ overflow: "hidden", display: "block" }}>
                  <span
                    style={{
                      fontFamily: "var(--font-geist-sans), sans-serif",
                      fontWeight: 800,
                      fontSize: "clamp(2rem, 5.5vw, 5rem)",
                      lineHeight: 1.05,
                      letterSpacing: "-0.035em",
                      color: activeIndex === i ? "#111" : "rgba(0,0,0,0.2)",
                      display: "block",
                      transform: activeIndex === i ? "translateX(2rem)" : "translateX(0)",
                      transition: "color 0.5s ease, transform 0.55s cubic-bezier(0.16,1,0.3,1)",
                    }}
                  >
                    {item.subline}
                  </span>
                </div>
                <span
                  style={{
                    fontFamily: "var(--font-geist-sans), sans-serif",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "rgba(0,0,0,0.35)",
                    display: "block",
                    marginTop: "0.6rem",
                    transform: activeIndex === i ? "translateX(1rem)" : "translateX(0)",
                    transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1)",
                  }}
                >
                  {item.category} / {item.year}
                </span>
              </div>

              {/* Right: arrow */}
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "50%",
                  border: "1.5px solid rgba(0,0,0,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  background: activeIndex === i ? "#111" : "transparent",
                  transition: "background 0.4s ease, transform 0.4s ease",
                  transform: activeIndex === i ? "rotate(-45deg)" : "rotate(0deg)",
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  style={{
                    stroke: activeIndex === i ? "#fff" : "#111",
                    transition: "stroke 0.4s ease",
                  }}
                >
                  <path
                    d="M3 8h10M9 4l4 4-4 4"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            {/* Divider */}
            <div
              className="hr-line"
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "1px",
                background: "rgba(0,0,0,0.1)",
              }}
            />
          </div>
        ))}
      </div>

      {/* ── Footer ── */}
      <div
        style={{
          maxWidth: "1280px",
          margin: "6vh auto 0",
          padding: "0 5vw",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1.5rem",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-geist-sans), sans-serif",
            fontSize: "0.65rem",
            fontWeight: 700,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "rgba(0,0,0,0.28)",
          }}
        >
          DefinitelySafe™ — Built with Confidence
        </span>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.75rem",
            fontFamily: "var(--font-geist-sans), sans-serif",
            fontSize: "0.75rem",
            fontWeight: 700,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "#111",
            cursor: "pointer",
            paddingBottom: "2px",
            borderBottom: "1px solid rgba(0,0,0,0.2)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#111")}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(0,0,0,0.2)")}
        >
          <span>View All Offerings</span>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="#111">
            <path d="M3 8h10M9 4l4 4-4 4" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </section>
  );
}
