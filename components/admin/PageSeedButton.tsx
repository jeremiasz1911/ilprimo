"use client";

import { useState } from "react";

export default function PageSeedButton() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSeed() {
    if (
      !confirm(
        "Utworzyć domyślną strukturę strony? Istniejące sekcje (hero, about, menu, contact) i ustawienia zostaną nadpisane.",
      )
    ) {
      return;
    }

    setLoading(true);
    setMessage("");

    const response = await fetch("/api/admin/seed-page", { method: "POST" });
    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setMessage(data.error || "Błąd tworzenia struktury.");
      return;
    }

    setMessage(data.message);
  }

  return (
    <div className="mt-4 rounded-sm border border-stone-800 bg-stone-900/50 p-6">
      <h3 className="font-serif text-lg text-white">Struktura strony</h3>
      <p className="mt-2 text-sm text-stone-400">
        Dodaje sekcje Hero, O nas, Menu, Kontakt oraz domyślne ustawienia
        kontaktowe.
      </p>
      <button
        type="button"
        onClick={handleSeed}
        disabled={loading}
        className="mt-4 border border-amber-400/50 px-5 py-2 text-sm tracking-[0.1em] text-amber-400 transition-colors hover:bg-amber-400/10 disabled:opacity-50"
      >
        {loading ? "Tworzenie..." : "Utwórz domyślną strukturę strony"}
      </button>
      {message && <p className="mt-3 text-sm text-stone-300">{message}</p>}
    </div>
  );
}
