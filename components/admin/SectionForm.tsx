"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { PageSection, PageSectionType } from "@/lib/types";

const SECTION_TYPES: { value: PageSectionType; label: string }[] = [
  { value: "hero", label: "Hero" },
  { value: "about", label: "O nas" },
  { value: "menu", label: "Menu" },
  { value: "contact", label: "Kontakt" },
  { value: "custom", label: "Własna sekcja" },
];

interface SectionFormProps {
  initial?: PageSection;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function SectionForm({ initial }: SectionFormProps) {
  const router = useRouter();
  const [id, setId] = useState(initial?.id ?? "");
  const [type, setType] = useState<PageSectionType>(initial?.type ?? "custom");
  const [title, setTitle] = useState(initial?.title ?? "");
  const [subtitle, setSubtitle] = useState(initial?.subtitle ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [buttonText, setButtonText] = useState(initial?.buttonText ?? "");
  const [buttonLink, setButtonLink] = useState(initial?.buttonLink ?? "");
  const [image, setImage] = useState(initial?.image ?? "");
  const [order, setOrder] = useState(initial?.order ?? 0);
  const [isActive, setIsActive] = useState(initial?.isActive ?? true);
  const [showInNavigation, setShowInNavigation] = useState(
    initial?.showInNavigation ?? false,
  );
  const [navigationLabel, setNavigationLabel] = useState(
    initial?.navigationLabel ?? "",
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const showImage = type === "hero" || type === "about" || type === "custom";
  const showButton = type === "hero" || type === "custom";

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

    const sectionId =
      initial?.id ?? (id || slugify(title) || `section-${Date.now()}`);
    const payload = {
      id: sectionId,
      type,
      title,
      subtitle,
      content,
      buttonText,
      buttonLink,
      image,
      order: Number(order),
      isActive,
      showInNavigation,
      navigationLabel,
    };

    const response = await fetch("/api/admin/sections", {
      method: initial ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setLoading(false);

    if (!response.ok) {
      const data = await response.json();
      setError(data.error || "Nie udało się zapisać sekcji.");
      return;
    }

    router.push("/admin/sections");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        {!initial && (
          <div>
            <label className="mb-2 block text-sm text-stone-400">ID sekcji</label>
            <input
              value={id}
              onChange={(e) => setId(slugify(e.target.value))}
              placeholder="np. about"
              className="w-full border border-stone-700 bg-stone-900 px-4 py-3 text-white outline-none focus:border-amber-400"
            />
            <p className="mt-1 text-xs text-stone-500">
              Używane w linku kotwicy (#about). Bez spacji.
            </p>
          </div>
        )}
        <div>
          <label className="mb-2 block text-sm text-stone-400">Typ sekcji</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as PageSectionType)}
            className="w-full border border-stone-700 bg-stone-900 px-4 py-3 text-white outline-none focus:border-amber-400"
          >
            {SECTION_TYPES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm text-stone-400">Tytuł</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-stone-700 bg-stone-900 px-4 py-3 text-white outline-none focus:border-amber-400"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm text-stone-400">Podtytuł</label>
          <input
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            className="w-full border border-stone-700 bg-stone-900 px-4 py-3 text-white outline-none focus:border-amber-400"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm text-stone-400">Treść</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
          className="w-full border border-stone-700 bg-stone-900 px-4 py-3 text-white outline-none focus:border-amber-400"
        />
        <p className="mt-1 text-xs text-stone-500">
          Akapity oddziel podwójnym enterem. W Hero pierwsza linia to tagline.
        </p>
      </div>

      {showButton && (
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm text-stone-400">
              Tekst przycisku
            </label>
            <input
              value={buttonText}
              onChange={(e) => setButtonText(e.target.value)}
              className="w-full border border-stone-700 bg-stone-900 px-4 py-3 text-white outline-none focus:border-amber-400"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm text-stone-400">
              Link przycisku
            </label>
            <input
              value={buttonLink}
              onChange={(e) => setButtonLink(e.target.value)}
              placeholder="#menu"
              className="w-full border border-stone-700 bg-stone-900 px-4 py-3 text-white outline-none focus:border-amber-400"
            />
          </div>
        </div>
      )}

      {showImage && (
        <div>
          <label className="mb-2 block text-sm text-stone-400">Zdjęcie</label>
          {image && (
            <div className="relative mb-3 h-40 w-full max-w-md overflow-hidden">
              <Image
                src={image}
                alt="Podgląd"
                fill
                className="object-cover"
              />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            disabled={uploading}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleImageUpload(file);
            }}
            className="text-sm text-stone-400"
          />
          <input
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="URL zdjęcia"
            className="mt-2 w-full border border-stone-700 bg-stone-900 px-4 py-3 text-white outline-none focus:border-amber-400"
          />
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm text-stone-400">Kolejność</label>
          <input
            type="number"
            value={order}
            onChange={(e) => setOrder(Number(e.target.value))}
            className="w-full border border-stone-700 bg-stone-900 px-4 py-3 text-white outline-none focus:border-amber-400"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm text-stone-400">
            Etykieta w nawigacji
          </label>
          <input
            value={navigationLabel}
            onChange={(e) => setNavigationLabel(e.target.value)}
            className="w-full border border-stone-700 bg-stone-900 px-4 py-3 text-white outline-none focus:border-amber-400"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm text-stone-300">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="accent-amber-400"
          />
          Sekcja aktywna
        </label>
        <label className="flex items-center gap-2 text-sm text-stone-300">
          <input
            type="checkbox"
            checked={showInNavigation}
            onChange={(e) => setShowInNavigation(e.target.checked)}
            className="accent-amber-400"
          />
          Pokaż w nawigacji
        </label>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="btn-premium disabled:opacity-50"
      >
        {loading ? "Zapisywanie..." : initial ? "Zapisz zmiany" : "Dodaj sekcję"}
      </button>
    </form>
  );
}
