"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type {
  BackgroundType,
  ContentWidth,
  LayoutVariant,
  PageSection,
  PageSectionType,
  SpacingSize,
  TextAlign,
} from "@/lib/types";
import { getDefaultSectionLayout } from "@/lib/section-layout";
import { slugify } from "@/lib/slugify";

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
  const defaults = getDefaultSectionLayout();
  const [layoutVariant, setLayoutVariant] = useState<LayoutVariant>(
    initial?.layoutVariant ?? defaults.layoutVariant,
  );
  const [backgroundType, setBackgroundType] = useState<BackgroundType>(
    initial?.backgroundType ?? defaults.backgroundType,
  );
  const [backgroundColor, setBackgroundColor] = useState(
    initial?.backgroundColor ?? "",
  );
  const [textAlign, setTextAlign] = useState<TextAlign>(
    initial?.textAlign ?? defaults.textAlign,
  );
  const [imagePosition, setImagePosition] = useState<
    "left" | "right" | "center"
  >(initial?.imagePosition ?? defaults.imagePosition);
  const [contentWidth, setContentWidth] = useState<ContentWidth>(
    initial?.contentWidth ?? defaults.contentWidth,
  );
  const [paddingTop, setPaddingTop] = useState<SpacingSize>(
    initial?.paddingTop ?? defaults.paddingTop,
  );
  const [paddingBottom, setPaddingBottom] = useState<SpacingSize>(
    initial?.paddingBottom ?? defaults.paddingBottom,
  );
  const [isFullWidth, setIsFullWidth] = useState(
    initial?.isFullWidth ?? defaults.isFullWidth,
  );
  const [hideOnMobile, setHideOnMobile] = useState(
    initial?.hideOnMobile ?? defaults.hideOnMobile,
  );
  const [hideOnDesktop, setHideOnDesktop] = useState(
    initial?.hideOnDesktop ?? defaults.hideOnDesktop,
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
      layoutVariant,
      backgroundType,
      backgroundColor,
      textAlign,
      imagePosition,
      contentWidth,
      paddingTop,
      paddingBottom,
      isFullWidth,
      hideOnMobile,
      hideOnDesktop,
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

      <div className="border border-stone-800 p-5">
        <h3 className="mb-4 text-sm tracking-[0.15em] text-amber-400 uppercase">
          Układ sekcji
        </h3>
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm text-stone-400">
              Wariant układu
            </label>
            <select
              value={layoutVariant}
              onChange={(e) =>
                setLayoutVariant(e.target.value as LayoutVariant)
              }
              className="w-full border border-stone-700 bg-stone-900 px-4 py-3 text-white outline-none focus:border-amber-400"
            >
              <option value="default">Domyślny</option>
              <option value="image-left">Obraz po lewej</option>
              <option value="image-right">Obraz po prawej</option>
              <option value="centered">Wyśrodkowany</option>
              <option value="split">Podział 50/50</option>
              <option value="full-hero">Pełny hero</option>
              <option value="simple-text">Prosty tekst</option>
              <option value="gallery">Galeria</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm text-stone-400">
              Tło sekcji
            </label>
            <select
              value={backgroundType}
              onChange={(e) =>
                setBackgroundType(e.target.value as BackgroundType)
              }
              className="w-full border border-stone-700 bg-stone-900 px-4 py-3 text-white outline-none focus:border-amber-400"
            >
              <option value="default">Domyślne (z motywu)</option>
              <option value="color">Kolor własny</option>
              <option value="image">Obraz</option>
              <option value="dark">Ciemne</option>
              <option value="light">Jasne</option>
            </select>
          </div>
          {backgroundType === "color" && (
            <div>
              <label className="mb-2 block text-sm text-stone-400">
                Kolor tła
              </label>
              <input
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                placeholder="#111111"
                className="w-full border border-stone-700 bg-stone-900 px-4 py-3 text-white outline-none focus:border-amber-400"
              />
            </div>
          )}
          <div>
            <label className="mb-2 block text-sm text-stone-400">
              Wyrównanie tekstu
            </label>
            <select
              value={textAlign}
              onChange={(e) => setTextAlign(e.target.value as TextAlign)}
              className="w-full border border-stone-700 bg-stone-900 px-4 py-3 text-white outline-none focus:border-amber-400"
            >
              <option value="left">Lewo</option>
              <option value="center">Środek</option>
              <option value="right">Prawo</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm text-stone-400">
              Pozycja obrazu
            </label>
            <select
              value={imagePosition}
              onChange={(e) =>
                setImagePosition(e.target.value as "left" | "right" | "center")
              }
              className="w-full border border-stone-700 bg-stone-900 px-4 py-3 text-white outline-none focus:border-amber-400"
            >
              <option value="left">Lewo</option>
              <option value="center">Środek</option>
              <option value="right">Prawo</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm text-stone-400">
              Szerokość treści
            </label>
            <select
              value={contentWidth}
              onChange={(e) =>
                setContentWidth(e.target.value as ContentWidth)
              }
              className="w-full border border-stone-700 bg-stone-900 px-4 py-3 text-white outline-none focus:border-amber-400"
            >
              <option value="narrow">Wąska</option>
              <option value="default">Domyślna</option>
              <option value="wide">Szeroka</option>
              <option value="full">Pełna</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm text-stone-400">
              Padding góra
            </label>
            <select
              value={paddingTop}
              onChange={(e) => setPaddingTop(e.target.value as SpacingSize)}
              className="w-full border border-stone-700 bg-stone-900 px-4 py-3 text-white outline-none focus:border-amber-400"
            >
              <option value="compact">Kompaktowy</option>
              <option value="small">Mały</option>
              <option value="medium">Średni</option>
              <option value="comfortable">Komfortowy</option>
              <option value="large">Duży</option>
              <option value="spacious">Przestronny</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm text-stone-400">
              Padding dół
            </label>
            <select
              value={paddingBottom}
              onChange={(e) =>
                setPaddingBottom(e.target.value as SpacingSize)
              }
              className="w-full border border-stone-700 bg-stone-900 px-4 py-3 text-white outline-none focus:border-amber-400"
            >
              <option value="compact">Kompaktowy</option>
              <option value="small">Mały</option>
              <option value="medium">Średni</option>
              <option value="comfortable">Komfortowy</option>
              <option value="large">Duży</option>
              <option value="spacious">Przestronny</option>
            </select>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-sm text-stone-300">
            <input
              type="checkbox"
              checked={isFullWidth}
              onChange={(e) => setIsFullWidth(e.target.checked)}
              className="accent-amber-400"
            />
            Pełna szerokość
          </label>
          <label className="flex items-center gap-2 text-sm text-stone-300">
            <input
              type="checkbox"
              checked={hideOnMobile}
              onChange={(e) => setHideOnMobile(e.target.checked)}
              className="accent-amber-400"
            />
            Ukryj na mobile
          </label>
          <label className="flex items-center gap-2 text-sm text-stone-300">
            <input
              type="checkbox"
              checked={hideOnDesktop}
              onChange={(e) => setHideOnDesktop(e.target.checked)}
              className="accent-amber-400"
            />
            Ukryj na desktop
          </label>
        </div>
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
