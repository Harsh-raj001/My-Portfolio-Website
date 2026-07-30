"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { qualitySettings } from "../../lib/qualityTier";

// 🚀 PHASE 8: DYSON SPHERE PULSATING PLASMA ENERGY BEAMS
function PlasmaEnergyBeams() {
  const beamGroupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (beamGroupRef.current) {
      beamGroupRef.current.rotation.z += delta * 0.15;
      beamGroupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
      
      beamGroupRef.current.children.forEach((beam, idx) => {
        const mesh = beam as THREE.Mesh;
        if (mesh.material instanceof THREE.MeshBasicMaterial) {
          const pulse = 0.4 + Math.sin(state.clock.elapsedTime * (5 + (idx % 3)) + idx) * 0.35;
          mesh.material.opacity = pulse;
        }
        const scaleY = 1.0 + Math.sin(state.clock.elapsedTime * 4 + idx) * 0.15;
        mesh.scale.set(1, scaleY, 1);
      });
    }
  });

  return (
    <group ref={beamGroupRef}>
      {[...Array(qualitySettings.plasmaBeamCount)].map((_, i) => {
        // Spherical distribution
        const total = qualitySettings.plasmaBeamCount;
        const phi = Math.acos(-1 + (2 * i) / total);
        const theta = Math.sqrt(total * Math.PI) * phi;
        const r = 30; // Halfway to construction shell
        
        const x = r * Math.sin(phi) * Math.cos(theta);
        const y = r * Math.sin(phi) * Math.sin(theta);
        const z = r * Math.cos(phi);

        return (
          <mesh
            key={i}
            position={[x * 0.5, y * 0.5, z * 0.5]}
            rotation={[phi, theta, 0]}
          >
            <cylinderGeometry args={[0.15, 0.6, r, 6]} />
            <meshBasicMaterial
              color={i % 2 === 0 ? "#FFFFFF" : "#E2E8F0"}
              transparent
              opacity={0.3}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        );
      })}
    </group>
  );
}

