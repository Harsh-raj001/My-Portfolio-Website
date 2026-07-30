/* eslint-disable react-hooks/immutability */
"use client";


import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useScroll, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { qualitySettings } from "../lib/qualityTier";

export default function EnvironmentSetup() {
  const scroll = useScroll();
  const { scene } = useThree();
  const keyLightRef = useRef<THREE.DirectionalLight>(null);
  const fillLightRef = useRef<THREE.HemisphereLight>(null);

  // AAA Color palette tokens (mutated in-place to prevent garbage collection)
  const colorWarm = useMemo(() => new THREE.Color("#FF9E4A"), []); // Act I: Golden Sunset
  const colorCool = useMemo(() => new THREE.Color("#00F0FF"), []); // Act II: Cyber Cyan / Teal
  const colorStellar = useMemo(() => new THREE.Color("#F59E0B"), []); // Act III: Dyson Gold
  
  const bgWarm = useMemo(() => new THREE.Color("#140C08"), []);
  const bgCool = useMemo(() => new THREE.Color("#0A1128"), []);
  const bgStellar = useMemo(() => new THREE.Color("#050505"), []);

  const currentColor = useMemo(() => new THREE.Color("#FF9E4A"), []);
  const currentBg = useMemo(() => new THREE.Color("#140C08"), []);

  // Initialize atmospheric fog
  if (!scene.fog) {
    scene.fog = new THREE.FogExp2("#140C08", 0.015);
  }

  useFrame(() => {
    const progress = scroll.offset;

    // 3-Act Color Lerp Logic
    if (progress < 0.40) {
      // Act I -> Act II transition
      const subP = Math.min(1, Math.max(0, (progress - 0.10) / 0.30));
      currentColor.copy(colorWarm).lerp(colorCool, subP);
      currentBg.copy(bgWarm).lerp(bgCool, subP);
      if (scene.fog instanceof THREE.FogExp2) {
        scene.fog.density = 0.015 - subP * 0.005; // Clearer in deep space
      }
    } else if (progress < 0.75) {
      // Act II Cybernetic belt
      currentColor.copy(colorCool);
      currentBg.copy(bgCool);
      if (scene.fog instanceof THREE.FogExp2) {
        scene.fog.density = 0.010;
      }
    } else {
      // Act III -> Finale transition to Dyson Gold & Minimal Void
      const subP = Math.min(1, Math.max(0, (progress - 0.75) / 0.20));
      currentColor.copy(colorCool).lerp(colorStellar, subP);
      currentBg.copy(bgCool).lerp(bgStellar, subP);
      if (scene.fog instanceof THREE.FogExp2) {
        scene.fog.density = 0.008; // High aerospace clarity
      }
    }

    if (scene.fog instanceof THREE.FogExp2) {
      scene.fog.color.copy(currentBg);
    }
    scene.background = currentBg;

    if (keyLightRef.current) {
      keyLightRef.current.color.copy(currentColor);
    }
  });

  // Pre-compute sparkle counts based on quality tier
  const sparkle1Count = Math.round(350 * qualitySettings.sparkleMultiplier);
  const sparkle2Count = Math.round(200 * qualitySettings.sparkleMultiplier);
  const sparkle3Count = Math.round(250 * qualitySettings.sparkleMultiplier);

  return (
    <>
      {/* --- ADAPTIVE LIGHTING RIG --- */}
      {/* Key Light (Directional, shadows gated by quality tier) */}
      <directionalLight 
        ref={keyLightRef}
        position={[15, 20, 10]} 
        intensity={3.0} 
        castShadow={qualitySettings.enableShadows}
        shadow-mapSize={qualitySettings.enableShadows ? [qualitySettings.shadowMapSize, qualitySettings.shadowMapSize] : undefined}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />

      {/* Fill Light (Hemisphere, prevents pitch black shadows) */}
      <hemisphereLight 
        ref={fillLightRef}
        args={["#1e293b", "#050505", 0.6]} 
      />

      {/* Ambient Light (only on LOW tier to compensate for missing shadows/bloom) */}
      <ambientLight intensity={qualitySettings.tier === "LOW" ? 0.6 : 0.4} />

      {/* --- CINEMATIC KINETIC SPACE DUST (Quality-gated) --- */}
      {qualitySettings.enableSparkles && (
        <>
          {/* Foreground fast dust for speed parallax */}
          <Sparkles 
            count={sparkle1Count} 
            scale={[60, 40, 450]} 
            size={2.5} 
            speed={0.6} 
            opacity={0.3} 
            color="#ffffff" 
            position={[0, 0, -225]} 
          />

          {/* Midground glowing cyber shards for Learning belt */}
          {sparkle2Count > 0 && (
            <Sparkles 
              count={sparkle2Count} 
              scale={[50, 30, 150]} 
              size={4} 
              speed={0.3} 
              opacity={0.4} 
              color="#00F0FF" 
              position={[0, 0, -210]} 
            />
          )}

          {/* Background golden stellar dust for Dyson Sphere */}
          {sparkle3Count > 0 && (
            <Sparkles 
              count={sparkle3Count} 
              scale={[70, 50, 120]} 
              size={3} 
              speed={0.4} 
              opacity={0.5} 
              color="#F59E0B" 
              position={[0, 5, -380]} 
            />
          )}
        </>
      )}
    </>
  );
}
