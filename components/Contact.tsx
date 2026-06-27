import ScrollReveal from "@/components/ScrollReveal";
import { splitParagraphs } from "@/lib/content-utils";
import {
  getSectionPaddingClass,
  getSectionTextAlignClass,
  getSectionVisibilityClass,
} from "@/lib/section-layout";
import type { PageSection, SiteSettings } from "@/lib/types";

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
    <footer
      id={section.id}
      className={`theme-footer ${getSectionVisibilityClass(section)} ${getSectionPaddingClass(section)} ${getSectionTextAlignClass(section)} py-12 sm:py-16`}
    >
      <div className="theme-container mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          {(section.subtitle || section.title) && (
            <div className="mb-8">
              {section.subtitle && (
                <p className="theme-accent text-xs tracking-[0.25em] uppercase sm:text-sm">
                  {section.subtitle}
                </p>
              )}
              {section.title && (
                <h2 className="theme-heading mt-3 text-xl tracking-[0.15em] uppercase sm:text-2xl sm:tracking-[0.2em] md:text-3xl">
                  {section.title}
                </h2>
              )}
            </div>
          )}

          <h2 className="theme-heading text-xl tracking-[0.15em] uppercase sm:text-2xl sm:tracking-[0.2em] md:text-3xl">
            {settings.restaurantName}
          </h2>

          <div className="theme-muted mt-8 space-y-3 sm:mt-10 sm:space-y-4">
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
                  className="theme-accent text-base transition-all duration-500 hover:opacity-80 sm:text-lg md:text-xl"
                >
                  {settings.phone}
                </a>
              </p>
            )}
            {settings.email && (
              <p>
                <a
                  href={`mailto:${settings.email}`}
                  className="theme-muted text-sm transition-colors hover:text-[var(--theme-accent)] sm:text-base"
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
                  className="theme-muted text-sm tracking-[0.15em] uppercase transition-colors hover:text-[var(--theme-accent)]"
                >
                  Facebook
                </a>
              )}
              {settings.instagramUrl && (
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="theme-muted text-sm tracking-[0.15em] uppercase transition-colors hover:text-[var(--theme-accent)]"
                >
                  Instagram
                </a>
              )}
            </div>
          )}

          {footerParagraphs.length > 0 && (
            <div className="theme-muted mx-auto mt-8 max-w-2xl space-y-3 text-sm">
              {footerParagraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 32)}>{paragraph}</p>
              ))}
            </div>
          )}

          <div
            className="mt-10 border-t pt-6 sm:mt-12 sm:pt-8"
            style={{ borderColor: "var(--theme-border)" }}
          >
            {settings.copyrightText && (
              <p className="theme-muted text-xs sm:text-sm">
                {settings.copyrightText}
              </p>
            )}
          </div>
        </ScrollReveal>
      </div>
    </footer>
  );
}
