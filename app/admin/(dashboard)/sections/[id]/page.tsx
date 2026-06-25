import Link from "next/link";
import { notFound } from "next/navigation";
import SectionForm from "@/components/admin/SectionForm";
import { getPageSectionById } from "@/lib/page-service";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditSectionPage({ params }: PageProps) {
  const { id } = await params;
  const section = await getPageSectionById(id);

  if (!section) notFound();

  return (
    <div>
      <Link
        href="/admin/sections"
        className="text-sm text-stone-400 hover:text-amber-400"
      >
        ← Wróć do sekcji
      </Link>
      <h2 className="mt-4 font-serif text-3xl text-white">Edytuj sekcję</h2>
      <div className="mt-8 max-w-3xl">
        <SectionForm initial={section} />
      </div>
    </div>
  );
}
