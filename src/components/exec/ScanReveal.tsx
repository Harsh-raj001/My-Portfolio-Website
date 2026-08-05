"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface ScanRevealProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export default function ScanReveal({ children, className = "", id }: ScanRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.section
      id={id}
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: { opacity: 0, y: 10 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.35,
            ease: [0.22, 1, 0.36, 1]
          }
        }
      }}
    >
      {/* Sci-fi scanning beam effect on reveal */}
      <motion.div
        className="absolute left-0 right-0 top-0 h-1 bg-cyan-400/30 blur-sm z-50 pointer-events-none"
        variants={{
          hidden: { top: "-10%", opacity: 0 },
          visible: { top: "110%", opacity: [0, 1, 1, 0], transition: { duration: 1.2, ease: "linear" } }
        }}
      />
      
      {children}
    </motion.section>
  );
}
