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

export interface PageSection {
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
