"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { audioEngine } from "../../lib/audioEngine";

const BOOT_SEQUENCE = [
  "INITIALISING EXECUTIVE MODE...",
  "Connecting Candidate Database...",
  "Synchronising Mission Archive...",
  "Validating External Resources...",
  "Loading Portfolio Assets...",
  "EXEC MODE ONLINE"
];

interface ExecBootSequenceProps {
  onComplete: () => void;
}

export default function ExecBootSequence({ onComplete }: ExecBootSequenceProps) {
  useEffect(() => {
    // Play system boot sound immediately
    audioEngine.playHoverPing();
    
    // Lightning fast transition (400ms)
    const timeout = setTimeout(() => {
      onComplete();
    }, 400);

    return () => clearTimeout(timeout);
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }} // Premium custom cubic-bezier
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black"
    >
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 border-t-2 border-r-2 border-cyan-400 rounded-full animate-spin shadow-[0_0_15px_rgba(34,211,238,0.5)]"></div>
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="mt-6 text-xs font-mono text-cyan-400 tracking-[0.2em] uppercase"
        >
          INITIALIZING EXECUTIVE MODE
        </motion.div>
      </div>
    </motion.div>
  );
}
