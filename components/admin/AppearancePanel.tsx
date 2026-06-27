"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { SiteTheme } from "@/lib/types";
import { THEME_PRESETS } from "@/lib/theme-presets";
import { themeToCssVariables } from "@/lib/theme-css";
import { getButtonClassName } from "@/lib/theme-button";

const TABS = [
  { id: "theme", label: "Motyw" },
  { id: "colors", label: "Kolory" },
  { id: "buttons", label: "Przyciski" },
  { id: "animations", label: "Animacje" },
  { id: "layout", label: "Układ sekcji" },
  { id: "menu", label: "Menu dań" },
  { id: "responsive", label: "Mobile / Desktop" },
] as const;

type TabId = (typeof TABS)[number]["id"];

interface AppearancePanelProps {
  initial: SiteTheme;
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const isHex = /^#[0-9A-Fa-f]{6}$/.test(value);

  return (
    <div>
      <label className="mb-2 block text-sm text-stone-400">{label}</label>
      <div className="flex gap-2">
        <input
          type="color"
          value={isHex ? value : "#000000"}
          onChange={(e) => onChange(e.target.value)}
          className="h-11 w-14 cursor-pointer border border-stone-700 bg-stone-900"
        />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 border border-stone-700 bg-stone-900 px-4 py-3 text-white outline-none focus:border-amber-400"
        />
      </div>
    </div>
  );
}

function SelectField<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm text-stone-400">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="w-full border border-stone-700 bg-stone-900 px-4 py-3 text-white outline-none focus:border-amber-400"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function CheckboxField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-sm text-stone-300">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="accent-amber-400"
      />
      {label}
    </label>
  );
}

