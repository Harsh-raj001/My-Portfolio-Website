"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMissionStore } from "../../store/missionStore";
import { isMobile } from "../../lib/qualityTier";
import { audioEngine } from "../../lib/audioEngine";
import { triggerHaptic } from "../../lib/haptics";
import { Search } from "lucide-react";

export default function AIScannerHUDControl() {
  const { isScannerActive, setScannerActive } = useMissionStore();
  const isScrolling = useMissionStore(state => state.isScrolling);
  const progress = useMissionStore(state => state.progress);
  const hasScrolled = useMissionStore(state => state.hasScrolled);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [hasOpenedOnce, setHasOpenedOnce] = useState(false);
  const [shouldPulse, setShouldPulse] = useState(true);
  const lastScrollPulseTriggered = useRef(false);

  useEffect(() => {
    setIsMobileDevice(isMobile);
    // Check if scanner was ever opened in this session
    const opened = localStorage.getItem("odyssey_scanner_opened_once") === "true";
    setHasOpenedOnce(opened);
    if (opened) {
      setShouldPulse(false);
    }
  }, []);

  // Stop pulsing forever once scanner is opened
  useEffect(() => {
    if (isScannerActive && !hasOpenedOnce) {
      setHasOpenedOnce(true);
      setShouldPulse(false);
      localStorage.setItem("odyssey_scanner_opened_once", "true");
    }
  }, [isScannerActive, hasOpenedOnce]);

  // Pulse again on first scroll
  useEffect(() => {
    if (hasScrolled && !lastScrollPulseTriggered.current && !hasOpenedOnce) {
      lastScrollPulseTriggered.current = true;
      setShouldPulse(true);
      
      // Let it pulse for 4 seconds then turn off
      const timer = setTimeout(() => {
        setShouldPulse(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [hasScrolled, hasOpenedOnce]);

  // Periodic pulse every 9 seconds if not opened yet
  useEffect(() => {
    if (hasOpenedOnce) return;

    const interval = setInterval(() => {
      setShouldPulse(true);
      // Pulse for 3 seconds then stop
      setTimeout(() => {
        setShouldPulse(false);
      }, 3000);
    }, 9000);

    return () => clearInterval(interval);
  }, [hasOpenedOnce]);

  const handleToggle = () => {
    audioEngine.playHoverPing();
    triggerHaptic("light");
    setScannerActive(!isScannerActive);
  };

  const isCollapsed = progress > 0.86;

  // Render text based on device
  const labelText = isMobileDevice ? "Tap • AI Scanner" : "TAB • AI Scanner";

  // Dim and scale down during scroll
  const opacity = isScrolling ? 0.45 : 1;
  const scale = isScrolling ? 0.96 : 1;

  return (
    <div className="relative md:fixed md:bottom-6 md:right-6 z-50 pointer-events-none select-none font-mono flex justify-end md:block">
      <motion.button
        onClick={handleToggle}
        initial={{ y: 40, opacity: 0 }}
        animate={{ 
          y: 0, 
          opacity, 
          scale: isScannerActive ? 1.05 : scale 
        }}
        transition={{ 
          type: "spring", 
          stiffness: 260, 
          damping: 20,
          opacity: { duration: 0.25 }
        }}
        className={`relative flex items-center justify-center gap-2 px-4 py-2.5 rounded-full border transition-all duration-300 backdrop-blur-md cursor-pointer pointer-events-auto ${
          isScannerActive
            ? "bg-cyan-500 text-slate-950 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.6)]"
            : "bg-slate-950/80 text-cyan-400 border-cyan-500/30 hover:border-cyan-400/80 hover:text-cyan-300"
        }`}
      >
        {/* Pulsing indicator ring */}
        {shouldPulse && !isScannerActive && (
          <span className="absolute inset-0 rounded-full border border-cyan-400/60 animate-ping opacity-35 pointer-events-none" />
        )}

        <div className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${
            isScannerActive ? "bg-slate-950 animate-pulse" : "bg-cyan-400 shadow-[0_0_8px_#00F0FF]"
          }`} />
          
          <AnimatePresence mode="wait">
            {!isCollapsed ? (
              <motion.span
                key="full"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="text-xs font-bold tracking-wider whitespace-nowrap overflow-hidden flex items-center"
              >
                {labelText}
              </motion.span>
            ) : (
              <motion.span
                key="collapsed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-xs font-bold flex items-center justify-center w-4 h-4"
              >
                <Search size={12} />
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </motion.button>
    </div>
  );
}
