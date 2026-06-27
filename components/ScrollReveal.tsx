"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useSiteTheme } from "@/components/ThemeProvider";
import {
  getAnimationMultiplier,
  shouldUseAnimations,
} from "@/lib/theme-css";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export default function ScrollReveal({
  children,
  className = "",
  delay = 0,
}: ScrollRevealProps) {
  const theme = useSiteTheme();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const animationsOn =
    theme.enableSectionReveal && shouldUseAnimations(theme, isMobile);
  const multiplier = getAnimationMultiplier(theme);

  if (!animationsOn || multiplier === 0) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 * multiplier }}
      animate={
        isInView
          ? { opacity: 1, y: 0 }
          : { opacity: 0, y: 32 * multiplier }
      }
      transition={{
        duration: 0.9 * multiplier,
        delay: delay * multiplier,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
