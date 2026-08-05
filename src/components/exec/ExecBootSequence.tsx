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
  const [lines, setLines] = useState<string[]>([]);

  useEffect(() => {
    // Play system boot sound
    audioEngine.playHoverPing();
    
    const handleSkip = () => {
      audioEngine.playModalOpen(); // play a confirm sound
      onComplete();
    };
    window.addEventListener("keydown", handleSkip);

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < BOOT_SEQUENCE.length) {
        setLines((prev) => [...prev, BOOT_SEQUENCE[currentIndex]]);
        currentIndex++;
        if (currentIndex < BOOT_SEQUENCE.length) {
          audioEngine.playHoverPing(); // sound for each line
        }
      } else {
        clearInterval(interval);
        setTimeout(() => {
          onComplete();
        }, 300); // Wait a bit after showing "EXEC MODE ONLINE"
      }
    }, 150); // 150ms per line

    return () => {
      clearInterval(interval);
      window.removeEventListener("keydown", handleSkip);
    };
  }, [onComplete]);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black cursor-pointer"
      onClick={() => {
        audioEngine.playModalOpen();
        onComplete();
      }}
    >
      <div className="w-full max-w-2xl px-8">
        <div className="font-mono text-sm tracking-widest text-slate-400">
          <AnimatePresence>
            {lines.map((line, index) => {
              const isLast = index === BOOT_SEQUENCE.length - 1;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`py-1.5 ${isLast ? 'text-cyan-400 font-bold mt-4' : 'text-slate-400'}`}
                >
                  <span className="text-slate-600 mr-4">{`[SYS.${String(index + 1).padStart(2, '0')}]`}</span>
                  {line}
                </motion.div>
              );
            })}
          </AnimatePresence>
          {lines.length < BOOT_SEQUENCE.length && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ repeat: Infinity, duration: 0.5, repeatType: "reverse" }}
              className="inline-block w-2 h-4 bg-cyan-500 mt-2 ml-[3.5rem]"
            />
          )}
          
          {/* Skip Hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 0.5 }}
            className="absolute bottom-8 right-8 text-[10px] text-cyan-500 uppercase tracking-widest"
          >
            [Press any key or tap to skip]
          </motion.div>
        </div>
      </div>
    </div>
  );
}
