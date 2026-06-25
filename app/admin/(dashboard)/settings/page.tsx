import SettingsForm from "@/components/admin/SettingsForm";
import { getSiteSettings } from "@/lib/page-service";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div>
      <h2 className="font-serif text-3xl text-white">Ustawienia</h2>
      <p className="mt-2 text-sm text-stone-400">
        Dane kontaktowe, logo i treści stopki wyświetlane na stronie publicznej.
      </p>
      <div className="mt-8 max-w-3xl">
        <SettingsForm initial={settings} />
      </div>
    </div>
  );
}
