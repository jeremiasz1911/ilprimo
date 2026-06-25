import type { DocumentData } from "firebase-admin/firestore";
import { menuCategories as seedMenuCategories } from "@/data/menu";
import { getAdminDb } from "@/lib/firebase-admin";
import { PLACEHOLDER_DISH_IMAGE } from "@/lib/constants";
import { decodeSlugParam, slugify } from "@/lib/slugify";
import type { Category, Dish, PublicDish, PublicMenuCategory } from "@/lib/types";

const CATEGORIES_COLLECTION = "categories";
const DISHES_COLLECTION = "dishes";

export class CategoryInUseError extends Error {
  constructor(count: number) {
    super(
      `Nie można usunąć kategorii — przypisane są dania (${count}). Najpierw usuń lub przenieś dania.`,
    );
    this.name = "CategoryInUseError";
  }
}

function mapCategoryDoc(id: string, data: DocumentData): Category {
  return {
    id,
    name: data.name ?? "",
    slug: data.slug ?? id,
    order: data.order ?? 0,
    isActive: data.isActive !== false,
  };
}

function mapDishDoc(id: string, data: DocumentData): Dish {
  return {
    id,
    slug: data.slug ?? id,
    categoryId: data.categoryId ?? "",
    name: data.name ?? "",
    price: data.price ?? "",
    shortDescription: data.shortDescription ?? "",
    longDescription: data.longDescription ?? "",
    ingredients: Array.isArray(data.ingredients) ? data.ingredients : [],
    allergens: Array.isArray(data.allergens) ? data.allergens : [],
    image: data.image || PLACEHOLDER_DISH_IMAGE,
    isVegetarian: Boolean(data.isVegetarian),
    isSpicy: Boolean(data.isSpicy),
    isGlutenFree: Boolean(data.isGlutenFree),
    isAvailable: data.isAvailable !== false,
    order: data.order ?? 0,
  };
}

function getSeedCategories(): Category[] {
  return seedMenuCategories.map((category, index) => ({
    id: category.id,
    name: category.name,
    slug: category.id,
    order: index,
    isActive: true,
  }));
}

function getSeedDishes(): Dish[] {
  return seedMenuCategories.flatMap((category, categoryIndex) =>
    category.items.map((item, itemIndex) => ({
      id: item.id,
      slug: item.slug,
      categoryId: category.id,
      name: item.name,
      price: item.price,
      shortDescription: item.shortDescription,
      longDescription: item.longDescription,
      ingredients: item.ingredients,
      allergens: item.allergens,
      image: item.image || PLACEHOLDER_DISH_IMAGE,
      isVegetarian: item.isVegetarian,
      isSpicy: item.isSpicy,
      isGlutenFree: item.isGlutenFree,
      isAvailable: true,
      order: categoryIndex * 100 + itemIndex,
    })),
  );
}

function buildPublicMenu(
  categories: Category[],
  dishes: Dish[],
): PublicMenuCategory[] {
  const categoryMap = new Map(categories.map((c) => [c.id, c]));

  return [...categories]
    .filter((category) => category.isActive)
    .sort((a, b) => a.order - b.order)
    .map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      order: category.order,
      items: dishes
        .filter((dish) => dish.categoryId === category.id && dish.isAvailable)
        .sort((a, b) => a.order - b.order)
        .map((dish) => ({
          ...dish,
          category: categoryMap.get(dish.categoryId)?.name ?? category.name,
        })),
    }))
    .filter((category) => category.items.length > 0);
}

async function fetchFirestoreCategories(
  activeOnly = false,
): Promise<Category[]> {
  try {
    const snapshot = await getAdminDb()
      .collection(CATEGORIES_COLLECTION)
      .orderBy("order", "asc")
      .get();

    const categories = snapshot.docs.map((doc) =>
      mapCategoryDoc(doc.id, doc.data()),
    );

    if (activeOnly) {
      return categories.filter((category) => category.isActive);
    }

    return categories;
  } catch {
    return [];
  }
}

