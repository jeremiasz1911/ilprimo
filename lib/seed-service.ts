import { seedFirestoreFromMenuData } from "@/lib/menu-service";
import { seedDefaultPageStructure } from "@/lib/page-service";

export interface FullSiteSeedResult {
  sections: number;
  settings: boolean;
  categories: number;
  dishes: number;
}

/**
 * Importuje całą domyślną zawartość strony IL PRIMO do Firestore:
 * sekcje strony, ustawienia kontaktowe, kategorie menu i dania.
 * Istniejące dokumenty o tych samych ID zostaną nadpisane.
 */
export async function seedFullSite(): Promise<FullSiteSeedResult> {
  const [pageResult, menuResult] = await Promise.all([
    seedDefaultPageStructure(),
    seedFirestoreFromMenuData(),
  ]);

  return {
    sections: pageResult.sections,
    settings: pageResult.settings,
    categories: menuResult.categories,
    dishes: menuResult.dishes,
  };
}
