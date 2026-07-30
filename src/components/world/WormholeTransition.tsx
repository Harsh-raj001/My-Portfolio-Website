"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useScroll } from "@react-three/drei";
import * as THREE from "three";
import { audioEngine } from "../../lib/audioEngine";
import { qualitySettings } from "../../lib/qualityTier";

const MAX_SPEED_LINES = 600;
const STATIC_LINE_POSITIONS = (() => {
  const pos = new Float32Array(MAX_SPEED_LINES * 3);
  for (let i = 0; i < MAX_SPEED_LINES; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 6 + Math.random() * 8;
    pos[i * 3] = Math.cos(angle) * radius;
    pos[i * 3 + 1] = Math.sin(angle) * radius;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 60 - 270;
  }
  return pos;
})();

// 🚀 PHASE 8: GRAVITATIONAL WARP CYLINDER & ENERGY RINGS
function GravitationalWarpCylinder({ isWarpingRef }: { isWarpingRef: React.MutableRefObject<boolean> }) {
  const cylinderRef = useRef<THREE.Mesh>(null);
  const innerRingsRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const isWarping = isWarpingRef.current;
    const warpMult = isWarping ? 8.0 : 1.0;
    if (cylinderRef.current) {
      cylinderRef.current.rotation.y += delta * warpMult * 2.0;
      cylinderRef.current.rotation.z -= delta * warpMult * 0.5;
      const pulse = 0.25 + Math.sin(state.clock.elapsedTime * (isWarping ? 25 : 3)) * 0.15;
      (cylinderRef.current.material as THREE.MeshBasicMaterial).opacity = pulse;
    }
    if (innerRingsRef.current) {
      innerRingsRef.current.children.forEach((ring, idx) => {
        ring.rotation.z += delta * (isWarping ? 12 : 2) * (idx % 2 === 0 ? 1 : -1);
        const scaleP = 1.0 + Math.sin(state.clock.elapsedTime * 8 + idx) * (isWarping ? 0.35 : 0.05);
        ring.scale.setScalar(scaleP);
      });
    }
  });

  return (
    <group>
      {/* Space-Time Distortion Energy Cylinder */}
      <mesh ref={cylinderRef} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[13, 13, 52, 32, 1, true]} />
        <meshBasicMaterial
          color="#00F0FF"
          wireframe
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* High-Energy Pulsing Inner Warp Rings */}
      <group ref={innerRingsRef}>
        {[-15, -5, 5, 15].map((zPos, idx) => (
          <mesh key={idx} position={[0, 0, zPos]}>
            <torusGeometry args={[10 + idx * 0.5, 0.4, 16, 64]} />
            <meshBasicMaterial
              color={idx % 2 === 0 ? "#F59E0B" : "#00F0FF"}
              wireframe
              transparent
              opacity={0.4}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

export default function WormholeTransition() {
  const scroll = useScroll();
  const tunnelRef = useRef<THREE.Group>(null);
  const ringGroupRef = useRef<THREE.Group>(null);
  const speedLinesRef = useRef<THREE.Points>(null);
  
  // PERF FIX: Use refs instead of useState to avoid React re-renders inside useFrame
  const isWarpingRef = useRef(false);
  const groupRef = useRef<THREE.Group>(null);

  const warpBoostTriggeredRef = useRef(false);

  // Particle count scaled by quality tier (600 → 150 on LOW)
  const particleCount = useMemo(() => Math.round(600 * qualitySettings.particleMultiplier), []);

  // Extract subarray of static coordinates to match dynamic particle count
  const linePositions = useMemo(() => {
    return STATIC_LINE_POSITIONS.slice(0, particleCount * 3);
  }, [particleCount]);

  useFrame((_, delta) => {
    const progress = scroll.offset;

    // 1. Z-Axis Scroll Momentum Glide Trigger
    if (progress > 0.63 && progress < 0.67 && !warpBoostTriggeredRef.current && scroll && scroll.el) {
      warpBoostTriggeredRef.current = true;
      audioEngine.playKlaxon();
      const targetTop = 0.71 * (scroll.el.scrollHeight - scroll.el.clientHeight);
      scroll.el.scrollTo({ top: targetTop, behavior: "smooth" });
    } else if (progress < 0.58 || progress > 0.74) {
      warpBoostTriggeredRef.current = false;
    }

    // 2. High-Speed Warp Physics (0.62 - 0.72)
    const isWarping = progress > 0.62 && progress < 0.72;
    isWarpingRef.current = isWarping;
    
    const shouldBeVisible = progress < 0.715;
    if (groupRef.current) {
      groupRef.current.visible = shouldBeVisible;
    }
    
    // Early return if not visible — skip all animation work
    if (!shouldBeVisible) return;
    
    const warpSpeed = isWarping ? 15.0 : 1.5;

    if (tunnelRef.current) {
      tunnelRef.current.rotation.z += delta * warpSpeed * 0.4;
    }

    if (ringGroupRef.current) {
      ringGroupRef.current.rotation.z -= delta * warpSpeed * 0.8;
      const scaleP = 1.0 + Math.sin(progress * 40) * (isWarping ? 0.25 : 0.02);
      ringGroupRef.current.scale.set(scaleP, scaleP, 1);
    }

    if (speedLinesRef.current && speedLinesRef.current.geometry.attributes.position) {
      const positions = speedLinesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 2] += delta * (isWarping ? 120 : 5);
        if (positions[i * 3 + 2] > -240) {
          positions[i * 3 + 2] = -300;
        }
      }
      speedLinesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, -275]}>
      {/* GRAVITATIONAL WARP CYLINDER */}
      <GravitationalWarpCylinder isWarpingRef={isWarpingRef} />

      {/* --- OUTER WARP TUNNEL MESH --- */}
      <group ref={tunnelRef} rotation={[Math.PI / 2, 0, 0]}>
        <mesh>
          <cylinderGeometry args={[14, 14, 55, 32, 1, true]} />
          <meshBasicMaterial 
            color="#3B82F6" 
            wireframe 
            transparent 
            opacity={0.35} 
            blending={THREE.AdditiveBlending}
            side={THREE.DoubleSide}
          />
        </mesh>
        
        <mesh scale={[1.1, 1, 1.1]}>
          <cylinderGeometry args={[16, 16, 60, 24, 1, true]} />
          <meshBasicMaterial 
            color="#8B5CF6" 
            wireframe 
            transparent 
            opacity={0.2} 
            blending={THREE.AdditiveBlending}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
      
      {/* --- TWISTING NEON GRAVITATIONAL RINGS --- */}
      <group ref={ringGroupRef}>
        {[-20, -10, 0, 10, 20].map((zOffset, index) => (
          <mesh key={index} position={[0, 0, zOffset]}>
            <torusGeometry args={[12 - Math.abs(zOffset) * 0.1, 0.3, 16, 64]} />
            <meshStandardMaterial 
              color={index % 2 === 0 ? "#00F0FF" : "#EC4899"} 
              emissive={index % 2 === 0 ? "#00F0FF" : "#EC4899"}
              emissiveIntensity={3.0}
              roughness={0.1}
            />
          </mesh>
        ))}
      </group>

      {/* --- SPEED LINES (PARTICLES) --- */}
      <points ref={speedLinesRef}>
        <bufferGeometry>
          <bufferAttribute 
            attach="attributes-position" 
            args={[linePositions, 3]} 
          />
        </bufferGeometry>
        <pointsMaterial 
          size={0.6} 
          color="#ffffff" 
          transparent 
          opacity={0.8} 
          blending={THREE.AdditiveBlending} 
        />
      </points>

      {/* Warp Core Glow */}
      <pointLight position={[0, 0, 0]} color="#00F0FF" intensity={12} distance={50} />
      <pointLight position={[0, 0, -20]} color="#EC4899" intensity={12} distance={50} />
    </group>
  );
}
