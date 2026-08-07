"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UniversalNodeContent, PortfolioProject } from "../../types/mission";
import { audioEngine } from "../../lib/audioEngine";
import { FileText, Briefcase, Code, User, BookOpen, ExternalLink, Play, Globe, Eye, BarChart2 } from "lucide-react";
import ResourceLink from "../exec/ResourceLink";
import { ALL_PROJECTS, NODE_TO_PROJECT_MAP } from "../../data/missionData";
import { RESOURCES } from "../../config/resources";

interface UniversalNodeModalProps {
  node: UniversalNodeContent | null;
  onClose: () => void;
}

export default function UniversalNodeModal({ node, onClose }: UniversalNodeModalProps) {
  // Lock body scrolling/motion when modal opens
  useEffect(() => {
    if (node) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
    return () => document.body.classList.remove("modal-open");
  }, [node]);

  // ESC key dismissal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!node) return null;

  const accentColor = node.color || "#00F0FF";

  const getEvidenceIcon = (type: string) => {
    switch(type) {
      case "PRD": return <FileText size={14}/>;
      case "Case Study": return <Briefcase size={14}/>;
      case "GitHub": return <Code size={14}/>;
      case "Demo": return <Play size={14}/>;
      case "Research": return <BookOpen size={14}/>;
      case "Resume": return <User size={14}/>;
      case "Notion": return <FileText size={14}/>;
      default: return <ExternalLink size={14}/>;
    }
  };

  return (
    <motion.div 
      role="dialog"
      aria-modal="true"
      aria-label={`${node.topic} details modal`}
      initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
      animate={{ opacity: 1, backdropFilter: "blur(24px)" }}
      exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/85 select-none"
      onClick={onClose}
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 20 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="bg-slate-950 border-t sm:border border-slate-800 w-full sm:w-[90%] sm:max-w-2xl flex flex-col sm:rounded-3xl shadow-[0_0_60px_rgba(0,0,0,0.8)] relative max-h-[90vh] sm:max-h-[85vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="bg-slate-900/90 border-t border-white/15 w-full flex-1 flex flex-col relative text-slate-100 overflow-hidden min-h-0"
          onClick={(e) => e.stopPropagation()}
          style={{ touchAction: "pan-y" }}
        >
          {/* Top accent glowing bar */}
          <div 
            className="absolute top-0 left-0 w-full h-1.5" 
            style={{ backgroundColor: accentColor, boxShadow: `0 0 20px ${accentColor}` }} 
          />

          {/* Header (Sticky) */}
          <div className="shrink-0 p-4 sm:p-8 pb-3 sm:pb-4 border-b border-white/10 flex items-start justify-between gap-3 bg-slate-900/95 z-10 relative">
            <div className="min-w-0">
              <span className="font-mono text-xs sm:text-xs tracking-widest uppercase block mb-1" style={{ color: accentColor }}>
                [{node.category}]
              </span>
              <h3 className="font-light text-xl sm:text-3xl text-white tracking-tight font-sans truncate">
                {node.topic}
              </h3>
            </div>
            
            <button
              onClick={() => {
                audioEngine.playHoverPing();
                onClose();
              }}
              className="w-11 h-11 sm:w-10 sm:h-10 rounded-full bg-white/5 hover:bg-white/15 active:bg-white/25 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer text-lg font-light shrink-0"
              title="Close modal (Esc)"
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>

          {/* Scrolling Content Body */}
          <div className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-8 space-y-6 sm:space-y-8 custom-scrollbar" style={{ WebkitOverflowScrolling: "touch" }}>
            
            {/* 1. Overview */}
            {node.overview && (
              <div className="space-y-2">
                <h4 className="text-xs font-mono uppercase tracking-widest font-semibold" style={{ color: accentColor }}>Overview</h4>
                <p className="text-base sm:text-lg font-light text-slate-200 leading-relaxed">
                  {node.overview}
                </p>
              </div>
            )}

            {/* 2. Context */}
            {node.context && (
              <div className="space-y-2">
                <h4 className="text-xs font-mono uppercase tracking-widest text-slate-400 font-semibold">Context</h4>
                <p className="text-sm sm:text-base font-light text-slate-300 leading-relaxed">
                  {node.context}
                </p>
              </div>
            )}

            {/* 3. My Approach */}
            {node.approach && (
              <div className="space-y-2">
                <h4 className="text-xs font-mono uppercase tracking-widest text-slate-400 font-semibold">My Approach</h4>
                <p className="text-sm sm:text-base font-light text-slate-300 leading-relaxed">
                  {node.approach}
                </p>
              </div>
            )}

            {/* 4. Key Decisions & Trade-offs */}
            {node.decisions && (
              <div className="space-y-2 bg-slate-800/30 border border-white/5 p-5 rounded-xl">
                <h4 className="text-xs font-mono uppercase tracking-widest font-semibold" style={{ color: accentColor }}>Key Decisions & Trade-offs</h4>
                <p className="text-sm sm:text-base font-light text-slate-300 leading-relaxed">
                  {node.decisions}
                </p>
              </div>
            )}

            {/* 5. Outcome / Learning */}
            {node.outcome && (
              <div className="space-y-2 bg-emerald-900/10 border border-emerald-500/20 p-5 rounded-xl">
                <h4 className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold">Outcome & Learning</h4>
                <p className="text-base sm:text-lg text-emerald-100 font-normal italic leading-relaxed">
                  &ldquo;{node.outcome}&rdquo;
                </p>
              </div>
            )}

          </div>

          {/* Footer: Evidence Cards (Sticky) */}
          <div className="shrink-0 p-4 sm:p-8 pt-3 sm:pt-4 border-t border-white/10 bg-slate-900/95 relative z-10" style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom, 0px))" }}>
            {(() => {
              interface EvidenceCard {
                label: string;
                sublabel: string;
                url: string;
                type: "prd" | "github" | "live" | "case-study" | "analytics" | "research" | "publication" | "resume";
              }

              const getEvidenceCards = (): EvidenceCard[] => {
                const cards: EvidenceCard[] = [];
                const projectKey = NODE_TO_PROJECT_MAP[node.id];
                const project = projectKey ? ALL_PROJECTS.find(p => p.id === projectKey) : null;

                if (project && project.resources) {
                  Object.entries(project.resources).forEach(([key, url]) => {
                    if (!url) return;
                    switch(key) {
                      case 'liveDemo': cards.push({ label: "Live Demo", sublabel: "Try it ↗", url, type: "live" }); break;
                      case 'github': cards.push({ label: "GitHub Repository", sublabel: "Source ↗", url, type: "github" }); break;
                      case 'prd': cards.push({ label: "PRD", sublabel: "Notion ↗", url, type: "prd" }); break;
                      case 'caseStudy': cards.push({ label: "Case Study", sublabel: "Notion ↗", url, type: "case-study" }); break;
                      case 'analytics': cards.push({ label: "Open Analytics", sublabel: "Notion ↗", url, type: "analytics" }); break;
                      case 'research': cards.push({ label: "Open Research", sublabel: "Notion ↗", url, type: "research" }); break;
                      case 'publication': cards.push({ label: "Read Publication", sublabel: "ResearchGate ↗", url, type: "publication" }); break;
                      case 'documentation': cards.push({ label: "Documentation", sublabel: "Docs ↗", url, type: "prd" }); break;
                      case 'demoVideo': cards.push({ label: "Demo Video", sublabel: "Watch ↗", url, type: "live" }); break;
                    }
                  });
                } else if (node.id === "pt1") {
                  cards.push({ label: "Hyundai Case Study", sublabel: "Notion ↗", url: RESOURCES.CASE_STUDIES.hyundaiDealer, type: "case-study" });
                  cards.push({ label: "Hyundai PRD Spec", sublabel: "Notion ↗", url: RESOURCES.PRDS.hyundaiDealer, type: "prd" });
                  cards.push({ label: "TradeLog Case Study", sublabel: "Notion ↗", url: RESOURCES.CASE_STUDIES.tradelog, type: "case-study" });
                  cards.push({ label: "TradeLog PRD Spec", sublabel: "Notion ↗", url: RESOURCES.PRDS.niftySwing, type: "prd" });
                } else if (node.id === "pt4") {
                  cards.push({ label: "Hyundai Field Rep PRD", sublabel: "Notion ↗", url: RESOURCES.PRDS.hyundaiDealer, type: "prd" });
                  cards.push({ label: "NIFTY Swing Journal PRD", sublabel: "Notion ↗", url: RESOURCES.PRDS.niftySwing, type: "prd" });
                  cards.push({ label: "Investor Signal Layer PRD", sublabel: "Notion ↗", url: RESOURCES.PRDS.investorSignal, type: "prd" });
                  cards.push({ label: "Campus Placement PRD", sublabel: "Notion ↗", url: RESOURCES.PRDS.campusPlacement, type: "prd" });
                } else if (node.evidenceUrl && node.evidenceType && node.evidenceType !== "None") {
                  let typeKey: "prd" | "github" | "live" | "case-study" | "analytics" | "research" | "publication" | "resume" = "resume";
                  const t = node.evidenceType.toLowerCase();
                  if (t.includes("prd")) typeKey = "prd";
                  else if (t.includes("github")) typeKey = "github";
                  else if (t.includes("demo")) typeKey = "live";
                  else if (t.includes("study") || t.includes("case")) typeKey = "case-study";
                  else if (t.includes("research")) typeKey = "research";
                  else if (t.includes("paper") || t.includes("pub")) typeKey = "publication";

                  cards.push({
                    label: `View ${node.evidenceType}`,
                    sublabel: "Open link ↗",
                    url: node.evidenceUrl,
                    type: typeKey
                  });
                }
                return cards;
              };

              const getEvidenceIcon = (type: string) => {
                switch(type) {
                  case "prd": return <FileText size={14}/>;
                  case "case-study": return <Briefcase size={14}/>;
                  case "github": return <Code size={14}/>;
                  case "live": return <Play size={14}/>;
                  case "publication": return <BookOpen size={14}/>;
                  case "analytics": return <BarChart2 size={14}/>;
                  case "research": return <Eye size={14}/>;
                  case "resume": return <User size={14}/>;
                  default: return <ExternalLink size={14}/>;
                }
              };

              const cards = getEvidenceCards();
              if (cards.length === 0) {
                return (
                  <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">[No External Evidence Attached]</span>
                );
              }

              return (
                <div className="space-y-3">
                  <span className="text-xs font-mono text-slate-500 uppercase tracking-widest block text-center">Verified Evidence</span>
                  <div className="flex flex-wrap justify-center gap-3 w-full mx-auto">
                    {cards.map((card, idx) => (
                      <ResourceLink 
                        key={idx}
                        href={card.url}
                        className="group flex flex-col items-center justify-center text-center gap-2 w-[140px] px-3 py-3 rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer border"
                        style={{
                          backgroundColor: `${accentColor}10`,
                          borderColor: `${accentColor}30`,
                          boxShadow: `0 0 20px ${accentColor}15`,
                          color: 'white'
                        }}
                        icon={
                          <div 
                            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mb-1"
                            style={{ backgroundColor: `${accentColor}25`, color: accentColor }}
                          >
                            {getEvidenceIcon(card.type)}
                          </div>
                        }
                      >
                        <div className="flex flex-col items-center w-full">
                          <span className="text-xs font-semibold text-white whitespace-nowrap overflow-hidden text-ellipsis w-full px-1">{card.label}</span>
                          <span className="text-xs font-mono text-slate-400 mt-0.5">{card.sublabel}</span>
                        </div>
                      </ResourceLink>
                    ))}
                  </div>
                </div>
              );
            })()}

            <div className="flex justify-center mt-4">
              <button 
                onClick={() => {
                  audioEngine.playHoverPing();
                  onClose();
                }}
                className="hover:text-white transition-all duration-200 uppercase tracking-wider cursor-pointer font-semibold text-xs whitespace-nowrap active:scale-[0.95]"
                style={{ color: accentColor }}
              >
                Resume Flight →
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
