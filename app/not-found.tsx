import SiteHeader from "@/components/SiteHeader";
import NotFoundContent from "@/components/NotFoundContent";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-stone-950 pt-16 sm:pt-20">
        <NotFoundContent
          title="Strona nie istnieje"
          description="Adres mógł się zmienić albo strona została usunięta. Wróć do menu lub na stronę główną."
        />
      </main>
    </>
  );
}
