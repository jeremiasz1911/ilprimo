import { getAllCategories, getAllDishes } from "@/lib/menu-service";
import { getAdminDb } from "@/lib/firebase-admin";
import { getAllPageSections, getSiteSettings } from "@/lib/page-service";
import { getSiteTheme, updateSiteTheme } from "@/lib/theme-service";
import {
  assertValidBackup,
  BACKUP_VERSION,
  type IlPrimoBackup,
} from "@/lib/backup-validation";
import type { Category, Dish, PageSection } from "@/lib/types";

const PAGE_SECTIONS_COLLECTION = "pageSections";
const CATEGORIES_COLLECTION = "categories";
const DISHES_COLLECTION = "dishes";
const SITE_SETTINGS_DOC = "siteSettings/general";

const BATCH_LIMIT = 450;

async function deleteCollection(collectionName: string) {
  const db = getAdminDb();
  const snapshot = await db.collection(collectionName).get();
  if (snapshot.empty) return;

  const docs = snapshot.docs;
  for (let i = 0; i < docs.length; i += BATCH_LIMIT) {
    const batch = db.batch();
    docs.slice(i, i + BATCH_LIMIT).forEach((doc) => batch.delete(doc.ref));
    await batch.commit();
  }
}

function sectionToFirestore(section: PageSection) {
  return {
    type: section.type,
    title: section.title,
    subtitle: section.subtitle,
    content: section.content,
    buttonText: section.buttonText,
    buttonLink: section.buttonLink,
    image: section.image,
    order: section.order,
    isActive: section.isActive !== false,
    showInNavigation: section.showInNavigation === true,
    navigationLabel: section.navigationLabel,
    layoutVariant: section.layoutVariant,
    backgroundType: section.backgroundType,
    backgroundColor: section.backgroundColor,
    textAlign: section.textAlign,
    imagePosition: section.imagePosition,
    contentWidth: section.contentWidth,
    paddingTop: section.paddingTop,
    paddingBottom: section.paddingBottom,
    isFullWidth: section.isFullWidth,
    hideOnMobile: section.hideOnMobile,
    hideOnDesktop: section.hideOnDesktop,
  };
}

function categoryToFirestore(category: Category) {
  return {
    name: category.name,
    slug: category.slug,
    order: category.order,
    isActive: category.isActive !== false,
  };
}

function dishToFirestore(dish: Dish) {
  return {
    slug: dish.slug,
    categoryId: dish.categoryId,
    name: dish.name,
    price: dish.price,
    shortDescription: dish.shortDescription,
    longDescription: dish.longDescription,
    ingredients: dish.ingredients,
    allergens: dish.allergens,
    image: dish.image,
    isVegetarian: Boolean(dish.isVegetarian),
    isSpicy: Boolean(dish.isSpicy),
    isGlutenFree: Boolean(dish.isGlutenFree),
    isAvailable: dish.isAvailable !== false,
    order: dish.order,
  };
}

export async function exportBackup(): Promise<IlPrimoBackup> {
  const [siteSettings, pageSections, categories, dishes, siteTheme] =
    await Promise.all([
    getSiteSettings(),
    getAllPageSections(),
    getAllCategories(),
    getAllDishes(),
    getSiteTheme(),
  ]);

  return {
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    siteSettings,
    pageSections,
    categories,
    dishes,
    siteTheme,
  };
}

export async function importBackup(rawData: unknown): Promise<{
  pageSections: number;
  categories: number;
  dishes: number;
  siteSettings: boolean;
  siteTheme: boolean;
}> {
  assertValidBackup(rawData);
  const data = rawData;

  await Promise.all([
    deleteCollection(PAGE_SECTIONS_COLLECTION),
    deleteCollection(CATEGORIES_COLLECTION),
    deleteCollection(DISHES_COLLECTION),
  ]);

  const db = getAdminDb();

  for (let i = 0; i < data.pageSections.length; i += BATCH_LIMIT) {
    const batch = db.batch();
    data.pageSections.slice(i, i + BATCH_LIMIT).forEach((section) => {
      batch.set(
        db.collection(PAGE_SECTIONS_COLLECTION).doc(section.id),
        sectionToFirestore(section),
      );
    });
    await batch.commit();
  }

  for (let i = 0; i < data.categories.length; i += BATCH_LIMIT) {
    const batch = db.batch();
    data.categories.slice(i, i + BATCH_LIMIT).forEach((category) => {
      batch.set(
        db.collection(CATEGORIES_COLLECTION).doc(category.id),
        categoryToFirestore(category),
      );
    });
    await batch.commit();
  }

  for (let i = 0; i < data.dishes.length; i += BATCH_LIMIT) {
    const batch = db.batch();
    data.dishes.slice(i, i + BATCH_LIMIT).forEach((dish) => {
      batch.set(
        db.collection(DISHES_COLLECTION).doc(dish.id),
        dishToFirestore(dish),
      );
    });
    await batch.commit();
  }

  await db.doc(SITE_SETTINGS_DOC).set(data.siteSettings);

  if (data.siteTheme) {
    await updateSiteTheme(data.siteTheme);
  }

  return {
    pageSections: data.pageSections.length,
    categories: data.categories.length,
    dishes: data.dishes.length,
    siteSettings: true,
    siteTheme: Boolean(data.siteTheme),
  };
}
