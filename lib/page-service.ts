import type { DocumentData } from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebase-admin";
import { DEFAULT_LOGO } from "@/lib/constants";
import { getDefaultSectionLayout, mapSectionLayout } from "@/lib/section-layout";
import type { NavLink, PageSection, PageSectionType, SiteSettings } from "@/lib/types";

const PAGE_SECTIONS_COLLECTION = "pageSections";
const SITE_SETTINGS_DOC = "siteSettings/general";

const DEFAULT_SITE_SETTINGS: SiteSettings = {
  restaurantName: "IL PRIMO Ristorante Italiano",
  address: "Aleja Marszałka Józefa Piłsudskiego 41/68, 06-500 Mława",
  phone: "510 457 222",
  email: "",
  facebookUrl: "",
  instagramUrl: "",
  footerText: "",
  logo: DEFAULT_LOGO,
  copyrightText: "© 2026 IL PRIMO",
};

const SECTION_LAYOUT_DEFAULTS = getDefaultSectionLayout();

const DEFAULT_PAGE_SECTIONS: Omit<PageSection, "id">[] = [
  {
    type: "hero",
    title: "IL PRIMO",
    subtitle: "Benvenuti",
    content:
      "Ristorante Italiano\nAutentyczna kuchnia włoska w sercu Mławy",
    buttonText: "ZOBACZ MENU",
    buttonLink: "#menu",
    image: "/images/glowne.jpg",
    order: 0,
    isActive: true,
    showInNavigation: true,
    navigationLabel: "STRONA GŁÓWNA",
    ...SECTION_LAYOUT_DEFAULTS,
  },
  {
    type: "about",
    title: "Tradycja i smak Włoch",
    subtitle: "O nas",
    content:
      "IL PRIMO to miejsce, w którym spotykają się autentyczne włoskie smaki i ciepła atmosfera. Nasza kuchnia opiera się na świeżych składnikach, sprawdzonych recepturach i pasji do gotowania przekazywanej z pokolenia na pokolenie.\n\nSerwujemy domowe makarony, klasyczne przystawki i desery, które przeniosą Cię prosto do serca Italii. Zapraszamy do odkrywania prawdziwej kuchni włoskiej w eleganckim wnętrzu w centrum Mławy.\n\nKażde danie przygotowujemy z dbałością o detale — od aromatycznego espresso po perfekcyjnie ugotowane al dente spaghetti. U nas gościnność to nie tylko słowo, to sposób, w jaki witamy każdego gościa.",
    buttonText: "",
    buttonLink: "",
    image: "/images/onas.jpg",
    order: 1,
    isActive: true,
    showInNavigation: true,
    navigationLabel: "O NAS",
    ...SECTION_LAYOUT_DEFAULTS,
    layoutVariant: "image-left",
  },
  {
    type: "menu",
    title: "Smaki Italii",
    subtitle: "Nasze menu",
    content:
      "Odkryj nasze dania — od klasycznych przystawek po autorskie makarony i wyśmienite desery.",
    buttonText: "",
    buttonLink: "",
    image: "",
    order: 2,
    isActive: true,
    showInNavigation: true,
    navigationLabel: "MENU",
    ...SECTION_LAYOUT_DEFAULTS,
    backgroundType: "dark",
  },
  {
    type: "contact",
    title: "",
    subtitle: "",
    content: "",
    buttonText: "",
    buttonLink: "",
    image: "",
    order: 3,
    isActive: true,
    showInNavigation: true,
    navigationLabel: "KONTAKT",
    ...SECTION_LAYOUT_DEFAULTS,
    backgroundType: "dark",
  },
];

const SECTION_IDS = ["hero", "about", "menu", "contact"] as const;

function mapSectionDoc(id: string, data: DocumentData): PageSection {
  return {
    id,
    type: (data.type as PageSectionType) ?? "custom",
    title: data.title ?? "",
    subtitle: data.subtitle ?? "",
    content: data.content ?? "",
    buttonText: data.buttonText ?? "",
    buttonLink: data.buttonLink ?? "",
    image: data.image ?? "",
    order: data.order ?? 0,
    isActive: data.isActive !== false,
    showInNavigation: data.showInNavigation === true,
    navigationLabel: data.navigationLabel ?? "",
    ...mapSectionLayout(data as Record<string, unknown>),
  };
}

