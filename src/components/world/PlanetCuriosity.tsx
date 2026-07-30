"use client";

import { useRef, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Line, Html, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { easing } from "maath";
import { CURIOSITY_STORIES, CuriosityStory } from "../../data/missionData";
import { audioEngine } from "../../lib/audioEngine";
import { triggerHaptic } from "../../lib/haptics";

interface PlanetVeridianProps {
  onSelectStory?: (story: CuriosityStory) => void;
}

// Custom Fresnel Rim Glow Shader to eliminate bloom post-processing overhead and reduce draw calls
const fresnelShader = {
  uniforms: {
    glowColor: { value: new THREE.Color("#10B981") },
    coefficient: { value: 0.5 },
    power: { value: 2.2 }
  },
  vertexShader: `
    varying vec3 vNormal;
    varying vec3 vPositionNormal;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vPositionNormal = normalize((modelViewMatrix * vec4(position, 1.0)).xyz);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    varying vec3 vNormal;
    varying vec3 vPositionNormal;
    uniform vec3 glowColor;
    uniform float coefficient;
    uniform float power;
    void main() {
      float intensity = pow(coefficient + dot(vPositionNormal, vNormal), power);
      gl_FragColor = vec4(glowColor, intensity);
    }
  `
};

function StoryBeacon({ 
  story, 
  onSelect 
}: { 
  story: CuriosityStory; 
  onSelect?: (story: CuriosityStory) => void;
}) {
  const meshRef = useRef<THREE.Group>(null);
  const outerRingRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const [hovered, setHovered] = useState(false);
  const targetScale = useMemo(() => new THREE.Vector3(1, 1, 1), []);

  // Convert absolute world coordinates to planet-relative coordinates (Planet group is at [0, -2, -60])
  const relPos = useMemo(() => [
    story.coordinates[0] - 0,
    story.coordinates[1] - (-2),
    story.coordinates[2] - (-60)
  ] as [number, number, number], [story.coordinates]);

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Float bobbing around orbital path
      meshRef.current.position.y = relPos[1] + Math.sin(state.clock.elapsedTime * 2 + relPos[0]) * 0.4;
      
      // Smooth hover scale
      const scaleVal = hovered ? 1.6 : 1.0;
      targetScale.set(scaleVal, scaleVal, scaleVal);
      easing.damp3(meshRef.current.scale, targetScale, 0.15, delta);
    }
    if (outerRingRef.current) {
      outerRingRef.current.rotation.z += delta * 2;
      outerRingRef.current.rotation.x += delta * 1.5;
    }
    if (materialRef.current) {
      // Animate emissive intensity
      const baseIntensity = hovered ? 4.0 : 1.5 + Math.sin(state.clock.elapsedTime * 4) * 0.5;
      easing.damp(materialRef.current, "emissiveIntensity", baseIntensity, 0.1, delta);
    }
  });

  return (
    <group>
      {/* Gravitational Light Tether connecting beacon to Veridian Prime core */}
      <Line
        points={[[0, 0, 0], relPos]}
        color={hovered ? "#00F0FF" : "#10B981"}
        lineWidth={hovered ? 2.5 : 1.0}
        transparent
        opacity={hovered ? 0.85 : 0.25}
      />

      <group 
        ref={meshRef} 
        position={relPos}
        onClick={(e) => {
          e.stopPropagation();
          triggerHaptic("light");
          onSelect?.(story);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          audioEngine.playHoverPing();
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "auto";
        }}
      >
        {/* Invisible enlarged hitbox for reliable mobile/touch clicks */}
        <mesh>
          <sphereGeometry args={[2.5, 8, 8]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>

        {/* Hover Tooltip Label */}
        {hovered && (
          <Html position={[0, 2, 0]} center zIndexRange={[100, 0]} style={{ pointerEvents: "none" }}>
            <div className="bg-slate-900/90 border border-emerald-500/50 backdrop-blur-md px-3 py-1.5 rounded-md flex flex-col items-center min-w-[120px] shadow-[0_0_15px_rgba(16,185,129,0.3)] animate-pulse-fast">
              <span className="text-[9px] font-mono font-bold uppercase text-emerald-500 tracking-widest mb-0.5">Mission Objective</span>
              <span className="text-xs font-semibold text-white whitespace-nowrap text-center">{story.topic}</span>
              <span className="text-[10px] text-slate-300 mt-0.5">Click to Explore</span>
            </div>
          </Html>
        )}
        
        {/* Default State Label (when not hovered, to show it's an interactable) */}
        {!hovered && (
          <Html position={[0, 1.5, 0]} center zIndexRange={[100, 0]} style={{ pointerEvents: "none" }}>
            <div className="flex flex-col items-center opacity-70">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping mb-1" />
              <span className="text-[8px] font-mono text-emerald-500 tracking-widest uppercase shadow-black drop-shadow-md">Detected</span>
            </div>
          </Html>
        )}

        {/* Inner Glowing Core */}
        <mesh castShadow>
          <octahedronGeometry args={[0.9, 2]} />
          <meshStandardMaterial 
            ref={materialRef}
            color="#34D399" 
            emissive="#10B981" 
            emissiveIntensity={1.5} 
            roughness={0.2} 
            metalness={0.8} 
          />
        </mesh>

        {/* Outer Wireframe Energy Sphere */}
        <mesh ref={outerRingRef}>
          <icosahedronGeometry args={[hovered ? 1.8 : 1.5, 1]} />
          <meshBasicMaterial color="#6EE7B7" wireframe transparent opacity={hovered ? 0.9 : 0.4} />
        </mesh>

        {/* Point Light beacon */}
        <pointLight color="#10B981" intensity={hovered ? 5 : 2} distance={8} />
      </group>
    </group>
  );
}

