"use client";

import { Scroll } from "@react-three/drei";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { isMobile } from "../lib/qualityTier";
import { EXPLORER_NAME, MISSION_OBJECTIVE } from "../data/missionData";

// Section positions content at `offset * 100vh` inside the Drei ScrollControls HTML layer.
// Animation fires immediately on mount (not IntersectionObserver) so appearance is
// frame-aligned with the ScrollControls timeline, not async DOM observation.
interface SectionProps {
  children: React.ReactNode;
  offset: number;
  position?: "left" | "right" | "center";
}

const Section = ({ 
  children, 
  offset, 
  position = "left" 
}: SectionProps) => {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    setMobile(isMobile);
  }, []);

  // Outer container is a full-height viewport block placed at offset * 100vh
  const outerStyle: React.CSSProperties = {
    position: "absolute",
    top: `${offset * 100}vh`,
    width: "100%",
    height: "100vh",
    pointerEvents: "none",
  };

  // Determine styles for the inner narrative container based on rail positioning
  const getContainerStyle = (): React.CSSProperties => {
    if (mobile) {
      switch (position) {
        case "right":
          return {
            position: "absolute",
            top: "50%",
            left: "14vw",
            transform: "translateY(-50%)",
            width: "78vw",
            textAlign: "left",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          };
        case "center":
          return {
            position: "absolute",
            top: "50%",
            left: "10vw",
            transform: "translateY(-50%)",
            width: "80vw",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          };
        case "left":
        default:
          return {
            position: "absolute",
            top: "50%",
            left: "8vw",
            transform: "translateY(-50%)",
            width: "78vw",
            textAlign: "left",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          };
      }
    } else {
      switch (position) {
        case "right":
          return {
            position: "absolute",
            top: "50%",
            left: "58vw",
            transform: "translateY(-50%)",
            width: "38vw",
            textAlign: "left",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          };
        case "center":
          return {
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "45vw",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          };
        case "left":
        default:
          return {
            position: "absolute",
            top: "50%",
            left: "10vw",
            transform: "translateY(-50%)",
            width: "40vw",
            textAlign: "left",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          };
      }
    }
  };

  return (
    <section style={outerStyle} className="box-border z-10">
      {/* 
        Mobile: pure opacity fade, 0.25s — no Y offset to avoid positional jitter.
        Desktop: opacity + subtle Y lift, 0.7s cinematic ease.
        animate fires on mount immediately; whileInView / IntersectionObserver removed.
      */}
      <motion.div
        initial={{ opacity: 0, y: mobile ? 0 : 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: mobile ? 0.25 : 0.7,
          ease: [0.16, 1, 0.3, 1],
          delay: mobile ? 0 : 0.05,
        }}
        className="pointer-events-none"
        style={getContainerStyle()}
      >
        {children}
      </motion.div>
    </section>
  );
};


