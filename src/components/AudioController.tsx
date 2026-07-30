"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useScroll } from "@react-three/drei";
import { audioEngine } from "../lib/audioEngine";

export default function AudioController() {
  const scroll = useScroll();
  const prevOffset = useRef(0);

  useFrame((_, delta) => {
    const currentOffset = scroll.offset;
    const rawVel = (currentOffset - prevOffset.current) / (delta || 0.016);
    prevOffset.current = currentOffset;

    // Stream scroll progress and velocity to the Web Audio API synthesizer
    audioEngine.updateEnvironment(currentOffset, rawVel);
  });

  return null;
}
