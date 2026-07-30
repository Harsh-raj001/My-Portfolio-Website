"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useScroll } from "@react-three/drei";
import * as THREE from "three";
import { easing } from "maath";
import { audioEngine } from "../../lib/audioEngine";
import { qualitySettings } from "../../lib/qualityTier";

const MAX_THRUSTER_PARTICLES = 60;
const STATIC_THRUSTER_PARTICLES = (() => {
  const pos = new Float32Array(MAX_THRUSTER_PARTICLES * 3);
  for (let i = 0; i < MAX_THRUSTER_PARTICLES; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 0.5;      // X: -0.25 to 0.25
    pos[i * 3 + 1] = (Math.random() - 0.5) * 0.5;  // Y: -0.25 to 0.25
    pos[i * 3 + 2] = -2.0 - Math.random() * 8.0;   // Z: -2.0 to -10.0
  }
  return pos;
})();

// Spacecraft thruster exhaust particles (count scaled by quality tier)
function ThrusterExhaustParticles({ velocityRef }: { velocityRef: React.MutableRefObject<number> }) {
  const pointsRef = useRef<THREE.Points>(null);
  const particleCount = useMemo(() => Math.max(10, Math.round(60 * qualitySettings.particleMultiplier)), []);

  const particlePositions = useMemo(() => {
    return STATIC_THRUSTER_PARTICLES.slice(0, particleCount * 3);
  }, [particleCount]);

  useFrame((_, delta) => {
    if (pointsRef.current && pointsRef.current.geometry.attributes.position) {
      const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
      const speed = 10 + Math.abs(velocityRef.current) * 60;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 2] -= delta * speed;
        if (positions[i * 3 + 2] < -15.0) {
          positions[i * 3 + 2] = -2.0;
          positions[i * 3] = (Math.random() - 0.5) * 0.4;
          positions[i * 3 + 1] = (Math.random() - 0.5) * 0.4;
        }
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
      
      const mat = pointsRef.current.material as THREE.PointsMaterial;
      mat.size = 0.2 + Math.abs(velocityRef.current) * 0.3;
      mat.opacity = Math.min(0.9, 0.4 + Math.abs(velocityRef.current) * 0.5);
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
        color="#00F0FF"
        size={0.25}
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function Spacecraft() {
  const scroll = useScroll();
  const groupRef = useRef<THREE.Group>(null);
  const leftWingRef = useRef<THREE.Group>(null);
  const rightWingRef = useRef<THREE.Group>(null);
  const radarRef = useRef<THREE.Group>(null);
  const dorsalFinsRef = useRef<THREE.Group>(null);
  const dockingClampsRef = useRef<THREE.Group>(null);
  const thrusterPlumeRef = useRef<THREE.Mesh>(null);
  const thrusterLightRef = useRef<THREE.PointLight>(null);

  // Store previous scroll offset to calculate real-time scroll velocity
  const prevOffset = useRef(0);
  const velocity = useRef(0);

  // Reusable vector and color objects to prevent garbage collection in useFrame (AAA Performance rule)
  const targetPos = useMemo(() => new THREE.Vector3(), []);
  const targetRot = useMemo(() => new THREE.Euler(), []);
  const thrusterColorWarm = useMemo(() => new THREE.Color("#ffaa55"), []);
  const thrusterColorCool = useMemo(() => new THREE.Color("#00f0ff"), []);
  const thrusterColorGold = useMemo(() => new THREE.Color("#f59e0b"), []);
  const clampPos = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const currentOffset = scroll.offset;
    // Calculate scroll velocity (change in offset per second)
    const rawVel = (currentOffset - prevOffset.current) / (delta || 0.016);
    prevOffset.current = currentOffset;

    // Smooth velocity for banking and thruster responsiveness
    easing.damp(velocity, "current", rawVel, 0.15, delta);
    const vel = velocity.current;

    // Connect real-time scroll velocity and progress directly to Web Audio API rumble and filter
    audioEngine.updateEnvironment(currentOffset, vel);

    // 1. Calculate Z-position along the career timeline (Z goes from 0 down to -350)
    const zPos = -currentOffset * 350;
    
    // Add organic vertical bobbing and slight lateral weave based on timeline
    const bobbingY = Math.sin(state.clock.elapsedTime * 1.5) * 0.2;
    const weaveX = Math.cos(state.clock.elapsedTime * 0.8) * 0.3;

    targetPos.set(weaveX, bobbingY, zPos);
    easing.damp3(groupRef.current.position, targetPos, 0.2, delta);

    // 2. Dynamic Banking and Pitching based on scroll velocity and movement
    const targetPitch = Math.max(-0.3, Math.min(0.3, vel * -1.5)) + Math.sin(state.clock.elapsedTime * 1.5) * 0.05;
    const targetRoll = Math.max(-0.4, Math.min(0.4, vel * -2.0)) + weaveX * 0.1;
    const targetYaw = weaveX * -0.1;

    targetRot.set(targetPitch, targetYaw, targetRoll);
    easing.dampE(groupRef.current.rotation, targetRot, 0.25, delta);

    // 3. Unfolding Solar Panels (Deploy when leaving Launch area, progress > 0.08)
    const panelDeployTarget = currentOffset > 0.08 ? Math.PI / 2 : 0;
    if (leftWingRef.current && rightWingRef.current) {
      easing.damp(leftWingRef.current.rotation, "z", panelDeployTarget, 0.3, delta);
      easing.damp(rightWingRef.current.rotation, "z", -panelDeployTarget, 0.3, delta);
    }

    // 4. Structural Evolution: Folding Sensor Radar Dishes & Dorsal Fins (Sector 04 Synthesis-V, progress > 0.38)
    const finDeployTarget = currentOffset > 0.38 ? Math.PI / 3 : 0;
    if (dorsalFinsRef.current) {
      easing.damp(dorsalFinsRef.current.rotation, "x", -finDeployTarget, 0.25, delta);
    }

    // 5. Structural Evolution: Extending Forward Docking Clamps (Sector 06 Nexus-7, progress > 0.65)
    const clampTargetZ = currentOffset > 0.65 ? 2.3 : 1.8;
    if (dockingClampsRef.current) {
      clampPos.set(0, 0, clampTargetZ);
      easing.damp3(dockingClampsRef.current.position, clampPos, 0.2, delta);
    }

    // 6. Autonomous Navigation Radar Rotation
    if (radarRef.current) {
      radarRef.current.rotation.y += delta * 1.5;
    }

    // 7. Thruster Plume & Engine Glow Responsiveness
    if (thrusterPlumeRef.current && thrusterLightRef.current) {
      const idlePulse = 0.8 + Math.sin(state.clock.elapsedTime * 10) * 0.2;
      const plumeScaleZ = Math.max(idlePulse, Math.min(4.0, idlePulse + Math.abs(vel) * 15));
      const plumeScaleXY = Math.max(0.7, Math.min(1.4, 0.8 + Math.abs(vel) * 3));
      
      easing.damp3(thrusterPlumeRef.current.scale, [plumeScaleXY, plumeScaleXY, plumeScaleZ], 0.1, delta);

      // Color lerping across chapters
      let activeColor = thrusterColorWarm;
      if (currentOffset > 0.38 && currentOffset <= 0.68) {
        activeColor = thrusterColorCool;
      } else if (currentOffset > 0.68) {
        activeColor = thrusterColorGold;
      }

      if (thrusterPlumeRef.current.material instanceof THREE.MeshBasicMaterial) {
        thrusterPlumeRef.current.material.color.lerp(activeColor, delta * 3);
      }
      thrusterLightRef.current.color.lerp(activeColor, delta * 3);
      thrusterLightRef.current.intensity = 2.0 + Math.abs(vel) * 20;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* 🚀 PHASE 8: SPACECRAFT PLASMA THRUSTER EXHAUST TRAILS */}
      <ThrusterExhaustParticles velocityRef={velocity} />

      {/* --- MAIN FUSELAGE HULL (Anodized Matte Aluminum Shader) --- */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.5, 0.7, 3.0, 16]} />
        <meshStandardMaterial 
          color="#8E9AAF" 
          metalness={0.85} 
          roughness={0.35} 
          envMapIntensity={1.5}
        />
      </mesh>

      {/* --- COCKPIT / NOSE CONE --- */}
      <mesh position={[0, 0, 1.8]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <coneGeometry args={[0.5, 1.2, 16]} />
        <meshStandardMaterial 
          color="#1e293b" 
          metalness={0.9} 
          roughness={0.1}
        />
      </mesh>
      {/* Cockpit Glass Viewport */}
      <mesh position={[0, 0.35, 1.6]} rotation={[Math.PI / 2 - 0.2, 0, 0]}>
        <boxGeometry args={[0.4, 0.6, 0.2]} />
        <meshPhysicalMaterial 
          color="#00F0FF" 
          transmission={0.8} 
          opacity={1} 
          transparent 
          roughness={0.05} 
          ior={1.5}
          emissive="#00F0FF"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* --- ROTATING NAVIGATION RADAR DISH --- */}
      <group ref={radarRef} position={[0, 0.65, 0.2]}>
        <mesh position={[0, 0.2, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.4, 8]} />
          <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.4, 0]} rotation={[0.4, 0, 0]}>
          <torusGeometry args={[0.25, 0.03, 8, 16, Math.PI]} />
          <meshStandardMaterial color="#f8fafc" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>

      {/* --- STRUCTURAL EVOLUTION: DORSAL SENSOR RADAR FIN (Deploys at Sector 04) --- */}
      <group ref={dorsalFinsRef} position={[0, 0.52, -0.5]}>
        <mesh position={[0, 0.3, 0]} rotation={[0, 0, 0]}>
          <boxGeometry args={[0.06, 0.6, 0.3]} />
          <meshStandardMaterial color="#00F0FF" metalness={0.8} roughness={0.2} emissive="#00F0FF" emissiveIntensity={0.3} />
        </mesh>
      </group>

      {/* --- STRUCTURAL EVOLUTION: FORWARD DOCKING CLAMPS (Deploys at Sector 06) --- */}
      <group ref={dockingClampsRef} position={[0, 0, 1.8]}>
        <mesh position={[-0.3, -0.1, 0]}>
          <boxGeometry args={[0.08, 0.08, 0.5]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0.3, -0.1, 0]}>
          <boxGeometry args={[0.08, 0.08, 0.5]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* --- LEFT UNFOLDING SOLAR ARRAY WING --- */}
      <group position={[-0.6, 0, 0]}>
        <group ref={leftWingRef} rotation={[0, 0, 0]}>
          <mesh position={[-0.4, 0, 0]}>
            <boxGeometry args={[0.8, 0.08, 0.2]} />
            <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.3} />
          </mesh>
          <mesh position={[-1.5, 0, 0]} castShadow>
            <boxGeometry args={[1.8, 0.04, 1.2]} />
            <meshStandardMaterial 
              color="#0284c7" 
              metalness={0.9} 
              roughness={0.2} 
              emissive="#0369a1" 
              emissiveIntensity={0.4} 
            />
          </mesh>
          <mesh position={[-1.5, 0.025, 0]}>
            <boxGeometry args={[1.7, 0.01, 1.1]} />
            <meshBasicMaterial color="#38bdf8" wireframe />
          </mesh>
        </group>
      </group>

      {/* --- RIGHT UNFOLDING SOLAR ARRAY WING --- */}
      <group position={[0.6, 0, 0]}>
        <group ref={rightWingRef} rotation={[0, 0, 0]}>
          <mesh position={[0.4, 0, 0]}>
            <boxGeometry args={[0.8, 0.08, 0.2]} />
            <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.3} />
          </mesh>
          <mesh position={[1.5, 0, 0]} castShadow>
            <boxGeometry args={[1.8, 0.04, 1.2]} />
            <meshStandardMaterial 
              color="#0284c7" 
              metalness={0.9} 
              roughness={0.2} 
              emissive="#0369a1" 
              emissiveIntensity={0.4} 
            />
          </mesh>
          <mesh position={[1.5, 0.025, 0]}>
            <boxGeometry args={[1.7, 0.01, 1.1]} />
            <meshBasicMaterial color="#38bdf8" wireframe />
          </mesh>
        </group>
      </group>

      {/* --- ION THRUSTERS & REAR ASSEMBLY --- */}
      <mesh position={[0, 0, -1.6]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.55, 0.45, 0.4, 16]} />
        <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} />
      </mesh>
      
      {/* Thruster Ion Plume (Reactive Cone) */}
      <mesh 
        ref={thrusterPlumeRef} 
        position={[0, 0, -2.5]} 
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <coneGeometry args={[0.4, 1.5, 16]} />
        <meshBasicMaterial 
          color="#ffaa55" 
          transparent 
          opacity={0.8} 
          blending={THREE.AdditiveBlending} 
        />
      </mesh>

      {/* Dynamic Engine Point Light */}
      <pointLight 
        ref={thrusterLightRef} 
        position={[0, 0, -2.0]} 
        color="#ffaa55" 
        intensity={3.0} 
        distance={15} 
      />
    </group>
  );
}
