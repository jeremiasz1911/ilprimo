import { splitParagraphs } from "@/lib/content-utils";
import type { PageSection, SiteSettings } from "@/lib/types";
import ScrollReveal from "@/components/ScrollReveal";

interface ContactProps {
  section: PageSection;
  settings: SiteSettings;
}

function formatPhoneHref(phone: string) {
  const digits = phone.replace(/\s/g, "");
  return digits.startsWith("+") ? digits : `+48${digits.replace(/^0/, "")}`;
}

export default function Contact({ section, settings }: ContactProps) {
  const footerParagraphs = splitParagraphs(settings.footerText);

  return (
    <footer id={section.id} className="bg-black py-12 text-white sm:py-16">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <ScrollReveal>
          {(section.subtitle || section.title) && (
            <div className="mb-8">
              {section.subtitle && (
                <p className="text-xs tracking-[0.25em] text-amber-400 uppercase sm:text-sm">
                  {section.subtitle}
                </p>
              )}
              {section.title && (
                <h2 className="mt-3 font-serif text-xl tracking-[0.15em] uppercase sm:text-2xl sm:tracking-[0.2em] md:text-3xl">
                  {section.title}
                </h2>
              )}
            </div>
          )}

          <h2 className="font-serif text-xl tracking-[0.15em] uppercase sm:text-2xl sm:tracking-[0.2em] md:text-3xl">
            {settings.restaurantName}
          </h2>

          <div className="mt-8 space-y-3 text-stone-400 sm:mt-10 sm:space-y-4">
            {settings.address && (
              <p className="text-sm leading-relaxed sm:text-base md:text-lg">
                {settings.address.split(",").map((part, index, parts) => (
                  <span key={part.trim()}>
                    {part.trim()}
                    {index < parts.length - 1 && (
                      <>
                        ,
                        <br className="sm:hidden" />{" "}
                      </>
                    )}
                  </span>
                ))}
              </p>
            )}
            {settings.phone && (
              <p>
                <a
                  href={`tel:${formatPhoneHref(settings.phone)}`}
                  className="text-base text-amber-400 transition-all duration-500 hover:text-amber-300 hover:drop-shadow-[0_0_12px_rgba(251,191,36,0.35)] sm:text-lg md:text-xl"
                >
                  {settings.phone}
                </a>
              </p>
            )}
            {settings.email && (
              <p>
                <a
                  href={`mailto:${settings.email}`}
                  className="text-sm text-stone-300 transition-colors hover:text-amber-400 sm:text-base"
                >
                  {settings.email}
                </a>
              </p>
            )}
          </div>

          {(settings.facebookUrl || settings.instagramUrl) && (
            <div className="mt-8 flex justify-center gap-6">
              {settings.facebookUrl && (
                <a
                  href={settings.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm tracking-[0.15em] text-stone-400 uppercase transition-colors hover:text-amber-400"
                >
                  Facebook
                </a>
              )}
              {settings.instagramUrl && (
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm tracking-[0.15em] text-stone-400 uppercase transition-colors hover:text-amber-400"
                >
                  Instagram
                </a>
              )}
            </div>
          )}

          {footerParagraphs.length > 0 && (
            <div className="mx-auto mt-8 max-w-2xl space-y-3 text-sm text-stone-500">
              {footerParagraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 32)}>{paragraph}</p>
              ))}
            </div>
          )}

          <div className="mt-10 border-t border-stone-800 pt-6 sm:mt-12 sm:pt-8">
            {settings.copyrightText && (
              <p className="text-xs text-stone-500 sm:text-sm">
                {settings.copyrightText}
              </p>
            )}
          </div>
        </ScrollReveal>
      </div>
    </footer>
  );
}
