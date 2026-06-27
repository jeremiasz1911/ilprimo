import Image from "next/image";
import ScrollReveal from "@/components/ScrollReveal";
import SectionShell from "@/components/SectionShell";
import { splitParagraphs } from "@/lib/content-utils";
import type { PageSection } from "@/lib/types";

interface AboutProps {
  section: PageSection;
}

export default function About({ section }: AboutProps) {
  const paragraphs = splitParagraphs(section.content);
  const imageFirst =
    section.layoutVariant === "image-right" ? false : section.image;

  const imageBlock = section.image ? (
    <ScrollReveal>
      <div
        className={`relative mx-auto w-full max-w-md overflow-hidden lg:max-w-none ${
          section.layoutVariant === "centered" ? "aspect-[4/5]" : "aspect-[4/5]"
        }`}
      >
        <Image
          src={section.image}
          alt={section.title}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>
    </ScrollReveal>
  ) : null;

  const textBlock = (
    <ScrollReveal delay={0.15}>
      <div>
        {section.subtitle && (
          <p className="theme-accent text-xs tracking-[0.25em] uppercase sm:text-sm sm:tracking-[0.3em]">
            {section.subtitle}
          </p>
        )}
        {section.title && (
          <h2 className="theme-heading mt-3 text-3xl tracking-wide sm:mt-4 sm:text-4xl md:text-5xl">
            {section.title}
          </h2>
        )}
        {paragraphs.length > 0 && (
          <div className="theme-muted mt-6 space-y-4 text-sm leading-relaxed sm:mt-8 sm:space-y-6 sm:text-base md:text-lg">
            {paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 32)}>{paragraph}</p>
            ))}
          </div>
        )}
      </div>
    </ScrollReveal>
  );

  return (
    <SectionShell section={section}>
      {section.layoutVariant === "centered" || !section.image ? (
        <div className="mx-auto max-w-3xl">
          {imageBlock}
          {textBlock}
        </div>
      ) : (
        <div
          className={`grid items-center gap-8 sm:gap-12 lg:gap-16 ${
            section.layoutVariant === "split" ||
            section.layoutVariant === "image-left" ||
            section.layoutVariant === "image-right"
              ? "lg:grid-cols-2"
              : "lg:grid-cols-2"
          }`}
        >
          {imageFirst ? (
            <>
              {imageBlock}
              {textBlock}
            </>
          ) : (
            <>
              {textBlock}
              {imageBlock}
            </>
          )}
        </div>
      )}
    </SectionShell>
  );
}
