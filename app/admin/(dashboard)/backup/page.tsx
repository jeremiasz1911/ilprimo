import BackupPanel from "@/components/admin/BackupPanel";

export default function BackupPage() {
  return (
    <div>
      <h2 className="font-serif text-3xl text-white">Backup</h2>
      <p className="mt-2 max-w-2xl text-sm text-stone-400">
        Pobierz kopię zapasową treści strony lub przywróć dane z pliku JSON.
        Backup obejmuje teksty i linki do zdjęć — bez plików ze Storage.
      </p>
      <div className="mt-8 max-w-3xl">
        <BackupPanel />
      </div>
    </div>
  );
}
