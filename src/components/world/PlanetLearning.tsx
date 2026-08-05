"use client";

import { useRef, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { easing } from "maath";
import { PRODUCT_THINKING_NODES, ProductThinkingNode } from "../../data/missionData";
import { audioEngine } from "../../lib/audioEngine";
import { triggerHaptic } from "../../lib/haptics";
import { useMissionStore } from "../../store/missionStore";

interface PlanetSynthesisProps {
  onSelectNode?: (node: ProductThinkingNode) => void;
}

function KnowledgeMonolith({ 
  node, 
  index,
  onSelect,
  isActiveObjective,
  isScannerActive,
  isIdle
}: { 
  node: ProductThinkingNode; 
  index: number;
  onSelect?: (node: ProductThinkingNode) => void;
  isActiveObjective: boolean;
  isScannerActive: boolean;
  isIdle: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const crystalRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const pulseRingRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshPhysicalMaterial>(null);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const setHoveringInteractive = useMissionStore(state => state.setHoveringInteractive);
  const targetScale = useMemo(() => new THREE.Vector3(1, 1, 1), []);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.position.y = node.coordinates[1] + Math.sin(state.clock.elapsedTime * 1.5 + node.coordinates[0]) * 0.5;
      
      const scaleVal = clicked ? 2.0 : hovered ? 1.4 : 1.0;
      targetScale.set(scaleVal, scaleVal, scaleVal);
      easing.damp3(groupRef.current.scale, targetScale, 0.15, delta);
    }
    if (crystalRef.current) {
      crystalRef.current.rotation.y += delta * 1.2;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z -= delta * 2.0;
    }
    if (pulseRingRef.current) {
      const pulse = 1.0 + Math.sin(state.clock.elapsedTime * 3) * 0.3;
      pulseRingRef.current.scale.set(pulse, pulse, pulse);
      (pulseRingRef.current.material as THREE.MeshBasicMaterial).opacity = 0.3 + Math.sin(state.clock.elapsedTime * 3) * 0.2;
    }
    if (materialRef.current) {
      const baseIntensity = hovered ? 3.5 : 1.0 + Math.sin(state.clock.elapsedTime * 3 + index) * 0.4;
      easing.damp(materialRef.current, "emissiveIntensity", baseIntensity, 0.1, delta);
    }
  });

  return (
    <group 
      ref={groupRef} 
      position={node.coordinates}
      onClick={(e) => {
        e.stopPropagation();
        triggerHaptic("light");
        audioEngine.playModalOpen();
        setClicked(true);
        setTimeout(() => {
          onSelect?.(node);
          setClicked(false);
        }, 250);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        // Audio frequency modulation on hover
        audioEngine.playCrystallinePing(600 + index * 180);
        setHoveringInteractive(true);
      }}
      onPointerOut={() => {
        setHovered(false);
        setHoveringInteractive(false);
      }}
    >
      {/* Invisible enlarged hitbox */}
      <mesh>
        <sphereGeometry args={[5, 8, 8]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* Floating Hexagonal Crystalline Pillar */}
      <mesh ref={crystalRef} castShadow>
        <cylinderGeometry args={[1.5, 1.5, 5.0, 6]} />
        <meshPhysicalMaterial 
          ref={materialRef}
          color={node.color || "#00F0FF"} 
          transmission={0.9} 
          opacity={!isActiveObjective ? 0.4 : 1} 
          transparent 
          roughness={0.05} 
          metalness={0.2}
          ior={1.6}
          emissive={node.color || "#00F0FF"}
          emissiveIntensity={1.0}
        />
      </mesh>

      {/* Persistent Cyan Pulse Affordance */}
      <mesh ref={pulseRingRef} rotation-x={Math.PI / 2} position={[0, -2, 0]}>
        <ringGeometry args={[2.0, 2.5, 32]} />
        <meshBasicMaterial color="#00F0FF" transparent opacity={0.5} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>

      {/* Crystalline Wireframe Cage */}
      {isActiveObjective && (
        <mesh>
          <cylinderGeometry args={[1.55, 1.55, 5.1, 6]} />
          <meshBasicMaterial color="#00F0FF" wireframe transparent opacity={hovered ? 0.9 : 0.3} />
        </mesh>
      )}

      {/* SCANNER HOLOGRAM (Tab Key) */}
      {isScannerActive && (
        <mesh scale={[1.3, 1.3, 1.3]}>
          <cylinderGeometry args={[1, 1, 4, 6]} />
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

      {/* Vertical Telemetry Data Stream Beam */}
      {isActiveObjective && (
        <mesh position={[0, -5, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 10, 8]} />
          <meshBasicMaterial color={node.color || "#00F0FF"} transparent opacity={hovered ? 0.7 : 0.15} blending={THREE.AdditiveBlending} />
        </mesh>
      )}

      {isActiveObjective && (
        <pointLight color={node.color || "#00F0FF"} intensity={hovered ? 5 : 1.5} distance={12} />
      )}

      {/* Holographic Category & Topic Label */}
      <Html position={[0, 4.0, 0]} center distanceFactor={25}>
        <div className={`transition-all duration-300 pointer-events-none flex flex-col items-center ${
          !isActiveObjective ? "opacity-30" : "opacity-100"
        }`}>
          <div className={`px-3 py-1.5 rounded-t border backdrop-blur-md text-sm font-mono whitespace-nowrap tracking-wider font-bold ${
            hovered 
              ? "bg-cyan-950/95 border-cyan-400 text-cyan-200 shadow-[0_0_20px_rgba(0,240,255,0.6)] scale-110" 
              : "bg-slate-900/90 border-cyan-500/50 text-cyan-400 bg-black/80"
          }`}>
            ▶ {node.topic}
          </div>
          {hovered && (
            <div className="bg-emerald-950/90 border border-t-0 border-emerald-500/50 px-3 py-1 rounded-b text-[10px] uppercase tracking-widest text-emerald-400 font-bold animate-pulse-fast">
              ◉ INSPECT
            </div>
          )}
        </div>
      </Html>
    </group>
  );
}

export default function PlanetSynthesis({ onSelectNode }: PlanetSynthesisProps) {
  const beltGroupRef = useRef<THREE.Group>(null);
  
  const currentChapter = useMissionStore(state => state.currentChapter);
  const isScannerActive = useMissionStore(state => state.isScannerActive);
  const isIdle = useMissionStore(state => state.isIdle);

  useFrame((_, delta) => {
    if (beltGroupRef.current) {
      beltGroupRef.current.rotation.z += delta * 0.005;
    }
  });

  return (
    <group ref={beltGroupRef} position={[0, 0, 0]}>
      {/* --- CENTRAL NEURAL HUB STRUCTURE (Crystalline High-Tech Palette #00F0FF / #3B82F6) --- */}
      <mesh position={[0, 0, -215]}>
        <sphereGeometry args={[6, 32, 32]} />
        <meshPhysicalMaterial 
          color="#0A1128" 
          roughness={0.1} 
          metalness={0.95}
          emissive="#1D4ED8"
          emissiveIntensity={0.6}
          transmission={0.5}
          wireframe
        />
      </mesh>
      
      <pointLight position={[0, 0, -215]} color="#00F0FF" intensity={8} distance={60} />
      
      {/* Deep Blue/Cyan structured atmospheric dust */}
      <group position={[0, 0, -215]}>
        <Sparkles count={200} scale={35} size={3} speed={0.2} color="#60A5FA" opacity={0.4} />
      </group>

      {/* --- FLOATING GEOMETRIC PILLARS (Synthesis-V Frameworks) --- */}
      {PRODUCT_THINKING_NODES.map((node, index) => {
        // Arrange them radially in a circle around the hub for immediate visibility
        const radius = 14;
        const angle = (index / PRODUCT_THINKING_NODES.length) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const z = -215 + Math.sin(angle) * radius;
        const radialNode = { ...node, coordinates: [x, 0, z] as [number, number, number] };
        
        return (
          <KnowledgeMonolith 
            key={radialNode.id} 
            node={radialNode} 
            index={index} 
            onSelect={onSelectNode}
            isActiveObjective={currentChapter === "SYNTHESIS_V" && index === 0}
            isScannerActive={isScannerActive}
            isIdle={isIdle}
          />
        );
      })}
    </group>
  );
}

export { PlanetSynthesis as PlanetLearning };