export default function HUD() {
  return (
    <>
      <Scroll html style={{ width: "100%", height: "100%", pointerEvents: "none" }}>
        {/* 1. SCENE 01: INTRO & LAUNCH SEQUENCE (Page 0 - 1.2) */}
        <Section offset={0} position="left">
          <div className="space-y-4 sm:space-y-6 select-none text-left w-full">
            <div className="inline-block bg-white/5 border border-white/10 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full font-mono text-[10px] sm:text-xs tracking-[0.15em] text-emerald-400 uppercase">
              MISSION STATUS // PREPARING LAUNCH
            </div>
            <h1 className="font-space text-[38px] sm:text-5xl md:text-8xl font-medium md:font-light tracking-tighter text-white leading-[0.98] md:leading-tight">
              Explorer: <span className="font-normal text-amber-400">{EXPLORER_NAME}</span>
            </h1>
            <p className="font-sans text-[15px] sm:text-lg md:text-2xl text-slate-300 max-w-[70vw] sm:max-w-xl font-light tracking-wide leading-relaxed">
              <strong className="text-white font-normal block mb-1 text-base sm:text-lg">Mission Objective:</strong>
              &ldquo;{MISSION_OBJECTIVE}&rdquo;
            </p>
            <div className="pt-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 font-mono text-[10px] sm:text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-cyan-400 animate-ping" />
                <span className="text-white uppercase tracking-wider font-semibold">[LAUNCH SEQUENCE READY]</span>
              </div>
              <span className="text-slate-600 hidden sm:inline">|</span>
              <span className="animate-pulse">↓ SCROLL TO SAIL SPACE SHIELD</span>
            </div>
          </div>
        </Section>

        {/* 2. SCENE 02: VERIDIAN PRIME // PLANET OF CURIOSITY (Page 2 - 4) */}
        <Section offset={2} position="left">
          <div className="w-full select-none text-left">
            <span className="font-mono text-xs tracking-[0.15em] text-amber-400 uppercase block mb-2">
              CHAPTER ONE // UNDERGRADUATE FOUNDATIONS
            </span>
            <h2 className="font-space text-[38px] sm:text-4xl md:text-6xl text-white font-medium md:font-light tracking-tight leading-[0.98] md:leading-tight mb-3">
              Veridian <span className="text-amber-400 font-normal">Prime</span>
            </h2>
            <p className="font-sans text-[15px] sm:text-base md:text-lg text-slate-300 font-light leading-relaxed mb-4 sm:mb-6 max-w-[70vw] sm:max-w-xl">
              Where empathy and inquiry take root. Before building products, one must understand human psychology, team resilience, and the art of listening to what isn&apos;t being said.
            </p>
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-amber-300 font-mono text-[11px] sm:text-xs text-left">
              <span>💡 INTERACTIVE: Click the 5 orbital beacons to explore stories.</span>
            </div>
          </div>
        </Section>

        {/* 3. SCENE 03: THE KAOS STRAIT // ASTEROID SLALOM (Page 4.5 - 6.5) */}
        <Section offset={4.5} position="left">
          <div className="w-full select-none text-left">
            <span className="font-mono text-xs tracking-[0.15em] text-rose-400 uppercase block mb-2">
              CHAPTER TWO // THE PHILOSOPHICAL GAUNTLET
            </span>
            <h2 className="font-space text-[38px] sm:text-4xl md:text-6xl text-white font-medium md:font-light tracking-tight leading-[0.98] md:leading-tight mb-3">
              The Kaos <span className="text-rose-400 font-normal">Strait</span>
            </h2>
            <p className="font-sans text-[15px] sm:text-base md:text-lg text-slate-300 font-light leading-relaxed mb-4 sm:mb-6 max-w-[70vw] sm:max-w-xl">
              Navigating the inevitable ambiguity, scope creep, and executive friction of real-world product management. We do not attempt to destroy obstacles; we prioritize navigation around them.
            </p>
            <div className="inline-flex items-center gap-2 bg-rose-500/10 border border-rose-500/30 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-rose-300 font-mono text-[11px] sm:text-xs">
              <span>🚨 WARNING: Click the pulsing red warning asteroids to inspect logs.</span>
            </div>
          </div>
        </Section>

        {/* 4. SCENE 04: SYNTHESIS-V // CYBERNETIC LEARNING BELT (Page 7 - 9.5) */}
        <Section offset={7} position="right">
          <div className="w-full select-none text-left">
            <span className="font-mono text-xs tracking-[0.15em] text-cyan-400 uppercase block mb-2">
              CHAPTER THREE // KNOWLEDGE MONOLITHS
            </span>
            <h2 className="font-space text-[38px] sm:text-4xl md:text-6xl text-white font-medium md:font-light tracking-tight leading-[0.98] md:leading-tight mb-3">
              Synthesis-<span className="text-cyan-400 font-normal">V</span>
            </h2>
            <p className="font-sans text-[15px] sm:text-base md:text-lg text-slate-300 font-light leading-relaxed mb-4 sm:mb-6 max-w-[70vw] sm:max-w-xl">
              Transforming raw knowledge into executive analytical frameworks. From machine learning and product analytics to unit economics and statistical rigor at scale.
            </p>
            <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-cyan-300 font-mono text-[11px] sm:text-xs">
              <span>🔬 ANALYTICS: Click any of the floating crystals to inspect telemetry.</span>
            </div>
          </div>
        </Section>

        {/* 5. SCENE 05: WORMHOLE WARP CONDUIT (Page 10) */}
        <Section offset={10} position="center">
          <div className="w-full select-none text-center">
            <span className="font-mono text-xs tracking-[0.15em] text-pink-400 uppercase block mb-2 sm:mb-3">
              MISSION LOG // WARP DRIVE ENGAGED
            </span>
            <h2 className="font-space text-[30px] sm:text-3xl md:text-5xl font-medium md:font-light text-white tracking-tight leading-[1.05] md:leading-tight mb-3 sm:mb-4">
              Learning creates <span className="text-cyan-400">possibility</span>.<br />
              Building creates <span className="text-emerald-400">impact</span>.
            </h2>
            <p className="text-[10px] sm:text-sm font-mono text-slate-400 tracking-[0.15em] uppercase animate-pulse">
              [AUTO-MOMENTUM GLIDE ENGAGED: ACCELERATING INTO ORBITAL RESEARCH SECTOR]
            </p>
          </div>
        </Section>

        {/* 6. SCENE 06: NEXUS-7 ORBITAL CITY // THE BUILDER STATION (Page 11.8 - 13.5) */}
        <Section offset={11.8} position="left">
          <div className="w-full select-none text-left">
            <span className="font-mono text-xs tracking-[0.15em] text-emerald-400 uppercase block mb-2">
              CHAPTER FOUR // FLAGSHIP PRODUCT LABS
            </span>
            <h2 className="font-space text-[38px] sm:text-4xl md:text-6xl text-white font-medium md:font-light tracking-tight leading-[0.98] md:leading-tight mb-3">
              Nexus-7 <span className="text-emerald-400 font-normal">Station</span>
            </h2>
            <p className="font-sans text-[15px] sm:text-base md:text-lg text-slate-300 font-light leading-relaxed mb-4 sm:mb-6 max-w-[70vw] sm:max-w-xl">
              An orbital research station dedicated to solving complex human friction. Here lies the synthesis of user empathy, technical architecture, and ruthless trade-off analysis.
            </p>
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-emerald-300 font-mono text-[11px] sm:text-xs">
              <span>🛠️ LABS: Click any orbital laboratory for a 9-dimension breakdown.</span>
            </div>
          </div>
        </Section>

        {/* 7. SCENE 07: COMMAND DOME // DYSON SPHERE MEGASTRUCTURE (Page 14.2) */}
        <Section offset={14.2} position="center">
          <div className="w-full select-none bg-slate-950/80 backdrop-blur-2xl border border-white/15 p-5 sm:p-10 md:p-14 rounded-3xl shadow-2xl text-center">
            <span className="font-mono text-xs tracking-[0.15em] text-amber-400 uppercase block mb-2 sm:mb-4">
              MISSION CONTROL // STRATEGIC LIAISON
            </span>
            <h2 className="font-space text-[38px] sm:text-4xl md:text-7xl font-medium md:font-light text-white tracking-tight leading-[0.98] md:leading-tight mb-3 sm:mb-6">
              Command Dome
            </h2>
            <div className="py-2 sm:py-4 border-y border-white/10 my-3 sm:my-6 font-mono text-sm sm:text-lg md:text-2xl text-emerald-400 tracking-widest font-semibold">
              ... CORRECTION. MISSION STILL ACTIVE.
            </div>
            <p className="font-sans text-[15px] sm:text-base md:text-xl text-slate-300 font-light leading-relaxed max-w-[70vw] sm:max-w-xl mx-auto mb-4 sm:mb-6">
              I&apos;m currently exploring Product Management opportunities where I can contribute through user research, analytics, structured product thinking, and AI-powered product development. I&apos;d love to connect.
            </p>
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-slate-400 font-mono text-[11px] sm:text-xs">
              <span>✨ LIAISON: Use the Command Dashboard below to schedule walkthrough or review specs.</span>
            </div>
          </div>
        </Section>
      </Scroll>
    </>
  );
}
