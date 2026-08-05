"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Code, FileText, Briefcase, BarChart2, BookOpen, Layers, Eye } from "lucide-react";
import { audioEngine } from "../../lib/audioEngine";
import { 
  PORTFOLIO_PROJECTS, 
  PRD_VAULT, 
  SKILL_CATEGORIES, 
  RESEARCH_PAPERS,
  PRODUCT_THINKING_NODES,
  ALL_PROJECTS,
  NODE_TO_PROJECT_MAP
} from "../../data/missionData";
import ResourceLink from "./ResourceLink";

interface MissionIntelligenceSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectResult: (sectionId: string) => void;
}

export default function MissionIntelligenceSearch({ isOpen, onClose, onSelectResult }: MissionIntelligenceSearchProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      audioEngine.playHoverPing();
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setQuery("");
    }
  }, [isOpen]);

  // Semantic Search Logic
  const getResults = () => {
    const q = query.toLowerCase().trim();
    if (!q) return [];

    const results: { id: string; title: string; type: string; section: string; icon: React.ReactNode }[] = [];

    // Semantic Mapping
    const semanticMap: Record<string, string[]> = {
      "ai": ["resume analyzer", "doclens", "autonomous job agent", "prompt engineering", "llms", "chatgpt"],
      "blockchain": ["blockchain", "path of resiliency", "cryptocurrency"],
      "hyundai": ["hyundai", "dealer field rep", "dealer connect"],
      "strategy": ["product strategy", "roadmapping", "prioritization", "go-to-market", "business", "market research"],
      "data": ["analytics", "sql", "power bi", "tableau", "python", "data science"],
      "marketing": ["digital marketing", "marketing science", "hubspot", "crm", "meta"]
    };

    let searchTerms = [q];
    // Check if query triggers semantic synonyms
    for (const [key, related] of Object.entries(semanticMap)) {
      if (q.includes(key) || key.includes(q)) {
        searchTerms = [...searchTerms, ...related];
      }
    }

    const matchesTerm = (text: string) => searchTerms.some(term => text.toLowerCase().includes(term));

    // Search Projects
    PORTFOLIO_PROJECTS.forEach(p => {
      if (matchesTerm(p.topic) || matchesTerm(p.overview) || matchesTerm("ai product")) {
        results.push({ id: `proj-${p.id}`, title: p.topic, type: "AI Product", icon: <Code size={14}/>, section: "featured-products" });
      }
    });

    // Search PRDs
    PRD_VAULT.forEach(p => {
      if (matchesTerm(p.title) || matchesTerm(p.domain) || matchesTerm(p.problem)) {
        results.push({ id: `prd-${p.id}`, title: p.title, type: "PRD", icon: <FileText size={14}/>, section: "prds" });
      }
    });

    // Search Case Studies
    PRODUCT_THINKING_NODES.filter(n => n.category === "Case Study").forEach(p => {
      if (matchesTerm(p.topic) || matchesTerm(p.overview) || matchesTerm(p.decisions)) {
        results.push({ id: `cs-${p.id}`, title: p.topic, type: "Case Study", icon: <Briefcase size={14}/>, section: "case-studies" });
      }
    });

    // Search Analytics
    PRODUCT_THINKING_NODES.filter(n => n.category === "Product Analytics").forEach(a => {
      if (matchesTerm(a.topic) || matchesTerm(a.overview) || matchesTerm(a.category)) {
        results.push({ id: `an-${a.id}`, title: a.topic, type: "Product Analytics", icon: <BarChart2 size={14}/>, section: "analytics" });
      }
    });

    // Search Research
    PRODUCT_THINKING_NODES.filter(n => n.category === "User Research").forEach(ur => {
      if (matchesTerm(ur.topic) || matchesTerm(ur.overview) || matchesTerm(ur.category)) {
        results.push({ id: `ur-${ur.id}`, title: ur.topic, type: "User Research", icon: <Eye size={14}/>, section: "user-research" });
      }
    });
    
    // Search Publications
    RESEARCH_PAPERS.forEach(p => {
      if (matchesTerm(p.title) || matchesTerm(p.type)) {
        results.push({ id: `pub-${p.id}`, title: p.title, type: "Publication", icon: <BookOpen size={14}/>, section: "publication" });
      }
    });

    // Search Skills
    SKILL_CATEGORIES.forEach(cat => {
      cat.skills.forEach(skill => {
        if (matchesTerm(skill) || matchesTerm(cat.category)) {
          results.push({ id: `skill-${skill}`, title: skill, type: "Skill", icon: <Layers size={14}/>, section: "skills" });
        }
      });
    });

    // Deduplicate
    const uniqueResults = [];
    const ids = new Set();
    for (const r of results) {
      if (!ids.has(r.id)) {
        ids.add(r.id);
        uniqueResults.push(r);
      }
    }

    return uniqueResults.slice(0, 8); // Top 8 results
  };

  const results = getResults();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] bg-black/60 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: -20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-full max-w-2xl bg-slate-900 border border-cyan-500/30 rounded-xl shadow-[0_0_40px_rgba(34,211,238,0.15)] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center px-4 py-3 border-b border-cyan-900/50">
              <Search className="text-cyan-500 mr-3" size={18} />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Mission Intelligence Search (e.g. AI, Hyundai, Strategy...)"
                className="flex-1 bg-transparent border-none outline-none text-slate-200 placeholder-slate-500 font-mono text-sm"
              />
              <div className="flex gap-1">
                <kbd className="px-1.5 py-0.5 text-[10px] bg-slate-800 border border-slate-700 text-slate-400 rounded">ESC</kbd>
              </div>
            </div>

            <div className="max-h-[60vh] overflow-y-auto">
              {query && results.length > 0 && (
                <div className="p-2 space-y-1">
                  <div className="px-3 py-2 text-[10px] font-bold text-cyan-600 uppercase tracking-widest">Results</div>
                  {results.map((r) => {
                    const rawId = r.id.substring(r.id.indexOf("-") + 1);
                    const projectKey = NODE_TO_PROJECT_MAP[rawId] || rawId;
                    const project = ALL_PROJECTS.find(p => p.id === projectKey);

                    return (
                      <button
                        key={r.id}
                        onClick={() => {
                          onSelectResult(r.section);
                          onClose();
                        }}
                        className="w-full flex items-center justify-between px-3 py-3 rounded-lg hover:bg-cyan-900/20 text-left transition-colors border border-transparent hover:border-cyan-800/50 group interactive-card"
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-cyan-500 bg-cyan-950 p-1.5 rounded">{r.icon}</div>
                          <div className="flex flex-col">
                            <div className="text-sm font-semibold text-slate-200 group-hover:text-cyan-400 transition-colors">{r.title}</div>
                            <div className="flex flex-wrap items-center gap-2 mt-1">
                              <span className="text-[10px] text-slate-500 uppercase tracking-wider">{r.type}</span>
                              {project && project.resources && (
                                <div className="flex flex-wrap items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                                  {Object.entries(project.resources).map(([key, url]) => {
                                    if (!url) return null;
                                    let label = "";
                                    switch(key) {
                                      case 'liveDemo': label = "Live Demo"; break;
                                      case 'github': label = "GitHub"; break;
                                      case 'prd': label = "PRD"; break;
                                      case 'caseStudy': label = "Case Study"; break;
                                      case 'analytics': label = "Analytics"; break;
                                      case 'research': label = "Research"; break;
                                      case 'publication': label = "Publication"; break;
                                      case 'documentation': label = "Docs"; break;
                                      case 'demoVideo': label = "Video"; break;
                                      default: label = "Link";
                                    }
                                    return (
                                      <ResourceLink key={key} href={url} className="text-[9px] font-mono bg-slate-800 border border-slate-700/50 hover:border-cyan-500/50 text-slate-400 hover:text-cyan-400 px-1.5 py-0.5 rounded transition-all">
                                        {label}
                                      </ResourceLink>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-slate-600 font-mono group-hover:text-cyan-600 transition-colors">
                          Jump ↵
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {query && results.length === 0 && (
                <div className="p-8 text-center text-slate-500 text-sm font-mono">
                  No intelligence found for &ldquo;{query}&rdquo;.
                </div>
              )}

              {!query && (
                <div className="p-4 grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-[10px] font-bold text-cyan-600 uppercase tracking-widest mb-2">Suggested</div>
                    <div className="space-y-1">
                      {["Resume Analyzer", "Hyundai Dealer Connect", "Blockchain Publication"].map(s => (
                        <button key={s} onClick={() => setQuery(s)} className="w-full text-left px-3 py-2 text-xs text-slate-400 hover:text-cyan-400 hover:bg-cyan-900/20 rounded transition-colors interactive-card">
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-cyan-600 uppercase tracking-widest mb-2">Domains</div>
                    <div className="space-y-1">
                      {["AI", "Product Strategy", "User Research"].map(s => (
                        <button key={s} onClick={() => setQuery(s)} className="w-full text-left px-3 py-2 text-xs text-slate-400 hover:text-cyan-400 hover:bg-cyan-900/20 rounded transition-colors interactive-card">
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
