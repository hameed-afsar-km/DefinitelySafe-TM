"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Image from "next/image";

const CATALOGUE = [
  {
    id: "01",
    image: "/1.jpeg",
    category: "Contemporary Architecture",
    headline: "Built to Impress. Engineered to Last.",
    body: "Every project is designed with clean lines, durable materials, and thoughtful engineering—creating spaces that are as functional as they are visually striking.",
  },
  {
    id: "02",
    image: "/2.jpeg",
    category: "Interior Craftsmanship",
    headline: "Where Comfort Meets Precision.",
    body: "From open living spaces to premium finishes, every interior is crafted with meticulous attention to detail, ensuring beauty, comfort, and everyday practicality.",
  },
  {
    id: "03",
    image: "/3.jpeg",
    category: "Panoramic Living",
    headline: "Spaces That Connect With Nature.",
    body: "Expansive glass, natural light, and seamless indoor–outdoor transitions create environments that celebrate their surroundings while maximizing comfort.",
  },
  {
    id: "04",
    image: "/4.jpeg",
    category: "Premium Finishes",
    headline: "Every Detail Has a Purpose.",
    body: "Luxury isn't just about appearance—it's about quality. From handcrafted materials to flawless execution, every finish reflects our commitment to excellence.",
  },
];

export default function CatalogueSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-index"));
            setActiveIndex(index);
          }
        });
      },
      // Trigger when the text block is around the middle of the viewport
      { rootMargin: "-40% 0px -40% 0px", threshold: 0 }
    );

    const blocks = document.querySelectorAll(".project-text-block");
    blocks.forEach((b) => observer.observe(b));
    return () => observer.disconnect();
  }, [isMobile]);

  return (
    <section
      style={{
        position: "relative",
        background: "#faf9f6",
        width: "100%",
        overflow: "hidden",
      }}
    >
      {/* Seamless transition band from the white section above */}
      <div
        style={{
          width: "100%",
          height: "120px",
          background: "#ffffff",
          clipPath: "polygon(0 0, 100% 0, 100% 20%, 0 100%)",
          marginBottom: "-1px",
        }}
      />

      <div
        ref={containerRef}
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          position: "relative",
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          padding: isMobile ? "2rem 1.5rem" : "0",
        }}
      >
        {/* ── Left Side: Scrolling Content ── */}
        <div
          style={{
            width: isMobile ? "100%" : "50%",
            paddingLeft: isMobile ? "0" : "5vw",
            paddingRight: isMobile ? "0" : "4vw",
            paddingTop: isMobile ? "0" : "15vh",
            paddingBottom: isMobile ? "4rem" : "30vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Intro Header Block */}
          <div
            style={{
              minHeight: isMobile ? "auto" : "50vh",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              marginBottom: isMobile ? "4rem" : "25vh",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-geist-sans), sans-serif",
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.35em",
                textTransform: "uppercase",
                color: "rgba(0,0,0,0.45)",
                marginBottom: "1.5rem",
              }}
            >
              Our Work
            </p>

            <h2
              style={{
                fontFamily: "var(--font-geist-sans), sans-serif",
                fontWeight: 800,
                fontSize: "clamp(3rem, 6vw, 4.5rem)",
                lineHeight: 1.05,
                color: "#111111",
                marginBottom: "1.5rem",
                letterSpacing: "-0.03em",
              }}
            >
              Crafted with Intention.
            </h2>

            <p
              style={{
                fontFamily: "var(--font-geist-sans), sans-serif",
                fontSize: "clamp(1rem, 1.4vw, 1.15rem)",
                color: "rgba(0,0,0,0.6)",
                maxWidth: "460px",
                lineHeight: 1.65,
                marginBottom: "2.5rem",
              }}
            >
              A curated selection of spaces where design, engineering, and purpose converge. Explore our portfolio below.
            </p>
            
            <div style={{ width: "64px", height: "1px", background: "rgba(0,0,0,0.15)" }} />
          </div>

          {/* Project Text Blocks */}
          {CATALOGUE.map((item, i) => (
            <div
              key={item.id}
              className="project-text-block"
              data-index={i}
              style={{
                minHeight: isMobile ? "auto" : "100vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                marginBottom: isMobile ? "5rem" : "0",
                opacity: isMobile ? 1 : (activeIndex === i ? 1 : 0.25),
                transform: isMobile ? "none" : (activeIndex === i ? "translateY(0)" : "translateY(10px)"),
                transition: "opacity 0.6s ease, transform 0.6s ease",
              }}
            >
              {/* On mobile, show the image inline above the text */}
              {isMobile && (
                <div style={{ position: "relative", width: "100%", paddingTop: "80%", marginBottom: "2rem", borderRadius: "8px", overflow: "hidden" }}>
                   <Image src={item.image} alt={item.category} fill style={{ objectFit: "cover" }} />
                </div>
              )}

              <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
                <span
                  style={{
                    fontFamily: "var(--font-geist-sans), sans-serif",
                    fontWeight: 700,
                    fontSize: "1.25rem",
                    color: "#111111",
                    letterSpacing: "0.05em",
                  }}
                >
                  {item.id}
                </span>
                <div style={{ width: "24px", height: "1px", background: "rgba(0,0,0,0.2)" }} />
                <span
                  style={{
                    fontFamily: "var(--font-geist-sans), sans-serif",
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "rgba(0,0,0,0.5)",
                  }}
                >
                  {item.category}
                </span>
              </div>

              <h3
                style={{
                  fontFamily: "var(--font-geist-sans), sans-serif",
                  fontWeight: 700,
                  fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
                  lineHeight: 1.15,
                  color: "#111111",
                  marginBottom: "1.25rem",
                  letterSpacing: "-0.02em",
                  maxWidth: "500px",
                }}
              >
                {item.headline}
              </h3>

              <p
                style={{
                  fontFamily: "var(--font-geist-sans), sans-serif",
                  fontSize: "clamp(0.95rem, 1.1vw, 1.1rem)",
                  color: "rgba(0,0,0,0.6)",
                  lineHeight: 1.7,
                  marginBottom: "2.5rem",
                  maxWidth: "480px",
                }}
              >
                {item.body}
              </p>

              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.6rem",
                  fontFamily: "var(--font-geist-sans), sans-serif",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "#111111",
                  cursor: "pointer",
                }}
              >
                <span>Explore Project</span>
                <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          ))}
        </div>

        {/* ── Right Side: Sticky Image Showcase (Desktop Only) ── */}
        {!isMobile && (
          <div
            style={{
              width: "50%",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "sticky",
                top: 0,
                height: "100vh",
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "10vh 4vw",
                boxSizing: "border-box",
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: "100%",
                  maxHeight: "800px",
                  borderRadius: "16px",
                  overflow: "hidden",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.06)",
                }}
              >
                {CATALOGUE.map((item, i) => {
                  const isActive = activeIndex === i;
                  return (
                    <div
                      key={item.id}
                      style={{
                        position: "absolute",
                        inset: 0,
                        opacity: isActive ? 1 : 0,
                        transform: isActive ? "scale(1)" : "scale(1.05)",
                        transition: "opacity 1s cubic-bezier(0.16, 1, 0.3, 1), transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)",
                        zIndex: isActive ? 10 : 0,
                        willChange: "opacity, transform",
                      }}
                    >
                      <Image
                        src={item.image}
                        alt={item.category}
                        fill
                        sizes="50vw"
                        style={{ objectFit: "cover" }}
                        priority={i === 0}
                      />
                      {/* Subtle dark gradient overlay for depth */}
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          background: "linear-gradient(to top, rgba(0,0,0,0.1) 0%, transparent 40%)",
                          pointerEvents: "none",
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer strip */}
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "2rem 5vw 4rem",
          display: "flex",
          alignItems: "center",
          gap: "2rem",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-geist-sans), sans-serif",
            fontSize: "0.65rem",
            fontWeight: 700,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "rgba(0,0,0,0.3)",
            whiteSpace: "nowrap",
          }}
        >
          DefinitelySafe™ — Built with Confidence
        </span>
        <div style={{ flex: 1, height: "1px", background: "rgba(0,0,0,0.08)" }} />
      </div>
    </section>
  );
}
