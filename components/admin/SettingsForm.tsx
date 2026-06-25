"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { SiteSettings } from "@/lib/types";
import { DEFAULT_LOGO } from "@/lib/constants";

interface SettingsFormProps {
  initial: SiteSettings;
}

export default function SettingsForm({ initial }: SettingsFormProps) {
  const router = useRouter();
  const [restaurantName, setRestaurantName] = useState(initial.restaurantName);
  const [address, setAddress] = useState(initial.address);
  const [phone, setPhone] = useState(initial.phone);
  const [email, setEmail] = useState(initial.email);
  const [facebookUrl, setFacebookUrl] = useState(initial.facebookUrl);
  const [instagramUrl, setInstagramUrl] = useState(initial.instagramUrl);
  const [footerText, setFooterText] = useState(initial.footerText);
  const [logo, setLogo] = useState(initial.logo || DEFAULT_LOGO);
  const [copyrightText, setCopyrightText] = useState(initial.copyrightText);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function handleLogoUpload(file: File) {
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
      setError(data.error || "Nie udało się przesłać logo.");
      return;
    }

    const data = await response.json();
    setLogo(data.url);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const response = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        restaurantName,
        address,
        phone,
        email,
        facebookUrl,
        instagramUrl,
        footerText,
        logo,
        copyrightText,
      }),
    });

    setLoading(false);

    if (!response.ok) {
      const data = await response.json();
      setError(data.error || "Nie udało się zapisać ustawień.");
      return;
    }

    setSuccess("Ustawienia zapisane.");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="mb-2 block text-sm text-stone-400">
          Nazwa restauracji
        </label>
        <input
          value={restaurantName}
          onChange={(e) => setRestaurantName(e.target.value)}
          required
          className="w-full border border-stone-700 bg-stone-900 px-4 py-3 text-white outline-none focus:border-amber-400"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm text-stone-400">Adres</label>
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          rows={2}
          className="w-full border border-stone-700 bg-stone-900 px-4 py-3 text-white outline-none focus:border-amber-400"
        />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm text-stone-400">Telefon</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border border-stone-700 bg-stone-900 px-4 py-3 text-white outline-none focus:border-amber-400"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm text-stone-400">E-mail</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-stone-700 bg-stone-900 px-4 py-3 text-white outline-none focus:border-amber-400"
          />
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm text-stone-400">Facebook URL</label>
          <input
            value={facebookUrl}
            onChange={(e) => setFacebookUrl(e.target.value)}
            className="w-full border border-stone-700 bg-stone-900 px-4 py-3 text-white outline-none focus:border-amber-400"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm text-stone-400">
            Instagram URL
          </label>
          <input
            value={instagramUrl}
            onChange={(e) => setInstagramUrl(e.target.value)}
            className="w-full border border-stone-700 bg-stone-900 px-4 py-3 text-white outline-none focus:border-amber-400"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm text-stone-400">
          Tekst stopki (opcjonalny)
        </label>
        <textarea
          value={footerText}
          onChange={(e) => setFooterText(e.target.value)}
          rows={3}
          className="w-full border border-stone-700 bg-stone-900 px-4 py-3 text-white outline-none focus:border-amber-400"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm text-stone-400">Copyright</label>
        <input
          value={copyrightText}
          onChange={(e) => setCopyrightText(e.target.value)}
          className="w-full border border-stone-700 bg-stone-900 px-4 py-3 text-white outline-none focus:border-amber-400"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm text-stone-400">Logo</label>
        {logo && (
          <div className="relative mb-3 h-16 w-48">
            <Image src={logo} alt="Logo" fill className="object-contain" />
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          disabled={uploading}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleLogoUpload(file);
          }}
          className="text-sm text-stone-400"
        />
        <input
          value={logo}
          onChange={(e) => setLogo(e.target.value)}
          className="mt-2 w-full border border-stone-700 bg-stone-900 px-4 py-3 text-white outline-none focus:border-amber-400"
        />
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}
      {success && <p className="text-sm text-green-400">{success}</p>}

      <button
        type="submit"
        disabled={loading}
        className="btn-premium disabled:opacity-50"
      >
        {loading ? "Zapisywanie..." : "Zapisz ustawienia"}
      </button>
    </form>
  );
}
