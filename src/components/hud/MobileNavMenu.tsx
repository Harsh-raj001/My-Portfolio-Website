"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useMissionStore } from "../../store/missionStore";

export default function MobileNavMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: "Mission Brief", chapter: "#mission" },
    { label: "Experience", chapter: "#experience" },
    { label: "Projects", chapter: "#projects" },
    { label: "Research", chapter: "#research" },
    { label: "Command Dome", chapter: "#exec" },
  ] as const;

  const handleSelect = (hash: string) => {
    setIsOpen(false);
    window.location.hash = hash;
  };

  return (
    <div className="fixed top-4 right-4 z-[999] md:hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 bg-black/60 backdrop-blur-md border border-white/20 rounded-full text-white active:scale-95 transition-transform min-h-[44px] min-w-[44px] flex items-center justify-center shadow-lg"
        aria-label="Toggle Navigation"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-16 right-0 w-64 bg-slate-900/95 backdrop-blur-xl border border-white/15 rounded-2xl p-4 shadow-2xl flex flex-col gap-2"
          >
            <div className="text-xs font-mono text-emerald-400 uppercase tracking-widest mb-2 px-2">
              Navigation Data Link
            </div>
            {navItems.map((item, i) => (
              <button
                key={i}
                onClick={() => handleSelect(item.chapter)}
                className="text-left px-4 py-3 rounded-lg text-sm font-medium text-slate-300 hover:bg-white/10 hover:text-white active:scale-[0.98] transition-all flex items-center justify-between group min-h-[44px]"
              >
                <span>{item.label}</span>
                <span className="text-xs font-mono text-slate-500 group-hover:text-emerald-400 transition-colors">
                  0{i + 1}
                </span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
