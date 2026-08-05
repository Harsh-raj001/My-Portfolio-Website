"use client";

import { useEffect, useState } from "react";
import { useMissionStore } from "../../store/missionStore";
import { motion } from "framer-motion";

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  const isHovering = useMissionStore(state => state.isHoveringInteractive);

  useEffect(() => {
    // Gracefully degrade on touch devices
    const checkTouch = () => {
      setIsTouchDevice(window.matchMedia("(pointer: coarse)").matches || "ontouchstart" in window);
    };
    checkTouch();
    window.addEventListener("resize", checkTouch);

    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };
    
    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    return () => {
      window.removeEventListener("resize", checkTouch);
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
    };
  }, [isVisible]);

  // Hide the default OS cursor when the custom cursor is active
  useEffect(() => {
    if (!isTouchDevice && isVisible) {
      document.documentElement.style.cursor = "none";
      document.body.style.cursor = "none";
    } else {
      document.documentElement.style.cursor = "auto";
      document.body.style.cursor = "auto";
    }
    return () => {
      document.documentElement.style.cursor = "auto";
      document.body.style.cursor = "auto";
    };
  }, [isTouchDevice, isVisible]);

  if (isTouchDevice || !isVisible) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full border-2 border-cyan-400 mix-blend-screen"
      animate={{
        x: position.x - (isHovering ? 20 : 12),
        y: position.y - (isHovering ? 20 : 12),
        width: isHovering ? 40 : 24,
        height: isHovering ? 40 : 24,
        scale: isHovering ? [1, 1.1, 1] : 1,
        opacity: isHovering ? 0.9 : 0.5,
      }}
      transition={{
        type: "spring",
        stiffness: 800,
        damping: 35,
        mass: 0.5,
        scale: {
          repeat: isHovering ? Infinity : 0,
          duration: 0.8,
          ease: "easeInOut"
        }
      }}
      style={{
        boxShadow: isHovering ? "0 0 20px rgba(0, 240, 255, 0.8), inset 0 0 10px rgba(0, 240, 255, 0.4)" : "0 0 8px rgba(0, 240, 255, 0.3)",
      }}
    />
  );
}
