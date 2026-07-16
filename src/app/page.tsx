"use client";

import { useState, useCallback, useEffect } from "react";
import HeroSection from "@/components/HeroSection";
import SplashScreen from "@/components/SplashScreen";
import AboutSection from "@/components/AboutSection";

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
    <main className="min-h-screen">
      {!splashDone && <SplashScreen onComplete={handleSplashComplete} />}
      <div
        className={`transition-opacity duration-1000 ease-in ${
          heroReady ? "opacity-100" : "opacity-0"
        }`}
        style={{ position: "relative", zIndex: splashDone ? 0 : -5 }}
      >
        <HeroSection showIndicator={showScroll} />
      </div>
      <div className="w-full relative" style={{ marginTop: "-100vh", zIndex: 10 }}>
        <AboutSection />
      </div>
    </main>
  );
}
