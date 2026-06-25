import SiteHeader from "@/components/SiteHeader";
import NotFoundContent from "@/components/NotFoundContent";

export default function MenuDishNotFound() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-stone-950 pt-16 sm:pt-20">
        <NotFoundContent
          title="Danie nie znalezione"
          description="Ta pozycja menu nie istnieje, została ukryta albo adres zawiera nieprawidłowy zapis."
        />
      </main>
    </>
  );
}
