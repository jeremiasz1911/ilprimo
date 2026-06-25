"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Category, Dish } from "@/lib/types";
import { PLACEHOLDER_DISH_IMAGE } from "@/lib/constants";

function DishRow({
  dish,
  onDelete,
}: {
  dish: Dish;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="flex flex-col gap-4 border border-stone-800 bg-stone-900/40 p-4 sm:flex-row sm:items-center">
      <div className="relative h-24 w-full shrink-0 overflow-hidden sm:h-20 sm:w-28">
        <Image
          src={dish.image || PLACEHOLDER_DISH_IMAGE}
          alt={dish.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-serif text-xl text-white">{dish.name}</h3>
          {!dish.isAvailable && (
            <span className="rounded-full bg-stone-800 px-2 py-0.5 text-xs text-stone-400">
              Niedostępne
            </span>
          )}
        </div>
        <p className="mt-1 text-sm text-stone-400">{dish.price}</p>
      </div>
      <div className="flex gap-3">
        <Link
          href={`/admin/dishes/${dish.id}`}
          className="text-amber-400 hover:text-amber-300"
        >
          Edytuj
        </Link>
        <button
          type="button"
          onClick={() => onDelete(dish.id)}
          className="text-red-400 hover:text-red-300"
        >
          Usuń
        </button>
      </div>
    </div>
  );
}

export default function DishesPage() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  async function loadData() {
    const [dishesRes, categoriesRes] = await Promise.all([
      fetch("/api/admin/dishes"),
      fetch("/api/admin/categories"),
    ]);
    setDishes(await dishesRes.json());
    setCategories(await categoriesRes.json());
    setLoading(false);
  }

  useEffect(() => {
    void loadData();
  }, []);

  const sortedCategories = useMemo(
    () => [...categories].sort((a, b) => a.order - b.order),
    [categories],
  );

  const filteredDishes = useMemo(() => {
    const sorted = [...dishes].sort((a, b) => a.order - b.order);
    if (filter === "all") return sorted;
    return sorted.filter((dish) => dish.categoryId === filter);
  }, [dishes, filter]);

  const groupedDishes = useMemo(() => {
    if (filter !== "all") return [];

    return sortedCategories
      .map((category) => ({
        category,
        dishes: dishes
          .filter((dish) => dish.categoryId === category.id)
          .sort((a, b) => a.order - b.order),
      }))
      .filter((group) => group.dishes.length > 0);
  }, [dishes, filter, sortedCategories]);

  async function handleDelete(id: string) {
    if (!confirm("Usunąć to danie?")) return;
    await fetch(`/api/admin/dishes?id=${id}`, { method: "DELETE" });
    await loadData();
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-serif text-3xl text-white">Dania</h2>
          <p className="mt-2 text-sm text-stone-400">
            Zarządzaj pozycjami menu restauracji.
          </p>
        </div>
        {categories.length > 0 ? (
          <Link href="/admin/dishes/new" className="btn-premium text-center">
            Dodaj danie
          </Link>
        ) : (
          <Link
            href="/admin/categories/new"
            className="btn-premium text-center"
          >
            Dodaj kategorię
          </Link>
        )}
      </div>

      {categories.length === 0 ? (
        <div className="mt-8 rounded-sm border border-amber-400/30 bg-amber-400/5 p-6">
          <p className="text-amber-300">Najpierw dodaj kategorię.</p>
          <Link
            href="/admin/categories/new"
            className="mt-4 inline-block text-sm text-amber-400 hover:text-amber-300"
          >
            Przejdź do kategorii →
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-8 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={`px-4 py-2 text-sm tracking-wide transition-colors ${
                filter === "all"
                  ? "bg-amber-400 text-black"
                  : "border border-stone-700 text-stone-300 hover:border-amber-400 hover:text-amber-400"
              }`}
            >
              Wszystkie
            </button>
            {sortedCategories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => setFilter(category.id)}
                className={`px-4 py-2 text-sm tracking-wide transition-colors ${
                  filter === category.id
                    ? "bg-amber-400 text-black"
                    : "border border-stone-700 text-stone-300 hover:border-amber-400 hover:text-amber-400"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          <div className="mt-8">
            {loading ? (
              <p className="text-stone-400">Ładowanie...</p>
            ) : filter === "all" ? (
              groupedDishes.length === 0 ? (
                <p className="text-stone-400">Brak dań.</p>
              ) : (
                <div className="space-y-10">
                  {groupedDishes.map(({ category, dishes: groupDishes }) => (
                    <section key={category.id}>
                      <h3 className="mb-4 border-b border-stone-800 pb-3 font-serif text-xl tracking-wide text-amber-400 uppercase">
                        {category.name}
                      </h3>
                      <div className="grid gap-4">
                        {groupDishes.map((dish) => (
                          <DishRow
                            key={dish.id}
                            dish={dish}
                            onDelete={handleDelete}
                          />
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
              )
            ) : filteredDishes.length === 0 ? (
              <p className="text-stone-400">Brak dań w tej kategorii.</p>
            ) : (
              <div className="grid gap-4">
                {filteredDishes.map((dish) => (
                  <DishRow
                    key={dish.id}
                    dish={dish}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
