"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMissionStore } from "../../store/missionStore";

export default function InteractionHintToast() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(true);
  
  // Also dismiss if they actually click an object
  const activeObjectiveId = useMissionStore(state => state.activeObjectiveId);

  useEffect(() => {
    const dismissed = localStorage.getItem("interactionHintDismissed");
    if (!dismissed) {
      setIsDismissed(false);
    }
  }, []);

  useEffect(() => {
    if (isDismissed) return;
    
    // Auto-dismiss if they figure it out themselves
    if (activeObjectiveId) {
      setIsVisible(false);
      setIsDismissed(true);
      localStorage.setItem("interactionHintDismissed", "true");
      return;
    }

    // Delay the toast by 4.5 seconds so the user has time to notice the 
    // object's idle pulse first (the ~1s stagger requested).
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 4500);

    return () => clearTimeout(timer);
  }, [isDismissed, activeObjectiveId]);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    localStorage.setItem("interactionHintDismissed", "true");
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="fixed bottom-24 right-4 md:right-8 z-[100] max-w-[calc(100vw-2rem)] w-[calc(100vw-2rem)] sm:w-[280px] p-4 bg-slate-950/95 border border-cyan-500/50 rounded-lg shadow-[0_0_20px_rgba(0,240,255,0.2)] backdrop-blur-md pointer-events-none box-border"
        >
          <div className="flex items-start gap-3">
            <div className="mt-1.5 flex-shrink-0 relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
            </div>
            <div className="flex-1">
              <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400 mb-1">Interaction Hint</h4>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">Objects emitting a cyan pulse contain mission data. Click to inspect.</p>
            </div>
            <button 
              onClick={handleDismiss}
              className="text-slate-500 hover:text-white transition-colors pointer-events-auto cursor-pointer"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M2 10L10 2M2 2L10 10" />
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
