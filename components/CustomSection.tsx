import Image from "next/image";
import { splitParagraphs } from "@/lib/content-utils";
import type { PageSection } from "@/lib/types";
import ScrollReveal from "@/components/ScrollReveal";

interface CustomSectionProps {
  section: PageSection;
}

export default function CustomSection({ section }: CustomSectionProps) {
  const paragraphs = splitParagraphs(section.content);

  return (
    <section
      id={section.id}
      className="bg-stone-950 py-16 text-white sm:py-24 lg:py-32"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className={`grid items-center gap-10 ${section.image ? "lg:grid-cols-2" : ""}`}>
            {section.image && (
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
            <div className={section.image ? "" : "mx-auto max-w-3xl text-center"}>
              {section.subtitle && (
                <p className="text-xs tracking-[0.25em] text-amber-400 uppercase sm:text-sm">
                  {section.subtitle}
                </p>
              )}
              {section.title && (
                <h2 className="mt-3 font-serif text-3xl tracking-wide sm:text-4xl md:text-5xl">
                  {section.title}
                </h2>
              )}
              {paragraphs.length > 0 && (
                <div className="mt-6 space-y-4 text-sm leading-relaxed text-stone-400 sm:text-base">
                  {paragraphs.map((paragraph) => (
                    <p key={paragraph.slice(0, 32)}>{paragraph}</p>
                  ))}
                </div>
              )}
              {section.buttonText && section.buttonLink && (
                <a
                  href={section.buttonLink}
                  className="btn-premium mt-8 inline-block"
                >
                  {section.buttonText}
                </a>
              )}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
