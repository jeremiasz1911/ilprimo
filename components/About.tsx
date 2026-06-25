import Image from "next/image";
import { splitParagraphs } from "@/lib/content-utils";
import type { PageSection } from "@/lib/types";
import ScrollReveal from "@/components/ScrollReveal";

interface AboutProps {
  section: PageSection;
}

export default function About({ section }: AboutProps) {
  const paragraphs = splitParagraphs(section.content);

  return (
    <section id={section.id} className="bg-stone-50 py-16 sm:py-24 lg:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 sm:gap-12 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        {section.image && (
          <ScrollReveal>
            <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden lg:max-w-none">
              <Image
                src={section.image}
                alt={section.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </ScrollReveal>
        )}

        <ScrollReveal delay={0.15}>
          <div>
            {section.subtitle && (
              <p className="text-xs tracking-[0.25em] text-amber-700 uppercase sm:text-sm sm:tracking-[0.3em]">
                {section.subtitle}
              </p>
            )}
            {section.title && (
              <h2 className="mt-3 font-serif text-3xl tracking-wide text-stone-900 sm:mt-4 sm:text-4xl md:text-5xl">
                {section.title}
              </h2>
            )}
            {paragraphs.length > 0 && (
              <div className="mt-6 space-y-4 text-sm leading-relaxed text-stone-600 sm:mt-8 sm:space-y-6 sm:text-base md:text-lg">
                {paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 32)}>{paragraph}</p>
                ))}
              </div>
            )}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
