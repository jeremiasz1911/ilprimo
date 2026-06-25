import Link from "next/link";
import DishForm from "@/components/admin/DishForm";
import { getAllCategories } from "@/lib/menu-service";

export const dynamic = "force-dynamic";

export default async function NewDishPage() {
  const categories = await getAllCategories();

  return (
    <div>
      <Link
        href="/admin/dishes"
        className="text-sm text-stone-400 hover:text-amber-400"
      >
        ← Wróć do dań
      </Link>
      <h2 className="mt-4 font-serif text-3xl text-white">Dodaj danie</h2>
      <div className="mt-8 max-w-3xl">
        {categories.length === 0 ? (
          <div className="rounded-sm border border-amber-400/30 bg-amber-400/5 p-6">
            <p className="text-amber-300">Najpierw dodaj kategorię.</p>
            <Link
              href="/admin/categories/new"
              className="mt-4 inline-block text-sm text-amber-400 hover:text-amber-300"
            >
              Dodaj kategorię →
            </Link>
          </div>
        ) : (
          <DishForm categories={categories} />
        )}
      </div>
    </div>
  );
}