import { useMissionStore } from "../../store/missionStore";

export default function PlanetVeridian({ onSelectStory }: PlanetVeridianProps) {
  const planetRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const ringGroupRef = useRef<THREE.Group>(null);
  const planetMaterialRef = useRef<THREE.MeshStandardMaterial>(null);
  const shaderUniforms = useMemo(() => THREE.UniformsUtils.clone(fresnelShader.uniforms), []);
  
  const currentChapter = useMissionStore(state => state.currentChapter);
  const isScannerActive = useMissionStore(state => state.isScannerActive);
  const isIdle = useMissionStore(state => state.isIdle);
  const isActiveObjective = currentChapter === "PLANET_CURIOSITY";

  useFrame((state, delta) => {
    if (planetRef.current) {
      planetRef.current.rotation.y += delta * 0.04;
    }
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y -= delta * 0.02;
    }
    if (ringGroupRef.current) {
      ringGroupRef.current.rotation.z += delta * 0.01;
    }
    if (planetMaterialRef.current) {
      const targetIntensity = isActiveObjective ? 1.0 + Math.sin(state.clock.elapsedTime * 2) * 0.5 : 0.2;
      planetMaterialRef.current.emissiveIntensity = targetIntensity;
    }
  });

  return (
    <group position={[0, -2, -60]}>
      {/* --- PLANET BODY (Veridian Prime Golden Empathy Palette) --- */}
      <group
        onClick={(e) => {
          e.stopPropagation();
          onSelectStory?.(CURIOSITY_STORIES[0]);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "auto";
        }}
      >
        {/* Invisible enlarged hitbox */}
        <mesh visible={false}>
          <sphereGeometry args={[20, 16, 16]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>

        <mesh ref={planetRef} receiveShadow castShadow>
          <sphereGeometry args={[14, 64, 64]} />
          <meshStandardMaterial 
            ref={planetMaterialRef}
            color="#059669" 
            roughness={0.6} 
            metalness={0.15}
            emissive="#064E3B"
            emissiveIntensity={0.2}
            transparent
            opacity={!isActiveObjective && currentChapter !== "LAUNCHPAD" ? 0.4 : 1}
          />
        </mesh>

        {/* --- CUSTOM FRESNEL VERTEX RIM GLOW SHADER --- */}
        <mesh ref={atmosphereRef} scale={[1.06, 1.06, 1.06]}>
          <sphereGeometry args={[14, 32, 32]} />
          <shaderMaterial
            args={[fresnelShader]}
            uniforms={shaderUniforms}
            transparent
            blending={THREE.AdditiveBlending}
            side={THREE.BackSide}
            depthWrite={false}
          />
        </mesh>
      </group>

      {/* --- FLOATING SPORES / PARTICLES --- */}
      {isActiveObjective && (
        <Sparkles count={150} scale={40} size={6} speed={0.4} color="#34D399" opacity={0.6} />
      )}

      {/* --- SCANNER HOLOGRAM (Tab Key) --- */}
      {isScannerActive && (
        <mesh scale={[1.1, 1.1, 1.1]}>
          <sphereGeometry args={[14, 32, 32]} />
          <meshBasicMaterial color="#00F0FF" wireframe transparent opacity={0.6} />
        </mesh>
      )}

      {/* --- AURA WAYPOINT BEAM (Idle) --- */}
      {isActiveObjective && isIdle && (
        <mesh position={[0, 40, 0]}>
          <cylinderGeometry args={[0.5, 0.5, 80, 16]} />
          <meshBasicMaterial color="#00F0FF" transparent opacity={0.6} blending={THREE.AdditiveBlending} />
        </mesh>
      )}

      {/* --- ORBITAL RINGS --- */}
      <group ref={ringGroupRef} rotation={[0.4, 0.2, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <ringGeometry args={[18, 28, 64]} />
          <meshStandardMaterial 
            color="#10B981" 
            side={THREE.DoubleSide} 
            transparent 
            opacity={!isActiveObjective && currentChapter !== "LAUNCHPAD" ? 0.2 : 0.65} 
            roughness={0.3}
            metalness={0.4}
          />
        </mesh>
        
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.1, 0]}>
          <ringGeometry args={[29, 34, 64]} />
          <meshBasicMaterial 
            color="#34D399" 
            side={THREE.DoubleSide} 
            transparent 
            opacity={!isActiveObjective && currentChapter !== "LAUNCHPAD" ? 0.1 : 0.35} 
            wireframe 
          />
        </mesh>
      </group>

      {/* --- 5 ORBITAL STORY BEACONS --- */}
      {isActiveObjective && CURIOSITY_STORIES.map((story) => (
        <StoryBeacon key={story.id} story={story} onSelect={onSelectStory} />
      ))}
    </group>
  );
}

export { PlanetVeridian as PlanetCuriosity };
