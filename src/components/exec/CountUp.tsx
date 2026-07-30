"use client";

import React, { useEffect, useState } from "react";
import { useInView } from "framer-motion";
import { useRef } from "react";

interface CountUpProps {
  end: number | string;
  duration?: number;
  suffix?: string;
  className?: string;
}

export default function CountUp({ end, duration = 1.5, suffix = "", className = "" }: CountUpProps) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  // If end is a string with a "+", extract number
  const isPlus = typeof end === "string" && end.includes("+");
  const numEnd = typeof end === "string" ? parseInt(end.replace(/\D/g, ""), 10) : end;

  useEffect(() => {
    if (isInView && !isNaN(numEnd)) {
      let startTimestamp: number | null = null;
      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
        // easeOutQuart
        const easeOut = 1 - Math.pow(1 - progress, 4);
        setCount(Math.floor(easeOut * numEnd));
        
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    }
  }, [isInView, numEnd, duration]);

  if (isNaN(numEnd)) {
    return <span className={className}>{end}</span>;
  }

  return (
    <span ref={ref} className={className}>
      {count}
      {isPlus ? "+" : ""}
      {suffix}
    </span>
  );
}
