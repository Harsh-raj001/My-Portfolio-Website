import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMissionStore } from "../../store/missionStore";
import { Target, ChevronRight } from "lucide-react";

export default function MissionObjectivePanel() {
  const { currentChapter, breadcrumbs, isIdle } = useMissionStore();

  // Determine objective text based on chapter
  let objectiveTitle = "";
  let objectiveStatus = "Pending";
  let showWarning = false;

  switch (currentChapter) {
    case "PLANET_CURIOSITY":
      objectiveTitle = "Investigate Planet Veridian";
      break;
    case "ASTEROID_SLALOM":
      objectiveTitle = "Analyze Red Axiom Asteroid";
      showWarning = true;
      break;
    case "SYNTHESIS_V":
      objectiveTitle = "Extract Data from Glowing Crystal";
      break;
    case "ORBITAL_NEXUS":
      objectiveTitle = "Dock at Highlighted Module";
      break;
    case "LAUNCHPAD":
    case "WORMHOLE":
    case "DYSON_SPHERE":
    default:
      objectiveTitle = "Navigate Sector";
      objectiveStatus = "In Transit";
      break;
  }

  // If AURA intervention is active, override status
  if (isIdle) {
    objectiveStatus = "A.U.R.A. Assisting";
    showWarning = true;
  }

  return (
    <div 
      className="absolute bottom-40 left-4 right-4 z-40 pointer-events-none w-auto md:fixed md:top-24 md:left-6 lg:left-12 md:bottom-auto md:w-64 lg:w-80"
      style={{
        paddingTop: "env(safe-area-inset-top, 0px)",
        paddingLeft: "env(safe-area-inset-left, 0px)",
      }}
    >
      
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1 text-xs font-mono text-cyan-600/70 uppercase tracking-widest mb-3 flex-wrap">
        {breadcrumbs.map((crumb, idx) => (
          <React.Fragment key={idx}>
            <span className={idx === breadcrumbs.length - 1 ? "text-cyan-400 font-bold" : ""}>
              {crumb}
            </span>
            {idx < breadcrumbs.length - 1 && <ChevronRight size={10} />}
          </React.Fragment>
        ))}
      </div>

      {/* Main Objective Panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentChapter}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.5 }}
          className="bg-slate-950/40 border border-cyan-900/40 p-4 rounded-lg backdrop-blur-md relative overflow-hidden"
        >
          {/* Subtle animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 to-transparent opacity-50" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
              <h3 className="text-xs sm:text-xs font-bold text-cyan-500 uppercase tracking-[0.2em] flex items-center gap-1.5">
                <Target size={10} className={showWarning ? "text-amber-400" : ""} />
                Objective
              </h3>
              <span className={`px-1.5 py-0.5 rounded border text-xs sm:text-xs font-mono uppercase tracking-widest ${
                showWarning 
                  ? "border-amber-900/50 text-amber-400 bg-amber-950/30" 
                  : "border-cyan-900/50 text-cyan-400 bg-cyan-950/30"
              }`}>
                {objectiveStatus}
              </span>
            </div>
            
            <p className="text-xs sm:text-sm font-semibold text-slate-100 leading-snug">
              {objectiveTitle}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
