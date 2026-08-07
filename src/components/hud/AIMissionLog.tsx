"use client";

import { useEffect, useState } from "react";
import { AI_MISSION_LOG, AIMissionLogEntry } from "../../data/missionData";
import { audioEngine } from "../../lib/audioEngine";
import { useMissionStore } from "../../store/missionStore";

interface AURAObserverProps {
  operatingMode?: "MISSION" | "TRANSITIONING_TO_EXEC" | "EXEC" | "TRANSITIONING_TO_MISSION";
  searchQuery?: string;
}

export default function AURAObserver({ 
  operatingMode = "MISSION",
  searchQuery = "" 
}: AURAObserverProps) {
  const progress = useMissionStore(state => state.progress);
  const [currentLog, setCurrentLog] = useState<AIMissionLogEntry>(AI_MISSION_LOG[0]);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const isExec = operatingMode === "EXEC" || operatingMode === "TRANSITIONING_TO_EXEC";

  const isIdle = useMissionStore(state => state.isIdle);

  // Find the latest log entry whose threshold is less than or equal to current progress (in Mission Mode)
  useEffect(() => {
    if (isExec) {
      // In Exec Mode, A.U.R.A. becomes the Executive Analyst & Search Assistant
      const execText = searchQuery
        ? `[Search Analysis] Filtering candidate telemetry for keyword "${searchQuery}". 16-Dimension project audits and verified enterprise certifications ready for instant 60-second review.`
        : `[A.U.R.A. Analysis] Candidate demonstrates strong product thinking through independent product work, structured PRDs, user research, analytics, and real-world business problem solving. Current positioning: Ready for Associate Product Manager and Product Manager opportunities.`;
      
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrentLog({
        id: `exec-${searchQuery || "default"}`,
        scrollThreshold: 0,
        category: searchQuery ? "SEARCH ANALYST" : "EXEC ASSISTANT",
        text: execText
      });
      return;
    }

    if (isIdle) {
      setCurrentLog({
        id: "idle-intervention",
        scrollThreshold: 0,
        category: "ASSISTANCE",
        text: "Commander, I've marked the next objective. Follow the highlighted beacon."
      });
      return;
    }

    let active = AI_MISSION_LOG[0];
    for (const log of AI_MISSION_LOG) {
      if (progress >= log.scrollThreshold) {
        active = log;
      } else {
        break;
      }
    }
    if (active.id !== currentLog?.id) {
      setCurrentLog(active);
      audioEngine.playHoverPing();
    }
     // Analyze current state and generate synthesized insights
  }, [progress, currentLog?.id, isExec, searchQuery, isIdle]);

  // Typewriter effect when log changes (20ms/char AAA streaming speed)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDisplayedText("");
    setIsTyping(true);
    let i = 0;
    const fullText = currentLog.text || "";
    const timer = setInterval(() => {
      if (i < fullText.length) {
        i++;
        setDisplayedText(fullText.slice(0, i));
      } else {
        setIsTyping(false);
        clearInterval(timer);
      }
    }, 20); // 20ms per character

    return () => clearInterval(timer);
  }, [currentLog]);

  const getBadgeColor = (cat: string) => {
    if (isExec) {
      return "bg-amber-950/90 text-amber-300 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.3)] font-bold";
    }
    switch (cat) {
      case "OBSERVATION": return "bg-cyan-950/80 text-cyan-400 border-cyan-500/40 shadow-[0_0_10px_rgba(0,240,255,0.2)]";
      case "RESEARCH": 
      case "EVIDENCE": return "bg-indigo-950/80 text-indigo-300 border-indigo-500/40 shadow-[0_0_10px_rgba(99,102,241,0.2)]";
      case "DECISION": return "bg-emerald-950/80 text-emerald-300 border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.2)]";
      case "PHILOSOPHY": 
      case "LESSON": return "bg-amber-950/80 text-amber-300 border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.2)]";
      case "TRADE-OFF": return "bg-rose-950/80 text-rose-300 border-rose-500/40 shadow-[0_0_10px_rgba(244,63,94,0.2)]";
      case "STATUS": default: return "bg-slate-900/80 text-slate-300 border-slate-600/40";
    }
  };

  return (
    <div 
      role="status"
      aria-live="polite"
      aria-atomic="true"
      aria-label="A.U.R.A. Flight Computer Cockpit Monitor"
      className="relative md:fixed md:bottom-6 md:left-6 z-40 w-full md:max-w-[380px] pointer-events-none select-none"
      style={{ 
        transform: "translate3d(0, 0, 0)", 
        willChange: "transform",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
        paddingLeft: "env(safe-area-inset-left, 0px)",
        paddingRight: "env(safe-area-inset-right, 0px)",
      }}
    >
      <div className={`bg-slate-950/90 backdrop-blur-xl border p-4 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.8)] transition-all relative overflow-hidden group ${
        isExec ? "border-amber-500/50 shadow-[0_0_35px_rgba(245,158,11,0.2)]" : "border-cyan-500/30"
      }`}>
        {/* Top Accent Glow Bar */}
        <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-current to-transparent opacity-70 ${
          isExec ? "text-amber-500" : "text-cyan-500"
        }`} />

        {/* Header Tag & Holographic Gyroscope Icon */}
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10 font-mono text-[11px]">
          <div className="flex items-center gap-2.5">
            {/* Animated Holographic Gyroscope Icon */}
            <div className="relative w-4 h-4 flex items-center justify-center">
              <span className={`absolute inset-0 rounded-full border animate-spin ${isExec ? "border-amber-400/80" : "border-cyan-400/60"}`} style={{ animationDuration: "4s" }} />
              <span className={`absolute inset-0.5 rounded-full border border-dashed animate-spin ${isExec ? "border-amber-300/60" : "border-cyan-300/40"}`} style={{ animationDuration: "2.5s", animationDirection: "reverse" }} />
              <span className={`w-1.5 h-1.5 rounded-full ${isExec ? "bg-amber-400 shadow-[0_0_8px_#F59E0B]" : "bg-cyan-400 shadow-[0_0_6px_#00F0FF]"}`} />
            </div>
            <span className={`font-bold uppercase tracking-wider text-xs ${isExec ? "text-amber-400" : "text-cyan-300"}`}>
              {isExec ? "A.U.R.A. // EXEC ANALYST" : "A.U.R.A. // TELEMETRY"}
            </span>
          </div>
          {currentLog && (
            <span className={`px-2 py-0.5 rounded border text-xs font-mono font-bold tracking-widest uppercase ${getBadgeColor(currentLog.category)}`}>
              [{currentLog.category}]
            </span>
          )}
        </div>

        {/* Typewriter Text Body */}
        <p className={`font-sans text-[13px] font-normal leading-relaxed min-h-[48px] tracking-wide ${isExec ? "text-amber-100" : "text-slate-200"}`}>
          {displayedText}
          {isTyping && (
            <span className={`inline-block w-1.5 h-3.5 ml-1 animate-pulse align-middle ${
              isExec ? "bg-amber-400 shadow-[0_0_8px_#F59E0B]" : "bg-cyan-400 shadow-[0_0_8px_#00F0FF]"
            }`} />
          )}
        </p>

        {/* Footer Prompt */}
        <div className="mt-3 pt-2 border-t border-white/5 text-xs font-mono text-slate-400 flex items-center justify-between tracking-widest uppercase">
          <span className="flex items-center gap-1">
            <span className={`w-1.5 h-1.5 rounded-full ${isExec ? "bg-amber-400 animate-ping" : "bg-emerald-400"}`} />
            <span>{isExec ? "RECRUITER BYPASS ACTIVE" : "LIVE TELEMETRY STREAM"}</span>
          </span>
          <span className={isExec ? "text-amber-400 font-bold" : "text-cyan-400/80 font-bold"}>
            {isExec ? "[EXEC OS 1.0]" : `[${Math.round(progress * 100)}% COMPLETED]`}
          </span>
        </div>

        {/* Inline Confidence Bar (parsed from log text) */}
        {(() => {
          const match = currentLog.text.match(/Confidence:\s*(\d+)%/);
          if (!match) return null;
          const confidence = parseInt(match[1], 10);
          return (
            <div className="mt-2 pt-2 border-t border-white/5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">Confidence Index</span>
                <span className="text-xs font-mono font-bold text-cyan-400">{confidence}%</span>
              </div>
              <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{ 
                    width: `${confidence}%`,
                    background: `linear-gradient(90deg, #0891B2, #06B6D4, #22D3EE)`,
                    boxShadow: '0 0 8px rgba(6, 182, 212, 0.5)'
                  }}
                />
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}

export { AURAObserver as AIMissionLog };
