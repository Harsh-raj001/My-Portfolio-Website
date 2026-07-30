/**
 * qualityTier.ts — Adaptive Quality System for Project Odyssey
 * 
 * Detects device capability and exports a settings object that every
 * rendering component uses to scale visual fidelity automatically.
 * 
 * Detection runs once at module load time (not per-frame).
 */

export type QualityTier = "LOW" | "MEDIUM" | "HIGH";

export interface QualitySettings {
  tier: QualityTier;
  dpr: [number, number];
  enableBloom: boolean;
  bloomIntensity: number;
  shadowMapSize: number;       // 0 = disabled
  enableShadows: boolean;
  sparkleMultiplier: number;   // 0.0 – 1.0
  particleMultiplier: number;  // 0.0 – 1.0
  droneCount: number;
  plasmaBeamCount: number;
  antialias: boolean;
  enableSparkles: boolean;
  reducedMotion: boolean;
}

function detectTier(): QualityTier {
  if (typeof window === "undefined") return "MEDIUM"; // SSR fallback

  // 1. prefers-reduced-motion always forces LOW
  const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  if (prefersReduced) return "LOW";

  // 2. Mobile / tablet detection
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
  const isTouch = navigator.maxTouchPoints > 1;
  const isSmallScreen = window.innerWidth < 768;
  
  if (isMobile || (isTouch && isSmallScreen)) return "LOW";

  // 3. Hardware concurrency check
  const cores = navigator.hardwareConcurrency || 4;
  if (cores <= 4) return "LOW";
  if (cores <= 8) return "MEDIUM";

  // 4. Device pixel ratio as a proxy for GPU power
  const dpr = window.devicePixelRatio || 1;
  if (dpr <= 1) return "MEDIUM";

  return "HIGH";
}

function buildSettings(tier: QualityTier): QualitySettings {
  const reducedMotion = typeof window !== "undefined" 
    ? window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false
    : false;

  switch (tier) {
    case "LOW":
      return {
        tier,
        dpr: [1, 1],
        enableBloom: false,
        bloomIntensity: 0,
        shadowMapSize: 0,
        enableShadows: false,
        sparkleMultiplier: 0,
        particleMultiplier: 0.25,
        droneCount: 100,
        plasmaBeamCount: 6,
        antialias: false,
        enableSparkles: false,
        reducedMotion,
      };
    case "MEDIUM":
      return {
        tier,
        dpr: [1, 1.5],
        enableBloom: true,
        bloomIntensity: 0.35,
        shadowMapSize: 512,
        enableShadows: true,
        sparkleMultiplier: 0.5,
        particleMultiplier: 0.5,
        droneCount: 250,
        plasmaBeamCount: 12,
        antialias: true,
        enableSparkles: true,
        reducedMotion,
      };
    case "HIGH":
    default:
      return {
        tier,
        dpr: [1, 2],
        enableBloom: true,
        bloomIntensity: 0.65,
        shadowMapSize: 2048,
        enableShadows: true,
        sparkleMultiplier: 1.0,
        particleMultiplier: 1.0,
        droneCount: 500,
        plasmaBeamCount: 18,
        antialias: true,
        enableSparkles: true,
        reducedMotion,
      };
  }
}

export const qualityTier: QualityTier = detectTier();
export const qualitySettings: QualitySettings = buildSettings(qualityTier);

/** Lightweight mobile flag — use for UI layout decisions (tap targets, HUD sizing, etc.) */
export const isMobile: boolean = typeof window !== "undefined"
  ? /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    || (navigator.maxTouchPoints > 1 && window.innerWidth < 768)
  : false;
