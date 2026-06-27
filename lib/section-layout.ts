import type { CSSProperties } from "react";
import type { PageSection, SectionLayoutSettings } from "@/lib/types";

export function getDefaultSectionLayout(): SectionLayoutSettings {
  return {
    layoutVariant: "default",
    backgroundType: "default",
    backgroundColor: "",
    textAlign: "center",
    imagePosition: "center",
    contentWidth: "default",
    paddingTop: "medium",
    paddingBottom: "medium",
    isFullWidth: false,
    hideOnMobile: false,
    hideOnDesktop: false,
  };
}

export function mapSectionLayout(data: Record<string, unknown>): SectionLayoutSettings {
  const defaults = getDefaultSectionLayout();
  return {
    layoutVariant:
      (data.layoutVariant as SectionLayoutSettings["layoutVariant"]) ??
      defaults.layoutVariant,
    backgroundType:
      (data.backgroundType as SectionLayoutSettings["backgroundType"]) ??
      defaults.backgroundType,
    backgroundColor: String(data.backgroundColor ?? ""),
    textAlign:
      (data.textAlign as SectionLayoutSettings["textAlign"]) ??
      defaults.textAlign,
    imagePosition:
      (data.imagePosition as SectionLayoutSettings["imagePosition"]) ??
      defaults.imagePosition,
    contentWidth:
      (data.contentWidth as SectionLayoutSettings["contentWidth"]) ??
      defaults.contentWidth,
    paddingTop:
      (data.paddingTop as SectionLayoutSettings["paddingTop"]) ??
      defaults.paddingTop,
    paddingBottom:
      (data.paddingBottom as SectionLayoutSettings["paddingBottom"]) ??
      defaults.paddingBottom,
    isFullWidth: data.isFullWidth === true,
    hideOnMobile: data.hideOnMobile === true,
    hideOnDesktop: data.hideOnDesktop === true,
  };
}

export function getSectionVisibilityClass(section: PageSection): string {
  if (section.hideOnMobile && section.hideOnDesktop) return "hidden";
  if (section.hideOnMobile) return "hidden md:block";
  if (section.hideOnDesktop) return "md:hidden";
  return "";
}

export function getSectionPaddingClass(section: PageSection): string {
  const topMap = {
    small: "pt-12 sm:pt-16",
    medium: "pt-16 sm:pt-24",
    large: "pt-20 sm:pt-32",
    compact: "pt-10 sm:pt-14",
    comfortable: "pt-16 sm:pt-24",
    spacious: "pt-20 sm:pt-32",
  } as const;
  const bottomMap = {
    small: "pb-12 sm:pb-16",
    medium: "pb-16 sm:pb-24",
    large: "pb-20 sm:pb-32",
    compact: "pb-10 sm:pb-14",
    comfortable: "pb-16 sm:pb-24",
    spacious: "pb-20 sm:pb-32",
  } as const;

  return `${topMap[section.paddingTop] ?? topMap.medium} ${bottomMap[section.paddingBottom] ?? bottomMap.medium}`;
}

export function getSectionTextAlignClass(section: PageSection): string {
  if (section.textAlign === "left") return "text-left";
  if (section.textAlign === "right") return "text-right";
  return "text-center";
}

export function getSectionBackgroundStyle(section: PageSection): CSSProperties {
  if (section.backgroundType === "color" && section.backgroundColor) {
    return { backgroundColor: section.backgroundColor };
  }
  if (section.backgroundType === "dark") {
    return { backgroundColor: "var(--theme-primary)" };
  }
  if (section.backgroundType === "light") {
    return { backgroundColor: "var(--theme-secondary)" };
  }
  return {};
}

export function getSectionGridClass(section: PageSection): string {
  if (section.layoutVariant === "image-left") {
    return "lg:grid lg:grid-cols-2 lg:items-center";
  }
  if (section.layoutVariant === "image-right") {
    return "lg:grid lg:grid-cols-2 lg:items-center";
  }
  if (section.layoutVariant === "split") {
    return "lg:grid lg:grid-cols-2 lg:gap-12";
  }
  return "";
}

export function getContentWidthClass(section: PageSection): string {
  if (section.isFullWidth || section.contentWidth === "full") {
    return "w-full max-w-none";
  }
  if (section.contentWidth === "narrow") return "mx-auto max-w-3xl";
  if (section.contentWidth === "wide") return "mx-auto max-w-7xl";
  return "mx-auto max-w-5xl";
}
