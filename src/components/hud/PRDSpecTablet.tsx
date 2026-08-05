"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PRDVaultItem } from "../../types/mission";
import { audioEngine } from "../../lib/audioEngine";
import { FileText } from "lucide-react";

interface PRDSpecTabletProps {
  prd: PRDVaultItem | null;
  onClose: () => void;
}

export default function PRDSpecTablet({ prd, onClose }: PRDSpecTabletProps) {
  // Lock body scrolling/motion when modal opens
  useEffect(() => {
    if (prd) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
    return () => document.body.classList.remove("modal-open");
  }, [prd]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!prd) return null;

  return (
    <motion.div 
      role="dialog"
      initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
      animate={{ opacity: 1, backdropFilter: "blur(24px)" }}
      exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 select-none"
      onClick={onClose}
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 20 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="bg-slate-950 border border-cyan-500/30 w-[94%] max-w-4xl flex flex-col rounded-3xl shadow-[0_0_60px_rgba(0,0,0,0.9)] relative text-slate-100 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Aerospace Glow Edge */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 shadow-[0_0_25px_rgba(0,240,255,0.5)]" />

          {/* Modal Header */}
          <div className="p-6 sm:p-8 border-b border-white/10 flex items-start justify-between gap-4 bg-slate-900/60">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 text-[11px] font-mono font-bold uppercase tracking-widest shadow-[0_0_10px_rgba(0,240,255,0.2)]">
                  PRD VAULT // {prd.domain}
                </span>
              </div>
              <h2 className="font-light text-2xl sm:text-4xl text-white tracking-tight font-sans">{prd.title}</h2>
            </div>

            <button
              onClick={() => {
                audioEngine.playHoverPing();
                onClose();
              }}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer text-lg shrink-0"
              title="Close specification (Esc)"
            >
              ✕
            </button>
          </div>

          <div className="p-6 sm:p-8 overflow-y-auto space-y-6 font-light leading-relaxed">
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg mb-6">
              <a 
                href={prd.prdUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={() => audioEngine.playHoverPing()}
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs px-4 py-2 rounded-lg transition-all inline-flex items-center gap-2 uppercase shadow-[0_0_15px_rgba(0,240,255,0.3)] hover:scale-105"
              >
                <FileText size={14} /> Open Full PRD PDF
              </a>
              <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">
                Est. Reading Time: {prd.readingTime}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/5 border border-white/10 p-5 rounded-2xl space-y-2 md:col-span-2">
                <h4 className="text-xs font-mono uppercase tracking-wider text-rose-400 font-semibold">Problem Statement</h4>
                <p className="text-slate-200 text-sm sm:text-base leading-relaxed">{prd.problem}</p>
              </div>
            </div>
          </div>
        </motion.div>
    </motion.div>
  );
}
