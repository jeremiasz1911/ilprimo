"use client";

import { useState } from "react";

export default function FullSeedButton() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSeed() {
    if (
      !confirm(
        "Zaimportować całą stronę do Firestore? Nadpisze sekcje (hero, about, menu, contact), ustawienia, kategorie i dania danymi startowymi.",
      )
    ) {
      return;
    }

    setLoading(true);
    setMessage("");

    const response = await fetch("/api/admin/seed-full", { method: "POST" });
    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setMessage(data.error || "Błąd importu.");
      return;
    }

    setMessage(data.message);
  }

  return (
    <div className="mt-8 rounded-sm border border-amber-400/30 bg-amber-400/5 p-6">
      <h3 className="font-serif text-lg text-white">
        Przywróć domyślną stronę
      </h3>
      <p className="mt-2 text-sm text-stone-400">
        Jednym kliknięciem wrzuca do bazy wszystko, co było na stronie:
        Hero, O nas, Menu, Kontakt, dane kontaktowe, kategorie i 30 dań.
        Treści będą edytowalne w panelu.
      </p>
      <button
        type="button"
        onClick={handleSeed}
        disabled={loading}
        className="mt-4 btn-premium disabled:opacity-50"
      >
        {loading ? "Importowanie..." : "Zaimportuj całą stronę"}
      </button>
      {message && <p className="mt-3 text-sm text-stone-300">{message}</p>}
    </div>
  );
}
