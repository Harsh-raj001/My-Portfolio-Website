"use client";

import React, { useState, useEffect } from "react";
import { audioEngine } from "../../lib/audioEngine";
import { FINALE_LINKS } from "../../data/missionData";
import { motion, AnimatePresence } from "framer-motion";
import { isMobile } from "../../lib/qualityTier";
import { triggerHaptic } from "../../lib/haptics";

interface ExecFastTrackHUDProps {
  onTeleport?: (targetProgress: number) => void;
  onToggleAudio?: () => void;
  onToggleExecutiveMode?: () => void;
  isAudioMuted?: boolean;
  isExecutiveMode?: boolean;
  onOpenCommandPalette?: () => void;
}

export default function ExecFastTrackHUD({
  onTeleport,
  onToggleAudio,
  onToggleExecutiveMode,
  isAudioMuted = true,
  isExecutiveMode = false,
  onOpenCommandPalette
}: ExecFastTrackHUDProps) {
  const [showToast, setShowToast] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  useEffect(() => {
    setIsMobileDevice(isMobile);
  }, []);

  useEffect(() => {
    if (isExecutiveMode) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowToast(true);
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 2500);
      return () => clearTimeout(timer);
    } else {
      setShowToast(false);
    }
  }, [isExecutiveMode]);

  const teleports = [
    { label: "01 // VERIDIAN PRIME", target: 0.15, desc: "Undergraduate Foundations" },
    { label: "02 // SYNTHESIS-V", target: 0.45, desc: "Technical Certifications" },
    { label: "03 // NEXUS-7 CITY", target: 0.72, desc: "Flagship Case Studies" },
    { label: "04 // DYSON SPECS", target: 0.90, desc: "PRD Specs & Next Mission" }
  ];

  const handleTeleportClick = (target: number) => {
    audioEngine.playHoverPing();
    onTeleport?.(target);
  };

  return (
    <>
      {/* 2-SECOND SYSTEM TRANSITION NOTIFICATION TOAST */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed top-24 right-6 z-[100] bg-slate-950/95 border-2 border-amber-500 rounded-xl p-4 shadow-[0_0_35px_rgba(245,158,11,0.5)] font-mono text-left max-w-sm pointer-events-none"
          >
            <div className="flex items-center gap-2 text-amber-400 font-extrabold text-xs tracking-widest uppercase mb-1">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>EXEC MODE ENABLED</span>
            </div>
            <p className="text-slate-200 text-xs font-semibold tracking-wide">
              Priority Access Granted
            </p>
            <p className="text-slate-400 text-[11px] mt-0.5">
              Mission Summary Ready // 60s Evaluation OS Online
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <nav 
        aria-label="Recruiter Fast-Track Bypass Navigation"
        className="relative md:fixed md:top-6 md:right-6 z-50 flex flex-wrap items-center justify-end gap-2 pointer-events-none font-mono text-xs select-none max-w-full px-2 sm:px-0 w-full md:w-auto"
        style={{ 
          transform: "translate3d(0, 0, 0)", 
          willChange: "transform",
          paddingTop: "env(safe-area-inset-top, 0px)",
          paddingRight: "env(safe-area-inset-right, 0px)",
        }}
      >
        {/* Command Palette Trigger Pill (Ctrl+K / ⌘+K) */}
        <button
          onClick={() => {
            audioEngine.playHoverPing();
            onOpenCommandPalette?.();
          }}
          className="hidden sm:flex items-center gap-1.5 bg-slate-950/80 hover:bg-slate-900/90 text-slate-300 hover:text-cyan-300 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15 hover:border-cyan-500/50 transition-all text-[11px] tracking-wider cursor-pointer pointer-events-auto"
          title="Open Universal Command Palette (Ctrl+K / ⌘+K)"
        >
          <span>🔍 SEARCH</span>
          <span className="bg-white/10 px-1.5 py-0.5 rounded text-xs text-slate-400">⌘K / /</span>
        </button>

        {/* 🚀 DUAL OPERATING SYSTEM SWITCHER (MISSION MODE vs EXEC MODE) */}
        {isMobileDevice ? (
          <button
            onClick={() => {
              if (isExecutiveMode) {
                audioEngine.playKlaxon();
              } else {
                audioEngine.playCrystallinePing(880);
              }
              triggerHaptic("selection");
              onToggleExecutiveMode?.();
            }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-full border backdrop-blur-md transition-all text-[11px] font-extrabold tracking-wider cursor-pointer pointer-events-auto ${
              isExecutiveMode 
                ? "bg-amber-500/20 text-amber-300 border-amber-500/40" 
                : "bg-slate-950/80 text-cyan-400 border-cyan-500/30 shadow-[0_0_15px_rgba(0,240,255,0.15)]"
            }`}
            aria-label={isExecutiveMode ? "Switch to Explorer Mode" : "Switch to Executive Fast Track"}
          >
            <span>{isExecutiveMode ? "🛸 EXPLORER" : "⚡ EXEC MODE"}</span>
          </button>
        ) : (
          <div className="flex flex-col bg-slate-950/90 backdrop-blur-xl p-3 rounded-xl border border-slate-800 shadow-[0_0_25px_rgba(245,158,11,0.15)] min-w-[180px] pointer-events-auto">
            <span className="text-xs font-extrabold uppercase text-slate-500 tracking-widest mb-2 border-b border-slate-800 pb-1">MISSION MODE</span>
            
            <button
              onClick={() => {
                if (isExecutiveMode) {
                  audioEngine.playKlaxon();
                  triggerHaptic("selection");
                  onToggleExecutiveMode?.();
                }
              }}
              className={`flex items-center gap-2 text-xs font-bold tracking-wider py-1.5 transition-colors text-left w-full hover:text-cyan-400 ${
                !isExecutiveMode ? "text-cyan-400" : "text-slate-400"
              }`}
            >
              <span className="text-sm font-mono">{!isExecutiveMode ? "●" : "○"}</span>
              <span>Explorer</span>
            </button>

            <button
              onClick={() => {
                if (!isExecutiveMode) {
                  audioEngine.playCrystallinePing(880);
                  triggerHaptic("selection");
                  onToggleExecutiveMode?.();
                }
              }}
              className={`flex items-center gap-2 text-xs font-bold tracking-wider py-1.5 transition-colors text-left w-full hover:text-amber-400 ${
                isExecutiveMode ? "text-amber-400 animate-pulse" : "text-slate-400"
              }`}
            >
              <span className="text-sm font-mono">{isExecutiveMode ? "●" : "○"}</span>
              <span>Executive Fast Track</span>
            </button>
          </div>
        )}

        {/* 1-Click Sector Teleportation Pills (Only displayed in Mission Mode) */}
        {!isExecutiveMode && (
          <div className="hidden xl:flex items-center gap-1.5 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-cyan-500/30 shadow-[0_0_20px_rgba(0,240,255,0.15)] animate-fadeIn pointer-events-auto">
            <span className="text-cyan-400/60 font-bold uppercase tracking-widest text-xs mr-1">
              [FAST-TRACK]:
            </span>
            {teleports.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleTeleportClick(item.target)}
                title={`Teleport to: ${item.desc}`}
                className="px-2.5 py-1 rounded-full text-slate-300 hover:text-cyan-300 hover:bg-cyan-500/15 border border-transparent hover:border-cyan-500/40 transition-all text-[11px] font-medium tracking-wider cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-400"
              >
                {item.label}
              </button>
            ))}
          </div>
        )}

        {/* Web Audio API Synthesizer Mute/Unmute Toggle */}
        <button
          onClick={() => {
            audioEngine.playHoverPing();
            onToggleAudio?.();
          }}
          className="flex items-center gap-2 bg-slate-950/80 hover:bg-slate-900/90 backdrop-blur-md px-3.5 py-2 rounded-full border border-white/15 text-slate-300 hover:text-white transition-all shadow-lg cursor-pointer group pointer-events-auto"
          title="Toggle Web Audio API Atmospheric Synthesizer"
        >
          <span className={`w-2 h-2 rounded-full transition-colors ${isAudioMuted ? "bg-rose-500" : "bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"}`} />
          <span className="tracking-widest text-[11px]">
            [AUDIO: <strong className={isAudioMuted ? "text-rose-400 font-semibold" : "text-emerald-400 font-semibold"}>{isAudioMuted ? "OFF" : "ON"}</strong>]
          </span>
        </button>

        {/* Resume PDF Action Pill */}
        <a
          href={FINALE_LINKS.resume}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => audioEngine.playHoverPing()}
          className="flex items-center gap-1.5 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/40 hover:to-blue-500/40 text-cyan-300 hover:text-white font-semibold text-[11px] tracking-widest px-4 py-2 rounded-full backdrop-blur-md border border-cyan-400/30 hover:border-cyan-400 transition-all shadow-[0_0_15px_rgba(0,240,255,0.2)] cursor-pointer pointer-events-auto"
        >
          <span>RESUME.PDF</span>
          <span className="text-xs">↗</span>
        </a>
      </nav>
    </>
  );
}
