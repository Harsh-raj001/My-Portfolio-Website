"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { audioEngine } from "../../lib/audioEngine";
import { Compass } from "lucide-react";

export default function OnboardingOverlay({ onComplete }: { onComplete?: () => void }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has visited before
    const hasVisited = sessionStorage.getItem("odyssey_onboarding_complete");
    if (!hasVisited) {
      // Delay slightly for dramatic effect
      const timer = setTimeout(() => {
        setIsVisible(true);
        audioEngine.playKlaxon(); // Soft attention sound
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleComplete = () => {
    audioEngine.playHoverPing();
    setIsVisible(false);
    sessionStorage.setItem("odyssey_onboarding_complete", "true");
    if (onComplete) onComplete();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-auto bg-slate-950/70 backdrop-blur-md">
          <motion.div 
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 15 }}
            transition={{ type: "spring", damping: 25, stiffness: 280 }}
            className="bg-slate-900/90 border border-cyan-500/40 p-8 rounded-2xl shadow-[0_0_50px_rgba(0,240,255,0.15)] max-w-sm w-[90%] relative overflow-hidden"
          >
            {/* Top scanning line decoration */}
            <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60" />
            
            <div className="flex flex-col gap-6 items-center text-center">
              <div className="w-14 h-14 rounded-full bg-cyan-950/50 border border-cyan-500/30 flex items-center justify-center relative">
                <div className="absolute inset-0 rounded-full border border-cyan-400/50 animate-ping opacity-20" style={{ animationDuration: "2s" }} />
                <Compass size={24} className="text-cyan-400" />
              </div>
              
              <div className="space-y-4">
                <h2 className="text-2xl font-light tracking-wide text-white uppercase font-mono">
                  Welcome Aboard
                </h2>
                
                <div className="text-slate-300 text-sm leading-relaxed space-y-4">
                  <p className="font-medium text-white text-base">Explore the world by scrolling.</p>
                  
                  <div className="h-[1px] bg-slate-800 my-2" />
                  
                  <div className="space-y-1">
                    <p className="text-xs font-mono text-cyan-400 tracking-wider uppercase">Need more details?</p>
                    <p>Open the AI Scanner anytime.</p>
                  </div>

                  <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 mt-4 text-xs font-mono text-left space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Desktop</span>
                      <span className="text-cyan-400 font-bold">Press TAB</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Mobile</span>
                      <span className="text-cyan-400 font-bold">Tap Scanner</span>
                    </div>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleComplete}
                className="mt-2 w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold uppercase tracking-widest text-xs rounded-lg transition-colors cursor-pointer"
              >
                Got It
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
