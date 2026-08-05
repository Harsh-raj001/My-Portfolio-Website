"use client";

import { useRef, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Instances, Instance, Html } from "@react-three/drei";
import * as THREE from "three";
import { easing } from "maath";
import { PORTFOLIO_PROJECTS } from "../../data/missionData";
import { PortfolioProject } from "../../types/mission";
import { audioEngine } from "../../lib/audioEngine";
import { triggerHaptic } from "../../lib/haptics";
import { useMissionStore } from "../../store/missionStore";

interface OrbitalCityNexusProps {
  onSelectLab?: (lab: PortfolioProject) => void;
}

function ProductLabModule({ 
  lab, 
  onSelect,
  isActiveObjective,
  isScannerActive,
  isIdle
}: { 
  lab: PortfolioProject; 
  onSelect?: (lab: PortfolioProject) => void;
  isActiveObjective: boolean;
  isScannerActive: boolean;
  isIdle: boolean;
}) {
  const moduleRef = useRef<THREE.Group>(null);
  const viewportRef = useRef<THREE.Mesh>(null);
  const pulseRingRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshPhysicalMaterial>(null);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const setHoveringInteractive = useMissionStore(state => state.setHoveringInteractive);
  const targetScale = useMemo(() => new THREE.Vector3(1, 1, 1), []);

  useFrame((state, delta) => {
    if (moduleRef.current) {
      // Gentle floating in orbital city docking bay
      moduleRef.current.position.y = lab.coordinates[1] + Math.sin(state.clock.elapsedTime * 2 + lab.coordinates[0]) * 0.3;
      
      const scaleVal = clicked ? 1.6 : hovered ? 1.25 : 1.0;
      targetScale.set(scaleVal, scaleVal, scaleVal);
      easing.damp3(moduleRef.current.scale, targetScale, 0.15, delta);
    }
    
    if (pulseRingRef.current) {
      const pulse = 1.0 + Math.sin(state.clock.elapsedTime * 3) * 0.3;
      pulseRingRef.current.scale.set(pulse, pulse, pulse);
      (pulseRingRef.current.material as THREE.MeshBasicMaterial).opacity = 0.3 + Math.sin(state.clock.elapsedTime * 3) * 0.2;
    }

    if (materialRef.current) {
      const baseIntensity = hovered ? 3.0 : 1.0 + Math.sin(state.clock.elapsedTime * 4 + lab.coordinates[0]) * 0.5;
      easing.damp(materialRef.current, "emissiveIntensity", baseIntensity, 0.1, delta);
    }
  });

  return (
    <group 
      ref={moduleRef} 
      position={lab.coordinates}
      onClick={(e) => {
        e.stopPropagation();
        triggerHaptic("light");
        audioEngine.playModalOpen();
        setClicked(true);
        setTimeout(() => {
          onSelect?.(lab);
          setClicked(false);
        }, 250);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        audioEngine.playHoverPing();
        setHoveringInteractive(true);
      }}
      onPointerOut={() => {
        setHovered(false);
        setHoveringInteractive(false);
      }}
    >
      {/* Invisible enlarged hitbox */}
      <mesh>
        <boxGeometry args={[8, 6, 6]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* Persistent Cyan Pulse Affordance */}
      <mesh ref={pulseRingRef} rotation-x={Math.PI / 2} position={[0, -2.5, 0]}>
        <ringGeometry args={[3.2, 3.8, 32]} />
        <meshBasicMaterial color="#00F0FF" transparent opacity={0.5} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>

      {/* Module Exterior Hull (Industrial Cyberpunk Palette) */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[5, 3.5, 4]} />
        <meshStandardMaterial 
          color="#1E293B" 
          metalness={0.85} 
          roughness={0.2} 
          transparent
          opacity={!isActiveObjective ? 0.3 : 1.0}
        />
      </mesh>

      {/* Docking Ring Frame */}
      <mesh position={[0, 0, 2.05]}>
        <ringGeometry args={[1.2, 1.8, 32]} />
        <meshStandardMaterial color="#059669" metalness={0.9} roughness={0.1} transparent opacity={!isActiveObjective ? 0.2 : 1.0} />
      </mesh>

      {/* Glass Viewport exposing internal holographic server */}
      <mesh ref={viewportRef} position={[0, 0, 2.02]}>
        <circleGeometry args={[1.2, 32]} />
        <meshPhysicalMaterial 
          ref={materialRef}
          color={hovered ? "#34D399" : "#10B981"} 
          transmission={0.85} 
          opacity={!isActiveObjective ? 0.2 : 1} 
          transparent 
          roughness={0.05}
          ior={1.5}
          emissive={hovered ? "#34D399" : "#059669"}
          emissiveIntensity={1.0}
        />
      </mesh>

      {/* SCANNER HOLOGRAM (Tab Key) */}
      {isScannerActive && (
        <mesh scale={[1.1, 1.1, 1.1]}>
          <boxGeometry args={[5, 3.5, 4]} />
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

      {/* Interior Holographic Core Matrix */}
      {isActiveObjective && (
        <mesh position={[0, 0, 0]} rotation={[Math.PI / 4, Math.PI / 4, 0]}>
          <octahedronGeometry args={[1.0, 0]} />
          <meshBasicMaterial 
            color={hovered ? "#34D399" : "#10B981"} 
            wireframe 
          />
        </mesh>
      )}

      {/* Module Navigation Cyberpunk Beacon */}
      {isActiveObjective && (
        <pointLight 
          color={hovered ? "#34D399" : "#10B981"} 
          intensity={hovered ? 6 : 2} 
          distance={14} 
        />
      )}

      {/* Floating Label (Fades in on hover) */}
      <Html position={[0, 4.0, 0]} center zIndexRange={[100, 0]} style={{ pointerEvents: "none", opacity: hovered ? 1 : 0, transition: "opacity 0.2s" }}>
        <div className="bg-slate-950/90 border border-cyan-500/50 backdrop-blur-md px-3 py-1.5 rounded-md flex flex-col items-center min-w-[140px] shadow-[0_0_15px_rgba(0,240,255,0.3)]">
          <span className="text-[10px] font-mono font-bold uppercase text-cyan-400 tracking-widest mb-0.5">◉ INSPECT</span>
          <span className="text-xs font-semibold text-white whitespace-nowrap text-center">{lab.topic}</span>
        </div>
      </Html>

      {/* Default State Label */}
      {!hovered && isActiveObjective && (
        <Html position={[0, 2.8, 0]} center distanceFactor={25}>
          <div className="flex flex-col items-center opacity-80 pointer-events-none">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping mb-1" />
            <div className="bg-slate-900/80 border border-emerald-600/40 px-3 py-1 rounded backdrop-blur-md text-xs font-mono whitespace-nowrap tracking-wider text-emerald-400/80 uppercase">
              [{lab.type === "PRODUCT" ? "PRODUCT" : "CASE STUDY"}]: {lab.topic}
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

export default function OrbitalCityNexus({ onSelectLab }: OrbitalCityNexusProps) {
  const stationCoreRef = useRef<THREE.Group>(null);
  const habitatRing1Ref = useRef<THREE.Group>(null);
  const habitatRing2Ref = useRef<THREE.Group>(null);
  const radarArrayRef = useRef<THREE.Group>(null);
  
  const currentChapter = useMissionStore(state => state.currentChapter);
  const isScannerActive = useMissionStore(state => state.isScannerActive);
  const isIdle = useMissionStore(state => state.isIdle);

  useFrame((state, delta) => {
    if (habitatRing1Ref.current) {
      habitatRing1Ref.current.rotation.z += delta * 0.25;
    }
    if (habitatRing2Ref.current) {
      habitatRing2Ref.current.rotation.z -= delta * 0.22;
    }
    if (radarArrayRef.current) {
      radarArrayRef.current.rotation.y += delta * 0.8;
    }
  });

  return (
    <group position={[0, 0, -360]}>
      {/* --- STATION CENTRAL CORE (Industrial Cyberpunk Palette #10B981 / #059669) --- */}
      <group ref={stationCoreRef} rotation={[Math.PI / 2, 0, 0]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[5, 5, 45, 32]} />
          <meshStandardMaterial color="#334155" metalness={0.85} roughness={0.2} />
        </mesh>
        
        {/* Glowing Energy Core Conduit */}
        <mesh scale={[1.02, 1.0, 1.02]}>
          <cylinderGeometry args={[5.1, 5.1, 15, 32, 1, true]} />
          <meshBasicMaterial 
            color="#10B981" 
            wireframe 
            transparent 
            opacity={0.3} 
          />
        </mesh>
      </group>
      {/* --- ROTATING HABITAT RING 1 --- */}
      <group ref={habitatRing1Ref} position={[0, 0, -10]}>
        <mesh receiveShadow castShadow>
          <torusGeometry args={[22, 1.8, 16, 64]} />
          <meshStandardMaterial color="#475569" metalness={0.85} roughness={0.25} />
        </mesh>
        <mesh scale={[1.01, 1.01, 1.01]}>
          <torusGeometry args={[22, 1.7, 8, 64]} />
          <meshBasicMaterial color="#059669" wireframe transparent opacity={0.55} />
        </mesh>
        
        {/* INSTANCED MESH SPOKES */}
        <Instances limit={4} range={4}>
          <cylinderGeometry args={[0.4, 0.4, 22, 8]} />
          <meshStandardMaterial color="#1E293B" metalness={0.8} roughness={0.3} />
          {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((angle, idx) => (
            <Instance key={idx} rotation={[0, 0, angle]} position={[0, 11, 0]} />
          ))}
        </Instances>
        
        {/* Blinking Traffic Lights on Ring 1 */}
        {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((angle, idx) => (
          <mesh key={`light-${idx}`} position={[Math.cos(angle) * 22, Math.sin(angle) * 22, 2]}>
            <sphereGeometry args={[0.5, 8, 8]} />
            <meshBasicMaterial color="#EF4444" transparent opacity={0.8} />
          </mesh>
        ))}
      </group>

      {/* --- ROTATING HABITAT RING 2 (COUNTER-ROTATING) --- */}
      <group ref={habitatRing2Ref} position={[0, 0, 10]}>
        <mesh receiveShadow castShadow>
          <torusGeometry args={[28, 1.5, 16, 64]} />
          <meshStandardMaterial color="#334155" metalness={0.85} roughness={0.2} />
        </mesh>
        <mesh scale={[1.01, 1.01, 1.01]}>
          <torusGeometry args={[28, 1.4, 8, 64]} />
          <meshBasicMaterial color="#10B981" wireframe transparent opacity={0.45} />
        </mesh>
        
        {/* INSTANCED MESH SPOKES FOR RING 2 */}
        <Instances limit={4} range={4}>
          <cylinderGeometry args={[0.3, 0.3, 28, 8]} />
          <meshStandardMaterial color="#1E293B" metalness={0.8} roughness={0.3} />
          {[Math.PI / 4, Math.PI * 0.75, Math.PI * 1.25, Math.PI * 1.75].map((angle, idx) => (
            <Instance key={idx} rotation={[0, 0, angle]} position={[0, 14, 0]} />
          ))}
        </Instances>
        
        {/* Blinking Traffic Lights on Ring 2 */}
        {[Math.PI / 4, Math.PI * 0.75, Math.PI * 1.25, Math.PI * 1.75].map((angle, idx) => (
          <mesh key={`light2-${idx}`} position={[Math.cos(angle) * 28, Math.sin(angle) * 28, -2]}>
            <sphereGeometry args={[0.5, 8, 8]} />
            <meshBasicMaterial color="#3B82F6" transparent opacity={0.8} />
          </mesh>
        ))}
      </group>

      {/* --- DOCKING GANTRIES & RADAR ARRAY --- */}
      <group ref={radarArrayRef} position={[0, 24, 0]}>
        <mesh>
          <cylinderGeometry args={[0.2, 0.2, 8, 8]} />
          <meshStandardMaterial color="#64748B" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[0, 4, 0]} rotation={[0.5, 0, 0]}>
          <torusGeometry args={[3, 0.2, 16, 32, Math.PI * 1.5]} />
          <meshStandardMaterial color="#10B981" metalness={0.9} roughness={0.1} emissive="#059669" emissiveIntensity={0.5} />
        </mesh>
      </group>

      {/* --- 3 INTERACTIVE PRODUCT LABORATORY DOCKING BAYS --- */}
      {PORTFOLIO_PROJECTS.map((lab, idx) => (
        <ProductLabModule 
          key={lab.id} 
          lab={lab} 
          onSelect={onSelectLab}
          isActiveObjective={currentChapter === "ORBITAL_NEXUS" && idx === 0}
          isScannerActive={isScannerActive}
          isIdle={isIdle}
        />
      ))}

      {/* Station Master Cyberpunk Flood Lights */}
      <pointLight position={[0, 0, 0]} color="#10B981" intensity={15} distance={80} />
      <pointLight position={[0, 0, -20]} color="#059669" intensity={12} distance={60} />
    </group>
  );
}

export { OrbitalCityNexus as BuilderStation };
