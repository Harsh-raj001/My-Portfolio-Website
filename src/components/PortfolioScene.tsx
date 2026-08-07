"use client";

import React, { useState, useRef, Suspense, useCallback, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ScrollControls, useScroll, Html } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { motion, AnimatePresence } from "framer-motion";
import { qualitySettings } from "../lib/qualityTier";
import { triggerHaptic } from "../lib/haptics";

// World Components
import CameraRig from "./CameraRig";
import EnvironmentSetup from "./Environment";
import AudioController from "./AudioController";

const Spacecraft = React.lazy(() => import("./world/Spacecraft"));
const PlanetCuriosity = React.lazy(() => import("./world/PlanetCuriosity"));
const AsteroidSlalom = React.lazy(() => import("./world/AsteroidSlalom"));
const PlanetLearning = React.lazy(() => import("./world/PlanetLearning"));
const WormholeTransition = React.lazy(() => import("./world/WormholeTransition"));
const BuilderStation = React.lazy(() => import("./world/BuilderStation"));
const DysonSphere = React.lazy(() => import("./world/DysonSphere"));
const StarfieldAndNebula = React.lazy(() => import("./world/StarfieldAndNebula"));

// HUD & Modal Components
import HUD from "./HUD";
import TelemetryHeader from "./hud/TelemetryHeader";
import AIMissionLog from "./hud/AIMissionLog";
import UniversalNodeModal from "./hud/UniversalNodeModal";
import FinaleContactDock from "./hud/FinaleContactDock";
import ExecFastTrackHUD from "./hud/ExecFastTrackHUD";
import PRDSpecTablet from "./hud/PRDSpecTablet";
import ExecCommandCenter from "./exec/ExecCommandCenter";
import ExecBootSequence from "./exec/ExecBootSequence";
import ExplorerBootSequence from "./exec/ExplorerBootSequence";
import CommandPalette from "./hud/CommandPalette";
import OnboardingOverlay from "./hud/OnboardingOverlay";
import MissionScanner from "./hud/MissionScanner";
import LevelProgressionOverlay from "./hud/LevelProgressionOverlay";
import MissionObjectivePanel from "./hud/MissionObjectivePanel";
import MissionCompleteSequence from "./hud/MissionCompleteSequence";
import AIScannerHUDControl from "./hud/AIScannerHUDControl";
import ProgressiveGuide from "./hud/ProgressiveGuide";

import InteractionHintToast from "./hud/InteractionHintToast";
import MobileNavMenu from "./hud/MobileNavMenu";
import { SyncDebugger } from "./SyncDebugger";
// Types & Audio
import { CuriosityStory, ExperienceNode, ProductThinkingNode, PortfolioProject, PRDVaultItem } from "../types/mission";
import { PORTFOLIO_PROJECTS, PRD_VAULT } from "../data/missionData";
import { audioEngine } from "../lib/audioEngine";

type OperatingMode = "MISSION" | "TRANSITIONING_TO_EXEC" | "EXEC" | "TRANSITIONING_TO_MISSION";

import { useMissionStore, ChapterId } from "../store/missionStore";

function LoaderFallback() {
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center pointer-events-none select-none">
        <div className="w-8 h-8 rounded-full border border-cyan-400/50 flex items-center justify-center relative">
          <div className="absolute inset-0 rounded-full bg-cyan-400/20 animate-ping" />
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        </div>
        <div className="mt-4 text-xs font-mono text-cyan-500 uppercase tracking-widest text-center whitespace-nowrap drop-shadow-[0_0_8px_rgba(0,240,255,0.5)]">
          Live Telemetry Stream<br/>
          <span className="text-slate-400 text-xs animate-pulse">Establishing Connection...</span>
        </div>
      </div>
    </Html>
  );
}

