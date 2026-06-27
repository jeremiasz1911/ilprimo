"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { useSiteTheme } from "@/components/ThemeProvider";
import { shouldUseAnimations } from "@/lib/theme-css";

export default function CursorGlow() {
  const theme = useSiteTheme();
  const [enabled, setEnabled] = useState(false);
  const mouseX = useMotionValue(-500);
  const mouseY = useMotionValue(-500);
  const springX = useSpring(mouseX, { stiffness: 120, damping: 28 });
  const springY = useSpring(mouseY, { stiffness: 120, damping: 28 });

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const update = () => {
      setEnabled(
        media.matches &&
          !motionQuery.matches &&
          theme.enableMouseGlow &&
          shouldUseAnimations(theme, false),
      );
    };

    update();
    media.addEventListener("change", update);
    motionQuery.addEventListener("change", update);

    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    if (media.matches) {
      window.addEventListener("mousemove", onMove, { passive: true });
    }

    return () => {
      media.removeEventListener("change", update);
      motionQuery.removeEventListener("change", update);
      window.removeEventListener("mousemove", onMove);
    };
  }, [mouseX, mouseY, theme]);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-30 hidden lg:block">
      <motion.div
        className="absolute h-[480px] w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          left: springX,
          top: springY,
          background: `radial-gradient(circle, color-mix(in srgb, var(--theme-glow-color) 8%, transparent) 0%, color-mix(in srgb, var(--theme-glow-color) 3%, transparent) 35%, transparent 70%)`,
        }}
      />
    </div>
  );
}
