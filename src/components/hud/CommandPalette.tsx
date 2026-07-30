"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  PORTFOLIO_PROJECTS, 
  PRD_VAULT,
  CERTIFICATIONS, 
  PRODUCT_THINKING_NODES,
  FINALE_LINKS
} from "../../data/missionData";
import { audioEngine } from "../../lib/audioEngine";
import { 
  FileText, ExternalLink, User, Code, Mail, Activity, 
  Cpu, Briefcase, BarChart2, Layers, Award, Map, Search, ChevronRight 
} from "lucide-react";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSection?: (sectionId: string) => void;
}

interface CommandItem {
  id: string;
  category: "LINK" | "PROJECT" | "CASE_STUDY" | "PRD" | "RESEARCH" | "CERTIFICATION" | "SECTION";
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  action: () => void;
}

export default function CommandPalette({
  isOpen,
  onClose,
  onSelectSection
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input when opened
  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
      audioEngine.playCrystallinePing(660);
    }
  }, [isOpen]);

  // Build searchable items library
  const items: CommandItem[] = [
    // 1. Quick Links & Credentials
    {
      id: "link-resume",
      category: "LINK",
      title: "View & Download Resume",
      subtitle: "Official Curriculum Vitae",
      icon: <FileText size={16} />,
      action: () => window.open(FINALE_LINKS.resume, "_blank")
    },
    {
      id: "link-notion",
      category: "LINK",
      title: "View Original Notion Portfolio",
      subtitle: "Complete PRD Spec & Strategy Repository",
      icon: <ExternalLink size={16} />,
      action: () => window.open(FINALE_LINKS.portfolio, "_blank")
    },
    {
      id: "link-linkedin",
      category: "LINK",
      title: "Open LinkedIn Profile",
      subtitle: "Connect on LinkedIn",
      icon: <User size={16} />,
      action: () => window.open(FINALE_LINKS.linkedin, "_blank")
    },
    {
      id: "link-github",
      category: "LINK",
      title: "Explore GitHub Repositories",
      subtitle: "Full-Stack Code & AI Pipelines",
      icon: <Code size={16} />,
      action: () => window.open(FINALE_LINKS.github, "_blank")
    },
    {
      id: "link-email",
      category: "LINK",
      title: "Email Harsh Raj",
      subtitle: FINALE_LINKS.email,
      icon: <Mail size={16} />,
      action: () => window.location.assign(FINALE_LINKS.mailto)
    },

    // 2. Sections & Navigation
    { id: "sec-overview", category: "SECTION", title: "Executive Overview", subtitle: "Top Executive Metrics", icon: <Activity size={16} />, action: () => { onSelectSection?.("overview"); onClose(); } },
    { id: "sec-projects", category: "SECTION", title: "Projects", subtitle: "AI & SaaS Products", icon: <Cpu size={16} />, action: () => { onSelectSection?.("projects"); onClose(); } },
    { id: "sec-case-studies", category: "SECTION", title: "Case Studies", subtitle: "Product Strategy & Audits", icon: <Briefcase size={16} />, action: () => { onSelectSection?.("case-studies"); onClose(); } },
    { id: "sec-prds", category: "SECTION", title: "PRD Vault", subtitle: "10 Rigorous Product Specifications", icon: <FileText size={16} />, action: () => { onSelectSection?.("prds"); onClose(); } },
    { id: "sec-research", category: "SECTION", title: "User Research", subtitle: "Product Teardowns & Audits", icon: <BarChart2 size={16} />, action: () => { onSelectSection?.("user-research"); onClose(); } },
    { id: "sec-skills", category: "SECTION", title: "Skills", subtitle: "Product, Analytics, Dev & AI", icon: <Layers size={16} />, action: () => { onSelectSection?.("skills"); onClose(); } },
    { id: "sec-certs", category: "SECTION", title: "Certifications", subtitle: "Enterprise Accreditations", icon: <Award size={16} />, action: () => { onSelectSection?.("certifications"); onClose(); } },
    { id: "sec-timeline", category: "SECTION", title: "Timeline", subtitle: "Career Milestones", icon: <Map size={16} />, action: () => { onSelectSection?.("timeline"); onClose(); } },

    // 3. Products
    ...PORTFOLIO_PROJECTS.map((lab) => ({
      id: `lab-${lab.id}`,
      category: "PROJECT" as const,
      title: lab.topic,
      subtitle: `${lab.overview}`,
      icon: <Cpu size={16} />,
      action: () => {
        onSelectSection?.("projects");
        onClose();
      }
    })),

    // 4. Case Studies
    ...PRODUCT_THINKING_NODES.filter(n => n.category === "Case Study").map((lab) => ({
      id: `cs-${lab.id}`,
      category: "CASE_STUDY" as const,
      title: lab.topic,
      subtitle: `${lab.overview}`,
      icon: <Briefcase size={16} />,
      action: () => {
        onSelectSection?.("case-studies");
        onClose();
      }
    })),

    // 5. PRDs
    ...PRD_VAULT.map((prd) => ({
      id: `prd-${prd.id}`,
      category: "PRD" as const,
      title: prd.title,
      subtitle: `${prd.problem}`,
      icon: <FileText size={16} />,
      action: () => {
        window.open(prd.prdUrl, "_blank");
        onClose();
      }
    })),

    // 6. User Research & Analytics
    ...PRODUCT_THINKING_NODES.filter(n => n.category === "User Research" || n.category === "Product Analytics").map((res) => ({
      id: `ur-${res.id}`,
      category: "RESEARCH" as const,
      title: res.topic,
      subtitle: `${res.overview}`,
      icon: <BarChart2 size={16} />,
      action: () => {
        if (res.evidenceUrl) window.open(res.evidenceUrl, "_blank");
        onClose();
      }
    })),

    // 7. Certifications
    ...CERTIFICATIONS.map((cert) => ({
      id: `cert-${cert.id}`,
      category: "CERTIFICATION" as const,
      title: cert.title,
      subtitle: `${cert.issuer} // ${cert.category}`,
      icon: <Award size={16} />,
      action: () => { onSelectSection?.("certifications"); onClose(); }
    }))
  ];

  // Filter items by fuzzy search query
  const filteredItems = query.trim() === ""
    ? items
    : items.filter((item) =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
      );

  // Keyboard navigation inside modal
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filteredItems.length || 1));
      audioEngine.playHoverPing();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + (filteredItems.length || 1)) % (filteredItems.length || 1));
      audioEngine.playHoverPing();
    } else if (e.key === "Enter" && filteredItems[selectedIndex]) {
      e.preventDefault();
      filteredItems[selectedIndex].action();
      audioEngine.playCrystallinePing(880);
    } else if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-start justify-center pt-16 md:pt-24 px-4 font-mono">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md"
          />

          {/* Palette Window */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            onKeyDown={handleKeyDown}
            role="dialog"
            aria-modal="true"
            aria-label="Universal Command Palette Search"
            className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[50vh] sm:max-h-[75vh]"
          >
            {/* Search Bar */}
            <div className="flex items-center px-4 py-3.5 border-b border-slate-200 bg-slate-50">
              <Search className="text-slate-400 mr-3" size={18} />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search projects, PRDs, skills, or sections..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                className="w-full bg-transparent border-none text-slate-900 focus:outline-none focus:ring-0 placeholder-slate-400 text-base"
              />
              <span className="text-xs font-bold text-slate-400 border border-slate-200 rounded px-1.5 py-0.5 ml-3 bg-white">ESC</span>
            </div>

            {/* Results List */}
            <div className="overflow-y-auto p-2 space-y-1">
              {filteredItems.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <p className="text-sm font-semibold">No matches found for &ldquo;{query}&rdquo;</p>
                  <p className="text-xs mt-2 opacity-75">Try searching for &ldquo;PRD&rdquo;, &ldquo;TradeLog&rdquo;, or &ldquo;Resume&rdquo;</p>
                </div>
              ) : (
                filteredItems.map((item, index) => {
                  const isSelected = index === selectedIndex;
                  return (
                    <button
                      key={item.id}
                      onClick={() => item.action()}
                      onMouseEnter={() => {
                        setSelectedIndex(index);
                        audioEngine.playHoverPing();
                      }}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                        isSelected ? "bg-slate-900 text-white" : "hover:bg-slate-100 text-slate-900"
                      }`}
                    >
                      <div className="flex items-center gap-4 text-left overflow-hidden pr-4">
                        <span className={`shrink-0 ${isSelected ? "text-cyan-400" : "text-slate-500"}`}>
                          {item.icon}
                        </span>
                        <div className="flex flex-col overflow-hidden">
                          <span className="text-sm font-bold truncate">
                            {item.title}
                          </span>
                          <span className={`text-[10px] truncate ${isSelected ? "text-slate-300" : "text-slate-500"}`}>
                            {item.subtitle}
                          </span>
                        </div>
                      </div>
                      
                      <div className="shrink-0 flex items-center gap-3">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${
                          isSelected ? "bg-white/20 text-white" : "bg-slate-200 text-slate-600"
                        }`}>
                          {item.category}
                        </span>
                        {isSelected && <ChevronRight size={14} className="text-slate-400" />}
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-slate-200 px-4 py-2 bg-slate-50 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <span>Universal Search</span>
              <span>{filteredItems.length} Results</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
