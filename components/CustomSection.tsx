import Image from "next/image";
import ScrollReveal from "@/components/ScrollReveal";
import SectionShell from "@/components/SectionShell";
import ThemeButton from "@/components/ThemeButton";
import { splitParagraphs } from "@/lib/content-utils";
import type { PageSection } from "@/lib/types";

interface CustomSectionProps {
  section: PageSection;
}

export default function CustomSection({ section }: CustomSectionProps) {
  const paragraphs = splitParagraphs(section.content);
  const hasImage = Boolean(section.image);
  const imageRight = section.layoutVariant === "image-right";

  return (
    <SectionShell section={section}>
      <ScrollReveal>
        <div
          className={`grid items-center gap-10 ${
            hasImage &&
            section.layoutVariant !== "centered" &&
            section.layoutVariant !== "simple-text"
              ? "lg:grid-cols-2"
              : ""
          }`}
        >
          {hasImage && !imageRight && (
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={section.image}
                alt={section.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          )}
          <div
            className={
              !hasImage || section.layoutVariant === "centered"
                ? "mx-auto max-w-3xl"
                : ""
            }
          >
            {section.subtitle && (
              <p className="theme-accent text-xs tracking-[0.25em] uppercase sm:text-sm">
                {section.subtitle}
              </p>
            )}
            {section.title && (
              <h2 className="theme-heading mt-3 text-3xl tracking-wide sm:text-4xl md:text-5xl">
                {section.title}
              </h2>
            )}
            {paragraphs.length > 0 && (
              <div className="theme-muted mt-6 space-y-4 text-sm leading-relaxed sm:text-base">
                {paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 32)}>{paragraph}</p>
                ))}
              </div>
            )}
            {section.buttonText && section.buttonLink && (
              <ThemeButton href={section.buttonLink} className="mt-8">
                {section.buttonText}
              </ThemeButton>
            )}
          </div>
          {hasImage && imageRight && (
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={section.image}
                alt={section.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          )}
        </div>
      </ScrollReveal>
    </SectionShell>
  );
}
