"use client";

import { useRef, useState } from "react";
import {
  getBackupFilename,
  previewBackupData,
  type BackupPreview,
  type IlPrimoBackup,
} from "@/lib/backup-validation";

export default function BackupPanel() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<BackupPreview | null>(null);
  const [backupData, setBackupData] = useState<IlPrimoBackup | null>(null);
  const [selectedFileName, setSelectedFileName] = useState("");

  async function handleDownload() {
    setDownloading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/admin/backup");
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Nie udało się pobrać backupu.");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = getBackupFilename();
      link.click();
      URL.revokeObjectURL(url);
      setMessage("Backup JSON został pobrany.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Błąd pobierania backupu.");
    } finally {
      setDownloading(false);
    }
  }

  async function handleFileSelect(file: File | null) {
    setError("");
    setMessage("");
    setConfirmed(false);
    setPreview(null);
    setBackupData(null);
    setSelectedFileName("");

    if (!file) return;

    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as unknown;
      const nextPreview = previewBackupData(parsed);

      setSelectedFileName(file.name);
      setPreview(nextPreview);

      if (nextPreview.valid) {
        setBackupData(parsed as IlPrimoBackup);
      }
    } catch {
      setError("Nie udało się odczytać pliku JSON.");
    }
  }

  async function handleImport() {
    if (!backupData || !preview?.valid) {
      setError("Najpierw wybierz poprawny plik backupu.");
      return;
    }

    if (!confirmed) {
      setError("Zaznacz potwierdzenie nadpisania danych.");
      return;
    }

    setImporting(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/admin/backup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(backupData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Nie udało się zaimportować backupu.");
      }

      setMessage(data.message);
      setPreview(null);
      setBackupData(null);
      setConfirmed(false);
      setSelectedFileName("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Błąd importu backupu.");
    } finally {
      setImporting(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="rounded-sm border border-amber-400/30 bg-amber-400/5 p-5">
        <p className="text-sm text-amber-200">
          Backup JSON nie zawiera fizycznych plików zdjęć z Firebase Storage.
          Zawiera tylko linki do zdjęć.
        </p>
      </div>

      <section className="rounded-sm border border-stone-800 bg-stone-900/50 p-6">
        <h3 className="font-serif text-xl text-white">Pobierz backup</h3>
        <p className="mt-2 text-sm text-stone-400">
          Eksportuje ustawienia strony, sekcje, kategorie i dania do pliku JSON.
        </p>
        <button
          type="button"
          onClick={handleDownload}
          disabled={downloading}
          className="btn-premium mt-5 disabled:opacity-50"
        >
          {downloading ? "Przygotowywanie..." : "Pobierz backup JSON"}
        </button>
      </section>

      <section className="rounded-sm border border-stone-800 bg-stone-900/50 p-6">
        <h3 className="font-serif text-xl text-white">Importuj backup JSON</h3>
        <p className="mt-2 text-sm text-stone-400">
          Wybierz plik backupu, sprawdź podgląd i przywróć dane do Firestore.
        </p>

        <input
          ref={fileInputRef}
          type="file"
          accept="application/json,.json"
          onChange={(event) => handleFileSelect(event.target.files?.[0] ?? null)}
          className="mt-5 block w-full text-sm text-stone-400 file:mr-4 file:border file:border-amber-400/50 file:bg-transparent file:px-4 file:py-2 file:text-sm file:text-amber-400 hover:file:bg-amber-400/10"
        />

        {selectedFileName && (
          <p className="mt-3 text-sm text-stone-500">
            Wybrany plik: {selectedFileName}
          </p>
        )}

        {preview && (
          <div className="mt-6 rounded-sm border border-stone-800 bg-black/40 p-5">
            <h4 className="text-sm tracking-[0.15em] text-amber-400 uppercase">
              Podgląd backupu
            </h4>
            <ul className="mt-4 space-y-2 text-sm text-stone-300">
              <li>Sekcje strony: {preview.pageSections}</li>
              <li>Kategorie: {preview.categories}</li>
              <li>Dania: {preview.dishes}</li>
              <li>
                Ustawienia strony:{" "}
                {preview.hasSiteSettings ? "tak" : "brak / błąd"}
              </li>
              {preview.exportedAt && (
                <li>
                  Data eksportu:{" "}
                  {new Date(preview.exportedAt).toLocaleString("pl-PL")}
                </li>
              )}
            </ul>

            {preview.valid ? (
              <p className="mt-4 text-sm text-green-400">
                Plik wygląda poprawnie i można go zaimportować.
              </p>
            ) : (
              <div className="mt-4">
                <p className="text-sm text-red-400">
                  Plik zawiera błędy i nie może zostać zaimportowany:
                </p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-red-300">
                  {preview.errors.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {preview?.valid && (
          <label className="mt-6 flex items-start gap-3 text-sm text-stone-300">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(event) => setConfirmed(event.target.checked)}
              className="mt-1 accent-amber-400"
            />
            <span>Rozumiem, że obecne dane mogą zostać nadpisane.</span>
          </label>
        )}

        <button
          type="button"
          onClick={handleImport}
          disabled={importing || !preview?.valid || !confirmed}
          className="mt-5 border border-amber-400/50 px-5 py-2 text-sm tracking-[0.1em] text-amber-400 transition-colors hover:bg-amber-400/10 disabled:opacity-50"
        >
          {importing ? "Importowanie..." : "Importuj backup JSON"}
        </button>
      </section>

      {error && <p className="text-sm text-red-400">{error}</p>}
      {message && <p className="text-sm text-stone-300">{message}</p>}
    </div>
  );
}
