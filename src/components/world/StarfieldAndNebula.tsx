"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// 1. Generate 2,000 star positions and colors statically at module load time (zero React render overhead & fully pure)
const STAR_COUNT = 2000;
const { starPositions, starColors } = (() => {
  const pos = new Float32Array(STAR_COUNT * 3);
  const col = new Float32Array(STAR_COUNT * 3);

  const palette = [
    new THREE.Color("#ffffff"), // Pure white
    new THREE.Color("#ffaa55"), // Warm golden
    new THREE.Color("#00f0ff"), // Cyan cyber
    new THREE.Color("#8b5cf6"), // Neural violet
    new THREE.Color("#f59e0b")  // Stellar gold
  ];

  for (let i = 0; i < STAR_COUNT; i++) {
    // Distribute widely in X, Y, and deeply along Z (-600 to +30)
    pos[i * 3] = (Math.random() - 0.5) * 350;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 200;
    pos[i * 3 + 2] = Math.random() * -630 + 30;

    const chosenColor = palette[Math.floor(Math.random() * palette.length)];
    col[i * 3] = chosenColor.r;
    col[i * 3 + 1] = chosenColor.g;
    col[i * 3 + 2] = chosenColor.b;
  }
  return { starPositions: pos, starColors: col };
})();

export default function StarfieldAndNebula() {
  const pointsRef = useRef<THREE.Points>(null);
  const nebulaGroupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      // Very slow cosmic rotation
      pointsRef.current.rotation.z += delta * 0.002;
    }
    if (nebulaGroupRef.current) {
      nebulaGroupRef.current.rotation.y += delta * 0.003;
      nebulaGroupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.2) * 5;
    }
  });

  return (
    <>
      {/* --- 2,000 INSTANCED STARFIELD POINTS --- */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute 
            attach="attributes-position" 
            args={[starPositions, 3]} 
          />
          <bufferAttribute 
            attach="attributes-color" 
            args={[starColors, 3]} 
          />
        </bufferGeometry>
        <pointsMaterial 
          size={1.8} 
          vertexColors 
          transparent 
          opacity={0.75} 
          sizeAttenuation 
        />
      </points>

      {/* --- BACKGROUND NEBULAE CLOUDS (ADDITIVE SHADER PLANES) --- */}
      <group ref={nebulaGroupRef} position={[0, 0, -150]}>
        {/* Deep Space Warm Nebula (Act I background) */}
        <mesh position={[-40, 20, 0]} rotation={[0, 0.5, 0]}>
          <planeGeometry args={[120, 120]} />
          <meshBasicMaterial 
            color="#FF6B35" 
            transparent 
            opacity={0.06} 
            blending={THREE.AdditiveBlending} 
            side={THREE.DoubleSide} 
          />
        </mesh>
        
        {/* Cyber Violet Nebula (Act II background) */}
        <mesh position={[50, -30, -120]} rotation={[0.3, -0.4, 0]}>
          <planeGeometry args={[160, 160]} />
          <meshBasicMaterial 
            color="#8B5CF6" 
            transparent 
            opacity={0.07} 
            blending={THREE.AdditiveBlending} 
            side={THREE.DoubleSide} 
          />
        </mesh>

        {/* Stellar Golden Nebula (Act III background) */}
        <mesh position={[0, 40, -280]} rotation={[-0.2, 0, 0.2]}>
          <planeGeometry args={[200, 200]} />
          <meshBasicMaterial 
            color="#F59E0B" 
            transparent 
            opacity={0.08} 
            blending={THREE.AdditiveBlending} 
            side={THREE.DoubleSide} 
          />
        </mesh>
      </group>
    </>
  );
}
