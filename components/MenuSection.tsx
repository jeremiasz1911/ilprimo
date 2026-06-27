import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";
import SectionShell from "@/components/SectionShell";
import { getPublicMenu } from "@/lib/menu-service";
import { getSiteTheme } from "@/lib/theme-service";
import type { PageSection } from "@/lib/types";

interface MenuSectionProps {
  section: PageSection;
}

export default async function MenuSection({ section }: MenuSectionProps) {
  const [menuCategories, theme] = await Promise.all([
    getPublicMenu(),
    getSiteTheme(),
  ]);

  const hoverClass = theme.enableHoverEffects ? "menu-card-hover" : "";
  const textAlignClass =
    theme.menuCardTextAlign === "center"
      ? "text-center"
      : theme.menuCardTextAlign === "right"
        ? "text-right"
        : "text-left";

  return (
    <SectionShell section={section}>
      <ScrollReveal>
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
          {section.content && (
            <p className="theme-muted mx-auto mt-4 max-w-2xl text-sm sm:mt-6 sm:text-base md:text-lg">
              {section.content}
            </p>
          )}
        </div>
      </ScrollReveal>

      <div className="mt-12 space-y-16 sm:mt-20 sm:space-y-24">
        {menuCategories.map((category, categoryIndex) => (
          <ScrollReveal key={category.id} delay={categoryIndex * 0.05}>
            <div>
              <h3
                className="theme-heading theme-accent mb-8 border-b pb-3 text-center text-lg tracking-[0.15em] uppercase sm:mb-12 sm:pb-4 sm:text-2xl sm:tracking-[0.2em] md:text-3xl"
                style={{ borderColor: "var(--theme-border)" }}
              >
                {category.name}
              </h3>

              <div className={`menu-grid menu-card-style-${theme.menuCardStyle}`}>
                {category.items.map((item, itemIndex) => (
                  <ScrollReveal
                    key={item.slug}
                    delay={itemIndex * 0.04}
                    className="h-full"
                  >
                    <Link
                      href={`/menu/${item.slug}`}
                      className={`menu-card group flex h-full flex-col overflow-hidden ${hoverClass} menu-card-style-${theme.menuCardStyle}`}
                    >
                      <div className="menu-card-image relative overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className={`object-cover transition-all duration-700 ease-out ${
                            theme.enableHoverEffects
                              ? "group-hover:scale-110 group-hover:brightness-110"
                              : ""
                          }`}
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        {theme.menuCardStyle === "overlay" && (
                          <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
                        )}
                        {theme.enableHoverEffects && (
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                            <span
                              className="border px-4 py-2 text-[0.65rem] tracking-[0.2em] uppercase backdrop-blur-sm sm:text-xs"
                              style={{
                                borderColor: "var(--theme-accent)",
                                color: "var(--theme-accent)",
                                backgroundColor:
                                  "color-mix(in srgb, var(--theme-primary) 50%, transparent)",
                              }}
                            >
                              Zobacz szczegóły
                            </span>
                          </div>
                        )}
                      </div>
                      <div
                        className={`flex flex-1 flex-col p-3 sm:p-5 lg:p-6 ${textAlignClass} ${
                          theme.enableHoverEffects
                            ? "transition-transform duration-500 ease-out group-hover:-translate-y-1"
                            : ""
                        }`}
                      >
                        <div
                          className={`flex flex-col gap-1 ${
                            theme.menuCardShowPrice
                              ? "sm:flex-row sm:items-start sm:justify-between sm:gap-3"
                              : ""
                          }`}
                        >
                          <h4 className="theme-heading text-sm leading-snug sm:text-lg md:text-xl lg:text-2xl">
                            {item.name}
                          </h4>
                          {theme.menuCardShowPrice && (
                            <span className="theme-accent shrink-0 text-sm font-medium sm:text-base lg:text-lg">
                              {item.price}
                            </span>
                          )}
                        </div>
                        {theme.menuCardShowDescription && (
                          <p className="theme-muted mt-2 flex-1 text-xs leading-relaxed sm:mt-3 sm:text-sm">
                            {item.shortDescription}
                          </p>
                        )}
                        {theme.menuCardShowAllergens &&
                          item.allergens.length > 0 && (
                            <p className="theme-muted mt-2 text-[0.65rem] sm:text-xs">
                              Alergeny: {item.allergens.join(", ")}
                            </p>
                          )}
                      </div>
                    </Link>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </SectionShell>
  );
}
