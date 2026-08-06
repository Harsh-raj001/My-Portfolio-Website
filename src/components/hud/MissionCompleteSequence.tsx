"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMissionStore } from "../../store/missionStore";
import { TOTAL_INTERACTIVE_NODES, LIVE_METRICS_DASHBOARD, EXPLORER_NAME } from "../../data/missionData";
import { RESOURCES } from "../../config/resources";
import { audioEngine } from "../../lib/audioEngine";
import ResourceLink from "../exec/ResourceLink";
import { 
  Rocket, FileText, Code, User, Mail, Download, 
  ChevronRight, Shield, Sparkles, Zap, RotateCcw
} from "lucide-react";

interface MissionCompleteSequenceProps {
  onEnterExecMode: () => void;
  onReExplore?: () => void;
}

export default function MissionCompleteSequence({ onEnterExecMode, onReExplore }: MissionCompleteSequenceProps) {
  const visitedNodes = useMissionStore(state => state.visitedNodes);
  const currentChapter = useMissionStore(state => state.currentChapter);
  const [isVisible, setIsVisible] = useState(false);
  const [phase, setPhase] = useState<"scanning" | "stats" | "ready">("scanning");

  const completionPercentage = Math.min(100, Math.round((visitedNodes.length / TOTAL_INTERACTIVE_NODES) * 100));

  // Trigger when user reaches the Dyson Sphere chapter — delay 8s so FinaleContactDock is visible first
  useEffect(() => {
    if (currentChapter === "DYSON_SPHERE" && !isVisible) {
      const delayTimer = setTimeout(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsVisible(true);
        setPhase("scanning");
        audioEngine.playModalOpen();
      }, 8000);
      return () => clearTimeout(delayTimer);
    }
  }, [currentChapter, isVisible]);

  // Phase transitions
  useEffect(() => {
    if (isVisible) {
      const t1 = setTimeout(() => setPhase("stats"), 2500);
      const t2 = setTimeout(() => setPhase("ready"), 5000);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [isVisible]);

  if (!isVisible) return null;

  const stats = [
    { label: "PRDs Written", value: LIVE_METRICS_DASHBOARD.prds, icon: <FileText size={14} /> },
    { label: "Case Studies", value: LIVE_METRICS_DASHBOARD.caseStudies, icon: <Shield size={14} /> },
    { label: "AI Products", value: LIVE_METRICS_DASHBOARD.aiProducts, icon: <Zap size={14} /> },
    { label: "Nodes Explored", value: visitedNodes.length, icon: <Sparkles size={14} /> },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/90 backdrop-blur-xl"
      >
        {/* Scanning Phase */}
        <AnimatePresence mode="wait">
          {phase === "scanning" && (
            <motion.div
              key="scanning"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center space-y-6"
            >
              <div className="w-16 h-16 mx-auto rounded-full border-2 border-cyan-400/50 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border border-dashed border-cyan-400 animate-spin" style={{ animationDuration: "2s" }} />
              </div>
              <div className="space-y-2">
                <p className="text-xs font-mono text-cyan-400 uppercase tracking-[0.3em] animate-pulse">
                  Generating Candidate Profile...
                </p>
                <p className="text-xs font-mono text-slate-500 tracking-widest">
                  A.U.R.A. COMPILING MISSION TELEMETRY
                </p>
              </div>
            </motion.div>
          )}

          {phase === "stats" && (
            <motion.div
              key="stats"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center space-y-8 max-w-md"
            >
              <div className="space-y-3">
                <motion.h2 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-4xl font-light text-white tracking-tight"
                >
                  MISSION COMPLETE
                </motion.h2>
                <p className="text-sm font-mono text-cyan-400 tracking-widest">
                  {completionPercentage}% of universe explored
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.15 }}
                    className="bg-slate-900/80 border border-white/10 p-4 rounded-xl text-center"
                  >
                    <div className="text-cyan-400 flex justify-center mb-2">{stat.icon}</div>
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-xs font-mono text-slate-400 uppercase tracking-widest mt-1">{stat.label}</div>
                  </motion.div>
                ))}
              </div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-xs font-mono text-slate-500 animate-pulse tracking-widest"
              >
                Compiling profile...
              </motion.p>
            </motion.div>
          )}

          {phase === "ready" && (
            <motion.div
              key="ready"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-8 max-w-lg px-6"
            >
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center">
                  <Rocket size={28} className="text-emerald-400" />
                </div>
                <h2 className="text-3xl font-light text-white tracking-tight">
                  Profile Ready
                </h2>
                <p className="text-sm text-slate-300 font-light leading-relaxed max-w-sm mx-auto">
                  {EXPLORER_NAME}&apos;s candidate profile has been compiled. You&apos;ve explored {visitedNodes.length} data points across the entire universe.
                </p>
              </div>

              {/* Action Funnel */}
              <div className="space-y-3 pt-4">
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <button
                    onClick={() => {
                      audioEngine.playModalOpen();
                      onEnterExecMode();
                      setIsVisible(false);
                    }}
                    className="w-full flex items-center justify-between px-6 py-4 bg-cyan-500/15 border border-cyan-500/40 rounded-xl text-cyan-300 hover:bg-cyan-500/25 hover:border-cyan-400/60 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <Download size={18} />
                      <div className="text-left">
                        <span className="text-sm font-semibold text-white block">Open Executive Dashboard</span>
                        <span className="text-xs font-mono text-slate-400">Resume, PRDs, Case Studies, Contact</span>
                      </div>
                    </div>
                    <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.45 }}
                  className="grid grid-cols-2 gap-3"
                >
                  <ResourceLink
                    href={RESOURCES.PROFILES.resume}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-sm text-slate-300 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
                    icon={<FileText size={14} />}
                  >
                    Resume
                  </ResourceLink>
                  <ResourceLink
                    href={RESOURCES.CONTACT.mailto}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-sm text-slate-300 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
                    icon={<Mail size={14} />}
                  >
                    Email
                  </ResourceLink>
                  <ResourceLink
                    href={RESOURCES.PROFILES.linkedin}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-sm text-slate-300 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
                    icon={<User size={14} />}
                  >
                    LinkedIn
                  </ResourceLink>
                  <ResourceLink
                    href={RESOURCES.PROFILES.github}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-sm text-slate-300 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
                    icon={<Code size={14} />}
                  >
                    GitHub
                  </ResourceLink>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-center justify-center gap-6 mt-4"
                >
                  {onReExplore && (
                    <button
                      onClick={() => {
                        audioEngine.playHoverPing();
                        setIsVisible(false);
                        onReExplore();
                      }}
                      className="flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-cyan-300 transition-colors tracking-widest uppercase cursor-pointer"
                    >
                      <RotateCcw size={12} />
                      Re-explore World
                    </button>
                  )}
                  <button
                    onClick={() => setIsVisible(false)}
                    className="text-xs font-mono text-slate-500 hover:text-slate-300 transition-colors tracking-widest uppercase cursor-pointer"
                  >
                    [ Dismiss ]
                  </button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}
