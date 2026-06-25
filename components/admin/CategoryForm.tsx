"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Category } from "@/lib/types";
import { slugify } from "@/lib/slugify";

interface CategoryFormProps {
  initial?: Category;
}

export default function CategoryForm({ initial }: CategoryFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [order, setOrder] = useState(initial?.order ?? 0);
  const [isActive, setIsActive] = useState(initial?.isActive ?? true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      id: initial?.id ?? slug,
      name,
      slug: slug || slugify(name),
      order: Number(order),
      isActive,
    };

    const response = await fetch("/api/admin/categories", {
      method: initial ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(initial ? { ...payload, id: initial.id } : payload),
    });

    setLoading(false);

    if (!response.ok) {
      const data = await response.json();
      setError(data.error || "Nie udało się zapisać kategorii.");
      return;
    }

    router.push("/admin/categories");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
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
      <div>
        <label className="mb-2 block text-sm text-stone-400">Kolejność</label>
        <input
          type="number"
          value={order}
          onChange={(e) => setOrder(Number(e.target.value))}
          className="w-full border border-stone-700 bg-stone-900 px-4 py-3 text-white outline-none focus:border-amber-400"
        />
      </div>
      <label className="flex items-center gap-2 text-sm text-stone-300">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
        />
        Aktywna na stronie publicznej
      </label>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="btn-premium disabled:opacity-50"
      >
        {loading ? "Zapisywanie..." : initial ? "Zapisz zmiany" : "Dodaj kategorię"}
      </button>
    </form>
  );
}
