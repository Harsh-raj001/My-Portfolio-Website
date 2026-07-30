/**
 * haptics.ts — Lightweight Haptic Feedback Utility for mobile interactions.
 * 
 * Safely wraps the Web Vibration API to provide subtle tactile sensations on supported
 * mobile devices (primarily Android Chrome; iOS Safari ignores it silently).
 * Automatically respects prefers-reduced-motion settings.
 */

export type HapticPreset = "light" | "medium" | "selection" | "success";

const PRESETS: Record<HapticPreset, number | number[]> = {
  light: 10,
  medium: 20,
  selection: 15,
  success: [10, 30, 10],
};

export function triggerHaptic(preset: HapticPreset): void {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return;
  }

  // 1. Check for Vibration API support
  if (!navigator.vibrate) {
    return;
  }

  // 2. Respect prefers-reduced-motion settings
  try {
    const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (prefersReduced) {
      return;
    }
  } catch {
    // Media query parsing failed or unsupported; continue safely
  }

  // 3. Fire vibration preset wrapped in try/catch to fail silently on restricted browser contexts
  try {
    const pattern = PRESETS[preset];
    navigator.vibrate(pattern);
  } catch {
    // Fail silently (e.g. security block or iframe permissions)
  }
}
