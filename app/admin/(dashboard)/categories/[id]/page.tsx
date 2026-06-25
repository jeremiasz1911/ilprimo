import Link from "next/link";
import { notFound } from "next/navigation";
import CategoryForm from "@/components/admin/CategoryForm";
import { getCategoryById } from "@/lib/menu-service";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCategoryPage({ params }: PageProps) {
  const { id } = await params;
  const category = await getCategoryById(id);

  if (!category) notFound();

  return (
    <div>
      <Link
        href="/admin/categories"
        className="text-sm text-stone-400 hover:text-amber-400"
      >
        ← Wróć do kategorii
      </Link>
      <h2 className="mt-4 font-serif text-3xl text-white">Edytuj kategorię</h2>
      <div className="mt-8 max-w-xl">
        <CategoryForm initial={category} />
      </div>
    </div>
  );
}
