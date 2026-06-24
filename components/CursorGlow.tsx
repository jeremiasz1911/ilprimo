"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

export default function CursorGlow() {
  const [enabled, setEnabled] = useState(false);
  const mouseX = useMotionValue(-500);
  const mouseY = useMotionValue(-500);
  const springX = useSpring(mouseX, { stiffness: 120, damping: 28 });
  const springY = useSpring(mouseY, { stiffness: 120, damping: 28 });

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const update = () => setEnabled(media.matches);
    update();
    media.addEventListener("change", update);

    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    if (media.matches) {
      window.addEventListener("mousemove", onMove, { passive: true });
    }

    return () => {
      media.removeEventListener("change", update);
      window.removeEventListener("mousemove", onMove);
    };
  }, [mouseX, mouseY]);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-30 hidden lg:block">
      <motion.div
        className="absolute h-[480px] w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          left: springX,
          top: springY,
          background:
            "radial-gradient(circle, rgba(251,191,36,0.05) 0%, rgba(251,191,36,0.02) 35%, transparent 70%)",
        }}
      />
    </div>
  );
}
