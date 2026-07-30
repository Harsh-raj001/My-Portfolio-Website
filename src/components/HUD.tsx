"use client";

import { Scroll } from "@react-three/drei";
import { motion } from "framer-motion";
import { EXPLORER_NAME, MISSION_OBJECTIVE } from "../data/missionData";

const Section = ({ 
  children, 
  offset, 
  style 
}: { 
  children: React.ReactNode; 
  offset: number; 
  style?: React.CSSProperties; 
}) => {
  return (
    <section 
      style={{
        position: "absolute",
        top: `${offset * 100}vh`,
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "0 8vw",
        pointerEvents: "none",
        ...style
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, margin: "-15%" }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="pointer-events-auto max-w-4xl"
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
        <Section offset={0}>
          <div className="space-y-6 select-none">
            <div className="inline-block bg-white/5 border border-white/10 px-4 py-1.5 rounded-full font-mono text-xs tracking-widest text-emerald-400 uppercase">
              MISSION STATUS // PREPARING LAUNCH
            </div>
            <h1 className="text-5xl md:text-8xl font-light tracking-tighter text-white leading-tight">
              Explorer: <span className="font-normal text-amber-400">{EXPLORER_NAME}</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 max-w-xl font-light tracking-wide leading-relaxed">
              <strong className="text-white font-normal block mb-1">Mission Objective:</strong>
              &ldquo;{MISSION_OBJECTIVE}&rdquo;
            </p>
            <div className="pt-8 flex items-center gap-6 font-mono text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
                <span className="text-white uppercase tracking-wider font-semibold">3 ... 2 ... 1 ... LAUNCH</span>
              </div>
              <span className="text-slate-600">|</span>
              <span className="animate-pulse">↓ SCROLL DOWN TO IGNITE THRUSTERS</span>
            </div>
          </div>
        </Section>

        {/* 2. SCENE 02: VERIDIAN PRIME // PLANET OF CURIOSITY (Page 2 - 4) */}
        <Section offset={2} style={{ alignItems: "flex-end", textAlign: "right", paddingRight: "10vw" }}>
          <div className="max-w-xl select-none">
            <span className="font-mono text-xs tracking-widest text-amber-400 uppercase block mb-2">
              CHAPTER ONE // UNDERGRADUATE FOUNDATIONS
            </span>
            <h2 className="text-4xl md:text-6xl text-white font-light tracking-tight mb-4">
              Veridian <span className="text-amber-400 font-normal">Prime</span>
            </h2>
            <p className="text-base md:text-lg text-slate-300 font-light leading-relaxed mb-6">
              Where empathy and inquiry take root. Before building products, one must understand human psychology, team resilience, and the art of listening to what isn&apos;t being said.
            </p>
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-4 py-2 rounded-xl text-amber-300 font-mono text-xs">
              <span>💡 INTERACTIVE STORYTELLING: Hover & click the 5 orbital beacons to explore human stories.</span>
            </div>
          </div>
        </Section>

        {/* 3. SCENE 03: THE KAOS STRAIT // ASTEROID SLALOM (Page 4.5 - 6.5) */}
        <Section offset={4.5} style={{ alignItems: "flex-start", textAlign: "left", paddingLeft: "10vw" }}>
          <div className="max-w-xl select-none">
            <span className="font-mono text-xs tracking-widest text-rose-400 uppercase block mb-2">
              CHAPTER TWO // THE PHILOSOPHICAL GAUNTLET
            </span>
            <h2 className="text-4xl md:text-6xl text-white font-light tracking-tight mb-4">
              The Kaos <span className="text-rose-400 font-normal">Strait</span>
            </h2>
            <p className="text-base md:text-lg text-slate-300 font-light leading-relaxed mb-6">
              Navigating the inevitable ambiguity, scope creep, and executive friction of real-world product management. We do not attempt to destroy obstacles; we prioritize navigation around them.
            </p>
            <div className="inline-flex items-center gap-2 bg-rose-500/10 border border-rose-500/30 px-4 py-2 rounded-xl text-rose-300 font-mono text-xs">
              <span>🚨 EXPERIENCE LOGS: Hover & click the pulsing red warning asteroids to inspect product principles.</span>
            </div>
          </div>
        </Section>

        {/* 4. SCENE 04: SYNTHESIS-V // CYBERNETIC LEARNING BELT (Page 7 - 9.5) */}
        <Section offset={7} style={{ alignItems: "flex-end", textAlign: "right", paddingRight: "10vw" }}>
          <div className="max-w-xl select-none">
            <span className="font-mono text-xs tracking-widest text-cyan-400 uppercase block mb-2">
              CHAPTER THREE // KNOWLEDGE MONOLITHS
            </span>
            <h2 className="text-4xl md:text-6xl text-white font-light tracking-tight mb-4">
              Synthesis-<span className="text-cyan-400 font-normal">V</span>
            </h2>
            <p className="text-base md:text-lg text-slate-300 font-light leading-relaxed mb-6">
              Transforming raw knowledge into executive analytical frameworks. From machine learning and product analytics to unit economics and statistical rigor at scale.
            </p>
            <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 px-4 py-2 rounded-xl text-cyan-300 font-mono text-xs">
              <span>🔬 ANALYTICAL RIGOR: Click any of the floating crystals to inspect what was learned and applied.</span>
            </div>
          </div>
        </Section>

        {/* 5. SCENE 05: WORMHOLE WARP CONDUIT (Page 10) */}
        <Section offset={10} style={{ alignItems: "center", textAlign: "center" }}>
          <div className="max-w-2xl select-none">
            <span className="font-mono text-xs tracking-widest text-pink-400 uppercase block mb-3">
              MISSION LOG // WARP DRIVE ENGAGED
            </span>
            <h2 className="text-3xl md:text-5xl font-light text-white tracking-tight mb-4">
              Learning creates <span className="text-cyan-400">possibility</span>.<br />
              Building creates <span className="text-emerald-400">impact</span>.
            </h2>
            <p className="text-sm font-mono text-slate-400 tracking-widest uppercase animate-pulse">
              [AUTO-MOMENTUM GLIDE ENGAGED: ACCELERATING INTO ORBITAL RESEARCH SECTOR]
            </p>
          </div>
        </Section>

        {/* 6. SCENE 06: NEXUS-7 ORBITAL CITY // THE BUILDER STATION (Page 11.8 - 13.5) */}
        <Section offset={11.8} style={{ alignItems: "flex-start", textAlign: "left", paddingLeft: "10vw" }}>
          <div className="max-w-2xl select-none">
            <span className="font-mono text-xs tracking-widest text-emerald-400 uppercase block mb-2">
              CHAPTER FOUR // FLAGSHIP PRODUCT LABS
            </span>
            <h2 className="text-4xl md:text-6xl text-white font-light tracking-tight mb-4">
              Nexus-7 <span className="text-emerald-400 font-normal">Station</span>
            </h2>
            <p className="text-base md:text-lg text-slate-300 font-light leading-relaxed mb-6">
              An orbital research station dedicated to solving complex human friction. Here lies the synthesis of user empathy, technical architecture, and ruthless trade-off analysis.
            </p>
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-4 py-2 rounded-xl text-emerald-300 font-mono text-xs">
              <span>🛠️ PRODUCT MASTERY: Click any of the orbital laboratories for a 9-dimension executive breakdown.</span>
            </div>
          </div>
        </Section>

        {/* 7. SCENE 07: COMMAND DOME // DYSON SPHERE MEGASTRUCTURE (Page 14.2) */}
        <Section offset={14.2} style={{ alignItems: "center", textAlign: "center" }}>
          <div className="max-w-3xl select-none bg-slate-950/80 backdrop-blur-2xl border border-white/15 p-10 md:p-14 rounded-3xl shadow-2xl">
            <span className="font-mono text-xs tracking-widest text-amber-400 uppercase block mb-4">
              MISSION CONTROL // STRATEGIC LIAISON
            </span>
            <h2 className="text-4xl md:text-7xl font-light text-white tracking-tight mb-6">
              Command Dome
            </h2>
            <div className="py-4 border-y border-white/10 my-6 font-mono text-lg md:text-2xl text-emerald-400 tracking-widest font-semibold">
              ... CORRECTION. MISSION STILL ACTIVE.
            </div>
            <p className="text-lg md:text-xl text-slate-300 font-light leading-relaxed max-w-xl mx-auto mb-6">
              I&apos;m currently exploring Product Management opportunities where I can contribute through user research, analytics, structured product thinking, and AI-powered product development. I&apos;d love to connect.
            </p>
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-slate-400 font-mono text-xs">
              <span>✨ DIRECT ACTION: Use the Command Dashboard below to schedule an executive walkthrough or review specifications.</span>
            </div>
          </div>
        </Section>
      </Scroll>
    </>
  );
}
