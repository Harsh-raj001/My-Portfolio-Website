"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { audioEngine } from "../../lib/audioEngine";

const BOOT_SEQUENCE = [
  "TERMINATING EXECUTIVE MODE...",
  "Closing Secure Data Connections...",
  "Wiping Temporary Cache...",
  "Restoring Visual Assets...",
  "Rebooting Standard Interface...",
  "EXPLORER MODE ONLINE"
];

interface ExplorerBootSequenceProps {
  onComplete: () => void;
}

export default function ExplorerBootSequence({ onComplete }: ExplorerBootSequenceProps) {
  const [lines, setLines] = useState<string[]>([]);

  useEffect(() => {
    // Play system boot sound
    audioEngine.playHoverPing();

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
        }, 800); // Wait a bit after showing "EXPLORER MODE ONLINE"
      }
    }, 300); // slightly faster than exec boot

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
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
                  className={`py-1.5 ${isLast ? 'text-white font-bold mt-4' : 'text-slate-500'}`}
                >
                  <span className="text-slate-700 mr-4">{`[SYS.${String(index + 1).padStart(2, '0')}]`}</span>
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
              className="inline-block w-2 h-4 bg-white mt-2 ml-[3.5rem]"
            />
          )}
        </div>
      </div>
    </div>
  );
}
