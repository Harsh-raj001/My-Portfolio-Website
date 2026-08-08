"use client";

import { useEffect, useState } from "react";
import { EXPLORER_NAME, CHAPTERS } from "../../data/missionData";
import { useMissionStore } from "../../store/missionStore";

export default function TelemetryHeader() {
  const progress = useMissionStore(state => state.progress);
  const [activeChapter, setActiveChapter] = useState(CHAPTERS[0]);
  const [fps, setFps] = useState(60);

  useEffect(() => {
    const chapter = CHAPTERS.find(
      (c) => progress >= c.startScroll && progress <= c.endScroll
    ) || CHAPTERS[CHAPTERS.length - 1];
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActiveChapter(chapter);
  }, [progress]);

  // Simulate subtle telemetry FPS monitor
  useEffect(() => {
    const interval = setInterval(() => {
      setFps(Math.floor(58 + Math.random() * 3));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const distanceAU = (progress * 500).toFixed(1);
  const scrollPercent = Math.round(progress * 100);

  return (
    <header 
      aria-label="Aerospace Telemetry Header"
      className="absolute bottom-28 left-4 right-4 z-40 pointer-events-none select-none font-mono text-xs tracking-widest text-slate-300 w-auto md:fixed md:top-6 md:left-6 md:bottom-auto md:w-auto"
      style={{ 
        transform: "translate3d(0, 0, 0)", 
        willChange: "transform",
        paddingTop: "env(safe-area-inset-top, 0px)",
        paddingLeft: "env(safe-area-inset-left, 0px)",
      }}
    >
      {/* Top Left: Aerospace Telemetry Breadcrumb Tracker */}
      <div className="flex items-center gap-2 sm:gap-3 bg-slate-950/85 backdrop-blur-md px-2.5 py-1 sm:px-4 sm:py-2 rounded-full border border-cyan-500/30 shadow-[0_0_20px_rgba(0,240,255,0.15)] pointer-events-none">
        {/* Explorer Beacon */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
          <span className="text-white font-bold tracking-tighter uppercase text-xs sm:text-xs hidden md:inline">{EXPLORER_NAME}</span>
        </div>

        <span className="text-white/20 hidden md:inline">|</span>

        {/* Active Chapter Breadcrumb */}
        <div className="text-amber-400 font-semibold tracking-wider text-xs sm:text-xs">
          [{activeChapter.title}]
        </div>

        <span className="text-white/20">|</span>

        {/* Real-Time Telemetry Stats */}
        <div className="flex items-center gap-2 sm:gap-3 text-slate-400 text-xs sm:text-[11px]">
          <span>SCROLL: <strong className="text-cyan-300">{scrollPercent}%</strong></span>
          <span className="hidden md:inline">•</span>
          <span className="hidden md:inline">DIST: <strong className="text-cyan-400">{distanceAU} AU</strong></span>
          <span className="hidden md:inline">•</span>
          <span className="hidden md:inline">DRAW CALLS: <strong className="text-emerald-400">12</strong></span>
          <span className="hidden md:inline">•</span>
          <span className="hidden md:inline">FPS: <strong className="text-emerald-400">{fps}</strong></span>
        </div>
      </div>
    </header>
  );
}
