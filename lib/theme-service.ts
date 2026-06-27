import type { DocumentData } from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebase-admin";
import type { SiteTheme } from "@/lib/types";
import { applyThemePreset, getDefaultTheme } from "@/lib/theme-presets";

const THEME_DOC = "siteTheme/main";

function mapThemeDoc(data: DocumentData | undefined): SiteTheme {
  const defaults = getDefaultTheme();
  if (!data) return defaults;

  return {
    themeName: String(data.themeName ?? defaults.themeName),
    primaryColor: String(data.primaryColor ?? defaults.primaryColor),
    secondaryColor: String(data.secondaryColor ?? defaults.secondaryColor),
    accentColor: String(data.accentColor ?? defaults.accentColor),
    backgroundColor: String(data.backgroundColor ?? defaults.backgroundColor),
    textColor: String(data.textColor ?? defaults.textColor),
    mutedTextColor: String(data.mutedTextColor ?? defaults.mutedTextColor),
    navbarBackgroundColor: String(
      data.navbarBackgroundColor ?? defaults.navbarBackgroundColor,
    ),
    footerBackgroundColor: String(
      data.footerBackgroundColor ?? defaults.footerBackgroundColor,
    ),
    buttonPrimaryColor: String(
      data.buttonPrimaryColor ?? defaults.buttonPrimaryColor,
    ),
    buttonPrimaryTextColor: String(
      data.buttonPrimaryTextColor ?? defaults.buttonPrimaryTextColor,
    ),
    buttonSecondaryColor: String(
      data.buttonSecondaryColor ?? defaults.buttonSecondaryColor,
    ),
    buttonSecondaryTextColor: String(
      data.buttonSecondaryTextColor ?? defaults.buttonSecondaryTextColor,
    ),
    cardBackgroundColor: String(
      data.cardBackgroundColor ?? defaults.cardBackgroundColor,
    ),
    borderColor: String(data.borderColor ?? defaults.borderColor),
    fontHeading: data.fontHeading === "sans" ? "sans" : "serif",
    fontBody: data.fontBody === "serif" ? "serif" : "sans",
    borderRadius:
      (data.borderRadius as SiteTheme["borderRadius"]) ?? defaults.borderRadius,
    sectionSpacing:
      (data.sectionSpacing as SiteTheme["sectionSpacing"]) ??
      defaults.sectionSpacing,
    cardSpacing:
      (data.cardSpacing as SiteTheme["cardSpacing"]) ?? defaults.cardSpacing,
    maxWidth: String(data.maxWidth ?? defaults.maxWidth),
    buttonStyle:
      (data.buttonStyle as SiteTheme["buttonStyle"]) ?? defaults.buttonStyle,
    cardStyle: (data.cardStyle as SiteTheme["cardStyle"]) ?? defaults.cardStyle,
    imageStyle:
      (data.imageStyle as SiteTheme["imageStyle"]) ?? defaults.imageStyle,
    pageCharacter:
      (data.pageCharacter as SiteTheme["pageCharacter"]) ??
      defaults.pageCharacter,
    enableAnimations: data.enableAnimations !== false,
    animationIntensity:
      (data.animationIntensity as SiteTheme["animationIntensity"]) ??
      defaults.animationIntensity,
    enableParallax: data.enableParallax !== false,
    enableMouseGlow: data.enableMouseGlow !== false,
    enableHoverEffects: data.enableHoverEffects !== false,
    enableSectionReveal: data.enableSectionReveal !== false,
    menuGridDesktop: Number(data.menuGridDesktop) || defaults.menuGridDesktop,
    menuGridTablet: Number(data.menuGridTablet) || defaults.menuGridTablet,
    menuGridMobile: Number(data.menuGridMobile) || defaults.menuGridMobile,
    menuCardImageRatio: String(
      data.menuCardImageRatio ?? defaults.menuCardImageRatio,
    ),
    menuCardTextAlign:
      (data.menuCardTextAlign as SiteTheme["menuCardTextAlign"]) ??
      defaults.menuCardTextAlign,
    menuCardShowDescription: data.menuCardShowDescription !== false,
    menuCardShowAllergens: data.menuCardShowAllergens === true,
    menuCardShowPrice: data.menuCardShowPrice !== false,
    menuCardStyle:
      (data.menuCardStyle as SiteTheme["menuCardStyle"]) ??
      defaults.menuCardStyle,
    mobileNavbarStyle:
      (data.mobileNavbarStyle as SiteTheme["mobileNavbarStyle"]) ??
      defaults.mobileNavbarStyle,
    mobileSectionSpacing:
      (data.mobileSectionSpacing as SiteTheme["mobileSectionSpacing"]) ??
      defaults.mobileSectionSpacing,
    mobileImageRatio: String(
      data.mobileImageRatio ?? defaults.mobileImageRatio,
    ),
    createdAt: String(data.createdAt ?? defaults.createdAt),
    updatedAt: String(data.updatedAt ?? defaults.updatedAt),
  };
}

export async function getSiteTheme(): Promise<SiteTheme> {
  try {
    const doc = await getAdminDb().doc(THEME_DOC).get();
    return mapThemeDoc(doc.exists ? doc.data() : undefined);
  } catch {
    return getDefaultTheme();
  }
}

export async function updateSiteTheme(
  data: Partial<SiteTheme>,
): Promise<SiteTheme> {
  const current = await getSiteTheme();
  const merged: SiteTheme = {
    ...current,
    ...data,
    updatedAt: new Date().toISOString(),
    createdAt: current.createdAt || new Date().toISOString(),
  };
  await getAdminDb().doc(THEME_DOC).set(merged);
  return merged;
}

export async function resetSiteTheme(): Promise<SiteTheme> {
  const theme = getDefaultTheme();
  await getAdminDb().doc(THEME_DOC).set(theme);
  return theme;
}

export { getDefaultTheme, applyThemePreset };
