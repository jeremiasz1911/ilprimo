"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Category } from "@/lib/types";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadCategories() {
    const response = await fetch("/api/admin/categories");
    const data = await response.json();
    setCategories(data);
    setLoading(false);
  }

  useEffect(() => {
    void loadCategories();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Usunąć tę kategorię?")) return;
    setError("");

    const response = await fetch(`/api/admin/categories?id=${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const data = await response.json();
      setError(data.error || "Nie udało się usunąć kategorii.");
      return;
    }

    await loadCategories();
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-serif text-3xl text-white">Kategorie</h2>
          <p className="mt-2 text-sm text-stone-400">
            Dodawaj, edytuj i usuwaj kategorie menu.
          </p>
        </div>
        <Link href="/admin/categories/new" className="btn-premium text-center">
          Dodaj kategorię
        </Link>
      </div>

      {error && (
        <p className="mt-4 rounded-sm border border-red-400/30 bg-red-400/5 p-4 text-sm text-red-300">
          {error}
        </p>
      )}

      <div className="mt-8 overflow-x-auto border border-stone-800">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-stone-900 text-stone-400">
            <tr>
              <th className="px-4 py-3">Nazwa</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Kolejność</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Akcje</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-stone-400">
                  Ładowanie...
                </td>
              </tr>
            ) : categories.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-stone-400">
                  Brak kategorii.
                </td>
              </tr>
            ) : (
              [...categories]
                .sort((a, b) => a.order - b.order)
                .map((category) => (
                  <tr key={category.id} className="border-t border-stone-800">
                    <td className="px-4 py-3 text-white">{category.name}</td>
                    <td className="px-4 py-3 text-stone-400">{category.slug}</td>
                    <td className="px-4 py-3 text-stone-400">{category.order}</td>
                    <td className="px-4 py-3">
                      <span
                        className={
                          category.isActive
                            ? "text-emerald-400"
                            : "text-stone-500"
                        }
                      >
                        {category.isActive ? "Aktywna" : "Ukryta"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-3">
                        <Link
                          href={`/admin/categories/${category.id}`}
                          className="text-amber-400 hover:text-amber-300"
                        >
                          Edytuj
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(category.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          Usuń
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
