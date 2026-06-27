import type { SiteTheme } from "@/lib/types";

const RADIUS_MAP: Record<SiteTheme["borderRadius"], string> = {
  none: "0px",
  small: "0.25rem",
  medium: "0.5rem",
  large: "1rem",
};

const SPACING_MAP: Record<string, string> = {
  compact: "3rem",
  small: "3rem",
  medium: "4rem",
  comfortable: "5rem",
  large: "6rem",
  spacious: "7rem",
};

const CARD_GAP_MAP: Record<string, string> = {
  small: "0.75rem",
  medium: "1rem",
  large: "1.5rem",
};

export function themeToCssVariables(theme: SiteTheme): Record<string, string> {
  return {
    "--theme-primary": theme.primaryColor,
    "--theme-secondary": theme.secondaryColor,
    "--theme-accent": theme.accentColor,
    "--theme-bg": theme.backgroundColor,
    "--theme-text": theme.textColor,
    "--theme-muted": theme.mutedTextColor,
    "--theme-navbar-bg": theme.navbarBackgroundColor,
    "--theme-footer-bg": theme.footerBackgroundColor,
    "--theme-btn-primary-bg": theme.buttonPrimaryColor,
    "--theme-btn-primary-text": theme.buttonPrimaryTextColor,
    "--theme-btn-secondary-bg": theme.buttonSecondaryColor,
    "--theme-btn-secondary-text": theme.buttonSecondaryTextColor,
    "--theme-card-bg": theme.cardBackgroundColor,
    "--theme-border": theme.borderColor,
    "--theme-radius": RADIUS_MAP[theme.borderRadius],
    "--theme-section-spacing": SPACING_MAP[theme.sectionSpacing] ?? "5rem",
    "--theme-mobile-section-spacing":
      SPACING_MAP[theme.mobileSectionSpacing] ?? "4rem",
    "--theme-card-gap": CARD_GAP_MAP[theme.cardSpacing] ?? "1rem",
    "--theme-max-width": theme.maxWidth,
    "--theme-font-heading":
      theme.fontHeading === "serif"
        ? "var(--font-serif), Georgia, serif"
        : "var(--font-sans), system-ui, sans-serif",
    "--theme-font-body":
      theme.fontBody === "serif"
        ? "var(--font-serif), Georgia, serif"
        : "var(--font-sans), system-ui, sans-serif",
    "--menu-cols-mobile": String(theme.menuGridMobile),
    "--menu-cols-tablet": String(theme.menuGridTablet),
    "--menu-cols-desktop": String(theme.menuGridDesktop),
    "--menu-card-ratio": theme.menuCardImageRatio,
    "--menu-card-ratio-mobile": theme.mobileImageRatio,
    "--theme-glow-color": theme.accentColor,
  };
}

export function themeToCssString(theme: SiteTheme): string {
  return Object.entries(themeToCssVariables(theme))
    .map(([key, value]) => `${key}: ${value};`)
    .join("\n  ");
}

export function getAnimationMultiplier(theme: SiteTheme): number {
  const map: Record<SiteTheme["animationIntensity"], number> = {
    none: 0,
    subtle: 0.6,
    normal: 1,
    strong: 1.4,
  };
  return map[theme.animationIntensity] ?? 0.6;
}

export function shouldUseAnimations(theme: SiteTheme, isMobile = false): boolean {
  if (!theme.enableAnimations || theme.animationIntensity === "none") {
    return false;
  }
  if (isMobile && theme.animationIntensity === "strong") {
    return theme.enableAnimations;
  }
  return theme.enableAnimations;
}
