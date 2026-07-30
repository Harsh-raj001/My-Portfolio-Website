"use client";

import { useRef, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useScroll, Html } from "@react-three/drei";
import * as THREE from "three";
import { easing } from "maath";
import { EXPERIENCE_NODES, ExperienceNode } from "../../data/missionData";
import { audioEngine } from "../../lib/audioEngine";
import { qualitySettings } from "../../lib/qualityTier";
import { triggerHaptic } from "../../lib/haptics";

const MAX_ASTEROID_DUST = 300;
const STATIC_ASTEROID_DUST = (() => {
  const pos = new Float32Array(MAX_ASTEROID_DUST * 3);
  for (let i = 0; i < MAX_ASTEROID_DUST; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 70;      // X: -35 to 35
    pos[i * 3 + 1] = (Math.random() - 0.5) * 40;  // Y: -20 to 20
    pos[i * 3 + 2] = -80 - Math.random() * 110;   // Z: -80 to -190 (Kaos Strait)
  }
  return pos;
})();

interface AsteroidSlalomProps {
  onSelectExperience?: (exp: ExperienceNode) => void;
}

// Procedural Asteroid Generator using pseudo-random sine/cosine vertex displacement
function createProceduralAsteroidGeometry(radius: number, detail: number, seed: number) {
  const geo = new THREE.IcosahedronGeometry(radius, detail);
  const pos = geo.attributes.position;
  const v = new THREE.Vector3();
  
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    // 3D procedural noise displacement
    const noise = Math.sin(v.x * 1.8 + seed) * Math.cos(v.y * 2.1 + seed) * Math.sin(v.z * 1.5 + seed);
    const scale = 1 + noise * 0.35;
    v.multiplyScalar(scale);
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  
  geo.computeVertexNormals();
  return geo;
}

