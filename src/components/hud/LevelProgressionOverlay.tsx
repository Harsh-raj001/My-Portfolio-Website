"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMissionStore } from "../../store/missionStore";
import { audioEngine } from "../../lib/audioEngine";
import { Unlock, ChevronRight } from "lucide-react";
import { TOTAL_INTERACTIVE_NODES } from "../../data/missionData";

interface LevelConfig {
  id: string;
  name: string;
  themeColor: string;
  takeaways: string[];
}

const LEVELS: Record<string, LevelConfig> = {
  "PLANET_CURIOSITY": {
    id: "level-1",
    name: "Level 1: Curiosity Unlocked",
    themeColor: "#10B981", // Emerald
    takeaways: ["Technical foundation established", "Curious mindset activated", "Research orientation initialized", "Transition to Product underway"]
  },
  "ASTEROID_SLALOM": {
    id: "level-2",
    name: "Level 2: Operational Reality Unlocked",
    themeColor: "#F59E0B", // Amber
    takeaways: ["Real users behave unpredictably", "Operations expose hidden systemic problems", "Simplicity scales faster than complexity"]
  },
  "SYNTHESIS_V": {
    id: "level-3",
    name: "Level 3: Product Thinker Unlocked",
    themeColor: "#00F0FF", // Cyan
    takeaways: ["Data validates intuition", "Semantic search creates non-linear value", "Analytics must drive actionable decisions"]
  },
  "ORBITAL_NEXUS": {
    id: "level-4",
    name: "Level 4: Strategy Unlocked",
    themeColor: "#8B5CF6", // Violet
    takeaways: ["AI is a tool, not a strategy", "Shipping beats perfection", "Trade-offs are the core of Product Management"]
  },
  "DYSON_SPHERE": {
    id: "level-5",
    name: "Mission Complete",
    themeColor: "#F87171", // Rose
    takeaways: ["Candidate Profile fully compiled", "Ready for deployment"]
  }
};

export default function LevelProgressionOverlay() {
  const currentChapter = useMissionStore(state => state.currentChapter);
  const visitedNodes = useMissionStore(state => state.visitedNodes);
  const [activeLevel, setActiveLevel] = useState<LevelConfig | null>(null);
  const [hasSeen, setHasSeen] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (currentChapter !== "LAUNCHPAD" && currentChapter !== "WORMHOLE") {
      const level = LEVELS[currentChapter];
      if (level && !hasSeen[level.id]) {
        // Trigger Level Up sequence
        audioEngine.playModalOpen(); 
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setActiveLevel(level);
        setHasSeen(prev => ({ ...prev, [level.id]: true }));
        
        // Auto-dismiss after 6 seconds
        const timer = setTimeout(() => {
          setActiveLevel(null);
        }, 6000);
        return () => clearTimeout(timer);
      }
    }
  }, [currentChapter, hasSeen]);

  // Compute overall progression
  const completionPercentage = Math.min(100, Math.round((visitedNodes.length / TOTAL_INTERACTIVE_NODES) * 100));

  return (
    <>
      {/* 1. Global HUD Progression Tracker */}
      <div 
        className="absolute top-20 left-4 right-4 z-40 pointer-events-none flex flex-col items-start gap-1 select-none md:fixed md:top-24 md:right-6 md:left-auto md:items-end"
        style={{
          paddingTop: "env(safe-area-inset-top, 0px)",
          paddingRight: "env(safe-area-inset-right, 0px)",
        }}
      >
        <div className="text-xs font-mono text-slate-500 uppercase tracking-widest flex items-center gap-2">
          <span>Evolution</span>
          <span className="text-cyan-400">{completionPercentage}%</span>
        </div>
        <div className="w-32 h-1 bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
          <div 
            className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 transition-all duration-1000 ease-out"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      {/* 2. Level Up Modal Overlay */}
      <AnimatePresence>
        {activeLevel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md pointer-events-auto"
            onClick={() => setActiveLevel(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: -20 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-slate-900/95 border shadow-[0_0_50px_rgba(0,0,0,0.5)] max-w-lg w-full rounded-2xl p-8 relative overflow-hidden"
              style={{ borderColor: `${activeLevel.themeColor}50` }}
              onClick={e => e.stopPropagation()}
            >
              <div 
                className="absolute top-0 left-0 w-full h-1" 
                style={{ backgroundColor: activeLevel.themeColor, boxShadow: `0 0 20px ${activeLevel.themeColor}` }} 
              />
              
              <div className="flex items-center gap-4 mb-6">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center bg-slate-800 border"
                  style={{ borderColor: `${activeLevel.themeColor}50`, color: activeLevel.themeColor }}
                >
                  <Unlock size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-light text-white tracking-tight">
                    {activeLevel.name}
                  </h2>
                  <p className="text-xs font-mono tracking-widest uppercase mt-1" style={{ color: activeLevel.themeColor }}>
                    Mission Debrief
                  </p>
                </div>
              </div>

              <div className="space-y-3 mt-8">
                <h3 className="text-xs font-mono text-slate-500 tracking-widest uppercase mb-4">Key Takeaways</h3>
                {activeLevel.takeaways.map((takeaway, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + (i * 0.1) }}
                    key={i} 
                    className="flex items-start gap-3 bg-slate-800/40 p-3 rounded-lg border border-white/5"
                  >
                    <ChevronRight size={14} className="mt-0.5 shrink-0" style={{ color: activeLevel.themeColor }} />
                    <span className="text-sm font-light text-slate-300 leading-relaxed">{takeaway}</span>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 text-center">
                <button 
                  onClick={() => setActiveLevel(null)}
                  className="text-xs font-mono font-bold tracking-widest uppercase hover:text-white transition-colors"
                  style={{ color: `${activeLevel.themeColor}80` }}
                >
                  [ Resume Flight ]
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
