"use client";

import { useState, useCallback } from "react";
import HeroSection from "@/components/HeroSection";
import SplashScreen from "@/components/SplashScreen";

export default function Home() {
  const [splashDone, setSplashDone] = useState(false);

  const handleSplashComplete = useCallback(() => {
    setSplashDone(true);
  }, []);

  return (
    <main className="min-h-screen">
      {!splashDone && <SplashScreen onComplete={handleSplashComplete} />}
      <HeroSection />
    </main>
  );
}