async function fetchFirestoreDishes(availableOnly = false): Promise<Dish[]> {
  try {
    const collection = getAdminDb().collection(DISHES_COLLECTION);
    const snapshot = availableOnly
      ? await collection.where("isAvailable", "==", true).get()
      : await collection.get();

    return snapshot.docs
      .map((doc) => mapDishDoc(doc.id, doc.data()))
      .sort((a, b) => a.order - b.order);
  } catch {
    return [];
  }
}

export async function getPublicMenu(): Promise<PublicMenuCategory[]> {
  const [categories, dishes] = await Promise.all([
    fetchFirestoreCategories(true),
    fetchFirestoreDishes(true),
  ]);

  return buildPublicMenu(categories, dishes);
}

export async function getPublicDishBySlug(
  rawSlug: string,
): Promise<PublicDish | undefined> {
  try {
    const decoded = decodeSlugParam(rawSlug);
    const normalized = slugify(decoded);
    const candidates = [...new Set([normalized, decoded, rawSlug].filter(Boolean))];

    for (const candidate of candidates) {
      const dish = await findDishDocBySlug(candidate);
      if (dish) {
        return enrichPublicDish(dish);
      }
    }

    const dishes = await fetchFirestoreDishes(false);
    const legacyMatch = dishes.find(
      (dish) => slugify(dish.slug) === normalized || slugify(dish.name) === normalized,
    );

    if (!legacyMatch) return undefined;
    return enrichPublicDish(legacyMatch);
  } catch {
    return undefined;
  }
}

async function findDishDocBySlug(slug: string): Promise<Dish | null> {
  const snapshot = await getAdminDb()
    .collection(DISHES_COLLECTION)
    .where("slug", "==", slug)
    .limit(1)
    .get();

  if (snapshot.empty) return null;
  const doc = snapshot.docs[0];
  return mapDishDoc(doc.id, doc.data());
}

async function enrichPublicDish(dish: Dish): Promise<PublicDish | undefined> {
  if (!dish.isAvailable) return undefined;

  const categoryDoc = await getAdminDb()
    .collection(CATEGORIES_COLLECTION)
    .doc(dish.categoryId)
    .get();

  if (!categoryDoc.exists) return undefined;

  const category = mapCategoryDoc(categoryDoc.id, categoryDoc.data()!);
  if (!category.isActive) return undefined;

  return { ...dish, category: category.name };
}

export async function normalizeAllDishSlugs(): Promise<{ updated: number }> {
  const dishes = await fetchFirestoreDishes(false);
  const batch = getAdminDb().batch();
  let updated = 0;

  dishes.forEach((dish) => {
    const nextSlug = slugify(dish.slug || dish.name);
    if (!nextSlug || nextSlug === dish.slug) return;

    const ref = getAdminDb().collection(DISHES_COLLECTION).doc(dish.id);
    batch.update(ref, { slug: nextSlug });
    updated += 1;
  });

  if (updated > 0) {
    await batch.commit();
  }

  return { updated };
}

export async function getAllPublicDishSlugs(): Promise<string[]> {
  const dishes = await fetchFirestoreDishes(true);
  return dishes.map((dish) => slugify(dish.slug));
}

export async function getAllCategories(): Promise<Category[]> {
  return fetchFirestoreCategories(false);
}

export async function getCategoryById(id: string): Promise<Category | null> {
  try {
    const doc = await getAdminDb()
      .collection(CATEGORIES_COLLECTION)
      .doc(id)
      .get();
    if (!doc.exists) return null;
    return mapCategoryDoc(doc.id, doc.data()!);
  } catch {
    return null;
  }
}

export async function getAllDishes(): Promise<Dish[]> {
  return fetchFirestoreDishes(false);
}