// Lightweight bridge to sync WebGL scroll offset with HTML DOM state without 60fps thrashing
function ScrollTracker() {
  const scroll = useScroll();
  const lastReported = useRef(-1);
  const lastOffset = useRef(0);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
  const setCurrentChapter = useMissionStore(state => state.setCurrentChapter);
  const setProgress = useMissionStore(state => state.setProgress);
  const setScrolling = useMissionStore(state => state.setScrolling);
  const setHasScrolled = useMissionStore(state => state.setHasScrolled);
  const setHasOpenedScanner = useMissionStore(state => state.setHasOpenedScanner);
  const isScannerActive = useMissionStore(state => state.isScannerActive);

  // Track if scanner is opened
  useEffect(() => {
    if (isScannerActive) {
      setHasOpenedScanner(true);
    }
  }, [isScannerActive, setHasOpenedScanner]);

  useFrame(() => {
    const current = scroll.offset;
    
    // Detect scrolling activity
    if (current !== lastOffset.current) {
      lastOffset.current = current;
      setScrolling(true);
      
      if (current > 0.001) {
        setHasScrolled(true);
      }

      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      scrollTimeout.current = setTimeout(() => {
        setScrolling(false);
      }, 250);
    }

    // Throttle React state updates to when progress changes meaningfully (>0.5%)
    if (Math.abs(current - lastReported.current) > 0.002) {
      lastReported.current = current;
      setProgress(current);
      
      // Update global chapter state
      let chapter: ChapterId = "LAUNCHPAD";
      if (current >= 0.08 && current < 0.26) chapter = "PLANET_CURIOSITY";
      else if (current >= 0.26 && current < 0.40) chapter = "ASTEROID_SLALOM";
      else if (current >= 0.40 && current < 0.62) chapter = "SYNTHESIS_V";
      else if (current >= 0.62 && current < 0.72) chapter = "WORMHOLE";
      else if (current >= 0.72 && current < 0.88) chapter = "ORBITAL_NEXUS";
      else if (current >= 0.88) chapter = "DYSON_SPHERE";
      
      const currentChapter = useMissionStore.getState().currentChapter;
      if (currentChapter !== chapter) {
        setCurrentChapter(chapter);
      }
    }
  });

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    };
  }, []);

  return null;
}

// 1-Click Sector Teleporter Bridge
function ScrollTeleporter({ targetProgress, onComplete }: { targetProgress: number | null; onComplete: () => void }) {
  const scroll = useScroll();
  const setIsTeleporting = useMissionStore(state => state.setIsTeleporting);
  
  useEffect(() => {
    if (targetProgress !== null && scroll && scroll.el) {
      setIsTeleporting(true);
      const targetTop = targetProgress * (scroll.el.scrollHeight - scroll.el.clientHeight);
      scroll.el.scrollTo({ top: targetTop, behavior: "auto" });
      
      // Briefly hold teleporting state so camera snaps instantly
      setTimeout(() => {
        setIsTeleporting(false);
        onComplete();
      }, 100);
    }
  }, [targetProgress, scroll, onComplete, setIsTeleporting]);

  return null;
}

function GlobalIdleTracker() {
  const setIdle = useMissionStore(state => state.setIdle);
  
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const resetTimer = () => {
      setIdle(false);
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIdle(true);
      }, 10000); // 10 seconds of inactivity
    };

    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("scroll", resetTimer);
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("click", resetTimer);
    window.addEventListener("wheel", resetTimer);
    
    resetTimer(); // Start initially
    
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("scroll", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("click", resetTimer);
      window.removeEventListener("wheel", resetTimer);
    };
  }, [setIdle]);
  
  return null;
}

