import React, { useState } from "react";
import { ExternalLink } from "lucide-react";
import { audioEngine } from "../../lib/audioEngine";

interface ResourceLinkProps {
  href: string | null | undefined;
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
  style?: React.CSSProperties;
}

export default function ResourceLink({ href, children, className, icon, style }: ResourceLinkProps) {
  const [showError, setShowError] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!href || href.trim() === "") {
      audioEngine.playHoverPing();
      setShowError(true);
      setTimeout(() => setShowError(false), 2000);
      return;
    }
    
    audioEngine.playHoverPing();
    window.open(href, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="relative inline-flex flex-col items-center">
      <button
        onClick={handleClick}
        onMouseEnter={() => audioEngine.playHoverPing()}
        className={className || "flex items-center gap-2 px-3 py-1.5 text-xs font-mono font-bold bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 rounded transition-colors uppercase tracking-wider border border-slate-700"}
        style={style}
      >
        {icon || <ExternalLink size={14} />}
        {children}
      </button>

      {/* Error Toast specific to this button */}
      <div 
        className={`absolute -bottom-8 whitespace-nowrap px-3 py-1 bg-red-950 border border-red-500/50 text-red-400 text-[10px] font-mono tracking-widest uppercase rounded shadow-lg transition-all duration-300 ${
          showError ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        This resource is currently unavailable.
      </div>
    </div>
  );
}