export async function getDishById(id: string): Promise<Dish | null> {
  try {
    const doc = await getAdminDb().collection(DISHES_COLLECTION).doc(id).get();
    if (!doc.exists) return null;
    return mapDishDoc(doc.id, doc.data()!);
  } catch {
    return null;
  }
}

export async function createCategory(
  data: Omit<Category, "id"> & { id?: string },
): Promise<Category> {
  const slug = slugify(data.slug || data.name);
  const id = slugify(data.id || slug);
  const payload = {
    name: data.name,
    slug,
    order: data.order,
    isActive: data.isActive !== false,
  };
  await getAdminDb().collection(CATEGORIES_COLLECTION).doc(id).set(payload);
  return { id, ...payload };
}

export async function updateCategory(
  id: string,
  data: Partial<Omit<Category, "id">>,
): Promise<void> {
  const payload = { ...data };
  if (typeof payload.slug === "string") {
    payload.slug = slugify(payload.slug);
  }
  await getAdminDb().collection(CATEGORIES_COLLECTION).doc(id).update(payload);
}

export async function deleteCategory(id: string): Promise<void> {
  const dishes = await getAdminDb()
    .collection(DISHES_COLLECTION)
    .where("categoryId", "==", id)
    .get();

  if (!dishes.empty) {
    throw new CategoryInUseError(dishes.size);
  }

  await getAdminDb().collection(CATEGORIES_COLLECTION).doc(id).delete();
}

export async function createDish(
  data: Omit<Dish, "id"> & { id?: string },
): Promise<Dish> {
  const slug = slugify(data.slug || data.name);
  const id = slugify(data.id || slug);
  const payload = {
    slug,
    categoryId: data.categoryId,
    name: data.name,
    price: data.price,
    shortDescription: data.shortDescription,
    longDescription: data.longDescription,
    ingredients: data.ingredients,
    allergens: data.allergens,
    image: data.image || PLACEHOLDER_DISH_IMAGE,
    isVegetarian: data.isVegetarian,
    isSpicy: data.isSpicy,
    isGlutenFree: data.isGlutenFree,
    isAvailable: data.isAvailable,
    order: data.order,
  };
  await getAdminDb().collection(DISHES_COLLECTION).doc(id).set(payload);
  return { id, ...payload };
}

export async function updateDish(
  id: string,
  data: Partial<Omit<Dish, "id">>,
): Promise<void> {
  const payload = { ...data };
  if (typeof payload.slug === "string") {
    payload.slug = slugify(payload.slug);
  }
  await getAdminDb().collection(DISHES_COLLECTION).doc(id).update(payload);
}

export async function deleteDish(id: string): Promise<void> {
  await getAdminDb().collection(DISHES_COLLECTION).doc(id).delete();
}

export async function seedFirestoreFromMenuData(): Promise<{
  categories: number;
  dishes: number;
}> {
  const batch = getAdminDb().batch();
  const categories = getSeedCategories();
  const dishes = getSeedDishes();

  categories.forEach((category) => {
    const ref = getAdminDb().collection(CATEGORIES_COLLECTION).doc(category.id);
    batch.set(ref, {
      name: category.name,
      slug: category.slug,
      order: category.order,
      isActive: category.isActive,
    });
  });

  dishes.forEach((dish) => {
    const ref = getAdminDb().collection(DISHES_COLLECTION).doc(dish.id);
    batch.set(ref, {
      slug: dish.slug,
      categoryId: dish.categoryId,
      name: dish.name,
      price: dish.price,
      shortDescription: dish.shortDescription,
      longDescription: dish.longDescription,
      ingredients: dish.ingredients,
      allergens: dish.allergens,
      image: dish.image,
      isVegetarian: dish.isVegetarian,
      isSpicy: dish.isSpicy,
      isGlutenFree: dish.isGlutenFree,
      isAvailable: dish.isAvailable,
      order: dish.order,
    });
  });

  await batch.commit();
  return { categories: categories.length, dishes: dishes.length };
}