export default function DysonSphere() {
  const sphereShell1Ref = useRef<THREE.Mesh>(null);
  const sphereShell2Ref = useRef<THREE.Mesh>(null);
  const droneGroupRef = useRef<THREE.Group>(null);
  const instancedDronesRef = useRef<THREE.InstancedMesh>(null);

  // Drone count scaled by quality tier (500 → 100 on LOW)
  const count = qualitySettings.droneCount;
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useEffect(() => {
    if (!instancedDronesRef.current) return;
    
    // Distribute 500 drones in an orbital swarm shell around the Dyson sphere
    for (let i = 0; i < count; i++) {
      const radius = 38 + Math.random() * 15;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      dummy.position.set(x, y, z);
      dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      dummy.scale.setScalar(0.4 + Math.random() * 0.6);
      dummy.updateMatrix();

      instancedDronesRef.current.setMatrixAt(i, dummy.matrix);
    }
    instancedDronesRef.current.instanceMatrix.needsUpdate = true;
  }, [dummy, count]);

  useFrame((state, delta) => {
    // Counter-rotate the unfinished Dyson shells
    if (sphereShell1Ref.current) {
      sphereShell1Ref.current.rotation.y += delta * 0.05;
      sphereShell1Ref.current.rotation.z += delta * 0.02;
    }
    if (sphereShell2Ref.current) {
      sphereShell2Ref.current.rotation.y -= delta * 0.04;
      sphereShell2Ref.current.rotation.x += delta * 0.03;
    }
    // Swarm orbital drift
    if (droneGroupRef.current) {
      droneGroupRef.current.rotation.y += delta * 0.08;
      droneGroupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group position={[0, 5, -450]}>
      {/* 🚀 PHASE 8: DYSON SPHERE PULSATING PLASMA ENERGY BEAMS */}
      <PlasmaEnergyBeams />

      {/* --- CENTRAL BLAZING WHITE STAR --- */}
      <mesh>
        <sphereGeometry args={[22, qualitySettings.tier === "LOW" ? 32 : 64, qualitySettings.tier === "LOW" ? 32 : 64]} />
        <meshBasicMaterial color="#FFFFFF" />
      </mesh>
      
      {/* Star Corona & Volumetric Halo */}
      <mesh scale={[1.1, 1.1, 1.1]}>
        <sphereGeometry args={[22, 32, 32]} />
        <meshBasicMaterial 
          color="#F8FAFC" 
          transparent 
          opacity={0.15} 
          blending={THREE.AdditiveBlending} 
          side={THREE.BackSide} 
        />
      </mesh>
      
      <mesh scale={[1.25, 1.25, 1.25]}>
        <sphereGeometry args={[22, 32, 32]} />
        <meshBasicMaterial 
          color="#F1F5F9" 
          transparent 
          opacity={0.08} 
          blending={THREE.AdditiveBlending} 
          side={THREE.BackSide} 
        />
      </mesh>

      {/* Powerful Star Illumination */}
      <pointLight color="#FFFFFF" intensity={20} distance={150} decay={1.5} />
      <pointLight color="#F8FAFC" intensity={8} distance={300} decay={2.0} />

      {/* --- UNFINISHED DYSON SPHERE SHELL 1 (INNER FRAME) --- */}
      <mesh ref={sphereShell1Ref}>
        <icosahedronGeometry args={[35, 2]} />
        <meshStandardMaterial 
          color="#334155" 
          wireframe 
          roughness={0.1} 
          metalness={0.9} 
          emissive="#FFFFFF"
          emissiveIntensity={0.8}
        />
      </mesh>

      {/* --- UNFINISHED DYSON SPHERE SHELL 2 (OUTER LATTICE) --- */}
      <mesh ref={sphereShell2Ref} scale={[1.15, 1.15, 1.15]}>
        <dodecahedronGeometry args={[35, 2]} />
        <meshStandardMaterial 
          color="#334155" 
          wireframe 
          roughness={0.4} 
          metalness={0.8}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* --- 500 INSTANCED CONSTRUCTION DRONES WITH WELDING SPARKS --- */}
      <group ref={droneGroupRef}>
        <instancedMesh ref={instancedDronesRef} args={[undefined, undefined, count]} castShadow>
          <boxGeometry args={[0.6, 0.4, 0.8]} />
          <meshStandardMaterial 
            color="#F1F5F9" 
            metalness={0.9} 
            roughness={0.1}
            emissive="#FFFFFF"
            emissiveIntensity={1.5}
          />
        </instancedMesh>

        {/* Welding Laser Beams (scaled by quality tier) */}
        {[...Array(qualitySettings.tier === "LOW" ? 4 : 12)].map((_, i) => {
          const beamTotal = qualitySettings.tier === "LOW" ? 4 : 12;
          const angle = (i / beamTotal) * Math.PI * 2;
          const r = 35;
          return (
            <mesh 
              key={i} 
              position={[Math.cos(angle) * r * 0.5, Math.sin(angle) * r * 0.5, 0]} 
              rotation={[0, 0, angle]}
            >
              <cylinderGeometry args={[0.04, 0.04, r, 4]} />
              <meshBasicMaterial 
                color="#FFFFFF" 
                transparent 
                opacity={0.4} 
                blending={THREE.AdditiveBlending} 
              />
            </mesh>
          );
        })}
      </group>

      {/* --- COMMAND OBSERVATION DOME (Sapphire Glass Canopy with Inside-Out Normals) --- */}
      <mesh position={[0, 0, -30]}>
        <sphereGeometry args={[48, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.65]} />
        <meshPhysicalMaterial
          color="#FFFFFF"
          transmission={0.9}
          opacity={1}
          transparent
          roughness={0.02}
          ior={1.4}
          side={THREE.BackSide}
          emissive="#F8FAFC"
          emissiveIntensity={0.2}
        />
      </mesh>
    </group>
  );
}