function ThemePreview({ theme }: { theme: SiteTheme }) {
  const cssVars = useMemo(() => themeToCssVariables(theme), [theme]);
  const style = cssVars as React.CSSProperties;

  return (
    <div className="border border-stone-800 bg-stone-950 p-6">
      <p className="mb-4 text-xs tracking-[0.2em] text-stone-500 uppercase">
        Podgląd zmian
      </p>
      <div
        className="space-y-6 rounded border p-6"
        style={{
          ...style,
          backgroundColor: theme.backgroundColor,
          color: theme.textColor,
          borderColor: theme.borderColor,
          borderRadius:
            theme.borderRadius === "large"
              ? "1rem"
              : theme.borderRadius === "medium"
                ? "0.5rem"
                : theme.borderRadius === "small"
                  ? "0.25rem"
                  : "0",
        }}
      >
        <div>
          <p className="theme-heading text-lg" style={{ color: theme.accentColor }}>
            {theme.themeName}
          </p>
          <p className="mt-1 text-sm" style={{ color: theme.mutedTextColor }}>
            Przykładowa sekcja z motywem strony.
          </p>
        </div>

        <div
          className="overflow-hidden border"
          style={{
            backgroundColor: theme.cardBackgroundColor,
            borderColor: theme.borderColor,
            borderRadius:
              theme.borderRadius === "large" ? "0.75rem" : "0.25rem",
          }}
        >
          <div
            className="h-28"
            style={{
              background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.accentColor})`,
            }}
          />
          <div className="p-4 text-left">
            <div className="flex items-start justify-between gap-3">
              <h4 className="theme-heading text-base">Tagliatelle al Tartufo</h4>
              {theme.menuCardShowPrice && (
                <span style={{ color: theme.accentColor }}>89 zł</span>
              )}
            </div>
            {theme.menuCardShowDescription && (
              <p className="mt-2 text-xs" style={{ color: theme.mutedTextColor }}>
                Świeży makaron z czarnym truflem i parmezanem.
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <span className={getButtonClassName(theme)}>Przycisk główny</span>
          <span
            className="inline-block border px-4 py-2 text-xs tracking-[0.15em]"
            style={{
              borderColor: theme.borderColor,
              color: theme.buttonSecondaryTextColor,
              backgroundColor: theme.buttonSecondaryColor,
              borderRadius:
                theme.buttonStyle === "rounded" ? "9999px" : "0.25rem",
            }}
          >
            Przycisk drugi
          </span>
        </div>
      </div>
    </div>
  );
}

export default function AppearancePanel({ initial }: AppearancePanelProps) {
  const [theme, setTheme] = useState<SiteTheme>(initial);
  const [tab, setTab] = useState<TabId>("theme");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function patch(partial: Partial<SiteTheme>) {
    setTheme((current) => ({ ...current, ...partial }));
  }

  async function handleSave() {
    setLoading(true);
    setError("");
    setMessage("");

    const response = await fetch("/api/admin/theme", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(theme),
    });

    setLoading(false);

    if (!response.ok) {
      const data = await response.json();
      setError(data.error || "Nie udało się zapisać motywu.");
      return;
    }

    const saved = await response.json();
    setTheme(saved);
    setMessage("Motyw został zapisany.");
  }

  async function handleReset() {
    if (!confirm("Przywrócić domyślny motyw Premium Italian?")) return;

    setLoading(true);
    setError("");
    setMessage("");

    const response = await fetch("/api/admin/theme", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "reset" }),
    });

    setLoading(false);

    if (!response.ok) {
      const data = await response.json();
      setError(data.error || "Nie udało się przywrócić motywu.");
      return;
    }

    const saved = await response.json();
    setTheme(saved);
    setMessage("Przywrócono domyślny motyw.");
  }

  async function handlePreset(name: string) {
    setLoading(true);
    setError("");
    setMessage("");

    const response = await fetch("/api/admin/theme", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "preset", presetName: name }),
    });

    setLoading(false);

    if (!response.ok) {
      const data = await response.json();
      setError(data.error || "Nie udało się zastosować presetu.");
      return;
    }

    const saved = await response.json();
    setTheme(saved);
    setMessage(`Zastosowano preset: ${name}. Możesz go dalej edytować ręcznie.`);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 border-b border-stone-800 pb-4">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={`px-4 py-2 text-xs tracking-[0.15em] transition-colors ${
              tab === item.id
                ? "bg-amber-400/10 text-amber-400"
                : "text-stone-400 hover:text-white"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="grid gap-8 xl:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          {tab === "theme" && (
            <div className="space-y-4">
              <p className="text-sm text-stone-400">
                Wybierz gotowy preset — kolory i style możesz potem zmienić
                ręcznie w pozostałych zakładkach.
              </p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {Object.keys(THEME_PRESETS).map((name) => (
                  <button
                    key={name}
                    type="button"
                    disabled={loading}
                    onClick={() => void handlePreset(name)}
                    className={`border px-4 py-4 text-left transition-colors ${
                      theme.themeName === name
                        ? "border-amber-400 bg-amber-400/10 text-amber-400"
                        : "border-stone-700 text-stone-300 hover:border-stone-500"
                    }`}
                  >
                    <span className="block text-sm font-medium">{name}</span>
                    <span className="mt-1 block text-xs text-stone-500">
                      Kliknij, aby zastosować
                    </span>
                  </button>
                ))}
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                <SelectField
                  label="Czcionka nagłówków"
                  value={theme.fontHeading}
                  options={[
                    { value: "serif", label: "Szeryfowa (elegancka)" },
                    { value: "sans", label: "Bezszeryfowa (nowoczesna)" },
                  ]}
                  onChange={(fontHeading) => patch({ fontHeading })}
                />
                <SelectField
                  label="Czcionka treści"
                  value={theme.fontBody}
                  options={[
                    { value: "sans", label: "Bezszeryfowa" },
                    { value: "serif", label: "Szeryfowa" },
                  ]}
                  onChange={(fontBody) => patch({ fontBody })}
                />
                <SelectField
                  label="Charakter strony"
                  value={theme.pageCharacter}
                  options={[
                    { value: "elegant", label: "Elegancki" },
                    { value: "modern", label: "Nowoczesny" },
                    { value: "warm", label: "Ciepły" },
                  ]}
                  onChange={(pageCharacter) => patch({ pageCharacter })}
                />
                <SelectField
                  label="Styl kart"
                  value={theme.cardStyle}
                  options={[
                    { value: "photo", label: "Zdjęciowy" },
                    { value: "flat", label: "Płaski" },
                    { value: "bordered", label: "Z obramowaniem" },
                  ]}
                  onChange={(cardStyle) => patch({ cardStyle })}
                />
                <SelectField
                  label="Styl zdjęć"
                  value={theme.imageStyle}
                  options={[
                    { value: "cinematic", label: "Filmowy" },
                    { value: "natural", label: "Naturalny" },
                    { value: "bright", label: "Jasny" },
                  ]}
                  onChange={(imageStyle) => patch({ imageStyle })}
                />
              </div>
            </div>
          )}

          {tab === "colors" && (
            <div className="grid gap-5 md:grid-cols-2">
              <ColorField
                label="Kolor główny"
                value={theme.primaryColor}
                onChange={(primaryColor) => patch({ primaryColor })}
              />
              <ColorField
                label="Kolor akcentu"
                value={theme.accentColor}
                onChange={(accentColor) => patch({ accentColor })}
              />
              <ColorField
                label="Kolor tła"
                value={theme.backgroundColor}
                onChange={(backgroundColor) => patch({ backgroundColor })}
              />
              <ColorField
                label="Kolor tekstu"
                value={theme.textColor}
                onChange={(textColor) => patch({ textColor })}
              />
              <ColorField
                label="Tekst przygaszony"
                value={theme.mutedTextColor}
                onChange={(mutedTextColor) => patch({ mutedTextColor })}
              />
              <ColorField
                label="Kolor navbaru"
                value={theme.navbarBackgroundColor}
                onChange={(navbarBackgroundColor) =>
                  patch({ navbarBackgroundColor })
                }
              />
              <ColorField
                label="Kolor stopki"
                value={theme.footerBackgroundColor}
                onChange={(footerBackgroundColor) =>
                  patch({ footerBackgroundColor })
                }
              />
              <ColorField
                label="Kolor kart"
                value={theme.cardBackgroundColor}
                onChange={(cardBackgroundColor) =>
                  patch({ cardBackgroundColor })
                }
              />
              <ColorField
                label="Kolor przycisków (tło)"
                value={theme.buttonPrimaryColor}
                onChange={(buttonPrimaryColor) => patch({ buttonPrimaryColor })}
              />
              <ColorField
                label="Kolor tekstu przycisków"
                value={theme.buttonPrimaryTextColor}
                onChange={(buttonPrimaryTextColor) =>
                  patch({ buttonPrimaryTextColor })
                }
              />
              <ColorField
                label="Kolor obramowań"
                value={theme.borderColor}
                onChange={(borderColor) => patch({ borderColor })}
              />
            </div>
          )}

          {tab === "buttons" && (
            <div className="grid gap-5 md:grid-cols-2">
              <SelectField
                label="Styl przycisku"
                value={theme.buttonStyle}
                options={[
                  { value: "premium", label: "Premium" },
                  { value: "outline", label: "Outline" },
                  { value: "filled", label: "Filled" },
                  { value: "rounded", label: "Rounded" },
                  { value: "minimal", label: "Minimal" },
                ]}
                onChange={(buttonStyle) => patch({ buttonStyle })}
              />
              <SelectField
                label="Zaokrąglenie"
                value={theme.borderRadius}
                options={[
                  { value: "none", label: "Brak" },
                  { value: "small", label: "Małe" },
                  { value: "medium", label: "Średnie" },
                  { value: "large", label: "Duże" },
                ]}
                onChange={(borderRadius) => patch({ borderRadius })}
              />
              <ColorField
                label="Tło przycisku głównego"
                value={theme.buttonPrimaryColor}
                onChange={(buttonPrimaryColor) => patch({ buttonPrimaryColor })}
              />
              <ColorField
                label="Tekst przycisku głównego"
                value={theme.buttonPrimaryTextColor}
                onChange={(buttonPrimaryTextColor) =>
                  patch({ buttonPrimaryTextColor })
                }
              />
              <ColorField
                label="Tło przycisku drugiego"
                value={theme.buttonSecondaryColor}
                onChange={(buttonSecondaryColor) =>
                  patch({ buttonSecondaryColor })
                }
              />
              <ColorField
                label="Tekst przycisku drugiego"
                value={theme.buttonSecondaryTextColor}
                onChange={(buttonSecondaryTextColor) =>
                  patch({ buttonSecondaryTextColor })
                }
              />
              <div className="md:col-span-2">
                <CheckboxField
                  label="Efekt hover na przyciskach i kartach (globalnie)"
                  checked={theme.enableHoverEffects}
                  onChange={(enableHoverEffects) => patch({ enableHoverEffects })}
                />
              </div>
            </div>
          )}

          {tab === "animations" && (
            <div className="space-y-5">
              <CheckboxField
                label="Włącz animacje"
                checked={theme.enableAnimations}
                onChange={(enableAnimations) => patch({ enableAnimations })}
              />
              <CheckboxField
                label="Włącz parallax (hero)"
                checked={theme.enableParallax}
                onChange={(enableParallax) => patch({ enableParallax })}
              />
              <CheckboxField
                label="Włącz złoty glow za myszką (desktop)"
                checked={theme.enableMouseGlow}
                onChange={(enableMouseGlow) => patch({ enableMouseGlow })}
              />
              <CheckboxField
                label="Włącz hover na kartach menu"
                checked={theme.enableHoverEffects}
                onChange={(enableHoverEffects) => patch({ enableHoverEffects })}
              />
              <CheckboxField
                label="Włącz fade-in sekcji przy scrollu"
                checked={theme.enableSectionReveal}
                onChange={(enableSectionReveal) => patch({ enableSectionReveal })}
              />
              <SelectField
                label="Intensywność animacji"
                value={theme.animationIntensity}
                options={[
                  { value: "none", label: "Brak" },
                  { value: "subtle", label: "Subtelna" },
                  { value: "normal", label: "Normalna" },
                  { value: "strong", label: "Mocna" },
                ]}
                onChange={(animationIntensity) => patch({ animationIntensity })}
              />
              <p className="text-xs text-stone-500">
                Na urządzeniach mobilnych animacje są automatycznie ograniczane
                dla lepszej wydajności.
              </p>
            </div>
          )}

          {tab === "layout" && (
            <div className="space-y-5">
              <p className="text-sm text-stone-400">
                Globalne ustawienia układu. Indywidualny układ każdej sekcji
                edytujesz w{" "}
                <Link href="/admin/sections" className="text-amber-400 hover:underline">
                  Sekcjach strony
                </Link>
                .
              </p>
              <div className="grid gap-5 md:grid-cols-2">
                <SelectField
                  label="Odstępy między sekcjami"
                  value={theme.sectionSpacing}
                  options={[
                    { value: "compact", label: "Kompaktowe" },
                    { value: "comfortable", label: "Komfortowe" },
                    { value: "spacious", label: "Przestronne" },
                  ]}
                  onChange={(sectionSpacing) => patch({ sectionSpacing })}
                />
                <SelectField
                  label="Odstępy między kartami"
                  value={theme.cardSpacing}
                  options={[
                    { value: "small", label: "Małe" },
                    { value: "medium", label: "Średnie" },
                    { value: "large", label: "Duże" },
                  ]}
                  onChange={(cardSpacing) => patch({ cardSpacing })}
                />
                <div>
                  <label className="mb-2 block text-sm text-stone-400">
                    Maks. szerokość treści
                  </label>
                  <input
                    value={theme.maxWidth}
                    onChange={(e) => patch({ maxWidth: e.target.value })}
                    placeholder="1200px"
                    className="w-full border border-stone-700 bg-stone-900 px-4 py-3 text-white outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>
          )}

          {tab === "menu" && (
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm text-stone-400">
                  Kolumny desktop
                </label>
                <input
                  type="number"
                  min={1}
                  max={4}
                  value={theme.menuGridDesktop}
                  onChange={(e) =>
                    patch({ menuGridDesktop: Number(e.target.value) || 1 })
                  }
                  className="w-full border border-stone-700 bg-stone-900 px-4 py-3 text-white outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm text-stone-400">
                  Kolumny tablet
                </label>
                <input
                  type="number"
                  min={1}
                  max={3}
                  value={theme.menuGridTablet}
                  onChange={(e) =>
                    patch({ menuGridTablet: Number(e.target.value) || 1 })
                  }
                  className="w-full border border-stone-700 bg-stone-900 px-4 py-3 text-white outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm text-stone-400">
                  Kolumny mobile
                </label>
                <input
                  type="number"
                  min={1}
                  max={2}
                  value={theme.menuGridMobile}
                  onChange={(e) =>
                    patch({ menuGridMobile: Number(e.target.value) || 1 })
                  }
                  className="w-full border border-stone-700 bg-stone-900 px-4 py-3 text-white outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm text-stone-400">
                  Proporcje zdjęcia (desktop)
                </label>
                <input
                  value={theme.menuCardImageRatio}
                  onChange={(e) => patch({ menuCardImageRatio: e.target.value })}
                  placeholder="4/5"
                  className="w-full border border-stone-700 bg-stone-900 px-4 py-3 text-white outline-none focus:border-amber-400"
                />
              </div>
              <SelectField
                label="Styl karty menu"
                value={theme.menuCardStyle}
                options={[
                  { value: "album", label: "Album" },
                  { value: "elegant", label: "Elegant" },
                  { value: "minimal", label: "Minimal" },
                  { value: "overlay", label: "Overlay" },
                  { value: "classic", label: "Classic" },
                ]}
                onChange={(menuCardStyle) => patch({ menuCardStyle })}
              />
              <SelectField
                label="Wyrównanie tekstu"
                value={theme.menuCardTextAlign}
                options={[
                  { value: "left", label: "Lewo" },
                  { value: "center", label: "Środek" },
                  { value: "right", label: "Prawo" },
                ]}
                onChange={(menuCardTextAlign) => patch({ menuCardTextAlign })}
              />
              <CheckboxField
                label="Pokazuj opis"
                checked={theme.menuCardShowDescription}
                onChange={(menuCardShowDescription) =>
                  patch({ menuCardShowDescription })
                }
              />
              <CheckboxField
                label="Pokazuj cenę"
                checked={theme.menuCardShowPrice}
                onChange={(menuCardShowPrice) => patch({ menuCardShowPrice })}
              />
              <CheckboxField
                label="Pokazuj alergeny"
                checked={theme.menuCardShowAllergens}
                onChange={(menuCardShowAllergens) =>
                  patch({ menuCardShowAllergens })
                }
              />
            </div>
          )}

          {tab === "responsive" && (
            <div className="grid gap-5 md:grid-cols-2">
              <SelectField
                label="Styl navbaru mobile"
                value={theme.mobileNavbarStyle}
                options={[
                  { value: "hamburger", label: "Hamburger (góra)" },
                  { value: "bottom-sheet", label: "Bottom sheet" },
                  { value: "simple", label: "Prosty (rozwijany)" },
                ]}
                onChange={(mobileNavbarStyle) => patch({ mobileNavbarStyle })}
              />
              <SelectField
                label="Odstępy sekcji na mobile"
                value={theme.mobileSectionSpacing}
                options={[
                  { value: "compact", label: "Kompaktowe" },
                  { value: "comfortable", label: "Komfortowe" },
                  { value: "spacious", label: "Przestronne" },
                ]}
                onChange={(mobileSectionSpacing) =>
                  patch({ mobileSectionSpacing })
                }
              />
              <div>
                <label className="mb-2 block text-sm text-stone-400">
                  Proporcje zdjęć na mobile
                </label>
                <input
                  value={theme.mobileImageRatio}
                  onChange={(e) => patch({ mobileImageRatio: e.target.value })}
                  placeholder="4/3"
                  className="w-full border border-stone-700 bg-stone-900 px-4 py-3 text-white outline-none focus:border-amber-400"
                />
              </div>
              <p className="md:col-span-2 text-xs text-stone-500">
                Siatka menu: desktop {theme.menuGridDesktop} / tablet{" "}
                {theme.menuGridTablet} / mobile {theme.menuGridMobile} kolumn.
              </p>
            </div>
          )}

          {error && <p className="text-sm text-red-400">{error}</p>}
          {message && <p className="text-sm text-emerald-400">{message}</p>}

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              disabled={loading}
              onClick={() => void handleSave()}
              className="btn-premium disabled:opacity-50"
            >
              {loading ? "Zapisywanie..." : "Zapisz zmiany"}
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => void handleReset()}
              className="border border-stone-700 px-6 py-3 text-sm tracking-[0.15em] text-stone-300 transition-colors hover:border-stone-500 hover:text-white disabled:opacity-50"
            >
              Przywróć domyślny motyw
            </button>
          </div>
        </div>

        <ThemePreview theme={theme} />
      </div>
    </div>
  );
}
