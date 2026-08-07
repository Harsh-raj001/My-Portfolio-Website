"use client";

import { useRef, useMemo } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { useScroll } from "@react-three/drei";
import * as THREE from "three";
import { easing } from "maath";
import { useMissionStore } from "../store/missionStore";

export default function CameraRig() {
  const scroll = useScroll();
  const { camera } = useThree();
  const lookAtTarget = useMemo(() => new THREE.Vector3(0, 0, 0), []);
  const cameraPos = useMemo(() => new THREE.Vector3(0, 2, 15), []);
  const prevFov = useRef(45); // Track FOV to avoid unnecessary matrix updates

  useFrame((state, delta) => {
    const progress = scroll.offset; // 0.0 to 1.0
    const elapsed = state.clock.elapsedTime;

    // 1. Calculate overall Z progression from Launchpad (+15) to Command Dome (-500)
    // We map 7 distinct narrative sectors with tailored camera choreography.
    const baseZ = 15 - progress * 515; // 15 to -500

    let targetX = 0;
    let targetY = 2;
    let targetZ = baseZ;
    let lookX = 0;
    let lookY = 0;
    let lookZ = baseZ - 20; // default looking forward along flight corridor
    let targetFov = 42;
    let rollAngle = 0;

    // 2. 7-Scene Waypoint Choreography
    if (progress < 0.08) {
      // SCENE 01: INTRO LAUNCHPAD (Z: +15 to -40)
      // Center chase cam, slow vertical lift as engines ignite
      const subP = progress / 0.08;
      targetX = 0;
      targetY = 2 + subP * 3;
      targetZ = 15 - subP * 55;
      lookZ = targetZ - 25;
      targetFov = 42;
    } else if (progress >= 0.08 && progress < 0.26) {
      // SCENE 02: VERIDIAN PRIME // PLANET OF CURIOSITY (Z: -40 to -110, center -60)
      // Smooth cinematic orbital sweep around golden sphere at Z=-60
      const subP = (progress - 0.08) / 0.18;
      const angle = subP * Math.PI * 1.4;
      targetX = Math.sin(angle) * 15;
      targetY = 4 + Math.cos(subP * Math.PI) * 4;
      targetZ = -60 + Math.cos(angle) * 22;
      lookX = 0;
      lookY = 0;
      lookZ = -60; // Keep Veridian Prime anchored in center frame
      targetFov = 40; // Tight orbital cinematography
    } else if (progress >= 0.26 && progress < 0.40) {
      // SCENE 03: KAOS STRAIT // ASTEROID SLALOM (Z: -110 to -180)
      // Dynamic evasive weaving through procedural rock debris with banking roll
      const subP = (progress - 0.26) / 0.14;
      targetX = Math.sin(subP * Math.PI * 4) * 8;
      targetY = 2 + Math.cos(subP * Math.PI * 3) * 3;
      targetZ = baseZ;
      lookX = targetX * 0.4;
      lookY = 1;
      lookZ = baseZ - 30;
      rollAngle = Math.sin(subP * Math.PI * 4) * -0.08; // Bank into turns
      targetFov = 46;
    } else if (progress >= 0.40 && progress < 0.62) {
      // SCENE 04: SYNTHESIS-V // CYBERNETIC LEARNING BELT (Z: -180 to -270, center -215)
      // Lateral tracking shot weaving through sapphire data monoliths
      const subP = (progress - 0.40) / 0.22;
      targetX = Math.cos(subP * Math.PI * 2.5) * 12;
      targetY = 2 + Math.sin(subP * Math.PI * 2) * 3;
      targetZ = baseZ;
      lookX = targetX * -0.25; // Look inward toward data stream core
      lookY = 0.5;
      lookZ = baseZ - 25;
      targetFov = 45;
    } else if (progress >= 0.62 && progress < 0.72) {
      // SCENE 05: WORMHOLE WARP CONDUIT (Z: -270 to -330)
      // Relativistic warp speed! Extreme FOV expansion to 75 deg and high-frequency turbulence
      targetX = Math.sin(elapsed * 12) * 0.6; // High frequency warp vibration
      targetY = 2 + Math.cos(elapsed * 15) * 0.5;
      targetZ = baseZ;
      lookX = 0;
      lookY = 1;
      lookZ = baseZ - 60;
      rollAngle = Math.sin(elapsed * 10) * 0.05; // Relativistic roll shake
      targetFov = 75; // Dramatic warp FOV expansion
    } else if (progress >= 0.72 && progress < 0.88) {
      // SCENE 06: NEXUS-7 ORBITAL CITY // BUILDER STATION (Z: -330 to -440, center -360)
      // Architectural crane shot sweeping around counter-rotating habitat rings and pods
      const subP = (progress - 0.72) / 0.16;
      const angle = subP * Math.PI * 1.2;
      targetX = Math.sin(angle) * 18;
      targetY = 5 + Math.cos(subP * Math.PI) * 5;
      targetZ = -360 + Math.cos(angle) * 25;
      lookX = 0;
      lookY = 0;
      lookZ = -370; // Focus on Builder Station core & case study pods
      targetFov = 42;
    } else {
      // SCENE 07: COMMAND DOME // DYSON SPHERE MEGASTRUCTURE (Z: -440 to -500)
      // Epic widescreen panoramic pullback revealing unfinished Dyson star and Command Dome
      const subP = (progress - 0.88) / 0.12;
      targetX = Math.sin(subP * Math.PI * 0.4) * 6;
      targetY = 6 + subP * 8;
      targetZ = -440 - subP * 50; // Final descent to Z=-490
      lookX = 0;
      lookY = 1.5;
      lookZ = -480; // Anchor gaze on Sapphire Command Dome
      targetFov = 38; // Majestic cinematic telephoto compression
    }

    // 3. Camera Assist: AAA Guide Pan to Active Objectives
    // When a chapter is active, we gently pan the camera toward the primary interactable
    // to guarantee the user sees it without hunting.
    const currentChapter = useMissionStore.getState().currentChapter;
    
    // Smoothly blend to objective look targets (only when deep into the chapter)
    if (currentChapter === "PLANET_CURIOSITY" && progress > 0.12 && progress < 0.22) {
      lookX += (0 - lookX) * 0.1; // Center on Veridian Prime [0, 0, -60]
      lookY += (0 - lookY) * 0.1;
    } 
    else if (currentChapter === "ASTEROID_SLALOM" && progress > 0.30 && progress < 0.36) {
      // Red Asteroid is roughly at [-8, 3, -135]
      lookX += (-8 - lookX) * 0.08;
      lookY += (3 - lookY) * 0.08;
    }
    else if (currentChapter === "SYNTHESIS_V" && progress > 0.45 && progress < 0.55) {
      // Target Crystal is around [5, 2, -225]
      lookX += (5 - lookX) * 0.08;
      lookY += (2 - lookY) * 0.08;
    }
    else if (currentChapter === "ORBITAL_NEXUS" && progress > 0.75 && progress < 0.85) {
      // Active Module is around [0, 6, -370]
      lookX += (0 - lookX) * 0.08;
      lookY += (4 - lookY) * 0.08;
    }

    // 4. Add organic harmonic bobbing (aerospace stabilization float)
    const floatY = Math.sin(elapsed * 0.7) * 0.3;
    const floatX = Math.cos(elapsed * 0.5) * 0.2;
    cameraPos.set(targetX + floatX, targetY + floatY, targetZ);
    lookAtTarget.set(lookX, lookY, lookZ);

    const isTeleporting = useMissionStore.getState().isTeleporting;

    // 4. Aerospace Hydraulic Damping (Removed for immediate sync with ScrollControls)
    camera.position.copy(cameraPos);

    // 5. Apply smooth lookAt orientation and roll banking
    camera.lookAt(lookAtTarget);
    if (rollAngle !== 0) {
      easing.damp(camera.rotation, "z", rollAngle, isTeleporting ? 0 : 0.05, delta);
    } else {
      easing.damp(camera.rotation, "z", 0, isTeleporting ? 0 : 0.05, delta);
    }

    // 6. Dynamic FOV Interpolation (only update projection matrix when FOV changes)
    if (camera instanceof THREE.PerspectiveCamera) {
      easing.damp(camera, "fov", targetFov, isTeleporting ? 0 : 0.1, delta);
      // Only recalculate projection matrix if FOV actually changed (>0.01 deg)
      if (Math.abs(camera.fov - prevFov.current) > 0.01) {
        camera.updateProjectionMatrix();
        prevFov.current = camera.fov;
      }
    }
  });

  return null;
}
