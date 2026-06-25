"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { PageSection } from "@/lib/types";

const TYPE_LABELS: Record<PageSection["type"], string> = {
  hero: "Hero",
  about: "O nas",
  menu: "Menu",
  contact: "Kontakt",
  custom: "Własna",
};

export default function SectionsPage() {
  const [sections, setSections] = useState<PageSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadSections() {
    const response = await fetch("/api/admin/sections");
    const data = await response.json();
    setSections(data);
    setLoading(false);
  }

  useEffect(() => {
    void loadSections();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Usunąć tę sekcję?")) return;
    setError("");

    const response = await fetch(`/api/admin/sections?id=${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const data = await response.json();
      setError(data.error || "Nie udało się usunąć sekcji.");
      return;
    }

    await loadSections();
  }

  async function moveSection(id: string, direction: "up" | "down") {
    const sorted = [...sections].sort((a, b) => a.order - b.order);
    const index = sorted.findIndex((section) => section.id === id);
    const neighborIndex = direction === "up" ? index - 1 : index + 1;

    if (index < 0 || neighborIndex < 0 || neighborIndex >= sorted.length) {
      return;
    }

    const current = sorted[index];
    const neighbor = sorted[neighborIndex];

    await Promise.all([
      fetch("/api/admin/sections", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...current, order: neighbor.order }),
      }),
      fetch("/api/admin/sections", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...neighbor, order: current.order }),
      }),
    ]);

    await loadSections();
  }

  async function toggleActive(section: PageSection) {
    await fetch("/api/admin/sections", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...section, isActive: !section.isActive }),
    });
    await loadSections();
  }

  const sorted = [...sections].sort((a, b) => a.order - b.order);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-serif text-3xl text-white">Sekcje strony</h2>
          <p className="mt-2 text-sm text-stone-400">
            Zarządzaj treścią i kolejnością sekcji na stronie głównej.
          </p>
        </div>
        <Link href="/admin/sections/new" className="btn-premium text-center">
          Dodaj sekcję
        </Link>
      </div>

      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

      <div className="mt-8 overflow-x-auto">
        {loading ? (
          <p className="text-stone-400">Ładowanie...</p>
        ) : sorted.length === 0 ? (
          <p className="text-stone-400">
            Brak sekcji. Użyj przycisku na stronie START, aby utworzyć domyślną
            strukturę.
          </p>
        ) : (
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-stone-800 text-stone-400">
                <th className="py-3 pr-4">Kolejność</th>
                <th className="py-3 pr-4">ID</th>
                <th className="py-3 pr-4">Typ</th>
                <th className="py-3 pr-4">Tytuł</th>
                <th className="py-3 pr-4">Nav</th>
                <th className="py-3 pr-4">Status</th>
                <th className="py-3">Akcje</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((section, index) => (
                <tr key={section.id} className="border-b border-stone-800/60">
                  <td className="py-4 pr-4">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => moveSection(section.id, "up")}
                        className="px-2 text-stone-400 hover:text-amber-400 disabled:opacity-30"
                        aria-label="Przesuń w górę"
                      >
                        ↑
                      </button>
                      <span className="text-stone-300">{section.order}</span>
                      <button
                        type="button"
                        disabled={index === sorted.length - 1}
                        onClick={() => moveSection(section.id, "down")}
                        className="px-2 text-stone-400 hover:text-amber-400 disabled:opacity-30"
                        aria-label="Przesuń w dół"
                      >
                        ↓
                      </button>
                    </div>
                  </td>
                  <td className="py-4 pr-4 text-stone-300">{section.id}</td>
                  <td className="py-4 pr-4 text-stone-300">
                    {TYPE_LABELS[section.type]}
                  </td>
                  <td className="py-4 pr-4 text-white">{section.title || "—"}</td>
                  <td className="py-4 pr-4 text-stone-300">
                    {section.showInNavigation
                      ? section.navigationLabel || section.title
                      : "—"}
                  </td>
                  <td className="py-4 pr-4">
                    <button
                      type="button"
                      onClick={() => toggleActive(section)}
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        section.isActive
                          ? "bg-green-400/10 text-green-400"
                          : "bg-stone-800 text-stone-400"
                      }`}
                    >
                      {section.isActive ? "Aktywna" : "Ukryta"}
                    </button>
                  </td>
                  <td className="py-4">
                    <div className="flex gap-3">
                      <Link
                        href={`/admin/sections/${section.id}`}
                        className="text-amber-400 hover:text-amber-300"
                      >
                        Edytuj
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(section.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        Usuń
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
