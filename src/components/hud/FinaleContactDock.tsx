"use client";

import { motion } from "framer-motion";
import { FINALE_LINKS, EXPLORER_NAME } from "../../data/missionData";
import { audioEngine } from "../../lib/audioEngine";
import { FileText, User, Code, Phone } from "lucide-react";

interface CommandDashboardProps {
  progress: number; // 0.0 to 1.0
}

export default function CommandDashboard({ progress }: CommandDashboardProps) {
  // Only show when near the finale Dyson Sphere / Command Dome (progress > 0.86)
  const isVisible = progress > 0.86;

  const kpis = [
    { label: "TIME-TO-SHORTLIST", value: "-62%", desc: "Resume Analyzer AI" },
    { label: "CLARIFICATION THREADS", value: "-75%", desc: "Masterclass PRDs" },
    { label: "LEGAL REVIEW SPEED", value: "45 min", desc: "DocLens Contract Q&A (vs 4.5d)" }
  ];

  return (
    <div 
      aria-label="Command Dashboard & Availability Hub"
      className={`fixed bottom-0 left-0 w-full z-50 p-4 sm:p-6 flex flex-col items-center justify-end pointer-events-none transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12 pointer-events-none"
      }`}
      style={{ transform: "translate3d(0, 0, 0)", willChange: "transform" }}
    >
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: isVisible ? 0 : 60, opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="bg-slate-950/95 backdrop-blur-2xl border border-emerald-500/40 max-w-5xl w-full p-5 sm:p-6 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.9)] flex flex-col gap-5 pointer-events-auto select-none relative overflow-hidden"
      >
        {/* Top Accent Glow */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 shadow-[0_0_20px_#10B981]" />

        {/* Top Row: Emerald Availability Badge & What I'm Building Next */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex flex-col items-start gap-2 bg-emerald-950/80 border border-emerald-500/40 px-4 py-2.5 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.25)]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping shadow-[0_0_8px_#10B981]" />
              <span className="text-emerald-300 font-mono text-[10px] font-bold tracking-widest uppercase">
                Currently Seeking Opportunities As:
              </span>
            </div>
            <div className="flex gap-2 text-emerald-400/90 font-mono text-[10px] uppercase font-semibold">
              <span>• Product Manager</span>
              <span>• APM</span>
              <span>• Product Analyst</span>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-slate-300">
            <span className="text-cyan-400 font-bold uppercase tracking-wider">[WHAT I&apos;m BUILDING NEXT]:</span>
            <span className="text-slate-200 italic">Autonomous AI Agent Linter for Enterprise Workflows</span>
          </div>
        </div>

        {/* Middle Row: 3 Animated KPI Metric Counters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {kpis.map((kpi, idx) => (
            <div key={idx} className="bg-white/5 border border-white/10 p-3 rounded-2xl flex flex-col justify-center items-center text-center group hover:border-cyan-500/40 transition-all">
              <span className="font-mono text-[22px] sm:text-2xl font-bold text-cyan-400 tracking-tight group-hover:scale-105 transition-transform">
                {kpi.value}
              </span>
              <span className="font-mono text-[10px] font-semibold text-slate-300 tracking-widest uppercase mt-0.5">
                {kpi.label}
              </span>
              <span className="font-sans text-[11px] text-slate-400 mt-0.5">
                {kpi.desc}
              </span>
            </div>
          ))}
        </div>

        {/* Bottom Row: 1-Tap Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-1 border-t border-white/5">
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="text-slate-400 uppercase tracking-wider hidden lg:inline">[INITIATE SUBSPACE LIAISON]:</span>

            <a 
              href={FINALE_LINKS.resume} 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="View Resume"
              onClick={() => audioEngine.playHoverPing()}
              className="flex flex-col items-center justify-center p-4 border border-cyan-500/20 rounded-xl bg-slate-900/50 hover:bg-cyan-900/30 hover:border-cyan-400/50 transition-all group"
            >
              <FileText className="text-cyan-400 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-medium text-slate-300 group-hover:text-white">Resume</span>
            </a>

            <a 
              href={FINALE_LINKS.linkedin} 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="View LinkedIn Profile"
              onClick={() => audioEngine.playHoverPing()}
              className="flex flex-col items-center justify-center p-4 border border-cyan-500/20 rounded-xl bg-slate-900/50 hover:bg-cyan-900/30 hover:border-cyan-400/50 transition-all group"
            >
              <User className="text-cyan-400 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-medium text-slate-300 group-hover:text-white">LinkedIn</span>
            </a>

            <a 
              href={FINALE_LINKS.github} 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="View GitHub Profile"
              onClick={() => audioEngine.playHoverPing()}
              className="flex flex-col items-center justify-center p-4 border border-cyan-500/20 rounded-xl bg-slate-900/50 hover:bg-cyan-900/30 hover:border-cyan-400/50 transition-all group"
            >
              <Code className="text-cyan-400 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-medium text-slate-300 group-hover:text-white">GitHub</span>
            </a>

            {FINALE_LINKS.tel && (
              <a 
                href={FINALE_LINKS.tel}
                aria-label="Call Phone Number"
                onClick={() => audioEngine.playHoverPing()}
                className="flex flex-col items-center justify-center p-4 border border-emerald-500/20 rounded-xl bg-slate-900/50 hover:bg-emerald-900/30 hover:border-emerald-400/50 transition-all group"
              >
                <Phone className="text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-medium text-slate-300 group-hover:text-white">Call</span>
              </a>
            )}
          </div>

          <a
            href={`mailto:${FINALE_LINKS.email}?subject=Initiating Contact // Mission Build`}
            aria-label="Send Email"
            onClick={() => audioEngine.playHoverPing()}
            className="bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 text-slate-950 font-mono font-bold text-xs uppercase tracking-widest px-6 py-2.5 rounded-full transition-all shadow-[0_0_20px_rgba(16,185,129,0.5)] cursor-pointer hover:scale-105 inline-flex items-center gap-2"
          >
            <span>Initiate Direct Contact</span>
            <span>✉</span>
          </a>
        </div>
      </motion.div>

      <div className="mt-2 font-mono text-[10px] text-slate-500 text-center tracking-widest hidden sm:block">
        &copy; {new Date().getFullYear()} {EXPLORER_NAME} {"// PRODUCT THINKER & ARCHITECT // ALL SYSTEMS OPERATIONAL"}
      </div>
    </div>
  );
}

export { CommandDashboard as FinaleContactDock };
