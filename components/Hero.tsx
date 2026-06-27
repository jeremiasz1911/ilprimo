"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import ThemeButton from "@/components/ThemeButton";
import { useSiteTheme } from "@/components/ThemeProvider";
import { splitHeroContent } from "@/lib/content-utils";
import {
  getSectionTextAlignClass,
  getSectionVisibilityClass,
} from "@/lib/section-layout";
import { getAnimationMultiplier, shouldUseAnimations } from "@/lib/theme-css";
import type { PageSection } from "@/lib/types";

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

interface HeroProps {
  section: PageSection;
}

export default function Hero({ section }: HeroProps) {
  const theme = useSiteTheme();
  const sectionRef = useRef<HTMLElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 767px)");
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const update = () => {
      setIsMobile(mobileQuery.matches);
      setReducedMotion(motionQuery.matches);
    };

    update();
    mobileQuery.addEventListener("change", update);
    motionQuery.addEventListener("change", update);

    return () => {
      mobileQuery.removeEventListener("change", update);
      motionQuery.removeEventListener("change", update);
    };
  }, []);

  const animationsOn =
    shouldUseAnimations(theme, isMobile) && getAnimationMultiplier(theme) > 0;
  const parallaxEnabled =
    theme.enableParallax &&
    shouldUseAnimations(theme, isMobile) &&
    !isMobile &&
    !reducedMotion;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.06]);
  const { tagline, description } = splitHeroContent(section.content);

  const imageClass =
    theme.imageStyle === "cinematic"
      ? "object-cover brightness-90 contrast-105"
      : theme.imageStyle === "bright"
        ? "object-cover brightness-105"
        : "object-cover";

  const image = section.image ? (
    <Image
      src={section.image}
      alt={section.title}
      fill
      priority
      className={imageClass}
      sizes="100vw"
    />
  ) : null;

  const anim = (index: number) =>
    animationsOn
      ? {
          custom: index,
          initial: "hidden" as const,
          animate: "visible" as const,
          variants: textVariants,
        }
      : {};

  return (
    <section
      ref={sectionRef}
      id={section.id}
      className={`relative flex min-h-[100svh] items-center justify-center overflow-hidden pt-16 sm:pt-20 md:min-h-[100dvh] ${getSectionVisibilityClass(section)} ${getSectionTextAlignClass(section)}`}
    >
      {parallaxEnabled ? (
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
            {image}
          </motion.div>
        </motion.div>
      ) : (
        <div className="absolute inset-0">
          <div className="relative h-full w-full">{image}</div>
        </div>
      )}

      <div
        className="absolute inset-0"
        style={{
          backgroundColor:
            "color-mix(in srgb, var(--theme-primary) 60%, transparent)",
        }}
      />

      <div className="relative z-10 w-full max-w-4xl px-4 sm:px-6">
        {section.subtitle &&
          (animationsOn ? (
            <motion.p
              {...anim(0)}
              className="theme-accent mb-3 text-xs tracking-[0.25em] uppercase sm:mb-4 sm:text-sm sm:tracking-[0.4em] md:text-base"
            >
              {section.subtitle}
            </motion.p>
          ) : (
            <p className="theme-accent mb-3 text-xs tracking-[0.25em] uppercase sm:mb-4 sm:text-sm sm:tracking-[0.4em] md:text-base">
              {section.subtitle}
            </p>
          ))}
        {section.title &&
          (animationsOn ? (
            <motion.h1
              {...anim(1)}
              className="theme-heading text-4xl tracking-[0.1em] uppercase sm:text-5xl sm:tracking-[0.15em] md:text-7xl lg:text-8xl"
            >
              {section.title}
            </motion.h1>
          ) : (
            <h1 className="theme-heading text-4xl tracking-[0.1em] uppercase sm:text-5xl sm:tracking-[0.15em] md:text-7xl lg:text-8xl">
              {section.title}
            </h1>
          ))}
        {tagline &&
          (animationsOn ? (
            <motion.p
              {...anim(2)}
              className="theme-muted mt-3 text-sm tracking-[0.2em] uppercase sm:mt-4 sm:text-lg sm:tracking-[0.35em] md:text-xl"
            >
              {tagline}
            </motion.p>
          ) : (
            <p className="theme-muted mt-3 text-sm tracking-[0.2em] uppercase sm:mt-4 sm:text-lg sm:tracking-[0.35em] md:text-xl">
              {tagline}
            </p>
          ))}
        {description &&
          (animationsOn ? (
            <motion.p
              {...anim(3)}
              className="theme-muted mx-auto mt-6 max-w-xl text-sm leading-relaxed sm:mt-8 sm:text-base md:text-lg"
            >
              {description}
            </motion.p>
          ) : (
            <p className="theme-muted mx-auto mt-6 max-w-xl text-sm leading-relaxed sm:mt-8 sm:text-base md:text-lg">
              {description}
            </p>
          ))}
        {section.buttonText && section.buttonLink &&
          (animationsOn ? (
            <motion.div {...anim(4)} className="mt-8 sm:mt-10">
              <ThemeButton
                href={section.buttonLink}
                className="w-full max-w-xs sm:w-auto"
              >
                {section.buttonText}
              </ThemeButton>
            </motion.div>
          ) : (
            <div className="mt-8 sm:mt-10">
              <ThemeButton
                href={section.buttonLink}
                className="w-full max-w-xs sm:w-auto"
              >
                {section.buttonText}
              </ThemeButton>
            </div>
          ))}
      </div>
    </section>
  );
}
