"use client";

import { useState, useRef, Suspense, useCallback, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ScrollControls, useScroll } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { motion, AnimatePresence } from "framer-motion";
import { qualitySettings } from "../lib/qualityTier";
import { triggerHaptic } from "../lib/haptics";

// World Components
import CameraRig from "./CameraRig";
import EnvironmentSetup from "./Environment";
import AudioController from "./AudioController";
import Spacecraft from "./world/Spacecraft";
import PlanetCuriosity from "./world/PlanetCuriosity";
import AsteroidSlalom from "./world/AsteroidSlalom";
import PlanetLearning from "./world/PlanetLearning";
import WormholeTransition from "./world/WormholeTransition";
import BuilderStation from "./world/BuilderStation";
import DysonSphere from "./world/DysonSphere";
import StarfieldAndNebula from "./world/StarfieldAndNebula";

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

// Types & Audio
import { CuriosityStory, ExperienceNode, ProductThinkingNode, PortfolioProject, PRDVaultItem } from "../types/mission";
import { PORTFOLIO_PROJECTS, PRD_VAULT } from "../data/missionData";
import { audioEngine } from "../lib/audioEngine";

type OperatingMode = "MISSION" | "TRANSITIONING_TO_EXEC" | "EXEC" | "TRANSITIONING_TO_MISSION";

import { useMissionStore, ChapterId } from "../store/missionStore";

// Lightweight bridge to sync WebGL scroll offset with HTML DOM state without 60fps thrashing
function ScrollTracker({ onProgressChange }: { onProgressChange: (p: number) => void }) {
  const scroll = useScroll();
  const lastReported = useRef(-1);
  const setCurrentChapter = useMissionStore(state => state.setCurrentChapter);

  useFrame(() => {
    const current = scroll.offset;
    // Throttle React state updates to when progress changes meaningfully (>0.5%)
    if (Math.abs(current - lastReported.current) > 0.005) {
      lastReported.current = current;
      onProgressChange(current);
      
      // Update global chapter state
      let chapter: ChapterId = "LAUNCHPAD";
      if (current >= 0.08 && current < 0.26) chapter = "PLANET_CURIOSITY";
      else if (current >= 0.26 && current < 0.40) chapter = "ASTEROID_SLALOM";
      else if (current >= 0.40 && current < 0.62) chapter = "ORBITAL_NEXUS";
      else if (current >= 0.62 && current < 0.72) chapter = "WORMHOLE";
      else if (current >= 0.72 && current < 0.88) chapter = "SYNTHESIS_V";
      else if (current >= 0.88) chapter = "DYSON_SPHERE";
      
      const currentChapter = useMissionStore.getState().currentChapter;
      if (currentChapter !== chapter) {
        setCurrentChapter(chapter);
      }
    }
  });

  return null;
}

// 1-Click Sector Teleporter Bridge
function ScrollTeleporter({ targetProgress, onComplete }: { targetProgress: number | null; onComplete: () => void }) {
  const scroll = useScroll();
  
  useEffect(() => {
    if (targetProgress !== null && scroll && scroll.el) {
      const targetTop = targetProgress * (scroll.el.scrollHeight - scroll.el.clientHeight);
      scroll.el.scrollTo({ top: targetTop, behavior: "smooth" });
      onComplete();
    }
  }, [targetProgress, scroll, onComplete]);

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
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [teleportTarget, setTeleportTarget] = useState<number | null>(null);
  
  const markNodeVisited = useMissionStore(state => state.markNodeVisited);
  
  // Dual Operating System State Machine
  const [operatingMode, setOperatingMode] = useState<OperatingMode>("MISSION");
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
      <TelemetryHeader progress={progress} />
      
      <ExecFastTrackHUD 
        onTeleport={(target) => setTeleportTarget(target)} 
        onToggleAudio={handleToggleAudio} 
        onToggleExecutiveMode={handleToggleExecutiveMode}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        isAudioMuted={isMuted} 
        isExecutiveMode={isExecutiveMode}
      />
      
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
      
      <AIMissionLog 
        progress={progress} 
        operatingMode={operatingMode}
        searchQuery={execSearchQuery}
      />
      
      <FinaleContactDock 
        progress={progress} 
      />

      {/* --- UNIVERSAL INTERACTIVE NODE MODAL (LAW 8 READ FOCUS) --- */}
      <UniversalNodeModal 
        node={selectedStory || selectedExperience || selectedProductThinking || selectedLab} 
        onClose={handleCloseModals} 
      />

      {selectedPRD && (
        <PRDSpecTablet 
          prd={selectedPRD} 
          onClose={handleCloseModals} 
        />
      )}

      {/* First-Time Visit Onboarding */}
      <OnboardingOverlay />

      {/* AAA UX Enhancements */}
      {!isExecutiveMode && (
        <>
          <LevelProgressionOverlay />
          <MissionScanner />
          <MissionObjectivePanel />
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
        }}
        dpr={qualitySettings.dpr}
        frameloop={isModalOpen ? "never" : "always"}
      >
        <Suspense fallback={null}>
          <ScrollControls pages={16} damping={0.25}>
            <ScrollTracker onProgressChange={setProgress} />
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
