export interface Category {
  id: string;
  name: string;
  slug: string;
  order: number;
  isActive: boolean;
}

export interface Dish {
  id: string;
  slug: string;
  categoryId: string;
  name: string;
  price: string;
  shortDescription: string;
  longDescription: string;
  ingredients: string[];
  allergens: string[];
  image: string;
  isVegetarian: boolean;
  isSpicy: boolean;
  isGlutenFree: boolean;
  isAvailable: boolean;
  order: number;
}

export interface PublicDish extends Dish {
  category: string;
}

export interface PublicMenuCategory {
  id: string;
  name: string;
  slug: string;
  order: number;
  items: PublicDish[];
}

export type PageSectionType =
  | "hero"
  | "about"
  | "menu"
  | "contact"
  | "custom";

export interface NavLink {
  href: string;
  label: string;
}

export interface SiteSettings {
  restaurantName: string;
  address: string;
  phone: string;
  email: string;
  facebookUrl: string;
  instagramUrl: string;
  footerText: string;
  logo: string;
  copyrightText: string;
}

export type LayoutVariant =
  | "default"
  | "image-left"
  | "image-right"
  | "centered"
  | "split"
  | "full-hero"
  | "simple-text"
  | "gallery";

export type BackgroundType =
  | "default"
  | "color"
  | "image"
  | "dark"
  | "light";

export type TextAlign = "left" | "center" | "right";
export type ContentWidth = "narrow" | "default" | "wide" | "full";
export type SpacingSize = "small" | "medium" | "large" | "compact" | "comfortable" | "spacious";
export type BorderRadiusSize = "none" | "small" | "medium" | "large";
export type ButtonStyle = "premium" | "outline" | "filled" | "rounded" | "minimal";
export type CardStyle = "photo" | "flat" | "bordered";
export type ImageStyle = "cinematic" | "natural" | "bright";
export type PageCharacter = "elegant" | "modern" | "warm";
export type AnimationIntensity = "none" | "subtle" | "normal" | "strong";
export type MenuCardStyle = "album" | "elegant" | "minimal" | "overlay" | "classic";
export type MobileNavbarStyle = "hamburger" | "bottom-sheet" | "simple";
export type FontFamilyChoice = "serif" | "sans";

export interface SectionLayoutSettings {
  layoutVariant: LayoutVariant;
  backgroundType: BackgroundType;
  backgroundColor: string;
  textAlign: TextAlign;
  imagePosition: "left" | "right" | "center";
  contentWidth: ContentWidth;
  paddingTop: SpacingSize;
  paddingBottom: SpacingSize;
  isFullWidth: boolean;
  hideOnMobile: boolean;
  hideOnDesktop: boolean;
}

export interface MenuLayoutSettings {
  menuGridDesktop: number;
  menuGridTablet: number;
  menuGridMobile: number;
  menuCardImageRatio: string;
  menuCardTextAlign: TextAlign;
  menuCardShowDescription: boolean;
  menuCardShowAllergens: boolean;
  menuCardShowPrice: boolean;
  menuCardStyle: MenuCardStyle;
}

export interface SiteTheme extends MenuLayoutSettings {
  themeName: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  mutedTextColor: string;
  navbarBackgroundColor: string;
  footerBackgroundColor: string;
  buttonPrimaryColor: string;
  buttonPrimaryTextColor: string;
  buttonSecondaryColor: string;
  buttonSecondaryTextColor: string;
  cardBackgroundColor: string;
  borderColor: string;
  fontHeading: FontFamilyChoice;
  fontBody: FontFamilyChoice;
  borderRadius: BorderRadiusSize;
  sectionSpacing: SpacingSize;
  cardSpacing: SpacingSize;
  maxWidth: string;
  buttonStyle: ButtonStyle;
  cardStyle: CardStyle;
  imageStyle: ImageStyle;
  pageCharacter: PageCharacter;
  enableAnimations: boolean;
  animationIntensity: AnimationIntensity;
  enableParallax: boolean;
  enableMouseGlow: boolean;
  enableHoverEffects: boolean;
  enableSectionReveal: boolean;
  mobileNavbarStyle: MobileNavbarStyle;
  mobileSectionSpacing: SpacingSize;
  mobileImageRatio: string;
  createdAt: string;
  updatedAt: string;
}

export interface PageSection extends SectionLayoutSettings {
  id: string;
  type: PageSectionType;
  title: string;
  subtitle: string;
  content: string;
  buttonText: string;
  buttonLink: string;
  image: string;
  order: number;
  isActive: boolean;
  showInNavigation: boolean;
  navigationLabel: string;
}