export default function PortfolioScene() {
  const [isMuted, setIsMuted] = useState(true);
  const [teleportTarget, setTeleportTarget] = useState<number | null>(null);
  
  const markNodeVisited = useMissionStore(state => state.markNodeVisited);
  
  // Dual Operating System State Machine
  const [operatingMode, setOperatingMode] = useState<OperatingMode>("TRANSITIONING_TO_MISSION");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const hasVisited = localStorage.getItem("odyssey_has_visited");
    if (hasVisited) {
      setOperatingMode((localStorage.getItem("odyssey_last_mode") as OperatingMode) || "MISSION");
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (operatingMode === "MISSION" || operatingMode === "EXEC") {
        localStorage.setItem("odyssey_last_mode", operatingMode);
        localStorage.setItem("odyssey_has_visited", "true");
      }
    }
  }, [operatingMode]);
  const [execSearchQuery] = useState("");
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);


  // Modal selection states
  const [selectedStory, setSelectedStory] = useState<CuriosityStory | null>(null);
  const [selectedExperience, setSelectedExperience] = useState<ExperienceNode | null>(null);
  const [selectedProductThinking, setSelectedProductThinking] = useState<ProductThinkingNode | null>(null);
  const [selectedLab, setSelectedLab] = useState<PortfolioProject | null>(null);
  const [selectedPRD, setSelectedPRD] = useState<PRDVaultItem | null>(null);

  const isExecutiveMode = operatingMode === "EXEC" || operatingMode === "TRANSITIONING_TO_EXEC";
  const isModalOpen = !!(selectedStory || selectedExperience || selectedProductThinking || selectedLab || selectedPRD);
  const isTeleporting = useMissionStore(state => state.isTeleporting);

  // Handlers with sound feedback & mobile haptics
  const handleSelectStory = useCallback((story: CuriosityStory) => {
    audioEngine.playModalOpen();
    triggerHaptic("medium");
    markNodeVisited(story.id);
    setSelectedStory(story);
  }, [markNodeVisited]);

  const handleSelectExperience = useCallback((exp: ExperienceNode) => {
    audioEngine.playModalOpen();
    triggerHaptic("medium");
    markNodeVisited(exp.id);
    setSelectedExperience(exp);
  }, [markNodeVisited]);

  const handleSelectProductThinking = useCallback((node: ProductThinkingNode) => {
    audioEngine.playModalOpen();
    triggerHaptic("medium");
    markNodeVisited(node.id);
    setSelectedProductThinking(node);
  }, [markNodeVisited]);

  const handleSelectLab = useCallback((lab: PortfolioProject) => {
    audioEngine.playModalOpen();
    triggerHaptic("medium");
    markNodeVisited(lab.id);
    setSelectedLab(lab);
  }, [markNodeVisited]);



  const handleCloseModals = useCallback(() => {
    triggerHaptic("light");
    setSelectedStory(null);
    setSelectedExperience(null);
    setSelectedProductThinking(null);
    setSelectedLab(null);
    setSelectedPRD(null);
    if (operatingMode === "EXEC") {
      setOperatingMode("MISSION");
    }
  }, [operatingMode]);

  const handleToggleAudio = useCallback(() => {
    const muted = audioEngine.toggleMute();
    setIsMuted(muted);
  }, []);

  // 🚀 DUAL OS MODE TRANSITION CHOREOGRAPHY (800ms - 1000ms AAA Transformation)
  const handleToggleExecutiveMode = useCallback(() => {
    if (operatingMode === "MISSION" || operatingMode === "TRANSITIONING_TO_MISSION") {
      audioEngine.playKlaxon();
      audioEngine.playCrystallinePing(880);
      setOperatingMode("TRANSITIONING_TO_EXEC");
    } else {
      audioEngine.playCrystallinePing(440);
      setOperatingMode("TRANSITIONING_TO_MISSION");
      setTimeout(() => {
        setOperatingMode("MISSION");
        audioEngine.playHoverPing();
      }, 700);
    }
  }, [operatingMode]);

  // Global keyboard shortcut to open Command Palette (Ctrl+K / Cmd+K or '/')
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // If typing in input/textarea, ignore (unless escape)
      if (document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "TEXTAREA") {
        return;
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
        audioEngine.playHoverPing();
      } else if (e.key === "/" && operatingMode !== "EXEC") {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
        audioEngine.playHoverPing();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [operatingMode]);

  // Deep Link & URL Parameter Router (Hash-based section jumping & mode switching)
  useEffect(() => {
    const handleDeepLink = () => {
      const hash = window.location.hash.toLowerCase().trim();
      const params = new URLSearchParams(window.location.search);
      const modeParam = params.get("mode")?.toLowerCase();

      // 1. Operating Mode switching via URL (?mode=exec or #exec / #recruiter)
      if (modeParam === "exec" || modeParam === "recruiter" || hash === "#exec" || hash === "#recruiter") {
        setOperatingMode("EXEC");
        return;
      } else if (modeParam === "mission" || hash === "#mission") {
        setOperatingMode("MISSION");
        return;
      }

      // 2. Section or Project Deep Linking
      if (hash.startsWith("#projects/") || hash.startsWith("#lab-") || hash === "#projects") {
        const labId = hash.replace("#projects/", "").replace("#lab-", "").replace("#projects", "");
        if (labId) {
          const matchedLab = PORTFOLIO_PROJECTS.find((l) => l.id.toLowerCase() === labId || l.topic.toLowerCase().includes(labId));
          if (matchedLab) {
            setSelectedLab(matchedLab);
          }
        }
        if (operatingMode === "MISSION") {
          setTeleportTarget(0.72);
        } else {
          setTimeout(() => document.getElementById("exec-sec-projects")?.scrollIntoView({ behavior: "smooth" }), 200);
        }
      } else if (hash.startsWith("#prds/") || hash === "#prds") {
        const prdId = hash.replace("#prds/", "").replace("#prds", "");
        if (prdId) {
          const matchPRD = PRD_VAULT.find((l) => l.id.toLowerCase() === prdId || l.title.toLowerCase().includes(prdId));
          if (matchPRD) {
            setSelectedPRD(matchPRD);
          }
        }
        if (operatingMode === "MISSION") {
          setTeleportTarget(0.72);
        } else {
          setTimeout(() => document.getElementById("exec-sec-prds")?.scrollIntoView({ behavior: "smooth" }), 200);
        }
      } else if (hash.startsWith("#research") || hash.startsWith("#paper-")) {
        if (operatingMode === "MISSION") {
          setTeleportTarget(0.40);
        } else {
          setTimeout(() => document.getElementById("exec-sec-research")?.scrollIntoView({ behavior: "smooth" }), 200);
        }
      } else if (hash === "#certifications" || hash === "#certs") {
        if (operatingMode === "MISSION") {
          setTeleportTarget(0.50);
        } else {
          setTimeout(() => document.getElementById("exec-sec-certifications")?.scrollIntoView({ behavior: "smooth" }), 200);
        }
      } else if (hash === "#contact" || hash === "#email" || hash === "#liaison" || hash === "#finale") {
        if (operatingMode === "MISSION") {
          setTeleportTarget(0.95);
        } else {
          setTimeout(() => document.getElementById("exec-sec-contact")?.scrollIntoView({ behavior: "smooth" }), 200);
        }
      } else if (hash === "#timeline" || hash === "#experience") {
        if (operatingMode === "MISSION") {
          setTeleportTarget(0.20);
        } else {
          setTimeout(() => document.getElementById("exec-sec-timeline")?.scrollIntoView({ behavior: "smooth" }), 200);
        }
      }
    };

    handleDeepLink();

    window.addEventListener("hashchange", handleDeepLink);
    window.addEventListener("popstate", handleDeepLink);
    return () => {
      window.removeEventListener("hashchange", handleDeepLink);
      window.removeEventListener("popstate", handleDeepLink);
    };
  }, [operatingMode]);

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden select-none">
      {/* --- DOM HUD OVERLAYS (OUTSIDE WEBGL CANVAS) --- */}
      
      {/* MOBILE FLEX HUD WRAPPER */}
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 z-40 md:block md:p-0 md:static overflow-hidden box-border">
        
        {/* TOP MOBILE HUD */}
        <div className="flex flex-col gap-2.5 md:contents items-start w-full">
          {!isExecutiveMode && <LevelProgressionOverlay />}
          
          <div className="flex items-center justify-between w-full pointer-events-none md:contents gap-2">
            <MobileNavMenu />
            <ExecFastTrackHUD 
              onTeleport={(target) => setTeleportTarget(target)} 
              onToggleAudio={handleToggleAudio} 
              onToggleExecutiveMode={handleToggleExecutiveMode}
              onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
              isAudioMuted={isMuted} 
              isExecutiveMode={isExecutiveMode}
            />
          </div>

          <TelemetryHeader />
          {!isExecutiveMode && <MissionObjectivePanel />}
        </div>

        {/* BOTTOM MOBILE HUD */}
        <div className="flex flex-col gap-3 justify-end items-end md:contents">
          {!isExecutiveMode && (
            <>
              <ProgressiveGuide />
              <InteractionHintToast />
            </>
          )}
          <AIMissionLog 
            operatingMode={operatingMode}
            searchQuery={execSearchQuery}
          />
          {!isExecutiveMode && <AIScannerHUDControl />}
        </div>
      </div>

      {/* --- GLOBAL OVERLAYS & MODALS --- */}
      <CommandPalette 
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectSection={(sectionId) => {
          setIsCommandPaletteOpen(false);
          if (sectionId === "exec" && operatingMode !== "EXEC") {
            handleToggleExecutiveMode();
          } else if (operatingMode !== "EXEC") {
            setOperatingMode("EXEC");
            setTimeout(() => document.getElementById(`exec-sec-${sectionId}`)?.scrollIntoView({ behavior: "smooth" }), 300);
          } else {
            document.getElementById(`exec-sec-${sectionId}`)?.scrollIntoView({ behavior: "smooth" });
          }
        }}
      />
      
      <FinaleContactDock />

      {/* --- UNIVERSAL INTERACTIVE NODE MODAL (LAW 8 READ FOCUS) --- */}
      <AnimatePresence>
        {(selectedStory || selectedExperience || selectedProductThinking || selectedLab) && (
          <UniversalNodeModal 
            key="universal-node-modal"
            node={selectedStory || selectedExperience || selectedProductThinking || selectedLab} 
            onClose={handleCloseModals} 
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedPRD && (
          <PRDSpecTablet 
            key="prd-spec-tablet"
            prd={selectedPRD} 
            onClose={handleCloseModals} 
          />
        )}
      </AnimatePresence>

      {/* First-Time Visit Onboarding */}
      <OnboardingOverlay />

      {!isExecutiveMode && (
        <>
          <MissionScanner />
          <GlobalIdleTracker />
          <MissionCompleteSequence onEnterExecMode={() => {
            setOperatingMode("TRANSITIONING_TO_EXEC");
          }} onReExplore={() => {
            setTeleportTarget(0);
          }} />
        </>
      )}

      {/* 🚀 800ms-1000ms OS TRANSITION CINEMATIC SCREEN */}
      <AnimatePresence>
        {operatingMode === "TRANSITIONING_TO_EXEC" && (
          <ExecBootSequence 
            onComplete={() => {
              setOperatingMode("EXEC");
              audioEngine.playModalOpen();
            }} 
          />
        )}
        
        {operatingMode === "TRANSITIONING_TO_MISSION" && (
          <ExplorerBootSequence 
            onComplete={() => {
              setOperatingMode("MISSION");
              audioEngine.playModalOpen();
            }} 
          />
        )}
      </AnimatePresence>

      {/* 🚀 EXEC MODE COMMAND CENTER (LINEAR / STRIPE DOCS WORKSPACE) */}
      <AnimatePresence>
        {operatingMode === "EXEC" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50"
          >
            <ExecCommandCenter
              onExitExecMode={() => setOperatingMode("TRANSITIONING_TO_MISSION")}
            />
          </motion.div>
        )}
      </AnimatePresence>



      {/* --- 3D CINEMATIC WEBGL CANVAS --- */}
      <Canvas
        camera={{ position: [0, 2, 15], fov: 45, near: 0.1, far: 800 }}
        gl={{ 
          antialias: qualitySettings.antialias, 
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
          logarithmicDepthBuffer: qualitySettings.tier === "LOW",
        }}
        dpr={qualitySettings.dpr}
        frameloop={isModalOpen ? "never" : "always"}
      >
        <Suspense fallback={<LoaderFallback />}>
          <ScrollControls 
            pages={16} 
            damping={isTeleporting ? 0 : (typeof navigator !== 'undefined' && navigator.maxTouchPoints > 1 ? 0.08 : 0.25)}
            style={{ 
              touchAction: 'pan-y', 
              pointerEvents: 'auto', 
              WebkitOverflowScrolling: 'touch', 
              overscrollBehaviorY: 'contain' 
            }}
          >
            {process.env.NODE_ENV === 'development' && <SyncDebugger />}
            <ScrollTracker />
            <ScrollTeleporter targetProgress={teleportTarget} onComplete={() => setTeleportTarget(null)} />

            {/* Camera Drone & Flight Dynamics */}
            <CameraRig />
            
            {/* Unreal Engine 5 Style Lighting, Fog & Atmosphere */}
            <EnvironmentSetup />
            
            {/* Web Audio Synthesizer Bridge */}
            <AudioController />

            {/* Career Spacecraft Explorer */}
            <Spacecraft />

            {/* Act I: Undergraduate Planet of Curiosity (Veridian Prime) */}
            <PlanetCuriosity onSelectStory={handleSelectStory} />

            {/* Act I.5: Kaos Strait Asteroid Slalom (Axioms & Philosophy) */}
            <AsteroidSlalom onSelectExperience={handleSelectExperience} />

            {/* Act II: Orbital Builder Station (AI Products) */}
            <BuilderStation onSelectLab={handleSelectLab} />

            {/* Transition 2: High-Speed Wormhole Warp */}
            <WormholeTransition />

            {/* Act III: Cybernetic Learning Belt (Synthesis-V - Case Studies) */}
            <PlanetLearning onSelectNode={handleSelectProductThinking} />

            {/* Finale: Unfinished Dyson Sphere Megastructure */}
            <DysonSphere />

            {/* Background 2,000 Starfield & Nebulae */}
            <StarfieldAndNebula />

            {/* HTML Storytelling Text Overlays synchronized with camera */}
            <HUD />
          </ScrollControls>

          {/* Post-Processing Bloom & Vignette (gated by quality tier) */}
          {qualitySettings.enableBloom && (
            <EffectComposer>
              <Bloom 
                mipmapBlur 
                intensity={qualitySettings.bloomIntensity} 
                luminanceThreshold={0.8} 
                radius={0.5} 
              />
              <Vignette 
                offset={0.3} 
                darkness={0.55} 
              />
            </EffectComposer>
          )}
        </Suspense>
      </Canvas>
    </div>
  );
}
