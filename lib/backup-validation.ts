import type { Category, Dish, PageSection, SiteSettings, SiteTheme } from "@/lib/types";

export const BACKUP_VERSION = 1;

export interface IlPrimoBackup {
  version: number;
  exportedAt: string;
  siteSettings: SiteSettings;
  pageSections: PageSection[];
  categories: Category[];
  dishes: Dish[];
  siteTheme?: SiteTheme;
}

export interface BackupPreview {
  valid: boolean;
  errors: string[];
  exportedAt: string | null;
  pageSections: number;
  categories: number;
  dishes: number;
  hasSiteSettings: boolean;
  hasSiteTheme: boolean;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isNumber(value: unknown): value is number {
  return typeof value === "number" && !Number.isNaN(value);
}

function isBoolean(value: unknown): value is boolean {
  return typeof value === "boolean";
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function validateSiteSettings(value: unknown, errors: string[]): boolean {
  const start = errors.length;

  if (!isObject(value)) {
    errors.push("Brak lub nieprawidłowe pole siteSettings.");
    return false;
  }

  const requiredStrings = [
    "restaurantName",
    "address",
    "phone",
    "email",
    "facebookUrl",
    "instagramUrl",
    "footerText",
    "logo",
    "copyrightText",
  ] as const;

  for (const key of requiredStrings) {
    if (!isString(value[key])) {
      errors.push(`siteSettings.${key} musi być tekstem.`);
    }
  }

  return errors.length === start;
}

function validatePageSection(value: unknown, index: number, errors: string[]): boolean {
  if (!isObject(value)) {
    errors.push(`pageSections[${index}] ma nieprawidłowy format.`);
    return false;
  }

  if (!isString(value.id)) errors.push(`pageSections[${index}].id jest wymagane.`);
  if (!isString(value.type)) errors.push(`pageSections[${index}].type jest wymagane.`);
  if (!isString(value.title)) errors.push(`pageSections[${index}].title musi być tekstem.`);
  if (!isString(value.subtitle)) errors.push(`pageSections[${index}].subtitle musi być tekstem.`);
  if (!isString(value.content)) errors.push(`pageSections[${index}].content musi być tekstem.`);
  if (!isNumber(value.order)) errors.push(`pageSections[${index}].order musi być liczbą.`);

  return true;
}

function validateCategory(value: unknown, index: number, errors: string[]): boolean {
  if (!isObject(value)) {
    errors.push(`categories[${index}] ma nieprawidłowy format.`);
    return false;
  }

  if (!isString(value.id)) errors.push(`categories[${index}].id jest wymagane.`);
  if (!isString(value.name)) errors.push(`categories[${index}].name jest wymagane.`);
  if (!isString(value.slug)) errors.push(`categories[${index}].slug jest wymagane.`);
  if (!isNumber(value.order)) errors.push(`categories[${index}].order musi być liczbą.`);

  return true;
}

function validateDish(value: unknown, index: number, errors: string[]): boolean {
  if (!isObject(value)) {
    errors.push(`dishes[${index}] ma nieprawidłowy format.`);
    return false;
  }

  if (!isString(value.id)) errors.push(`dishes[${index}].id jest wymagane.`);
  if (!isString(value.slug)) errors.push(`dishes[${index}].slug jest wymagane.`);
  if (!isString(value.categoryId)) errors.push(`dishes[${index}].categoryId jest wymagane.`);
  if (!isString(value.name)) errors.push(`dishes[${index}].name jest wymagane.`);
  if (!isString(value.image)) errors.push(`dishes[${index}].image musi być linkiem (tekst).`);
  if (!isStringArray(value.ingredients)) errors.push(`dishes[${index}].ingredients musi być tablicą tekstów.`);
  if (!isStringArray(value.allergens)) errors.push(`dishes[${index}].allergens musi być tablicą tekstów.`);

  return true;
}

export function previewBackupData(data: unknown): BackupPreview {
  const errors: string[] = [];

  if (!isObject(data)) {
    return {
      valid: false,
      errors: ["Plik JSON ma nieprawidłową strukturę."],
      exportedAt: null,
      pageSections: 0,
      categories: 0,
      dishes: 0,
      hasSiteSettings: false,
      hasSiteTheme: false,
    };
  }

  if (!isNumber(data.version)) {
    errors.push("Brak pola version.");
  } else if (data.version !== BACKUP_VERSION) {
    errors.push(`Nieobsługiwana wersja backupu: ${data.version}.`);
  }

  const exportedAt = isString(data.exportedAt) ? data.exportedAt : null;
  if (!exportedAt) {
    errors.push("Brak pola exportedAt.");
  }

  const hasSiteSettings = validateSiteSettings(data.siteSettings, errors);
  const hasSiteTheme =
    data.siteTheme === undefined ||
    (isObject(data.siteTheme) && isString(data.siteTheme.themeName));
  if (data.siteTheme !== undefined && !hasSiteTheme) {
    errors.push("siteTheme ma nieprawidłowy format.");
  }

  const pageSections = Array.isArray(data.pageSections) ? data.pageSections : null;
  const categories = Array.isArray(data.categories) ? data.categories : null;
  const dishes = Array.isArray(data.dishes) ? data.dishes : null;

  if (!pageSections) errors.push("Brak tablicy pageSections.");
  if (!categories) errors.push("Brak tablicy categories.");
  if (!dishes) errors.push("Brak tablicy dishes.");

  pageSections?.forEach((section, index) => validatePageSection(section, index, errors));
  categories?.forEach((category, index) => validateCategory(category, index, errors));
  dishes?.forEach((dish, index) => validateDish(dish, index, errors));

  return {
    valid: errors.length === 0,
    errors,
    exportedAt,
    pageSections: pageSections?.length ?? 0,
    categories: categories?.length ?? 0,
    dishes: dishes?.length ?? 0,
    hasSiteSettings,
    hasSiteTheme: data.siteTheme !== undefined && hasSiteTheme,
  };
}

export function assertValidBackup(data: unknown): asserts data is IlPrimoBackup {
  const preview = previewBackupData(data);
  if (!preview.valid) {
    throw new Error(preview.errors.join(" "));
  }
}

export function formatBackupDate(date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

export function getBackupFilename(date = new Date()): string {
  return `il-primo-backup-${formatBackupDate(date)}.json`;
}
