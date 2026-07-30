import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMissionStore } from "../../store/missionStore";
import { Scan } from "lucide-react";
import { audioEngine } from "../../lib/audioEngine";

export default function MissionScanner() {
  const { isScannerActive, setScannerActive } = useMissionStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Use Tab to trigger scan. Prevent default to avoid moving focus
      if (e.key === "Tab") {
        e.preventDefault();
        
        if (!isScannerActive) {
          audioEngine.playHoverPing();
          setScannerActive(true);
          
          // Auto-disable scanner after 5 seconds
          setTimeout(() => {
            setScannerActive(false);
          }, 5000);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isScannerActive, setScannerActive]);

  return (
    <AnimatePresence>
      {isScannerActive && (
        <motion.div
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-40 pointer-events-none flex flex-col items-center justify-center"
        >
          {/* Scanner CRT Overlay Effect */}
          <div className="absolute inset-0 bg-cyan-900/10 mix-blend-screen" />
          <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(8,145,178,0.1)_3px,rgba(8,145,178,0.1)_4px)]" />
          
          <div className="absolute top-[20%] flex flex-col items-center">
            <div className="flex items-center gap-4 text-cyan-400 mb-2">
              <div className="w-16 h-[1px] bg-cyan-400" />
              <Scan size={24} className="animate-pulse" />
              <div className="w-16 h-[1px] bg-cyan-400" />
            </div>
            <h2 className="text-2xl font-bold tracking-[0.5em] text-cyan-400 uppercase text-shadow-[0_0_10px_rgba(34,211,238,0.8)]">
              Scan Mode Active
            </h2>
            <p className="text-xs font-mono text-cyan-300 mt-2 uppercase tracking-widest opacity-80">
              Highlighting interactive targets
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