// 🚀 PHASE 8: ZERO-G ASTEROID DUST PARTICLE SWARM (300 PARTICLES)
function AsteroidDustSwarm() {
  const pointsRef = useRef<THREE.Points>(null);

  // Allocate particles once at initialization — count scaled by quality tier (Zero GC)
  const particlePositions = useMemo(() => {
    const count = Math.round(300 * qualitySettings.particleMultiplier);
    return STATIC_ASTEROID_DUST.slice(0, count * 3);
  }, []);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.035;
      pointsRef.current.rotation.z += delta * 0.025;
      // Gentle zero-G oscillation
      pointsRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 2.5;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particlePositions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#F97316"
        size={0.6}
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Individual Interactive Asteroid Axiom Debris Field
function AsteroidFieldNode({
  expNode,
  onSelect,
  scrollOffsetRef,
  isActiveObjective,
  isScannerActive,
  isIdle
}: {
  expNode: ExperienceNode;
  onSelect?: (exp: ExperienceNode) => void;
  scrollOffsetRef: React.MutableRefObject<number>;
  isActiveObjective: boolean;
  isScannerActive: boolean;
  isIdle: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const rockRef = useRef<THREE.Mesh>(null);
  const holoRingRef = useRef<THREE.Mesh>(null);
  const outerGlowRef = useRef<THREE.Mesh>(null);
  const shieldMaterialRef = useRef<THREE.MeshBasicMaterial>(null);
  const pointLightRef = useRef<THREE.PointLight>(null);
  const [hovered, setHovered] = useState(false);
  
  // Track klaxon triggering to prevent sound spam
  const klaxonTriggeredRef = useRef(false);

  // Pre-generate procedural rock geometry (zero runtime allocation)
  const rockGeo = useMemo(() => {
    const seed = expNode.coordinates[0] * 10 + expNode.coordinates[2];
    return createProceduralAsteroidGeometry(2.8, 2, seed);
  }, [expNode.coordinates]);

  const targetScale = useMemo(() => new THREE.Vector3(1, 1, 1), []);

  useFrame((state, delta) => {
    if (rockRef.current) {
      rockRef.current.rotation.x += delta * (hovered ? 1.2 : 0.6);
      rockRef.current.rotation.y += delta * (hovered ? 1.8 : 0.8);
    }
    if (holoRingRef.current) {
      holoRingRef.current.rotation.z -= delta * (hovered ? 3.5 : 1.5);
      holoRingRef.current.rotation.x += delta * (hovered ? 1.2 : 0.5);
    }
    if (outerGlowRef.current) {
      outerGlowRef.current.rotation.y += delta * 1.0;
      const glowScale = 1.0 + Math.sin(state.clock.elapsedTime * 6) * 0.08;
      outerGlowRef.current.scale.setScalar(glowScale);
    }

    if (groupRef.current) {
      // Float bobbing
      groupRef.current.position.y = expNode.coordinates[1] + Math.sin(state.clock.elapsedTime * 1.2 + expNode.coordinates[0]) * 0.5;

      // Check proximity to spacecraft (Spacecraft Z is -scrollOffset * 350)
      const spacecraftZ = -scrollOffsetRef.current * 350;
      const distanceZ = Math.abs(groupRef.current.position.z - spacecraftZ);

      // Trigger warning klaxon when proximity < 15 units
      if (distanceZ < 15 && !klaxonTriggeredRef.current) {
        klaxonTriggeredRef.current = true;
        audioEngine.playKlaxon();
      } else if (distanceZ >= 25) {
        // Reset trigger once spacecraft moves away
        klaxonTriggeredRef.current = false;
      }
    }

    const scaleVal = hovered ? 1.3 : 1.0;
    targetScale.set(scaleVal, scaleVal, scaleVal);
    if (groupRef.current) {
      easing.damp3(groupRef.current.scale, targetScale, 0.15, delta);
    }

    // Animate energy shield opacity & point light intensity dynamically inside useFrame
    if (isActiveObjective) {
      if (shieldMaterialRef.current) {
        shieldMaterialRef.current.opacity = hovered 
          ? 0.25 
          : 0.08 + Math.sin(state.clock.elapsedTime * 5) * 0.05;
      }
      if (pointLightRef.current) {
        pointLightRef.current.intensity = hovered 
          ? 8 
          : 2.5 + Math.sin(state.clock.elapsedTime * 5) * 1.5;
      }
    }
  });

  return (
    <group
      ref={groupRef}
      position={expNode.coordinates}
      onClick={(e) => {
        e.stopPropagation();
        triggerHaptic("light");
        onSelect?.(expNode);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        audioEngine.playHoverPing();
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = "default";
      }}
    >
      {/* Invisible enlarged hitbox */}
      <mesh>
        <sphereGeometry args={[6, 8, 8]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* Procedural Rock Asteroid Body */}
      <mesh ref={rockRef} geometry={rockGeo} castShadow receiveShadow>
        <meshStandardMaterial
          color={hovered ? "#EF4444" : "#7F1D1D"}
          roughness={0.8}
          metalness={hovered ? 0.4 : 0.2}
          bumpScale={0.15}
          transparent
          opacity={!isActiveObjective ? 0.3 : 1.0}
        />
      </mesh>

      {/* Warning Hologram Ring - Only on active objective */}
      {isActiveObjective && (
        <mesh ref={holoRingRef} scale={[1.45, 1.45, 1.45]}>
          <icosahedronGeometry args={[2.5, 1]} />
          <meshBasicMaterial
            color={hovered ? "#00F0FF" : "#EF4444"}
            wireframe
            transparent
            opacity={hovered ? 0.95 : 0.45}
          />
        </mesh>
      )}

      {/* SCANNER HOLOGRAM (Tab Key) */}
      {isScannerActive && (
        <mesh scale={[1.5, 1.5, 1.5]}>
          <icosahedronGeometry args={[2.5, 1]} />
          <meshBasicMaterial color="#00F0FF" wireframe transparent opacity={0.6} />
        </mesh>
      )}

      {/* AURA WAYPOINT BEAM (Idle) */}
      {isActiveObjective && isIdle && (
        <mesh position={[0, 40, 0]}>
          <cylinderGeometry args={[0.5, 0.5, 80, 16]} />
          <meshBasicMaterial color="#00F0FF" transparent opacity={0.6} blending={THREE.AdditiveBlending} />
        </mesh>
      )}

      {/* Energy Shield Glow (always visible, pulsing) */}
      {isActiveObjective && (
        <mesh ref={outerGlowRef} scale={[1.7, 1.7, 1.7]}>
          <sphereGeometry args={[2.5, 16, 16]} />
          <meshBasicMaterial
            ref={shieldMaterialRef}
            color={hovered ? "#00F0FF" : "#EF4444"}
            wireframe
            transparent
            opacity={0.08}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}

      {/* Warning Pulsing Point Light */}
      {isActiveObjective && (
        <pointLight ref={pointLightRef} color={hovered ? "#00F0FF" : "#EF4444"} intensity={2.5} distance={18} />
      )}

      {/* Hover Tooltip Label */}
      {hovered && (
        <Html position={[0, 5.0, 0]} center zIndexRange={[100, 0]} style={{ pointerEvents: "none" }}>
          <div className="bg-slate-900/90 border border-cyan-400/50 backdrop-blur-md px-3 py-1.5 rounded-md flex flex-col items-center min-w-[120px] shadow-[0_0_15px_rgba(0,240,255,0.3)] animate-pulse-fast">
            <span className="text-[9px] font-mono font-bold uppercase text-cyan-400 tracking-widest mb-0.5">Mission Objective</span>
            <span className="text-xs font-semibold text-white whitespace-nowrap text-center">{expNode.topic}</span>
            <span className="text-[10px] text-slate-300 mt-0.5">Click to Explore</span>
          </div>
        </Html>
      )}

      {/* Inline Holographic Warning HUD Label (Default state) */}
      {!hovered && isActiveObjective && (
        <Html position={[0, 3.8, 0]} center distanceFactor={25}>
          <div className="flex flex-col items-center opacity-70">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping mb-1" />
            <span className="text-[8px] font-mono text-red-500 tracking-widest uppercase shadow-black drop-shadow-md">Detected</span>
          </div>
        </Html>
      )}
    </group>
  );
}

// Background Procedural Asteroids (Slalom Obstacles)
function BackgroundAsteroids() {
  const bgAsteroids = useMemo(() => {
    const items = [];
    // Generate 6 procedural background slalom asteroids
    const coords: [number, number, number][] = [
      [-22, 6, -95],
      [24, -8, -105],
      [-18, -10, -125],
      [20, 12, -140],
      [-25, 4, -155],
      [22, -6, -170]
    ];
    for (let i = 0; i < coords.length; i++) {
      const seed = coords[i][0] * 5 + coords[i][2];
      items.push({
        id: `bg-ast-${i}`,
        pos: coords[i],
        geo: createProceduralAsteroidGeometry(1.8 + (i % 3) * 0.6, 1, seed)
      });
    }
    return items;
  }, []);

  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child, idx) => {
        child.rotation.x += delta * (0.3 + idx * 0.1);
        child.rotation.y += delta * (0.4 - idx * 0.08);
      });
    }
  });

  return (
    <group ref={groupRef}>
      {bgAsteroids.map((ast) => (
        <mesh key={ast.id} geometry={ast.geo} position={ast.pos} receiveShadow>
          <meshStandardMaterial color="#450A0A" roughness={0.9} metalness={0.1} />
        </mesh>
      ))}
    </group>
  );
}

