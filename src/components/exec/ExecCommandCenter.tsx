"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  PORTFOLIO_PROJECTS,
  PRODUCT_THINKING_NODES,
  PRD_VAULT,
  CERTIFICATIONS,
  SKILL_CATEGORIES,
  MISSION_TIMELINE,
  RESEARCH_PAPERS,
  LIVE_METRICS_DASHBOARD,
  EXPLORER_NAME,
  ALL_PROJECTS
} from "../../data/missionData";
import { RESOURCES } from "../../config/resources";
import ResourceLink from "./ResourceLink";
import { audioEngine } from "../../lib/audioEngine";
import { 
  Search, ChevronRight, Activity, Cpu, 
  FileText, Briefcase, BarChart2, Layers, Map,
  Award, Mail, BookOpen, User, Code, File, Phone, Globe, Eye, ExternalLink
} from "lucide-react";
import MissionIntelligenceSearch from "./MissionIntelligenceSearch";
import CountUp from "./CountUp";
import ScanReveal from "./ScanReveal";

interface ExecCommandCenterProps {
  onExitExecMode: () => void;
}

export default function ExecCommandCenter({
  onExitExecMode,
}: ExecCommandCenterProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("overview");

  useEffect(() => {
    document.body.classList.add("modal-open");
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Open search on Cmd+K or Ctrl+K or /
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      } else if (e.key === "/" && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault();
        setIsSearchOpen(true);
      } else if (e.key === "Escape") {
        if (isSearchOpen) {
          setIsSearchOpen(false);
        } else {
          onExitExecMode();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.classList.remove("modal-open");
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSearchOpen, onExitExecMode]);

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    audioEngine.playHoverPing();
    const el = document.getElementById(`exec-sec-${sectionId}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Sections data mapped from central single source of truth ALL_PROJECTS
  const filteredProjects = PORTFOLIO_PROJECTS;
  const filteredCaseStudies = ALL_PROJECTS.filter(p => p.resources?.caseStudy).map(p => ({
    id: p.id,
    topic: p.title,
    overview: p.problem || p.overview,
    decisions: p.solution || p.impact || "",
    evidenceUrl: p.resources?.caseStudy
  }));
  const filteredPRDs = ALL_PROJECTS.filter(p => p.resources?.prd).map(p => {
    const vaultItem = PRD_VAULT.find(v => v.prdUrl === p.resources?.prd);
    return {
      id: p.id,
      title: p.title,
      domain: vaultItem?.domain || (p.category === "AI Product" ? "AI/Automation" : "Product Management"),
      problem: p.problem || p.overview,
      readingTime: vaultItem?.readingTime || "5 min",
      prdUrl: p.resources?.prd!
    };
  });
  const filteredResearch = ALL_PROJECTS.filter(p => p.resources?.research).map(p => ({
    id: p.id,
    topic: p.title,
    overview: p.overview,
    evidenceUrl: p.resources?.research
  }));
  const filteredAnalytics = ALL_PROJECTS.filter(p => p.resources?.analytics).map(p => ({
    id: p.id,
    topic: p.title,
    overview: p.overview,
    evidenceUrl: p.resources?.analytics
  }));
  const filteredCerts = CERTIFICATIONS;
  const filteredTimeline = MISSION_TIMELINE;
  const filteredPapers = ALL_PROJECTS.filter(p => p.resources?.publication).map(p => ({
    id: p.id,
    title: p.title,
    type: p.overview,
    readUrl: p.resources?.publication!
  }));

  const jumpLinks = [
    { id: "overview", label: "Overview", icon: <Activity size={14} /> },
    { id: "featured-products", label: "Projects", icon: <Cpu size={14} /> },
    { id: "case-studies", label: "Case Studies", icon: <Briefcase size={14} /> },
    { id: "prds", label: "PRDs", icon: <FileText size={14} /> },
    { id: "analytics", label: "Analytics", icon: <BarChart2 size={14} /> },
    { id: "user-research", label: "User Research", icon: <Eye size={14} /> },
    { id: "publication", label: "Publication", icon: <BookOpen size={14} /> },
    { id: "timeline", label: "Timeline", icon: <Map size={14} /> },
    { id: "skills", label: "Skills", icon: <Layers size={14} /> },
    { id: "certifications", label: "Certifications", icon: <Award size={14} /> },
    { id: "resume", label: "Resume", icon: <File size={14} /> },
    { id: "contact", label: "Contact", icon: <Mail size={14} /> },
  ];

  // Group Certifications by Category
  const groupedCerts = useMemo(() => {
    const groups: Record<string, typeof CERTIFICATIONS> = {};
    filteredCerts.forEach(cert => {
      if (!groups[cert.category]) groups[cert.category] = [];
      groups[cert.category].push(cert);
    });
    return groups;
  }, [filteredCerts]);

  const buttonClass = "flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-semibold bg-slate-900/50 border border-slate-700/50 text-slate-300 hover:text-cyan-400 hover:bg-slate-800 hover:border-cyan-900/50 rounded-md transition-colors backdrop-blur-sm interactive-card";
  const primaryButtonClass = "flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-semibold bg-cyan-950/30 border border-cyan-800/50 text-cyan-400 hover:bg-cyan-900/50 hover:text-cyan-300 hover:shadow-[0_0_15px_rgba(56,189,248,0.2)] rounded-md transition-all backdrop-blur-sm interactive-card";

  return (
    <>
      <MissionIntelligenceSearch 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
        onSelectResult={scrollToSection} 
      />
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ type: "spring", stiffness: 400, damping: 40 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl p-0 sm:p-4 lg:p-6"
        onClick={(e) => {
          if (e.target === e.currentTarget) onExitExecMode();
        }}
      >
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')", backgroundRepeat: "repeat" }}></div>
        <div className="w-full max-w-[1400px] h-full bg-slate-950/90 text-slate-200 rounded-xl shadow-2xl flex flex-col overflow-hidden border border-cyan-900/30 backdrop-blur-md relative z-10">
        
        {/* TOP COMMAND BAR */}
        <div className="shrink-0 bg-slate-950/80 border-b border-cyan-900/30 px-6 py-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onExitExecMode}
              className="text-slate-400 hover:text-cyan-400 px-2 py-1.5 rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5 interactive-card"
            >
              <ChevronRight size={14} className="rotate-180" />
              Exit Exec Mode
            </button>
            <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-cyan-950/30 rounded-full border border-cyan-900/50">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
              <span className="text-[10px] font-semibold text-cyan-400 uppercase tracking-widest">EXEC MODE ENABLED</span>
            </div>
          </div>
          
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center justify-between w-full md:w-80 bg-slate-900/50 border border-cyan-900/30 hover:border-cyan-500/50 text-slate-400 text-xs rounded-md px-3 py-1.5 transition-all interactive-card"
          >
            <div className="flex items-center gap-2">
              <Search className="text-cyan-600" size={14} />
              <span>Mission Intelligence Search...</span>
            </div>
            <kbd className="hidden md:inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-slate-700 bg-slate-800 text-[10px] font-mono">
              <span className="text-slate-300">⌘</span>K
            </kbd>
          </button>
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 flex overflow-hidden bg-transparent">
          
          {/* LEFT SIDEBAR: JUMP NAV */}
          <aside className="hidden lg:flex flex-col w-56 shrink-0 border-r border-cyan-900/30 bg-slate-950/50 py-6 overflow-y-auto">
            <nav className="flex flex-col gap-0.5 px-3">
              <div className="px-3 pb-2 mb-2">
                <p className="text-[10px] font-bold text-cyan-600 uppercase tracking-widest">Jump To</p>
              </div>
              {jumpLinks.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => scrollToSection(link.id)}
                    className={`relative flex items-center gap-3 px-3 py-2 rounded-md text-xs transition-all text-left group z-10 ${
                      isActive 
                        ? "text-cyan-400 font-semibold" 
                        : "text-slate-400 font-medium hover:text-cyan-300"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="navIndicator"
                        className="absolute inset-0 bg-cyan-900/30 border border-cyan-900/30 rounded-md shadow-[0_0_10px_rgba(8,145,178,0.1)] -z-10"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    {!isActive && (
                      <div className="absolute inset-0 bg-cyan-900/20 rounded-md opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
                    )}
                    {link.icon}
                    {link.label}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* RIGHT SCROLLING CONTENT */}
          <main className="flex-1 overflow-y-auto p-6 lg:p-12 scroll-smooth bg-transparent selection:bg-cyan-900/50">
            <div className="max-w-3xl mx-auto space-y-12 pb-32">
              
              {/* 1. EXECUTIVE HEADER */}
              <ScanReveal id="exec-sec-overview" className="space-y-8 pt-2 relative">
                {/* Section Connector */}
                <div className="absolute -left-6 top-10 bottom-0 w-[1px] bg-cyan-900/30 hidden md:block"></div>
                
                <div className="flex flex-col items-center text-center space-y-6">
                  {/* Title & Subtitle */}
                  <div className="space-y-1 w-full border-b border-cyan-900/30 pb-6">
                    <h1 className="text-4xl font-bold tracking-tight text-white mb-2 uppercase">{EXPLORER_NAME}</h1>
                    <p className="text-sm font-semibold text-cyan-400 uppercase tracking-widest">Product Manager</p>
                    <p className="text-xs font-medium text-slate-400">MBA (Marketing & IT) — Completed</p>
                  </div>
                  
                  {/* Core Competencies */}
                  <div className="w-full border-b border-cyan-900/30 pb-6">
                    <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2 text-xs font-medium text-slate-300 uppercase tracking-widest">
                      <span>Product Strategy</span>
                      <span className="text-cyan-800">•</span>
                      <span>Analytics</span>
                      <span className="text-cyan-800">•</span>
                      <span>AI Products</span>
                      <span className="text-cyan-800">•</span>
                      <span>User Research</span>
                    </div>
                  </div>
                  
                  {/* Quick Actions (Row) */}
                  <div className="flex flex-wrap justify-center gap-3 w-full pb-2">
                    <ResourceLink href={RESOURCES.PROFILES.resume} className={buttonClass} icon={<File size={14}/>}>Resume</ResourceLink>
                    <ResourceLink href={RESOURCES.PROFILES.linkedin} className={buttonClass} icon={<User size={14}/>}>LinkedIn</ResourceLink>
                    <ResourceLink href={RESOURCES.PROFILES.github} className={buttonClass} icon={<Code size={14}/>}>GitHub</ResourceLink>
                    <ResourceLink href={RESOURCES.CONTACT.mailto} className={buttonClass} icon={<Mail size={14}/>}>Email</ResourceLink>
                    <button 
                      onClick={onExitExecMode} 
                      className={primaryButtonClass}
                    >
                      <Map size={14}/>
                      Explorer Mode
                    </button>
                  </div>
                </div>
                
                {/* EXECUTIVE SNAPSHOT (Telemetry) */}
                <div className="pt-4 border-t border-cyan-900/30">
                  <h3 className="text-[10px] font-bold text-cyan-600 uppercase tracking-widest mb-4">Telemetry At A Glance</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {[
                      { label: "Product Requirement Documents", value: LIVE_METRICS_DASHBOARD.prds },
                      { label: "Product Case Studies", value: LIVE_METRICS_DASHBOARD.caseStudies },
                      { label: "AI Products", value: LIVE_METRICS_DASHBOARD.aiProducts },
                      { label: "Product Analytics Project", value: LIVE_METRICS_DASHBOARD.productAnalytics },
                      { label: "User Research Study", value: LIVE_METRICS_DASHBOARD.userResearch },
                      { label: "Research Publication", value: LIVE_METRICS_DASHBOARD.publications },
                      { label: "Technologies", value: "25+" },
                      { label: "Internship", value: LIVE_METRICS_DASHBOARD.internships }
                    ].map((metric, i) => (
                      <div key={i} className="flex flex-col">
                        <CountUp end={metric.value} className="text-2xl font-bold text-white tracking-tight" />
                        <span className="text-[10px] font-semibold text-cyan-600 uppercase tracking-widest mt-1">{metric.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </ScanReveal>

              {/* 2. FEATURED PRODUCTS */}
              <ScanReveal id="exec-sec-featured-products" className="space-y-6 pt-4 border-t border-cyan-900/30 relative">
                {/* Section Connector */}
                <div className="absolute -left-6 top-10 bottom-0 w-[1px] bg-cyan-900/30 hidden md:block"></div>
                <div className="absolute -left-[27px] top-11 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)] hidden md:block"></div>

                <h2 className="text-xl font-bold tracking-tight text-white mb-4">Featured Products</h2>
                <div className="space-y-6">
                  {filteredProjects.map((project) => {
                    // Extract details dynamically from single source of truth ALL_PROJECTS
                    const projData = ALL_PROJECTS.find(p => p.id === project.id);
                    const tech = projData?.tech || "React, Next.js, AI Models";
                    const solution = projData?.solution || "Implemented a technical solution to address the core problem.";
                    const impact = projData?.impact || "Delivered measurable impact and efficiency.";

                    return (
                      <div key={project.id} className="group bg-slate-900/20 border border-cyan-900/30 rounded-xl p-0 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] hover:border-cyan-500/50 hover:bg-slate-900/40 transition-all duration-300 backdrop-blur-sm overflow-hidden interactive-card">
                        
                        {/* Header */}
                        <div className="border-b border-cyan-900/30 px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-900/30">
                          <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">{project.topic}</h3>
                          <div className="flex gap-2 shrink-0">
                            <span className="text-[10px] font-bold text-cyan-400 bg-cyan-900/30 px-2 py-1 rounded border border-cyan-800/50 uppercase tracking-widest">AI Product</span>
                          </div>
                        </div>

                        {/* Body Grid */}
                        <div className="px-6 py-4 grid md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-[10px] font-bold text-cyan-600 uppercase tracking-widest mb-1">Problem</h4>
                            <p className="text-sm text-slate-300">{project.overview}</p>
                          </div>
                          <div>
                            <h4 className="text-[10px] font-bold text-cyan-600 uppercase tracking-widest mb-1">Solution</h4>
                            <p className="text-sm text-slate-300">{solution}</p>
                          </div>
                          <div>
                            <h4 className="text-[10px] font-bold text-cyan-600 uppercase tracking-widest mb-1">Technology Stack</h4>
                            <p className="text-sm text-cyan-400 font-mono">{tech}</p>
                          </div>
                          <div>
                            <h4 className="text-[10px] font-bold text-cyan-600 uppercase tracking-widest mb-1">Impact</h4>
                            <p className="text-sm text-slate-300">{impact}</p>
                          </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="border-t border-cyan-900/30 px-6 py-4 grid gap-3 w-full bg-slate-900/30" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))' }}>
                          {projData?.resources && Object.entries(projData.resources).map(([key, url]) => {
                            if (!url) return null;
                            let label = "";
                            let icon = <ExternalLink size={14}/>;
                            let isPrimary = false;
                            switch(key) {
                              case 'liveDemo': label = "Live Demo"; icon = <Globe size={14}/>; isPrimary = true; break;
                              case 'github': label = "GitHub Repo"; icon = <Code size={14}/>; break;
                              case 'prd': label = "PRD"; icon = <FileText size={14}/>; isPrimary = true; break;
                              case 'caseStudy': label = "Case Study"; icon = <Briefcase size={14}/>; break;
                              case 'analytics': label = "Analytics"; icon = <BarChart2 size={14}/>; break;
                              case 'research': label = "Research"; icon = <Eye size={14}/>; break;
                              case 'publication': label = "Publication"; icon = <BookOpen size={14}/>; break;
                              case 'documentation': label = "Documentation"; icon = <FileText size={14}/>; break;
                              case 'demoVideo': label = "Demo Video"; icon = <Globe size={14}/>; break;
                            }
                            return (
                              <ResourceLink key={key} href={url} className={isPrimary ? primaryButtonClass : buttonClass} icon={icon}>
                                {label}
                              </ResourceLink>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScanReveal>

              {/* 3. CASE STUDY LIBRARY */}
              <ScanReveal id="exec-sec-case-studies" className="space-y-6 pt-8 border-t border-cyan-900/30 relative">
                <div className="absolute -left-6 top-10 bottom-0 w-[1px] bg-cyan-900/30 hidden md:block"></div>
                <div className="absolute -left-[27px] top-11 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)] hidden md:block"></div>
                <h2 className="text-xl font-bold tracking-tight text-white mb-6">Case Studies</h2>
                <div className="space-y-4">
                  {filteredCaseStudies.map((cs) => (
                    <div key={cs.id} className="bg-slate-900/20 border border-cyan-900/30 rounded-xl p-4 sm:p-6 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] hover:border-cyan-500/50 hover:bg-slate-900/40 transition-all duration-300 backdrop-blur-sm">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-base font-bold text-white mb-4 group-hover:text-cyan-300 transition-colors">{cs.topic}</h3>
                          <div className="grid sm:grid-cols-2 gap-6">
                            <div>
                              <p className="text-[10px] font-bold text-cyan-600 uppercase tracking-widest mb-1">Business Problem</p>
                              <p className="text-sm text-slate-300">{cs.overview}</p>
                            </div>
                            <div>
                              <p className="text-[10px] font-bold text-cyan-600 uppercase tracking-widest mb-1">Key Insight</p>
                              <p className="text-sm text-slate-300">{cs.decisions}</p>
                            </div>
                          </div>
                        </div>
                        <div className="shrink-0">
                          {cs.evidenceUrl && (
                            <ResourceLink href={cs.evidenceUrl} className={primaryButtonClass} icon={<Briefcase size={14}/>}>Open Case Study</ResourceLink>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScanReveal>

              {/* 4. PRD LIBRARY */}
              <ScanReveal id="exec-sec-prds" className="space-y-6 pt-8 border-t border-cyan-900/30 relative">
                <div className="absolute -left-6 top-10 bottom-0 w-[1px] bg-cyan-900/30 hidden md:block"></div>
                <div className="absolute -left-[27px] top-11 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)] hidden md:block"></div>
                <h2 className="text-xl font-bold tracking-tight text-white mb-6">Product Requirement Documents</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredPRDs.map((prd) => (
                    <div key={prd.id} className="bg-slate-900/20 border border-cyan-900/30 rounded-xl p-5 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] hover:border-cyan-500/50 hover:bg-slate-900/40 transition-all duration-300 flex flex-col backdrop-blur-sm group">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">{prd.title}</h3>
                        <span className="text-[10px] font-mono text-cyan-700 shrink-0 ml-2">{prd.readingTime}</span>
                      </div>
                      <p className="text-xs font-semibold text-cyan-500 mb-2">{prd.domain}</p>
                      <p className="text-sm text-slate-400 mb-6 line-clamp-2 flex-1">{prd.problem}</p>
                      <ResourceLink href={prd.prdUrl} className={primaryButtonClass} icon={<FileText size={14}/>}>Open PRD</ResourceLink>
                    </div>
                  ))}
                </div>
              </ScanReveal>

              {/* 5. PRODUCT ANALYTICS */}
              <ScanReveal id="exec-sec-analytics" className="space-y-6 pt-8 border-t border-cyan-900/30 relative">
                <div className="absolute -left-6 top-10 bottom-0 w-[1px] bg-cyan-900/30 hidden md:block"></div>
                <div className="absolute -left-[27px] top-11 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)] hidden md:block"></div>
                <h2 className="text-xl font-bold tracking-tight text-white mb-6">Product Analytics</h2>
                {filteredAnalytics.map((an) => (
                  <div key={an.id} className="bg-slate-900/20 border border-cyan-900/30 rounded-xl p-6 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] hover:border-cyan-500/50 hover:bg-slate-900/40 transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 backdrop-blur-sm group">
                    <div>
                      <h3 className="text-base font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors">{an.topic}</h3>
                      <p className="text-sm text-slate-400">{an.overview}</p>
                    </div>
                    {an.evidenceUrl && (
                      <ResourceLink href={an.evidenceUrl} className={primaryButtonClass} icon={<BarChart2 size={14}/>}>Open Analysis</ResourceLink>
                    )}
                  </div>
                ))}
              </ScanReveal>

              {/* 6. USER RESEARCH */}
              <ScanReveal id="exec-sec-user-research" className="space-y-6 pt-8 border-t border-cyan-900/30 relative">
                <div className="absolute -left-6 top-10 bottom-0 w-[1px] bg-cyan-900/30 hidden md:block"></div>
                <div className="absolute -left-[27px] top-11 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)] hidden md:block"></div>
                <h2 className="text-xl font-bold tracking-tight text-white mb-6">User Research</h2>
                {filteredResearch.map((ur) => (
                  <div key={ur.id} className="bg-slate-900/20 border border-cyan-900/30 rounded-xl p-6 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] hover:border-cyan-500/50 hover:bg-slate-900/40 transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 backdrop-blur-sm group">
                    <div>
                      <h3 className="text-base font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors">{ur.topic}</h3>
                      <p className="text-sm text-slate-400">{ur.overview}</p>
                    </div>
                    {ur.evidenceUrl && (
                      <ResourceLink href={ur.evidenceUrl} className={primaryButtonClass} icon={<Eye size={14}/>}>Open Research</ResourceLink>
                    )}
                  </div>
                ))}
              </ScanReveal>

              {/* 7. RESEARCH ARCHIVE */}
              <ScanReveal id="exec-sec-publication" className="space-y-6 pt-8 border-t border-cyan-900/30 relative">
                <div className="absolute -left-6 top-10 bottom-0 w-[1px] bg-cyan-900/30 hidden md:block"></div>
                <div className="absolute -left-[27px] top-11 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)] hidden md:block"></div>
                <h2 className="text-xl font-bold tracking-tight text-white mb-6">Research Publication</h2>
                {filteredPapers.map((paper) => (
                  <div key={paper.id} className="bg-slate-900/20 border border-cyan-900/30 rounded-xl p-6 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] hover:border-cyan-500/50 hover:bg-slate-900/40 transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 backdrop-blur-sm group">
                    <div>
                      <h3 className="text-base font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors">{paper.title}</h3>
                      <p className="text-sm text-cyan-600 font-mono">{paper.type}</p>
                    </div>
                    <ResourceLink href={paper.readUrl} className={primaryButtonClass} icon={<BookOpen size={14}/>}>Read Publication</ResourceLink>
                  </div>
                ))}
              </ScanReveal>

              {/* 8. PROFESSIONAL TIMELINE */}
              <ScanReveal id="exec-sec-timeline" className="space-y-6 pt-8 border-t border-cyan-900/30 relative">
                <div className="absolute -left-6 top-10 bottom-0 w-[1px] bg-cyan-900/30 hidden md:block"></div>
                <div className="absolute -left-[27px] top-11 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)] hidden md:block"></div>
                <h2 className="text-xl font-bold tracking-tight text-white mb-8">Timeline</h2>
                <div className="space-y-6 ml-2 border-l border-cyan-900/50">
                  {filteredTimeline.map((item, i) => (
                    <div key={i} className="relative pl-6">
                      <div className="absolute left-[-5px] top-1.5 w-2.5 h-2.5 rounded-full bg-slate-950 border-2 border-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
                      <div className="text-[10px] font-bold text-cyan-600 uppercase tracking-widest mb-1">{item.year}</div>
                      <h3 className="text-base font-bold text-white mb-1">{item.title}</h3>
                      <p className="text-sm font-semibold text-cyan-400 mb-2">{item.subtitle}</p>
                      {item.status && <div className="inline-block px-2 py-0.5 rounded-full bg-cyan-900/30 border border-cyan-800/50 text-xs font-semibold text-cyan-300 mb-2">{item.status}</div>}
                      {item.highlights && item.highlights.length > 0 && (
                        <div className="flex flex-col gap-1 mt-2">
                          {item.highlights.map((hl, j) => (
                            <span key={j} className="text-sm text-slate-400 flex items-center gap-2">
                              <span className="w-1 h-1 rounded-full bg-cyan-800"></span>
                              {hl}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScanReveal>

              {/* 9. SKILLS */}
              <ScanReveal id="exec-sec-skills" className="space-y-6 pt-8 border-t border-cyan-900/30 relative">
                <div className="absolute -left-6 top-10 bottom-0 w-[1px] bg-cyan-900/30 hidden md:block"></div>
                <div className="absolute -left-[27px] top-11 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)] hidden md:block"></div>
                <h2 className="text-xl font-bold tracking-tight text-white mb-8">Skills</h2>
                <div className="grid sm:grid-cols-2 gap-8">
                  {SKILL_CATEGORIES.map((category, idx) => (
                    <div key={idx}>
                      <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-3 border-b border-cyan-900/30 pb-2">{category.category}</h3>
                      <div className="flex flex-wrap gap-2">
                        {category.skills.map((skill, j) => (
                          <span key={j} className="text-xs font-medium px-2 py-1 rounded bg-slate-900/50 border border-cyan-900/20 text-slate-300">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </ScanReveal>

              {/* 10. CERTIFICATIONS */}
              <ScanReveal id="exec-sec-certifications" className="space-y-6 pt-8 border-t border-cyan-900/30 relative">
                <div className="absolute -left-6 top-10 bottom-0 w-[1px] bg-cyan-900/30 hidden md:block"></div>
                <div className="absolute -left-[27px] top-11 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)] hidden md:block"></div>
                <h2 className="text-xl font-bold tracking-tight text-white mb-8">Certifications</h2>
                <div className="space-y-8">
                  {Object.entries(groupedCerts).map(([category, certs]) => (
                    <div key={category}>
                      <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4 border-b border-cyan-900/30 pb-2">{category}</h3>
                      <div className="grid sm:grid-cols-2 gap-4">
                        {certs.map(cert => (
                          <div key={cert.id} className="bg-slate-900/20 border border-cyan-900/30 rounded-lg p-4 flex items-center justify-between hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(34,211,238,0.15)] hover:border-cyan-500/30 transition-all duration-300 backdrop-blur-sm group interactive-card">
                            <h4 className="text-sm font-medium text-slate-200">{cert.title}</h4>
                            <Award size={16} className="text-cyan-700" />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </ScanReveal>
              
              {/* 11. RESUME */}
              <ScanReveal id="exec-sec-resume" className="space-y-6 pt-8 border-t border-cyan-900/30">
                <h2 className="text-xl font-bold tracking-tight text-white mb-6 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
                  Resume
                </h2>
                <div className="bg-slate-900/20 border border-cyan-900/30 rounded-xl p-6 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] hover:border-cyan-500/30 transition-all duration-300 backdrop-blur-sm flex items-center justify-between group interactive-card">
                  <div>
                    <h3 className="text-base font-bold text-white mb-1">Download Resume</h3>
                    <p className="text-sm text-slate-400">PDF Document</p>
                  </div>
                  <ResourceLink href={RESOURCES.PROFILES.resume} className={primaryButtonClass} icon={<File size={14}/>}>View Resume</ResourceLink>
                </div>
              </ScanReveal>

              {/* 12. CONTACT */}
              <ScanReveal id="exec-sec-contact" className="space-y-6 pt-8 border-t border-cyan-900/30">
                <h2 className="text-xl font-bold tracking-tight text-white mb-6 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
                  Contact
                </h2>
                <div className="flex flex-wrap gap-3">
                  <ResourceLink href={RESOURCES.PROFILES.linkedin} className={buttonClass} icon={<User size={14}/>}>LinkedIn</ResourceLink>
                  <ResourceLink href={RESOURCES.PROFILES.github} className={buttonClass} icon={<Code size={14}/>}>GitHub</ResourceLink>
                  <ResourceLink href={RESOURCES.PROFILES.portfolio} className={buttonClass} icon={<Globe size={14}/>}>Portfolio Database</ResourceLink>
                  <ResourceLink href={RESOURCES.PROFILES.website} className={buttonClass} icon={<Globe size={14}/>}>Current Website</ResourceLink>
                  <ResourceLink href={RESOURCES.CONTACT.mailto} className={buttonClass} icon={<Mail size={14}/>}>Email</ResourceLink>
                  <ResourceLink href={RESOURCES.CONTACT.phone} className={buttonClass} icon={<Phone size={14}/>}>Phone</ResourceLink>
                </div>
              </ScanReveal>

            </div>
          </main>
        </div>
      </div>
    </motion.div>
    </>
  );
}
