import AppearancePanel from "@/components/admin/AppearancePanel";
import { getSiteTheme } from "@/lib/theme-service";

export const dynamic = "force-dynamic";

export default async function AppearancePage() {
  const theme = await getSiteTheme();

  return (
    <div>
      <h2 className="font-serif text-3xl text-white">Wygląd strony</h2>
      <p className="mt-2 text-sm text-stone-400">
        Motyw, kolory, przyciski, animacje i układ menu — zapisywane w Firestore
        (siteTheme/main).
      </p>
      <div className="mt-8">
        <AppearancePanel initial={theme} />
      </div>
    </div>
  );
}