import { useMissionStore } from "../../store/missionStore";

export default function AsteroidSlalom({ onSelectExperience }: AsteroidSlalomProps) {
  const scroll = useScroll();
  const scrollOffsetRef = useRef(0);
  
  const currentChapter = useMissionStore(state => state.currentChapter);
  const isScannerActive = useMissionStore(state => state.isScannerActive);
  const isIdle = useMissionStore(state => state.isIdle);

  useFrame(() => {
    scrollOffsetRef.current = scroll.offset;
  });

  return (
    <group>
      {/* 🚀 PHASE 8: ZERO-G ASTEROID DUST PARTICLE SWARM */}
      <AsteroidDustSwarm />

      {/* 5 Interactive Asteroid Debris Fields (Kaos Strait Experience Nodes) */}
      {EXPERIENCE_NODES.map((exp, idx) => (
        <AsteroidFieldNode
          key={exp.id}
          expNode={exp}
          onSelect={onSelectExperience}
          scrollOffsetRef={scrollOffsetRef}
          isActiveObjective={currentChapter === "ASTEROID_SLALOM" && idx === 0}
          isScannerActive={isScannerActive}
          isIdle={isIdle}
        />
      ))}

      {/* 6 Background Procedural Asteroids for Slalom Depth */}
      <BackgroundAsteroids />
    </group>
  );
}
