import Link from "next/link";
import SectionForm from "@/components/admin/SectionForm";

export default function NewSectionPage() {
  return (
    <div>
      <Link
        href="/admin/sections"
        className="text-sm text-stone-400 hover:text-amber-400"
      >
        ← Wróć do sekcji
      </Link>
      <h2 className="mt-4 font-serif text-3xl text-white">Dodaj sekcję</h2>
      <div className="mt-8 max-w-3xl">
        <SectionForm />
      </div>
    </div>
  );
}
