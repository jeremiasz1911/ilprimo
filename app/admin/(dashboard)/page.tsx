import Link from "next/link";
import FullSeedButton from "@/components/admin/FullSeedButton";
import SeedButton from "@/components/admin/SeedButton";
import PageSeedButton from "@/components/admin/PageSeedButton";
import {
  getAllCategories,
  getAllDishes,
} from "@/lib/menu-service";
import { getAllPageSections } from "@/lib/page-service";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [categories, dishes, sections] = await Promise.all([
    getAllCategories(),
    getAllDishes(),
    getAllPageSections(),
  ]);

  return (
    <div>
      <p className="text-xs tracking-[0.3em] text-amber-400 uppercase">
        Panel administracyjny
      </p>
      <h2 className="mt-2 font-serif text-3xl text-white sm:text-4xl">
        Witaj w CMS IL PRIMO
      </h2>
      <p className="mt-4 max-w-2xl text-sm text-stone-400 sm:text-base">
        Zarządzaj sekcjami strony, menu, kategoriami i ustawieniami restauracji.
        Zmiany pojawią się na stronie publicznej po zapisaniu w Firestore.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="border border-stone-800 bg-stone-900/50 p-6">
          <p className="text-sm text-stone-400">Sekcje strony</p>
          <p className="mt-2 font-serif text-4xl text-amber-400">
            {sections.length}
          </p>
          <Link
            href="/admin/sections"
            className="mt-4 inline-block text-sm text-stone-300 hover:text-amber-400"
          >
            Zarządzaj sekcjami →
          </Link>
        </div>
        <div className="border border-stone-800 bg-stone-900/50 p-6">
          <p className="text-sm text-stone-400">Kategorie menu</p>
          <p className="mt-2 font-serif text-4xl text-amber-400">
            {categories.length}
          </p>
          <Link
            href="/admin/categories"
            className="mt-4 inline-block text-sm text-stone-300 hover:text-amber-400"
          >
            Zarządzaj kategoriami →
          </Link>
        </div>
        <div className="border border-stone-800 bg-stone-900/50 p-6">
          <p className="text-sm text-stone-400">Dania</p>
          <p className="mt-2 font-serif text-4xl text-amber-400">
            {dishes.length}
          </p>
          <Link
            href="/admin/dishes"
            className="mt-4 inline-block text-sm text-stone-300 hover:text-amber-400"
          >
            Zarządzaj daniami →
          </Link>
        </div>
      </div>

      <FullSeedButton />
      <details className="mt-6">
        <summary className="cursor-pointer text-sm text-stone-500 hover:text-stone-300">
          Importy częściowe
        </summary>
        <PageSeedButton />
        <SeedButton />
      </details>
    </div>
  );
}
