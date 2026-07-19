"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import HeroSection from "@/components/HeroSection";
import SplashScreen from "@/components/SplashScreen";
import AboutSection from "@/components/AboutSection";
import Scroll2Section from "@/components/Scroll2Section";
import CatalogueSection from "@/components/CatalogueSection";

import CallToActionSection from "@/components/CallToActionSection";
import FooterSection from "@/components/FooterSection";
import GlobalCursor from "@/components/GlobalCursor";

function LazyMount({ children }: { children: React.ReactNode }) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { rootMargin: "200% 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <div ref={sentinelRef} />
      {visible && children}
    </>
  );
}

export default function Home() {
  const [splashDone, setSplashDone] = useState(false);
  const [heroReady, setHeroReady] = useState(false);
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHeroReady(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setShowScroll(true), 9500);
    return () => clearTimeout(timer);
  }, []);

  const handleSplashComplete = useCallback(() => {
    setSplashDone(true);
  }, []);

  return (
    <main className="min-h-screen" style={{ cursor: "none" }}>
      <GlobalCursor />
      {!splashDone && <SplashScreen onComplete={handleSplashComplete} />}
      <div
        className={`transition-opacity duration-1000 ease-in ${
          heroReady ? "opacity-100" : "opacity-0"
        }`}
        style={{ position: "relative", zIndex: splashDone ? 0 : -5 }}
      >
        <HeroSection showIndicator={showScroll} />
      </div>
      <div className="w-full relative" style={{ marginTop: "-100vh", zIndex: 20 }}>
        <AboutSection />
      </div>
      <div className="w-full relative" style={{ zIndex: 15 }}>
        <Scroll2Section />
      </div>
      <div className="w-full relative" style={{ zIndex: 25 }}>
        <LazyMount>
          <CatalogueSection />
        </LazyMount>
      </div>
      <div className="w-full relative" style={{ zIndex: 30 }}>
        <LazyMount>
          <CallToActionSection />
        </LazyMount>
      </div>
      <div className="w-full relative" style={{ zIndex: 35 }}>
        <LazyMount>
          <FooterSection />
        </LazyMount>
      </div>
    </main>
  );
}