function mapSiteSettings(data: DocumentData | undefined): SiteSettings {
  if (!data) return { ...DEFAULT_SITE_SETTINGS };
  return {
    restaurantName: data.restaurantName ?? DEFAULT_SITE_SETTINGS.restaurantName,
    address: data.address ?? DEFAULT_SITE_SETTINGS.address,
    phone: data.phone ?? DEFAULT_SITE_SETTINGS.phone,
    email: data.email ?? "",
    facebookUrl: data.facebookUrl ?? "",
    instagramUrl: data.instagramUrl ?? "",
    footerText: data.footerText ?? "",
    logo: data.logo || DEFAULT_LOGO,
    copyrightText: data.copyrightText ?? DEFAULT_SITE_SETTINGS.copyrightText,
  };
}

function sectionNavHref(section: PageSection): string {
  if (section.type === "hero") return "/";
  return `/#${section.id}`;
}

export async function getAllPageSections(): Promise<PageSection[]> {
  try {
    const snapshot = await getAdminDb()
      .collection(PAGE_SECTIONS_COLLECTION)
      .orderBy("order", "asc")
      .get();
    return snapshot.docs.map((doc) => mapSectionDoc(doc.id, doc.data()));
  } catch (error) {
    console.error("[page-service] getAllPageSections failed:", error);
    return [];
  }
}

export async function getActivePageSections(): Promise<PageSection[]> {
  const sections = await getAllPageSections();
  return sections.filter((section) => section.isActive);
}

export async function getNavigationLinks(): Promise<NavLink[]> {
  const sections = await getAllPageSections();
  return sections
    .filter((section) => section.isActive && section.showInNavigation)
    .sort((a, b) => a.order - b.order)
    .map((section) => ({
      href: sectionNavHref(section),
      label: section.navigationLabel || section.title || section.id,
    }));
}

export async function getPageSectionById(
  id: string,
): Promise<PageSection | null> {
  try {
    const doc = await getAdminDb()
      .collection(PAGE_SECTIONS_COLLECTION)
      .doc(id)
      .get();
    if (!doc.exists) return null;
    return mapSectionDoc(doc.id, doc.data()!);
  } catch {
    return null;
  }
}

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const doc = await getAdminDb().doc(SITE_SETTINGS_DOC).get();
    return mapSiteSettings(doc.exists ? doc.data() : undefined);
  } catch {
    return { ...DEFAULT_SITE_SETTINGS };
  }
}

export async function createPageSection(
  data: Omit<PageSection, "id"> & { id?: string },
): Promise<PageSection> {
  const id = data.id || `section-${Date.now()}`;
  const payload = {
    type: data.type,
    title: data.title,
    subtitle: data.subtitle,
    content: data.content,
    buttonText: data.buttonText,
    buttonLink: data.buttonLink,
    image: data.image,
    order: data.order,
    isActive: data.isActive !== false,
    showInNavigation: data.showInNavigation === true,
    navigationLabel: data.navigationLabel,
    layoutVariant: data.layoutVariant,
    backgroundType: data.backgroundType,
    backgroundColor: data.backgroundColor,
    textAlign: data.textAlign,
    imagePosition: data.imagePosition,
    contentWidth: data.contentWidth,
    paddingTop: data.paddingTop,
    paddingBottom: data.paddingBottom,
    isFullWidth: data.isFullWidth,
    hideOnMobile: data.hideOnMobile,
    hideOnDesktop: data.hideOnDesktop,
  };
  await getAdminDb().collection(PAGE_SECTIONS_COLLECTION).doc(id).set(payload);
  return { id, ...payload };
}

export async function updatePageSection(
  id: string,
  data: Partial<Omit<PageSection, "id">>,
): Promise<void> {
  await getAdminDb().collection(PAGE_SECTIONS_COLLECTION).doc(id).update(data);
}

export async function deletePageSection(id: string): Promise<void> {
  await getAdminDb().collection(PAGE_SECTIONS_COLLECTION).doc(id).delete();
}

export async function updateSiteSettings(
  data: Partial<SiteSettings>,
): Promise<SiteSettings> {
  const current = await getSiteSettings();
  const merged = { ...current, ...data };
  await getAdminDb().doc(SITE_SETTINGS_DOC).set(merged);
  return merged;
}

export async function seedDefaultPageStructure(): Promise<{
  sections: number;
  settings: boolean;
}> {
  const batch = getAdminDb().batch();

  DEFAULT_PAGE_SECTIONS.forEach((section, index) => {
    const id = SECTION_IDS[index];
    const ref = getAdminDb().collection(PAGE_SECTIONS_COLLECTION).doc(id);
    batch.set(ref, section);
  });

  const settingsRef = getAdminDb().doc(SITE_SETTINGS_DOC);
  batch.set(settingsRef, DEFAULT_SITE_SETTINGS);

  await batch.commit();
  return { sections: DEFAULT_PAGE_SECTIONS.length, settings: true };
}
