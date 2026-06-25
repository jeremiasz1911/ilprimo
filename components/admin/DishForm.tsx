"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Category, Dish } from "@/lib/types";
import { PLACEHOLDER_DISH_IMAGE } from "@/lib/constants";

interface DishFormProps {
  categories: Category[];
  initial?: Dish;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function linesToArray(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export default function DishForm({ categories, initial }: DishFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [categoryId, setCategoryId] = useState(
    initial?.categoryId ?? categories[0]?.id ?? "",
  );
  const [price, setPrice] = useState(initial?.price ?? "");
  const [shortDescription, setShortDescription] = useState(
    initial?.shortDescription ?? "",
  );
  const [longDescription, setLongDescription] = useState(
    initial?.longDescription ?? "",
  );
  const [ingredients, setIngredients] = useState(
    initial?.ingredients.join("\n") ?? "",
  );
  const [allergens, setAllergens] = useState(
    initial?.allergens.join("\n") ?? "",
  );
  const [image, setImage] = useState(initial?.image ?? "");
  const [order, setOrder] = useState(initial?.order ?? 0);
  const [isVegetarian, setIsVegetarian] = useState(
    initial?.isVegetarian ?? false,
  );
  const [isSpicy, setIsSpicy] = useState(initial?.isSpicy ?? false);
  const [isGlutenFree, setIsGlutenFree] = useState(
    initial?.isGlutenFree ?? false,
  );
  const [isAvailable, setIsAvailable] = useState(initial?.isAvailable ?? true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const sortedCategories = [...categories].sort((a, b) => a.order - b.order);

  if (sortedCategories.length === 0) {
    return (
      <div className="rounded-sm border border-amber-400/30 bg-amber-400/5 p-6">
        <p className="text-amber-300">Najpierw dodaj kategorię.</p>
        <Link
          href="/admin/categories/new"
          className="mt-4 inline-block text-sm text-amber-400 hover:text-amber-300"
        >
          Dodaj kategorię →
        </Link>
      </div>
    );
  }

  async function handleImageUpload(file: File) {
    setUploading(true);
    setError("");
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    });

    setUploading(false);

    if (!response.ok) {
      const data = await response.json();
      setError(data.error || "Nie udało się przesłać zdjęcia.");
      return;
    }

    const data = await response.json();
    setImage(data.url);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      id: initial?.id ?? (slug || slugify(name)),
      slug: slug || slugify(name),
      categoryId,
      name,
      price,
      shortDescription,
      longDescription,
      ingredients: linesToArray(ingredients),
      allergens: linesToArray(allergens),
      image: image || PLACEHOLDER_DISH_IMAGE,
      order: Number(order),
      isVegetarian,
      isSpicy,
      isGlutenFree,
      isAvailable,
    };

    const response = await fetch("/api/admin/dishes", {
      method: initial ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(initial ? { ...payload, id: initial.id } : payload),
    });

    setLoading(false);

    if (!response.ok) {
      const data = await response.json();
      setError(data.error || "Nie udało się zapisać dania.");
      return;
    }

    router.push("/admin/dishes");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm text-stone-400">Nazwa</label>
          <input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (!initial) setSlug(slugify(e.target.value));
            }}
            required
            className="w-full border border-stone-700 bg-stone-900 px-4 py-3 text-white outline-none focus:border-amber-400"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm text-stone-400">Slug</label>
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
            className="w-full border border-stone-700 bg-stone-900 px-4 py-3 text-white outline-none focus:border-amber-400"
          />
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm text-stone-400">Kategoria</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
            className="w-full border border-stone-700 bg-stone-900 px-4 py-3 text-white outline-none focus:border-amber-400"
          >
            {sortedCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-2 block text-sm text-stone-400">Cena</label>
          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="w-full border border-stone-700 bg-stone-900 px-4 py-3 text-white outline-none focus:border-amber-400"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm text-stone-400">
          Krótki opis
        </label>
        <textarea
          value={shortDescription}
          onChange={(e) => setShortDescription(e.target.value)}
          rows={2}
          required
          className="w-full border border-stone-700 bg-stone-900 px-4 py-3 text-white outline-none focus:border-amber-400"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm text-stone-400">
          Długi opis
        </label>
        <textarea
          value={longDescription}
          onChange={(e) => setLongDescription(e.target.value)}
          rows={4}
          required
          className="w-full border border-stone-700 bg-stone-900 px-4 py-3 text-white outline-none focus:border-amber-400"
        />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm text-stone-400">
            Składniki (jeden w linii)
          </label>
          <textarea
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            rows={5}
            className="w-full border border-stone-700 bg-stone-900 px-4 py-3 text-white outline-none focus:border-amber-400"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm text-stone-400">
            Alergeny (jeden w linii)
          </label>
          <textarea
            value={allergens}
            onChange={(e) => setAllergens(e.target.value)}
            rows={5}
            className="w-full border border-stone-700 bg-stone-900 px-4 py-3 text-white outline-none focus:border-amber-400"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm text-stone-400">Zdjęcie</label>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative h-32 w-full overflow-hidden bg-stone-800 sm:w-48">
            <Image
              src={image || PLACEHOLDER_DISH_IMAGE}
              alt="Podgląd dania"
              fill
              className="object-cover"
            />
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleImageUpload(file);
            }}
            className="text-sm text-stone-400"
          />
        </div>
        {uploading && (
          <p className="mt-2 text-sm text-amber-400">Przesyłanie zdjęcia...</p>
        )}
        <input
          value={image}
          onChange={(e) => setImage(e.target.value)}
          placeholder="URL zdjęcia"
          className="mt-3 w-full border border-stone-700 bg-stone-900 px-4 py-3 text-white outline-none focus:border-amber-400"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm text-stone-400">Kolejność</label>
        <input
          type="number"
          value={order}
          onChange={(e) => setOrder(Number(e.target.value))}
          className="w-full border border-stone-700 bg-stone-900 px-4 py-3 text-white outline-none focus:border-amber-400"
        />
      </div>

      <div className="flex flex-wrap gap-4 text-sm text-stone-300">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isVegetarian}
            onChange={(e) => setIsVegetarian(e.target.checked)}
          />
          Wegetariańskie
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isSpicy}
            onChange={(e) => setIsSpicy(e.target.checked)}
          />
          Ostre
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isGlutenFree}
            onChange={(e) => setIsGlutenFree(e.target.checked)}
          />
          Bez glutenu
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isAvailable}
            onChange={(e) => setIsAvailable(e.target.checked)}
          />
          Dostępne w menu
        </label>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="btn-premium disabled:opacity-50"
      >
        {loading ? "Zapisywanie..." : initial ? "Zapisz zmiany" : "Dodaj danie"}
      </button>
    </form>
  );
}
