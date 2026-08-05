"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMissionStore } from "../../store/missionStore";
import { isMobile } from "../../lib/qualityTier";
import { Compass, ChevronDown } from "lucide-react";

export default function ProgressiveGuide() {
  const { isScannerActive } = useMissionStore();
  const progress = useMissionStore(state => state.progress);
  const hasScrolled = useMissionStore(state => state.hasScrolled);
  const hasOpenedScanner = useMissionStore(state => state.hasOpenedScanner);
  const [timeExpired, setTimeExpired] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  useEffect(() => {
    setIsMobileDevice(isMobile);
    // Hide the guide after 15 seconds to avoid cluttering the interface
    const timer = setTimeout(() => {
      setTimeExpired(true);
    }, 15000);
    return () => clearTimeout(timer);
  }, []);

  // Hide criteria: progress past 20%, time expired, or scanner has been opened and is currently inactive
  const shouldHideAll = progress >= 0.20 || timeExpired || (hasOpenedScanner && !isScannerActive);

  if (shouldHideAll) return null;

  // Determine current active stage
  let stage: "scroll" | "open-scanner" | "scanner-active" = "scroll";
  if (hasScrolled) {
    stage = isScannerActive ? "scanner-active" : "open-scanner";
  }

  // Device-specific labels
  const scanActionText = isMobileDevice ? "Tap Scanner" : "Press TAB";

  return (
    <AnimatePresence>
      {stage === "scroll" && (
        <motion.div
          key="scroll-stage"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed bottom-[35%] left-1/2 -translate-x-1/2 z-40 pointer-events-none flex flex-col items-center gap-2 select-none"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ 
              repeat: Infinity, 
              duration: 1.6, 
              ease: "easeInOut" 
            }}
            className="flex flex-col items-center"
          >
            <ChevronDown size={28} className="text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
          </motion.div>
          <span className="font-mono text-xs text-slate-300 uppercase tracking-[0.2em] font-semibold text-shadow-[0_0_10px_rgba(255,255,255,0.4)]">
            Scroll to Sail
          </span>
        </motion.div>
      )}

      {stage === "open-scanner" && (
        <motion.div
          key="scanner-stage"
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40 pointer-events-none select-none font-mono"
        >
          <div className="bg-slate-950/85 backdrop-blur-md border border-cyan-500/40 px-5 py-3 rounded-2xl shadow-[0_0_30px_rgba(6,182,212,0.15)] flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping shrink-0" />
            <span className="text-xs text-slate-200 tracking-wide font-medium">
              Great! Now open the scanner <span className="text-cyan-400 font-bold font-mono px-1 border border-cyan-500/20 rounded bg-cyan-950/50">({scanActionText})</span> to inspect targets.
            </span>
          </div>
        </motion.div>
      )}

      {stage === "scanner-active" && (
        <motion.div
          key="active-stage"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40 pointer-events-none select-none font-mono"
        >
          <div className="bg-slate-950/85 backdrop-blur-md border border-emerald-500/40 px-5 py-3 rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.15)] flex items-center gap-3">
            <Compass size={14} className="text-emerald-400 animate-spin shrink-0" style={{ animationDuration: "5s" }} />
            <span className="text-xs text-slate-200 tracking-wide font-medium">
              Excellent! Scan mode active. Highlighting mission targets.
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
