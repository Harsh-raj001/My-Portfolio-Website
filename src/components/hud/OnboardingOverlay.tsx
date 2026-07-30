"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { audioEngine } from "../../lib/audioEngine";
import { MousePointer2, Activity, ChevronRight } from "lucide-react";

export default function OnboardingOverlay({ onComplete }: { onComplete?: () => void }) {
  const [isVisible, setIsVisible] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => {
    // Check if user has visited before
    const hasVisited = localStorage.getItem("odyssey_onboarding_complete");
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
    localStorage.setItem("odyssey_onboarding_complete", "true");
    if (onComplete) onComplete();
  };

  const handleNext = () => {
    audioEngine.playHoverPing();
    setStep(2);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-auto bg-slate-950/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-slate-900/90 border border-cyan-500/40 p-8 rounded-2xl shadow-[0_0_50px_rgba(0,240,255,0.15)] max-w-md w-[90%] relative overflow-hidden"
          >
            {/* Top scanning line */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50" />
            
            {step === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col gap-6"
              >
                <div>
                  <h2 className="text-2xl font-light text-white mb-2">Welcome, Explorer.</h2>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    This portfolio is a fully interactive 3D experience.
                  </p>
                </div>

                <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">Est. Mission Time</span>
                  <span className="text-sm font-mono text-cyan-400 font-bold">4–6 MIN</span>
                </div>

                <div className="space-y-3">
                  <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-2">You can:</p>
                  <div className="flex items-start gap-3 text-sm text-slate-200">
                    <div className="w-5 h-5 rounded-full bg-cyan-950 flex items-center justify-center shrink-0 mt-0.5 border border-cyan-500/30">
                      <MousePointer2 size={10} className="text-cyan-400" />
                    </div>
                    <span><strong className="text-white font-medium">Explore naturally</strong> by scrolling and clicking objects in the 3D space.</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-slate-200">
                    <div className="w-5 h-5 rounded-full bg-amber-950 flex items-center justify-center shrink-0 mt-0.5 border border-amber-500/30">
                      <Activity size={10} className="text-amber-400" />
                    </div>
                    <span><strong className="text-white font-medium">Enable Exec Mode</strong> for a fast 90-second recruiter dashboard view.</span>
                  </div>
                </div>

                <button 
                  onClick={handleNext}
                  className="mt-2 w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold uppercase tracking-widest text-xs rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  Continue <ChevronRight size={14} />
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col gap-6 items-center text-center py-4"
              >
                <div className="w-16 h-16 rounded-full bg-cyan-950/50 border border-cyan-500/30 flex items-center justify-center mb-2 relative">
                  <div className="absolute inset-0 rounded-full border border-cyan-400/50 animate-ping opacity-20" />
                  <MousePointer2 size={24} className="text-cyan-400" />
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">Step 1</h3>
                  <p className="text-slate-300 text-sm">
                    Scroll down and click the highlighted planet to begin your investigation.
                  </p>
                </div>

                <button 
                  onClick={handleComplete}
                  className="mt-4 w-full py-3 bg-white text-slate-950 hover:bg-slate-200 font-bold uppercase tracking-widest text-xs rounded-lg transition-colors"
                >
                  Acknowledge & Start
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
