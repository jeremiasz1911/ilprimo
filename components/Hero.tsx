"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { localImages } from "@/data/menu";

const textVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 1,
      delay: 0.3 + i * 0.15,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.06]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden pt-16 sm:pt-20"
    >
      <motion.div
        className="absolute inset-0 will-change-transform"
        style={{ y: imageY, scale: imageScale }}
      >
        <motion.div
          className="relative h-[115%] w-full -translate-y-[7%]"
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image
            src={localImages.hero}
            alt="IL PRIMO Ristorante Italiano"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </motion.div>
      </motion.div>

      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 w-full max-w-4xl px-4 text-center text-white sm:px-6">
        <motion.p
          custom={0}
          initial="hidden"
          animate="visible"
          variants={textVariants}
          className="mb-3 text-xs tracking-[0.25em] text-amber-400 uppercase sm:mb-4 sm:text-sm sm:tracking-[0.4em] md:text-base"
        >
          Benvenuti
        </motion.p>
        <motion.h1
          custom={1}
          initial="hidden"
          animate="visible"
          variants={textVariants}
          className="font-serif text-4xl tracking-[0.1em] uppercase sm:text-5xl sm:tracking-[0.15em] md:text-7xl lg:text-8xl"
        >
          IL PRIMO
        </motion.h1>
        <motion.p
          custom={2}
          initial="hidden"
          animate="visible"
          variants={textVariants}
          className="mt-3 text-sm tracking-[0.2em] text-white/90 uppercase sm:mt-4 sm:text-lg sm:tracking-[0.35em] md:text-xl"
        >
          Ristorante Italiano
        </motion.p>
        <motion.p
          custom={3}
          initial="hidden"
          animate="visible"
          variants={textVariants}
          className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-white/80 sm:mt-8 sm:text-base md:text-lg"
        >
          Autentyczna kuchnia włoska w sercu Mławy
        </motion.p>
        <motion.div
          custom={4}
          initial="hidden"
          animate="visible"
          variants={textVariants}
          className="mt-8 sm:mt-10"
        >
          <a href="#menu" className="btn-premium inline-block w-full max-w-xs sm:w-auto">
            ZOBACZ MENU
          </a>
        </motion.div>
      </div>
    </section>
  );
}
